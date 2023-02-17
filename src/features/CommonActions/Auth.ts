import {createAction} from "@reduxjs/toolkit";

const setIsLoggedInAC = createAction<{ isLoggedIn: boolean }>('authActions/setIsLoggedInAC');

export const authCommonActions = {
    setIsLoggedInAC
}

