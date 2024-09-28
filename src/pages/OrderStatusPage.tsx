import { useState, useEffect } from "react";
import { useGetMyOrders } from "@/api/OrderApi";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const OrderStatusPage = () => {
  const { orders: fetchedOrders, isLoading } = useGetMyOrders();
  const [orders, setOrders] = useState(fetchedOrders || []); // Manage orders locally
  const [deletedOrderIds, setDeletedOrderIds] = useState<string[]>([]); // Track deleted orders

  // Update orders when fetchedOrders change
  useEffect(() => {
    setOrders(fetchedOrders || []);
  }, [fetchedOrders]);

  // Load deleted orders from local storage
  useEffect(() => {
    const savedDeletedIds = localStorage.getItem("deletedOrderIds");
    if (savedDeletedIds) {
      setDeletedOrderIds(JSON.parse(savedDeletedIds));
    }
  }, []);

  // Delete order function (local delete) with confirmation
  const deleteOrder = (orderId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (confirmed) {
      setDeletedOrderIds((prevDeleted) => {
        const updatedDeletedIds = [...prevDeleted, orderId];
        localStorage.setItem("deletedOrderIds", JSON.stringify(updatedDeletedIds)); // Save to local storage
        return updatedDeletedIds;
      });
    }
  };

  if (isLoading) {
    return "Loading...";
  }

  // Filter out deleted orders
  const displayedOrders = orders.filter((order) => !deletedOrderIds.includes(order._id));

  if (displayedOrders.length === 0) {
    return "No orders found";
  }

  return (
    <div className="space-y-10">
      {displayedOrders.map((order) => (
        <div
          key={order._id}
          className="space-y-10 bg-gray-50 p-10 rounded-lg"
        >
          <OrderStatusHeader order={order} />
          <div className="grid gap-10 md:grid-cols-2">
            <OrderStatusDetail order={order} />
            <AspectRatio ratio={16 / 5}>
              <img
                src={order.restaurant.imageUrl}
                className="rounded-md object-cover h-full w-full"
              />
            </AspectRatio>
          </div>

          {/* Buttons container */}
          <div className="flex justify-end space-x-4 mt-4">
            {/* Delete button */}
            <button
              onClick={() => deleteOrder(order._id)}
              className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md"
            >
              Delete Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusPage;
