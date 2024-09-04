import jwt from "jsonwebtoken";
import { otpS } from "../models/OTP.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token)
      return res.status(403).json({
        message: "Please login",
      });

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await otpS.findById(decode._id);

    next();
  } catch (error) {
    res.status(500).json({
      message: "Login First",
    });
  }
};
