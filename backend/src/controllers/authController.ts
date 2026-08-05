import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from '../models/User';
import { InsightModel } from '../models/Insight';
import { signToken } from '../utils/jwt';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { PublicUser } from '../types';
import { env } from '../config/env';

const googleClient = new OAuth2Client(env.googleClientId);

async function invalidateInsightCache(userId: string): Promise<void> {
  await InsightModel.deleteOne({ userId });
}

function toPublicUser(user: {
  _id: unknown;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider: 'local' | 'google';
}): PublicUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    authProvider: user.authProvider,
  };
}

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface GoogleLoginBody {
  credential: string;
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as Partial<RegisterBody>;

  if (!name || !email || !password) {
    throw new AppError('Nama, email, dan password wajib diisi', 400);
  }
  if (password.length < 6) {
    throw new AppError('Password minimal 6 karakter', 400);
  }

  const existing = await UserModel.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('Email sudah terdaftar', 409);
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
    authProvider: 'local',
  });

  const token = signToken({ userId: String(user._id), email: user.email });
  await invalidateInsightCache(String(user._id));
  res.status(201).json({ token, user: toPublicUser(user) });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as Partial<LoginBody>;

  if (!email || !password) {
    throw new AppError('Email dan password wajib diisi', 400);
  }

  const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
    '+password',
  );
  if (!user || !user.password) {
    throw new AppError('Email atau password salah', 401);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AppError('Email atau password salah', 401);
  }

  const token = signToken({ userId: String(user._id), email: user.email });
  await invalidateInsightCache(String(user._id));
  res.json({ token, user: toPublicUser(user) });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { credential } = req.body as Partial<GoogleLoginBody>;

  if (!credential) {
    throw new AppError('Credential Google tidak ditemukan', 400);
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new AppError('Token Google tidak valid', 401);
  }

  let user = await UserModel.findOne({
    $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }],
  });

  if (!user) {
    user = await UserModel.create({
      name: payload.name ?? payload.email.split('@')[0],
      email: payload.email.toLowerCase(),
      googleId: payload.sub,
      avatarUrl: payload.picture,
      authProvider: 'google',
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    user.authProvider = 'google';
    if (payload.picture) user.avatarUrl = payload.picture;
    await user.save();
  }

  const token = signToken({ userId: String(user._id), email: user.email });
  await invalidateInsightCache(String(user._id));
  res.json({ token, user: toPublicUser(user) });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Tidak terautentikasi', 401);
  }

  const user = await UserModel.findById(req.user.userId);
  if (!user) {
    throw new AppError('Pengguna tidak ditemukan', 404);
  }

  res.json({ user: toPublicUser(user) });
});
