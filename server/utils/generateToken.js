/**
 * SECTION: JWT cookie response helper
 * Signs a token for the user and sends it via httpOnly cookie + JSON body.
 */

// ─── sendTokenResponse — used after login/register/password reset ───
/**
 * Generate JWT token and send it via cookie + JSON response.
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 7;

  const options = {
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  // Remove password from output
  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userObj,
  });
};

module.exports = sendTokenResponse;
