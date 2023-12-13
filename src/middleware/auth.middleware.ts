import { Response, NextFunction } from "express"
import { IDataRequest } from "../models/IRequests"
import Session from "supertokens-node/recipe/session"

export default async function checkAuthentication(req: IDataRequest, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    return next()
  }

  try {
    const session = await Session.getSession(req, res)

    if (!session || !session.getUserId() || !session.getAccessTokenPayload()?.user_id) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    req.user_id = session.getAccessTokenPayload().user_id

    next()
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
