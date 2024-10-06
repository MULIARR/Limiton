import React, { useRef } from "react";
import { CreditCardIcon } from "@primer/octicons-react";
import { Avatar, Button, Spinner } from "@nextui-org/react";
import useSwapStore from "../useSwapStore";
import useTokenSelectionModalStore from "../useTokenSelectionModalStore";

export default function ReceiveSection() {
  const {
    receiveJetton,
    receiveAmount, setReceiveAmount,
    receiveAmountRate,
    profit,
    isAmountRatesLoaded, setIsAmountRatesLoaded,
    receiveSwapDataLoaded,
} = useSwapStore();

  const { openTokenSelectionModal } = useTokenSelectionModalStore(); 
  
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const value = event.target.value.replace(/[^0-9.]/g, '');
    setReceiveAmount(value);
    setIsAmountRatesLoaded(false);
  };

  return (
    <div className="px-5 pb-5">
      <div className="flex justify-between text-normalGray">
        <p>You Receive</p>
        <div className="flex items-center">
          <CreditCardIcon size={16} className="mr-1" />
          <p>{receiveJetton.balance}</p>
        </div>
      </div>
      <div className="flex justify-between items-center my-2">
        <div className="flex items-center">
          <Button
            variant="flat"
            radius="full"
            size="lg"
            className="flex items-center p-1 pr-4 bg-[#1c1c1c]"
            onClick={() => openTokenSelectionModal(false)}
          >
            <Avatar src={receiveJetton.image} />
            <p className="font-semibold text-lg p-0">{receiveJetton.symbol}</p>
          </Button>
        </div>
            {receiveSwapDataLoaded ? <input
              type="text"
              placeholder="0"
              value={receiveAmount}
              ref={inputRef}
              onChange={handleChange}
              className="placeholder-white w-full text-2xl font-semibold text-right bg-transparent border-none focus:outline-none focus:ring-0"
            /> : <Spinner size="md" color="default" />}
      </div>
      <div className="flex justify-between text-normalGray">
        <p>{receiveJetton.name}</p>
        <p>{isAmountRatesLoaded ? <span>{receiveAmountRate}$<span className={profit.includes('-') ? "ml-2 text-customRed font-semibold" : " ml-2 text-customGreen font-semibold"}>({profit})</span></span> : <Spinner size="sm" color="default" className="max-h-2" />}</p>
      </div>
    </div>
  );
}
