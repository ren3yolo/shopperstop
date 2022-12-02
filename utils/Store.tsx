import { createContext, Dispatch, PropsWithChildren, useReducer } from "react";
import { Product } from "./data";
import Cookies from "js-cookie";

type stateType = {
  cart: {
    cartItems: Array<Product>;
  };
};

type actionType = {
  type: "CART_REMOVE_ITEM" | "CART_ADD_ITEM" | "CART_UPDATE_ITEM";
  payload: Product;
};

const initialState: stateType = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart")!)
    : { cartItems: [] },
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
      Cookies.set("cart", JSON.stringify({ cartItems }));
      return { ...state, cart: { ...state.cart, cartItems: [...cartItems] } };
    }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (product) => product.slug !== action.payload.slug
      );
      Cookies.set("cart", JSON.stringify({ cartItems }));
      return { ...state, cart: { cartItems: [...cartItems] } };
    }

    case "CART_UPDATE_ITEM": {
      const cartItems = state.cart.cartItems;
      const index = cartItems.findIndex(
        (product) => product.slug === action.payload.slug
      );
      if (index !== -1) {
        cartItems[index] = action.payload;
        Cookies.set("cart", JSON.stringify({ cartItems }));
        return { ...state, cart: { cartItems: [...cartItems] } };
      }

      return { ...state };
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
