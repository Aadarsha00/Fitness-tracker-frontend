/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "@/axios/api.axios";

// Create Exercise
export const createExercise = async (data: any) => {
  try {
    const response = await api.post("/exercise", data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

// Get All Exercises
export const getAllExercise = async () => {
  try {
    const response = await api.get("/exercise");
    return response.data.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

// Get All Body Parts
export const getAllBodyParts = async () => {
  try {
    const response = await api.get("/exercise/bodyParts");
    return response.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

// Get Exercise by ID
export const getExerciseById = async (id: string) => {
  try {
    const response = await api.get(`/exercise/${id}`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

// Update Exercise
export const updateExercise = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/exercise/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

// Delete Exercise
export const deleteExercise = async (id: string) => {
  try {
    const response = await api.delete(`/exercise/${id}`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};
