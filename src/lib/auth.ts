import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './db';
import User, { IUser, UserRole } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dolean_jwt_secret_2026_super_secure';

export interface TokenPayload {
  userId: string;
  email: string;
  roles: UserRole[];
  role?: string; // legacy support
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<IUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      const cookie = req.cookies.get('authorization');
      token = cookie?.value || '';
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    await connectToDatabase();
    const user = await User.findById(payload.userId).select('-password');
    if (!user || user.deleteState) return null;

    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(req: NextRequest, allowedRoles?: string[]): Promise<IUser | null> {
  const user = await getAuthUser(req);
  if (!user) return null;

  if (allowedRoles && allowedRoles.length > 0) {
    // Check if user has at least one of the allowed roles
    const userRoles = user.roles || [];
    // Backwards compatibility for single role field
    const legacyRole = (user as any).role;
    if (legacyRole && !userRoles.includes(legacyRole)) {
      userRoles.push(legacyRole);
    }

    const hasPermission = allowedRoles.some((role) => userRoles.includes(role as UserRole));
    if (!hasPermission) return null;
  }

  return user;
}
