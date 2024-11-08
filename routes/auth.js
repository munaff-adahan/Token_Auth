import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { signUpBodyValidation, loginBodyValidation } from "../utils/ValidationsSchema.js";
import generateTokens from "../utils/generateTokens.js";

const router = Router();

///SignUp

router.post("/signup", async (req, res) => {
    try {
        const { error } = signUpBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });

        if (user)
            return res
                .status(400)
                .json({ error: true, message: "User with given email already exists" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await new User({
            ...req.body,
            password: hashedPassword,
        }).save();

        res.status(201).json({ error: false, message: "User registered successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

///Login

router.post("/login", async (req, res) => {
    try {
        const { error } = loginBodyValidation(req.body);
        if (error)
            return res
                .status(400)
                .json({ error: true, message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        console.log(user)
        if (!user)
            return res
                .status(401)
                .json({ error: true, message: "Invalid Email or Password" });

        const verifiedPassword = await bcrypt.compare(req.body.password, user.password);
        if (!verifiedPassword)
            return res
                .status(401)
                .json({ error: true, message: "Invalid Email or Password" });

        ///Generate access and Refresh Token 

        const { accessToken, refreshToken } = await generateTokens(user);

        res.status(200).json({
            error: false,
            accessToken,
            refreshToken,
            message: "Logged in Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });

    }
});


export default router;
