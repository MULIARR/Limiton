import { useQuery } from 'react-query';
import { getOrders } from "../../../api/api";

const useOrders = (userId) => {
    const { data, isLoading, refetch, isSuccess } = useQuery({
        queryFn: () => getOrders(userId),
        queryKey: ['orders'],
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    return {
        orders: data, 
        isLoaded: !isLoading,
        fetchOrders: refetch,
        isSuccess: isSuccess
    }
}

export default useOrders;
