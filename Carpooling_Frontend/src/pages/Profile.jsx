import React, { useState, useEffect,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Car,
  Star,
  Edit2,
  Camera,
  LogOut,
  ArrowRight,
  Music,
  CookingPot as Smoking,
  Dog,
  Zap,
  Wind,
  Droplet,
  Fuel,
  Calendar,
  Users,
  Info,
} from "lucide-react";
import { getProfile } from "../api/profileApi";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";


const getVehicleTypeIcon = (type) => {
  switch (type) {
    case "ev":
      return <Zap className="text-green-500" size={16} />;
    case "cng":
      return <Wind className="text-blue-500" size={16} />;
    case "petrol":
      return <Droplet className="text-red-500" size={16} />;
    case "diesel":
      return <Fuel className="text-yellow-500" size={16} />;
    default:
      return <Car className="text-gray-500" size={16} />;
  }
};

const getVehicleTypeColor = (type) => {
  switch (type) {
    case "ev":
      return "bg-green-50 text-green-700 border-green-200";
    case "cng":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "petrol":
      return "bg-red-50 text-red-700 border-red-200";
    case "diesel":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getVehicleTypeLabel = (type) => {
  switch (type) {
    case "ev":
      return "Electric Vehicle";
    case "cng":
      return "CNG";
    case "petrol":
      return "Petrol";
    case "diesel":
      return "Diesel";
    default:
      return "Not Specified";
  }
};

const ProfilePage = () => {
  let { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Add current user ID state
  const [showRazorpayButton, setShowRazorpayButton] = useState(false);
  const PORT=import.meta.env.VITE_API_URL
  const [user, setUser] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    age: "",
    gender: "",
    about: "",
    hasVehicle: false,
    profilePicture: "",
    vehicleDetails: {
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      type: "",
    },
    preferences: {
      smokingAllowed: false,
      petsAllowed: false,
      musicAllowed: true,
    },
    createdAt: "",
    rating: 4.8,
    ridesGiven: 87,
    ridesTaken: 52,
  });



  useEffect(() => {
    const fetchCurrentUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(decoded.userId);
      }
    };


    
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfile(userId);
        console.log("Profile response:", response);
        if (response.success) {
          setUser((prevUser) => ({
            ...prevUser,
            ...response.data,
            name: `${response.data.firstName} ${response.data.lastName || ""}`,
            rating: 4.8,
            ridesGiven: 87,
            ridesTaken: 52,
          }));
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
    fetchProfile();
  }, [userId]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleEdit = () => {
    navigate(`/profile/edit/${userId}`);
  };

  const handleRidesOffered = () => {
    navigate(`/rides/offered/${userId}`);
  };

  const handleRidesTaken = () => {
    navigate(`/rides/taken/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 text-base">
          Error loading profile: {error}
        </div>
      </div>
    );
  }


  const handleShowPaymentButton = () => {
    setShowRazorpayButton(true);
  };

  const RazorpayButton = () => {
    const formRef = useRef(null);
  
    useEffect(() => {
      if (formRef.current) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.setAttribute("data-payment_button_id", "pl_Q12J47bbMRieht");
        script.async = true;
        formRef.current.appendChild(script);
      }
    }, []);

    return (
      <form ref={formRef}>
      <script
        src="https://checkout.razorpay.com/v1/payment-button.js"
        data-payment_button_id="pl_Q12J47bbMRieht"
        async
      ></script>
    </form>
    );
  };

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto sm:max-w-4xl lg:max-w-5xl">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 mx-2 sm:mx-0">
          {/* Header */}
          <div className="relative h-32 sm:h-40 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="absolute bottom-0 left-0 right-0 flex justify-center transform translate-y-1/2">
              <div className="relative">
                <img
                  src={
                    user.profilePicture ||
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
                  }
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-md object-cover"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-sm">
                    <Camera size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 sm:p-6 pt-12 sm:pt-16">
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                {user.name}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {user.firstName ? `@${user.firstName}` : ""}
              </p>
              <div className="flex items-center justify-center mt-2 space-x-1">
                <Star className="text-yellow-400" size={16} />
                <span className="text-gray-600 text-sm">
                  {user.rating} • {user.ridesGiven} rides given •{" "}
                  {user.ridesTaken} rides taken
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* User Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Phone className="text-blue-500" size={16} />
                  <span className="text-gray-700 text-sm sm:text-base">
                    {user.phoneNumber}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-blue-500" size={16} />
                  <span className="text-gray-700 text-sm sm:text-base">
                    {user.address}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-blue-500" size={16} />
                  <span className="text-gray-700 text-sm sm:text-base">
                    Age: {user.age || "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="text-blue-500" size={16} />
                  <span className="text-gray-700 text-sm sm:text-base">
                    Gender: {user.gender || "N/A"}
                  </span>
                </div>
                {/* About Section */}
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Info className="text-blue-500" size={16} />
                    About Me
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {user.about || "This user hasn’t added a bio yet."}
                  </p>
                </div>
                {/* Preferences */}
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Ride Preferences
                  </h3>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div
                      className={`flex items-center space-x-2 ${
                        user.preferences.musicAllowed
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Music size={16} />
                      <span className="text-sm sm:text-base">
                        {user.preferences.musicAllowed
                          ? "Music allowed"
                          : "No music"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        user.preferences.smokingAllowed
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Smoking size={16} />
                      <span className="text-sm sm:text-base">
                        {user.preferences.smokingAllowed
                          ? "Smoking allowed"
                          : "No smoking"}
                      </span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${
                        user.preferences.petsAllowed
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Dog size={16} />
                      <span className="text-sm sm:text-base">
                        {user.preferences.petsAllowed
                          ? "Pets allowed"
                          : "No pets"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              {user.hasVehicle && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-800 mb-2 sm:mb-0">
                      Vehicle Details
                    </h2>
                    <div
                      className={`flex items-center gap-2 px-2 py-1 rounded-full border ${getVehicleTypeColor(
                        user.vehicleDetails.type
                      )}`}
                    >
                      {getVehicleTypeIcon(user.vehicleDetails.type)}
                      <span className="text-sm font-medium">
                        {getVehicleTypeLabel(user.vehicleDetails.type)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Make: {user.vehicleDetails.make}
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Model: {user.vehicleDetails.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Year: {user.vehicleDetails.year}
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base">
                        License Plate: {user.vehicleDetails.licensePlate}
                      </p>
                    </div>
                  </div>
                </div>

              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwnProfile && (
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Edit2 size={16} />
                    <span className="text-sm sm:text-base">Edit Profile</span>
                  </button>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRidesOffered}
                    className="w-full sm:w-1/2 flex items-center justify-between px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center space-x-2">
                      <Car size={16} />
                      <span className="text-sm sm:text-base font-medium">
                        Rides Offered
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="transform group-hover:translate-x-1 transition-transform"
                    />
                  </button>

                  <button
                    onClick={handleRidesTaken}
                    className="w-full sm:w-1/2 flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span className="text-sm sm:text-base font-medium">
                        Rides Taken
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="transform group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Car className="text-blue-500" size={16} />
              <span className="text-gray-600 text-sm sm:text-base font-medium">
                RideBuddy Member since {new Date(user.createdAt).getFullYear()}
              </span>
            </div>
            {isOwnProfile && (
              <button
                className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span className="text-sm sm:text-base">Log Out</span>
              </button>
              
            )}


          <div className="flex flex-col items-center space-y-4">
                {/* Button to Show Razorpay */}
                <button
                  onClick={handleShowPaymentButton}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
                >
                  Subscribe for Membership
                </button>

                {/* Conditionally Render Razorpay Button */}
                {showRazorpayButton && <RazorpayButton />}
          </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;



