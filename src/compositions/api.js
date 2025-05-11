import Axios from 'axios'

const { VUE_APP_API_URL_BASE } = process.env

export default function useApi () {
  const postQuery = async (route, data) => {
    return await Axios.post(VUE_APP_API_URL_BASE + route, data)
  }
  const getQuery = async (route) => {
    return await Axios.get(VUE_APP_API_URL_BASE + route)
  }
  const checkMe = async (token) => {
    const result = await Axios.post(VUE_APP_API_URL_BASE + 'users/me', token)
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
