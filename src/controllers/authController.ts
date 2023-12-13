import { Response } from "express"
import fileService from "../services/fileService"
import { IDataRequest } from "../models/IRequests"
import User, { IUser, IUserResponse } from "../models/IUser"
import File, { IFile, FileTypeEnum } from "../models/IFile"
import EmailPassword from "supertokens-node/recipe/emailpassword"
import { createNewSession } from "supertokens-node/recipe/session"

class AuthController {
  async registration(req: IDataRequest, res: Response) {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
      }: {
        tenantId: string
        email: string
        password: string
        first_name: string
        last_name: string
      } = req.body

      const result = await EmailPassword.signUp("", email, password)

      if (result.status === "EMAIL_ALREADY_EXISTS_ERROR") {
        return res.status(409).json({ message: `User with email: ${email} already exists` })
      }

      const newUser = new User({
        email,
        first_name,
        last_name,
      })

      await newUser.save()
      await fileService.createDir(
        req,
        new File<IFile>({
          owner: newUser.id,
          name: "",
          type: FileTypeEnum.DIRECTORY,
          starred: false,
        } as IFile),
      )

      return res.json({ message: "User has been created" })
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  }

  async login(req: IDataRequest, res: Response) {
    try {
      const { email, password }: { email: string; password: string } = req.body

      const signInResult = await EmailPassword.signIn("", email, password)

      if (signInResult.status === "WRONG_CREDENTIALS_ERROR") {
        return res.status(401).json({ message: "Wrong email or password" })
      }

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(500).json({ message: "User not found" })
      }

      const session = await createNewSession(req, res, "", signInResult.recipeUserId, { user_id: user._id.toString() })

      return res.json({ message: "Logged in successfully", sessionHandle: session.getHandle() })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }

  async getMe(req: IDataRequest, res: Response) {
    try {
      const user = (await User.findOne({
        _id: req?.user_id,
      })) as IUser

      return res.json({
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
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
