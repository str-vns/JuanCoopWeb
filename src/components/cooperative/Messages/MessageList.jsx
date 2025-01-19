import React, { useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";

const MessageList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState({
    "John Doe": [
      { sender: "seller", text: "Hello! Yes, we do have the jacket in medium." },
      { sender: "buyer", text: "Do you ship internationally?" },
      { sender: "seller", text: "We currently ship within the Philippines." },
    ],
    "Jane Smith": [
      { sender: "buyer", text: "Is this available in size small?" },
      { sender: "seller", text: "Yes, we have it in small." },
    ],
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectCustomer = (customerName) => {
    setSelectedCustomer(customerName);
  };

  const handleSendMessage = (e, customerName) => {
    e.preventDefault();
    const messageInput = e.target.message.value;
    if (messageInput) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [customerName]: [
          ...prevMessages[customerName],
          { sender: "seller", text: messageInput },
        ],
      }));
      e.target.reset();
    }
  };

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
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6 flex">
          {/* Customer List */}
          <div className="w-1/3 bg-white border-r p-4">
            <h2 className="font-semibold text-xl mb-4">Conversations</h2>
            <div className="space-y-4">
              {Object.keys(messages).map((customer) => (
                <div
                  key={customer}
                  className="flex items-center justify-between p-3 border-b cursor-pointer"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
                    <span className="font-medium">{customer}</span>
                  </div>
                  <span className="text-sm text-gray-500">3 min ago</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 p-4 bg-gray-100">
            {selectedCustomer ? (
              <>
                <div className="flex flex-col space-y-4 h-full overflow-y-auto">
                  <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-md">
                    <div className="space-y-3">
                      {messages[selectedCustomer].map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            message.sender === "seller"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs p-3 rounded-lg ${
                              message.sender === "seller"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-black"
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <form
                    onSubmit={(e) => handleSendMessage(e, selectedCustomer)}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      name="message"
                      placeholder="Type your message..."
                      className="input input-bordered w-full"
                    />
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">Select a customer to start messaging</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
