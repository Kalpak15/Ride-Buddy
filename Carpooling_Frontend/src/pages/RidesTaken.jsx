import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Search,
  User,
  Car,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const RidesTaken = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const PORT=import.meta.env.VITE_API_URL
  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${PORT}/api/v1/get-passenger-rides/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 404) {
            setRides([]);
            return;
          }
          throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched rides:", data);
        setRides(data.rides || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred while fetching rides");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRides = rides
    .filter((ride) => {
      const matchesSearch =
        ride.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.destination.toLowerCase().includes(searchTerm.toLowerCase());
      if (filter === "all") return matchesSearch;
      return matchesSearch && ride.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === "date")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 md:h-12 md:w-12" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 md:text-xl">
            Error Loading Rides
          </h3>
          <p className="mt-1 text-sm text-gray-500 md:text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm md:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/profile/${userId}`)}
                className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                My Ride History
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative w-full sm:w-auto">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search rides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Rides</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="date">Sort by Date</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {filteredRides.length === 0 ? (
            <div className="text-center py-10">
              <Car className="mx-auto h-10 w-10 text-gray-400 md:h-12 md:w-12" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 md:text-base">
                No Rides Taken Yet
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                You haven't taken any rides as a passenger yet. Book a ride to
                get started!
              </p>
              <button
                onClick={() => navigate("/find-ride")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm md:text-base"
              >
                Find a Ride
              </button>
            </div>
          ) : (
            filteredRides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 w-full">
                    {ride.ride.driver.photo ? (
                      <img
                        src={ride.ride.driver.photo}
                        alt={ride.ride.driver.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {ride.ride.driver.name}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-medium ${getStatusColor(
                          ride.status
                        )}`}
                      >
                        {ride.status.charAt(0).toUpperCase() +
                          ride.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">From</p>
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {ride.start}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">To</p>
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {ride.destination}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {ride.ride.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {ride.ride.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t">
                    <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                      <span className="text-sm font-medium">View Details</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RidesTaken;