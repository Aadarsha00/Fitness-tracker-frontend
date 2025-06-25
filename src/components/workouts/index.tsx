/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getUserWorkouts, deleteWorkout } from "@/api/workout";
import Loading from "@/ui/loading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Workout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["workouts"],
    queryFn: getUserWorkouts,
  });
  console.log("workouts", data);
  const deleteMutation = useMutation({
    mutationFn: deleteWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const workouts = Array.isArray(data) ? data : [];

  if (!workouts || workouts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="border border-gray-800 rounded-lg p-8 bg-gray-900/50">
            <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-white mb-3">
              No workouts yet
            </h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Start tracking your fitness journey
            </p>
            <button
              onClick={() => router.push("/log-workout")}
              className="w-full bg-white text-gray-900 font-medium py-2.5 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              Log first workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-white">Workouts</h1>
            <p className="text-gray-400 text-sm mt-1">
              {workouts.length} total
            </p>
          </div>
          <button
            onClick={() => router.push("/log-workout")}
            className="bg-white text-gray-900 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm"
          >
            New workout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-medium text-white mb-1">
              {workouts.length}
            </div>
            <div className="text-gray-400 text-sm">Workouts</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-medium text-white mb-1">
              {workouts.reduce(
                (acc: number, workout: any) =>
                  acc + (workout.exercises?.length || 0),
                0
              )}
            </div>
            <div className="text-gray-400 text-sm">Exercises</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="text-2xl font-medium text-white mb-1">
              {
                workouts.filter((workout: any) => {
                  const workoutDate = new Date(workout.createdAt);
                  const now = new Date();
                  return (
                    workoutDate.getMonth() === now.getMonth() &&
                    workoutDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </div>
            <div className="text-gray-400 text-sm">This month</div>
          </div>
        </div>

        {/* Workout List */}
        <div className="space-y-3">
          {workouts.map((workout: any) => (
            <WorkoutCard
              key={workout._id}
              workout={workout}
              onDelete={() => deleteMutation.mutate(workout._id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkoutCard = ({
  workout,
  onDelete,
  isDeleting,
}: {
  workout: any;
  onDelete: () => void;
  isDeleting: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this workout?")) {
      onDelete();
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors duration-200">
      {/* Compact Header - Always Visible */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium text-white">{workout.name}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {workout.exercises?.length || 0} exercises
                </span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete workout"
                >
                  {isDeleting ? (
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {new Date(workout.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {workout.notes && (
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  Has notes
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-800">
          {/* Notes */}
          {workout.notes && (
            <div className="px-4 py-3 bg-gray-800/30">
              <p className="text-sm text-gray-300 italic">{workout.notes}</p>
            </div>
          )}

          {/* Exercises */}
          <div className="p-4 space-y-4">
            {workout.exercises?.map((ex: any) => (
              <div key={ex._id} className="border-l-2 border-gray-700 pl-3">
                {/* Exercise Header */}
                <div className="mb-2">
                  <h3 className="font-medium text-white text-sm">
                    {ex.exercise?.name || "Unknown Exercise"}
                  </h3>
                  <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                    {ex.exercise?.bodyPart || "Unknown Body Part"}
                  </span>
                </div>

                {/* Sets */}
                <div className="space-y-1">
                  {ex.sets?.map((set: any, setIndex: number) => (
                    <div
                      key={set._id}
                      className="flex items-center justify-between py-1.5 px-2 bg-gray-800/40 rounded text-xs"
                    >
                      <span className="text-gray-400">Set {setIndex + 1}</span>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <span>{set.reps} reps</span>
                        <span className="text-gray-600">×</span>
                        <span>{set.weight} kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;
