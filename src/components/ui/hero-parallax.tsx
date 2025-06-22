// components/ui/hero-parallax.js

"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
    description: string;
  }[];
}) => {
  const cards = products.slice(0, 3);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // 🔧 REDUCING ANIMATED CARDS DOWNWARD MOVEMENT EVEN MORE
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.4, 0.44], [-700, 200, 100, 150]), // ← REDUCED from [200, 250] to [180, 200]
    { stiffness: 200, damping: 50, bounce: 0 }
  );

  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), {
    stiffness: 200,
    damping: 50,
    bounce: 0,
  });

  // Ultra-smooth fade out for seamless transition
  const animatedCardsOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2, 0.4, 0.44], [0.2, 1, 1, 0]),
    { stiffness: 300, damping: 60, bounce: 0 }
  );

  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), {
    stiffness: 200,
    damping: 50,
    bounce: 0,
  });

  // Static cards fade in with perfect timing
  const staticCardsOpacity = useTransform(
    scrollYProgress,
    [0.42, 0.46],
    [0, 1]
  );

  return (
    <>
      {/* Scrolling parallax container */}
      <div
        ref={ref}
        className="h-[170vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
      >
        {/* Hero Section */}
        <Header />

        {/* What We Do Section */}
        <div className="absolute top-[100vh] left-0 right-0 text-center px-4 z-30">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              What We Do
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-16">
              Discover the powerful features that make your fitness journey
              successful
            </p>
          </motion.div>
        </div>

        {/* Animated Cards that disappear */}
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity: animatedCardsOpacity,
          }}
          className="relative z-10"
        >
          <div className="flex justify-center items-center space-x-8">
            {cards.map((product, index) => (
              <AnimatedCard
                product={product}
                key={`animated-${product.title}`}
                scrollProgress={scrollYProgress}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Static Cards Section */}
      <motion.div
        style={{ opacity: staticCardsOpacity }}
        className="relative bg-black py-0 px-4 z-20 -mt-90"
      >
        <div className="flex justify-center items-center space-x-16 max-w-8xl mx-auto">
          {cards.map((product, index) => (
            <StaticCard
              product={product}
              key={`static-${product.title}`}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Call to Action Section - Integrated WhatWeDoSection */}
      <section className="relative bg-black py-16 px-4 z-30">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-neutral-300 mb-8">
              Join thousands of users who have transformed their fitness with
              our platform
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-30 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-white mb-6">
        Transform Your <br />
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Fitness Journey
        </span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200 mb-10">
        Track workouts, monitor progress, and achieve your fitness goals with
        our comprehensive fitness tracking platform. Your personal trainer in
        your pocket.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Log Your Workout
      </motion.button>
    </div>
  );
};

// Animated cards that come from above and disappear
const AnimatedCard = ({
  product,
  scrollProgress,
  index,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    description: string;
  };
  scrollProgress: MotionValue<number>;
  index: number;
}) => {
  const cardX = useTransform(
    scrollProgress,
    [0, 0.35, 0.4],
    [0, index * 40, (index - 1) * 300]
  );

  return (
    <motion.div
      style={{ x: cardX }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group/product relative shrink-0 rounded-xl overflow-hidden w-64 h-80"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <a href={product.link} className="block h-full">
        <img
          src={product.thumbnail}
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>

      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity duration-300"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-semibold text-xl transition-opacity duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
};

// Enhanced Static Cards with text content below the image
const StaticCard = ({
  product,
  index,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    description: string;
  };
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group/product relative shrink-0 rounded-xl overflow-hidden w-96 h-[520px] shadow-2xl bg-black/80 backdrop-blur-sm"
    >
      {/* Image Section */}
      <div className="relative h-[280px] overflow-hidden">
        <a href={product.link} className="block h-full">
          <img
            src={product.thumbnail}
            className="object-cover object-center absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-105"
            alt={product.title}
          />
        </a>

        {/* Subtle overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

        {/* Enhanced hover effect on image */}
        <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-10 bg-gradient-to-tr from-blue-500 via-purple-500 to-blue-500 pointer-events-none transition-opacity duration-500"></div>
      </div>

      {/* Text Content Section - Now below the image */}
      <div className="p-8 text-white h-[240px] flex flex-col justify-between">
        {/* Subtle accent line above title */}
        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 mb-4 opacity-80"></div>

        {/* Enhanced title with better typography */}
        <h3 className="text-2xl md:text-2xl font-bold mb-4 leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {product.title}
          </span>
        </h3>

        {/* Enhanced description with better readability */}
        <p className="text-neutral-300 leading-relaxed mb-6 text-sm font-normal line-clamp-3 group-hover/product:text-neutral-200 transition-colors duration-300 flex-grow">
          {product.description}
        </p>

        {/* Enhanced CTA with better styling */}
        <motion.div
          whileHover={{ x: 5 }}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-all duration-300 text-sm tracking-wide uppercase cursor-pointer group/cta mt-auto"
        >
          <span className="relative">
            Learn More
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover/cta:w-full transition-all duration-300"></span>
          </span>
          <svg
            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/cta:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.div>
      </div>

      {/* Subtle border on hover */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover/product:ring-blue-400/30 transition-all duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export { HeroParallax };
