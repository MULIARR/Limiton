import { create } from 'zustand';

const usePortfolioStore = create((set) => ({
  portfolio: null,
  previousBalance: 0,
  isIconRoating: false,
  setPortfolio: (portfolio) => set((state) => {
    const prevBalance = state.portfolio ? state.portfolio.total_balance : 0;
    return { portfolio, previousBalance: prevBalance };
  }),
  setIsIconRoating: () => set((state) => ({ isIconRoating: !state.isIconRoating })),
}));

export default usePortfolioStore;
