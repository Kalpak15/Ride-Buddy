import React from "react";
import {
  Car,
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-blue-50 border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Car className="h-9 w-9 text-blue-600" strokeWidth={2.5} />
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                RideBuddy
              </span>
            </div>
            <p className="text-blue-700 text-sm leading-relaxed">
              Connecting travelers for affordable, eco-friendly rides. Join the
              RideBuddy community today!
            </p>
            <div className="flex space-x-5">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-blue-800 text-lg font-semibold mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                "Home",
                "About",
                "Find a Ride",
                "Create a Ride",
                "Safety",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <ChevronRight className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-1" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-blue-800 text-lg font-semibold mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-3 text-sm"
                >
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>Trimurti Chowk, Dhankawadi, Pune</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ridebuddy.com"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-3 text-sm"
                >
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span>ridebuddy.teams@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-3 text-sm"
                >
                  <Phone className="h-5 w-5 text-blue-500" />
                  <span>+91 9960020707</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <p className="text-blue-700 text-sm">
              © {new Date().getFullYear()} RideBuddy. All rights reserved.
            </p>
            <div className="flex space-x-8">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
