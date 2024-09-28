import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import { useEffect } from "react";

const formSchema = z
  .object({
    restaurantName: z.string({
      required_error: "Restaurant name is required",
    }),
    city: z.string({
      required_error: "location is required",
    }),
    country: z.string({
      required_error: "Country is required",
    }),
    deliveryPrice: z.coerce.number({
      required_error: "Delivery price is required",
      invalid_type_error: "Must be a valid number",
    }),
    estimatedDeliveryTime: z.coerce.number({
      required_error: "Estimated delivery time is required",
      invalid_type_error: "Must be a valid number",
    }),
    cuisines: z.array(z.string()).nonempty({
      message: "Please select at least one item",
    }),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "Name is required"),
        price: z.coerce.number().min(1, "Price is required"),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "Image is required" }).optional(),
    accountName: z.string().min(1, "Account name && bank is required"),  // Ensure it's not empty
  accountNumber: z.string().min(1, "Account number is required"), // Ensure it's not empty
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image file must be provided",
    path: ["imageFile"],
  });

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
      accountName: "", // Default value
      accountNumber: "", // Default value
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    const deliveryPriceFormatted = restaurant.deliveryPrice; // Already in Naira

    const menuItemsFormatted = restaurant.menuItems.map((item) => ({
      ...item,
      price: item.price, // Already in Naira
    }));

    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: deliveryPriceFormatted,
      menuItems: menuItemsFormatted,
      accountName: restaurant.accountName , // Handle accountName
      accountNumber: restaurant.accountNumber , // Handle accountNumber
    };

    form.reset(updatedRestaurant);
  }, [form, restaurant]);

 const onSubmit = async (formDataJson: RestaurantFormData) => {
  try {
    // Validate form data using Zod schema
    const validatedData = await formSchema.parseAsync(formDataJson);

    const formData = new FormData();
    formData.append("restaurantName", validatedData.restaurantName);
    formData.append("city", validatedData.city);
    formData.append("country", validatedData.country);
    formData.append("deliveryPrice", validatedData.deliveryPrice.toString());
    formData.append("estimatedDeliveryTime", validatedData.estimatedDeliveryTime.toString());

    // Handle accountName and accountNumber
    formData.append("accountName", validatedData.accountName); 
    formData.append("accountNumber", validatedData.accountNumber);

    validatedData.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    validatedData.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(`menuItems[${index}][price]`, menuItem.price.toString());
    });

    if (validatedData.imageFile) {
      formData.append(`imageFile`, validatedData.imageFile);
    }

    // Call your save function
    onSave(formData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log or display validation errors
      console.error(error.errors);
      // Handle error display for UI (e.g., set error state)
    }
  }
};

  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 bg-gray-50 p-10 rounded-lg'
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type='submit'>Submit</Button>}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
