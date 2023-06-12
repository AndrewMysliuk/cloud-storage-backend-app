import { Response, NextFunction } from "express"
import { DataRequest } from "../models/Requests"
import { check, validationResult } from "express-validator"

export const validateRegistration = [
  check("email", "Wrong email").isEmail(),
  check(
    "password",
    "Password must be longer than 3 and shorter than 12"
  ).isLength({ min: 3, max: 12 }),
  check("first_name", "First Name must be longer than 1").isLength({ min: 1 }),
  check("last_name", "Last Name must be longer than 1").isLength({ min: 1 }),
  (req: DataRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(500).json({ message: "Validation Error" })

    next()
  },
]
