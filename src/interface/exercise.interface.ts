export enum BodyPart {
  CHEST = "chest",
  BACK = "back",
  SHOULDERS = "shoulders",
  ARMS = "arms",
  LEGS = "legs",
  CORE = "core",
  CARDIO = "cardio",
  FULL_BODY = "full_body",
}

export interface IExercise {
  _id?: string;
  name: string;
  bodyPart: BodyPart;
  instruction: string;
  createdBy?: string;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ViewState =
  | "workout"
  | "bodyparts"
  | "exercises"
  | "create-exercise";

export interface ISet {
  reps: number;
  weight: number;
  notes: string;
  completed: boolean;
}

export interface IWorkoutExercise {
  exercise: IExercise;
  sets: ISet[];
  notes: string;
}

export interface IWorkout {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  bodyWeight: number;
  notes: string;
  exercises: IWorkoutExercise[];
}
