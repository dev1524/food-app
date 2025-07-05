import { Request, Response } from "express";
import UserModel from "../models/UserSchema";
import {
  createUser,
  forgotPasswordService,
  LoginService,
  UpdateService,
} from "../service/User.service";
import { validationResult } from "express-validator";
import {
  loginCaptainService,
  registerCaptainService,
} from "../service/Admin.service";

export const UserRegister = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, phone } = req.body;

  try {
    const user = await createUser(fullname, email, password, phone, res);
    return res.status(200).json({
      user,
      message: "User Created Successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error during user registration:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const UserLogin = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await LoginService(email, password, res);
    return res.status(200).json({
      user,
      message: "User Login Successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error during user registration:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    // Send a success response
    return res
      .status(200)
      .json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    // Handle errors gracefully
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, fullname, newPassword } = req.body;

  try {
    const response = await forgotPasswordService(email, fullname, newPassword);
    return res.status(201).send(response);
  } catch (error: any) {
    return res.status(400).send({ success: false, message: error.message });
  }
};

export const CheckAuth = async (req: Request, res: Response): Promise<any> => {
  try {
    let userid = req.id;

    const user = await UserModel.findById(userid).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User is not found",
        success: false,
      });
    }
    return res.status(200).json({ user, success: true });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// update profile

export const UpdateProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.id;
    const { fullname, email, address, city, country, phone, profilePicture } =
      req.body;

    const user = await UpdateService(
      userId,
      fullname,
      email,
      address,
      city,
      country,
      phone,
      profilePicture
    );

    return res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//  Admin Authentication

export const CaptainRegister = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, phone } = req.body;

  try {
    const captain = await registerCaptainService(
      fullname,
      email,
      password,
      phone,
      res
    );
    return res.status(200).json({
      captain,
      message: "User Created Successfully",
      success: true,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const CaptainLogin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    const captain = await loginCaptainService(email, password, res);

    if (!captain) {
      return res
        .status(400)
        .json({ message: "Captain not found", success: false });
    }
    return res.status(200).json({
      captain,
      message: `Welcome Back ${captain.fullname}`,
      success: true,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message, success: false });
  }
};
