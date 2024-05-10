import {prisma} from "../config/server.js";
import {hashPassword} from "../utils/helper/authRelated.js";
import registerUserQueryClient from "../utils/triggers/createHashedPwUsers.js";
class UserRepositary {
  constructor() {
    this.model = prisma.authModule;
  }
  async register(username, password) {
    try {
      const user = await this.model.create({
        data: {
          username: username,
          password: await hashPassword(password),
        },
      });
      return user;
    } catch (error) {
      const {message, code} = error;
      throw {message, code};
    }
  }

  async getUserByUsername(username) {
    try {
      const user = await this.model.findUnique({
        where: {
          username: username,
        },
      });
      return user;
    } catch (error) {
        const {message} = error;
      throw {error: {message, path: "repositary layer"}};
    }
  }
}
export default UserRepositary;
