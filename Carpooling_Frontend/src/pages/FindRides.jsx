import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import debounce from "lodash/debounce";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  User,
  UserRound,
  Search,
  X,
  Route,
  ArrowRight,
  Star,
  Trash2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to shorten address for display
const shortenAddress = (fullAddress) => {
  if (!fullAddress) return "Unknown Location";
  const parts = fullAddress.split(", ");
  const significantParts = parts.filter((part) => /[a-zA-Z]/.test(part));
  return significantParts.length > 1
    ? `${significantParts[0]}, ${significantParts[1]}`
    : significantParts[0];
};

function FindRides() {
  const location = useLocation();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchStart, setSearchStart] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [filteredRides, setFilteredRides] = useState([]);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [isStartFocused, setIsStartFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rideToDelete, setRideToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  
  const PORT=import.meta.env.VITE_API_URL
  
  const commonReasons = [
    "Emergency Situation",
    "Vehicle Breakdown",
    "Personal Reasons",
    "Weather Conditions",
    "Other",
  ];


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.userId);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }

    const params = new URLSearchParams(location.search);
    const from = params.get("from") || "";
    const to = params.get("to") || "";

    setSearchStart(from);
    setSearchDestination(to);

    const fetchRides = async () => {
      try {
        const response = await axios.get(
          `${PORT}/find-ride`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedRides = response.data.rides;
        const currentDateTime = new Date();
        const futureRides = fetchedRides.filter((ride) => {
          const rideDateTime = new Date(`${ride.date}T${ride.time}`);
          return rideDateTime >= currentDateTime;
        });
        setRides(futureRides);
        setFilteredRides(futureRides);
        if (from || to) {
          filterRides(from, to);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setRides([]);
          setFilteredRides([]);
        } else {
          setError(
            "Failed to fetch rides due to a server error. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [location.search]);

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5&countrycodes=in`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const filterRides = (from, to) => {
    const filtered = rides.filter((ride) => {
      const allStops = [
        ride.start.toLowerCase(),
        ...(ride.stops || []).map((stop) => stop.toLowerCase()),
        ride.destination.toLowerCase(),
      ];

      const startLower = from.toLowerCase();
      const destLower = to.toLowerCase();

      const matchesStart =
        from === "" ||
        ride.start.toLowerCase().includes(startLower) ||
        (ride.stops || []).some((stop) =>
          stop.toLowerCase().includes(startLower)
        );

      const matchesDestination =
        to === "" ||
        ride.destination.toLowerCase().includes(destLower) ||
        (ride.stops || []).some((stop) =>
          stop.toLowerCase().includes(destLower)
        );

      return matchesStart && matchesDestination;
    });

    setFilteredRides(filtered);
  };

  const debouncedSearch = debounce(() => {
    filterRides(searchStart, searchDestination);
  }, 300);

  const handleSearchInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "start") {
      setSearchStart(value);
      fetchSuggestions(value, setStartSuggestions);
    } else if (field === "destination") {
      setSearchDestination(value);
      fetchSuggestions(value, setDestinationSuggestions);
    }
    debouncedSearch();
  };

  const handleSuggestionSelect = (field, suggestion) => {
    const address = suggestion.display_name.toLowerCase();
    if (field === "start") {
      setSearchStart(address);
      setStartSuggestions([]);
    } else if (field === "destination") {
      setSearchDestination(address);
      setDestinationSuggestions([]);
    }
    debouncedSearch();
  };

  const clearSearch = () => {
    setSearchStart("");
    setSearchDestination("");
    setFilteredRides(rides);
    setStartSuggestions([]);
    setDestinationSuggestions([]);
  };

  const confirmDeleteRide = (rideId) => {
    setRideToDelete(rideId);
    setShowDeleteModal(true);
    setDeleteReason(""); // Reset reason
    setCustomReason("");
    setIsOtherSelected(false);
  };

  const handleDeleteRide = async () => {
    if (!rideToDelete || (!deleteReason && !customReason)) {
      toast.error("Please provide a reason for cancellation", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const finalReason = deleteReason === "Other" ? customReason : deleteReason;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${PORT}/api/v1/delete-ride/${rideToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { reason: finalReason }, // Send reason to backend
        }
      );

      setRides((prevRides) =>
        prevRides.filter((ride) => ride._id !== rideToDelete)
      );
      setFilteredRides((prevFiltered) =>
        prevFiltered.filter((ride) => ride._id !== rideToDelete)
      );
      toast.success(
        "Ride deleted successfully! Please contact your passengers ASAP if they had booked this ride.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } catch (error) {
      console.error("Error deleting ride:", error.response?.data || error);
      toast.error("Failed to delete the ride. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setShowDeleteModal(false);
      setRideToDelete(null);
      setDeleteReason("");
      setCustomReason("");
      setIsOtherSelected(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <X className="w-8 h-8" />
          </div>
          <p className="text-center font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Ride
          </h1>
          <p className="text-lg text-gray-600">
            Search through available rides and find your ideal match
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                placeholder="Enter start location (India only)"
                value={searchStart}
                onChange={(e) => handleSearchInputChange(e, "start")}
                onFocus={() => setIsStartFocused(true)}
                onBlur={() => setTimeout(() => setIsStartFocused(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isStartFocused && startSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {startSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() =>
                        handleSuggestionSelect("start", suggestion)
                      }
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800"
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
              <input
                type="text"
                placeholder="Enter destination (India only)"
                value={searchDestination}
                onChange={(e) => handleSearchInputChange(e, "destination")}
                onFocus={() => setIsDestinationFocused(true)}
                onBlur={() =>
                  setTimeout(() => setIsDestinationFocused(false), 200)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isDestinationFocused && destinationSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {destinationSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() =>
                        handleSuggestionSelect("destination", suggestion)
                      }
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800"
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={debouncedSearch}
              className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Rides
            </button>
            <button
              onClick={clearSearch}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Cancel Ride
              </h3>
              <p className="text-gray-600 mb-4">
                Please select a reason for cancelling this ride:
              </p>
              <div className="space-y-2 mb-6">
                {commonReasons.map((reason) => (
                  <label key={reason} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="deleteReason"
                      value={reason}
                      checked={deleteReason === reason}
                      onChange={(e) => {
                        setDeleteReason(e.target.value);
                        setIsOtherSelected(e.target.value === "Other");
                      }}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{reason}</span>
                  </label>
                ))}
                {isOtherSelected && (
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Please specify your reason"
                    className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRide}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Confirm Cancellation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rides Grid */}
        {filteredRides.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
            <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Rides Available Right Now
            </h3>
            <p className="text-gray-600">
              There are no rides available at the moment. Check back later or
              try different search criteria.
            </p>
            <Link
              to="/create-ride"
              className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Offer a Ride Instead
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col min-h-[400px]"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <div className="text-sm text-gray-500">From</div>
                      </div>
                      <div className="font-semibold text-gray-800 mt-1">
                        {shortenAddress(ride.start)}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <div className="text-sm text-gray-500">To</div>
                      </div>
                      <div className="font-semibold text-gray-800 mt-1">
                        {shortenAddress(ride.destination)}
                      </div>
                    </div>
                  </div>

                  {ride.stops && ride.stops.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm text-gray-500 mb-2">Stops</div>
                      <div className="flex flex-wrap gap-2">
                        {ride.stops.map((stop, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {shortenAddress(stop)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{ride.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{ride.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{ride.seats} seats available</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      {ride.driver?.profilePicture ? (
                        <img
                          src={ride.driver.profilePicture}
                          alt={`${ride.driver.firstName} ${ride.driver.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserRound className="w-10 h-10 p-2 bg-blue-100 text-blue-500 rounded-full" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {ride.driver?.firstName && ride.driver?.lastName
                            ? `${ride.driver.firstName} ${ride.driver.lastName}`
                            : "Anonymous"}
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm">4.8</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ₹{ride.price}
                      </div>
                      <div className="text-sm text-gray-500">per seat</div>
                    </div>
                  </div>

                  <div className="mt-auto flex space-x-2">
                    <Link
                      to={`/book-ride/${ride._id}`}
                      className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-300"
                    >
                      Book This Ride
                    </Link>
                    {userId && ride.driver?._id === userId && (
                      <button
                        onClick={() => confirmDeleteRide(ride._id)}
                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-3 rounded-xl transition-colors duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindRides;
