import axios from 'axios'
/* export const getRequest = async url => {
  try {
    const response = await fetch(`${url}`)
    const data = await response.json()
    return data
  } catch (e) {
    return e
  }
} */
export const getRequest = async url => {
  const request = axios.get(url)
  return request.then(response => response.data)
}

/* export const getRequestById = async (url, id) => {
  try {
    const response = await fetch(`${url}/${id}`)
    const data = await response.json()
    return data
  } catch (e) {
    return e
  }
} */

export const getRequestById = async (url, id) => {
  const request = axios.get(`${url}/${id}`)
  return request.then(response => response.data)
}

/* export const postRequest = async (url, requestData, token) => {
  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(requestData)
  }
  try {
    const response = await fetch(`${url}`, settings)
    const data = await response.json()
    return data
  } catch (e) {
    return e
  }
} */

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

/* export const putRequest = async (url, requestData, token) => {
  const settings = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(requestData)
  }
  try {
    const response = await fetch(`${url}/${requestData.id}`, settings)
    const data = await response.json()
    return data
  } catch (e) {
    return e
  }
} */

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

/* export const putRequestChangePassword = async (url, requestData, token) => {
  const settings = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(requestData)
  }
  try {
    const response = await fetch(`${url}/${requestData.id}`, settings)
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
    return e
  }
} */

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
