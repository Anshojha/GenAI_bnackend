import express from "express"
import { generateImage } from "../controllers/image.controllers.js"
import userAuth from "../middlware/auth.js"


const imageRouter = express.Router()


imageRouter.post("/generate-image", userAuth, generateImage)

export default imageRouter;