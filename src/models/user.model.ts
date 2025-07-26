import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
export enum UserRole {
  supplier = "supplier",
  vendor = "vendor",
}

type IUser = {
  _id?: mongoose.Types.ObjectId;
  username: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username is already taken"],
    },
    email: {
      type: String,
      required: false,
      sparse: true,
      unique: [true, "Email already registered"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true, "Phone number already registered"],
      maxlength: 15,
    },
    role:{
      type:String,
      enum: Object.values(UserRole),
      required:true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  console.log("Hashing password for user:", this.username);
  if (this.isModified("password")) {
    console.log("Password is modified, hashing...");
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  console.log('password', password,this.password);
  return await bcrypt.compare(password, this.password);
};

// Generate JWT access token

userSchema.methods.generateAccessToken = async function (): Promise<string> {
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);

  const token = await new SignJWT({
    _id: this._id.toString(), // ensure it's a string
    username: this.username,
    role: this.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);

  return token;
};

userSchema.methods.generateRefreshToken = async function (): Promise<string> {
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);

  const token = await new SignJWT({
    _id: this._id.toString(), // always stringify ObjectId
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return token;
};

const User = models?.User || model<IUser>("User", userSchema)

export type { IUser };
export default User;