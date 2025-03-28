import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <p className="text-xl text-gray-700 mt-4">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-gray-600 mt-2">
          It might have been removed or you may have mistyped the address.
        </p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;