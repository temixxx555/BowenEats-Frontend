import { Order } from "@/types"; // Assuming you have an Order type defined somewhere

export const deleteOrderFrontend = (orderId: string, orders: Order[]): Order[] => {
  return orders.filter((order) => order._id !== orderId);
};
