import React, { useEffect, useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import UpdateOrderStatus from "./UpdateOrderStatus";
import { fetchCoopOrders } from "@redux/Actions/orderActions"
import { updateCoopOrders, singleCooperative } from '@redux/Actions/coopActions'
import { sendNotifications } from '@redux/Actions/notificationActions'
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getToken } from "@utils/helpers";
import { useSocket } from "../../../../SocketIo"

const OrderList = () => {
  const dispatch = useDispatch()
  const token = getToken()
  const socket = useSocket()
  const userId = getCurrentUser()._id
  const userName = getCurrentUser().firstName
  const { cooploading, orders, ordererror } = useSelector((state) => state.coopOrdering)
  const  { coops } = useSelector((state) => state.allofCoops)
  const [loading, setLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const filterOrders = (Array.isArray(orders) ? orders : []).map((order) => 
  ({...order, orderItems: Array.isArray(order.orderItems) 
  ? order.orderItems : []})).filter((order) => order.orderItems.length > 0)

  // const order = [
  //   {
  //     orderId: "12345",
  //     customerName: "John Doe",
  //     email: "johndoe@example.com",
  //     orderStatus: "Shipped",
  //     products: [
  //       { name: "Widget A", quantity: 2, price: 20 },
  //       { name: "Widget B", quantity: 1, price: 15 },
  //     ],
  //     orderTotal: 55,
  //     orderDate: "2024-12-19",
  //   },
  //   {
  //     orderId: "12346",
  //     customerName: "Jane Smith",
  //     email: "janesmith@example.com",
  //     orderStatus: "Pending",
  //     products: [
  //       { name: "Gadget X", quantity: 1, price: 30 },
  //     ],
  //     orderTotal: 30,
  //     orderDate: "2024-12-20",
  //   },
  // ];

  useEffect(() => {
    dispatch(fetchCoopOrders(userId, token))
    dispatch(singleCooperative(userId, token))
  },[dispatch, userId, token])
  
  // Handle opening the modal and passing the selected order data
  const handleViewClick = (order) => {
    console.log("order", order)
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle status update
  const handleUpdateStatus = (orderId, newStatus) => {
    // Logic to update order status, could be an API call
    console.log(`Order ID: ${orderId} updated to status: ${newStatus}`);
    // Optionally, update the orders list state with new status
  };
console.log("orders", orders)
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <h2 className="text-xl font-bold mb-4">Order List</h2>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Order Status</th>
                  <th>Order Date</th>
                  <th>Order Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterOrders.map((order) => (
                  <tr key={order?._id}>
                    <td>{order?._id}</td>
                    <td>{order?.user?.firstName} {order?.user?.lastName}</td>
                    <td>
                    {order?.orderItems?.map((item) => (
            <tr key={item?._id}>
              <td>{item?.product?.productName}</td>
              <td>{item?.inventoryProduct?.unitName} {item?.inventoryProduct?.metricUnit}</td>
              <td>
                <span
                  className={`badge ${
                    item?.orderStatus === "Delivered"
                      ? "badge-success"
                      : item?.orderStatus === "Pending"
                      ? "badge-warning"
                      : item?.orderStatus === "Cancelled"
                      ? "badge-error"
                       : item?.orderStatus === "Shipping"
                      ? "badge-info"
                            : item?.orderStatus === "Processing"
                      ? "badge-primary"
                      : ""
                  }`}
                >
                  {item?.orderStatus}
                </span>
              </td>
            </tr>
          ))}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td> ₱ {order.totalPrice}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleViewClick(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <UpdateOrderStatus
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsModalOpen(false);
          window.location.reload();
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrderList;