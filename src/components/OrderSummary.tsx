import { CartItem } from "@/pages/DetailPage";
import { Restaurant } from "@/types";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Trash } from "lucide-react";

type Props = {
  restaurant: Restaurant;
  cartItems: CartItem[];
  removeFromCart: (cartItem: CartItem) => void;
  includeDelivery: boolean; // Keep this as boolean
  setIncludeDelivery: (value: boolean) => void; // Set directly to boolean
};

const OrderSummary = ({
  restaurant,
  cartItems,
  removeFromCart,
  includeDelivery,
  setIncludeDelivery,
}: Props) => {
  const getTotalCost = () => {
    const totalInNaira = cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );

    const totalWithDelivery = totalInNaira + (includeDelivery ? restaurant.deliveryPrice : 0);
    return totalWithDelivery.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
          <span>Your Order</span>
          <span>{getTotalCost()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {cartItems.map((item) => (
          <div className="flex justify-between" key={item.name}>
            <span>
              <Badge variant="outline" className="mr-2">
                {item.quantity}
              </Badge>
              {item.name}
            </span>
            <span className="flex items-center gap-1">
              <Trash
                className="cursor-pointer"
                color="red"
                size={20}
                onClick={() => removeFromCart(item)}
              />
              {((item.price * item.quantity)).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
            </span>
          </div>
        ))}
        <Separator />
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeDelivery}
              onChange={() => setIncludeDelivery(!includeDelivery)} // Update here
              className="mr-2"
            />
            Include Takeaway
          </label>
          <span>{includeDelivery ? restaurant.deliveryPrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) : "₦0.00"}</span>
        </div>
        <a 
          href="tel:+1234567890" // Replace with the actual phone number
          className="text-sm text-blue-500 hover:underline mt-1"
        >
          Call for delivery inquiries
        </a>
        <Separator />
      </CardContent>
    </>
  );
};

export default OrderSummary;
