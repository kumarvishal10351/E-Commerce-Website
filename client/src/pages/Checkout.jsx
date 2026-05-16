import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineClipboardCheck, HiCheck } from 'react-icons/hi';
import { setShippingAddress, clearCart } from '../store/slices/cartSlice';
import { createOrderAPI, createPaymentIntentAPI } from '../store/api';
import toast from 'react-hot-toast';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  // SECTION: Redux & router
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice, discount, couponCode, shippingAddress: savedAddr } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);

  // SECTION: State
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState(savedAddr || { fullName: user?.name || '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'US' });

  // SECTION: Handlers
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    dispatch(setShippingAddress(address));
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      // Create payment intent
      const paymentRes = await createPaymentIntentAPI({ amount: totalPrice });
      const order = await createOrderAPI({
        orderItems: items.map(i => ({ product: i.product, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
        shippingAddress: address,
        paymentInfo: { id: paymentRes.data.clientSecret?.split('_secret_')[0] || 'demo_payment', status: 'succeeded', method: 'card' },
        itemsPrice, taxPrice, shippingPrice, totalPrice, discountAmount: discount, couponCode,
      });
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/order-success/${order.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally { setProcessing(false); }
  };

  // SECTION: Step indicator helper
  const StepIcon = ({ idx }) => {
    const icons = [HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineClipboardCheck];
    const Icon = icons[idx];
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step > idx ? 'bg-green-500 text-white' : step === idx ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
        {step > idx ? <HiCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
    );
  };

  // SECTION: JSX
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Step progress */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <StepIcon idx={i} />
              <span className={`text-xs mt-2 font-medium ${step >= i ? 'text-primary-500' : 'text-[var(--color-text-secondary)]'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-16 md:w-24 h-0.5 mx-2 ${step > i ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout steps */}
        <div className="md:col-span-2">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleAddressSubmit} className="card p-6 space-y-4">
              <h2 className="text-xl font-bold">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1"><label className="text-sm font-medium block mb-1">Full Name</label><input required value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="input-field" /></div>
                <div className="col-span-2 sm:col-span-1"><label className="text-sm font-medium block mb-1">Phone</label><input required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="input-field" /></div>
                <div className="col-span-2"><label className="text-sm font-medium block mb-1">Address Line 1</label><input required value={address.addressLine1} onChange={e => setAddress({...address, addressLine1: e.target.value})} className="input-field" /></div>
                <div className="col-span-2"><label className="text-sm font-medium block mb-1">Address Line 2</label><input value={address.addressLine2} onChange={e => setAddress({...address, addressLine2: e.target.value})} className="input-field" /></div>
                <div><label className="text-sm font-medium block mb-1">City</label><input required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="input-field" /></div>
                <div><label className="text-sm font-medium block mb-1">State</label><input required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="input-field" /></div>
                <div><label className="text-sm font-medium block mb-1">Postal Code</label><input required value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} className="input-field" /></div>
                <div><label className="text-sm font-medium block mb-1">Country</label><input required value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className="input-field" /></div>
              </div>
              <button type="submit" className="btn-primary w-full">Continue to Payment</button>
            </motion.form>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6 space-y-4">
              <h2 className="text-xl font-bold">Payment Method</h2>
              <div className="p-4 border-2 border-primary-500 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-primary-500" /></div>
                <HiOutlineCreditCard className="w-5 h-5 text-primary-500" />
                <span className="font-medium">Credit / Debit Card (Stripe)</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-navy-900 rounded-xl space-y-3">
                <div><label className="text-sm font-medium block mb-1">Card Number</label><input placeholder="4242 4242 4242 4242" className="input-field" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium block mb-1">Expiry</label><input placeholder="MM/YY" className="input-field" /></div>
                  <div><label className="text-sm font-medium block mb-1">CVC</label><input placeholder="123" className="input-field" /></div>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">🔒 Payments are secure and encrypted via Stripe</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-outline flex-1">Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Order</button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">Review Your Order</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.product} className="flex items-center gap-4 py-3 border-b last:border-0">
                      <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                      <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{item.name}</p><p className="text-xs text-[var(--color-text-secondary)]">Qty: {item.quantity}</p></div>
                      <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <h3 className="font-bold mb-2">Shipping To:</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{address.fullName}<br />{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />{address.city}, {address.state} {address.postalCode}, {address.country}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button onClick={handlePlaceOrder} disabled={processing} className="btn-primary flex-1">{processing ? 'Processing...' : `Place Order — $${totalPrice.toFixed(2)}`}</button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="card p-6 h-fit space-y-3">
          <h3 className="font-bold">Summary</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Items ({items.length})</span><span>${itemsPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Shipping</span><span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Tax</span><span>${taxPrice.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
            <hr />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
