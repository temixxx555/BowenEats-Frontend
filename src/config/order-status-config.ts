import { OrderStatus } from "@/types";

type OrderStatusInfo = {
  label: string;
  value: OrderStatus;
  progressValue: number;
};

export const ORDER_STATUS: OrderStatusInfo[] = [
  { label: "Order Placed", value: "placed", progressValue: 0 },
  {
    label: "Payment Confirmed",
    value: "paid",
    progressValue: 50,
  },
 
  { label: "Awaiting ticket pickup", value: "delivered", progressValue: 75 },
  { label: "Order successful", value: "outForDelivery", progressValue: 100 },
];