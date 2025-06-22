"use client";
import { Player } from "@lottiefiles/react-lottie-player";

const SignupBackground = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Player
        autoplay
        loop
        src="/animation/weight-lifter.json"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-gray-800 text-xl font-medium">
          Strength comes from consistency
        </p>
      </div>
    </div>
  );
};

export default SignupBackground;
