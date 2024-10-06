import React from "react";
import { useMutation } from 'react-query';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Avatar, Popover, PopoverTrigger, PopoverContent, Spacer } from "@nextui-org/react";
import { QuestionIcon } from "@primer/octicons-react";
import useAppStore from "../../../../App/useAppStore";
import { createOrder } from '../../../../api/api';
import useSwapStore from "../useSwapStore";

export default function ConfirmSwap () {
  const { user } = useAppStore();
  const { 
    isMainSwapButtonDisabled, getMainSwapButtonText, 
    sendJetton, receiveJetton, sendAmount, receiveAmount, 
    sendAmountRate, receiveAmountRate, 
    slippage, minimumReceived, profit, profitInUSD,
    isOrderDataReady
  } = useSwapStore();
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const orderData = {
    user_id: user.id,
    type: "Sell",
    send_token_address: sendJetton?.address,
    send_amount: Number(sendAmount),
    receive_token_address: receiveJetton?.address,
    receive_amount: Number(receiveAmount),
    slippage: slippage,
    minimum_to_receive_amount: Number(minimumReceived)
  };

  const { mutate: create } = useMutation(() => createOrder(orderData));

  const orderDataReady = isOrderDataReady();

  return (
    <div className="flex justify-center w-full">
      <Button
        radius="full"
        color="primary"
        size="lg"
        className={isMainSwapButtonDisabled() ? "w-full h-14 text-opacity-35 bg-opacity-35" : "w-full h-14"}
        disabled={isMainSwapButtonDisabled()}
        onPress={onOpen}
      >
        <span className="font-semibold">{getMainSwapButtonText()}</span>
      </Button>
        
      { orderDataReady && (
        <Modal isOpen={isOpen} size="sm" className="bg-modal text-white rounded-3xl" onOpenChange={onOpenChange} isDismissable={true} isKeyboardDismissDisabled={true} backdrop="blur" placement="center">
          <ModalContent>
            <ModalHeader className="flex text-xl">Confirm limit order</ModalHeader>
            <ModalBody className="gap-1">
              <div className="flex justify-between text-normalGray">
                <p>You send</p>
                <p>{sendAmountRate}$</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center rounded-full p-1 pr-4 bg-modalElement text-white">
                  <span className="pr-3"><Avatar src={sendJetton.image} /></span>
                  <p className="font-semibold text-lg">{sendJetton.symbol}</p>
                </div>
                <div className="text-2xl font-semibold">
                  {sendAmount}
                </div>
              </div>

              <span className="block border-b-1 border-cardBorder my-3" />

              <div className="flex justify-between text-normalGray">
                <p>You receive</p>
                <p>{receiveAmountRate}$</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center rounded-full p-1 pr-4 bg-modalElement text-white">
                  <span className="pr-3"><Avatar src={receiveJetton.image} /></span>
                  <p className="font-semibold text-lg p-0">{receiveJetton.symbol}</p>
                </div>
                <div className="text-2xl font-semibold">
                  {receiveAmount}
                </div>
              </div>

              <span className="block border-b-1 border-cardBorder my-3" />
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

              < Spacer y={1} />
              {profit.includes('+') ? 
              <div className="flex justify-between font-semibold text-lg">
                <p className="text-lightGray">Profit</p>
                <p className="text-customGreen"> <span className="underline">{profitInUSD}</span>$ ({profit})</p>
              </div> : null }

              <Button
                radius="xl"
                color="primary"
                size="lg"
                className="w-full h-12 mt-4"
                onPress={create}
              >
                <span className="font-semibold">Place limit order</span>
              </Button>
            </ModalBody>
            < Spacer y={3} />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
