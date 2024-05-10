import { PrismaClient } from "@prisma/client";
import {prisma} from "../../config/server.js";
import { hashPassword } from "../helper/authRelated.js";

// const registerUserQueryClient = prisma.$extends({
//   query: {
//     authmodule: {
//       async create({model, operation, args, query}) {
//         console.log("datat in args", {...args})
//         args.where = {
//           ...args.where,
//           password: hashPassword(args.data.password),
//         };

//         return query(args);
//       },
//     },
//   },
// });

//lol this was dumb 
const registerUserQueryClient =prisma.$extends({
  query: {
    authmodule: {
      async create({ model, operation, args, query }) {
        console.log("args")
        args.where = { ...args.where, password:  await hashPassword(args.data.password)}
        return query(args)
      },
    },
  },
})
export default registerUserQueryClient;

