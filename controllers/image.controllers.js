import axios from "axios";
import userModel from "../models/user.model.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    console.log("req.body" , req.body)

    const user = await userModel.findById(userId);
    console.log("user", user)


    if (!user || !prompt) {
      return res
        .status(401)
        .json({ success: false, message: "missing details" });
    }

    if (user.creditBalance == 0 || user.creditBalance < 0) {
      return res
        .status(401)
        .json({
          success: false,
          message: "No credit balance",
          creditBalance: user.creditBalance,
        });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
      },
      responseType : 'arraybuffer'
    });

    console.log("data", data)

    const base64Image = Buffer.from(data, 'binary').toString('base64')
    const resultImage = `data:image/png;base64,${base64Image}`
    await userModel.findByIdAndUpdate(user._id, {creditBalance : user.creditBalance-1})

    res.json({success : true , message : "Image Generated", creditBalance : user.creditBalance - 1, resultImage})

  } catch (error) {
    console.log(error);
    res.json({success : false, message : error.message})
  }
};
