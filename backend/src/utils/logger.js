/**
 * Simple Logger Utility
 * 
 * Provides consistent logging throughout the application with timestamps.
 * Useful for debugging and monitoring.
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Getting formatted timestamp
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString();
}

/**
 * "Log" info message (blue)
 */
function info(...args) {
  console.log(
    `${colors.blue}[INFO]${colors.reset}`,
    `${colors.dim}${getTimestamp()}${colors.reset}`,
    ...args
  );
}

/**
 * "Log" success message (green)
 */
function success(...args) {
  console.log(
    `${colors.green}[SUCCESS]${colors.reset}`,
    `${colors.dim}${getTimestamp()}${colors.reset}`,
    ...args
  );
}

/**
 * "Log" warning message (yellow)
 */
function warn(...args) {
  console.warn(
    `${colors.yellow}[WARN]${colors.reset}`,
    `${colors.dim}${getTimestamp()}${colors.reset}`,
    ...args
  );
}

/**
 * "Log" error message (red)
 */
function error(...args) {
  console.error(
    `${colors.red}[ERROR]${colors.reset}`,
    `${colors.dim}${getTimestamp()}${colors.reset}`,
    ...args
  );
}

/**
 * "Log" debug message (magenta)
 */
function debug(...args) {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `${colors.magenta}[DEBUG]${colors.reset}`,
      `${colors.dim}${getTimestamp()}${colors.reset}`,
      ...args
    );
  }
}

module.exports = {
  info,
  success,
  warn,
  error,
  debug
};
