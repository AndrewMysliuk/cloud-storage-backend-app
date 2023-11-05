import express from "express"
import mongoose from "mongoose"
import config from "config"
import path from "path"
import fileUpload from "express-fileupload"
import corsMiddleware from "./src/middleware/cors.middleware"
import { filePath, staticPath } from "./src/middleware/filepath.middleware"
import authRouter from "./src/routes/auth.routes"
import fileRouter from "./src/routes/file.routes"
import { Server } from "http"

const app = express()
const PORT = process.env.PORT || config.get("server_port")

app.use(
  fileUpload({
    defCharset: "utf8",
    defParamCharset: "utf8",
  }),
)
app.use(corsMiddleware)
app.use(filePath(path.resolve(__dirname, "files").toString()))
app.use(staticPath(path.resolve(__dirname, "static").toString()))
app.use(express.json())
app.use(express.static("static"))
app.use("/api/auth/", authRouter)
app.use("/api/storage/", fileRouter)

const handleShutdown = (server: Server) => {
  server.close(() => {
    console.log("server has been closed")

    mongoose.connection.close(false).then(() => {
      console.log("MongoDB has been closed")

      process.exit(0)
    })
  })

  setTimeout(() => {
    console.error("Forcefully shutting down...")
    process.exit(1)
  }, 5000)
}

const start = async () => {
  try {
    mongoose.connect(config.get("db_url"))

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`)
    })

    process.on("SIGTERM", () => {
      handleShutdown(server)
    })
    process.on("SIGINT", () => {
      handleShutdown(server)
    })
  } catch (e) {
    console.log(e)
  }
}

start().catch((err) => {
  console.error("Error starting server:", err)
  process.exit(1)
})
