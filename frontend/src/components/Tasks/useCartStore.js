import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: [
    {
      item: "apple",
      id: 0,
      quantity: 1,
      price: 12
    }
  ],
  addItem: (item) => set((state) => ({
    cart: [...state.cart, item]
  })),
  removeItem: (itemId) => set((state) => ({
    cart: state.cart.filter(i => i.id !== itemId)
  })),
  clearCart: () => set(() => ({ cart: [] })),

  incrementItemQuantity: (itemId) => set((state) => {
    const updatedCart = state.cart.map(i => 
      i.id === itemId ? {...i, quantity: i.quantity + 1} : i
    );

    const totalPrice = updatedCart.reduce((total, item) => total + item.price * item.quantity, 0);
  
    return {
      cart: updatedCart,
      totalPrice: totalPrice
    };
  }),

  decrementItemQuantity: (itemId) => set((state) => {
    const updatedCart = state.cart.map(i => 
      i.id === itemId && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
    );
  
    const totalPrice = updatedCart.reduce((total, item) => total + item.price * item.quantity, 0);
  
    return {
      cart: updatedCart,
      totalPrice: totalPrice
    };
  }),

  totalPrice: 12,

}));

export default useCartStore;
