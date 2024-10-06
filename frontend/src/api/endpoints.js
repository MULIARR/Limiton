export const API_BASE_URL = 'http://127.0.0.1:8007/api';

export const ENDPOINTS = Object.freeze({
  GET_PORTFOLIO: (address) => `${API_BASE_URL}/accounts/portfolio/${address}`,
  GET_ORDERS: (userId) =>  `${API_BASE_URL}/orders/all/${userId}`,
  GET_JETTONS: (address) => `${API_BASE_URL}/jettons/${address}/all`,

  GET_JETTON: (address) => `${API_BASE_URL}/jettons/jetton/${address}`,
  GET_POOL: (sendJettonAddress, receiveJettonAddress) => `${API_BASE_URL}/pools/is_exist/${sendJettonAddress}/${receiveJettonAddress}`,

  GET_ESTIMATED_SWAP: (sendJettonAddress, sendJettonAmount, sendAssetDecimals, receiveJettonAddress, receiveAssetDecimals) =>
    `${API_BASE_URL}/pools/estimate_swap_out?send_jetton_address=${sendJettonAddress}&send_jetton_amount=${sendJettonAmount}&send_asset_decimals=${sendAssetDecimals}&receive_jetton_address=${receiveJettonAddress}&receive_asset_decimals=${receiveAssetDecimals}`,

  GET_RATES_FOR_SWAP_ASSETS: `${API_BASE_URL}/jettons/get_rates`,

  GET_ORDER_DETAILS: (orderId) => `${API_BASE_URL}/orders/${orderId}`,
  

  CREATE_ORDER: `${API_BASE_URL}/orders/create`,

  UPDATE_ORDER: (orderId) => `${API_BASE_URL}/orders/${orderId}`,
  DELETE_ORDER: (orderId) => `${API_BASE_URL}/orders/${orderId}`,
});
