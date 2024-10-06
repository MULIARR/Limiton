import React, { useEffect } from "react";
import { Button, Divider, Spacer } from "@nextui-org/react";
import { ArrowSwitchIcon, SyncIcon } from "@primer/octicons-react";
import { motion } from 'framer-motion';
import OrderSettingsModal from "./SettingsModal/SettingsModal";
import SendSection from "./SendSection/SendSection";
import ReceiveSection from "./ReceiveSection/ReceiveSection";
import SwapDetails from "./SwapDetails/SwapDetails";
import TokenSelectionModal from "./SelectTokenModal/SelectTokenModal";
import ConfirmSwap from "./ConfirmSwap/ConfirmSwap";

import useSwapStore from "./useSwapStore";
import { useFetchPool, useEstimateSwap, useGetSwapRates } from './useSwap';
import useTokenSelectionModalStore from "./useTokenSelectionModalStore";

export default function Swap() {
    const {
        receiveJetton,
        sendJetton,
        sendAmount,
        receiveAmount, setReceiveAmount,
        setSendAmountRate,
        setReceiveAmountRate,
        setProfit,
        setProfitInUSD,
        setIsAmountRatesLoaded,
        setReceiveSwapDataLoaded,
        setIsPoolExist,
        slippage, setSlippage,
        handleSwap,
        handleUpdateSwapButtonClick,
        calculateMinimumReceived,
        isUpdateButtonIconRoating,
        isSwapButtonIconRoating
    } = useSwapStore();
    
    const { data: poolExist } = useFetchPool(receiveJetton, sendJetton);
    const { data: estimatedSwap, refetch: estimateSwap } = useEstimateSwap(sendJetton, sendAmount, receiveJetton);
    const { data: swapRates } = useGetSwapRates(sendJetton, sendAmount, receiveJetton, receiveAmount);
    
    const { openTokenSelectionModal } = useTokenSelectionModalStore(); 

    useEffect(() => {
        if (poolExist !== undefined) {
          setIsPoolExist(poolExist);
        }
      }, [poolExist]);
    
    useEffect(() => {
        if (estimatedSwap !== undefined && estimatedSwap !== null) {
          setReceiveAmount(estimatedSwap);
          setReceiveSwapDataLoaded(true);
        }
    }, [estimatedSwap, setReceiveAmount, setReceiveSwapDataLoaded]);
    
    useEffect(() => {
        if (swapRates !== undefined) {
          setSendAmountRate(swapRates.send_amount_rate_in_usd);
          setReceiveAmountRate(swapRates.receive_amount_rate_in_usd);
          setProfitInUSD(swapRates.profit_in_usd);
          setProfit(swapRates.profit);
          setIsAmountRatesLoaded(true);
        }
    }, [swapRates]);
    
    useEffect(() => {
        if (receiveAmount != 0) {
          calculateMinimumReceived();
        }
    }, [receiveAmount, slippage]);

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
      <div className="text-white mx-auto">
        <div className="flex justify-between items-center mb-2 w-full">
          <div className="flex items-center w-full ml-3">
            <span className="text-xl font-semibold flex-shrink-0">Limit</span>
          </div>
          <div className="flex space-x-2 mr-3">
            <Button className="bg-card border-1 border-cardBorder" isIconOnly variant="light" onClick={() => handleUpdateSwapButtonClick(estimateSwap)}>
              <motion.div
                animate={{ rotate: isUpdateButtonIconRoating ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <SyncIcon size={16} className='mb-[1px]' />
              </motion.div>
            </Button>
            <OrderSettingsModal slippage={slippage} setSlippage={setSlippage} />
          </div>
        </div>
  
        <div className="border-1 border-cardBorder rounded-3xl bg-card">
          <SendSection/>
  
          {/* Divider with swap icon */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-cardBorder" />
            <div className="transform rotate-90">
              <Button isIconOnly variant="light" radius="full" onClick={handleSwap} className="border-cardBorder border-2">
                <motion.div
                  animate={{ rotate: isSwapButtonIconRoating ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowSwitchIcon size={16}/>
                </motion.div>
              </Button>
            </div>
            <div className="flex-grow border-t border-cardBorder" />
          </div>
  
          <div className="min-h-[130px]">
            {receiveJetton ? (
              <>
                <ReceiveSection/>
                {sendAmount && receiveAmount ?  
                  <motion.span
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                  >
                      <Divider />
                      <SwapDetails/>
                  </motion.span> : null}
              </>
            ) : (
              <div className="px-5 pb-5 flex items-center justify-center w-full">
                <Button
                  variant="light"
                  className="mt-8"
                  onClick={() => openTokenSelectionModal(false)}
                >
                  <span className="text-lg font-semibold">Select a Token</span>
                </Button>
              </div>
            )}
          </div>
        </div>
  
        <Spacer y={3} />
  
        <ConfirmSwap/>
  
        <TokenSelectionModal/>
      </div>
    );
  }
  