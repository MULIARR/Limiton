import React from "react";
import { Card, Button, Chip, Link, Snippet } from "@nextui-org/react";
import { motion } from 'framer-motion';
import TonviewerLogo from '../../../assets/Tonviewer.png';
import Asset from "./Asset/Asset";
import CountUpAnimation from "./CountUpAnimation/countUpAnimation";
import usePortfolioStore from "../usePortfolioStore";

const PortfolioCard = ({ portfolio }) => {
    const { address, shorten_address, total_balance, wallet_interface, status } = portfolio;
    const assets = portfolio.assets;
    const { previousBalance } = usePortfolioStore((state) => state);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: -20 }, 
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring", 
                stiffness: 50,
                damping: 10,
            },
        },
    };
    
    return (
        <>
        <Card className="rounded-2xl relative">
            <div className="text-white p-5 flex items-center justify-between w-full max-w-[inherit] mx-auto bg-gradient-to-r from-[#501850] 90% to-[#0b49b3]">
                <div>
                    <div className="text-gray-300">Address</div>
                    <div className="text-2xl font-semibold flex items-center">
                        {shorten_address}
                        <Snippet hideSymbol isIconOnly size="sm" variant="light" codeString={address} />
                    </div>
                    <div className="flex space-x-2 mt-2">
                        <Chip className="text-gray-300 bg-opacity-80 bg-[#55af78]">{status}</Chip>
                        <Chip color="secondary" className="text-gray-300 bg-opacity-20">{wallet_interface}</Chip>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-gray-300">Balance</div>
                    <div className="text-2xl font-semibold">$ <CountUpAnimation to={total_balance} /> </div>
                    <Button isIconOnly variant="light" color="primary" size="sm" className="border-white border-opacity-70 bg-opacity-20 bg-white my-1">
                        <Link href={`https://tonviewer.com/${address}`}>{<img src={TonviewerLogo} className="w-9 h-auto"/>}</Link>
                    </Button> 
                </div>
            </div>
            <div className="rounded-b-2xl rounded-t-xl shadow-2xl bg-card border-1 border-cardBorder relative z-3 -mt-3"
                style={{ boxShadow: "0 -10px 20px -3px rgba(0, 0, 0, 0.4), 0 -4px 6px -2px rgba(0, 0, 0, 0.3)" }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {assets && assets.map((asset, index) => (
                        <motion.div key={String(index)} variants={itemVariants}>
                            <Asset asset={asset} />
                            {index < assets.length - 1 && <span className="block border-b-1 border-cardBorder" />}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </Card>
        
        <div className="flex justify-center items-center mt-2">
                <span className="text-center text-[#515151]">
                    *You can withdraw your assets in{' '}
                    <Link isExternal
                    href="https://github.com/nextui-org/nextui"
                    showAnchorIcon>
                    Telegram Bot
                    </Link>
                </span>
            </div>
        </>
    );
}

export default PortfolioCard;
