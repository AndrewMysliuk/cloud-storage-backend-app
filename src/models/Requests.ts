import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"

export interface UserJwtPayload extends JwtPayload {
  id?: string
}

export interface DataRequest extends Request {
  user?: string | UserJwtPayload
  file_path?: string
  static_path?: string
}
