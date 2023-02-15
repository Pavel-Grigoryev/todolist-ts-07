import * as appSelectors from './app-selectors'
import {asyncAppActions, appSlice} from "./app-reducer";

const appActions = {
        ...asyncAppActions,
        ...appSlice
    }

export {
    appSelectors,
    appActions
}