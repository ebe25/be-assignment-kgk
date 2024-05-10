import UserService from "../service/user.js";

class UserController {
  constructor() {
    this.service = new UserService();
  }

  register = async (req, res) => {
    const {username, password} = req.body;
    try {
      const newUser = await this.service.register(username, password);
      return res.status(201).send({
        data: newUser,
        message: "User registered Sucessfully. ✅",
        success: true,
        err: {},
      });
    } catch (error) {
      return res.status(500).send({
        data: {},
        message: "User registration failed",
        success: false,
        err: error,
      });
    }
  };
  //   async get(req,res){
  //     return res.status(200).send({
  //         data:"hey there working"
  //     })
  //   }
}

export default UserController;
