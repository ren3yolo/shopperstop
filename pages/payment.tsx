import { useRouter } from "next/router";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { StoreContext } from "../utils/Store";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const paymentModes: Array<string> = ["Paypal", "Cash on delivery"];

export default function Payment() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const { state, dispatch } = useContext(StoreContext);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const router = useRouter();

  useEffect(() => {
    if (!shippingAddress?.address) {
      router.push("/shipping");
    }

    setSelectedPaymentMethod(paymentMethod || "");
  }, [shippingAddress?.address, paymentMethod, router]);

  function submitHandler(e: FormEvent) {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      return toast.error("A payment method is required");
    }
    // @ts-ignore
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({ ...state.cart, paymentMethod: selectedPaymentMethod })
    );

    router.push("/placeorder");
  }

  return (
    <Layout title='Payment'>
      <CheckoutWizard activeStep={2} />
      <form onSubmit={submitHandler}>
        <h1>Payment Method</h1>
        {paymentModes.map((mode) => (
          <div key={mode} className='mb-4'>
            <input
              type='radio'
              name='paymentMethod'
              id={mode}
              checked={selectedPaymentMethod === mode}
              onChange={() => setSelectedPaymentMethod(mode)}
              className='p-2 outline-none focus:ring-2'
            />
            <label htmlFor={mode} className='p-2'>
              {mode}
            </label>
          </div>
        ))}
        <div className='mb-5 flex justify-between'>
          <button
            onClick={() => router.push("/shipping")}
            type='button'
            className='default-button'
          >
            Back
          </button>
          <button className='primary-button'>Next</button>
        </div>
      </form>
    </Layout>
  );
}

Payment.auth = true;
