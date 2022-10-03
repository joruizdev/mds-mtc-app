export const getRequest = async url => {
  try {
    // const response = await fetch(`${process.env.REACT_APP_URL_API}${url}`)
    const response = await fetch(`${url}`)
    const data = await response.json()
    return data
  } catch (e) {
    return e
  }
}

export const getRequestById = async (url, id) => {
  try {
    const response = await fetch(`${url}/${id}`)
    // const response = await fetch(`${process.env.REACT_APP_URL_API}${url}/${id}`)
    const data = await response.json()
    return data
  } catch (e) {
    return e
  }
}

export const postRequestLogin = async (url, requestData) => {
  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  }
  try {
    // const response = await fetch(`${process.env.REACT_APP_URL_API}${url}`, settings)
    const response = await fetch(`${url}`, settings)
    const data = await response.json()
    return data
  } catch (e) {
    return e
  }
}

export const postRequest = async (url, requestData, token) => {
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
    // const response = await fetch(`${process.env.REACT_APP_URL_API}${url}`, settings)
    const response = await fetch(`${url}`, settings)
    const data = await response.json()
    return data
  } catch (e) {
    return e
  }
}

export const putRequest = async (url, requestData, token) => {
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
    // const response = await fetch(`${process.env.REACT_APP_URL_API}${url}/${requestData.id}`, settings)
    const response = await fetch(`${url}/${requestData.id}`, settings)
    const data = await response.json()
    return data
  } catch (e) {
    console.log(e)
    return e
  }
}

export const putRequestChangePassword = async (url, requestData, token) => {
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
}
