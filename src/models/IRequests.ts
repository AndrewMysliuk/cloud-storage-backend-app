import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"
import { uuid } from "./ICommon"
import { IUserResponse } from "./IUser"

export interface IUserJwtPayload extends JwtPayload {
  id?: uuid
}

export interface IDataRequest extends Request {
  user?: IUserResponse | IUserJwtPayload
  file_path?: string
  static_path?: string
}
