import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { StoreContext } from "../utils/Store";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import axios from "axios";
import Cookies from "js-cookie";
import cart from "./cart";

export default function PlaceOrder() {
  const {
    state: {
      cart: { cartItems, shippingAddress, paymentMethod },
    },
    dispatch,
  } = useContext(StoreContext);
  const router = useRouter();

  function round(num: number) {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  }

  const itemsPrice: number = round(cartItems.reduce((a, c) => a + c.price!, 0));
  const shippingPrice: number = itemsPrice > 200 ? 0 : 15;
  const taxPrice: number = round(itemsPrice * 0.15);
  const totalPrice: number = round(itemsPrice + taxPrice + shippingPrice);

  const [loading, setLoading] = useState(false);

  async function placeOrderHandler() {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: "CART_RESET" });
      Cookies.set("cart", JSON.stringify({ ...cart, cartItems: [] }));
      router.push(`/order/${data._id}`);
    } catch (error) {
      toast.error(getError(error));
    }
  }

  useEffect(() => {
    if (!paymentMethod) router.push("/payment");
  }, [paymentMethod, router]);

  return (
    <Layout title='Place Order'>
      <CheckoutWizard activeStep={3} />
      <h1 className='mb-4 text-xl'>Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Shipping Address</h2>
              <div>
                {shippingAddress?.fullName}, {shippingAddress?.address},{" "}
                {shippingAddress?.city}, {shippingAddress?.postalCode},{" "}
                {shippingAddress?.country}
              </div>
              <div>
                <Link href='/shipping' className='link'>
                  Edit
                </Link>
              </div>
            </div>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href='/payment' className='link'>
                  Edit
                </Link>
              </div>
            </div>
            <div className='card overflow-x-auto p-5'>
              <h2>Order Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='p-5 text-right'>Quantity</th>
                    <th className='p-5 text-right'>Price</th>
                    <th className='p-5 text-right'>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image!}
                            alt={item.image!}
                            height={50}
                            width={50}
                          />
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{item.quantity}</td>
                      <td className='p-5 text-right'>{item.price}</td>
                      <td className='p-5 text-right'>
                        ${item.quantity! * item.price!}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href='/cart' className='link'>
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div className='card p-5'>
            <h2 className='mb-2 text-lg'>Order Summary</h2>
            <ul>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Items</div>
                  <div>$ {itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Tax</div>
                  <div>$ {taxPrice}</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Shipping</div>
                  <div>$ {shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className='mb-2 flex justify-between'>
                  <div>Total</div>
                  <div>$ {totalPrice}</div>
                </div>
              </li>
              <li>
                <button
                  disabled={loading}
                  onClick={placeOrderHandler}
                  className='primary-button w-full'
                >
                  {loading ? "Loading..." : "Place Order"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrder.auth = true;
