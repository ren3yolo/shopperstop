import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";

export default function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title={`Unauthorized`}>
      <h1>Access denied</h1>
      {message && <div className='text-red-500'>{message}</div>}
    </Layout>
  );
}
