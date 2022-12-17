import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import axios from "axios";

interface Query extends ParsedUrlQuery {
  redirect?: string;
}

export default function Register() {
  const { data: session } = useSession();
  const router: NextRouter = useRouter();
  const { redirect }: Query = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({
    name,
    email,
    password,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(getError(error));
    }
  };

  return (
    <Layout title='Create Account'>
      <form
        className='mx-auto max-w-screen-md'
        // @ts-ignore
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='text-3xl mb-4'>Create Account</h1>
        <div className='mb-4'>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            {...register("name", { required: "Please enter name" })}
            className='w-full'
            autoFocus
          />
          {errors.name && (
            <div className='text-red-500'>
              {errors.name.message?.toString()}
            </div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            {...register("email", { required: "Please enter email" })}
            className='w-full'
            autoFocus
          />
          {errors.email && (
            <div className='text-red-500'>
              {errors.email.message?.toString()}
            </div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 3,
                message: "Password should be more than 5 characters",
              },
            })}
            type='password'
            className='w-full'
            autoFocus
          />
          {errors.password && (
            <div className='text-red-500'>
              {errors.password.message?.toString()}
            </div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='confirm-password'>Confirm Password</label>
          <input
            id='confirm-password'
            {...register("confirmpassword", {
              required: "Please enter password again",
              minLength: {
                value: 3,
                message: "Password should be more than 5 characters",
              },
              validate: (value) => value === getValues("password"),
            })}
            type='password'
            className='w-full'
            autoFocus
          />
          {errors.confirmpassword && (
            <div className='text-red-500'>
              {errors.confirmpassword.message?.toString()}
            </div>
          )}
          {errors.confirmpassword?.type === "validate" && (
            <div className='text-red-500'>Passwords do not match</div>
          )}
        </div>
        <div className='mb-4'>
          <button className='primary-button'>Register</button>
        </div>
      </form>
    </Layout>
  );
}
