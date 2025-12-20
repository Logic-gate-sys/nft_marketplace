import jwt from 'jsonwebtoken';
/**
 *
 * @param user : the specific user acessing the endpoint
 * @param message
 * @returns  returns an acess token
 */
export const signAcessToken = (wallet, userId) => {
    return jwt.sign({
        userId: userId,
        wallet: wallet,
    }, process.env.JWT_SECRET, { expiresIn: '15m' });
};
/**
 *
 * @param user : the specific user acessing the endpoint
 * @param message
 * @returns  returns a a refresh token that would be store in the browser's http-only cookie use to regenerate acess tokens on expiry
 */
export const signRefreshToken = (wallet, userId) => {
    return jwt.sign({
        userId: userId,
        wallet: wallet,
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
export const verifyToken = (token) => {
    const paylaod = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, wallet } = paylaod;
    return { userId, wallet };
};
