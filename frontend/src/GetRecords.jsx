import api from './api.js';
import util from './util.js';

const timeDisplay = {
  dateOfBirth: (value) => isNaN(value) ? '' : util.timeStampToYMD(value),
  appointmentStart: (value) => isNaN(value) ? '' : util.timeStampToYMDHM(value)
};

const RecordCollapsed = ({
  record,
  state,
  setState,
  remove
}) => (
  <tr onClick={() => setState({ ...state, recordExpanded: record })} data-record data-expanded="false">
    <td>{record.Name}</td>
    <td>{timeDisplay.appointmentStart(record.AppointmentStart)}</td>
    <td>{util.durationToHM(record.AppointmentDuration)}</td>
    <td data-deleterecord onClick={(event) => {
      event.stopPropagation();
      if (window.confirm('Are you sure you want to delete this record?')) {
        remove(record.Id);
      }
    }}>{'\u00D7'}</td>
  </tr>
);

const RecordExpanded = ({
  record,
  state,
  setState
}) => (
  <div data-record data-expanded="true">
    <div data-recordfield><img data-recordphoto src={record.Photo} /></div>    
    <div data-recordfield><span data-recordfield-label>Name</span>{record.Name}</div>
    <div data-recordfield><span data-recordfield-label>Date of Birth</span>{timeDisplay.dateOfBirth(record.DateOfBirth)}</div>
    <div data-recordfield><span data-recordfield-label>Phone Number</span>{record.PhoneNumber}</div>
    <div data-recordfield><span data-recordfield-label>Email</span>{record.Email}</div>
    <div data-recordfield><span data-recordfield-label>Address</span>{record.Address}</div>
    <div data-recordfield><span data-recordfield-label>Appointment Start</span>{timeDisplay.appointmentStart(record.AppointmentStart)}</div>
    <div data-recordfield><span data-recordfield-label>Appointment Duration</span>{util.durationToHM(record.AppointmentDuration)}</div>
  </div>
);

const GetRecords = ({
  state,
  setState,
  update,
  onDeleteSuccess,
  onError
}) => {
  const updatePassword = (value) => setState({ ...state, password: value });
  const remove = async (Id) => {
    try {
      await api.deleteRecord({ Id });
      onDeleteSuccess();
    } catch (err) {
      onError(err);
    }
  };
  if (state.passwordValid) {
    if (state.recordExpanded) {
      return (
        <div data-getrecords data-authorized="true">
          <button data-standardbutton data-widebutton onClick={() => setState({ ...state, recordExpanded: null })}>Return to list of records</button>
          <RecordExpanded record={state.recordExpanded} state={state} setState={setState} />
        </div>
      );
    } else {
      if (state.records.length === 0) {
        return (
          <div data-getrecords data-authorized="true">
            No records found
          </div>
        );
      } else {
        return (
          <div data-getrecords data-authorized="true">
            <div data-expandedlabel>Click on any record to see an expanded view</div>
            <table data-recordstable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Appointment Start</th>
                  <th>Appointment Duration</th>
                </tr>
              </thead>
              <tbody>
                {state.records.sort((a, b) => a.AppointmentStart < b.AppointmentStart ? -1 : 1).map((record) => (
                  <RecordCollapsed key={record.Name} record={record} state={state} setState={setState} remove={remove} />
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
  } else {
    return (
      <div data-getrecords data-authorized="false">
        <div>You must enter a password to view this data:</div>
        <input onChange={(e) => updatePassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && update()} />
        <button onClick={update} data-standardbutton>Ok</button>
      </div>
    );
  }
};

export default GetRecords;
