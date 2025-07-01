/* eslint-disable @typescript-eslint/no-explicit-any */
// Fixed API functions with proper error handling and endpoint corrections

import api from "@/axios/api.axios";

export const getWorkoutAnalytics = async (period = 30) => {
  try {
    const res = await api.get(`/dashboard/workout-analytics?period=${period}`);
    return res.data?.data || { workoutFrequency: [] };
  } catch (error) {
    console.error("Error fetching workout analytics:", error);
    return { workoutFrequency: [] };
  }
};

export const getBodyWeightProgress = async (period = 90) => {
  try {
    console.log(`🔍 Fetching body weight progress for period: ${period} days`);
    const res = await api.get(
      `/dashboard/body-weight-progress?period=${period}`
    );

    console.log("🔍 Body weight API response:", res.data);

    // The backend returns data directly in res.data.data
    const bodyWeightData = res.data?.data || [];

    console.log(`🔍 Extracted body weight data:`, bodyWeightData);
    console.log(`🔍 Number of records: ${bodyWeightData.length}`);

    // Log debug info if available
    if (res.data?.debug) {
      console.log("🔍 Debug info from backend:", res.data.debug);
    }

    return bodyWeightData;
  } catch (error: any) {
    console.error("❌ Error fetching body weight progress:", error);
    console.error("❌ Error response:", error.response?.data);
    return [];
  }
};

export const getExercisePerformance = async (
  exerciseId: string,
  period = 90
) => {
  console.log("API call - exerciseId:", exerciseId, "period:", period);
  if (!exerciseId) return [];
  try {
    const res = await api.get(
      `/dashboard/exercise-performance?exerciseId=${exerciseId}&period=${period}`
    );
    console.log("API response:", res.data);
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching exercise performance:", error);
    return [];
  }
};

export const getBodyPartDistribution = async (period = 30) => {
  try {
    const res = await api.get(
      `/dashboard/body-part-distribution?period=${period}`
    );
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching body part distribution:", error);
    return [];
  }
};

export const getWorkoutSummary = async (period = 30) => {
  try {
    const res = await api.get(`/dashboard/workout-summary?period=${period}`);
    return (
      res.data?.data || {
        totalWorkouts: 0,
        totalExercises: 0,
        avgExercisesPerWorkout: 0,
        totalVolume: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching workout summary:", error);
    return {
      totalWorkouts: 0,
      totalExercises: 0,
      avgExercisesPerWorkout: 0,
      totalVolume: 0,
    };
  }
};

export const getPersonalRecords = async () => {
  try {
    const res = await api.get(`/dashboard/personal-records`);
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching personal records:", error);
    return [];
  }
};

// Fixed getExercises function with multiple endpoint attempts
export const getExercises = async () => {
  console.log("=== GETTING EXERCISES ===");

  // List of possible endpoints to try
  const possibleEndpoints = [
    "/exercises",
    "/exercise",
    "/dashboard/exercises",
    "/bodyparts/exercises", // Since you mentioned exercises fall under bodyparts
    "/bodyparts", // In case we need to get bodyparts first
  ];

  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);
      const res = await api.get(endpoint);

      console.log(`Response from ${endpoint}:`, res.data);

      // Check various possible response structures
      let exercises = [];

      if (res.data?.data && Array.isArray(res.data.data)) {
        exercises = res.data.data;
      } else if (Array.isArray(res.data)) {
        exercises = res.data;
      } else if (res.data?.exercises && Array.isArray(res.data.exercises)) {
        exercises = res.data.exercises;
      } else if (
        res.data?.data?.exercises &&
        Array.isArray(res.data.data.exercises)
      ) {
        exercises = res.data.data.exercises;
      }

      // If this endpoint returned exercises, flatten them if they're nested under bodyparts
      if (exercises.length > 0) {
        // Check if exercises are nested under bodyparts
        const flattenedExercises = [];

        for (const item of exercises) {
          if (item.exercises && Array.isArray(item.exercises)) {
            // This looks like a bodypart with exercises
            for (const exercise of item.exercises) {
              flattenedExercises.push({
                _id: exercise._id || exercise.id,
                name: exercise.name,
                bodyPart: item.name || item.bodyPart,
                ...exercise,
              });
            }
          } else if (item.name || item._id) {
            // This looks like a direct exercise
            flattenedExercises.push({
              _id: item._id || item.id,
              name: item.name,
              ...item,
            });
          }
        }

        if (flattenedExercises.length > 0) {
          console.log(
            `Found ${flattenedExercises.length} exercises from ${endpoint}`
          );
          return flattenedExercises;
        }

        // If no flattening needed, return as is
        console.log(`Found ${exercises.length} exercises from ${endpoint}`);
        return exercises;
      }
    } catch (error: any) {
      console.log(
        `Endpoint ${endpoint} failed:`,
        error.response?.status,
        error.message
      );
      continue; // Try next endpoint
    }
  }

  console.error("=== ALL EXERCISE ENDPOINTS FAILED ===");
  console.error("None of the possible endpoints returned exercise data");
  return [];
};

// Alternative function to get exercises by bodypart
export const getExercisesByBodyPart = async () => {
  console.log("=== GETTING EXERCISES BY BODYPART ===");

  try {
    const res = await api.get("/bodyparts");
    console.log("Bodyparts response:", res.data);

    const bodyParts = res.data?.data || res.data || [];
    const allExercises = [];

    for (const bodyPart of bodyParts) {
      if (bodyPart.exercises && Array.isArray(bodyPart.exercises)) {
        for (const exercise of bodyPart.exercises) {
          allExercises.push({
            _id: exercise._id || exercise.id,
            name: exercise.name,
            bodyPart: bodyPart.name,
            ...exercise,
          });
        }
      }
    }

    console.log(`Found ${allExercises.length} exercises from bodyparts`);
    return allExercises;
  } catch (error) {
    console.error("Error fetching exercises by bodypart:", error);
    return [];
  }
};

export const getDashboardOverview = async (period = 30) => {
  try {
    const [
      workoutAnalytics,
      workoutSummary,
      bodyPartDistribution,
      personalRecords,
    ] = await Promise.all([
      getWorkoutAnalytics(period),
      getWorkoutSummary(period),
      getBodyPartDistribution(period),
      getPersonalRecords(),
    ]);

    return {
      workoutAnalytics,
      workoutSummary,
      bodyPartDistribution,
      personalRecords,
    };
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return {
      workoutAnalytics: { workoutFrequency: [] },
      workoutSummary: {
        totalWorkouts: 0,
        totalExercises: 0,
        avgExercisesPerWorkout: 0,
        totalVolume: 0,
      },
      bodyPartDistribution: [],
      personalRecords: [],
    };
  }
};
