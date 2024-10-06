import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spacer, Input, Spinner } from "@nextui-org/react";
import { SearchIcon, XIcon } from "@primer/octicons-react";
import Token from './Token/Token';
import useTokenSelectionModalStore from "../useTokenSelectionModalStore";
import useSwapStore from "../useSwapStore";
import useAppStore from "../../../../App/useAppStore";
import { useJettons, useJetton } from "./useTokenSelectionModal";

/**
* The `TokenSelectionModal` component is responsible for displaying a modal window for selecting tokens.
*
* Main logic:
* - When the modal window is opened, an API request is made to get a list of tokens associated with the user's address.
* - If the user enters the address of a specific token in the search bar, a request is sent to get data on this token.
* - The received data is saved in the Zustand store for further use and display in the component.
*
* Zustand Store:
* - `selectionJettons` is the list of tokens displayed in the modal window.
* - `isJettonsLoaded` is the token loading state.
* - `isTokenSelectionModalOpen` is the open/closed state of the modal window.
* - The `setSelectionJettons` and `setIsJettonsLoaded` methods are used to update the state based on the results of the API requests.
*
* Hooks:
* - `useJettons(accountAddress, isEnabled)` — a hook that performs a request to get all tokens for the specified user address. The request is performed only when the modal window is open (`isEnabled`).
* - `useJetton(jettonAddress, isEnabled)` — a hook that performs a request to get data for a specific token if the user enters its address in the search bar. The request is also performed only when the modal window is open and the entered address is long enough.
*/

export default function TokenSelectionModal() {
    const { user } = useAppStore();
    const { receiveJetton, sendJetton } = useSwapStore();
    const { selectionJettons, isTokenSelectionModalOpen, closeTokenSelectionModal, isJettonsLoaded } = useTokenSelectionModalStore();

    const [searchText, setSearchText] = useState("");

    useJettons(user.address, isTokenSelectionModalOpen);
    useJetton(searchText, searchText.length > 20 && isTokenSelectionModalOpen);

    useEffect(() => {
        if (!isTokenSelectionModalOpen) {
            setSearchText("");
        }
    }, [isTokenSelectionModalOpen]);

    const handleSearchChange = (event) => {
        const jettonAddress = event.target.value;
        setSearchText(jettonAddress);
    };

    const handleClearButton = () => {
        setSearchText("");
    }

    const filteredJettons = selectionJettons.filter(jetton => jetton.address !== sendJetton.address && (!receiveJetton || jetton.address !== receiveJetton.address));

    return (
        <Modal isOpen={isTokenSelectionModalOpen} isDismissable={true} onClose={closeTokenSelectionModal} size="sm" placement="center" className="bg-modal text-white rounded-3xl">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-xl">Select Token</ModalHeader>
                {isJettonsLoaded ? (
                    <ModalBody>
                        <Input
                            variant="bordered"
                            type="text"
                            color="primary"
                            label=""
                            placeholder="Paste contract address"
                            value={searchText}
                            onChange={handleSearchChange}
                            startContent={
                                <SearchIcon size={16} />
                            }
                            endContent={
                                <Button
                                    isIconOnly
                                    size="sm"
                                    radius="full"
                                    variant="light"
                                    onClick={handleClearButton}
                                    className="text-white"
                                >
                                    <XIcon size={16} />
                                </Button>
                            }
                        />
                        <div>
                            {filteredJettons.length > 0 ? (
                                filteredJettons.map((jetton, index) => 
                                    <div key={String(index)}>
                                        <Token jetton={jetton}/>
                                        {index < filteredJettons.length - 1 && <Spacer y={2} />}
                                    </div>
                                )
                            ) : (
                                <p className="text-center mt-5">Nothing found</p>
                            )}
                        </div>
                    </ModalBody>
                ) : (
                    <Spinner color="default" className="flex justify-center items-center mt-5" />
                )}
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}