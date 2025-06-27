import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const ServiceCard = ({
  href,
  title,
  description,
  imageSrc,
  imageAlt,
  icon: Icon,
}) => {
  return (
    <Link href={href} className="group block h-full">
      <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg rounded-2xl p-6 border border-gray-800/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-2 h-full flex flex-col">
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Image Container */}
          <div className="w-full h-48 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl mb-6 flex items-center justify-center border border-gray-700/50 overflow-hidden relative">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <Icon className="h-12 w-12 text-gray-400 group-hover:text-white transition-colors duration-300" />
            )}
          </div>

          {/* Content */}
          <div className="flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-400 leading-relaxed text-base mb-4 flex-grow group-hover:text-gray-300 transition-colors duration-300">
              {description}
            </p>

            {/* Call to action */}
            <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-purple-400 transition-all duration-300">
              <span>Learn More</span>
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
