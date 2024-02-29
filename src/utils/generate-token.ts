import { env } from '@/config/env';
import jwt from 'jsonwebtoken';

export const generateToken = (data: string | Buffer | object) =>
    jwt.sign(data, env.SECRET_AUTH, { expiresIn: env.EXPIRE_AUTH });