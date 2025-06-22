/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Control, FieldArrayWithId, useFieldArray } from "react-hook-form";
import { MoreVertical } from "lucide-react";
import { ISet, IWorkout } from "@/interface/exercise.interface";

interface ExerciseItemProps {
  exerciseField: FieldArrayWithId<IWorkout, "exercises", "id">;
  exerciseIndex: number;
  control: Control<IWorkout>;
  onAddSet: (exerciseIndex: number) => void;
  onUpdateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ISet,
    value: any
  ) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exerciseField,
  exerciseIndex,
  control,
  onAddSet,
  onUpdateSet,
}) => {
  const { fields: setFields } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets` as const,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{exerciseField.exercise.name}</h3>
        <MoreVertical className="w-5 h-5" />
      </div>

      {setFields.map((setField, setIndex) => (
        <div key={setField.id} className="grid grid-cols-4 gap-2 items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full text-sm">
            {setIndex + 1}
          </div>
          <input
            type="number"
            placeholder="Kg"
            className="bg-gray-800 border border-cyan-400 rounded p-2 text-white text-center"
            defaultValue={setField.weight || ""}
            onChange={(e) =>
              onUpdateSet(
                exerciseIndex,
                setIndex,
                "weight",
                Number(e.target.value)
              )
            }
          />
          <input
            type="number"
            placeholder="Reps"
            className="bg-gray-800 border border-gray-700 rounded p-2 text-white text-center"
            defaultValue={setField.reps || ""}
            onChange={(e) =>
              onUpdateSet(
                exerciseIndex,
                setIndex,
                "reps",
                Number(e.target.value)
              )
            }
          />
          <input
            type="text"
            placeholder="Notes"
            className="bg-gray-800 border border-gray-700 rounded p-2 text-white"
            defaultValue={setField.notes || ""}
            onChange={(e) =>
              onUpdateSet(exerciseIndex, setIndex, "notes", e.target.value)
            }
          />
        </div>
      ))}

      <button
        onClick={() => onAddSet(exerciseIndex)}
        className="text-cyan-400 text-sm"
      >
        Add Set
      </button>
    </div>
  );
};

interface ExerciseListProps {
  exerciseFields: FieldArrayWithId<IWorkout, "exercises", "id">[];
  control: Control<IWorkout>;
  onAddSet: (exerciseIndex: number) => void;
  onUpdateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ISet,
    value: any
  ) => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exerciseFields,
  control,
  onAddSet,
  onUpdateSet,
}) => {
  return (
    <div className="p-4 space-y-4">
      {exerciseFields.map((exerciseField, exerciseIndex) => (
        <ExerciseItem
          key={exerciseField.id}
          exerciseField={exerciseField}
          exerciseIndex={exerciseIndex}
          control={control}
          onAddSet={onAddSet}
          onUpdateSet={onUpdateSet}
        />
      ))}
    </div>
  );
};
