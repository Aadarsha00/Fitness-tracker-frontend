import Link from "next/link";
import Image from "next/image";
import { Activity, BarChart3, Calendar, TrendingUp } from "lucide-react";
import ServiceCard from "./hero-card";

export default function FitnessHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero/hero5.png"
            alt="Fitness Journey"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>

        {/* Subtle background effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="relative px-4 py-16 sm:px-6 lg:px-8 w-full z-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              {/* Text Content - Left Side */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                    <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      Transform
                    </span>
                    <span className="block bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                      Your Fitness
                    </span>
                    <span className="block bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                      Journey
                    </span>
                  </h1>

                  <p className="text-xl leading-8 text-gray-200 max-w-xl sm:text-2xl sm:leading-9">
                    Track, analyze, and optimize your workouts with our
                    comprehensive fitness platform. Turn your goals into
                    achievements.
                  </p>
                </div>

                <div>
                  <Link
                    href="/log-workout"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <Activity className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                    Log Workout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Provide Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 sm:text-5xl">
              <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                What We Provide
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to achieve your fitness goals in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              href="/dashboard"
              title="Dashboard Overview"
              description="Get a comprehensive view of your fitness progress with detailed analytics and performance metrics."
              imageSrc="/api/placeholder/400/300"
              imageAlt="Dashboard Overview"
              icon={BarChart3}
            />

            <ServiceCard
              href="/workouts"
              title="Workout History"
              description="Review your complete workout history with detailed logs and progress tracking."
              imageSrc="/api/placeholder/400/300"
              imageAlt="Workout History"
              icon={Calendar}
            />

            <ServiceCard
              href="/log-workout"
              title="Log Workout"
              description="Easily track your workouts with our intuitive logging system for real-time progress."
              imageSrc="/api/placeholder/400/300"
              imageAlt="Log Workout"
              icon={TrendingUp}
            />
          </div>
        </div>
      </div>

      {/* Simple Call to Action Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of fitness enthusiasts who have transformed their
            lives.
          </p>
          <Link
            href="/log-workout"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <Activity className="mr-3 h-6 w-6" />
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
