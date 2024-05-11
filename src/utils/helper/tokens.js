import jwt from "jsonwebtoken";
const {sign, verify} = jwt;
export const generateAccessToken = () => {
  try {
    const acessstoken = sign(payload, accessTokenPrivateKey, {
      expiresIn: "1hr",
    });
    return acessstoken;
  } catch (error) {
    throw error;
  }
};
//todo restructure this 
export const generateRefreshToken = (payload, refreshTokenPrivatekey) => {
  try {
    const refreshtoken = sign(payload, refreshTokenPrivatekey, {
      expiresIn: "72hr",
    });
    return refreshtoken;
  } catch (error) {
    throw error;
  }
};
