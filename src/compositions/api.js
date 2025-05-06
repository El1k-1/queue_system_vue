import Axios from 'axios'

const url = process.env.VUE_APP_API_URL

export default function useApi () {
  const postQuery = async (route, data) => {
    return await Axios.post(url + route, data)
  }
  const getQuery = async (route) => {
    return await Axios.get(url + route)
  }
  const checkMe = async (token) => {
    const result = await Axios.post(url + 'users/me', token)
    if (result.data.success) {
      return result.data.data.login
    } else {
      return false
    }
  }
  return {
    postQuery,
    getQuery,
    checkMe
  }
}
