/*
 * *
 *  * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *  *
 *  * WSO2 LLC. licenses this file to you under the Apache License,
 *  * Version 2.0 (the "License"); you may not use this file except
 *  * in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing,
 *  * software distributed under the License is distributed on an
 *  * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  * KIND, either express or implied. See the License for the
 *  * specific language governing permissions and limitations
 *  * under the License.
 *
 */

import {Box, Button, FormControl, Grid, OutlinedInput} from "@oxygen-ui/react";
import {useOutletContext} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {ErrorMessage} from "../../pages/payments-page/payment-form/payment-form.tsx";

export interface OutletContext{
    onSuccessHandler : () => void;
    navigationData : any;
    accountsToAdd : any;
}

interface loginformData{
    email: string;
    password: string;
}

// interface LoginPageProps {
//     onSuccessHandler:()=>void;
// }
const LoginPage = ()=>{

    const { onSuccessHandler, } = useOutletContext<OutletContext>();
    const {control, handleSubmit, formState: {errors}} = useForm<loginformData>({
        defaultValues:{
            email:'', password:''
        }
    })

    const onSubmitHandler = (data:loginformData)=>{
        console.log("Submitting...")

        if (data.email === 'john@gmail.com' && data.password !== ''){
            onSuccessHandler();
        }else{
             alert('wrong email or password')
        }

    }

    return (
        <>
            <Grid container className={'login-container'}>
                <h3>Login Page</h3>
                <form onSubmit={handleSubmit(onSubmitHandler)} className={"form-input"}>
                    <FormControl fullWidth={true} margin={'normal'} >
                        <label>Email</label>
                        <Controller name={'email'} control={control} rules={{required:'Email address required'}} render={({field}) => (
                            <OutlinedInput
                                {...field}
                                placeholder={"Enter your email"}
                                type={"text"}
                                error={!!errors.email}
                            />
                        )}/>
                        <ErrorMessage error={errors.email}/>
                    </FormControl>

                    <FormControl fullWidth={true} margin={'normal'} >
                        <label>password</label>
                        <Controller name={'password'} control={control} rules={{required:'Password required to proceed'}} render={({field}) => (
                            <OutlinedInput
                                {...field}
                                placeholder={"Enter your password"}
                                type={"password"}
                                error={!!errors.password}
                            />
                        )}/>
                        <ErrorMessage error={errors.password}/>
                    </FormControl>

                    <Box sx={{marginTop:'1rem', display:'flex', justifyContent:'end', gap:'1rem'}}>
                        <Button variant={'contained'} sx={{width:'6rem',height:'3rem'}} type={'submit'}>Login</Button>
                        <Button variant={'outlined'} sx={{width:'6rem',height:'3rem'}}>Cancel</Button>
                    </Box>
                </form>
            </Grid>


        </>
    )
}

export default LoginPage;
