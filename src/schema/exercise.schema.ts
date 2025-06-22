import * as yup from "yup";
import { BodyPart } from "@/interface/exercise.interface";

export const exerciseSchema = yup.object().shape({
  name: yup.string().required("Exercise name is required"),
  bodyPart: yup
    .mixed<BodyPart>()
    .oneOf(Object.values(BodyPart), "Invalid body part")
    .required("Body part is required"),
  instruction: yup.string().required("Instruction is required"),
  isCustom: yup.boolean().optional(),
  createdBy: yup.string().nullable().optional(),
});
