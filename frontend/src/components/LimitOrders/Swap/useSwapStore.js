import { create } from 'zustand';
import TONImage from "../../../assets/ton.png";

const useSwapStore = create((set, get) => ({
  // States
  sendJetton: {
    address: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
    name: "Toncoin",
    symbol: "TON",
    balance: null,
    decimals: 9,
    image: TONImage,
  },
  receiveJetton: null,
  sendAmount: "",
  receiveAmount: "",
  sendAmountRate: 0,
  receiveAmountRate: 0,
  profitPercent: 0,
  profitInUSD: 0,
  profit: '+0%',
  isAmountRatesLoaded: true,
  receiveSwapDataLoaded: true,
  isPoolExist: null,
  slippage: 5,
  minimumReceived: null,

  updateSwapButtonClicked: false,
  isUpdateSwapButtonDisabled: false,

  isUpdateButtonIconRoating: false,
  isSwapButtonIconRoating: false,

  // Manage States
  setSendJetton: (jetton) => set({ sendJetton: jetton }),
  setReceiveJetton: (jetton) => set({ receiveJetton: jetton }),
  setSendAmount: (amount) => set({ sendAmount: amount }),
  setReceiveAmount: (amount) => set({ receiveAmount: amount }),
  setSendAmountRate: (rate) => set({ sendAmountRate: rate }),
  setReceiveAmountRate: (rate) => set({ receiveAmountRate: rate }),
  setProfitPercent: (percent) => set({ profitPercent: percent }),
  setProfitInUSD: (usd) => set({ profitInUSD: usd }),
  setProfit: (profit) => set({ profit }),
  setIsAmountRatesLoaded: (isLoaded) => set({ isAmountRatesLoaded: isLoaded }),
  setReceiveSwapDataLoaded: (isLoaded) => set({ receiveSwapDataLoaded: isLoaded }),
  setIsPoolExist: (exist) => set({ isPoolExist: exist }),
  setUpdateSwapButtonClicked: (clicked) => set({ updateSwapButtonClicked: clicked }),
  setIsUpdateSwapButtonDisabled: (disabled) => set({ isUpdateSwapButtonDisabled: disabled }),
  setSlippage: (slippage) => set({ slippage }),
  setMinimumReceived: (minReceived) => set({ minimumReceived: minReceived }),
  setIsUpdateButtonIconRoating: () => set((state) => ({ isUpdateButtonIconRoating: !state.isUpdateButtonIconRoating })),
  setIsSwapButtonIconRoating: () => set((state) => ({ isSwapButtonIconRoating: !state.isSwapButtonIconRoating })),

  // Functions
  handleSwap: () => {
    const { receiveJetton, sendJetton, sendAmount, receiveAmount, setIsAmountRatesLoaded, setSendJetton, setReceiveJetton, setSendAmount, setReceiveAmount, setIsSwapButtonIconRoating } = get();
    if (receiveJetton) {
      if (sendAmount > 0) {
        setIsAmountRatesLoaded(false);
      }
      setIsSwapButtonIconRoating()
      setSendJetton(receiveJetton);
      setReceiveJetton(sendJetton);
      setSendAmount(receiveAmount);
      setReceiveAmount(sendAmount);
    }
  },

  getMainSwapButtonText: () => {
    const { receiveJetton, isPoolExist, sendAmount, receiveAmount } = get();
    if (!receiveJetton) {
      return "Select receive token";
    }
    if (!isPoolExist) {
      return "Liquidity pool not found";
    }
    if (!sendAmount || parseFloat(sendAmount) === 0 || !receiveAmount || parseFloat(receiveAmount) === 0) {
      return "Enter amount";
    }
    return "Confirm limit order";
  },

  isMainSwapButtonDisabled: () => {
    const { receiveJetton, isPoolExist, sendAmount, receiveAmount } = get();
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
  },

  handleUpdateSwapButtonClick: (estimateSwap) => {
    const { isUpdateSwapButtonDisabled, setUpdateSwapButtonClicked, setIsUpdateSwapButtonDisabled, setIsUpdateButtonIconRoating } = get();
    if (!isUpdateSwapButtonDisabled) {
      setUpdateSwapButtonClicked((prevState) => !prevState);
      setIsUpdateSwapButtonDisabled(true);
      setIsUpdateButtonIconRoating()

      estimateSwap()

      setTimeout(() => {
        setIsUpdateSwapButtonDisabled(false);
      }, 6000);
    }
  },

  calculateMinimumReceived: () => {
    const { receiveAmount, slippage, setMinimumReceived } = get();
    const amount = Number(receiveAmount);
    const slip = Number(slippage);

    const amountToSubtract = (amount * slip) / 100;
    const result = parseFloat((amount - amountToSubtract).toFixed(3));

    setMinimumReceived(result);
  },

  isOrderDataReady: () => {
    const { sendJetton, receiveJetton, sendAmount, receiveAmount, receiveAmountRate, sendAmountRate, slippage, minimumReceived, profit, profitInUSD} = get();
  
    return (
      sendJetton != null &&
      receiveJetton != null &&
      sendAmount !== undefined &&
      sendAmount !== null &&
      receiveAmount !== undefined &&
      receiveAmount !== null &&
      receiveAmountRate !== undefined &&
      receiveAmountRate !== null &&
      sendAmountRate !== undefined &&
      sendAmountRate !== null &&
      slippage !== undefined &&
      slippage !== null &&
      minimumReceived !== undefined &&
      minimumReceived !== null &&
      profit !== undefined &&
      profit !== null &&
      profitInUSD !== undefined &&
      profitInUSD !== null
    );
  },


}));

export default useSwapStore;