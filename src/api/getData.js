import axios from 'axios';

export function getData(data) {
  console.log('data :', data);
  const api_config = {
    method: data.method || 'post',
    baseURL: data.baseURL,

    transformRequest: [
      function (data1) {
        if (data.type) {
          return JSON.stringify({...data1});
        }
        if (data1 != undefined) {
          var formData = new FormData();
          for (var i in data1) {
            formData.append(i, data1[i]);
          }
          // console.log("api response :", data1);
          return formData;
        }
      },
    ],
    transformResponse: [
      function (data) {
        return data;
      },
    ],
    headers: {
      'Content-Type': data.type || 'multipart/form-data',
      Authorization: data.token || '',
      responseType: data.responseType || 'json',
      ...data.header,
    },

    validateStatus: function (status) {
      return status;
    },
    ...data,
  };
  return axios(api_config)
    .then(response => {
      return response;
    })
    .catch(error => {
      if (error.response) {
        return {status: error.response.status, message: error.message};
      } else {
        return {status: 500, message: 'time out please try again'};
      }
    });
}
