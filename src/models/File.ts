import { Schema, model, Types, Document } from "mongoose"

export interface IFile extends Document {
  name: string
  type: string
  access_link?: string
  size?: number
  path?: string
  user: Types.ObjectId
  date: Date
  parent?: Types.ObjectId
  childs?: Types.ObjectId[]
}

const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  access_link: { type: String },
  size: { type: Number, default: 0 },
  path: { type: String, default: "" },
  date: { type: Date, default: Date.now() },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  parent: { type: Schema.Types.ObjectId, ref: "File" },
  childs: { type: Array<Schema.Types.ObjectId>, ref: "File" },
})

export default model<IFile>("File", FileSchema)
