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

import {Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, Switch} from "@oxygen-ui/react";
import {useOutletContext} from "react-router-dom";
import type {OutletContext} from "./login-page.tsx";
import {useState} from "react";

export interface SelectedAccountEntry {
    permission: string;
    accounts: string[];
}

const AccountsSelectionTwoPage = ()=>{

    const { onSuccessHandler,navigationData, accountsToAdd } = useOutletContext<OutletContext>();

    console.log(accountsToAdd);

    console.log(navigationData)

    const multiAccounts = ["iban DE 000023245320","iban DE 000023245321","iban DE 000023245322"];

    const listOfPermissions = ["Accounts read", "Accounts write", "Accounts basics"];

    const [selectedData, setSelectedData] = useState<SelectedAccountEntry[]>(() => {
        return listOfPermissions.map(permission => ({
            permission: permission,
            accounts: [] as string[]
        }));
    });

    console.log(selectedData)

    const handleAccountChange = (permission: string, accountId: string, checked: boolean) => {

        setSelectedData(prevData => {
            return prevData.map(entry => {

                if (entry.permission === permission) {

                    const accounts = checked ? [...entry.accounts, accountId] : entry.accounts.filter(id => id !== accountId);
                    console.log("accounts", accounts);
                    return { ...entry, accounts };
                }

                return entry;
            });
        });
    };

    const handleSubmit = () => {

        console.log("Final Selected Accounts with Permissions:", selectedData);

        accountsToAdd.current = {type:"multiple",data:[selectedData]};

        console.log("================================**")
        console.log(accountsToAdd)

        onSuccessHandler();
    };

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

                        {listOfPermissions.map((item, index) => {
                            const currentAccounts = selectedData.find(d => d.permission === item)?.accounts || [];
                            return (
                                <Box key={index} sx={{display: 'flex', flexDirection: 'column'}}>

                                    <p>Permission to : </p> <h3>{item}</h3>

                                    {multiAccounts.map((account, index2) => {

                                        const isChecked = currentAccounts.includes(account);

                                        return (

                                            <FormControlLabel key={index2} control={<Checkbox id={account} checked={isChecked} onChange={(e) => handleAccountChange(item, account, e.target.checked)}/>} label={account}/>
                                        )
                                })}
                            </Box>)

                        })}

                    </FormControl>

                    <Box sx={{marginTop:'5%'}}>
                        <Button variant={'contained'} onClick={handleSubmit}>Success</Button>
                        <Button variant={'outlined'} >Cancel</Button>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

// @ts-ignore
export default AccountsSelectionTwoPage;
