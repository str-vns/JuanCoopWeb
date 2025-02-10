import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../../components/layout/navbar";
import Loader from "../../components/layout/loader";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, getToken } from "@utils/helpers";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchAddresses, deleteAddress } from "@redux/Actions/addressActions";
import { MDBDataTable } from "mdbreact";
import "mdbreact/dist/css/mdb.css";

const addressList = () => {
  let { id } = useParams();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const user = getCurrentUser();
  const token = getToken();
  const addresses = useSelector((state) => state.addresses.data);
  const loading = useSelector((state) => state.addresses.loading);
  const error = useSelector((state) => state.addresses.error);

  useEffect(() => {
    dispatch(fetchAddresses(user._id, token));
  }, [dispatch, user._id]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const addressList = () => {
    const data = {
      columns: [
        { label: "Address", field: "address", sort: "asc" },
        { label: "Barangay", field: "barangay", sort: "asc" },
        { label: "City", field: "city", sort: "asc" },
        { label: "Actions", field: "actions" },
      ],
      rows: [],
    };

    if (addresses && addresses.length > 0) {
      addresses.forEach((address) => {
        data.rows.push({
          address: address.address,
          barangay: address.barangay,
          city: address.city,
          actions: (
            <div className="flex items-center space-x-2">
              {/* Edit Button */}
              <Link
                to={{
                  pathname: `/address/edit/${address._id}`,
                  state: { addressId: address._id },
                }}
                className="flex items-center justify-center bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 -0.5 25 25"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.265 4.16231L19.21 5.74531C19.3978 5.9283 19.5031 6.17982 19.5015 6.44201C19.5 6.70421 19.3919 6.9545 19.202 7.13531L17.724 8.93531L12.694 15.0723C12.6069 15.1749 12.4897 15.2473 12.359 15.2793L9.75102 15.8793C9.40496 15.8936 9.10654 15.6384 9.06702 15.2943L9.18902 12.7213C9.19806 12.5899 9.25006 12.4652 9.33702 12.3663L14.15 6.50131L15.845 4.43331C16.1743 3.98505 16.7938 3.86684 17.265 4.16231Z"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(address._id, token)}
                className="flex items-center justify-center bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-2 14H7L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </div>
          ),
        });
      });
    }

    return data;
  };

  return (
    <Fragment>
      <Navbar />
      <div className="flex mt-[75px] bg-white items-center w-full h-full">
        <div className="lg:grid flex flex-grow overflow-y-scroll justify-center items-center pt-[50px]">
          <div className="flex flex-col items-center bg-white">
            <div className="mb-5 flex justify-between items-center w-full px-5">
              <h1 className="font-bold text-lg text-black">All Addresses</h1>
              <Link
                to="/address/create"
                className="bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-700"
              >
                Add Address
              </Link>
            </div>

            <div className="w-[1080px] overflow-x-auto">
              {loading ? (
                <Loader />
              ) : (
                <MDBDataTable
                  data={addressList()}
                  className="table border-2 border-white shadow-lg p-10 text-black"
                  bordered
                  striped
                  hover
                  entriesOptions={[5, 10, 15]}
                  entries={3}
                  noBottomColumns
                  activePage={1}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default addressList;
