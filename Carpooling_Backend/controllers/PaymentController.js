const crypto = require("crypto");
const User = require("../models/UserModel");
const Razorpay = require("razorpay");

require("dotenv").config()

exports.isSubscribe = async (req, res) => {
  try {
    const { userId } = req.query; // Correct way to get userId
    console.log("Received userId:", userId);
    if (!userId) return res.status(400).json({ message: "userId is required" });

    // Ensure userId matches the token's userId for security
    console.log("Token userId:", req.userInfo.userId);
    if (String(userId) !== String(req.userInfo.userId)) {
      return res.status(403).json({ message: "Unauthorized userId" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User found:", user);
    res.json({ isMember: user.isMember });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.isVerify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature ,userId} = req.body;
    console.log("Received verification data:", req.body);
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    // Get Razorpay key secret from environment variables
    const key_secret = process.env.key_secret;

    // Step 1: Generate expected signature
    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // Step 2: Compare generated signature with received signature
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }
    
    await User.findByIdAndUpdate(userId, { isMember: true });
    // Payment is verified
    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {  
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.createOrderID=async(req,res)=>{
  // Backend: routes/payments.js

const razorpay = new Razorpay({
  key_id: process.env.key_id ,
  key_secret: process.env.key_secret ,
});

  const { amount, currency } = req.body;
  const options = {
    amount: amount * 100, // Convert to paise (e.g., 100 = ₹1)
    currency: currency || "INR",
    receipt: `receipt_${Date.now()}`,
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};