const apiBase = async ({
  source: {
    method,
    url
  },
  values
}) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const requestOptions = {
    method,
    headers,
    redirect: 'follow'
  };
  if (values) {
    requestOptions.body = JSON.stringify(values);
  }
  const fetchResult = await (await fetch(url, requestOptions)).json();
  if (typeof fetchResult === 'object' && 'errorMessage' in fetchResult) {
    throw new Error(JSON.stringify(fetchResult));
  } else {
    return fetchResult;
  }
};

export default apiBase;
