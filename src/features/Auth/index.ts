import * as authSelectors from './auth-selectors'
import {asyncAuthActions, authSlice, slice} from './auth-reducer'

const authActions = {
    ...asyncAuthActions,
    ...authSlice
}

const authReducer = slice.reducer

export {
    authSelectors,
    authActions,
    authReducer
}