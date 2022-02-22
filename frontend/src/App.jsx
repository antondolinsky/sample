import { useState } from 'react';

import api from './api.js';
import AddRecord from './AddRecord.jsx';
import GetRecords from './GetRecords.jsx';

const MODES = {
  ADD: 'ADD',
  GET: 'GET',
  ADD_SUCCESS: 'ADD_SUCCESS',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
  ERROR: 'ERROR'
};

const ModeSelect = ({
  state,
  setState
}) => (
  <div data-modeselect>
    <ModeSelectButton mode={MODES.ADD} state={state} setState={setState} text="Add a Record" />
    <ModeSelectButton mode={MODES.GET} state={state} setState={setState} text="View Records" />          
  </div>
);

const ModeSelectButton = ({
  state,
  setState,
  mode,
  text
}) => (
  <button data-button data-modeselect-button={mode} onClick={() => setState({ ...state, mode })}>{text}</button>
);

const App = () => {
  const [state, setState] = useState({ mode: MODES.ADD, error: null, records: [], password: null, passwordValid: false, recordExpanded: null });
  const update = async (stateMixin) => {
    try {
      const getRecordsApiResult = await api.getRecords({ Password: state.password });
      const records = JSON.parse(getRecordsApiResult);
      setState({ ...state, ...stateMixin, records, passwordValid: true });
    } catch (err) {
      setState( { ...state, ...stateMixin, mode: MODES.ERROR, error: err, passwordValid: false });
    }
  };
  const onAddSuccess = () => {
    if (state.passwordValid) {
      update({ ...state, mode: MODES.ADD_SUCCESS, error: null });
    } else {
      setState({ ...state, mode: MODES.ADD_SUCCESS, error: null });
    }
  };
  const onDeleteSuccess = () => update({ ...state, mode: MODES.DELETE_SUCCESS, error: null });
  const onError = (err) => setState({ ...state, mode: MODES.ERROR, error: err });
  if (state.mode === MODES.ADD || state.mode === MODES.GET) {
    return (
      <div data-app data-mode={state.mode}>
        <ModeSelect state={state} setState={setState} />
        <div data-show={state.mode === MODES.ADD}>
          <AddRecord onAddSuccess={onAddSuccess} onError={onError} />
        </div>
        <div data-show={state.mode === MODES.GET}>
          <GetRecords state={state} setState={setState} update={update} onDeleteSuccess={onDeleteSuccess} onError={onError} />
        </div>
      </div>
    );
  }
  if (state.mode === MODES.ADD_SUCCESS) {
    return (
      <div data-app data-mode={state.mode}>
        <div>Record has been successfully added</div>
        <button data-standardbutton onClick={() => setState({ ...state, mode: MODES.ADD, error: null })}>Ok</button>
      </div>
    );
  }
  if (state.mode === MODES.DELETE_SUCCESS) {
    return (
      <div data-app data-mode={state.mode}>
        <div>Record has been successfully deleted</div>
        <button data-standardbutton onClick={() => setState({ ...state, mode: MODES.GET, error: null })}>Ok</button>
      </div>
    );
  }
  if (state.mode === MODES.ERROR) {
    return (
      <div data-app data-mode={state.mode}>
        <div>An error has occured while accessing the api</div>
        <div data-errormessage>{state.error.toString()}</div>
        <button data-standardbutton onClick={() => setState({ ...state, mode: MODES.GET, error: null })}>Ok</button>
      </div>
    );
  }  
};

export default App;
