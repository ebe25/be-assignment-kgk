import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../../config/server.js";
const {sign, verify} = jwt;
export const generateAccessToken = (payload) => {
  try {
    const acessstoken = sign({payload}, ACCESS_TOKEN_SECRET, {expiresIn: "1h"});
    return acessstoken;
  } catch (error) {
    throw error;
  }
};
//todo restructure this
export const generateRefreshToken = (payload) => {
  try {
    const refreshtoken = sign({payload}, REFRESH_TOKEN_SECRET, {
      expiresIn: "72hr",
    });
    return refreshtoken;
  } catch (error) {
    throw error;
  }
};
