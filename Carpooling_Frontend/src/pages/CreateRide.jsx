

import { useState, useEffect } from "react"; // Added useEffect
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";

function CreateRide() {
  const initialState = {
    start: "",
    stops: [],
    destination: "",
    time: "",
    date: "",
    seats: "",
    price: "",
  };

  const [ride, setRide] = useState(initialState);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [isStartFocused, setIsStartFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [focusedStopIndex, setFocusedStopIndex] = useState(null);
  const [hasMembership, setHasMembership] = useState(false); // New state for membership
  const [checkingMembership, setCheckingMembership] = useState(true); // New state for loading

  const PORT=import.meta.env.VITE_API_URL
  // Check membership status when the component mounts
  useEffect(() => {
    const checkUserMembership = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCheckingMembership(false);
        setHasMembership(false);
        toast.error("Please login to create a ride");
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const response = await axios.get(
          `${PORT}/api/v1/payments/subscription-status?userId=${decoded.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const isMembershipActive = response.data.isMember === true;
        setHasMembership(isMembershipActive);
        setCheckingMembership(false);

        if (!isMembershipActive) {
          toast.info("Please subscribe to create a ride");
        }
      } catch (error) {
        console.error("Error checking membership:", error.response?.status, error.response?.data);
        setCheckingMembership(false);
        setHasMembership(false);
        toast.error(error.response?.data?.message || "Error checking membership status");
      }
    };

    checkUserMembership();
  }, []); // Empty dependency array to run once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRide((prevRide) => ({
      ...prevRide,
      [name]: value,
    }));

    if (name === "start") {
      fetchSuggestions(value, setStartSuggestions);
    } else if (name === "destination") {
      fetchSuggestions(value, setDestinationSuggestions);
    }
  };

  const handleStopChange = (index, value) => {
    setRide((prevRide) => {
      const newStops = [...prevRide.stops];
      newStops[index] = value;
      return { ...prevRide, stops: newStops };
    });

    fetchSuggestions(value, (suggestions) => {
      setStopSuggestions((prev) => {
        const newSuggestions = [...prev];
        newSuggestions[index] = suggestions;
        return newSuggestions;
      });
    });
  };

  const addStop = () => {
    setRide((prevRide) => ({
      ...prevRide,
      stops: [...prevRide.stops, ""],
    }));
    setStopSuggestions((prev) => [...prev, []]);
  };

  const removeStop = (index) => {
    setRide((prevRide) => ({
      ...prevRide,
      stops: prevRide.stops.filter((_, i) => i !== index),
    }));
    setStopSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleSuggestionSelect = (name, suggestion, index = null) => {
    const address = suggestion.display_name;
    if (index !== null) {
      setRide((prevRide) => {
        const newStops = [...prevRide.stops];
        newStops[index] = address;
        return { ...prevRide, stops: newStops };
      });
      setStopSuggestions((prev) => {
        const newSuggestions = [...prev];
        newSuggestions[index] = [];
        return newSuggestions;
      });
    } else {
      setRide((prevRide) => ({
        ...prevRide,
        [name]: address,
      }));
      if (name === "start") setStartSuggestions([]);
      if (name === "destination") setDestinationSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if membership is still being verified
    if (checkingMembership) {
      toast.info("Checking membership status, please wait...");
      return;
    }

    // Check if user has an active membership
    if (!hasMembership) {
      toast.error("You need an active membership to create a ride!");
      return;
    }

    // Validate date and time against current date and time
    const currentDateTime = new Date();
    const selectedDateTime = new Date(`${ride.date}T${ride.time}`);

    if (selectedDateTime < currentDateTime) {
      toast.error("Cannot create a ride with a past date or time!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      const rideData = {
        ...ride,
        user_id: userId,
        seats: Number(ride.seats),
        price: Number(ride.price),
      };
      console.log("Ride Object:", rideData);
      const response = await axios.post(
        `${PORT}/api/v1/create-ride`,
        rideData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Ride Created Successfully:", response.data);
      toast.success("Ride created successfully!");
      setRide(initialState);
      setStartSuggestions([]);
      setDestinationSuggestions([]);
      setStopSuggestions([]);
    } catch (error) {
      console.error("Error Creating Ride:", error.response?.data || error);
      toast.error("Failed to create the ride. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">
              Create a Ride
            </h1>
            <p className="text-blue-600 mb-8">
              Fill in the details to offer a new ride
            </p>

            {checkingMembership ? (
              <div className="text-center text-blue-600">
                Checking membership status...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <InputField
                    id="start"
                    name="start"
                    label="Start Location"
                    value={ride.start}
                    onChange={handleChange}
                    onFocus={() => setIsStartFocused(true)}
                    onBlur={() => setTimeout(() => setIsStartFocused(false), 200)}
                    placeholder="Enter pickup location (India only)"
                    icon={<MapPin className="w-5 h-5 text-blue-500" />}
                    suggestions={isStartFocused ? startSuggestions : []}
                    onSuggestionSelect={(suggestion) =>
                      handleSuggestionSelect("start", suggestion)
                    }
                  />

                  {ride.stops.map((stop, index) => (
                    <StopField
                      key={index}
                      index={index}
                      value={stop}
                      onChange={(value) => handleStopChange(index, value)}
                      onFocus={() => setFocusedStopIndex(index)}
                      onBlur={() =>
                        setTimeout(() => setFocusedStopIndex(null), 200)
                      }
                      onRemove={() => removeStop(index)}
                      suggestions={
                        focusedStopIndex === index
                          ? stopSuggestions[index] || []
                          : []
                      }
                      onSuggestionSelect={(suggestion) =>
                        handleSuggestionSelect("stops", suggestion, index)
                      }
                    />
                  ))}

                  <button
                    type="button"
                    onClick={addStop}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stop
                  </button>

                  <InputField
                    id="destination"
                    name="destination"
                    label="Destination"
                    value={ride.destination}
                    onChange={handleChange}
                    onFocus={() => setIsDestinationFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setIsDestinationFocused(false), 200)
                    }
                    placeholder="Enter drop-off location (India only)"
                    icon={<MapPin className="w-5 h-5 text-blue-500" />}
                    suggestions={
                      isDestinationFocused ? destinationSuggestions : []
                    }
                    onSuggestionSelect={(suggestion) =>
                      handleSuggestionSelect("destination", suggestion)
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField
                      id="time"
                      name="time"
                      label="Time"
                      type="time"
                      value={ride.time}
                      onChange={handleChange}
                      icon={<Clock className="w-5 h-5 text-blue-500" />}
                    />

                    <InputField
                      id="date"
                      name="date"
                      label="Date"
                      type="date"
                      value={ride.date}
                      onChange={handleChange}
                      icon={<Calendar className="w-5 h-5 text-blue-500" />}
                      min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField
                      id="seats"
                      name="seats"
                      label="Available Seats"
                      type="number"
                      value={ride.seats}
                      onChange={handleChange}
                      placeholder="Number of seats"
                      min="1"
                      icon={<Users className="w-5 h-5 text-blue-500" />}
                    />

                    <InputField
                      id="price"
                      name="price"
                      label="Total Price"
                      type="number"
                      value={ride.price}
                      onChange={handleChange}
                      placeholder="Total trip price"
                      min="0"
                      step="0.01"
                      icon={<span className="text-blue-500 font-bold">$</span>}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={checkingMembership || !hasMembership} // Disable button if checking or not a member
                  className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 ${
                    checkingMembership || !hasMembership
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200"
                  }`}
                >
                  <span>Create Ride</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="bg-white shadow-lg rounded-xl border border-blue-100 mt-16"
      />
    </div>
  );
}

// InputField and StopField components remain unchanged
function InputField({
  id,
  name,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  icon,
  suggestions,
  onSuggestionSelect,
  type = "text",
  min,
  step,
}) {
  return (
    <div className="relative">
      <label
        className="flex items-center text-sm font-medium text-blue-900 mb-2"
        htmlFor={id}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
        placeholder={placeholder}
        required
        min={min}
        step={step}
      />
      {suggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-blue-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => onSuggestionSelect(suggestion)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800 transition-colors duration-150"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StopField({
  index,
  value,
  onChange,
  onFocus,
  onBlur,
  onRemove,
  suggestions,
  onSuggestionSelect,
}) {
  return (
    <div className="relative group">
      <label className="flex items-center text-sm font-medium text-blue-900 mb-2">
        <MapPin className="w-5 h-5 mr-2 text-blue-500" />
        Stop {index + 1}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none pr-10"
          placeholder={`Enter stop ${index + 1} location (India only)`}
          required
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {suggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-blue-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => onSuggestionSelect(suggestion)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800 transition-colors duration-150"
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CreateRide;