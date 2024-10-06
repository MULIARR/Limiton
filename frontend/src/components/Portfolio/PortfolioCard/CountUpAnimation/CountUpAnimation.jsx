import React, { useState, useEffect } from 'react';
import usePortfolioStore from '../../usePortfolioStore';
import { animate } from 'framer-motion';

const CountUpAnimation = ({ to, duration = 0.5, decimals = 2 }) => {
    const [count, setCount] = useState(to);
    const { previousBalance } = usePortfolioStore((state) => state);

    useEffect(() => {
        if (previousBalance !== to) {
            const controls = animate(previousBalance, to, {
                duration: duration,
                onUpdate(value) {
                    setCount(value.toFixed(decimals));
                },
            });
            return () => controls.stop();
        } else {
            setCount(to.toFixed(decimals));
        }
    }, [previousBalance, to, duration, decimals]);

    return (
        <span>
            {count}
        </span>
    );
};


export default CountUpAnimation;