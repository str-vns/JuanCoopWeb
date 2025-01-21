import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import "../../../assets/css/typelist.css";
import TypeAddUpdate from "./TypeAddUpdate"; 
import { useDispatch, useSelector } from "react-redux";
import { typeList, typeDelete } from "@redux/Actions/typeActions";

const TypeList = () => {
  const dispatch = useDispatch();

  // Redux state
  const { loading, types = [], error } = useSelector((state) => state.types);
  const { success: deleteSuccess, error: deleteError } = useSelector((state) => state.typesDelete);

  const [modalOpen, setModalOpen] = useState(false);
  const [editType, setEditType] = useState(null);

  useEffect(() => {
    dispatch(typeList());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(typeList());
      alert("Type deleted successfully!");
    }
    if (deleteError) {
      alert("Error deleting type: " + deleteError);
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const openModal = (type = null) => {
    setEditType(type);
    setModalOpen(true);
  };

  const handleDelete = (typeId) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      dispatch(typeDelete(typeId));
    }
  };

  return (
    <div className="type-list-container">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-gray-100 p-6">
          <div className="type-list-header">
            <h1 className="type-title ">Type List</h1>
            <button className="btn-primary" onClick={() => openModal()}>
              Add Type
            </button>
          </div>
          {loading ? (
            <div className="loading-container">
              <p className="loading-text">Loading...</p>
            </div>
          ) : error ? (
            <p className="error-text">Error: {error}</p>
          ) : (
            <div className="bg-white shadow rounded-lg p-4">
              {types.length === 0 ? (
                <p className="loading-text">No types available.</p>
              ) : (
                <div className="type-container">
                  <div className="type-grid">
                  {types.map((type) => (
                    <div key={type._id} className="type-item p-4 border-b flex justify-between items-center">
                      <span className="text-gray-800 font-medium">{type.typeName}</span>
                      <div className="actions flex space-x-2">
                        <button className="btn-secondary" onClick={() => openModal(type)}>
                          Edit
                        </button>
                        <button className="btn-danger" onClick={() => handleDelete(type._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <TypeAddUpdate
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={editType}
          refreshTypes={() => dispatch(typeList())}
        />
      )}
    </div>
  );
};

export default TypeList;