import { body } from "express-validator";

export const registerValidator = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long")
    .withMessage("please Type correct Password"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .withMessage("Invalid phone number format"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];
