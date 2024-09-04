import sendMail from "../middlewares/sendMail.js";
import { otpS } from "../models/OTP.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import sendSMS from "../middlewares/sendSMS.js";

// Login function to handle OTP generation and sending
export const loginUser = async (req, res) => {
  try {
    let { phoneNo } = req.body;

    phoneNo = `+91${phoneNo}`; 

    // Check if OTP entry exists
    let otpEntry = await otpS.findOne({ phoneNo });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6 digit OTP
    const otpExpiration = new Date(Date.now() + 10 * 60000); // Set expiration to 10 min

    // If OTP entry does not exist, create a new one
    if (!otpEntry) {
      otpEntry = new otpS({ phoneNo, otp, otpExpiration });
      await otpEntry.save();
    } 
    // If OTP entry exists, update it
    else {
      otpEntry.otp = otp;
      otpEntry.otpExpiration = otpExpiration;
      await otpEntry.save();
    }

    // Send OTP via SMS
    await sendSMS(phoneNo, otp);

    // Create a JWT token
    const verifyToken = jwt.sign({ phoneNo }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.json({
      message: "OTP sent to your phone number",
      verifyToken,
      otp,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify OTP function
export const verifyUser = async (req, res) => {
  try {
    const { otp } = req.body;
    
 
    const verifyToken = req.headers.authorization?.split(" ")[1]; 

    if (!verifyToken) {
      return res.status(401).json({ message: "Token not provided" });
    }
    //fetch phoneNo. from the token
    const verify = jwt.verify(verifyToken, process.env.JWT_SECRET);

    const otpEntry = await otpS.findOne({ phoneNo: verify.phoneNo });


    if (!otpEntry || otpEntry.otp !== otp || otpEntry.otpExpiration < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    } 
    else {
      // res.json({ message: "OTP is correct" });
    }

    // add user to the database
    let user = await User.findOne({ phoneNo: verify.phoneNo });
    console.log("hi");

      // Create a new user with only the phone number and mark them as verified
    if (!user) {
      user = new User({ phoneNo: verify.phoneNo, isVerified: true });
      await user.save();
    }
    // Mark the existing user as verified
    else {
      user.isVerified = true;
      await user.save();
    }

    // Clear the OTP after verification
    if(user.isVerified) { 
      otpEntry.otp = null;
      await otpEntry.save();
    }

    // Create a JWT token for the user session
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.json({
      message: "Logged in successfully",
      user,
      token,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Fetch user profile 
export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
