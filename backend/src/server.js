const app = require('./app');
const connectMongoDB = require('./config/db');
const PORT = Process.env.PORT || 5000;

// Connecting to MongoDB
connectMongoDB();

// Starting the server
app.listen(PORT, () => {
    console.log(`Trekka backend server running on port ${PORT}`);
});