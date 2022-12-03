import db from "../../utils/db";
import User from "../../models/User";
import { data, User as UserType } from "../../utils/data";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  await User.deleteMany();

  await User.insertMany<UserType>(data.users);
  await db.disconnect();
  return res.status(200).send({ message: "Seeded successfully" });
};

export default handler;
