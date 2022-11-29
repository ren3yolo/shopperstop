import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";
import { ParsedUrlQuery } from "querystring";
import React, { useContext } from "react";
import Layout from "../../components/Layout";
import { data, Product } from "../../utils/data";
import { StoreContext } from "../../utils/Store";

export default function ProductScreen() {
  const { state, dispatch } = useContext(StoreContext);
  console.log(state);
  const router: NextRouter = useRouter();
  const query: ParsedUrlQuery = router.query;
  const slug = query.slug;

  // @ts-ignore
  const product: Product = data.products.find(
    (product) => product.slug === slug
  );

  if (!product)
    return (
      <Layout title='Not found'>
        <div>Product not found</div>
      </Layout>
    );

  function addToCartHandler(): void {
    const currentQty: number = product.quantity!;
    if (product.countInStock <= currentQty) {
      alert("Sorry ! Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: product });
  }

  return (
    <Layout title={product.name}>
      <div className='py-2'>
        <Link href={`/`}>back to products</Link>
      </div>

      <div className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout='responsive'
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className='text-lg'>{product.name}</h1>
            </li>
            <li>Category {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews.toString()} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <div>Price</div>
              <div>${product.price.toString()}</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In stock" : "Unavailable"}</div>
            </div>
            <button
              className='primary-button w-full'
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
