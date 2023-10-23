import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"
import { uuid } from "./ICommon"

export interface IUserJwtPayload extends JwtPayload {
  id?: uuid
}

export interface IDataRequest extends Request {
  user?: string | IUserJwtPayload
  file_path?: string
  static_path?: string
}
