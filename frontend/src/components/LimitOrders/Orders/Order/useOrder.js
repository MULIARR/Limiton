import { useMutation } from 'react-query';
import { deleteOrder } from "../../../../api/api";

const useOrder = () => {
    const { mutate: deleteOrderById, isSuccess } = useMutation({
        mutationFn: (orderId) => deleteOrder(orderId),
    });

    return {
        deleteOrder: deleteOrderById,
        isSuccess
    }
}

export default useOrder;
