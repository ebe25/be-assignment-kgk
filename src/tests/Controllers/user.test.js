import UserService from "../../service/user.js";
import UserController from "../../controller/user.js";
import mock from "../mocker.js"
const controller=new UserController();

jest.mock("../../service/user.js");
describe("to test the signup process",()=>{
    test("to check the flow is working fine",async()=>{
        const req=mock.mockRequest();
        const res=mock.mockResponse();
        const response={
            email:"sanjay.s1558@gmail.com",
            password:"zxxxxxxxxx"
        };
        (UserService.prototype.register).mockReturnValue(response);
        await controller.register(req,res);
        expect(res.send).toHaveBeenCalledWith({
            data:response,
            message: "User registered Sucessfully. ✅",
            success: true,
            err: {},

        });
    })
})