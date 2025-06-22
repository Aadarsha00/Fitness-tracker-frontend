"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExercise, getAllBodyParts } from "@/api/exercise";
import { BodyPart, IExercise } from "@/interface/exercise.interface";

interface CreateExerciseFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

type CreateExerciseFormType = {
  name: string;
  bodyPart: BodyPart;
  instruction: string;
};

export const CreateExerciseForm: React.FC<CreateExerciseFormProps> = ({
  onBack,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const { data: bodyParts = [], isPending: bodyPartsLoading } = useQuery<
    BodyPart[]
  >({
    queryKey: ["bodyParts"],
    queryFn: getAllBodyParts,
    staleTime: 10 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateExerciseFormType>({
    mode: "onChange",
  });

  const { mutateAsync: createExerciseMutation, status: mutationStatus } =
    useMutation({
      mutationFn: (data: CreateExerciseFormType) => createExercise(data),
      onSuccess: (newExercise: IExercise) => {
        queryClient.invalidateQueries({ queryKey: ["exercises"] });
        queryClient.invalidateQueries({
          queryKey: ["exercisesByBodyPart", newExercise.bodyPart],
        });
      },
    });

  const isCreating = mutationStatus === "pending";

  const onSubmit = async (data: CreateExerciseFormType) => {
    try {
      await createExerciseMutation(data);
      reset();
      onSuccess();
    } catch (error) {
      console.error("Failed to create exercise:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} aria-label="Go back">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-lg font-medium">Create Exercise</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Exercise Name"
            className={`w-full bg-gray-800 border rounded p-3 text-white ${
              errors.name ? "border-red-500" : "border-gray-700"
            }`}
            {...register("name", { required: "Exercise name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <select
            className={`w-full bg-gray-800 border rounded p-3 text-white ${
              errors.bodyPart ? "border-red-500" : "border-gray-700"
            }`}
            {...register("bodyPart", { required: "Body part is required" })}
            disabled={bodyPartsLoading}
            defaultValue=""
          >
            <option value="" disabled>
              Select Body Part
            </option>
            {bodyParts.map((bp) => (
              <option key={bp} value={bp}>
                {bp.charAt(0).toUpperCase() + bp.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
          {errors.bodyPart && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bodyPart.message}
            </p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Instructions"
            className={`w-full bg-gray-800 border rounded p-3 text-white h-32 ${
              errors.instruction ? "border-red-500" : "border-gray-700"
            }`}
            {...register("instruction", {
              required: "Instructions are required",
            })}
          />
          {errors.instruction && (
            <p className="text-red-500 text-sm mt-1">
              {errors.instruction.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isCreating}
          className="w-full bg-cyan-400 text-black py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Creating..." : "Create Exercise"}
        </button>
      </form>
    </div>
  );
};
