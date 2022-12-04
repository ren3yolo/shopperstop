import { NextApiRequest, NextApiResponse } from "next";
import Product from "../../../models/Product";
import db from "../../../utils/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();

  return res.status(200).send(product);
}

export default handler;
