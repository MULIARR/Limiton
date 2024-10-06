import { create } from 'zustand';

const useTokenSelectionModalStore = create((set, get) => ({
  selectionJettons: [],
  isJettonsLoaded: false,

  isTokenSelectionModalOpen: false,
  isSendSection: true,

  setIsJettonsLoaded: (isLoaded) => set({ isJettonsLoaded: isLoaded }),
  setSelectionJettons: (jettons) => set({ selectionJettons: jettons }),
  openTokenSelectionModal: (isSend) => set({ isSendSection: isSend, isTokenSelectionModalOpen: true }),
  closeTokenSelectionModal: () => set({ isTokenSelectionModalOpen: false }),

  // Functions
  onSelectAsset: (jetton, setSendJetton, setReceiveJetton) => {
    const { isSendSection, closeTokenSelectionModal } = get();

    if (isSendSection) {
      setSendJetton(jetton)
      closeTokenSelectionModal()
    }
    else {
      setReceiveJetton(jetton)
      closeTokenSelectionModal()
    }
  },

}));

export default useTokenSelectionModalStore;
