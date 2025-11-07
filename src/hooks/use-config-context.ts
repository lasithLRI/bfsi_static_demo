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

import {useEffect, useState} from "react";
import type {
    Account,
    AppInfo,
    Bank,
    Config,
    Payee,
    StandingOrders,
    TransactionData, Type,
    User
} from "./config-interfaces.ts";
import {useLocation} from "react-router-dom";
import {useConfig} from "./use-config.ts";
import {queryClient} from "../main.tsx";


/**
 * A custom React Hook that acts as the application's central data store.
 * It fetches the main configuration from 'config.json' on mount, then processes
 * and aggregates the raw financial data (accounts, banks, transactions) into
 * various derived state variables (e.g., total balances, chart data).
 * It returns all application information and processed financial totals for global use.
 */

interface BankWithTotal{
    bank: Bank,
    total: number,
}

export interface ChartData{
    label: string;
    labels: string[];
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
    cutout: string;
}

export interface BanksWithAccounts{
    bank: Bank;
    accounts: Account[];
    total: number;
}

export interface OverlayDataProp{
    flag: boolean;
    overlayData:OverlayData;
}

export interface OverlayData{
    title: string;
    context: string;
    mainButtonText: string;
    secondaryButtonText: string;
    onMainButtonClick: () => void;
}



const LATEST_TRANSACTION_COUNT = 4;

const useConfigContext = () => {
    const { data: configData, isLoading } = useConfig() ;

    const location = useLocation();

    console.log("configData:", configData, "isLoading:", isLoading);

    const [totalsOfBanks, setTotalsOfBanks] = useState<BankWithTotal[]>([]);
    const [chartDatas, setChartDatas] = useState<ChartData>({
        label: '',
        labels: [],
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 0,
        cutout: '0%'
    });
    const [totalBalances, setTotalBalances] = useState<number>(0);
    const [banksWithAllAccounts, setBanksWithAllAccounts] = useState<BanksWithAccounts[]>([]);
    const [transactionDatas, setTransactionDatas] = useState<TransactionData[]>([]);
    const [standingOrdersList, setStandingOrdersList] = useState<StandingOrders[]>([]);
    const [payeesData, setPayeesData] = useState<Payee[]>([]);
    const [useCasesData, setUseCasesData] = useState<Type[]>([]);
    const [allBanks, setAllBanks] = useState<Bank[]>([]);
    const [overlayInformation, setOverlayInformation] = useState<OverlayDataProp>({flag:false,overlayData:{context:"",secondaryButtonText:"",mainButtonText:"",title:"",onMainButtonClick:()=>{}}});

    const handleOverlay = ()=>{
        setOverlayInformation({flag:false,overlayData:{context:"",secondaryButtonText:"",mainButtonText:"",title:"",onMainButtonClick:()=>{}}});
    }



    useEffect(() => {
        if (!configData) return;

        let config: Config = configData;

        const CONFIG_QUER_KEY = ["config"];

        const updateSessionStorage = (updatedConfig: Config) => {
            try {
                sessionStorage.setItem(CONFIG_QUER_KEY[0], JSON.stringify(updatedConfig));
            } catch (e) {
                console.error("Failed to update session storage:", e);
            }
        }

        if (location.state != null){
            console.log("location.state:", location.state);
            if (location.state.operationState && location.state.operationState.type === "payment") {
                const newTransactionData = location.state.operationState.data;

                const fullAccountNumber = newTransactionData.account;
                const firstHyphenIndex = fullAccountNumber.indexOf('-');
                newTransactionData.Account = fullAccountNumber.substring(firstHyphenIndex + 1);

                newTransactionData.Currency = newTransactionData.currency;

                const transactionAmount = parseFloat(newTransactionData.amount);
                newTransactionData.Amount = parseFloat(newTransactionData.amount);

                console.log(newTransactionData.Account)
                console.log("newTransactionData:", newTransactionData);
                const sourceBankName = newTransactionData.bank;
                const sourceAccountNumber = newTransactionData.Account;



                const newConfig = queryClient.setQueryData(CONFIG_QUER_KEY, (oldConfig:Config | undefined)=> {
                    const baseConfig = oldConfig || configData;

                    const currentTransaction = baseConfig?.transactions || [];
                    const updatedTransactionData = [newTransactionData, ...currentTransaction];

                    const updatedAccounts = (baseConfig.accounts ?? []).map((account:Account) => {

                        if (account.bank === sourceBankName && account.id === sourceAccountNumber){

                            const newBalance = (account.balance ?? 0) - transactionAmount;

                            console.log(`Updated balance for ${account.id} in ${account.bank}: ${account.balance} -> ${newBalance}`);

                            return {
                                ...account,
                                balance: newBalance,
                            };
                        }
                        return account;
                    });

                    return {
                        ...baseConfig!,
                        accounts: updatedAccounts,
                        transactions: updatedTransactionData,
                    }
                })

                config = newConfig as Config;
                window.history.replaceState({}, document.title, location.pathname);
                updateSessionStorage(config);
                location.state.operationState = null;
                setOverlayInformation({flag:true,overlayData:{context:"Payment Done",secondaryButtonText:"",mainButtonText:"Ok",title:"Payment Done Successfully", onMainButtonClick:handleOverlay}});


            }else if(location.state.operationState && location.state.operationState.type === "single"){
                console.log(location.state.operationState)
                const newAccountData = location.state.operationState.data;
                console.log("newAccountData:", newAccountData);

                const CONFIG_QUER_KEY = ["config"];

                const newConfigWithAccount = queryClient.setQueryData(CONFIG_QUER_KEY, (oldConfig:Config | undefined)=> {
                    const baseConfig = oldConfig || configData;

                    console.log(baseConfig);

                    const accountToBeAdded= {id:newAccountData.accountDetails[0], bank:newAccountData.bankInfo,name:"savings account",balance:500}

                    const updateNewAccounts = [...baseConfig.accounts,accountToBeAdded]

                    console.log(updateNewAccounts)


                    return {
                        ...baseConfig!,
                        accounts: updateNewAccounts
                    }

                })

                window.history.replaceState({}, document.title, location.pathname);
                config = newConfigWithAccount as Config;

                updateSessionStorage(config);
                location.state.operationState = null
                setOverlayInformation({flag:true,overlayData:{context:"Single Account Added Done",secondaryButtonText:"",mainButtonText:"Ok",title:"Account added Successfully",onMainButtonClick:handleOverlay}});


            }else if (location.state.operationState && location.state.operationState.type === "multiple"){
                console.log(location.state.operationState)

                const multipleAccountData = location.state.operationState.data;

                console.log("multipleAccountData:", multipleAccountData);

                const CONFIG_QUER_KEY = ["config"];

                const newConfigWithAccount = queryClient.setQueryData(CONFIG_QUER_KEY, (oldConfig:Config | undefined)=> {
                    const baseConfig = oldConfig || configData;

                    console.log(baseConfig);

                    const structuredPermissionsData = multipleAccountData.accountDetails[0];
                    const bankName = multipleAccountData.bankInfo;


                    console.log(structuredPermissionsData);
                    console.log(bankName)

                    const accNumbers = structuredPermissionsData.flatMap((permissionEntry:{permission:"",accounts:string[]}) => {
                        return permissionEntry.accounts || [];
                    });

                    console.log(accNumbers);

                    const generatedNewAccounts: Account[] = accNumbers.map((entry:string) => {

                                return {
                                    id: entry,
                                    bank: bankName,
                                    name: "savings (M)",
                                    balance: 500,
                                };
                    });

                    console.log(generatedNewAccounts);


                    const updateNewAccounts = [...baseConfig.accounts, ...generatedNewAccounts];

                    console.log("New unique accounts generated:", generatedNewAccounts);
                    console.log("Combined accounts length:", updateNewAccounts.length);


                    return {
                        ...baseConfig!,
                        accounts: updateNewAccounts
                    }
                })

                console.log("+++++++++++#####################")


                config = newConfigWithAccount as Config;
                updateSessionStorage(config);
                window.history.replaceState({}, document.title, location.pathname);
                location.state.operationState = null
                setOverlayInformation({flag:true,overlayData:{context:"Multiple Accounts added Successfully",secondaryButtonText:"",mainButtonText:"Ok",title:"Multiple Accounts add Successfully",onMainButtonClick:handleOverlay}});
            }

        }

        const totals = config.banks.map((bank) => {
            const total = config.accounts
                .filter((a) => a.bank === bank.name)
                .reduce((sum, acc) => sum + acc.balance, 0);
            return { bank, total };
        });
        setTotalsOfBanks(totals);

        const chart: ChartData = {
            label: '',
            labels: totals.map((t) => t.bank.name),
            data: totals.map((t) => t.total),
            backgroundColor: totals.map((t) => t.bank.color),
            borderColor: totals.map((t) => t.bank.border),
            borderWidth: 2,
            cutout: '35%'
        };
        setChartDatas(chart);


        setTotalBalances(totals.reduce((s, b) => s + b.total, 0));

        const banksWithAccounts = config.banks.map((bank) => {
            const accounts = config.accounts.filter((a) => a.bank === bank.name);
            const total = accounts.reduce((s, a) => s + a.balance, 0);
            return { bank, accounts, total };
        });
        setBanksWithAllAccounts(banksWithAccounts);



        setTransactionDatas(config.transactions ?? []);
        setStandingOrdersList(config.standingOrders ?? []);
        setPayeesData(config.payees ?? []);
        setUseCasesData(config.types ?? []);
        setAllBanks(config.banks ?? []);


    }, [configData,location,overlayInformation]);

    console.log(transactionDatas)

    console.log(banksWithAllAccounts);

    return {
        appInfo: configData?.name as AppInfo,
        userInfo: configData?.user as User,
        bankTotals: totalsOfBanks,
        chartInfo: chartDatas,
        total: totalBalances,
        banksWithAccounts: banksWithAllAccounts,
        transactions: transactionDatas.slice(0, LATEST_TRANSACTION_COUNT),
        standingOrderList: standingOrdersList,
        payeesData: payeesData,
        useCases: useCasesData,
        banksList: allBanks,
        overlayInformation: overlayInformation,
    };
};

// @ts-ignore
export default useConfigContext;
