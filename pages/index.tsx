import { useContext } from "react";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import { Product as ProductType } from "../utils/data";
import db from "../utils/db";
import { StoreContext } from "../utils/Store";
import axios from "axios";
import { toast } from "react-toastify";

export async function getServerSideProps() {
  await db.connect();
  const products: ProductType[] = await Product.find().lean();
  return {
    props: {
      //@ts-ignore
      products: products.map((product) => db.convertDoc(product)),
    },
  };
}

export default function Home<T extends ProductType>({
  products,
}: {
  products: T[];
}) {
  const { state, dispatch } = useContext(StoreContext);

  async function addToCartHandler<T extends ProductType>(product: T) {
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
    <div>
      <Layout title='Homepage'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {products.map((product) => (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            />
          ))}
        </div>
      </Layout>
    </div>
  );
}
