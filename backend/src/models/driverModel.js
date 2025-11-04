import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    licenseExpiryDate: {
      type: Date,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },
    experience: {
      years: { type: Number, min: 0 },
      previouseCompany: String,
    },
    ratings: {
      averageRating: { type: Number, min: 0, max: 5, default: 0 },
      totalRatings: { type: Number, min: 0, default: 0 },
    },
    documents: {
      licenseDocumentUrl: String,
      idProofUrl: String,
      photo: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for optimizing queries
driverSchema.index({ companyId: 1, status: 1 });
driverSchema.index({ licenseNumber: 1 });
driverSchema.index({ email: 1 });

// Virtual for full name
driverSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

driverSchema.methods.isLicenseValid = function () {
  return this.licenseExpiryDate > new Date();
};

driverSchema.pre("save", function (next) {
  if (this.licenseExpiryDate < new Date()) {
    this.status = "suspended";
  }
  next();
});

export default mongoose.model("Driver", driverSchema);
