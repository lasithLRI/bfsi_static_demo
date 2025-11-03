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


import type {AppInfo, Step, Type, UseCase} from "../../hooks/config-interfaces.ts";
import {useCallback, useEffect, useState} from "react";


interface BankingHookProps {
    usecase: Type[];
    type: string;
    appInfo: AppInfo;
}

export const useBankNavigationHook = ({usecase,type,appInfo}:BankingHookProps)=>{

    const [sequence, setSequence] = useState<Step[]>(usecase[0].useCases[0].steps);
    const [steps, setSteps] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState<Step >(sequence[0]);
    const [typeIndex, setTypeIndex] = useState<number>(0);
    const [usecasesList, setUseCasesList] = useState<UseCase[]>([]);
    const [selectedUsecaseIndex, setSelectedUsecaseIndex] = useState<number>(0);


    const usecaseSelectionHandler = useCallback(
        (indexOfUsecase: number = 0) => {

            const newSteps = usecase[typeIndex]?.useCases[indexOfUsecase]?.steps;

            if (newSteps) {
                setSelectedUsecaseIndex(indexOfUsecase);
                setSequence(newSteps);
                setSteps(0);
                setCurrentStep(newSteps[0]);
            }
        },

        [usecase, typeIndex]
    );

    useEffect(() => {
        const foundTypeIndex = usecase.findIndex((i) => `${i.id + 1}` === type);
        const actualTypeIndex = foundTypeIndex !== -1 ? foundTypeIndex : 0;

        setTypeIndex(actualTypeIndex);

        const list = usecase[actualTypeIndex]?.useCases || [];
        setUseCasesList(list);

        console.log('AppInfo:', appInfo);
    }, [selectedUsecaseIndex,sequence]);


    const onSuccessHandler =()=>{

        if (steps < sequence.length-1) {
            setSteps((steps)=> steps+1)
        }
        const step = sequence[steps+1];

        setCurrentStep(step);
    }


    return {usecasesList, onSuccessHandler,currentStep,selectedUsecaseIndex,usecaseSelectionHandler}
}
