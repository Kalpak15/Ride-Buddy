import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  MapPin,
  Search,
  Car,
  Leaf,
  Users,
  Star,
  ArrowRight,
  LogOut,
  MessageCircle,
  Share2,
  Bell,
  Shield,
  Target,
  Eye,
  Heart,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
  });
  const PORT=import.meta.env.VITE_API_URL
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.name || "User");
    }
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
    }).toString();
    navigate(`/find-ride?${query}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Ride Together, Save Together
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect with fellow travelers, reduce costs, and help the planet
            with Ridebuddy.
          </p>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="from"
                  value={searchData.from}
                  onChange={handleSearchChange}
                  placeholder="From (e.g., Pune)"
                  className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800"
                  required
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="to"
                  value={searchData.to}
                  onChange={handleSearchChange}
                  placeholder="To (e.g., Mumbai)"
                  className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Find Rides
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Why Ridebuddy Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Why Choose Ridebuddy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Car className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Affordable Travel
              </h3>
              <p className="text-gray-600">
                Split costs with others and save money on every trip.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <Leaf className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Eco-Friendly
              </h3>
              <p className="text-gray-600">
                Reduce your carbon footprint by sharing rides.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Connect with friendly travelers and build a community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Join Our Vibrant Community
            </h2>
            <p className="text-xl text-blue-100">
              Connect with fellow travelers, share experiences, and make your
              journeys more memorable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-lg border border-white border-opacity-20 hover:transform hover:scale-105 transition-transform duration-300">
              <MessageCircle className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Share Stories</h3>
              <p className="text-blue-100">
                Share your travel experiences and tips with the community
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-lg border border-white border-opacity-20 hover:transform hover:scale-105 transition-transform duration-300">
              <Share2 className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect & Network</h3>
              <p className="text-blue-100">
                Build meaningful connections with like-minded travelers
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-lg border border-white border-opacity-20 hover:transform hover:scale-105 transition-transform duration-300">
              <Bell className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-blue-100">
                Get real-time updates on routes and travel conditions
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-lg border border-white border-opacity-20 hover:transform hover:scale-105 transition-transform duration-300">
              <Shield className="h-10 w-10 text-blue-200 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safe Travel</h3>
              <p className="text-blue-100">
                Travel with verified community members you can trust
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/community")}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-300"
            >
              <Users className="h-5 w-5" />
              <span>Join Our Community</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Popular Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RouteCard from="Pune" to="Mumbai" price="₹500" rating="4.8" />
            <RouteCard from="Delhi" to="Jaipur" price="₹600" rating="4.7" />
            <RouteCard from="Bangalore" to="Mysore" price="₹350" rating="4.9" />
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/find-ride")}
              className="text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center mx-auto transition-colors"
            >
              Explore More Routes
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-300 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-300 blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 relative inline-block">
              About Ridebuddy
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8">
              Founded in 2025, Ridebuddy is transforming commutes across India by making them affordable, sustainable, and social.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To create a community of conscious travelers who share rides, reduce costs, and minimize environmental impact through collaborative mobility solutions.
              </p>
              <div className="w-12 h-1 bg-blue-200 mx-auto my-4 rounded-full"></div>
              <p className="text-sm text-gray-500 italic text-center">Connecting people, one ride at a time</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-purple-500 md:mt-8">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A world where shared mobility is the norm, making travel more accessible, affordable, and sustainable for everyone across urban and rural landscapes.
              </p>
              <div className="w-12 h-1 bg-purple-200 mx-auto my-4 rounded-full"></div>
              <p className="text-sm text-gray-500 italic text-center">Reimagining transportation together</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-green-500">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Community, sustainability, affordability, and safety are at the core of everything we do at Ridebuddy. We believe in creating value for all stakeholders.
              </p>
              <div className="w-12 h-1 bg-green-200 mx-auto my-4 rounded-full"></div>
              <p className="text-sm text-gray-500 italic text-center">Driven by purpose, guided by values</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-block bg-white px-1 py-1 rounded-full shadow-lg">
              <button
                onClick={() => navigate("/about")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 inline-flex items-center space-x-2 shadow-inner"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// Route Card Component
const RouteCard = ({ from, to, price, rating }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="font-semibold text-gray-800">{from}</div>
          <ArrowRight className="h-5 w-5 text-gray-400 mx-2 inline" />
          <div className="font-semibold text-gray-800 inline">{to}</div>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
          <span className="text-sm text-gray-600">{rating}</span>
        </div>
      </div>
      <div className="text-gray-600 mb-4">Starting from</div>
      <div className="font-semibold text-gray-800">{price}</div>
    </div>
  );
};

export default HomePage;