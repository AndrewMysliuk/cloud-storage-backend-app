import { Response } from "express"
import { IDataRequest } from "../models/IRequests"
import axios from "axios"

class CentrifugeController {
  async centrifugePublish(req: IDataRequest, res: Response) {
    const { data }: { data: string } = req.body
    const channel = "objects_channel"

    try {
      const response = await axios.post(
        "http://localhost:8000/api/publish",
        {
          channel: channel,
          data: {
            some_data: data,
          },
        },
        {
          headers: { "X-API-Key": "c43fd776-e392-4eef-ba5b-c1b406bd6062" },
        },
      )

      res.json({ success: true, data: response.data })
    } catch (error) {
      if (error instanceof Error) {
        res.json({ success: false, error: error.message })
      } else {
        res.json({ success: false, error: "An unknown error occurred" })
      }
    }
  }
}

export default new CentrifugeController()
