import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        },
    
        phoneNo: {
        type: String,
        required: true,
        unique: true,
        // validate: {
        //     validator: function (value) {
        //     return /^\d{10}/.test(value);
        //     },
        //     message: "Phone number must be 10 digits long",
        // },
        },
    
        isVerified: {
        type: Boolean,
        default: false,
        },
    },
    {
        timestamps: true,
    }
);
export const User = mongoose.model("User", userSchema);
