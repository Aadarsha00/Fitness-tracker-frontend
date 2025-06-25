import Link from "next/link";
import { Activity, BarChart3, Calendar, TrendingUp } from "lucide-react";
import ServiceCard from "./hero-card";

export default function FitnessHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Transform Your Fitness Journey
            </h1>
            <p className="mt-6 text-lg leading-7 text-gray-300 max-w-2xl mx-auto sm:text-xl sm:leading-8">
              Track, analyze, and optimize your workouts with our comprehensive
              fitness platform. Turn your goals into achievements with
              data-driven insights.
            </p>
            <div className="mt-8 sm:mt-12">
              <Link
                href="/log-workout"
                className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl shadow-2xl hover:shadow-gray-500/25 transform hover:scale-105 transition-all duration-300 hover:from-gray-600 hover:to-gray-700 border border-gray-600 sm:px-8 sm:py-4 sm:text-lg"
              >
                <Activity className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300 sm:mr-3 sm:h-6 sm:w-6" />
                Log Workout
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-400/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">
              What We Provide
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto sm:text-xl">
              Everything you need to achieve your fitness goals in one powerful
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              href="/dashboard"
              title="Dashboard Overview"
              description="Get a comprehensive view of your fitness progress with detailed analytics, performance metrics, and personalized insights to keep you motivated."
              imageSrc="/api/placeholder/400/300"
              imageAlt="Dashboard Overview"
              icon={BarChart3}
            />

            <ServiceCard
              href="/workout"
              title="Workout History"
              description="Review your complete workout history with detailed logs, progress tracking, and performance comparisons to see how far you've come."
              imageSrc="/api/placeholder/400/300"
              imageAlt="Workout History"
              icon={Calendar}
            />

            <div className="md:col-span-2 lg:col-span-1">
              <ServiceCard
                href="/log-workout"
                title="Log Workout"
                description="Easily track your workouts with our intuitive logging system. Record exercises, sets, reps, and weights to monitor your progress."
                imageSrc="/api/placeholder/400/300"
                imageAlt="Log Workout"
                icon={TrendingUp}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-700/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-800 sm:p-12">
              <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent sm:text-4xl">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto sm:text-xl">
                Join thousands of fitness enthusiasts who have transformed their
                lives. Start tracking your workouts today and see the
                difference.
              </p>
              <Link
                href="/log-workout"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl shadow-2xl hover:shadow-gray-600/30 transform hover:scale-105 transition-all duration-300 hover:from-gray-600 hover:to-gray-700 border border-gray-600 sm:px-10 sm:py-5 sm:text-xl"
              >
                <Activity className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300 sm:mr-4 sm:h-7 sm:w-7" />
                Get Started
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-400/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
