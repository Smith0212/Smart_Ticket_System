import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phoneNo: {
      type: String,
      required: true,
      unique: true,
      // validate: {
      //   validator: function (value) {
      //     return /^\d{10}/.test(value);
      //   },
      //   message: "Phone number must be 10 digits long",
      // },
    },

    otp: {
      type: String,
    },

    otpExpiration: {
      type: Date,
      default: Date.now,
      get: (otpExpiration) => otpExpiration.getTime(),
      set: (otpExpiration) => new Date(otpExpiration),
    },

  },
  {
    timestamps: true,
  }
);

export const otpS = mongoose.model("otpSchema", otpSchema);
