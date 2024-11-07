import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "super_admin"],
        default: ["user"],
    },
});

const User = mongoose.model(User, userSchema);

export default User;