import * as authSelectors from './auth-selectors'
import {asyncAuthActions, authSlice} from './auth-reducer'

const authActions = {
    ...asyncAuthActions,
    ...authSlice
}

export {
    authSelectors,
    authActions
}