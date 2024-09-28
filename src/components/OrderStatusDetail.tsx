import { Order } from "@/types";
import { Separator } from "./ui/separator";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
  // Function to format the amount in Naira
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="font-bold">Address:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>
          {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <ul>
          {order.cartItems.map((item) => (
            <li key={item.menuItemId}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="font-bold">Total</span>
        <span>{formatCurrency(order.totalAmount)}</span>
      </div>
    </div>
  );
};

export default OrderStatusDetail;
