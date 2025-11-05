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
    Grid,
    Radio,
    RadioGroup
} from "@oxygen-ui/react";
import {useOutletContext} from "react-router-dom";
import type {OutletContext} from "./login-page.tsx";
import {useState} from "react";



const AccountsSelectionPage = ()=>{

    const { onSuccessHandler,navigationData, accountsToAdd } = useOutletContext<OutletContext>();

    const accountsList = ["0006-0566-1212","0006-0045-2020","0006-0400-1010"];

    const [selectedAccount, setSelectedAccount] = useState<string>('');

    const handleAccountSelection = () => {
        accountsToAdd.current.push(selectedAccount);
        onSuccessHandler();
    }

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAccount(event.target.value);
    };

    return(
        <>
            <Grid container className={'payments-outer-container'}>
                Select the account

                <Grid className={"form-input"}>

                    <FormControl>
                        <FormLabel id={"check-box-group"}>Select your account to add from the list</FormLabel>
                    </FormControl>

                    <FormControl sx={{display:'flex', flexDirection:'column', marginTop:'10%'}}>

                        <RadioGroup aria-label="select-account" name="account-selection-group" value={selectedAccount} onChange={handleRadioChange}>
                            {accountsList.map((account, index) => {
                                return (
                                    <FormControlLabel key={index} control={<Radio />} label={`${navigationData.current.bankInfo.name}-${account}`} value={account}/>
                                );
                            })}
                        </RadioGroup>

                    </FormControl>

                    <Box sx={{marginTop:'20%'}}>
                        <Button variant={'contained'} onClick={handleAccountSelection}>Success</Button>
                        <Button variant={'outlined'} >Cancel</Button>
                    </Box>
                </Grid>
            </Grid>

        </>
    )
}

export default AccountsSelectionPage;
