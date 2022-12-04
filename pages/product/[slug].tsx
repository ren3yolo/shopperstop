import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";
import { ParsedUrlQuery } from "querystring";
import React, { useContext } from "react";
import Layout from "../../components/Layout";
import { data, Product as ProductType } from "../../utils/data";
import { StoreContext } from "../../utils/Store";
import db from "../../utils/db";
import Product from "../../models/Product";
import { NextPageContext } from "next";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProductScreen({ product }) {
  const { state, dispatch } = useContext(StoreContext);
  const router: NextRouter = useRouter();
  const query: ParsedUrlQuery = router.query;
  const slug = query.slug;

  if (!product)
    return (
      <Layout title='Not found'>
        <div>Product not found</div>
      </Layout>
    );

  async function addToCartHandler() {
    const { data }: { data: ProductType } = await axios.get(
      `/api/products/${product._id}`
    );
    const existItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    const currentQty: number = existItem?.quantity ? existItem.quantity + 1 : 1;
    if (data.countInStock! < currentQty) {
      toast.error("Sorry ! Product is out of stock");
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

export async function getServerSideProps(context: NextPageContext) {
  const {
    query: { slug },
  } = context;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  console.log(product);
  return {
    props: {
      product: product ? db.convertDoc(product) : null,
    },
  };
}
