import { Schema, model, models } from "mongoose";
import { Product as ProductType } from "../utils/data";

export const ProductSchema = new Schema<ProductType>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model<ProductType>("Product", ProductSchema);

export default Product;
