import React from "react";
import { Users, DollarSign, Leaf, ChevronRight } from "lucide-react";
import {
  FeatureCard,
  TestimonialCard,
  StepCard,
} from "../components/LandingPageComp";
import carpool from "../assets/images/carpool.jpg";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignUpNavigation = () => {
    navigate("/signup");
  };

  const handleLogInNavigation = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532939163844-547f958e91b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center" />
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Share Rides,
                <br />
                Save Money,
                <br />
                <span className="text-blue-200">Reduce Emissions</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Join RideBuddy today and experience a smarter way to commute!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold flex items-center justify-center hover:bg-blue-50 transform hover:scale-105 transition-all shadow-lg"
                  onClick={handleSignUpNavigation}
                >
                  Sign Up <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                <button
                  className="px-8 py-4 bg-blue-100 text-blue-700 rounded-full font-semibold flex items-center justify-center hover:bg-blue-200 transform hover:scale-105 transition-all shadow-lg"
                  onClick={handleLogInNavigation}
                >
                  Log In
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src={carpool}
                alt="Carpooling Illustration"
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 bg-gradient-to-b from-white to-blue-50"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-blue-900">
              Why Choose RideBuddy?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <FeatureCard
                icon={<DollarSign className="h-14 w-14 text-blue-500" />}
                title="Save Money"
                description="Split costs with fellow commuters and reduce your transportation expenses."
              />
              <FeatureCard
                icon={<Users className="h-14 w-14 text-blue-500" />}
                title="Meet New People"
                description="Connect with like-minded individuals and expand your social network."
              />
              <FeatureCard
                icon={<Leaf className="h-14 w-14 text-blue-500" />}
                title="Reduce Carbon Footprint"
                description="Help the environment by sharing rides and reducing the number of cars on the road."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-blue-900">
              How RideBuddy Works
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
              <StepCard
                number={1}
                title="Sign Up"
                description="Create your account and set up your profile."
              />
              <StepCard
                number={2}
                title="Find a Ride"
                description="Search for available rides or offer your own."
              />
              <StepCard
                number={3}
                title="Connect"
                description="Chat with potential ride buddies and confirm details."
              />
              <StepCard
                number={4}
                title="Ride Together"
                description="Meet up and enjoy your shared journey!"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-blue-900">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <TestimonialCard
                name="Shounak Mulay"
                quote="RideBuddy has transformed my daily commute. I've saved money and made new friends!"
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
              />
              <TestimonialCard
                name="Abhijeet Lahase"
                quote="As a driver, I love how easy it is to find passengers and split costs. Highly recommended!"
                image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
              />
              <TestimonialCard
                name="Sahil Katkamwar"
                quote="The app is user-friendly, and the community is fantastic. It's a win-win for everyone!"
                image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
              />
            </div>
          </div>
        </section>

        {/* Environmental Impact Section */}
        <section className="py-24 bg-gradient-to-r from-blue-500 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536599018102-9f803c140fc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-8">
              Make a Difference with Every Ride
            </h2>
            <p className="text-xl mb-12 text-blue-100">
              Join our community of eco-conscious commuters and help reduce CO2
              emissions.
            </p>
            <div className="inline-flex justify-center items-center space-x-6 bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <div className="text-5xl font-bold text-blue-100">X</div>
              <div className="text-left">
                <div className="text-2xl font-semibold">kg of CO2 saved</div>
                <div className="text-blue-100">by our RideBuddy community</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 text-blue-900">
              Ready to Start Your RideBuddy Journey?
            </h2>
            <p className="text-xl mb-12 text-blue-600">
              Join thousands of happy commuters and start saving today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-lg mx-auto">
              <button
                className="w-full sm:w-auto px-8 py-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all shadow-lg"
                onClick={handleSignUpNavigation}
              >
                Sign Up Now
              </button>
              <button
                className="w-full sm:w-auto px-8 py-4 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transform hover:scale-105 transition-all shadow-lg"
                onClick={handleLogInNavigation}
              >
                Log In
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
