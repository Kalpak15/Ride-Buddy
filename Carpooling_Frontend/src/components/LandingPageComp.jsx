import { Star } from "lucide-react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-50">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-blue-50 rounded-2xl">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-blue-900">{title}</h3>
      <p className="text-blue-600 leading-relaxed">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-50 relative">
      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-md">
        {number}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-blue-900">{title}</h3>
      <p className="text-blue-600 leading-relaxed">{description}</p>
      {number < 4 && (
        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200 transform -translate-y-1/2" />
      )}
    </div>
  );
};

const TestimonialCard = ({ name, quote, image }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-50">
      <div className="flex items-center mb-6">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 mr-4"
        />
        <div>
          <p className="font-bold text-lg text-blue-900">{name}</p>
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="text-blue-400 h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-blue-600 leading-relaxed italic mb-4">"{quote}"</p>
      <div className="absolute -bottom-3 -right-3 text-blue-200 opacity-20 transform rotate-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
    </div>
  );
};

export { FeatureCard, TestimonialCard, StepCard };
