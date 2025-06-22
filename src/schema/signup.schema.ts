import * as yup from "yup";

export const signUpSchema = yup.object({
  userName: yup.string().required("User Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup.string().required("Please enter your password").min(3),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Password don't match"),
  gender: yup.string().optional(),
});
