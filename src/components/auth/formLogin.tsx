/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ILogin } from "@/interface/auth.interface";
import { loginSchema } from "@/schema/login.schema";
import LoginBackground from "@/ui/loginbackground";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { LuLock, LuLogIn, LuMail } from "react-icons/lu";
import Link from "next/link";
import { FaCircleNotch } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/auth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ILogin>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
    mode: "all",
  });

  const { mutate } = useMutation({
    mutationFn: loginUser,
    // Updated onSuccess handler in your login form
    onSuccess: (response) => {
      toast.success("Login successful");

      console.log("Login response:", response);
      const userData = {
        id:
          response.user?.id ||
          response.user?._id ||
          response.id ||
          response._id ||
          "temp-id",
        name:
          response.user?.name ||
          response.user?.username ||
          response.name ||
          response.username ||
          response.user?.email?.split("@")[0] ||
          response.email?.split("@")[0] ||
          "User",
        email: response.user?.email || response.email || "",
      };

      console.log("Created user data:", userData);

      // Store token in cookies
      Cookies.set("access_token", response.token, { expires: 7 });

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Update auth context
      login(userData, response.token);

      router.replace("/");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Login Failed");
    },
  });

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen w-full bg-white flex overflow-hidden">
      {/* Animation Side */}
      <div className="hidden md:block md:w-1/2 relative bg-gray-50">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <LoginBackground />
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Sign in to continue your fitness journey
            </p>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  <LuMail />
                </span>
                <input
                  {...register("email")}
                  type="text"
                  id="email"
                  placeholder="johndoe@gmail.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400`}
                />
              </div>
              {errors?.email && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  <LuLock />
                </span>
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-gray-50 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400`}
                />
              </div>
              {errors?.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 rounded bg-gray-50 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow text-base flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <FaCircleNotch className="animate-spin mr-3" />
                  Signing in...
                </>
              ) : (
                <>
                  <LuLogIn className="mr-2" />
                  Sign In
                </>
              )}
            </button>

            {/* Sign up link */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
