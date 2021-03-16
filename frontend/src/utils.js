import axios from "axios";
import {defaultSchema} from "./AddSchema/utis";

const login = ({email, password}) => {
  const formData = new FormData();
  formData.set('username', email);
  formData.set('password', password);
  axios.post(
    '/accounts/login/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': getCSRFToken()
      },
    },
  )
    .then((response) => {
      console.log(JSON.stringify(response));
      console.log(response.data);
      localStorage.setItem("userToken", response.data.access_token);
    })
    .catch((error) => console.log(error));
}

const getCSRFToken = () => {
  return document.querySelector('[name=csrfmiddlewaretoken]').value;
}


const isEmpty = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object;
const setLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const getLocal = key => {
  const val = localStorage.getItem(key);
  if (key === 'schemas' && val === null)
    return defaultSchema;

  if (val === null)
    return '';

  return JSON.parse(val);
}

const delLocal = key => localStorage.removeItem(key);

let inject = (str, obj) => str.replace(/\${(.*?)}/g, (x, g) => obj[g]);

export {login, getCSRFToken, isEmpty, setLocal, getLocal, inject, delLocal};
