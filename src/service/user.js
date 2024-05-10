import UserRepositary from "../repositary/user.js";
import {comparePasswords} from "../utils/helper/authRelated.js";
import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

class UserService {
  constructor() {
    this.repo = new UserRepositary();
  }
  #createToken=async(payload, privateKey)=>{

  }

  async register(username, password) {
    try {
      const newUser = await this.repo.register(username, password);
      return newUser;
    } catch (error) {
      throw error
    }
  }

  async login(username, password) {
    try {
      const dbUser = await this.repo.getUserByEmail(username);
      if (!dbUser) {
        throw new Error("No User found! ❌");
      }

      const isPasswordMatch = await comparePasswords(dbUser.password, password);
      if (!isPasswordMatch) {
        throw new Error("Invalid Password! Does'nt match 👎🏻, Try again");
      }

      // const createToken =
    } catch (error) {
      throw {error};
    }
  }
}
export default UserService;
