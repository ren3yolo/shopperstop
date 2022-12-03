import { Schema, model, models } from "mongoose";
import { User as UserType } from "../utils/data";

const UserSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model<UserType>("User", UserSchema);

export default User;
