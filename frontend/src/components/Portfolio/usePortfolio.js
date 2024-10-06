import { useQuery } from 'react-query';
import { getPortfolio } from '../../api/api';
import usePortfolioStore from './usePortfolioStore';
import { toast } from 'sonner';

const usePortfolio = (address) => {
  const { setPortfolio } = usePortfolioStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['portfolio', address],
    queryFn: () => getPortfolio(address),
    retry: 2,
    cacheTime: 0,
    onSuccess: (data) => {
      setPortfolio(data);
    },
    onError: (error) => {
      toast.error(`An error ocured: ${error.message}`);
    },
  });

  return {
    portfolio: data,
    isLoaded: !isLoading,
    fetchPortfolio: refetch,
  };
};

export default usePortfolio;
