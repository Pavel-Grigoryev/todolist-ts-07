import * as appSelectors from './application-selectors'
import {asyncAppActions, slice} from "./application-reducer";


const applicationReducer = slice.reducer
const actions = slice.actions

const appActions = {
    ...asyncAppActions,
    ...actions
}

export {
    appSelectors,
    applicationReducer,
    appActions
}