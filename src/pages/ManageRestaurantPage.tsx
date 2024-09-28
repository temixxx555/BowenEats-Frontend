import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useGetMyRestaurantOrders,
  useUpdateMyRestaurant,
} from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";
import { useState } from "react";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateLoading } =
    useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateMyRestaurant();

  const { orders } = useGetMyRestaurantOrders();

  const isEditing = !!restaurant;

  // Initialize deleted orders from local storage
  const [deletedOrders, setDeletedOrders] = useState(() => {
    const storedOrders = localStorage.getItem("deletedOrders");
    return storedOrders ? new Set(JSON.parse(storedOrders)) : new Set();
  });

  const handleDeleteOrder = (orderId: string) => {
    setDeletedOrders((prev) => {
      const newDeletedOrders = new Set(prev).add(orderId);
      // Update local storage whenever deleted orders change
      localStorage.setItem("deletedOrders", JSON.stringify(Array.from(newDeletedOrders)));
      return newDeletedOrders;
    });
  };

  // Filter orders to exclude deleted ones
  const activeOrders = orders?.filter((order) => !deletedOrders.has(order._id)) || [];

  return (
    <Tabs defaultValue="orders">
      <TabsList>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
      </TabsList>
      <TabsContent
        value="orders"
        className="space-y-5 bg-gray-50 p-10 rounded-lg"
      >
        <h2 className="text-2xl font-bold">{activeOrders.length} active orders</h2>
        {activeOrders.map((order) => (
          <OrderItemCard
            key={order._id} // Always add a key when rendering lists
            order={order}
            onDeleteOrder={handleDeleteOrder} // Pass delete function
            isDeleted={deletedOrders.has(order._id)} // Check if the order is marked as deleted
          />
        ))}
      </TabsContent>
      <TabsContent value="manage-restaurant">
        <ManageRestaurantForm
          restaurant={restaurant}
          onSave={isEditing ? updateRestaurant : createRestaurant}
          isLoading={isCreateLoading || isUpdateLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;
