import bcrypt from "bcryptjs";

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export type Product = {
  name?: string;
  slug?: string;
  category?: string;
  image?: string;
  price?: number;
  brand?: string;
  rating?: number;
  numReviews?: number;
  countInStock?: number;
  description?: string;
  quantity?: number;
};

export type User = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  emailVerified?: Date | null;
};

type Data = {
  products: Product[];
  users: User[];
};

export const data: Data = {
  users: [
    {
      name: "Raj",
      email: "raj.shekhar@gmail.com",
      password: bcrypt.hashSync("12345"),
      isAdmin: true,
    },
  ],
  products: [
    {
      name: "Free Shirt",
      slug: "free-shirt",
      category: "Shirts",
      image: "/images/shirt1.jpg",
      price: 70,
      brand: "Nike",
      rating: 4.7,
      numReviews: 23,
      countInStock: 20,
      description: "A popular shirt",
    },
    {
      name: "Fit Shirt",
      slug: "fit-shirt",
      category: "Shirts",
      image: "/images/shirt2.jpg",
      price: 70,
      brand: "Nike",
      rating: 4.7,
      numReviews: 23,
      countInStock: 20,
      description: "A popular shirt",
    },
    {
      name: "Slim Shirt",
      slug: "slim-shirt",
      category: "Shirts",
      image: "/images/shirt3.jpg",
      price: 70,
      brand: "Raymond",
      rating: 4.7,
      numReviews: 23,
      countInStock: 20,
      description: "A popular shirt",
    },
    {
      name: "Golf Pants",
      slug: "golf-pants",
      category: "Pants",
      image: "/images/pants1.jpg",
      price: 70,
      brand: "Van Heusen",
      rating: 4.7,
      numReviews: 23,
      countInStock: 20,
      description: "A popular golf pant",
    },
    {
      name: "Chinos",
      slug: "chinos",
      category: "Pants",
      image: "/images/pants2.jpg",
      price: 70,
      brand: "Van Heusen",
      rating: 4.3,
      numReviews: 23,
      countInStock: 20,
      description: "A popular chino",
    },
  ],
};
