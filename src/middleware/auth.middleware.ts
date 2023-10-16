import { Response, NextFunction } from "express"
import { IDataRequest } from "../models/IRequests"
import authService from "../services/authService"

export default function auth(
  req: IDataRequest,
  res: Response,
  next: NextFunction
) {
  if (req.method === "OPTIONS") {
    return next()
  }

  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ message: "auth error" })
    }
    const decode = authService.verifyToken(token)
    req.user = decode

    next()
  } catch (e) {
    return res.status(401).json({ message: "auth error" })
  }
}
