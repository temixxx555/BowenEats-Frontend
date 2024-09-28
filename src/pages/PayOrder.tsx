
import { useLocation, useNavigate } from 'react-router-dom';

type OrderItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
};

const PayOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // Format numbers with commas except account number
  const formatNumberWithCommas = (number: number) => {
    return number.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  // Copy account number to clipboard
  const copyAccountNumber = () => {
    if (order?.accountNumber) {
      navigator.clipboard.writeText(order.accountNumber);
      alert('Account number copied!');
    }
  };

  // Navigate to the order status page
  const navigateToOrderStatus = () => {
    navigate('/order-status', { state: { orderId: order?._id } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Order Summary</h1>
        {order ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Details</h2>
            <ul className="mb-4">
              {order.cartItems.map((item: OrderItem) => (
                <li
                  key={item.menuItemId}
                  className="flex justify-between mb-2 border-b py-2"
                >
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} x {formatNumberWithCommas(item.price)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-semibold mb-2">
              Total Amount: {formatNumberWithCommas(order.totalAmount)}
            </p>
            <p className="font-semibold mb-2">
              Remember to add ₦50 charges
            </p>
            <h3 className="text-lg font-semibold mb-2">Account Details</h3>
            <p className="mb-1">
              <span className="font-semibold">Account Name:</span> {order.accountName}
            </p>
            <p className="mb-1 flex justify-between items-center">
              <span>
                <span className="font-semibold">Account Number:</span> {order.accountNumber}
              </span>
              <button
                onClick={copyAccountNumber}
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                Copy
              </button>
            </p>
            <p className="mb-1">
              <span className="font-semibold">Takeaway price:</span> {formatNumberWithCommas(order.deliveryPrice)}
            </p>
            <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
            <p className="mb-1">
              <span className="font-semibold">Name:</span> {order.deliveryDetails.name}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Email:</span> {order.deliveryDetails.email}
            </p>
            <p>
              <span className="font-semibold">Hostel:</span> {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
            </p>

            {/* Button to navigate to the order status page */}
            <button
              onClick={navigateToOrderStatus}
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            >
              I have paid
            </button>
          </div>
        ) : (
          <p className="text-red-500">No order found.</p>
        )}
      </div>
    </div>
  );
};

export default PayOrder;
