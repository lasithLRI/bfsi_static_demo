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

import {useSearchParams} from "react-router-dom";
import {Box, Button,} from "@oxygen-ui/react";
import type {Type} from "../../hooks/config-interfaces.ts";
import {useBankNavigationHook} from "../banking-hooks/use-bank-navigation-hook.ts";
import LoginPage from "./login-page.tsx";






export interface BankingHomePageProps {
    useCases: Type[];
}

const BankingHomePage = ({ useCases }: BankingHomePageProps) => { // Removed 'bank' if not defined in props


    const [params] = useSearchParams();
    const type = params.get("type") || '';

    const {usecase,usecasesList,usecaseSelectionHandler,currentStep,onSuccessHandler} = useBankNavigationHook({usecase: useCases, type: type});

    console.log(usecase)
    console.log(usecasesList)
    console.log(currentStep)










    // console.log(type);
    // console.log(useCases);
    // console.log(useCases);
    //
    // const title = useCases[0].useCases[1].steps
    // console.log("========================")
    // console.log(title)






    //
    // console.log(useCaseIndex);
    //
    // const useCasesList = specificUseCases ? Object.keys(specificUseCases) : [];
    //
    // const navigate = useNavigate();
    //
    // console.log(specificUseCases);
    //
    // let selectedUseCaseId = 0;
    //
    //
    //
    // const callback = useCallback(() => {
    //
    //     if (specificUseCases) {
    //         const aa = specificUseCases[useCasesList[selectedUseCaseId]];
    //         const ww=aa[step]
    //         console.log(ww);
    //
    //
    //
    //         navigate(ww);
    //
    //
    //     } else {
    //         console.log("specificUseCases is undefined.");
    //     }
    //
    // }, [specificUseCases, useCasesList, selectedUseCaseId, step]);
    //
    // useEffect(() => {
    //     callback()
    // },[callback])
    //
    // const handleStepChange = () => {
    //     setStep(step + 1);
    //     callback()
    //     console.log(step)
    // }


    return(
        <>
            <h3>Banking Home Page</h3>
            {/*<Box>*/}
            {/*    {useCasesList.map((item,index)=>(*/}
            {/*        <Button*/}
            {/*            variant={"contained"}*/}
            {/*            key={index}*/}
            {/*        >*/}
            {/*            {item}*/}
            {/*        </Button>*/}
            {/*    ))}*/}
            {/*</Box>*/}

            <Box>

               <Button variant={"contained"} onClick={()=>{usecaseSelectionHandler(0)}}>Select Usecase</Button>
            </Box>

            <Box>
                <LoginPage onSuccessHandler={onSuccessHandler} />
            </Box>

        </>
    )
}

export default BankingHomePage;
