import 'dotenv/config' ;
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient();
export const PORT  = process.env.PORT || 8000;
export const HASH_SALT_ROUNDS = process.env.HASH_SALT_ROUNDS || 10