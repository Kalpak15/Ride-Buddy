import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Camera,
  Car,
  Music,
  CookingPot as Smoking,
  Dog,
  ArrowLeft,
  Save,
  Zap,
  Wind,
  Droplet,
  Fuel,
  Calendar, // For Age
  Users, // For Gender (substitute for GenderMale)
  Info, // For About
} from "lucide-react";
import { getProfile } from "../api/profileApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const vehicleTypes = [
  { value: "ev", label: "Electric Vehicle", icon: Zap },
  { value: "cng", label: "CNG", icon: Wind },
  { value: "petrol", label: "Petrol", icon: Droplet },
  { value: "diesel", label: "Diesel", icon: Fuel },
];

const getVehicleTypeIcon = (type) => {
  const vehicleType = vehicleTypes.find((vt) => vt.value === type);
  if (!vehicleType) return <Car className="text-gray-500" size={20} />;

  const Icon = vehicleType.icon;
  return (
    <Icon
      className={`
        ${type === "ev" ? "text-green-500" : ""}
        ${type === "cng" ? "text-blue-500" : ""}
        ${type === "petrol" ? "text-red-500" : ""}
        ${type === "diesel" ? "text-yellow-500" : ""}
      `}
      size={20}
    />
  );
};

function EditProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const PORT=import.meta.env.VITE_API_URL
  
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    age: "",
    gender: "",
    about: "",
    hasVehicle: false,
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
    profilePicture: null,
  });
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfile(userId);
        if (response.success) {
          setProfile(response.data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${PORT}/api/v1/profile/edit-profile/${userId}`,
        profile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          navigate(`/profile/${userId}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${PORT}/api/v1/profile/upload-profile-picture/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile picture updated!");
      setProfile((prev) => ({
        ...prev,
        profilePicture: response.data.user.profilePicture,
      }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <button
                  onClick={() => navigate(`/profile/${userId}`)}
                  className="hover:bg-blue-700/50 p-2 rounded-full transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                Edit Profile
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-100">
                  <img
                    src={
                      profile.profilePicture ||
                      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="profilePicInput"
                />

                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition-colors shadow-lg group-hover:scale-110 transform duration-200"
                  onClick={() =>
                    document.getElementById("profilePicInput").click()
                  }
                >
                  <Camera size={20} />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{`${profile.firstName} ${profile.lastName}`}</h2>
                <p className="text-gray-500 mt-1">{profile.email}</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={profile.middleName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={profile.age}
                    onChange={handleInputChange}
                    min="18"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    About Me
                  </label>
                  <textarea
                    name="about"
                    value={profile.about}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none min-h-[100px]"
                    placeholder="Tell us a bit about yourself (optional)..."
                    maxLength="500"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 border-b pb-3">
                <Car className="text-blue-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">
                  Vehicle Information
                </h3>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="hasVehicle"
                  checked={profile.hasVehicle}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
                <label className="ml-3 text-sm text-gray-700">
                  I have a vehicle
                </label>
              </div>
              {profile.hasVehicle && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Make
                    </label>
                    <input
                      type="text"
                      name="vehicleDetails.make"
                      value={profile.vehicleDetails.make}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Model
                    </label>
                    <input
                      type="text"
                      name="vehicleDetails.model"
                      value={profile.vehicleDetails.model}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Year
                    </label>
                    <input
                      type="text"
                      name="vehicleDetails.year"
                      value={profile.vehicleDetails.year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      License Plate
                    </label>
                    <input
                      type="text"
                      name="vehicleDetails.licensePlate"
                      value={profile.vehicleDetails.licensePlate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle Type
                    </label>
                    <div className="relative">
                      <select
                        name="vehicleDetails.type"
                        value={profile.vehicleDetails.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow appearance-none bg-white pr-10"
                      >
                        <option value="">Select Vehicle Type</option>
                        {vehicleTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {getVehicleTypeIcon(profile.vehicleDetails.type)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="preferences.smokingAllowed"
                    checked={profile.preferences.smokingAllowed}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                  />
                  <div className="ml-4 flex items-center space-x-3">
                    <Smoking className="text-gray-600" size={20} />
                    <label className="text-sm font-medium text-gray-700">
                      Smoking Allowed
                    </label>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="preferences.petsAllowed"
                    checked={profile.preferences.petsAllowed}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                  />
                  <div className="ml-4 flex items-center space-x-3">
                    <Dog className="text-gray-600" size={20} />
                    <label className="text-sm font-medium text-gray-700">
                      Pets Allowed
                    </label>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="preferences.musicAllowed"
                    checked={profile.preferences.musicAllowed}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                  />
                  <div className="ml-4 flex items-center space-x-3">
                    <Music className="text-gray-600" size={20} />
                    <label className="text-sm font-medium text-gray-700">
                      Music Allowed
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/profile/${userId}`)}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
