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

import {useSearchParams,useNavigate,Outlet} from "react-router-dom";
import {Box, Button,} from "@oxygen-ui/react";
import type {AppInfo, DynamicBanks, Type} from "../../hooks/config-interfaces.ts";
import {useBankNavigationHook} from "../banking-hooks/use-bank-navigation-hook.ts";
import {useEffect} from "react";

export interface BankingHomePageProps {
    useCases: Type[];
    bank: DynamicBanks
    appInfo: AppInfo
}

const BankingHomePage = ({ useCases,bank, appInfo }: BankingHomePageProps) => {


    const navigate = useNavigate();
    const [params] = useSearchParams();
    const type = params.get("type") || '';

    const {usecasesList,usecaseSelectionHandler,currentStep,onSuccessHandler} = useBankNavigationHook({usecase: useCases, type: type , appInfo: appInfo});

    console.log(usecasesList)
    console.log(currentStep)
    console.log(bank)



    useEffect(() => {
        const path = currentStep?.component
        console.log(path)

        navigate(`/${bank.route}/`+path)
    },[currentStep])


    return(
        <>
            <h3>Banking Home Page</h3>

            <Box>

               <Button variant={"contained"} onClick={()=>{usecaseSelectionHandler(0)}}>Select Usecase</Button>
            </Box>

            <Box>
                <Outlet context={{onSuccessHandler}}/>
            </Box>

        </>
    )
}

export default BankingHomePage;
