import { useQuery } from 'react-query';
import { getEstimatedSwapOut, getPool, getSwapRates } from '../../../api/api';

const useFetchPool = (receiveJetton, sendJetton) => {
  return useQuery(
    ['pool', receiveJetton?.address, sendJetton?.address],
    () => getPool(receiveJetton.address, sendJetton.address),
    {
      refetchOnWindowFocus: false,
      enabled: !!receiveJetton && !!sendJetton,
    }
  );
};

const useEstimateSwap = (sendJetton, sendAmount, receiveJetton) => {
  return useQuery(
    ['estimateSwap', sendJetton?.address, sendAmount, receiveJetton?.address],
    () =>
      getEstimatedSwapOut(
        sendJetton.address,
        sendAmount,
        sendJetton.decimals,
        receiveJetton.address,
        receiveJetton.decimals
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !!sendAmount && !!sendJetton && !!receiveJetton,
    }
  );
};

const useGetSwapRates = (sendJetton, sendAmount, receiveJetton, receiveAmount ) => {
  return useQuery(
    ['swapRates', sendJetton?.address, sendAmount, receiveJetton?.address, receiveAmount],
    () =>
      getSwapRates(
        { address: sendJetton.address, amount: sendAmount },
        receiveJetton && receiveAmount !== null
          ? { address: receiveJetton.address, amount: receiveAmount }
          : null
      ),
    {
      enabled: !!sendAmount && !!receiveAmount && !!sendJetton && !!receiveJetton,
      refetchOnWindowFocus: false,
    }
  );
};

export { useFetchPool, useEstimateSwap, useGetSwapRates };
