// /*
//  * *
//  *  * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
//  *  *
//  *  * WSO2 LLC. licenses this file to you under the Apache License,
//  *  * Version 2.0 (the "License"); you may not use this file except
//  *  * in compliance with the License.
//  *  * You may obtain a copy of the License at
//  *  *
//  *  *     http://www.apache.org/licenses/LICENSE-2.0
//  *  *
//  *  * Unless required by applicable law or agreed to in writing,
//  *  * software distributed under the License is distributed on an
//  *  * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
//  *  * KIND, either express or implied. See the License for the
//  *  * specific language governing permissions and limitations
//  *  * under the License.
//  *
//  */
//
// import {useEffect, useMemo, useRef, useState} from "react";
// import type {
//     Account,
//     AppInfo,
//     Bank,
//     Config,
//     Payee,
//     StandingOrders,
//     TransactionData, Type,
//     User
// } from "./config-interfaces.ts";
// import {useLocation} from "react-router-dom";
// import {useConfig} from "./use-config.ts";
// import {queryClient} from "../utility/query-client.ts";
//
//
//
// /**
//  * A custom React Hook that acts as the application's central data store.
//  * It fetches the main configuration from 'config.json' on mount, then processes
//  * and aggregates the raw financial data (accounts, banks, transactions) into
//  * various derived state variables (e.g., total balances, chart data).
//  * It returns all application information and processed financial totals for global use.
//  */
//
// interface BankWithTotal{
//     bank: Bank;
//     total: number;
// }

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
//
//
//
// const LATEST_TRANSACTION_COUNT = 4;
//
// const useConfigContext = () => {
//     const { data: configData, isLoading } = useConfig() ;
//
//     const location = useLocation();
//
//     console.log("configData:", configData, "isLoading:", isLoading);
//
//     const [totalsOfBanks, setTotalsOfBanks] = useState<BankWithTotal[]>([]);
//     const [chartDatas, setChartDatas] = useState<ChartData>({
//         label: '',
//         labels: [],
//         data: [],
//         backgroundColor: [],
//         borderColor: [],
//         borderWidth: 0,
//         cutout: '0%'
//     });
//     // const [totalBalances, setTotalBalances] = useState<number>(0);
//     // const [banksWithAllAccounts, setBanksWithAllAccounts] = useState<BanksWithAccounts[]>([]);
//     // const [transactionDatas, setTransactionDatas] = useState<TransactionData[]>([]);
//     // const [standingOrdersList, setStandingOrdersList] = useState<StandingOrders[]>([]);
//     // const [payeesData, setPayeesData] = useState<Payee[]>([]);
//     const [useCasesData, setUseCasesData] = useState<Type[]>([]);
//     const [allBanks, setAllBanks] = useState<Bank[]>([]);
//     const overlayInformation = useRef<OverlayDataProp>({flag:false,overlayData:{context:"",secondaryButtonText:"",mainButtonText:"",title:"",onMainButtonClick:()=>{}}});
//
//     // const handleOverlay = ()=>{
//     //     setOverlayInformation({flag:false,overlayData:{context:"",secondaryButtonText:"",mainButtonText:"",title:"",onMainButtonClick:()=>{}}});
//     // }
//
//
//     // const redirectState = queryClient.getQueryData<OperationState>(['redirectState']);
//     //
//     // console.log(redirectState);


/*
 * *
 * * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 * *
 * * WSO2 LLC. licenses this file to you under the Apache License,
 * * Version 2.0 (the "License"); you may not use this file except
 * * in compliance with the License.
 * * You may obtain a copy of the License at
 * *
 * * http://www.apache.org/licenses/LICENSE-2.0
 * *
 * * Unless required by applicable law or agreed to in writing,
 * * software distributed under the License is distributed on an
 * * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * * KIND, either express or implied. See the License for the
 * * specific language governing permissions and limitations
 * * under the License.
 *
 */

import {useEffect, useMemo, useState} from "react";
import type {
    Account,
    AppInfo,
    Bank,
    Config,
    User
} from "./config-interfaces.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {useConfig} from "./use-config.ts";
import {queryClient} from "../utility/query-client.ts";


// ... (Interface definitions remain the same) ...




const LATEST_TRANSACTION_COUNT = 4;
const CONFIG_QUER_KEY = ["appConfig"]; // Define constant outside hook

const useConfigContext = () => {
    const { data: configData } = useConfig() ;
    const location = useLocation();
    const navigate = useNavigate();

    // --- Removed all unnecessary useState definitions (e.g., setTotalsOfBanks, setChartDatas, etc.) ---

    // const overlayInformation = useRef<OverlayDataProp>({flag:false,overlayData:{context:"",secondaryButtonText:"",mainButtonText:"",title:"",onMainButtonClick:()=>{}}});
    const redirectState = location.state?.operationState;

    const [overlayInformation, setOverlayInformation] = useState<OverlayDataProp>({flag:false,overlayData:{context:"",secondaryButtonText:"",mainButtonText:"",title:"",onMainButtonClick:()=>{}}});


    const handleOverlayClose = () => {
        setOverlayInformation({flag:false,overlayData:{context:"",secondaryButtonText:"",mainButtonText:"",title:"",onMainButtonClick:()=>{}}})
    }


    // Helper function for session storage (moved inside hook scope if needed, or outside)
    const updateSessionStorage = (updatedConfig: Config) => {
        try {
            sessionStorage.setItem(CONFIG_QUER_KEY[0], JSON.stringify(updatedConfig));
            console.log("++++++++++++++++++++++++++++++")
            console.log(updatedConfig);
        } catch (e) {
            console.error("Failed to update session storage:", e);
        }
    }


    // ##########################################
    // 1. DATA AGGREGATION (Pure Calculations via useMemo)
    // These run automatically when configData changes, without needing useEffect or useState.
    // ##########################################

    const totals = useMemo(() => {
        if (!configData) return [];
        return configData.banks.map((bank) => {
            const total = configData.accounts
                .filter((a) => a.bank === bank.name)
                .reduce((sum, acc) => sum + acc.balance, 0);
            return { bank, total };
        });
    }, [configData]);

    const chartInfo = useMemo(() => {
        if (!configData) return { label: '', labels: [], data: [], backgroundColor: [], borderColor: [], borderWidth: 0, cutout: '0%' };

        return {
            label: '',
            labels: totals.map((t) => t.bank.name),
            data: totals.map((t) => t.total),
            backgroundColor: totals.map((t) => t.bank.color),
            borderColor: totals.map((t) => t.bank.border),
            borderWidth: 2,
            cutout: '35%'
        }
    }, [configData, totals]); // Dependency on totals is correct

    const totalBalances = useMemo(() => {
        return totals.reduce((s, b) => s + b.total, 0);
    }, [totals]);

    const banksWithAllAccounts = useMemo(() => {
        if (!configData) return [];
        return configData.banks.map((bank) => {
            const accounts = configData.accounts.filter((a) => a.bank === bank.name);
            const total = accounts.reduce((s, a) => s + a.balance, 0);
            return { bank, accounts, total };
        });
    }, [configData]);

    // ##########################################
    // 2. SIDE EFFECTS (useEffect)
    // This logic handles the payment update and history cleanup, and must NOT depend on configData.
    // ##########################################
    useEffect(() => {

        if (!configData || (!location.state && !redirectState)) {
            // Wait for configuration data and relevant location state/redirect data
            return;
        }

        if (redirectState?.type === "payment") {
            const newTransactionData = redirectState.data;
            const fullAccountNumber = newTransactionData.account;
            const firstHyphenIndex = fullAccountNumber.indexOf('-');
            newTransactionData.account = fullAccountNumber.substring(firstHyphenIndex + 1);

            const transactionAmount = parseFloat(newTransactionData.amount);
            const sourceBankName = newTransactionData.bank;
            const sourceAccountNumber = newTransactionData.account;

            console.log("==============================================")

            console.log(transactionAmount)
            console.log(sourceBankName)
            console.log(sourceAccountNumber)
            console.log("=================&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

            // Update React Query Cache
                const newConfig = queryClient.setQueryData(CONFIG_QUER_KEY, (oldConfig: Config | undefined) => {
                    const baseConfig = oldConfig || configData; // Use configData as fallback
                    console.log(baseConfig)



            //
                    const currentTransaction = baseConfig?.transactions || [];

                    console.log(currentTransaction)




                    const updatedTransactionData = [newTransactionData, ...currentTransaction];
                    console.log(updatedTransactionData)
                    console.log("====##################################################")
                // })


            //
                    const updatedAccounts = (baseConfig.accounts ?? []).map((account: Account) => {
                        if (account.bank === sourceBankName && account.id === sourceAccountNumber) {
                            const newBalance = (account.balance ?? 0) - transactionAmount;
                            return {
                                ...account,
                                balance: newBalance,
                            };
                        }
                        return account;
                    });
                    console.log(updatedAccounts)

                    return {
                        ...baseConfig!,
                        accounts: updatedAccounts,
                        transactions: updatedTransactionData,
                    }


                })

            //
            //     // IMPORTANT: Clear state/history to prevent the loop from re-triggering
            queryClient.invalidateQueries({ queryKey: CONFIG_QUER_KEY });

                updateSessionStorage(newConfig as Config);
            //
            //     // You could set an overlay here if needed
            const paymentOverlayText = `your payment of ${newTransactionData.amount} ${newTransactionData.currency} has been successfully processed.`;
            console.log(paymentOverlayText);

            setOverlayInformation({flag:true, overlayData:{context: paymentOverlayText,secondaryButtonText:"", title:"Payment Success",onMainButtonClick:handleOverlayClose, mainButtonText:"OK"}})

                // flag: true,
//                 //     overlayData: {
//                 //         context: paymentOverlayText,
//                 //         secondaryButtonText: "",
//                 //         mainButtonText: "Done",
//                 //         title: "Payment Successfull",
//                 //         onMainButtonClick: handleOverlay
//                 //     }

            console.log("********************************************************************")
            console.log(configData)
            //     // ...
            // }

            navigate(location.pathname, { replace: true, state: {} });


            // Clean up redirect state from cache if it was used elsewhere
            // queryClient.removeQueries({ queryKey: ['redirectState']});

            // The payment logic modifies configData, so configData must be EXCLUDED from dependencies
            // to prevent the infinite loop. We only depend on the state that triggers the change.

        }else if(redirectState?.type === "single"){
            console.log(redirectState.data)
            const newAccountData = redirectState.data;

            const CONFIG_QUER_KEY = ["appConfig"];

            const newConfigWithAccount = queryClient.setQueryData(CONFIG_QUER_KEY, (oldConfig:Config | undefined)=> {
                const baseConfig = oldConfig || configData;

                const accountToBeAdded= {id:newAccountData.accountDetails[0], bank:newAccountData.bankInfo,name:"savings account",balance:500}
                const updateNewAccounts = [...baseConfig.accounts,accountToBeAdded]
                console.log(updateNewAccounts)

                return {
                        ...baseConfig!,
                        accounts: updateNewAccounts
                    }
            })

            console.log(newConfigWithAccount)

            queryClient.invalidateQueries({ queryKey: CONFIG_QUER_KEY });

            updateSessionStorage(newConfigWithAccount as Config);

            console.log(configData)



            setOverlayInformation({flag:true,overlayData:{context:"Single Account Added Done",secondaryButtonText:"",mainButtonText:"Ok",title:"Account added Successfully",onMainButtonClick:handleOverlayClose}});

            navigate(location.pathname, { replace: true, state: {} });

        }else if(redirectState?.type === "multiple"){
            console.log(redirectState.data)
            console.log("&&&&&&&&&&&&&&&&&&####################################################################")

            const newAccounts = redirectState.data;

            const CONFIG_QUER_KEY = ["appConfig"];

            const newConfigWithAccount = queryClient.setQueryData(CONFIG_QUER_KEY, (oldConfig:Config | undefined)=> {
                const baseConfig = oldConfig || configData;

                console.log(baseConfig);

                const structuredPermissionsData = newAccounts.accountDetails[0];
                const bankName = newAccounts.bankInfo;


                console.log(structuredPermissionsData);
                console.log(bankName)

                const accNumbers = structuredPermissionsData.flatMap((permissionEntry: {
                    permission: "",
                    accounts: string[]
                }) => {
                    return permissionEntry.accounts || [];
                });

                console.log(accNumbers)
                console.log("******************@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

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

            });

            console.log(newAccounts)
            console.log(newConfigWithAccount)

            const config = newConfigWithAccount as Config;

            queryClient.invalidateQueries({ queryKey: CONFIG_QUER_KEY });

            updateSessionStorage(config);

            setOverlayInformation({flag:true,overlayData:{context:"Multiple Accounts added Successfully",secondaryButtonText:"",mainButtonText:"Ok",title:"Multiple Accounts add Successfully",onMainButtonClick:handleOverlayClose}});

        }


        // window.history.replaceState({}, document.title, location.pathname);
    }, [redirectState]);

    console.log(configData)
    console.log("===========================2222222222222222222222222")

    // ##########################################
    // 3. FINAL RETURN
    // Return all derived values directly from useMemo or configData.
    // ##########################################
    return {
        appInfo: configData?.name as AppInfo,
        userInfo: configData?.user as User,
        bankTotals: totals, // Use useMemo result
        chartInfo: chartInfo, // Use useMemo result
        total: totalBalances, // Use useMemo result
        banksWithAccounts: banksWithAllAccounts, // Use useMemo result

        // Derive the rest directly from configData, which is managed by React Query
        transactions: (configData?.transactions ?? []).slice(0, LATEST_TRANSACTION_COUNT),
        standingOrderList: configData?.standingOrders ?? [],
        payeesData: configData?.payees ?? [],
        useCases: configData?.types ?? [],
        banksList: configData?.banks ?? [],

        overlayInformation: overlayInformation,
    };


};

// @ts-ignore
export default useConfigContext;

//
//
//     const redirectState = location.state?.operationState;
//     console.log(redirectState);
//
//
//
//     useEffect(() => {
//
//         if (!configData) return;
//
//         let config: Config = configData;
//
//         const CONFIG_QUER_KEY = ["config"];
//
//         const updateSessionStorage = (updatedConfig: Config) => {
//             try {
//                 sessionStorage.setItem(CONFIG_QUER_KEY[0], JSON.stringify(updatedConfig));
//             } catch (e) {
//                 console.error("Failed to update session storage:", e);
//             }
//         }
//
//
//
//
//
//         if (location.state != null || redirectState != null) {
//             console.log("location.state:", location.state);
//             console.log(location.state);
//             console.log(redirectState)
//             console.log("=========================================================#####")
//             console.log(location.state?.operationState?.data?.amount)
//
//             if (redirectState?.type === "payment") {
//                 const newTransactionData = redirectState?.data;
//                 console.log("****************************************************")
//                 console.log("newTransactionData:", newTransactionData?.amount);
//
//                 const fullAccountNumber = newTransactionData.account;
//                 const firstHyphenIndex = fullAccountNumber.indexOf('-');
//                 newTransactionData.account = fullAccountNumber.substring(firstHyphenIndex + 1);
//
//                 // newTransactionData.currency = newTransactionData.currency;
//                 console.log(newTransactionData?.currency);
//
//                 const transactionAmount = parseFloat(newTransactionData?.amount);
//                 console.log(transactionAmount);
//                 console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
//                 // newTransactionData.amount = parseFloat(newTransactionData.amount);
//
//                 console.log(newTransactionData.account)
//                 console.log("newTransactionData:", newTransactionData);
//                 const sourceBankName = newTransactionData.bank;
//                 const sourceAccountNumber = newTransactionData.account;
//                 console.log(sourceBankName)
//
//                 console.log(sourceAccountNumber)
//
//
//                 const newConfig = queryClient.setQueryData(CONFIG_QUER_KEY, (oldConfig: Config | undefined) => {
//                     const baseConfig = oldConfig || configData;
//
//                     const currentTransaction = baseConfig?.transactions || [];
//                     const updatedTransactionData = [newTransactionData, ...currentTransaction];
//
//                     const updatedAccounts = (baseConfig.accounts ?? []).map((account: Account) => {
//
//                         if (account.bank === sourceBankName && account.id === sourceAccountNumber) {
//
//                             const newBalance = (account.balance ?? 0) - transactionAmount;
//
//                             console.log(`Updated balance for ${account.id} in ${account.bank}: ${account.balance} -> ${newBalance}`);
//
//                             return {
//                                 ...account,
//                                 balance: newBalance,
//                             };
//                         }
//                         return account;
//                     });
//
//                     return {
//                         ...baseConfig!,
//                         accounts: updatedAccounts,
//                         transactions: updatedTransactionData,
//                     }
//                 })
//
//                 const paymentOverlayText = `your payment of ${newTransactionData.amount} ${newTransactionData.currency} has been successfully processed.`;
//
//                 config = newConfig as Config;
//                 window.history.replaceState({}, document.title, location.pathname);
//                 updateSessionStorage(config);
//
//                 console.log(paymentOverlayText);
//                 return;
//                 // setOverlayInformation({
//                 //     flag: true,
//                 //     overlayData: {
//                 //         context: paymentOverlayText,
//                 //         secondaryButtonText: "",
//                 //         mainButtonText: "Done",
//                 //         title: "Payment Successfull",
//                 //         onMainButtonClick: handleOverlay
//                 //     }
//                 // });
//
//             }
//
//             // }else if(location.state.operationState && location.state.operationState.type === "single"){
//             //     console.log(location.state.operationState)
//             //     const newAccountData = location.state.operationState.data;
//             //     console.log("newAccountData:", newAccountData);
//             //
//             //     const CONFIG_QUER_KEY = ["config"];
//             //
//             //     const newConfigWithAccount = queryClient.setQueryData(CONFIG_QUER_KEY, (oldConfig:Config | undefined)=> {
//             //         const baseConfig = oldConfig || configData;
//             //
//             //         console.log(baseConfig);
//             //
//             //         const accountToBeAdded= {id:newAccountData.accountDetails[0], bank:newAccountData.bankInfo,name:"savings account",balance:500}
//             //
//             //         const updateNewAccounts = [...baseConfig.accounts,accountToBeAdded]
//             //
//             //         console.log(updateNewAccounts)
//             //
//             //
//             //         return {
//             //             ...baseConfig!,
//             //             accounts: updateNewAccounts
//             //         }
//             //
//             //     })
//             //
//             //     window.history.replaceState({}, document.title, location.pathname);
//             //     config = newConfigWithAccount as Config;
//             //
//             //     updateSessionStorage(config);
//             //     location.state.operationState = null
//             //     setOverlayInformation({flag:true,overlayData:{context:"Single Account Added Done",secondaryButtonText:"",mainButtonText:"Ok",title:"Account added Successfully",onMainButtonClick:handleOverlay}});
//             //
//             //
//             // }else if (location.state.operationState && location.state.operationState.type === "multiple"){
//             //     console.log(location.state.operationState)
//             //
//             //     const multipleAccountData = location.state.operationState.data;
//             //
//             //     console.log("multipleAccountData:", multipleAccountData);
//             //
//             //     const CONFIG_QUER_KEY = ["config"];
//             //
//             //     const newConfigWithAccount = queryClient.setQueryData(CONFIG_QUER_KEY, (oldConfig:Config | undefined)=> {
//             //         const baseConfig = oldConfig || configData;
//             //
//             //         console.log(baseConfig);
//             //
//             //         const structuredPermissionsData = multipleAccountData.accountDetails[0];
//             //         const bankName = multipleAccountData.bankInfo;
//             //
//             //
//             //         console.log(structuredPermissionsData);
//             //         console.log(bankName)
//             //
//             //         const accNumbers = structuredPermissionsData.flatMap((permissionEntry:{permission:"",accounts:string[]}) => {
//             //             return permissionEntry.accounts || [];
//             //         });
//             //
//             //         console.log(accNumbers);
//             //
//             //         const generatedNewAccounts: Account[] = accNumbers.map((entry:string) => {
//             //
//             //             return {
//             //                 id: entry,
//             //                 bank: bankName,
//             //                 name: "savings (M)",
//             //                 balance: 500,
//             //             };
//             //         });
//             //
//             //         console.log(generatedNewAccounts);
//             //
//             //
//             //         const updateNewAccounts = [...baseConfig.accounts, ...generatedNewAccounts];
//             //
//             //         console.log("New unique accounts generated:", generatedNewAccounts);
//             //         console.log("Combined accounts length:", updateNewAccounts.length);
//             //
//             //
//             //         return {
//             //             ...baseConfig!,
//             //             accounts: updateNewAccounts
//             //         }
//             //     })
//             //
//             //     console.log("+++++++++++#####################")
//             //
//             //
//             //     config = newConfigWithAccount as Config;
//             //     updateSessionStorage(config);
//             //     window.history.replaceState({}, document.title, location.pathname);
//             //     location.state.operationState = null
//             //     setOverlayInformation({flag:true,overlayData:{context:"Multiple Accounts added Successfully",secondaryButtonText:"",mainButtonText:"Ok",title:"Multiple Accounts add Successfully",onMainButtonClick:handleOverlay}});
//             // }
//
//         }
//
//
//         queryClient.removeQueries({ queryKey: ['redirectState']});
//
//         console.log(config,location.state);
//
//
//         const totalsOfBanks = useMemo(() => {
//             if (!configData) return [];
//             return configData.banks.map((bank) => {
//                 const total = configData.accounts
//                     .filter((a) => a.bank === bank.name)
//                     .reduce((sum, acc) => sum + acc.balance, 0);
//                 return { bank, total };
//             });
//         }, [configData]);
//
//         const chartInfo = useMemo(() => {
//             if (!configData) return { label: '', labels: [], data: [], backgroundColor: [], borderColor: [], borderWidth: 0, cutout: '0%' };
//
//             return {
//                 label: '',
//                 labels: totals.map((t) => t.bank.name),
//                 data: totals.map((t) => t.total),
//                 backgroundColor: totals.map((t) => t.bank.color),
//                 borderColor: totals.map((t) => t.bank.border),
//                 borderWidth: 2,
//                 cutout: '35%'
//             } as ChartData;
//         }, [configData, totals]);
//
//
//         const totalBalances = useMemo(() => {
//             return totals.reduce((s, b) => s + b.total, 0);
//         }, [totals]);
//
//         const banksWithAllAccounts = useMemo(() => {
//             if (!configData) return [];
//             return configData.banks.map((bank) => {
//                 const accounts = configData.accounts.filter((a) => a.bank === bank.name);
//                 const total = accounts.reduce((s, a) => s + a.balance, 0);
//                 return { bank, accounts, total };
//             });
//         }, [configData]);
//
//
//
//         setTransactionDatas(config.transactions ?? []);
//         setStandingOrdersList(config.standingOrders ?? []);
//         setPayeesData(config.payees ?? []);
//         setUseCasesData(config.types ?? []);
//         setAllBanks(config.banks ?? []);
//
//
//     }, [configData,redirectState]);
//
//     console.log(transactionDatas)
//
//     console.log(banksWithAllAccounts);
//
//     return {
//         appInfo: configData?.name as AppInfo,
//         userInfo: configData?.user as User,
//         bankTotals: totalsOfBanks,
//         chartInfo: chartDatas,
//         total: totalBalances,
//         banksWithAccounts: banksWithAllAccounts,
//         transactions: transactionDatas.slice(0, LATEST_TRANSACTION_COUNT),
//         standingOrderList: standingOrdersList,
//         payeesData: payeesData,
//         useCases: useCasesData,
//         banksList: allBanks,
//         overlayInformation: overlayInformation,
//     };
// };
//
// // @ts-ignore
// export default useConfigContext;
