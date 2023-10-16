import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"

export interface IUserJwtPayload extends JwtPayload {
  id?: string
}

export interface IDataRequest extends Request {
  user?: string | IUserJwtPayload
  file_path?: string
  static_path?: string
}
