import axios from 'axios'

export const getRequest = async url => {
  const request = axios.get(url)
  return request.then(response => response.data)
}

export const getRequestById = async (url, id) => {
  const request = axios.get(`${url}/${id}`)
  return request.then(response => response.data)
}

export const postRequest = async (url, requestData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  return axios
    .post(url, requestData, config)
    .then((response) => {
      const { data } = response
      return data
    })
}

export const postRequestRUC = async (url, requestData) => {
  const config = {
    mode: 'no-cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  return axios
    .post(url, requestData, config)
    .then((response) => {
      const { data } = response
      return data
    })
}

export const putRequest = async (url, requestData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  return axios
    .put(`${url}/${requestData.id}`, requestData, config)
    .then((response) => {
      const { data } = response
      return data
    })
}

export const putRequestChangePassword = async (url, requestData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  return axios
    .put(`${url}/${requestData.id}`, requestData, config)
    .then((response) => {
      const { data } = response
      return data
    })
}
