import { baseApi } from './api/baseApi'
import globalSlice from './slices/globalSlice'

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  global: globalSlice,
}
