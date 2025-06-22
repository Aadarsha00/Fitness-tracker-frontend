/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ChevronLeft, Search, Plus, Info, MoreVertical } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IExercise } from "@/interface/exercise.interface";
import { deleteExercise, getAllExercise } from "@/api/exercise";

interface ExercisesViewProps {
  bodyPart: string;
  onBack: () => void;
  onSelectExercise: (exercise: IExercise) => void;
  onCreateExercise: () => void;
}

const ExercisesView: React.FC<ExercisesViewProps> = ({
  bodyPart,
  onBack,
  onSelectExercise,
  onCreateExercise,
}) => {
  const queryClient = useQueryClient();

  const {
    data: exercises = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exercisesByBodyPart", bodyPart],
    queryFn: () =>
      getAllExercise().then((res) =>
        res.filter((e: any) => e.bodyPart === bodyPart)
      ),
    enabled: !!bodyPart,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exercisesByBodyPart", bodyPart],
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this exercise?")) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load exercises</p>
          <button
            onClick={onBack}
            className="bg-cyan-400 text-black px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <button onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-lg font-medium capitalize">{bodyPart}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5" />
          <button onClick={onCreateExercise}>
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading exercises...</div>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              No exercises found for {bodyPart}
            </p>
            <button
              onClick={onCreateExercise}
              className="bg-cyan-400 text-black px-4 py-2 rounded"
            >
              Create First Exercise
            </button>
          </div>
        ) : (
          exercises.map((exercise: IExercise) => (
            <div
              key={exercise._id}
              className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
            >
              <button
                onClick={() => onSelectExercise(exercise)}
                className="flex-1 text-left"
              >
                <div className="font-medium">{exercise.name}</div>
                {exercise.isCustom && (
                  <div className="text-xs text-cyan-400 mt-1">
                    Custom Exercise
                  </div>
                )}
              </button>
              <div className="flex items-center space-x-4">
                <Info className="w-5 h-5" />
                {exercise._id && (
                  <button onClick={() => handleDelete(exercise._id!)}>
                    <MoreVertical className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-cyan-400 p-4">
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input type="radio" name="mode" defaultChecked />
            <span className="text-black">Regular</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="mode" />
            <span className="text-black">Unlock Supersets</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ExercisesView;
