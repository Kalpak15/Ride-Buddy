const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");



// Import Controller 
const {createRide, createPassengerRide} = require("../controllers/createRideController");
const {getRide, getRides, getRidesByDriverId, getPassengerRidesByPassengerId} = require("../controllers/getRideController");

const {isSubscribe,isVerify,createOrderID} = require("../controllers/PaymentController");
const {deleteRide} = require("../controllers/deleteRideController");


// Mapping Create
router.post("/create-ride", authMiddleware, createRide);
router.post("/create-passenger-ride/:id", authMiddleware, createPassengerRide);
router.get("/find-ride", authMiddleware, getRides);
router.get("/book-ride/:id", authMiddleware, getRide);
router.get("/get-rides/:driver", authMiddleware, getRidesByDriverId);
router.get("/get-passenger-rides/:passenger", authMiddleware, getPassengerRidesByPassengerId);

// Route to Create Order



router.delete("/delete-ride/:rideId", authMiddleware, deleteRide);


router.get("/payments/subscription-status/", authMiddleware,isSubscribe);
router.post("/payments/verify", authMiddleware,isVerify);
router.post("/payments/create-order", authMiddleware,createOrderID);
   

// Export Controller
module.exports = router;

