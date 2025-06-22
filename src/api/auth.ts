/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/axios/api.axios";
import { ILogin, ISignUp } from "@/interface/auth.interface";

//create user
export const createUser = async (data: ISignUp) => {
  try {
    const response = await api.post("/user/", data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

//login user
export const loginUser = async (data: ILogin) => {
  try {
    const response = await api.post("/user/login", data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};
