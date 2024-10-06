import React from "react";
import { Accordion, AccordionItem, Spacer, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { QuestionIcon } from "@primer/octicons-react";
import useSwapStore from "../useSwapStore";

export default function SwapDetails() {
  const { slippage, minimumReceived, receiveJetton, profit, profitInUSD } = useSwapStore();
  
  return (
    <Accordion isCompact>
      <AccordionItem key="1" aria-label="" title="Swap Details" className="pt-2 px-5 pb-2">
        <div className="flex justify-between">
          <Popover placement="top" showArrow={true} color="foreground" backdrop="transparent">
            <PopoverTrigger>
              <p className="text-normalGray">
                Max. slippage <QuestionIcon size={16} />
              </p>
            </PopoverTrigger>
            <PopoverContent className="p-3">
              <p className="text-base">If the amount received from the swap<br/>changes unfavorably by more than {slippage}%<br/>during order execution, the order will<br/>be canceled.</p>
            </PopoverContent>
          </Popover>
          <p>{slippage}%</p>
        </div>
        
        <div className="flex justify-between">
          <p className="text-normalGray">Minimum received</p>
          <p>{minimumReceived} {receiveJetton.symbol}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-normalGray">Expiration Date</p>
          <p>1 Day</p>
        </div>

        < Spacer y={1} />
        {profit.includes('+') ? 
          <span>
            <span className="block border-b-1 my-2 border-cardBorder" />
            <div className="flex justify-between text-lg">
              <p className="text-white">Profit</p>
              <p className="text-customGreen font-semibold"> <span className="underline">{profitInUSD}</span>$ ({profit})</p>
            </div>
          </span> : '' }
        < Spacer y={2} />
      </AccordionItem>
    </Accordion>
  );
}
