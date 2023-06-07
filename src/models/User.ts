import { Schema, model, Types } from "mongoose"

export interface UserResponse {
  id: string
  email: string
  drive_space: number
  used_space: number
  avatar: string | null
  files?: Types.ObjectId[]
}

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  drive_space: number
  used_space: number
  avatar: string | null
  files?: Types.ObjectId[]
}

const User = new Schema<IUser>({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  drive_space: { type: Number, default: 1024 ** 3 * 10 },
  used_space: { type: Number, default: 0 },
  avatar: { type: String, default: null },
  files: { type: Array<Schema.Types.ObjectId>, ref: "File" },
})

export default model<IUser>("User", User)
