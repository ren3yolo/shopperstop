import Link from "next/link";
import Image from "next/image";
import React, { useContext } from "react";
import Layout from "../components/Layout";
import { StoreContext } from "../utils/Store";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Product } from "../utils/data";
import { NextRouter, useRouter } from "next/router";
import dynamic from "next/dynamic";

function Cart() {
  const router: NextRouter = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const {
    cart: { cartItems },
  } = state;

  function removeItem(item: Product): void {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  }

  function updateCart(item: Product, qty: string) {
    const quantity = Number(qty);
    dispatch({ type: "CART_UPDATE_ITEM", payload: { ...item, quantity } });
  }

  return (
    <Layout title='Shopping Cart'>
      <h1 className='mb-4 text-xl'>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <table className='min-w-full'>
              <thead className='border-b'>
                <tr>
                  <th className='text-left'>Item</th>
                  <th className='text-right'>Quantity</th>
                  <th className='text-right'>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className='border-b'>
                    <td>
                      <Link
                        href={`/product/${item.slug}`}
                        className='flex items-center'
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                      </Link>
                    </td>
                    <td className='text-right'>
                      <select
                        value={item.quantity}
                        onChange={(e) => updateCart(item, e.target.value)}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <p className='text-right'>
                        $ {item.price * item.quantity!}
                      </p>
                    </td>
                    <td className='p-5 text-center'>
                      <button onClick={() => removeItem(item)}>
                        <XCircleIcon className='h-7 w-7' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='card p-5'>
            <ul>
              <li>
                <div className='pb-3'>
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity!, 0)}) :
                  $ {cartItems.reduce((a, c) => a + c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  className='primary-button w-full'
                  onClick={() => router.push("/shipping")}
                >
                  Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
