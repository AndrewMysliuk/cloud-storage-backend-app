import { Schema, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { uuid, timestamp } from "./ICommon"

export enum UserIconColorEnum {
  GREEN = "green",
  RED = "red",
  PURPLE = "purple",
  ORANGE = "orange",
}

export enum UserStatusEnum {
  ACTIVE = "active",
  PENDING = "pending",
  DELETED = "deleted",
  PAUSED = "paused",
}

export interface IUserResponse {
  id: uuid
  email: string
  first_name: string
  last_name: string
  avatar: string | null
  icon_color: UserIconColorEnum
  created_at: timestamp
  updated_at: timestamp
  status: UserStatusEnum
  storage_used: number
  storage_limit: number
  files?: uuid[]
}

export interface IUser extends Document {
  _id: uuid
  email: string
  password: string
  first_name: string
  last_name: string
  avatar: string | null
  icon_color: UserIconColorEnum
  created_at: timestamp
  updated_at: timestamp
  status: UserStatusEnum
  storage_used: number
  storage_limit: number
  files?: uuid[]
}

const User = new Schema<IUser>({
  _id: { type: String, default: uuidv4 },
  email: { type: String, require: true, unique: true },
  first_name: { type: String, require: true },
  last_name: { type: String, require: true },
  password: { type: String, require: true },
  storage_limit: { type: Number, default: 1024 ** 3 * 10 },
  storage_used: { type: Number, default: 0 },
  avatar: { type: String, default: null },
  files: { type: Array<Schema.Types.String>, ref: "File" },
  icon_color: { type: String, enum: Object.values(UserIconColorEnum), default: UserIconColorEnum.PURPLE },
  created_at: { type: String, default: new Date().toISOString() },
  updated_at: { type: String, default: new Date().toISOString() },
  status: { type: String, enum: Object.values(UserStatusEnum), default: UserStatusEnum.ACTIVE },
})

export default model<IUser>("User", User)
