import Link from "next/link";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

interface Query extends ParsedUrlQuery {
  redirect?: string;
}

export default function Login() {
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
    formState: { errors },
  } = useForm();

  const submitHandler = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
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
    <Layout title='Login'>
      <form
        className='mx-auto max-w-screen-md'
        // @ts-ignore
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='text-3xl mb-4'>Login</h1>
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
          <button className='primary-button'>Login</button>
        </div>
        <div className='mb-4'>
          <p>
            {" "}
            Don&apos;t have an account? &nbsp;
            <Link href='/' className='link'>
              Register
            </Link>{" "}
          </p>
        </div>
      </form>
    </Layout>
  );
}
