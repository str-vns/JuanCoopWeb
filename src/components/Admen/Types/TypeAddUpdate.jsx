import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { typeCreate, typeUpdate } from "@redux/Actions/typeActions";

const TypeAddUpdate = ({ isOpen, onClose, type, refreshTypes }) => {
  const dispatch = useDispatch();

  const [typeName, setTypeName] = useState("");

  const { loading, success, error } = useSelector((state) =>
    type ? state.typeUpdate : state.typesCreate
  );

  useEffect(() => {
    if (type) {
      setTypeName(type.typeName);
    } else {
      setTypeName("");
    }
  }, [type]);

  useEffect(() => {
    if (success) {
      alert(`${type ? "Updated" : "Created"} successfully!`);
      onClose();
      refreshTypes();
    }
    if (error) {
      alert(`Error: ${error}`);
    }
  }, [success, error, onClose, refreshTypes, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type) {
      dispatch(typeUpdate({ ...type, typeName }));
    } else {
      dispatch(typeCreate({ typeName }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-title">{type ? "Edit Type" : "Add Type"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type Name"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            className="input"
            required
          />
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TypeAddUpdate;