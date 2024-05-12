import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../../config/server.js";

export const generateAccessToken = (payload) => {
  let new_payload = {};
  for (let key in payload) { //making sure that expiration and iat doesnot come with the new token request payload.
    if (key !== "iat" && key !== "exp") {
      new_payload[key] = payload[key];
    }
  }
  try {
    const acessstoken = jwt.sign(new_payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "15min",
    });
    return acessstoken;
  } catch (error) {
    throw error;
  }
};
//todo restructure this
export const generateRefreshToken = (payload) => {
  let new_payload = {};
  for (let key in payload) { //making sure that expiration and iat doesnot come with the new token request payload.
    if (key !== "iat" && key !== "exp") {
      new_payload[key] = payload[key];
    }
  }
  try {
    const refreshtoken = jwt.sign(new_payload, REFRESH_TOKEN_SECRET, {
      expiresIn: 86400 * 3,
    });
    return refreshtoken;
  } catch (error) {
    throw error;
  }
};
