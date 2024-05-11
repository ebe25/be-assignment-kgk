import bcrypt from "bcrypt";

import {HASH_SALT_ROUNDS} from "../../config/server.js"
export const hashPassword = async(textPassword)=>{
    try {
        const hashedPassword = await bcrypt.hash(textPassword,Number(HASH_SALT_ROUNDS));
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

export const comparePasswords = async(textPassword, dbUserHashedPassword)=>{
    // console.log("--00-0", textPassword, dbUserHashedPassword)
    try {
        const isSame = await bcrypt.compare(textPassword, dbUserHashedPassword);
        return isSame;
    } catch (error) {
        throw error;
    }
}