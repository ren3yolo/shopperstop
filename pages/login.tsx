import Link from "next/link";
import React from "react";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    console.log(email, password);
  };

  return (
    <Layout title='Login'>
      <form
        className='mx-auto max-w-screen-md'
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
                value: 6,
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
            <Link href='/'>Register</Link>{" "}
          </p>
        </div>
      </form>
    </Layout>
  );
}
