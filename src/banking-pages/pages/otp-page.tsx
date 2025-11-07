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
import type {OutletContext} from "./login-page.tsx";
import {Controller, useForm} from "react-hook-form";
import {ErrorMessage} from "../../pages/payments-page/payment-form/payment-form.tsx";

interface OtpFormData{
    code:string;
}

const OtpPage = ()=>{

    const { onSuccessHandler,navigationData } = useOutletContext<OutletContext>();

    console.log(navigationData)

    const {control,handleSubmit,formState:{errors}} = useForm<OtpFormData>({
        defaultValues:{
            code:''
        }
    })

    const onSubmitHandler=(data:OtpFormData)=>{
        if(data.code==='55555'){
            onSuccessHandler()
        }else{
            alert("Check your Otp and re-enter")
        }

    }

    return(
        <>
            <Grid container className={'payments-outer-container'}>
                <h3>SMS Authentication</h3>

                <Grid className={"form-input"}>
                    <form onSubmit={handleSubmit(onSubmitHandler)}>
                        <FormControl fullWidth={true} margin={'normal'} >
                            <label>OTP code:</label>
                            <Controller name={'code'} control={control} rules={{required:'OTP verification required'}}  render={({field}) => (
                                <OutlinedInput
                                    {...field}
                                    placeholder={"Enter otp"}
                                    type={"text"}
                                    error={!!errors.code}
                                />
                            )}/>
                            <ErrorMessage error={errors.code}/>
                        </FormControl>

                        <Box sx={{marginTop:'40%', display:'flex',justifyContent:'end',gap:'1rem'}}>
                            <Button variant={'contained'} type={'submit'}>Confirm</Button>
                            <Button variant={'outlined'} >Cancel</Button>
                        </Box>
                    </form>
                </Grid>
            </Grid>

        </>
    )
}

export default OtpPage;
