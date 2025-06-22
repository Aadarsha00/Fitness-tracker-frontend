/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/axios/api.axios";
import { IWorkout } from "@/interface/exercise.interface";

// Create Workout
export const createWorkout = async (workoutData: IWorkout) => {
  try {
    const response = await api.post("/workout", workoutData);
    return response.data.data || response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

// Get Workout by ID
export const getWorkoutById = async (id: string) => {
  try {
    const response = await api.get(`/workout/id/${id}`);
    return response.data.data || response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

// Get User's Workouts
export const getUserWorkouts = async () => {
  try {
    const response = await api.get("/workout/user");
    return response.data.data || response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

// Update Workout
export const updateWorkout = async (
  id: string,
  workoutData: Partial<IWorkout>
) => {
  try {
    const response = await api.patch(`/workout/${id}`, workoutData);
    return response.data.data || response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

// Delete Workout
export const deleteWorkout = async (id: string) => {
  try {
    const response = await api.delete(`/workout/${id}`);
    return response.data.data || response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

// Get All Workouts
export const getAllWorkouts = async () => {
  try {
    const response = await api.get("/workout");
    return response.data.data || response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
