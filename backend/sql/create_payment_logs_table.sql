CREATE TABLE IF NOT EXISTS payment_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(64) NOT NULL,
  userId VARCHAR(64),
  bookingId VARCHAR(64),
  amount DECIMAL(12,2),
  currency VARCHAR(8),
  gateway VARCHAR(32),
  status VARCHAR(32),
  createdAt DATETIME
);
