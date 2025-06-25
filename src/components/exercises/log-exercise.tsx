"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import {
  BodyPart,
  IExercise,
  ISet,
  IWorkout,
  IWorkoutExercise,
  ViewState,
} from "@/interface/exercise.interface";
import { WorkoutForm } from "./workout-form";
import { ExerciseList } from "./exercise-list";
import { CreateExerciseForm } from "./create-exercise";
import ExercisesView from "./exercise-view";
import BodyPartsView from "./body-part";

const WorkoutApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>("workout");
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | "">("");

  const workoutForm = useForm<IWorkout>({
    defaultValues: {
      name: "",
      date: new Date().toISOString(),
      startTime: "",
      endTime: "",
      bodyWeight: 0,
      notes: "",
      exercises: [],
    },
  });

  const { control, watch, setValue, getValues } = workoutForm;
  const { fields: exerciseFields, append: appendExercise } = useFieldArray({
    control,
    name: "exercises",
  });

  const workout = watch();

  useEffect(() => {
    // Set current time as start time when component mounts
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5); // HH:MM format
    setValue("startTime", timeString);
  }, [setValue]);

  const handleAddExercise = (exercise: IExercise) => {
    const newWorkoutExercise: IWorkoutExercise = {
      exercise,
      sets: [{ reps: 0, weight: 0, notes: "", completed: false }],
      notes: "",
    };

    appendExercise(newWorkoutExercise);
    setCurrentView("workout");
  };

  const handleAddSet = (exerciseIndex: number) => {
    const currentExercises = getValues("exercises");
    const newSet: ISet = {
      reps: 0,
      weight: 0,
      notes: "",
      completed: false,
    };

    const updatedSets = [...currentExercises[exerciseIndex].sets, newSet];
    setValue(`exercises.${exerciseIndex}.sets`, updatedSets);
  };

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ISet,
    value: any
  ) => {
    setValue(`exercises.${exerciseIndex}.sets.${setIndex}.${field}`, value);
  };

  const renderWorkoutView = () => (
    <div className="min-h-screen bg-black text-white">
      <WorkoutForm form={workoutForm} />

      {/* Exercises */}
      <ExerciseList
        exerciseFields={exerciseFields}
        control={control}
        onAddSet={handleAddSet}
        onUpdateSet={handleUpdateSet}
      />

      {/* Add Exercise Button */}
      <div className="p-4">
        <button
          onClick={() => setCurrentView("bodyparts")}
          className="w-full bg-cyan-400 text-black py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Exercise</span>
        </button>
      </div>
    </div>
  );

  switch (currentView) {
    case "bodyparts":
      return (
        <BodyPartsView
          onBack={() => setCurrentView("workout")}
          onSelectBodyPart={(bodyPart: string) => {
            setSelectedBodyPart(bodyPart as BodyPart);
            setCurrentView("exercises");
          }}
          onCreateExercise={() => setCurrentView("create-exercise")}
        />
      );
    case "exercises":
      return (
        <ExercisesView
          bodyPart={selectedBodyPart as string}
          onBack={() => setCurrentView("bodyparts")}
          onSelectExercise={handleAddExercise}
          onCreateExercise={() => setCurrentView("create-exercise")}
        />
      );
    case "create-exercise":
      return (
        <CreateExerciseForm
          onBack={() =>
            setCurrentView(selectedBodyPart ? "exercises" : "bodyparts")
          }
          onSuccess={() =>
            setCurrentView(selectedBodyPart ? "exercises" : "bodyparts")
          }
        />
      );
    default:
      return renderWorkoutView();
  }
};

export default WorkoutApp;
