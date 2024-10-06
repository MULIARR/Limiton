import React from 'react';
import { Avatar, CardBody, Badge } from "@nextui-org/react";
import { AlertFillIcon } from "@primer/octicons-react";

const Asset = ({ asset: { price, diff_24h, balance, balance_in_usd, symbol, image, verification } }) => {
    return (
        <>
            <CardBody>
                <div className="flex items-center justify-between ml-3 mr-3 bg-[inherit] text-white">
                    <div className="flex items-center">
                        <Badge content={<AlertFillIcon size={16} />} placement="bottom-right" shape="circle" isInvisible={verification == "whitelist"} className='border-none text-[#d9a71e] bg-[transparent]'>
                            <Avatar radius="full" size="md" src={image} />
                        </Badge>
                        <div className='ml-4'>
                            <div className="text-lg font-semibold">{symbol}</div>
                            <div className="text-sm text-lightGray">
                                ${price} 
                                <span className={diff_24h.includes('−') ? "ml-2 text-customRed" : " ml-2 text-customGreen"}>{diff_24h}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-lg font-semibold">{balance}</div>
                        <div className="text-sm text-lightGray">${balance_in_usd}</div>
                    </div>
                </div>
            </CardBody>
        </>
    )
}

export default Asset;
