"use client";

import React from "react";
import { ChevronLeft, Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllBodyParts } from "@/api/exercise";
import { BodyPart } from "@/interface/exercise.interface";

interface BodyPartsViewProps {
  onBack: () => void;
  onSelectBodyPart: (bodyPart: string) => void;
  onCreateExercise: () => void;
}

const BodyPartsView: React.FC<BodyPartsViewProps> = ({
  onBack,
  onSelectBodyPart,
  onCreateExercise,
}) => {
  const {
    data: bodyPartsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bodyParts"],
    queryFn: getAllBodyParts,
    staleTime: 10 * 60 * 1000,
  });

  // Debug: Log the actual response to see what you're getting
  console.log("Body parts response:", bodyPartsResponse);

  // Ensure we always have an array, handle different response structures
  const bodyParts = React.useMemo(() => {
    if (!bodyPartsResponse) return [];

    // If response is already an array
    if (Array.isArray(bodyPartsResponse)) {
      return bodyPartsResponse;
    }

    // If response has a data property that contains the array
    if (bodyPartsResponse.data && Array.isArray(bodyPartsResponse.data)) {
      return bodyPartsResponse.data;
    }

    // If response has a bodyParts property
    if (
      bodyPartsResponse.bodyParts &&
      Array.isArray(bodyPartsResponse.bodyParts)
    ) {
      return bodyPartsResponse.bodyParts;
    }

    // If all else fails, return empty array
    return [];
  }, [bodyPartsResponse]);

  // Fallback to enum values if API fails or returns empty
  const fallbackBodyParts = Object.values(BodyPart);

  const finalBodyParts = bodyParts.length > 0 ? bodyParts : fallbackBodyParts;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load body parts</p>
          <p className="text-gray-400 mb-4">Using default body parts</p>
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
          <span className="text-lg font-medium">Select Exercise</span>
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
            <div className="text-gray-400">Loading body parts...</div>
          </div>
        ) : (
          finalBodyParts.map((bodyPart: string) => (
            <button
              key={bodyPart}
              onClick={() => onSelectBodyPart(bodyPart)}
              className="w-full text-left p-4 text-lg hover:bg-gray-800 transition-colors capitalize"
            >
              {bodyPart.replace(/_/g, " ")}
            </button>
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

export default BodyPartsView;
