import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useUpdateMyRestaurant,
} from "@/api/MyRestaurantApi";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading:isCreateLoading } = useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const {updateRestaurant, isLoading:isUpdateLoading}=useUpdateMyRestaurant();
  const isEditing = !!restaurant;
  return (
    <ManageRestaurantForm
      onSave={isEditing ? updateRestaurant : createRestaurant}
      restaurant={restaurant}
      isLoading={isCreateLoading || isUpdateLoading}
    />
  );
};

export default ManageRestaurantPage;
