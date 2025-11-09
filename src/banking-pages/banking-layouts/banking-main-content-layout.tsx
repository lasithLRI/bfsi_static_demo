import type { AppInfo, DynamicBanks, Type, UseCase } from "../../hooks/config-interfaces";
import './banking-main-content-layout.scss';
import { Button, Grid } from "@oxygen-ui/react";

export interface BankingHomePageProps {
    useCases: Type[];
    bank: DynamicBanks
    appInfo: AppInfo
}

export interface  accountsToAddContent {
    type: string;
    data: []
}

interface BankingMainContentLayoutProps{
    children: React.ReactNode;
    usecasesList: UseCase[];
    selectedUsecaseIndex: number;
    usecaseSelectionHandler: (index: number) => void;
    bankName:string;
}


const BankingMainContentLayout = ({ children,usecasesList,selectedUsecaseIndex,usecaseSelectionHandler,bankName}: BankingMainContentLayoutProps) => {


    return (
        <Grid container className={'banking-outer-layout'}>
            <Grid className="banking-bank-name-container">
                <h3>{bankName}</h3>
            </Grid>
            
            <Grid className="banking-usecase-layout">
                {usecasesList.map((useCase,index) => {

                    const isSelected = selectedUsecaseIndex === index;

                    return (
                        <Button key={index} variant={isSelected?'contained':'outlined'} onClick={()=>{usecaseSelectionHandler(index)}}>{useCase.title}</Button>
                    )
                })}
            </Grid>

            <Grid className={'banking-inner-component-container'}>

                {children}

            </Grid>
        </Grid>
    );
}

export default BankingMainContentLayout;