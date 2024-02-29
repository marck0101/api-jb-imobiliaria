import { env } from '@/config/env';
import jwt from 'jsonwebtoken';

export const decodeToken = (token: string) => jwt.verify(token, env.SECRET_AUTH);