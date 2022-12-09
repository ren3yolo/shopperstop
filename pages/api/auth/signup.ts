import { NextApiRequest, NextApiResponse } from "next";
import User from "../../../models/User";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.length < 5
  ) {
    return res.status(422).json({
      message: "Validation error",
    });
  }

  await db.connect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(422).json({ message: "User already exists" });
    await db.disconnect();
    return;
  } else {
    const newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(password),
      isAdmin: false,
    });
    const user = await newUser.save();
    await db.disconnect();
    return res.status(201).send({
      message: "Created user",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
}

export default handler;
