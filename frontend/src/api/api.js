import axios from 'axios';
import { ENDPOINTS } from './endpoints';

export const getOrders = async (userId) => {
  try {
    const response = await axios.get(ENDPOINTS.GET_ORDERS(userId));
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(ENDPOINTS.CREATE_ORDER, orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(ENDPOINTS.DELETE_ORDER(orderId));
    return response.data;
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error);
    throw error;
  }
};


export const getPortfolio = async (address) => {
  try {
    const response = await axios.get(ENDPOINTS.GET_PORTFOLIO(address));
    return response.data;
  } catch (error) {
    throw error; 
  }
};


export const getJetton = async (address) => {
  try {
    const response = await axios.get(ENDPOINTS.GET_JETTON(address));
    return response.data;
  } catch (error) {
    console.error("Error fetching jetton:", error);
    throw error;
  }
};

export const getJettons = async (address) => {
  try {
    const response = await axios.get(ENDPOINTS.GET_JETTONS(address));
    return response.data;
  } catch (error) {
    console.error("Error fetching jettons:", error);
    throw error;
  }
};


export const getPool = async (sendJettonAddress, receiveJettonAddress) => {
  try {
    const response = await axios.get(ENDPOINTS.GET_POOL(sendJettonAddress, receiveJettonAddress));
    return response.data;
  } catch (error) {
    console.error("Error fetching pool:", error);
    throw error;
  }
};

export const getEstimatedSwapOut = async (sendJettonAddress, sendJettonAmount, sendAssetDecimals, receiveJettonAddress, receiveAssetDecimals) => {
  try {
    const response = await axios.get(ENDPOINTS.GET_ESTIMATED_SWAP(sendJettonAddress, sendJettonAmount, sendAssetDecimals, receiveJettonAddress, receiveAssetDecimals));
    return response.data;
  } catch (error) {
    console.error("Error estimating swap out:", error);
    throw error;
  }
};


export const getSwapRates = async (sendAsset, receiveAsset) => {
  try {
    const params = {
      send_asset_address: sendAsset.address,
      send_asset_amount: sendAsset.amount,
    };

    if (receiveAsset && receiveAsset.address && receiveAsset.amount !== null) {
      params.receive_asset_address = receiveAsset.address;
      params.receive_asset_amount = receiveAsset.amount;
    }

    const response = await axios.get(ENDPOINTS.GET_RATES_FOR_SWAP_ASSETS, { params });
    return response.data;
  } catch (error) {
    console.error('There was an error getting the rates!', error);
    return [];
  }
};


export const getOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(ENDPOINTS.GET_ORDER_DETAILS(orderId));
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for order ${orderId}:`, error);
    throw error;
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axios.put(ENDPOINTS.UPDATE_ORDER(orderId), orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};