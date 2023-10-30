import { Schema, model } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import { uuid, timestamp } from "./ICommon"

export enum FileStatusEnum {
  UPLOADED = "uploaded",
  CREATED = "created",
}

export enum FileTypeEnum {
  DIRECTORY = "directory",
  FILE = "file",
}

export interface IFileResponse {
  id: uuid
  name: string
  extension?: string
  type: FileTypeEnum
  size?: number
  created_at?: timestamp
  updated_at?: timestamp
  path: string
  owner: uuid
  status: FileStatusEnum
  parent?: uuid
  child?: uuid[]
}

export interface IFile extends Document {
  _id: uuid
  name: string
  extension?: string
  type: FileTypeEnum
  size?: number
  created_at?: timestamp
  updated_at?: timestamp
  path: string
  owner: uuid
  status?: FileStatusEnum
  parent?: uuid
  child?: uuid[]
}

const File = new Schema<IFile>({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  extension: { type: String },
  type: { type: String, enum: Object.values(FileTypeEnum), required: true },
  size: { type: Number, default: 0 },
  created_at: { type: String, default: new Date().toISOString() },
  updated_at: { type: String, default: new Date().toISOString() },
  path: { type: String, default: "" },
  owner: { type: String, ref: "User" },
  status: { type: String, enum: Object.values(FileStatusEnum), default: FileStatusEnum.CREATED },
  parent: { type: String, ref: "File" },
  child: { type: Array<Schema.Types.String>, ref: "File" },
})

export default model<IFile>("File", File)
