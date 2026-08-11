import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { PublicUser } from '../types';

function toPublicUser(user: {
  _id: unknown;
  name: string;
  nickname?: string;
  email: string;
  avatarUrl?: string;
  authProvider: 'local' | 'google';
}): PublicUser {
  return {
    id: String(user._id),
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    avatarUrl: user.avatarUrl,
    authProvider: user.authProvider,
  };
}

interface UpdateProfileBody {
  name?: string;
  nickname?: string;
}

const MAX_AVATAR_BASE64_LENGTH = 2_000_000; // ~1.5MB gambar asli

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { name, nickname } = req.body as UpdateProfileBody;

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('Pengguna tidak ditemukan', 404);
    }

    const isGoogleUser = user.authProvider === 'google';

    if (isGoogleUser && name !== undefined && name.trim() !== user.name) {
      throw new AppError(
        'Nama tidak bisa diubah untuk akun yang masuk lewat Google',
        403,
      );
    }

    if (!isGoogleUser && name !== undefined) {
      if (!name.trim()) {
        throw new AppError('Nama tidak boleh kosong', 400);
      }
      user.name = name.trim();
    }

    if (nickname !== undefined) {
      user.nickname = nickname.trim() || undefined;
    }

    await user.save();
    res.json({ user: toPublicUser(user) });
  },
);

export const updateAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { avatarBase64, mimeType } = req.body as {
      avatarBase64?: string;
      mimeType?: string;
    };

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('Pengguna tidak ditemukan', 404);
    }

    if (user.authProvider === 'google') {
      throw new AppError(
        'Foto profil dikelola oleh Google untuk akun ini, tidak bisa diubah manual',
        403,
      );
    }

    if (!avatarBase64 || !mimeType) {
      throw new AppError('Gambar avatar wajib disertakan', 400);
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
      throw new AppError(
        'Format gambar tidak didukung (gunakan JPEG/PNG/WebP)',
        400,
      );
    }
    if (avatarBase64.length > MAX_AVATAR_BASE64_LENGTH) {
      throw new AppError(
        'Ukuran gambar terlalu besar, coba kompres ulang',
        400,
      );
    }

    user.avatarUrl = `data:${mimeType};base64,${avatarBase64}`;
    await user.save();

    res.json({ user: toPublicUser(user) });
  },
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      throw new AppError(
        'Password saat ini dan password baru wajib diisi',
        400,
      );
    }
    if (newPassword.length < 6) {
      throw new AppError('Password baru minimal 6 karakter', 400);
    }

    const user = await UserModel.findById(userId).select('+password');
    if (!user) {
      throw new AppError('Pengguna tidak ditemukan', 404);
    }

    if (user.authProvider === 'google' || !user.password) {
      throw new AppError(
        'Akun yang masuk lewat Google tidak memiliki password untuk diubah',
        403,
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('Password saat ini salah', 401);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(204).send();
  },
);
