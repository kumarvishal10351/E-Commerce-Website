/**
 * SECTION: Custom operational error class
 * Carries an HTTP statusCode so controllers can call next(new ErrorResponse(...)).
 */

// ─── ErrorResponse — extends native Error ───
/**
 * Custom error response class for operational errors.
 * Extends native Error to include statusCode for HTTP responses.
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
