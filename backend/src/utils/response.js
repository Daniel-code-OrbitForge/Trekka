/**
 * Response Utility
 * 
 * Provides standardized JSON response formats for API endpoints.
 * Ensures consistency across all API responses.
 */

/**
 * Sending "success" response
 * 
 * @param {Object} res | Express response object
 * @param {Number} statusCode | HTTP status code (default: 200)
 * @param {String} message | Success message
 * @param {Object} data | Response data
 */
function sendSuccess(res, statusCode = 200, message = 'Success', data = null) {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };
  
  return res.status(statusCode).json(response);
}

/**
 * Sending "error" response
 * 
 * @param {Object} res | Express response object
 * @param {Number} statusCode | HTTP status code (default: 500)
 * @param {String} message | Error message
 * @param {Object} errors | Detailed error information (optional)
 */
function sendError(res, statusCode = 500, message = 'An error occurred', errors = null) {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  
  return res.status(statusCode).json(response);
}

/**
 * Sending "validation error" response
 * 
 * @param {Object} res | Express response object
 * @param {Object} errors | Validation errors
 */
function sendValidationError(res, errors) {
  return sendError(res, 400, 'Validation failed', errors);
}

/**
 * Sending "unauthorized" response
 * 
 * @param {Object} res | Express response object
 * @param {String} message | Custom message (optional)
 */
function sendUnauthorized(res, message = 'Unauthorized access') {
  return sendError(res, 401, message);
}

/**
 * Sending "forbidden" response
 * 
 * @param {Object} res | Express response object
 * @param {String} message | Custom message (optional)
 */
function sendForbidden(res, message = 'Access forbidden') {
  return sendError(res, 403, message);
}

/**
 * Sending "not found" response
 * 
 * @param {Object} res | Express response object
 * @param {String} message | Custom message (optional)
 */
function sendNotFound(res, message = 'Resource not found') {
  return sendError(res, 404, message);
}

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound
};
