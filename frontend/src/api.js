import apiBase from './apiBase.js';

const apiURL = 'https://gf20ixt8zj.execute-api.us-west-2.amazonaws.com/Main/';

const DEFINITION = {
  addRecord: {
    method: 'POST',
    url: `${apiURL}add-record`
  },
  deleteRecord: {
    method: 'POST',
    url: `${apiURL}delete-record`
  },  
  getRecords: {
    method: 'POST',
    url: `${apiURL}get-records`
  }
};

const api = {
  addRecord: (values) => apiBase({ source: DEFINITION.addRecord, values }),
  deleteRecord: (values) => apiBase({ source: DEFINITION.deleteRecord, values }),
  getRecords: (values) => apiBase({ source: DEFINITION.getRecords, values })
};

export default api;
