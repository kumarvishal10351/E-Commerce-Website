/**
 * HTML Email Templates for the E-Commerce Platform.
 * Professional, responsive email templates for various notifications.
 */

const baseStyles = `
  body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; text-align: center; }
  .header h1 { color: #f59e0b; margin: 0; font-size: 28px; letter-spacing: 1px; }
  .content { padding: 40px 30px; color: #334155; line-height: 1.7; }
  .content h2 { color: #0f172a; margin-top: 0; }
  .btn { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0f172a !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 20px 0; }
  .footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 13px; }
  .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  .order-table th { background-color: #f1f5f9; padding: 12px; text-align: left; font-size: 13px; color: #64748b; text-transform: uppercase; }
  .order-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
  .total-row td { font-weight: 700; font-size: 16px; color: #0f172a; border-top: 2px solid #0f172a; }
`;

/**
 * Welcome email sent after user registration.
 */
const welcomeEmail = (name) => `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>🛍️ ShopVerse</h1></div>
    <div class="content">
      <h2>Welcome, ${name}! 🎉</h2>
      <p>Thank you for joining ShopVerse! We're thrilled to have you as part of our community.</p>
      <p>Here's what you can do now:</p>
      <ul>
        <li>🔍 Browse thousands of products</li>
        <li>❤️ Save items to your wishlist</li>
        <li>🛒 Enjoy seamless checkout</li>
        <li>📦 Track your orders in real-time</li>
      </ul>
      <a href="${process.env.CLIENT_URL}" class="btn">Start Shopping →</a>
      <p>If you have any questions, our support team is always here to help.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ShopVerse. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Password reset email with reset link.
 */
const resetPasswordEmail = (name, resetUrl) => `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>🛍️ ShopVerse</h1></div>
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <a href="${resetUrl}" class="btn">Reset Password →</a>
      <p style="color: #ef4444; font-size: 14px;">⚠️ This link expires in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ShopVerse. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Order confirmation email with order details.
 */
const orderConfirmationEmail = (name, order) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>🛍️ ShopVerse</h1></div>
    <div class="content">
      <h2>Order Confirmed! 🎉</h2>
      <p>Hi ${name},</p>
      <p>Your order <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> has been placed successfully!</p>
      
      <table class="order-table">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td colspan="2">Subtotal</td>
            <td style="text-align: right;">$${order.itemsPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">Shipping</td>
            <td style="text-align: right;">$${order.shippingPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">Tax</td>
            <td style="text-align: right;">$${order.taxPrice.toFixed(2)}</td>
          </tr>
          ${order.discountAmount > 0 ? `<tr><td colspan="2">Discount</td><td style="text-align: right; color: #22c55e;">-$${order.discountAmount.toFixed(2)}</td></tr>` : ''}
          <tr class="total-row">
            <td colspan="2">Total</td>
            <td style="text-align: right;">$${order.totalPrice.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Shipping to:</strong><br/>
      ${order.shippingAddress.fullName}<br/>
      ${order.shippingAddress.addressLine1}<br/>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>

      <a href="${process.env.CLIENT_URL}/orders/${order._id}" class="btn">Track Order →</a>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ShopVerse. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};

/**
 * Order status update email.
 */
const orderStatusEmail = (name, orderId, status) => `
<!DOCTYPE html>
<html>
<head><style>${baseStyles}</style></head>
<body>
  <div class="container">
    <div class="header"><h1>🛍️ ShopVerse</h1></div>
    <div class="content">
      <h2>Order Update 📦</h2>
      <p>Hi ${name},</p>
      <p>Your order <strong>#${orderId.toString().slice(-8).toUpperCase()}</strong> status has been updated to:</p>
      <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: 700; color: #16a34a;">${status}</span>
      </div>
      <a href="${process.env.CLIENT_URL}/orders/${orderId}" class="btn">View Order Details →</a>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ShopVerse. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  welcomeEmail,
  resetPasswordEmail,
  orderConfirmationEmail,
  orderStatusEmail,
};
