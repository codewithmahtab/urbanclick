import type { OrdersWithItems } from "@/features/orders/services/get-orders";
import OrderCard from "./order-card";
import EmptyOrders from "./empty-orders";

export default function OrdersView({ orders }: { orders: OrdersWithItems }) {
  if (!orders || orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
