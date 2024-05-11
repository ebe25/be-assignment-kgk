import 'dotenv/config' ;
import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis';

export const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});;
export const prisma = new PrismaClient();
export const PORT  = process.env.PORT || 8000;
export const HASH_SALT_ROUNDS = process.env.HASH_SALT_ROUNDS || 10
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const EXPIRE_REFRESH_TOKEN_THRESHOLD = process.env.EXPIRE_REFRESH_TOKEN_THRESHOLD;




