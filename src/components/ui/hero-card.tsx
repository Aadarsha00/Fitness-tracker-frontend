import Link from "next/link";
import Image from "next/image";

const ServiceCard = ({
  href,
  title,
  description,
  imageSrc,
  imageAlt,
  icon: Icon,
}) => {
  return (
    <Link href={href} className="group block">
      <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-700/20 transform hover:-translate-y-2 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 to-gray-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          {/* Image Container */}
          <div className="w-full h-40 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl mb-6 flex items-center justify-center border border-gray-700 overflow-hidden relative sm:h-48">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <Icon className="h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />
            )}
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gray-300 transition-colors sm:text-2xl">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
