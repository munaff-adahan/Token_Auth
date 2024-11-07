import jwt from 'jsonwebtoken';
import UserToken from '../models/UserToken.js';

const generateTokens = async (userId) => {
    try {
        const payload = { _id: userId, roles: userId.roles };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: '14m' }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: '30d' }
        );

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new UserToken({ userId: user, _id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });

    } catch (error) {
        return Promise.reject(error);

    }
};

export default generateTokens;