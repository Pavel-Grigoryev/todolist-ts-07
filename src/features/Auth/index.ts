import * as authSelectors from './auth-selectors'
import {asyncAuthActions, slice} from './auth-reducer'

const authReducer = slice.reducer

const authActions = {
    ...asyncAuthActions,
    ...slice.actions
}

export {
    authSelectors,
    authActions,
    authReducer
}