import axios from 'axios';
const PORT=import.meta.env.VITE_API_URL
const BASE_URL = `${PORT}/api/v1`; 

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProfile = async (userId) => {
  try {
    const response = await api.get(`/profile/get-profile/${userId}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const getRidesOffered = async (userId) => {
  try {
    const response = await api.get(`/get-rides/${userId}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching offered rides:', error);
    throw error;
  }
};

export const getPassengerRidesTaken = async (userId) => {
  try {
    const response = await api.get(`/get-passenger-rides/${userId}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching offered rides:', error);
    throw error;
  }
};