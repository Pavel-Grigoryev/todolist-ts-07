import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Navigate} from "react-router-dom";
import {useAppSelector} from "hooks/useAppSelector";
import {useAppDispatch} from "hooks/useAppDispatch";
import {selectIsLoggedIn} from "./auth-selectors";
import {authActions} from "./index";

export const Login = () => {

    const dispatch = useAppDispatch()

    const isLoggedIn = useAppSelector(selectIsLoggedIn);


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Required').email('Invalid email address'),
            password: Yup.string().required('Required').min(5, 'Must be 5 characters or more')
        }),
        onSubmit: async (values, formikHelpers) => {
            const resultAction = await dispatch(authActions.loginTC(values));
            if (authActions.loginTC.rejected.match(resultAction)) {
                if (resultAction.payload?.fieldsErrors?.length) {
                    const error = resultAction.payload.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                }
            }
        },
    })

    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                                   {...formik.getFieldProps("email")}

                        />
                        {formik.touched.email && formik.errors.email &&
                            <div style={{color: "red"}}>{formik.errors.email}</div>}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password &&
                            <div style={{color: "red"}}>{formik.errors.password}</div>}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox/>}
                                          {...formik.getFieldProps("rememberMe")}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}