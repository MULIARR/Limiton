import React from "react";
import useCartStore from "./useCartStore";

function TasksList() {
  const { cart, addItem, removeItem, incrementItemQuantity, decrementItemQuantity, clearCart, totalPrice } = useCartStore();

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.item} (Quantity: {item.quantity}) (Total: ${item.price * item.quantity}) {/* Считаем общую стоимость для каждого товара */}
            <button onClick={() => incrementItemQuantity(item.id)}>Increase</button>
            <button onClick={() => decrementItemQuantity(item.id)}>Decrease</button>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h2>Total Price: ${totalPrice}</h2> {/* Отображаем общую стоимость корзины */}
      <button onClick={() => addItem({ item: "lekker", id: Date.now(), quantity: 1, price: 10 })}>Add Item</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}

export default TasksList;
