import React, { useRef } from "react";
import { CreditCardIcon } from "@primer/octicons-react";
import { Avatar, Button, Spinner } from "@nextui-org/react";
import useSwapStore from "../useSwapStore";
import useTokenSelectionModalStore from "../useTokenSelectionModalStore";

export default function SendSection() {
  const {
    sendJetton,
    sendAmount, setSendAmount,
    sendAmountRate,
    isAmountRatesLoaded, setIsAmountRatesLoaded
} = useSwapStore();

  const { openTokenSelectionModal } = useTokenSelectionModalStore(); 
  
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const value = event.target.value.replace(/[^0-9.]/g, '');
    setSendAmount(value);
    setIsAmountRatesLoaded(false);
  };

  return (
    <div className="px-5 pt-5">
      <div className="flex justify-between text-normalGray">
        <p>You send</p>
        <div className="flex items-center">
          <CreditCardIcon size={16} className="mr-1" />
          <span>{sendJetton.balance}</span>
        </div>
      </div>
      <div className="flex justify-between items-center my-2">
        <div className="flex items-center">
          <Button
            variant="flat"
            radius="full"
            size="lg"
            className="flex items-center p-1 pr-4 bg-[#1c1c1c]"
            onClick={() => openTokenSelectionModal(true)}
          >
            <Avatar src={sendJetton.image} />
            <p className="font-semibold text-lg p-0">{sendJetton.symbol}</p>
          </Button>
        </div>
        <input
          type="text"
          placeholder="0"
          value={sendAmount}
          ref={inputRef}
          onChange={handleChange}
          className="placeholder-white w-full text-2xl font-semibold text-right bg-transparent border-none focus:outline-none focus:ring-0"
        />
      </div>
      <div className="flex justify-between text-normalGray">
        <p>{sendJetton.name}</p>
        <p>{isAmountRatesLoaded ? <span>{sendAmountRate}$</span> : <Spinner size="sm" color="default" className="max-h-1" />}</p>
      </div>
    </div>
  );
}
