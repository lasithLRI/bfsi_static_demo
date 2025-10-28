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

import {Outlet, useNavigate, useSearchParams} from "react-router-dom";
import type {SpecificUseCases, UseCaseCategories} from "../../hooks/config-interfaces.ts";
import { Box, Button } from "@oxygen-ui/react";
import {useCallback, useEffect, useState} from "react";

interface BankingHomePageProps {
    useCases: UseCaseCategories;
    // Assuming 'bank' prop exists based on previous context, even if not defined here
    // bank: string;
}

const BankingHomePage = ({ useCases }: BankingHomePageProps) => { // Removed 'bank' if not defined in props

    // const [selectedUseCaseId, setSelectedUseCaseId] = useState<number>(0);
    // const [sequence, setSequence] = useState<string[]>([]);
    const [step, setStep] = useState<number>(0);
    const [specificUseCases, setSpecificUseCases] = useState<SpecificUseCases>();




    const [params] = useSearchParams();
    const type = params.get("type") || '';

    setSpecificUseCases(useCases[type]) ;
    const useCasesList = specificUseCases ? Object.keys(specificUseCases) : [];

    const navigate = useNavigate();

    console.log(specificUseCases);

    let selectedUseCaseId = 0;



    const callback = useCallback(() => {

        if (specificUseCases) {
            const aa = specificUseCases[useCasesList[selectedUseCaseId]];
            const ww=aa[step]
            console.log(ww);



            navigate(ww);


        } else {
            console.log("specificUseCases is undefined.");
        }

    }, [specificUseCases, useCasesList, selectedUseCaseId, step]);

    useEffect(() => {
        callback()
    },[callback])

    const handleStepChange = () => {
        setStep(step + 1);
        callback()
        console.log(step)
    }


    return(
        <>
            <h1>Banking Home Page</h1>
            <Box>
                {useCasesList.map((item,index)=>(
                    <Button
                        variant={index===selectedUseCaseId? "contained":"outlined"}
                        key={index}
                    >
                        {item}
                    </Button>
                ))}
            </Box>

            <Box>

                <Outlet context={handleStepChange}/>
            </Box>

        </>
    )
}

export default BankingHomePage;
