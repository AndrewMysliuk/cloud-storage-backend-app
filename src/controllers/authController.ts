import { Response } from "express"
import fileService from "../services/fileService"
import authService from "../services/authService"
import { DataRequest, UserJwtPayload } from "../models/Requests"
import File from "../models/File"
import User, { IUser, UserResponse } from "../models/User"

class AuthController {
  async registration(req: DataRequest, res: Response) {
    try {
      const { email, password }: { email: string; password: string } = req.body
      const member = await User.findOne({ email })

      if (member)
        return res
          .status(500)
          .json({ message: `User with email ${email} has already exist ` })

      const hashPassword = await authService.hashPassword(password)
      const user = new User({ email, password: hashPassword })
      await user.save()
      await fileService.createDir(req, new File({ user: user.id, name: "" }))

      return res.json({ message: "User has been created" })
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async login(req: DataRequest, res: Response) {
    try {
      const { email, password }: { email: string; password: string } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(500).json({ message: "User not found" })
      }

      const isPasswordValid = authService.comparePasswords(
        password,
        user.password
      )

      if (!isPasswordValid) {
        return res.status(500).json({ message: "Something went wrong: /login" })
      }

      const token = authService.createToken(user._id.toString())

      return res.json({
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          drive_space: user.drive_space,
          used_space: user.used_space,
          avatar: user?.avatar,
          files: user?.files || [],
        } as UserResponse,
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }

  async getMe(req: DataRequest, res: Response) {
    try {
      const user = (await User.findOne({
        _id: (req.user as UserJwtPayload).id,
      })) as IUser

      return res.json({
        id: user._id.toString(),
        email: user.email,
        drive_space: user.drive_space,
        used_space: user.used_space,
        avatar: user?.avatar,
        files: user?.files || [],
      } as UserResponse)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }
}

export default new AuthController()
