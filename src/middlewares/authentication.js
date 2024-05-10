import {z} from "zod";

export const registerUserValidator = (req, res, next) => {
  const {username, password} = req.body;
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
  /**Password must contain one digit from 1 to 9, one lowercase letter, 
   * one uppercase letter, 
   * one special character, no space, 
   * and it must be 8-16 characters long. */

   

  const userSchema = z.object({
    username: z.string().email(),
    password: z
      .string()
      .min(8, {message: "Password must be 8 characters long"})
      .regex(passwordRegex, {
        message:
          "Invalid password. Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.",
      }),
  });
  try {
    // as schema is a obj, parsing with a string would be wrong lmao silly me!
    userSchema.parse(req.body); 
    // console.log(parsed);
    next();
  } catch (error) {
  const missingFields =  error.issues.map((issue)=>issue.path+" "+ issue.message.toLowerCase());
    return res.status(400).send({
        data:{},
        message: `${missingFields.join(",")}`,
        success:false,
        err: error.issues[0]
    })
  }
};

// function parseValidation(username, pass) {
//   const validationUsername = z.string().email();
//   const validationPassword = z.string().min(8);
//   try {
//     validationUsername.parse(username) && validationPassword.parse(pass);

//   } catch (error) {
//     throw error.errors[0]
//   }
// }
