import { Response, NextFunction } from "express"
import { DataRequest } from "../models/Requests"

export function filePath(path: string) {
  return function (
    req: DataRequest,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): void {
    req.file_path = path
    next()
  }
}

export function staticPath(path: string) {
  return function (
    req: DataRequest,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): void {
    req.static_path = path
    next()
  }
}
