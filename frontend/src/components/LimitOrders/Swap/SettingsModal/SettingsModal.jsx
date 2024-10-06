import React, { useRef } from "react";
import { Modal, ModalContent, Input, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { SlidersIcon } from "@primer/octicons-react";
import useSwapStore from "../useSwapStore";

export default function OrderSettingsModal() {
  const { slippage, setSlippage } = useSwapStore();
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const value = event.target.value.replace(/[^0-9.]/g, '');
    setSlippage(value);
  };

  const handleSlippageChange = (value) => {
    setSlippage(value);
  };

  const slippageOptions = [1, 5, 10];

  return (
    <>
      <Button isIconOnly variant="light" className="bg-card border-1 border-cardBorder" onPress={onOpen}>
        <SlidersIcon size={16} />
      </Button>

      <Modal isOpen={isOpen} size="sm" className="bg-modal text-white rounded-3xl" onOpenChange={onOpenChange} isDismissable={true} isKeyboardDismissDisabled={true} backdrop="opaque" placement="center">
        <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-xl">Settings</ModalHeader>
            <ModalBody>
                <p>Max. slippage</p>
                <Input
                  variant="bordered"
                  type="text"
                  color="primary"
                  label=""
                  placeholder=""
                  value={slippage}
                  ref={inputRef}
                  onChange={handleChange}
                  endContent="%"
                />
                <div className="flex items-center justify-around">
                  {slippageOptions.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleSlippageChange(option)}
                      className="bg-modalElement text-white flex-grow mx-1"
                    >
                      {option}%
                    </Button>
                  ))}
                </div>
            </ModalBody>
            <ModalFooter/>
        </ModalContent>
      </Modal>
    </>
  );
}
