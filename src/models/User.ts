import { Schema, model, Types } from "mongoose"

export interface UserResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  drive_space: number
  used_space: number
  avatar: string | null
  files?: Types.ObjectId[]
}

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  first_name: string
  last_name: string
  password: string
  drive_space: number
  used_space: number
  avatar: string | null
  files?: Types.ObjectId[]
}

const User = new Schema<IUser>({
  email: { type: String, require: true, unique: true },
  first_name: { type: String, require: true },
  last_name: { type: String, require: true },
  password: { type: String, require: true },
  drive_space: { type: Number, default: 1024 ** 3 * 10 },
  used_space: { type: Number, default: 0 },
  avatar: { type: String, default: null },
  files: { type: Array<Schema.Types.ObjectId>, ref: "File" },
})

export default model<IUser>("User", User)
