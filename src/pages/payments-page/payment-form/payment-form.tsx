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

import {Controller, useForm} from "react-hook-form";
import {Box, Button, FormControl, MenuItem, OutlinedInput, Select} from "@oxygen-ui/react";
import {NumericFormat} from "react-number-format";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {AppInfo, Payee} from "../../../hooks/config-interfaces.ts";
import OverlayConfirmation from "../../../components/overlay-confirmation/overlay-confirmation.tsx";
import '../payments-page.scss'
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material";
import type {BanksWithAccounts} from "../../../hooks/use-config-context.ts";


export interface PaymentFormData {
    userAccount: string;
    payeeAccount: string;
    currency: string;
    amount: number| string;
    reference: string;
    appInfo: AppInfo;
}

interface PaymentFormProps {
    appInfo: AppInfo;
    banksWithAllAccounts: BanksWithAccounts[];
    payeeData: Payee[];
}

const currency = ["GBP","EURO","USD"]


const PaymentForm = ({appInfo,banksWithAllAccounts, payeeData}:PaymentFormProps) => {

    const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('md'));
    const responsiveDirection = isSmallScreen ? 'column' : 'row';

    const navigate = useNavigate();

    const {control, handleSubmit, formState: {errors},reset} = useForm<PaymentFormData>({
        defaultValues: {
            userAccount: '',
            payeeAccount: '',
            currency: '',
            amount: 0,
            reference: ''
        }
    });

    const [isConfirming, setIsConfirming] = useState(false);

    const [formDataToSubmit, setFormDataToSubmit] = useState<PaymentFormData | null>(null)

    const onSubmit = (data: PaymentFormData) => {
        console.log(data);
        setFormDataToSubmit(data);
        setIsConfirming(true);

    }

    const handleConfirmedAndRedirect = () => {
        if (formDataToSubmit){
            console.log("Submitting data and redirecting:", formDataToSubmit);
            setIsConfirming(false);

            const bankName = formDataToSubmit.userAccount.split('-')[0];
            console.log("=================++++++++++++++++")
            console.log(bankName)

            const target = appInfo.banksInfo.find((bank)=>{
                return bank.name === bankName;
            })

            console.log(target)

            navigate("/"+target?.route+"/?type=payment",{
                state:{
                    formData: formDataToSubmit,
                    message: "confirmed payment information",
                }
            });

        }
    }

    const handleCancelConfirmation = () => {
        setIsConfirming(false);
        setFormDataToSubmit(null);
    }

    return (
        <>
            <h2 className={"payment-form-heading"}>Payment Information</h2>
            <form onSubmit={handleSubmit(onSubmit)}>

                <FormControl fullWidth={true} margin={'dense'}>
                    <label>User Account</label>
                    <Controller name={'userAccount'} control={control} render={({field}) => (
                        <Select {...field}
                                displayEmpty
                                renderValue={(value) => {
                                    const selected = value as string
                                    if (selected === "") {
                                        return (
                                            <span style={{color: 'rgba(0, 0, 0, 0.38)'}}>Select payee account from here</span>
                                        );
                                    }
                                    return selected;
                                }}
                                error={!!errors.userAccount}>
                            {banksWithAllAccounts.map((bank)=>
                                bank.accounts.map((account,index)=>(
                                    <MenuItem key={index} value={`${bank.bank.name}-${account.id}`}>{bank.bank.name}-{account.id}</MenuItem>
                                ))

                            )}
                        </Select>
                    )}/>
                </FormControl>


                <FormControl fullWidth={true} margin={'dense'}>
                    <label>Payee Account</label>
                    <Controller name={'payeeAccount'} control={control} render={({field}) => (
                        <Select {...field}
                                displayEmpty
                                renderValue={(value) => {
                                    const selected = value as string
                                    if (selected === "") {
                                        return (
                                            <span style={{color: 'rgba(0, 0, 0, 0.38)'}}>Select payee account from here</span>
                                        );
                                    }
                                    return selected;
                                }}
                                error={!!errors.payeeAccount}>
                            {payeeData.map((payee,index)=>(
                                <MenuItem key={index} value={`${payee.name}-${payee.bank}`}>{payee.name}-{payee.bank}</MenuItem>
                            ))}
                        </Select>
                    )}/>
                </FormControl>

                <div style={{display: 'flex',gap:'1rem'}}>
                    <FormControl fullWidth={true} margin={'dense'}>
                        <label>Currency</label>
                        <Controller name={'currency'} control={control} render={({field}) => (

                            <Select {...field}
                                    displayEmpty
                                    renderValue={(value) => {
                                        const selected = value as string
                                        if (selected === "") {
                                            return (
                                                <span style={{color: 'rgba(0, 0, 0, 0.38)'}}>Select currency</span>
                                            );
                                        }
                                        return selected;
                                    }}
                                    error={!!errors.currency}>

                                {currency.map((unit)=>(
                                    <MenuItem value={`${unit}`}>{unit}</MenuItem>
                                ))}
                            </Select>
                        )}/>
                    </FormControl>

                    <FormControl fullWidth={true} margin={'dense'}>
                        <label>Amount</label>
                        <Controller name={'amount'} control={control} render={({field}) => (
                            <NumericFormat
                                {...field}
                                value={field.value === 0 ? '' : field.value}
                                customInput={OutlinedInput}
                                thousandSeparator={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                allowLeadingZeros={false}
                                allowNegative={false}
                                onValueChange={(values) => {
                                    field.onChange(values.floatValue || 0);

                                }}
                                error={!!errors.amount}
                                placeholder="0.00"
                                type="text"
                            />
                        )}/>
                    </FormControl>
                </div>

                <FormControl fullWidth={true} margin={'dense'} sx={{height: '10vh'}}>
                    <label>Reference</label>
                    <Controller name={'reference'} control={control} render={({field}) => (
                        <OutlinedInput
                            {...field}
                            placeholder={"Enter your reference"}
                            type={"text"}
                            error={!!errors.reference}
                        />
                    )}/>
                </FormControl>
                <Box className={"payment-button-container"} flexDirection={responsiveDirection}>
                    <FormControl fullWidth={true} margin={'dense'}>
                        <Button variant={"contained"} type={"submit"}>Pay Now</Button>
                    </FormControl>
                    <FormControl fullWidth={true} margin={'dense'}>
                        <Button variant={"outlined"} type={"button"} onClick={()=>{reset()}}>Reset</Button>
                    </FormControl>
                </Box>

                {isConfirming && (
                    <OverlayConfirmation data={formDataToSubmit} onConfirm={handleConfirmedAndRedirect} onCancel={handleCancelConfirmation}/>
                )}

            </form>
        </>
    );
}

export default PaymentForm;
