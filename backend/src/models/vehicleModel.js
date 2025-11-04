import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  seatType: {
    type: String,
    enum: ["regular", "vip", "sleeper"],
    default: "regular",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const maintenanceSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  expectedCompletionDate: Date,
  actualCompletionDate: Date,
  cost: Number,
  performedBy: String,
});

const vehicleSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      min: 2000,
      max: new Date().getFullYear() + 1,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    vehicleType: {
      type: String,
      enum: ["standard", "luxury", "mini"],
      default: "standard",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "under maintenance"],
      default: "active",
    },
    seats: [seatSchema],
    features: {
      hasAC: { type: Boolean, default: false },
      hasChargingPorts: { type: Boolean, default: false },
      hasWiFi: { type: Boolean, default: false },
    },
    insuranceDetails: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
    maintenanceHistory: [maintenanceSchema],
    lastMaintenanceDate: Date,
    nextMaintenanceDue: Date,
    photosOfVehicle: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized queries
vehicleSchema.index({ companyId: 1, status: 1 });
vehicleSchema.index({ registrationNumber: 1 });

// Virtual property to get available seats
vehicleSchema.virtual("availableSeats").get(function () {
  return this.seats.filter((seat) => seat.isAvailable).length;
});

vehicleSchema.methods.generateSeats = function () {
  const seats = [];
  // based on 4 seats per row (2 on each side of the aisle)
  const rows = Math.ceil(this.capacity / 4);

  for (let i = 0; i < rows; i++) {
    const seatInRow = i === rows - 1 ? this.capacity - (rows - 1) * 4 : 4;
    const seatTags = ["A", "B", "C", "D"];

    for (let j = 0; j < seatInRow; j++) {
      seats.push({
        seatNumber: `${i + 1}${seatTags[j]}`,
        seatType: "regular",
        isAvailable: true,
      });
    }
  }

  this.seats = seats;
  return this.seats;
};

export default mongoose.model("Vehicle", vehicleSchema);
