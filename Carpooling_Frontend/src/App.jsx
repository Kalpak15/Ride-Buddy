// App.jsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "./store/authSlice";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import CreateRide from "./pages/CreateRide";
import FindRides from "./pages/FindRides";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import BookRide from "./pages/BookRide";
import ProfilePage from "./pages/Profile";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoutes"; // Updated name
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import Reviews from "./pages/Reviews";
import ChangePassword from "./pages/ChangePassword";
import VerifyEmailPage from "./pages/VerifyEmail";
import RidesOffered from "./pages/RidesOffered";
import RidesTaken from "./pages/RidesTaken";
import Community from "./pages/Community";


function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth); // Get token from Redux
  



  // Function to check token expiration
  const checkTokenExpiration = () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      dispatch(logout());
      return;
    }

    try {
      const decoded = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decoded.exp < currentTime) {
        dispatch(logout());
      }
    } catch (error) {
      console.error("Invalid token:", error);
      dispatch(logout());
    }
  };

  // Periodic token check
  useEffect(() => {
    checkTokenExpiration(); // Check on mount

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [dispatch]);

  let userId = null;
  if (token) {
    try {
      const payload = jwtDecode(token);
      userId = payload.userId;
      console.log(`User ${userId}`);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-ride"
          element={
            <ProtectedRoute>
              <FindRides />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-ride"
          element={
            <ProtectedRoute>
              <CreateRide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit/:userId"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/book-ride/:id"
          element={
            <ProtectedRoute>
              <BookRide />
            </ProtectedRoute>
          }
        />
        {userId ? (
          <Route
            path="/profile"
            element={<Navigate to={`/profile/${userId}`} />}
          />
        ) : (
          <Route path="/profile" element={<Navigate to="/login" />} />
        )}
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/offered/:userId"
          element={
            <ProtectedRoute>
              <RidesOffered />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rides/taken/:userId"
          element={
            <ProtectedRoute>
              <RidesTaken />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {token && <Footer />}
    </div>
  );
}

export default App;
