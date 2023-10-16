import { Response } from "express"
import authService from "../services/authService"
import { IDataRequest, IUserJwtPayload } from "../models/IRequests"
import User, { IUser, IUserResponse } from "../models/IUser"

class AuthController {
  async registration(req: IDataRequest, res: Response) {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
      }: {
        email: string
        password: string
        first_name: string
        last_name: string
      } = req.body
      const member = await User.findOne({ email })

      if (member) return res.status(500).json({ message: `User with email: ${email} has already exist` })

      const hashPassword = await authService.hashPassword(password)
      const user = new User({
        email,
        password: hashPassword,
        first_name,
        last_name,
      })
      await user.save()

      return res.json({ message: "User has been created" })
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async login(req: IDataRequest, res: Response) {
    try {
      const { email, password }: { email: string; password: string } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(500).json({ message: "User not found" })
      }

      const isPasswordValid = authService.comparePasswords(password, user.password)

      if (!isPasswordValid) {
        return res.status(500).json({ message: "Wrong email or password" })
      }

      const token = authService.createToken(user._id.toString())

      return res.json({
        token,
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }

  async getMe(req: IDataRequest, res: Response) {
    try {
      const user = (await User.findOne({
        _id: (req.user as IUserJwtPayload).id,
      })) as IUser

      return res.json({
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        icon_color: user.icon_color,
        created_at: user.created_at,
        updated_at: user.updated_at,
        status: user.status,
        storage_used: user.storage_used,
        storage_limit: user.storage_limit,
        files: user?.files ?? [],
      } as IUserResponse)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
}

export default new AuthController()
