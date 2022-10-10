import axios from 'axios'
const login = async (url, requestData) => {
  const { data } = await axios.post(url, requestData)
  return data
}

export default login
