import crypto, { sign } from "crypto";
import User from "../models/userModel.js";
import { tokenService } from "./tokenService.js";
import { passwordService } from "./passwordService.js";
import { emailService } from "./emailService.js";

export const authService = {
  async signUpUser({ username, email, password }) {
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await passwordService.hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 3600000, // 1 hour
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;
    await emailService.sendEmail(
      user.email,
      "Verify your email",
      `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`
    );

    return user;
  },
  async loginUser({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    const validPassword = await passwordService.comparePassword(
      password,
      user.password
    );
    if (!validPassword) throw new Error("Invalid email or password");

    const token = tokenService.generateToken({ id: user._id, role: user.role });
    user.lastLogin = Date.now();
    await user.save();

    return { user, token };
  },
};
