import React from 'react';
import { Avatar, Button, Badge } from "@nextui-org/react";
import { AlertFillIcon } from "@primer/octicons-react";
import truncateText from "../../../../../shared/utils/truncateText";
import useSwapStore from '../../useSwapStore';
import useTokenSelectionModalStore from '../../useTokenSelectionModalStore';


const Token = ({ jetton }) => {
    const { balance, balance_in_usd, symbol, name, image, verification } = jetton;
    const { setSendJetton, setReceiveJetton } = useSwapStore();
    const { onSelectAsset } = useTokenSelectionModalStore();
    
    const truncatedName = name ? truncateText(name, 10) : "";

    return (
        <div className="flex justify-center w-full">
            <Button 
                className='w-full h-16 flex items-center justify-between bg-modalElement text-white'
                variant='flat'
                radius='lg'
                onClick={() => onSelectAsset(jetton, setSendJetton, setReceiveJetton)}
            >
                <div className="flex items-center">
                    <Badge content={<AlertFillIcon size={16} />} placement="bottom-right" shape="circle" isInvisible={verification === "whitelist"} className='border-none text-[#d9a71e] bg-[transparent]'>
                        <Avatar radius="full" size="md" src={image} />
                    </Badge>
                    <div className="flex flex-col items-start ml-4">
                        <div className="text-lg font-semibold">{symbol}</div>
                        <div className="text-sm text-gray-400">{truncatedName}</div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-lg font-semibold">{balance}</div>
                    {balance_in_usd !== undefined || null && (
                        <div className="text-sm text-gray-400">${balance_in_usd}</div>
                    )}
                </div>
            </Button>
        </div>
    )
}

export default Token;
