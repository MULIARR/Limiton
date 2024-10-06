import React from 'react';
import { Spacer } from "@nextui-org/react";
import Swap from './Swap/Swap';
import Orders from './Orders/Orders';

const LimitOrders = () => {

  return (
    <div className='min-h-screen'>
      < Spacer y={3} />
      < Swap />
      < Spacer y={10} />
      < Orders />
    </div>
  );
}

export default LimitOrders;
