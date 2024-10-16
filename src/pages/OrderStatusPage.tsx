import { useState, useEffect, useRef } from "react";

import { useGetMyOrders } from "@/api/OrderApi";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const OrderStatusPage = () => {
const { orders: fetchedOrders, isLoading } = useGetMyOrders();
const [orders, setOrders] = useState(fetchedOrders || []); // Manage orders locally
const [deletedOrderIds, setDeletedOrderIds] = useState<string[]>([]); // Track deleted orders
  const printRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Create refs for each order

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

  // Function to print individual order card
  const printOrder = (orderId: string) => {
    const orderRef = printRefs.current[orderId];
    if (orderRef) {
      const printContents = orderRef.innerHTML;
      const originalContents = document.body.innerHTML;
  
      // Custom alert for iOS users or browsers that may block automatic printing
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        const allowPrint = window.confirm("The website has been blocked from automatically printing. Would you like to allow printing?");
        if (!allowPrint) {
          return; // Exit if the user chooses to ignore
        }
      }
  
      // Replace the body content with the selected order's content for printing
      document.body.innerHTML = printContents;
  
      try {
        window.print();
      } catch {
        alert("Unable to automatically print. Please try printing manually.");
      } finally {
        // Restore the original content after printing
        document.body.innerHTML = originalContents;
        window.location.href = "/"; // Redirect to home page
      }
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
          ref={(el) => (printRefs.current[order._id] = el)} // Assign ref to each order card
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

            {/* Print button */}
            <button
              onClick={() => printOrder(order._id)}
              className="text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-md"
            >
              Print Order
            </button>
</div>
</div>
))}
</div>
);
};

export default OrderStatusPage;