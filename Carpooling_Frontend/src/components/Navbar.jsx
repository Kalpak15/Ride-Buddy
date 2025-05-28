import React, { useState, useEffect, useRef } from "react";
import {
  Car,
  Search,
  PlusCircle,
  User,
  Menu,
  X,
  Home,
  Info,
  LogOut,
  Bell,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

function Navbar() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef(null); // Ref for outside click detection
  
  const PORT=import.meta.env.VITE_API_URL

  const handleLogInNavigation = () => {
    navigate("/login");
    setIsMenuOpen(false); // Close hamburger menu on login click
  };

  const handleSignUpNavigation = () => {
    navigate("/signup");
    setIsMenuOpen(false); // Close hamburger menu on signup click
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleNotifications = () =>
    setIsNotificationsOpen(!isNotificationsOpen);

  const closeNotifications = () => setIsNotificationsOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsMenuOpen(false); // Close menu on logout
  };

  let userId = null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.userId;
      console.log(`User ${userId}`);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  useEffect(() => {
    if (isLoggedIn && userId) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(
            `${PORT}/api/v1/notifications/${userId}`
            
          );
          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userId]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(
        `${PORT}/api/v1/notifications/read/${id}`,
        {
          method: "PUT",
        }
      );
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100 shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a
                href={isLoggedIn ? "/home" : "/"}
                className="flex items-center space-x-2"
              >
                <Car className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  RideBuddy
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {isLoggedIn ? (
                <>
                  <a href="/home" className="nav-link group">
                    <Home className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    <span>Home</span>
                  </a>
                  <a href="/about" className="nav-link group">
                    <Info className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    <span>About</span>
                  </a>
                  <a href="/find-ride" className="nav-link group">
                    <Search className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    <span>Find a Ride</span>
                  </a>
                  <a href="/create-ride" className="nav-link group">
                    <PlusCircle className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    <span>Create a Ride</span>
                  </a>
                  {/* Notifications Dropdown */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={toggleNotifications}
                      className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <Bell className="h-6 w-6 text-blue-600" />
                      {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </button>
                    {isNotificationsOpen && (
                      <div className="absolute right-0 w-80 mt-3 bg-white rounded-xl shadow-2xl border border-blue-100 max-h-96 overflow-y-auto z-50">
                        <div className="p-4 border-b border-blue-100 bg-blue-50 rounded-t-xl flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                            <Bell className="h-5 w-5 mr-2" />
                            Notifications
                            <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              {notifications.length} New
                            </span>
                          </h3>
                          <button
                            onClick={closeNotifications}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        {notifications.length > 0 ? (
                          <ul className="divide-y divide-blue-50">
                            {notifications.map((notif) => (
                              <li
                                key={notif._id}
                                className="px-4 py-3 hover:bg-blue-50 transition-colors duration-200 flex items-start justify-between"
                              >
                                <div className="text-sm text-gray-700">
                                  <p className="font-medium text-blue-900">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(notif.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => markAsRead(notif._id)}
                                  className="text-blue-600 hover:text-blue-800 text-xs font-medium ml-2"
                                >
                                  Dismiss
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            No new notifications
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Profile and Community Buttons */}
                  <div className="flex items-center space-x-3">
                    <div className="relative group">
                      <button
                        onClick={() => navigate("/community")}
                        className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <Users className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                      </button>
                      <div className="absolute right-0 w-64 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50">
                        <div className="bg-white rounded-xl shadow-xl border border-blue-100 p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <Users className="h-8 w-8 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">
                              Join RideBuddy Community
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Connect with fellow travelers, share experiences,
                            and make your journeys more memorable! 🚗✨
                          </p>
                          <div className="flex justify-end">
                            <button
                              onClick={() => navigate("/community")}
                              className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors"
                            >
                              Learn More →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="flex items-center space-x-1 p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors group-hover:ring-2 group-hover:ring-blue-100">
                        <User className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <a
                          href={`/profile/${userId}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          View Profile
                        </a>
                        <hr className="my-2 border-gray-100" />
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <a href="/#features" className="nav-link group">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors">
                      Features
                    </span>
                  </a>
                  <a href="/#how-it-works" className="nav-link group">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors">
                      How It Works
                    </span>
                  </a>
                  <a href="/#testimonials" className="nav-link group">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors">
                      Testimonials
                    </span>
                  </a>
                  <button
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={handleLogInNavigation}
                  >
                    Log In
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                    onClick={handleSignUpNavigation}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-4">
              {isLoggedIn && (
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotifications}
                    className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <Bell className="h-6 w-6 text-blue-600" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute right-0 w-72 mt-2 bg-white rounded-xl shadow-2xl border border-blue-100 max-h-80 overflow-y-auto z-50">
                      <div className="p-3 border-b border-blue-100 bg-blue-50 rounded-t-xl flex justify-between items-center">
                        <h3 className="text-base font-semibold text-blue-800 flex items-center">
                          <Bell className="h-4 w-4 mr-2" />
                          Notifications
                          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            {notifications.length} New
                          </span>
                        </h3>
                        <button
                          onClick={closeNotifications}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {notifications.length > 0 ? (
                        <ul className="divide-y divide-blue-50">
                          {notifications.map((notif) => (
                            <li
                              key={notif._id}
                              className="px-3 py-2 hover:bg-blue-50 transition-colors duration-200 flex items-start justify-between text-sm"
                            >
                              <div className="text-gray-700">
                                <p className="font-medium text-blue-900">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={() => markAsRead(notif._id)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium ml-2"
                              >
                                Dismiss
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          No new notifications
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          {isLoggedIn ? (
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <a href="/home" className="mobile-nav-link">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </a>
              <a href="/about" className="mobile-nav-link">
                <Info className="h-5 w-5" />
                <span>About</span>
              </a>
              <a href="/find-ride" className="mobile-nav-link">
                <Search className="h-5 w-5" />
                <span>Find a Ride</span>
              </a>
              <a href="/create-ride" className="mobile-nav-link">
                <PlusCircle className="h-5 w-5" />
                <span>Create a Ride</span>
              </a>
              <a href="/community" className="mobile-nav-link">
                <Users className="h-5 w-5" />
                <span>Community</span>
              </a>
              <a href={`/profile/${userId}`} className="mobile-nav-link">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </a>
              <button
                onClick={handleLogout}
                className="mobile-nav-link text-red-600 hover:bg-red-50 w-full justify-start"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <a href="#features" className="mobile-nav-link">
                Features
              </a>
              <a href="#how-it-works" className="mobile-nav-link">
                How It Works
              </a>
              <a href="#testimonials" className="mobile-nav-link">
                Testimonials
              </a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <button
                  className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-left"
                  onClick={handleLogInNavigation}
                >
                  Log In
                </button>
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow text-left"
                  onClick={handleSignUpNavigation}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="pt-16 flex-grow" />
    </div>
  );
}

export default Navbar;
