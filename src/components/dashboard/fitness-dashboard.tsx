/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Dumbbell,
  Award,
  Activity,
  AlertCircle,
  Scale,
} from "lucide-react";
import {
  getDashboardOverview,
  getBodyWeightProgress,
  getExercisePerformance,
  getExercises,
  getExercisesByBodyPart,
} from "@/api/dashboard";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

interface Exercise {
  _id: string;
  name: string;
  bodyPart?: string;
}

interface DashboardData {
  workoutAnalytics: {
    workoutFrequency: { date: string; workouts: number }[];
  };
  workoutSummary: {
    totalWorkouts: number;
    totalExercises: number;
    avgExercisesPerWorkout: number;
    totalVolume: number;
  };
  bodyPartDistribution: { bodyPart: string; count: number }[];
  personalRecords: {
    exerciseName: string;
    bodyPart: string;
    maxWeight: number;
  }[];
}

interface BodyWeightData {
  date: string;
  weight: number;
}

interface ExercisePerformanceData {
  date: string;
  maxWeight: number;
}

const COLORS = [
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
];

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "purple",
}) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-300">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      <div className="p-3 rounded-full bg-purple-900/50">
        <Icon className="h-6 w-6 text-purple-400" />
      </div>
    </div>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-32 text-red-400">
    <AlertCircle className="h-5 w-5 mr-2" />
    <span>{message}</span>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300">{`Date: ${new Date(
          label
        ).toLocaleDateString()}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-white">{`${entry.name}: ${
            entry.value
          }${entry.name === "weight" ? " lbs" : ""}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null
  );

  // Fetch exercises with fallback to bodypart method
  const {
    data: exercises = [],
    isLoading: exercisesLoading,
    error: exercisesError,
    isError: exercisesIsError,
  } = useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      // Try the main exercises endpoint first
      let result = await getExercises();

      // If that fails or returns invalid data, try the bodypart method
      if (!result || !Array.isArray(result) || result.length === 0) {
        result = await getExercisesByBodyPart();
      }

      // Validate the result
      if (!Array.isArray(result)) {
        return [];
      }

      // Ensure each exercise has required fields
      const validExercises = result.filter(
        (ex) => ex && (ex._id || ex.id) && ex.name
      );

      return validExercises;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Dashboard overview data (summary + others)
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useQuery<DashboardData>({
    queryKey: ["dashboard-overview", selectedPeriod],
    queryFn: () => getDashboardOverview(selectedPeriod),
    staleTime: 5 * 60 * 1000,
  });

  // Body weight progress - FIXED: Use selectedPeriod consistently
  const {
    data: bodyWeightData = [],
    isLoading: isBodyWeightLoading,
    error: bodyWeightError,
    isError: isBodyWeightError,
  } = useQuery<BodyWeightData[]>({
    queryKey: ["body-weight-progress", selectedPeriod],
    queryFn: async () => {
      console.log(`🔍 Fetching body weight for period: ${selectedPeriod}`);
      const result = await getBodyWeightProgress(selectedPeriod);
      console.log(`🔍 Body weight query result:`, result);
      return result;
    },
    staleTime: 2 * 60 * 1000, // Reduced stale time for debugging
    retry: 2,
  });

  // Exercise performance for selected exercise
  const {
    data: exercisePerformance = [],
    isLoading: isExerciseLoading,
    error: exercisePerformanceError,
  } = useQuery<ExercisePerformanceData[]>({
    queryKey: ["exercise-performance", selectedExerciseId, selectedPeriod],
    queryFn: () => getExercisePerformance(selectedExerciseId!, selectedPeriod),
    enabled: !!selectedExerciseId && selectedExerciseId !== "",
    staleTime: 5 * 60 * 1000,
  });

  // Automatically select first exercise once loaded
  useEffect(() => {
    if (
      !exercisesLoading &&
      exercises &&
      Array.isArray(exercises) &&
      exercises.length > 0 &&
      !selectedExerciseId
    ) {
      const firstExercise = exercises[0];
      const exerciseId = firstExercise._id || firstExercise.id;

      if (exerciseId) {
        setSelectedExerciseId(exerciseId);
      }
    }
  }, [exercises, selectedExerciseId, exercisesLoading]);

  // Debug effect for body weight data
  useEffect(() => {
    console.log("🔍 Body weight data changed:", {
      isLoading: isBodyWeightLoading,
      isError: isBodyWeightError,
      dataLength: bodyWeightData?.length,
      data: bodyWeightData,
      error: bodyWeightError,
    });
  }, [bodyWeightData, isBodyWeightLoading, isBodyWeightError, bodyWeightError]);

  // Show loading state
  if (isDashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state for dashboard
  if (dashboardError) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-red-400">
            <h2 className="text-lg font-semibold mb-2">Dashboard Error</h2>
            <p>Failed to load dashboard data. Please try again.</p>
            <p className="text-sm mt-2">
              Error: {dashboardError?.message || "Unknown error"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const { workoutSummary, bodyPartDistribution, personalRecords } =
    dashboardData;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Fitness Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Workouts"
            value={workoutSummary.totalWorkouts}
            subtitle={`${selectedPeriod} days`}
            icon={Dumbbell}
          />
          <StatCard
            title="Total Exercises"
            value={workoutSummary.totalExercises}
            subtitle={`Avg ${workoutSummary.avgExercisesPerWorkout}/workout`}
            icon={Activity}
          />
          <StatCard
            title="Total Volume"
            value={`${workoutSummary.totalVolume.toLocaleString()} lbs`}
            subtitle="Weight × Reps"
            icon={TrendingUp}
          />
          <StatCard
            title="Personal Records"
            value={personalRecords.length}
            subtitle="All time"
            icon={Award}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Exercise Performance Chart */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Exercise Performance
            </h3>

            {/* Exercise Selection */}
            <div className="mb-4">
              {exercisesLoading ? (
                <div className="bg-gray-700 rounded-md px-3 py-2 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                  <span className="text-gray-400">Loading exercises...</span>
                </div>
              ) : exercisesIsError ? (
                <div className="bg-red-900/20 border border-red-500 rounded-md px-3 py-2 text-red-400">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Failed to load exercises
                </div>
              ) : !Array.isArray(exercises) ? (
                <div className="bg-yellow-900/20 border border-yellow-500 rounded-md px-3 py-2 text-yellow-400">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Invalid exercise data format
                </div>
              ) : (
                <select
                  value={selectedExerciseId || ""}
                  onChange={(e) =>
                    setSelectedExerciseId(e.target.value || null)
                  }
                  className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 w-full"
                >
                  <option value="">Select an exercise</option>
                  {exercises.map((ex) => {
                    const exerciseId = ex._id || ex.id;
                    const exerciseName = ex.name;
                    const bodyPart = ex.bodyPart ? ` (${ex.bodyPart})` : "";

                    return (
                      <option key={exerciseId} value={exerciseId}>
                        {exerciseName}
                        {bodyPart}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {/* Chart Content */}
            {exercisesIsError ? (
              <ErrorMessage message="Cannot load exercise data" />
            ) : isExerciseLoading ? (
              <LoadingSpinner />
            ) : !selectedExerciseId ? (
              <p className="text-gray-400 text-center py-8">
                Please select an exercise to view performance data.
              </p>
            ) : exercisePerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={exercisePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#9ca3af" }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis tick={{ fill: "#9ca3af" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="maxWeight"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No exercise performance data available for the selected exercise
                and period.
              </p>
            )}
          </div>

          {/* Body Part Distribution */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Body Part Focus
            </h3>
            {bodyPartDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bodyPartDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ bodyPart, percent }) =>
                      `${bodyPart} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {bodyPartDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    formatter={(value) => [value, "Exercises"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No body part data available for the selected period.
              </p>
            )}
          </div>
        </div>

        {/* Body Weight Progress & Personal Records */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Body Weight Progress - ENHANCED ERROR HANDLING */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Scale className="h-5 w-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">
                Body Weight Progress
              </h3>
            </div>

            {/* Debug Information */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-4 p-2 bg-gray-700 rounded text-xs text-gray-300">
                Debug: Loading={isBodyWeightLoading.toString()}, Error=
                {isBodyWeightError.toString()}, Data Length=
                {bodyWeightData?.length || 0}
              </div>
            )}

            {isBodyWeightLoading ? (
              <LoadingSpinner />
            ) : isBodyWeightError ? (
              <div className="text-center py-8">
                <ErrorMessage message="Failed to load body weight data" />
                <p className="text-sm text-gray-500 mt-2">
                  Error: {bodyWeightError?.message || "Unknown error"}
                </p>
              </div>
            ) : bodyWeightData && bodyWeightData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bodyWeightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#9ca3af" }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis
                    domain={["dataMin - 5", "dataMax + 5"]}
                    tick={{ fill: "#9ca3af" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8">
                <Scale className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">
                  No body weight data available for the selected{" "}
                  {selectedPeriod}-day period.
                </p>
                <p className="text-sm text-gray-500">
                  Make sure to record your body weight when creating workouts.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            )}
          </div>

          {/* Personal Records */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Personal Records
            </h3>
            {personalRecords.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {personalRecords.map((record, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-4 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-semibold">
                        {record.exerciseName}
                      </p>
                      <p className="text-sm text-gray-400">{record.bodyPart}</p>
                    </div>
                    <div className="text-purple-400 font-bold text-lg">
                      {record.maxWeight} lbs
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No personal records available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
