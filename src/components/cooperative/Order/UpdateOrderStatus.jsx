import React, { useState } from "react";
import '../css/updateorderstatus.css'
import { updateCoopOrders } from "@redux/Actions/coopActions";
import { sendNotifications } from "@redux/Actions/notificationActions";
import { useDispatch } from "react-redux";
import { useSocket } from "../../../../SocketIo"
import { getCurrentUser, getToken } from "@utils/helpers"

const UpdateOrderStatus = ({ isOpen, order, onClose, onUpdateStatus }) => {
  if (!isOpen) return null; 
  const dispatch = useDispatch()
  const socket = useSocket()
  const token = getToken()
  const userId = getCurrentUser()._id
  const userName = getCurrentUser().firstName
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "");
  const [loading, setLoading] = useState(false)
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

 const handlesProcess = (orderId, InvId, order) => {
  console.log("id:",orderId, "items:", InvId, "order:", order)
  setLoading(true)
  
  try{
    let productName = []

    order?.orderItems?.forEach(item => {
      if(item.product && item.inventoryProduct){
        const productInfo = `${item.product.productName} ${item.inventoryProduct.unitName} ${item.inventoryProduct.metricUnit} ${item.inventoryProduct.metricUnit}`
        productName.push(productInfo)
      }
    })

    const productList = productName.join(", ")

    const notification = {
      title: `Order: ${orderId}`, 
      content: `Your order ${productList} is now being processed.`,
      url: order?.orderItems[0]?.product?.image[0].url,
      user: order.user._id,
      type: "order",
    }

    socket.emit("sendNotification", {
      senderName: userName,
      receiverName:  order?.user?._id,
      type: "order",
    })

    const orderupdateInfo = {
      InvId,
      orderStatus: "Processing",
    }

     dispatch(sendNotifications(notification, token))
     dispatch(updateCoopOrders(orderId, orderupdateInfo, token))
    setLoading(false)
    onClose()
  
  } catch (error) {
    console.log(error)
  }
 }

 const handlesShipping = (orderId, InvId, order) => {
  console.log("id:",orderId, "items:", InvId, "order:", order)
  setLoading(true)
  
  try{
    let productName = []

    order?.orderItems?.forEach(item => {
      if(item.product && item.inventoryProduct){
        const productInfo = `${item.product.productName} ${item.inventoryProduct.unitName} ${item.inventoryProduct.metricUnit} ${item.inventoryProduct.metricUnit}`
        productName.push(productInfo)
      }
    })

    const productList = productName.join(", ")

    const notification = {
      title: `Order: ${orderId}`, 
      content: `Your order ${productList} is now being processed.`,
      url: order?.orderItems[0]?.product?.image[0].url,
      user: order.user._id,
      type: "order",
    }

    socket.emit("sendNotification", {
      senderName: userName,
      receiverName:  order?.user?._id,
      type: "order",
    })

    const orderupdateInfo = {
      InvId,
      orderStatus: "Shipping",
    }

     dispatch(sendNotifications(notification, token))
     dispatch(updateCoopOrders(orderId, orderupdateInfo, token))
    setLoading(false)
    onClose()
  
  } catch (error) {
    console.log(error)
  }
 }

  return (
    <div className="modal-overlay text-black">
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <p><strong>Order ID:</strong> {order?._id}</p>
        <p><strong>Customer Name:</strong> {order?.user?.firstName} {order?.user?.lastName}</p>
        <p><strong>Email:</strong> {order?.user?.email}</p>
        <p><strong>Order Date:</strong> {new Date(order?.createdAt).toLocaleDateString()}</p>
        <p><strong>Order Total:</strong>  ₱ {order?.totalPrice}</p>

        <h3 className="mt-4 text-lg font-semibold">Products:</h3>
        <ul>
        {order?.orderItems?.map((product, index) => (
      <li key={index}>
    {product?.product?.productName || "Unknown Product"} {" "}
    {product?.inventoryProduct?.unitName || "Unknown Product"} {""}
    {product?.inventoryProduct?.metricUnit || "Unknown Product"} {""}
    (x{product?.quantity || 0}) - ₱ {" "}
    {(product?.price || 0) * (product?.quantity || 0)}
  </li>
        ))}
        </ul>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
                
          {order?.orderItems?.length > 0 &&
  order?.orderItems?.flat()?.some(orderItem => orderItem?.orderStatus === "Pending") && (
    loading ? (
      <button className="btn btn-primary" disabled>
        Processing...
      </button>
    ) : (
      <button
        className="btn btn-primary"
        onClick={() =>
          handlesProcess(
            order._id,
            order.orderItems
              .flat()
              .filter(orderItem => orderItem.orderStatus !== "Cancelled")
              .map(orderItem => orderItem.inventoryProduct._id),
              order
          )
        }
      >
        Processing
      </button>
    )
  )}
   

   {order?.orderItems?.length > 0 &&
  order?.orderItems?.flat()?.some(orderItem => orderItem?.orderStatus === "Processing") && (
    loading ? (
      <button className="btn btn-primary" disabled>
        Shipping...
      </button>
    ) : (
      <button
        className="btn btn-primary"
        onClick={() => 
          handlesShipping(
            order._id,
            order.orderItems
              .flat()
              .filter(orderItem => orderItem.orderStatus !== "Cancelled")
              .map(orderItem => orderItem.inventoryProduct._id),
            order
          )
        }
      >
        Shipping
      </button>
    )
  )}
    

  
        
        </div>

        {/* <p><strong>Order ID:</strong> {order?.orderId}</p>
        <p><strong>Customer Name:</strong> {order?.customerName}</p>
        <p><strong>Email:</strong> {order?.email}</p>
        <p><strong>Order Date:</strong> {order?.orderDate}</p>
        <p><strong>Order Total:</strong> ${order?.orderTotal}</p>
        
        <h3 className="mt-4 text-lg font-semibold">Products:</h3>
        <ul>
          {order?.products.map((product, index) => (
            <li key={index}>
              {product.name} (x{product.quantity}) - ${product.price * product.quantity}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <label className="block text-sm">Order Status:</label>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="select select-bordered w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Returned/Refunded">Returned/Refunded</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

     
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div> */}
      </div>
    </div>
  );
};

export default UpdateOrderStatus;