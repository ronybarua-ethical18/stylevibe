import { authKey } from '@/constants/authKey'
import { getFromLocalStorage } from '@/utils/handleLocalStorage'
import axios from 'axios'

const axiosInstance = axios.create()
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'
axiosInstance.defaults.headers['Accept'] = 'application/json'
axiosInstance.defaults.timeout = 60000

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(authKey)
    if (accessToken) {
      config.headers.Authorization = accessToken
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export { axiosInstance }
