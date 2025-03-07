import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import handler from 'express-async-handler';
import { UserModel } from '../models/user.model.js';
import auth from '../middleware/auth.mid.js';
import admin from '../middleware/admin.mid.js';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import { sendEmailResetPassword } from '../helpers/send.resetpassword.js';

const router = Router();
const PASSWORD_HASH_SALT_ROUNDS = 10;

router.post(
  '/login',
  handler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateTokenResponse(user));
      return;
    }

    res.status(BAD_REQUEST).send('Username or password is invalid');
  })
);

router.post(
  '/register',
  handler(async (req, res) => {
    const { name, email, password, address } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      res.status(BAD_REQUEST).send('User already exists, please login!');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS);

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      address,
    };

    const result = await UserModel.create(newUser);
    res.send(generateTokenResponse(result));
  })
);

router.put(
  '/updateProfile',
  auth,
  handler(async (req, res) => {
    const { name, address } = req.body;
    const user = await UserModel.findByIdAndUpdate(req.user.id, { name, address }, { new: true });

    res.send(generateTokenResponse(user));
  })
);

router.put(
  '/changePassword',
  auth,
  handler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      res.status(BAD_REQUEST).send('Change Password Failed!');
      return;
    }

    const equal = await bcrypt.compare(currentPassword, user.password);

    if (!equal) {
      res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
      return;
    }

    user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
    await user.save();

    res.send();
  })
);

// 🔹 API Forgot Password
router.post(
  '/forgotPassword',
  handler(async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(BAD_REQUEST).send('User not found!');
    }

    // Buat token reset password
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Berlaku 1 jam
    await user.save();

    // Kirim email reset password
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmailResetPassword(user.email, resetUrl);

    res.send({ message: 'Password reset email has been sent!' });
  })
);

// 🔹 API Reset Password
router.post(
  '/resetPassword/:token',
  handler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(BAD_REQUEST).send('Invalid or expired token!');
    }

    // Perbarui password dan hapus token
    user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ message: 'Password has been reset successfully!' });
  })
);

router.get(
  '/getall/:searchTerm?',
  admin,
  handler(async (req, res) => {
    const { searchTerm } = req.params;

    const filter = searchTerm ? { name: { $regex: new RegExp(searchTerm, 'i') } } : {};

    const users = await UserModel.find(filter, { password: 0 });
    res.send(users);
  })
);

router.put(
  '/toggleBlock/:userId',
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;

    if (userId === req.user.id) {
      res.status(BAD_REQUEST).send("Can't block yourself!");
      return;
    }

    const user = await UserModel.findById(userId);
    user.isBlocked = !user.isBlocked;
    user.save();

    res.send(user.isBlocked);
  })
);

router.get(
  '/getById/:userId',
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, { password: 0 });
    res.send(user);
  })
);

router.put(
  '/update',
  admin,
  handler(async (req, res) => {
    const { id, name, email, address, isAdmin } = req.body;
    await UserModel.findByIdAndUpdate(id, {
      name,
      email,
      address,
      isAdmin,
    });

    res.send();
  })
);

const generateTokenResponse = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token,
  };
};

export default router;
