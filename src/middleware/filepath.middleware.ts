import { Response, NextFunction } from "express"
import { IDataRequest } from "../models/IRequests"

export function filePath(path: string) {
  return function (req: IDataRequest, res: Response<any, Record<string, any>>, next: NextFunction): void {
    req.file_path = path
    next()
  }
}

export function staticPath(path: string) {
  return function (req: IDataRequest, res: Response<any, Record<string, any>>, next: NextFunction): void {
    req.static_path = path
    next()
  }
}
