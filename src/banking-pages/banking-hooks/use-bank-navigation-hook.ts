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


import type {Step, Type} from "../../hooks/config-interfaces.ts";
import {useCallback, useEffect, useState} from "react";


interface BankingHookProps {
    usecase: Type[];
    type: string;
}

export const useBankNavigationHook = ({usecase,type}:BankingHookProps)=>{

    const [sequence, setSequence] = useState<Step[]>([]);

    const [steps, setSteps] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<Step | undefined>(undefined);

    const typeIndex = usecase.findIndex((i) => i.id === type);

    const usecasesList = usecase[typeIndex].useCases;

    const usecaseSelectionHandler = useCallback(
        (indexOfUsecase:number = 0)=>{
            setSequence(usecase[typeIndex].useCases[indexOfUsecase].steps)
            console.log(sequence)
        },
        [sequence]
    );

    useEffect(()=>{
        usecaseSelectionHandler(0);
    },[usecaseSelectionHandler])

    console.log("===============")
    console.log(sequence);

    const onSuccessHandler = useCallback(
        ()=>{
            if (steps <= sequence.length-1) {
                setSteps((currentState)=> currentState+1)
            }
        },
        [steps,sequence]
    );

    useEffect(() => {
        if (sequence.length > 0) {
            setCurrentStep(sequence[steps]);
        }
    }, [steps,sequence]);

    return {usecase,usecasesList,usecaseSelectionHandler, onSuccessHandler,currentStep}
}
