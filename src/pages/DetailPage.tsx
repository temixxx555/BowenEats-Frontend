import { useGetRestaurant } from "@/api/RestaurantApi";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MenuItem as MenuItemType } from "../types";
import CheckoutButton from "@/components/CheckoutButton";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useCreateOrder } from "@/api/OrderApi";
import { toast } from "sonner";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { createOrder, isLoading: isCheckoutLoading } = useCreateOrder();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const [includeDelivery, setIncludeDelivery] = useState(false); // Default to true to include delivery

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find((cartItem) => cartItem._id === menuItem._id);
      const updatedCartItems = existingCartItem
        ? prevCartItems.map((cartItem) =>
            cartItem._id === menuItem._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        : [
            ...prevCartItems,
            {
              _id: menuItem._id,
              name: menuItem.name,
              price: menuItem.price,
              quantity: 1,
            },
          ];

      sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter((item) => cartItem._id !== item._id);
      sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems));
      return updatedCartItems;
    });
  };

  const calculateTotalAmount = (items: CartItem[], deliveryPrice: number) => {
    const itemsTotal = items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      return total + itemTotal;
    }, 0);

    return itemsTotal + (includeDelivery ? deliveryPrice : 0);
    
    
  };

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) {
      toast.error("Restaurant information is missing.");
      return;
    }
  
    const totalAmount = calculateTotalAmount(cartItems, restaurant.deliveryPrice || 0);
  
    // Create order data
    const orderData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity,
        price: cartItem.price,
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        city: userFormData.city,
        country: userFormData.country,
        email: userFormData.email as string,
      },
      totalAmount,
      accountName: restaurant.accountName || "",
      accountNumber: restaurant.accountNumber || "",
      ...(includeDelivery && { deliveryPrice: restaurant.deliveryPrice || 0 }), // Only include deliveryPrice if includeDelivery is true
    };
  
    try {
      const newOrder = await createOrder(orderData);
      console.log("Order created:", newOrder);
      navigate("/pay-order", { state: { order: newOrder } });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    }
  };
  
  

  if (isLoading || !restaurant) {
    return <div>Loading...</div>; // Better loading state
  }

  return (
    <div className='flex flex-col gap-10'>
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageUrl}
          className='rounded-md object-cover h-full w-full'
          alt={restaurant.restaurantName}
        />
      </AspectRatio>
      <div className='grid md:grid-cols-[4fr_2fr] gap-5 md:px-32'>
        <div className='flex flex-col gap-4'>
          <RestaurantInfo restaurant={restaurant} />
          <span className='text-2xl font-bold tracking-tight'>Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItem
              key={menuItem._id}
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>

        <div>
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              includeDelivery={includeDelivery}
              setIncludeDelivery={setIncludeDelivery}
            />
            <CardFooter>
              <CheckoutButton
                disabled={cartItems.length === 0}
                onCheckout={onCheckout}
                isLoading={isCheckoutLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
