// Authentication controller logic
exports.register = async (req, res) => {
    res.send({message: "Register controller working..."});
};

exports.login = async (req, res) => {
    res.send({message: "Login controller working..."});
};

exports.logout = async (req, res) => {
    res.send({message: "Logout controller working..."});
};

// Please repeat this format for other controllers (user, company, driver, booking, payment, adminControllers)