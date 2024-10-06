import { useQuery } from 'react-query';
import { getJettons, getJetton } from "../../../../api/api";
import useTokenSelectionModalStore from '../useTokenSelectionModalStore';

const useJettons = (accountAddress, isEnabled) => {
    const { setSelectionJettons, setIsJettonsLoaded } = useTokenSelectionModalStore();

    return useQuery({
        queryFn: () => getJettons(accountAddress),
        queryKey: ['tokens', accountAddress],
        enabled: isEnabled, // The request will only be executed when the modal is open
        onSuccess: (data) => {
            setSelectionJettons(data);
            setIsJettonsLoaded(true);
        },
        onError: () => {
            setIsJettonsLoaded(false);
        },
    });
}

const useJetton = (jettonAddress, isEnabled) => {
    const { setSelectionJettons, setIsJettonsLoaded } = useTokenSelectionModalStore();

    return useQuery({
        queryFn: () => getJetton(jettonAddress),
        queryKey: ['token', jettonAddress],
        enabled: isEnabled, // The request will only be executed if the token address is long.
        onSuccess: (data) => {
            setSelectionJettons([data]);
            setIsJettonsLoaded(true);
        },
        onError: () => {
            setIsJettonsLoaded(false);
        },
    });
}

export { useJettons, useJetton };
