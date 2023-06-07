import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "config"

class AuthService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 8)
  }

  comparePasswords(currentPassword: string, savedPassword: string): boolean {
    return bcrypt.compareSync(currentPassword, savedPassword)
  }

  createToken(userId: string): string {
    return jwt.sign({ id: userId }, config.get("secret_key") as string, {
      expiresIn: "1h",
      algorithm: "HS256",
    })
  }

  verifyToken(token: string) {
    return jwt.verify(token, config.get("secret_key"))
  }
}

export default new AuthService()
