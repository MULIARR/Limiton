import React from 'react';
import { Spacer, Button, Skeleton } from "@nextui-org/react";
import { SyncIcon } from "@primer/octicons-react";
import PortfolioCard from './PortfolioCard/PortfolioCard';
import usePortfolio from './usePortfolio';
import usePortfolioStore from './usePortfolioStore';
import useAppStore from "../../App/useAppStore";
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';

const Portfolio = () => {
    const { user } = useAppStore();
    const { portfolio, isLoaded, fetchPortfolio } = usePortfolio(user.address);
    const { isIconRoating, setIsIconRoating } = usePortfolioStore();

    const handleClick = () => {
        setIsIconRoating(); 
        fetchPortfolio(); 
    };

    return (
        <div className='min-h-screen'>
            <Toaster 
                richColors 
                position="bottom-center" 
                theme="dark"
                toastOptions={{ className: 'border-2 rounded-2xl' }} 
            />
            <Spacer y={3} />
            <div className="ml-3 mr-3 flex justify-between items-end">
                <div className="flex items-end text-xl">
                    <span className="font-semibold">Wallet</span>
                </div> 
                <Button isIconOnly className="bg-card border-1 border-cardBorder" variant="light" onClick={handleClick}>
                    <motion.div
                        animate={{ rotate: isIconRoating ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SyncIcon size={16} className='mb-[1px]' />
                    </motion.div>
                </Button>
            </div>
            <Spacer y={2} />
            <Skeleton isLoaded={isLoaded} className='rounded-2xl h-40'>
                {isLoaded ? <PortfolioCard portfolio={portfolio} /> : ""}
            </Skeleton>
        </div>
    );
};

export default Portfolio;
