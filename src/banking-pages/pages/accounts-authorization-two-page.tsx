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

import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid, List,
    ListItem,
    Switch
} from "@oxygen-ui/react";
import {useOutletContext} from "react-router-dom";
import type {OutletContext} from "./login-page.tsx";
import type {SelectedAccountEntry} from "./accounts-selection-two-page.tsx";

const AccountsAuthorizationTwoPage = ()=>{

    const { onSuccessHandler, accountsToAdd } = useOutletContext<OutletContext>();

    return(
        <>
            <Grid container className={'payments-outer-container'}>
                Please authorize to share following data with accounts central:

                <Grid className={"form-input"}>

                    <FormControl>
                        <FormLabel id={"check-box-group"}>Select your account to add from the list</FormLabel>
                    </FormControl>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <FormControlLabel control={<Switch id={"account-one"} checked disabled={true}/>} label={"Recurring"} labelPlacement={'start'}/>
                        <p>Frequency : 4 Days</p>
                    </Box>

                    <FormControl sx={{display:'flex', flexDirection:'column', marginTop:'5%', height:'16rem', overflowY:'auto'}}>

                        {accountsToAdd.current.data[0].map((account:SelectedAccountEntry,index:number)=>{

                            return (
                                <Box key={index} sx={{display:'flex', flexDirection:'column'}}>
                                    <p>Permission to : </p> <h3>{account.permission}</h3>

                                    <List sx={{ listStyleType: 'disc', pl: 4 }}>

                                        {account.accounts.map((iban, idx) => (
                                            <ListItem key={idx} sx={{display: 'list-item'}}>{iban}</ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )
                        })}

                    </FormControl>

                    <Box sx={{marginTop:'5%'}}>
                        <Button variant={'contained'} onClick={onSuccessHandler}>Success</Button>
                        <Button variant={'outlined'} >Cancel</Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default AccountsAuthorizationTwoPage;
