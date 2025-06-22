/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ISignUp } from "@/interface/auth.interface";
import { signUpSchema } from "@/schema/signup.schema";
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Gender from "@/ui/gender-input";
import SignupBackground from "@/ui/signupbackground";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaCircleNotch,
} from "react-icons/fa";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/api/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FormSignup = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ISignUp>({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      gender: undefined,
      confirmPassword: "",
    },

    resolver: yupResolver(signUpSchema) as any,
    mode: "all",
  });

  //mutation user
  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("User created successfully!");
      router.replace("/login");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to register the user");
    },
  });
  const onSubmit: SubmitHandler<ISignUp> = (data) => {
    const transformedData = {
      ...data,
      gender: data.gender || undefined,
    };
    mutate(transformedData);
  };

  return (
    <div className="min-h-screen w-full bg-white flex overflow-hidden">
      {/* Animation Side - Simplified White */}
      <div className="hidden md:block md:w-1/2 relative bg-gray-50">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <SignupBackground />
        </div>
      </div>

      {/* Form Side - Clean White Version */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Join our fitness community today
            </p>

            {/* Username */}
            <div className="mb-5">
              <label
                htmlFor="userName"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  <FaUser />
                </span>
                <input
                  {...register("userName")}
                  type="text"
                  id="userName"
                  placeholder="Enter your username"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border ${
                    errors.userName ? "border-red-500" : "border-gray-300"
                  } text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400`}
                />
              </div>
              {errors.userName && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.userName.message}
                </p>
              )}
            </div>

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
                  <FaEnvelope />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <Gender control={control} />
            {errors.gender && (
              <p className="text-xs text-red-500 mt-1 mb-5 font-medium">
                {errors.gender.message}
              </p>
            )}

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
                  <FaLock />
                </span>
                <input
                  {...register("password")}
                  id="password"
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-gray-50 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 block mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  <FaCheckCircle />
                </span>
                <input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-gray-50 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Already have account link */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormSignup;
