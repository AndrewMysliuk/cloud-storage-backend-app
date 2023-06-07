import { Response, NextFunction } from "express"
import { DataRequest } from "../models/Requests"
import { check, validationResult } from "express-validator"

export const validateRegistration = [
  check("email", "Wrong email").isEmail(),
  check(
    "password",
    "Password must be longer than 3 and shorter than 12"
  ).isLength({ min: 3, max: 12 }),
  (req: DataRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(500).json({ message: "Validation Error" })

    next()
  },
]
