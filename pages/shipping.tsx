import React, { useContext, useEffect } from "react";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import { useForm } from "react-hook-form";
import { StoreContext } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Shipping() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();
  const { state, dispatch } = useContext(StoreContext);
  const router = useRouter();
  const {
    cart: { shippingAddress },
  } = state;

  useEffect(() => {
    setValue("fullName", shippingAddress?.fullName);
    setValue("address", shippingAddress?.address);
    setValue("city", shippingAddress?.city);
    setValue("postalCode", shippingAddress?.postalCode);
    setValue("country", shippingAddress?.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...state.cart,
        shippingAddress: { fullName, address, city, postalCode, country },
      })
    );
    router.push("/payment");
  };

  return (
    <Layout title='Shipping'>
      <CheckoutWizard activeStep={1} />
      <form
        className='mx-auto max-w-screen-md'
        // @ts-ignore
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4'>Shipping Address</h1>
        <div className='mb-4'>
          <label htmlFor='fullName'>Full Name</label>
          <input
            className='w-full'
            id='fullName'
            autoFocus
            {...register("fullName", {
              required: "Please enter your full name",
            })}
          />
          {errors.fullName && (
            <div className='text-red-500'>
              {errors.fullName.message?.toString()}
            </div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='address'>Address</label>
          <input
            className='w-full'
            id='address'
            autoFocus
            {...register("address", {
              required: "Please enter your address",
              minLength: {
                value: 3,
                message: "Address is more than 3 chars",
              },
            })}
          />
          {errors.address && (
            <div className='text-red-500'>
              {errors.address.message?.toString()}
            </div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='city'>City</label>
          <input
            className='w-full'
            id='city'
            autoFocus
            {...register("city", {
              required: "Please enter your city",
            })}
          />
          {errors.city && (
            <div className='text-red-500'>
              {errors.city.message?.toString()}
            </div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='postalCode'>Postal Code</label>
          <input
            className='w-full'
            id='postalCode'
            autoFocus
            {...register("postalCode", {
              required: "Please enter your postal code",
            })}
          />
          {errors.postalCode && (
            <div className='text-red-500'>
              {errors.postalCode.message?.toString()}
            </div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='country'>Country</label>
          <input
            className='w-full'
            id='country'
            autoFocus
            {...register("country", {
              required: "Please enter your country",
            })}
          />
          {errors.country && (
            <div className='text-red-500'>
              {errors.country.message?.toString()}
            </div>
          )}
        </div>
        <div className='mb-4 flex justify-between'>
          <button className='primary-button'>Next</button>
        </div>
      </form>
    </Layout>
  );
}

Shipping.auth = true;
