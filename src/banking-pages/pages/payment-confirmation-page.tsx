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

import {Box, Button, Grid, List, ListItem, Typography,} from "@oxygen-ui/react";
import {useOutletContext} from "react-router-dom";
import type {OutletContext} from "./login-page.tsx";
import '../banking.scss'

const PaymentConfirmationPage = ()=>{

    const { onSuccessHandler,navigationData } = useOutletContext<OutletContext>();

    console.log(navigationData)

    return(
        <>
            <Grid container className={'payments-outer-container'}>
                Please authorize following payment:

                <Grid className={"payment-info-container"}>

                   <Box sx={{width:'80%', marginTop:'2rem'}}>
                        <Typography>
                                <p>Debited Account : {navigationData.current.formData.userAccount}</p>
                                <List>
                                    <ListItem>Amount : {navigationData.current.formData?.amount}</ListItem>
                                    <ListItem>Currency : {navigationData.current.formData?.currency}</ListItem>
                                    <ListItem>Payee : {navigationData.current.formData?.payeeAccount}</ListItem>
                                    <ListItem>Reference : {navigationData.current.formData?.reference}</ListItem>
                                </List>
                        </Typography>
                   </Box>

                    <Box sx={{marginTop:'20%', gap:'1rem',display:'flex'}}>
                        <Button variant={'contained'} onClick={onSuccessHandler}>Confirm</Button>
                        <Button variant={'outlined'} >Cancel</Button>
                    </Box>
                </Grid>
            </Grid>

        </>
    )
}

export default PaymentConfirmationPage;
