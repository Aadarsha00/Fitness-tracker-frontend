/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Clock, MoreVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { IWorkout } from "@/interface/exercise.interface";
import { createWorkout } from "@/api/workout";

interface WorkoutFormProps {
  form: UseFormReturn<IWorkout>;
  onWorkoutSaved?: (workout: IWorkout) => void;
  onCancel?: () => void;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({
  form,
  onWorkoutSaved,
  onCancel,
}) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;
  const workout = watch();
  const queryClient = useQueryClient();

  // Mutation for saving workout
  const saveWorkoutMutation = useMutation({
    mutationFn: (workoutData: IWorkout) => createWorkout(workoutData),
    onSuccess: (savedWorkout) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["userWorkouts"] });

      // Show success toast
      toast.success("Workout saved successfully!");

      if (onWorkoutSaved) {
        onWorkoutSaved(savedWorkout);
      }
    },
    onError: (error: any) => {
      console.error("Failed to save workout:", error);

      const errorMessage =
        error?.message || "Failed to save workout. Please try again.";
      toast.error(errorMessage);
    },
  });

  // Handle form submission
  const onSubmit = (data: IWorkout) => {
    saveWorkoutMutation.mutate(data);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={saveWorkoutMutation.isPending}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              saveWorkoutMutation.isPending
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-cyan-500 text-white hover:bg-cyan-600"
            }`}
          >
            {saveWorkoutMutation.isPending ? "Saving..." : "Finish"}
          </button>
          <span className="text-base sm:text-lg font-medium text-white">
            {workout.date}
          </span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saveWorkoutMutation.isPending}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            {...register("name", { required: "Workout name is required" })}
          />
          <input
            type="number"
            placeholder="BW (Kg)"
            step="0.1"
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            {...register("bodyWeight", { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4">
            <div className="text-xs text-gray-400 mb-1">Date</div>
            <div className="text-white font-medium">{workout.date}</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4">
            <div className="text-xs text-gray-400 mb-1">Start Time</div>
            <div className="text-white font-medium">{workout.startTime}</div>
          </div>
          <input
            type="time"
            placeholder="End Time"
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            {...register("endTime")}
          />
        </div>

        <div className="max-w-md">
          <textarea
            placeholder="Notes"
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 text-white placeholder-gray-400 w-full h-20 sm:h-24 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            {...register("notes")}
          />
        </div>
      </div>
    </>
  );
};
