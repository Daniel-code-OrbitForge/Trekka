import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "admin" },
    lastLogin: { type: Date, default: Date.now },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true }
);
    
// });
module.exports = mongoose.model("Admin", adminSchema);