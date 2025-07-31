export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const openRazorpayPayment = async ({ key, amount, user, onSuccess }) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Check your internet connection.');
    return;
  }

  const options = {
    key: 'rzp_test_zoiBCtMTQU3kPx', // Razorpay Key ID
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    name: 'Harjot Store',
    description: 'Order Payment',
    handler: function (response) {
      console.log('Payment Successful:', response);
      onSuccess(response);  // Callback to handle after success
    },
    prefill: {
      name: user?.displayName || '',
         email: user.email || '',
      contact: '',
    },
    theme: {
      color: '#0f172a',
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.open();
};