import { Order } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useGetMyOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/order/my-orders`, { // Corrected endpoint to fetch user orders
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get orders");
    }

    return response.json();
  };

  const { data: orders, isLoading } = useQuery("fetchMyOrders", getMyOrdersRequest, {
    refetchInterval: 5000,
  });

  return { orders, isLoading };
};

type CreateOrderRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
  deliveryPrice?: number; // Optional delivery price
  accountName: string; // New field for account name
  accountNumber: string; // New field for account number
};

export const useCreateOrder = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createOrderRequest = async (orderData: CreateOrderRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/order`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData), // Includes deliveryPrice if provided
    });

    if (!response.ok) {
      throw new Error("Unable to create order");
    }

    return response.json();
  };

  const { mutateAsync: createOrder, isLoading, error, reset } = useMutation(createOrderRequest);

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return {
    createOrder,
    isLoading,
  };
};
