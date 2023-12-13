import { Request } from "express"
import { uuid } from "./ICommon"

export interface IDataRequest extends Request {
  user_id?: string | uuid
  file_path?: string
  static_path?: string
}
