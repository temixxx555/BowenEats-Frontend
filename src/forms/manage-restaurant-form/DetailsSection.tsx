import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const DetailsSection = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Details</h2>
        <FormDescription>
          Enter the details about your restaurant
        </FormDescription>
      </div>
      
      {/* Restaurant Name */}
      <FormField
        control={control}
        name="restaurantName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Restaurant Name</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex gap-4">
        {/* City */}
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Country */}
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-4">
      {/* Delivery Price */}
      <FormField
        control={control}
        name="deliveryPrice"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Takeawy Price (₦)</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white" placeholder="300" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Estimated Delivery Time */}
      <FormField
        control={control}
        name="estimatedDeliveryTime"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Estimated Confirmation Time (minutes)</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white" placeholder="30" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
</div>
<div className="flex gap-4">
      {/* Account Name */}
      <FormField
        control={control}
        name="accountName"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Account Name && Bank</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white" placeholder="Enter account name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Account Number */}
      <FormField
        control={control}
        name="accountNumber"
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel>Account Number</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white" placeholder="Enter account number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    </div>
  );
};

export default DetailsSection;
