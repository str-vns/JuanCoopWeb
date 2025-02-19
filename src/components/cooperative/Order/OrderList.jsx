import React, { useEffect, useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import UpdateOrderStatus from "./UpdateOrderStatus";
import { fetchCoopOrders } from "@redux/Actions/orderActions";
import { singleCooperative } from "@redux/Actions/coopActions";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getToken } from "@utils/helpers";
import "@assets/css/orderlistcoop.css";

const OrderList = () => {
  const dispatch = useDispatch();
  const token = getToken();
  const userId = getCurrentUser()._id;
  const { orders } = useSelector((state) => state.coopOrdering);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchCoopOrders(userId, token));
    dispatch(singleCooperative(userId, token));
  }, [dispatch, userId, token]);

  const filterOrders = (Array.isArray(orders) ? orders : [])
    .map((order) => ({
      ...order,
      orderItems: Array.isArray(order.orderItems) ? order.orderItems : [],
    }))
    .filter((order) => order.orderItems.length > 0)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filterOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const nextPage = () => {
    if (currentPage < Math.ceil(filterOrders.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="order-list-container">
      <Sidebar />
      <div className="order-list-content">
        <main className="order-main">
          <div className="order-list-header">
            <h1>Order List</h1>
          </div>
          <div className="order-table-container">
            <table className="order-table">
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
                {currentOrders.map((order) => (
                  <tr key={order?._id}>
                    <td>{order?._id}</td>
                    <td>{order?.user?.firstName} {order?.user?.lastName}</td>
                    <td>
                      {order?.orderItems?.map((item) => (
                        <div key={item?._id} className={`badge badge-${item?.orderStatus.toLowerCase()}`}>
                          {item?.orderStatus}
                        </div>
                      ))}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>₱ {order.totalPrice.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => setSelectedOrder(order) || setIsModalOpen(true)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1} className="pagination-btn">
                Previous
              </button>
              <span> Page {currentPage} of {Math.ceil(filterOrders.length / itemsPerPage)} </span>
              <button onClick={nextPage} disabled={currentPage === Math.ceil(filterOrders.length / itemsPerPage)} className="pagination-btn">
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
      <UpdateOrderStatus isOpen={isModalOpen} order={selectedOrder} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default OrderList;
