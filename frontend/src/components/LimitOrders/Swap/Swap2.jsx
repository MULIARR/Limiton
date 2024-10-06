import React, { useState, useEffect } from "react";
import { Button, Divider, Spacer } from "@nextui-org/react";
import { ArrowSwitchIcon, SyncIcon } from "@primer/octicons-react";
import { motion } from 'framer-motion';
import OrderSettingsModal from "./SettingsModal/SettingsModal";
import SendSection from "./SendSection/SendSection";
import ReceiveSection from "./ReceiveSection/ReceiveSection";
import SwapDetails from "./SwapDetails/SwapDetails";
import TokenSelectionModal from "./SelectTokenModal/SelectTokenModal";
import useDebounce from "../../../shared/utils/useDebounce";
import ConfirmSwap from "./ConfirmSwap/ConfirmSwap";

import { getEstimatedSwapOut, getPool, getSwapRates } from '../../../api/api';

import tonImage from "../../../assets/ton.png";

export default function Swap() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sendJetton, setSendJetton] = useState({
    address: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
    name: "Toncoin",
    symbol: "TON",
    balance: null,
    decimals: 9,
    image: tonImage,
  });
  const [receiveJetton, setReceiveJetton] = useState(null);

  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  const [sendAmountRate, setSendAmountRate] = useState(0);
  const [receiveAmountRate, setReceiveAmountRate] = useState(0);
  const [profitPercent, setProfitPercent] = useState(0);
  const [profitInUSD, setProfitInUSD] = useState(0);
  const [profit, setProfit] = useState('+0%');
  const [isAmountRatesLoaded, setIsAmountRatesLoaded] = useState(true);

  const [receiveSwapDataLoaded, setReceiveSwapDataLoaded] = useState(true);

  const [isSendSection, setIsSendSection] = useState(true);

  const [isPoolExist, setIsPoolExist] = useState(null);

  const [updateSwapButtonClicked, setUpdateSwapButtonClicked] = useState(false);
  const [isUpdateSwapButtonDisabled, setIsUpdateSwapButtonDisabled] = useState(false);

  const [slippage, setSlippage] = useState(5);
  const [minimumReceived, setMinimumReceived] = useState(null);

  const openModal = (isSend) => {
    setIsSendSection(isSend);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchPool = async () => {
    const poolExist = await getPool(receiveJetton.address, sendJetton.address);
    setIsPoolExist(poolExist)
  }

  const estimateSwap = async () => {
    setIsAmountRatesLoaded(false);
    const estimatedSwap = await getEstimatedSwapOut(sendJetton.address, sendAmount, sendJetton.decimals, receiveJetton.address, receiveJetton.decimals);
    setReceiveAmount(estimatedSwap)
    setReceiveSwapDataLoaded(true)
  }

  const debouncedEstimateSwap = useDebounce(estimateSwap, 1000);

  const getRatesForSwapAssets = async () => {
    setIsAmountRatesLoaded(false);

    const swapRates = await getSwapRates(
      { address: sendJetton.address, amount: sendAmount },
      receiveJetton && receiveAmount !== null ? { address: receiveJetton.address, amount: receiveAmount } : null
    );

    setSendAmountRate(swapRates.send_amount_rate_in_usd);
    setReceiveAmountRate(swapRates.receive_amount_rate_in_usd);

    setProfitPercent(swapRates.profit_percent);
    setProfitInUSD(swapRates.profit_in_usd);
    setProfit(swapRates.profit);
    
    setIsAmountRatesLoaded(true);
  };

  const debouncedFetchRatesForSwapAssets = useDebounce(getRatesForSwapAssets, 1250);

  useEffect(() => {
    if (sendAmount > 0 && receiveAmount > 0 && isPoolExist) {
      debouncedFetchRatesForSwapAssets();
    }
  }, [sendAmount, receiveAmount, isPoolExist, updateSwapButtonClicked]);

  const debouncedFetchPool = useDebounce(fetchPool, 700);

  useEffect(() => {
    if (receiveJetton && sendJetton) {
      debouncedFetchPool();

      if (sendAmount > 0) {
        debouncedEstimateSwap();
      }
    }
  }, [receiveJetton, sendJetton]);

  /* 
  trigger to clean receive amount after ...
  */
  useEffect(() => {
    if (sendAmount == 0) {
      setReceiveAmount("")
      setReceiveSwapDataLoaded(true)

      setSendAmountRate(0)
      setReceiveAmountRate(0)
      setProfit('+0%')
      setIsAmountRatesLoaded(true)
    }
  }, [sendAmount]);

  useEffect(() => {
    if (sendAmount > 0 && isPoolExist) {
      setReceiveSwapDataLoaded(false)
      debouncedEstimateSwap();
      return
    }

    if (sendAmount > 0) {
      debouncedFetchRatesForSwapAssets();
    }
  }, [isPoolExist, sendAmount, updateSwapButtonClicked]);


  const handleSelectAsset = (asset) => {
    if (isSendSection) {
      setSendJetton(asset);
    } else {
      setReceiveJetton(asset);
    }
    closeModal();
  };

  const handleSwap = () => {
    if (receiveJetton) {

      if (sendAmount > 0) {
        setIsAmountRatesLoaded(false);
      }
      setSendJetton(receiveJetton);
      setReceiveJetton(sendJetton);
      setSendAmount(receiveAmount);
      setReceiveAmount(sendAmount);
    }
  };

  const getConfirmSwapButtonText = () => {
    if (!receiveJetton) {
      return "Select Receive Token";
    }
    if (!isPoolExist) {
      return "Liquidity pool not found"
    }
    if (!sendAmount || parseFloat(sendAmount) === 0 || !receiveAmount || parseFloat(receiveAmount) === 0) {
      return "Enter Amount";
    }
    return "Swap";
  };

  const isSwapButtonDisabled = () => {
    if (!receiveJetton) {
      return true;
    }
    if (!isPoolExist) {
      return true;
    }
    if (!receiveJetton || !sendAmount || parseFloat(sendAmount) === 0 || !receiveAmount || parseFloat(receiveAmount) === 0) {
      return true;
    }
    return false;
  };

  const handleUpdateSwapButtonClick = () => {
    if (!isUpdateSwapButtonDisabled) {
      setUpdateSwapButtonClicked(prevState => !prevState);
      setIsUpdateSwapButtonDisabled(true);

      setTimeout(() => {
        setIsUpdateSwapButtonDisabled(false);
      }, 6000);
    }
  };

  function calculateMinimumReceived() {
    const amount = Number(receiveAmount);
    const slip = Number(slippage);
  
    const amountToSubtract = (amount * slip) / 100;
    const result = parseFloat((amount - amountToSubtract).toFixed(3));
  
    setMinimumReceived(result);
  }
  useEffect(() => {
    if (receiveAmount != 0) {
      calculateMinimumReceived()
    }
  }, [receiveAmount, slippage]);

  const isButtonDisabled = isSwapButtonDisabled();
  const swapButtonText = getConfirmSwapButtonText();

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
          <span className="text-xl font-semibold flex-shrink-0">Create Order</span>
        </div>
        <div className="flex space-x-2 mr-3">
          <Button className="bg-card border-1 border-cardBorder" isIconOnly variant="flat" onClick={handleUpdateSwapButtonClick}>
            <SyncIcon size={16} />
          </Button>
          <OrderSettingsModal slippage={slippage} setSlippage={setSlippage} />
        </div>
      </div>

      <div className="border-1 border-cardBorder rounded-3xl bg-card">
        <SendSection
          openModal={() => openModal(true)}
          sendJetton={sendJetton}
          sendAmount={sendAmount}
          setSendAmount={setSendAmount}
          sendAmountRate={sendAmountRate}
          isAmountRatesLoaded={isAmountRatesLoaded}
          setIsAmountRatesLoaded={setIsAmountRatesLoaded}
        />

        {/* Divider with swap icon */}
        <div className="flex items-center">
          <div className="flex-grow border-t border-cardBorder" />
          <div className="transform rotate-90">
            <Button isIconOnly variant="bordered" radius="full" onClick={handleSwap} className="border-cardBorder">
              <ArrowSwitchIcon size={16} className="transform transition-transform duration-300 hover:rotate-180" />
            </Button>
          </div>
          <div className="flex-grow border-t border-cardBorder" />
        </div>

        <div className="min-h-[130px]">
          {receiveJetton ? (
            <>
              <ReceiveSection
                openModal={() => openModal(false)}
                receiveJetton={receiveJetton}
                receiveAmount={receiveAmount}
                setReceiveAmount={setReceiveAmount}
                receiveSwapDataLoaded={receiveSwapDataLoaded}
                receiveAmountRate={receiveAmountRate}
                isAmountRatesLoaded={isAmountRatesLoaded}
                setIsAmountRatesLoaded={setIsAmountRatesLoaded}
                profit={profit}
              />
              {sendAmount && receiveAmount ?  
                <motion.span
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                >
                    <Divider />
                    <SwapDetails 
                        slippage={slippage} 
                        minimumReceived={minimumReceived}
                        receiveJettonSymbol={receiveJetton.symbol}
                        profit={profit}
                        profitInUSD={profitInUSD}
                    />
                </motion.span> : null}
            </>
          ) : (
            <div className="px-5 pb-5 flex items-center justify-center w-full">
              <Button
                variant="light"
                className="mt-8"
                onClick={() => openModal(false)}
              >
                <span className="text-lg font-semibold">Select a Token</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <Spacer y={3} />

      <ConfirmSwap 
        isButtonDisabled={isButtonDisabled} 
        swapButtonText={swapButtonText} 
        sendJetton={sendJetton}
        receiveJetton={receiveJetton}
        sendAmount={sendAmount}
        receiveAmount={receiveAmount}
        sendAmountRate={sendAmountRate}
        receiveAmountRate={receiveAmountRate}
        slippage={slippage}
        minimumReceived={minimumReceived}
        profit={profit}
        profitInUSD={profitInUSD}
      />

      <TokenSelectionModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        onSelectAsset={handleSelectAsset}
        sendJetton={sendJetton}
        receiveJetton={receiveJetton}
      />
    </div>
  );
}
