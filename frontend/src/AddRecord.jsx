import api from './api.js';
import util from './util.js';

const Field = ({
  name,
  label,
  type,
  ...rest
}) => (
  <div data-field>
    <div data-label>{label}:</div>
    <input type={type} data-input data-name={name} {...rest}></input>
  </div>
);

const AddRecord = ({
  onAddSuccess,
  onError
}) => {
  const onAdd = async (event) => {
    event.preventDefault();
    const inputs = Array.from(document.querySelectorAll('[data-add-record] input')).reduce((acc, cur) => (acc[cur.dataset.name] = cur, acc), {});
    const values = {
      Name: inputs['name'].value,
      DateOfBirth: util.timestampFromDateAndTime({ date: inputs['dateOfBirth'].value, time: '00:00' }).toString(),
      PhoneNumber: inputs['phoneNumber'].value,
      Email: inputs['email'].value,
      Address: inputs['address'].value,
      Photo: inputs['photo'].files.length === 0 ? '' : await util.fileToBase64(inputs['photo'].files[0]),
      AppointmentStart: util.timestampFromDateAndTime({ date: inputs['appointmentDate'].value, time: inputs['appointmentTime'].value }).toString(),
      AppointmentDuration: (Number(inputs['appointmentDuration'].value) * 60 * 1000).toString()
    };
    try {
      await api.addRecord(values);
      onAddSuccess();
    } catch (err) {
      onError(err);
    }
  };
  return (
    <form data-add-record>
      <div data-fields>
        <Field name="name" label="Name" type="text" />
        <Field name="dateOfBirth" label="Date of Birth" type="date" />
        <Field name="phoneNumber" label="Phone Number" type="tel" />
        <Field name="email" label="Email" type="email" />
        <Field name="address" label="Address" type="text" />
        <Field name="photo" label="Photo (drivers' license)*" type="file" />
        <Field name="appointmentDate" label="Appointment Date" type="date" />
        <Field name="appointmentTime" label="Appointment Time" type="time" step="1800" />
        <Field name="appointmentDuration" label="Appointment Duration (in minutes)" type="number" min="0" step="30" />
        <div data-note>*Note: photo file size cannot be larger than 400kb</div>
      </div>
      <button type="submit" onClick={onAdd} >Add the New Record</button>
    </form>
  );
}

export default AddRecord;
