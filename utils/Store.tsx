import { createContext, Dispatch, PropsWithChildren, useReducer } from "react";
import { Product } from "./data";

type stateType = {
  cart: {
    cartItems: Array<Product>;
  };
};

type actionType = {
  type: "CART_ADD_ITEM";
  payload: Product;
};

const initialState: stateType = {
  cart: { cartItems: [] },
};

function reducer(state: stateType, action: actionType): stateType {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem: Product = action.payload;
      const index: number = state.cart.cartItems.findIndex(
        (product) => product.slug === newItem.slug
      );
      let cartItems = state.cart.cartItems;

      //if index is -1, add quantity property to newItem, set it to 1 and push to cartItems
      if (index === -1) {
        newItem.quantity = 1;
        cartItems.push(newItem);
      } else {
        //if index is not -1, add 1 to its current quantity
        cartItems[index].quantity! += 1;
      }

      return { ...state, cart: { cartItems } };
    }

    default:
      return state;
  }
}

export const StoreContext = createContext({
  state: initialState,
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  dispatch: (arg: actionType): Dispatch<actionType> => {},
});

export function StoreProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    // @ts-ignore
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}