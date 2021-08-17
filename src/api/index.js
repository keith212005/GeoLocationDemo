import NetInfo from '@react-native-community/netinfo';

import {getData} from './getData';

import axios from 'axios';
var flag = true;

export function callApi(api_inputs) {
  return new Promise((resolve, reject) => {
    flag = true;
    return NetInfo.addEventListener(state => {
      if (flag) {
        if (state.isConnected) {
          var api_container = [];
          flag = false;
          api_inputs.map((item, index) => {
            api_container.push(getData(item));

            if (index == api_inputs.length - 1) {
              axios.all(api_container).then(
                axios.spread((...response) => {
                  // console.log("axios spread response>>>", response);
                  handleApiResponse(response)
                    .then(value => {
                      resolve(value);
                    })
                    .catch(error => {
                      reject(error);
                    });
                }),
              );
            }
          });
        } else {
          // alert("No internet Connection");
          reject({
            message: 'Network Not Available',
            status_code: 501,
          });
        }
      }
    });
  });
}

function handleApiResponse(response) {
  return new Promise((resolve, reject) => {
    var api_response = [];

    //check if any api return server error or not
    const is_success = response.every((val, index) => {
      if (val.status == 200) {
        //check if any api return api side error or not

        if (val.headers['content-type'] == 'application/pdf') {
          api_response = val.request._response;
        } else {
          const data = JSON.parse(val.data);
          api_response.push(data);
        }
        return true;
      } else {
        if (val.data != undefined) {
          const data = JSON.parse(val.data);
          reject(data);
        }
        return false;
      }
    });

    Promise.all(is_success).then(() => resolve(api_response));
  });
}
