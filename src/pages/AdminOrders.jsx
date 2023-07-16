import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Text, Divider, Select as ChakraSelect, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import OrderItem from "../components/OrderItem";
import { setOrderItems } from "../features/orderSlice";
import Select from "react-select";
import { fetchBranchStores, fetchMonthlySales, fetchProducts, fetchProductsSold, fetchWeeklySales } from "../api/adminDashboardApi";

import axios from "axios";

const AdminOrders = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const adminGlobal = useSelector((state) => state.admin.admin);
  const orderGlobal = useSelector((state) => state.order.order);
  const orderItems = orderGlobal.order_items;
  const adminRole = adminGlobal.role;
  const [storeId, setStoreId] = useState(1360); // main store
  const [branchStores, setBranchStores] = useState([]);

  useEffect(() => {
    if (adminRole == 99) {
      const getBranchStores = async () => {
        const response = await fetchBranchStores();
        setBranchStores(response.options);
        // setTotalStores(response.totalStores);
        // console.log(response);
      };

      getBranchStores();
    } else {
      setStoreId(adminGlobal.store_id);
      console.log("branch admin");
    }
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePaginatePrev = () => {
    if (currentPage === 1) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePaginateNext = () => {
    if (currentPage === totalPages) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  // sort by
  const [sortBy, setSortBy] = useState("desc");

  const handleSortChange = (event) => {
    const selectedValue = event.target.value;
    const orderItems = [...orderGlobal.order_items];

    setSortBy(selectedValue);
    if (selectedValue === "desc") {
      const sortDesc = orderItems.sort((a, b) => b.order_id - a.order_id);
      dispatch(setOrderItems(sortDesc));
    } else if (selectedValue === "asc") {
      const sortAsc = orderItems.sort((a, b) => a.order_id - b.order_id);
      dispatch(setOrderItems(sortAsc));
    }
  };

  // id filter
  const [selectedId, setSelectedId] = React.useState("");
  const handleIdChange = (event) => setSelectedId(event.target.value);

  const handleId = async () => {
    try {
      console.log(selectedId);
      let response = await axios.get(`http://localhost:8000/api/admin/order/by-invoice/?storeId=${storeId}&orderId=${selectedId}`);
      if (response.data.data.length === 0) {
        alert("Order not found");
      } else {
        dispatch(setOrderItems(response.data.data));
        console.log(response.data.data[0].order_status);
        setSelectedStatus(response.data.data[0].order_status);
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  // status filter
  const [selectedStatus, setSelectedStatus] = useState("All");
  const statuses = ["All", "Waiting for payment", "Waiting for confirmation", "Processed", "Out for delivery", "Delivered", "Canceled"];

  const handleStatus = async (status) => {
    try {
      setSelectedStatus(status);

      if (status === "All") {
        let response = await axios.get(`http://localhost:8000/api/admin/order/?storeId=${storeId}`);
        if (response) {
          console.log(response.data.orders);
          console.log(response.data.max);
          dispatch(setOrderItems(response.data.orders));
          setTotalPages(response.data.maxPages);
        }
      } else {
        let response = await axios.get(`http://localhost:8000/api/admin/order/by-status/?storeId=${storeId}&orderStatus=${selectedStatus}`);
        if (response) {
          console.log(response.data.orders);
          console.log(response.data.max);
          dispatch(setOrderItems(response.data.orders));
          setTotalPages(response.data.maxPages);
        }
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  // date filter
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [minEndDate, setMinEndDate] = useState("");

  const handleStartChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartValue(selectedStartDate);
    setMinEndDate(selectedStartDate); // Set the minimum end date as the selected start date
    if (endValue < selectedStartDate) {
      setEndValue(selectedStartDate); // Reset the end date if it's earlier than the new start date
    }
  };

  const handleEndChange = (e) => {
    const selectedEndDate = e.target.value;
    if (selectedEndDate >= startValue) {
      setEndValue(selectedEndDate);
    }
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }; //format date for sql

  const handleDate = async () => {
    try {
      const startDate = formatDate(startValue);
      const endDate = formatDate(endValue);

      const response = await axios.get(`http://localhost:8000/api/admin/order/by-date/?storeId=${storeId}&page=${currentPage}&startDate="${startDate}"&endDate="${endDate}"`);

      console.log(response.data);
      if (response.data.orders.length == 0) {
        alert("Orders not found");
      }
      dispatch(setOrderItems(response.data.orders));
      setTotalPages(response.data.maxPages);
      setSelectedStatus("All");
    } catch (error) {
      console.log(error);
    }
  };

  // paginate listener
  useEffect(() => {
    console.log(currentPage);
    const renderPaginate = async () => {
      try {
        if (selectedStatus === "All") {
          let response = await axios.get(`http://localhost:8000/api/admin/order/?storeId=${storeId}&page=${currentPage}`);
          if (response) {
            console.log(response.data.orders);
            dispatch(setOrderItems(response.data.orders));
            setTotalPages(response.data.maxPages);
          }
        } else {
          let response = await axios.get(`http://localhost:8000/api/admin/order/by-status/?storeId=${storeId}&orderStatus=${selectedStatus}`);
          if (response) {
            console.log(response.data.orders);
            console.log(response.data.maxPages);
            dispatch(setOrderItems(response.data.orders));
            setTotalPages(response.data.maxPages);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    renderPaginate();
    setSortBy("desc");
  }, [currentPage, storeId]);

  // status listener
  useEffect(() => {
    setCurrentPage(1);
    handleStatus(selectedStatus);
  }, [selectedStatus]);

  const renderOrderItems = () => {
    // return console.log(orderItems);
    return orderItems.map((o, index) => {
      return (
        <OrderItem
          //
          key={index}
          user_id={o.user_id}
          order_id={o.order_id}
          order_date={o.order_date}
          shipping_courier={o.shipping_courier}
          shipping_type={o.shipping_type}
          shipping_price={o.shipping_price}
          total_price={o.total_price}
          payment_proof={o.payment_proof}
          order_status={o.order_status}
          origin={o.store_name}
          destination={o.street}
        />
      );
    });
  };

  return (
    <div className="mx-20">
      <div className="grid grid-cols-5 gap-5 m-10">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl pt-5 font-semibold tracking-tight text-pink-500 ">Orders</h1>
          {/* {selectedStatus} - Page: {currentPage} */}
          {adminGlobal.role == 99 ? (
            <div>
              <Select
                className="w-full"
                id="product_sort_id"
                name="product_sort_id"
                placeholder="Toko JKT"
                options={branchStores}
                // isClearable={isClearable}
                onChange={(selectedOption) => {
                  // setSelectedBranchStore(selectedOption.value);
                  // console.log(selectedBranchStore);
                  // // console.log(selectedOption);
                  console.log(selectedOption.value);
                  setStoreId(selectedOption.value);
                }}
              />
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-3">
            {/* status starts */}
            {statuses.map((x) => (
              <div
                className={`flex border px-4 py-2 rounded-md items-center cursor-pointer hover:translate-x-1 duration-100
                    ${selectedStatus === x ? "font-semibold border-pink-500 text-pink-500" : ""}`}
                onClick={() => {
                  handleStatus(x);
                }}
              >
                <p className="">{x}</p>
              </div>
            ))}
            {/* status ends */}
            {/* Filter starts */}
            <Divider />
            <Text className="font-semibold text-pink-600">Sort and Filter</Text>
            <div className="flex flex-col gap-3">
              <div>
                <ChakraSelect placeholder="Sort by" size="sm" value={sortBy} onChange={handleSortChange}>
                  <option value="desc">Latest to oldest</option>
                  <option value="asc">Oldest to latest</option>
                </ChakraSelect>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <Input className="col-span-2" type="number" value={selectedId} onChange={handleIdChange} placeholder="Find order by id" size="sm" />
                <Button className="col-span-1" size="sm" onClick={handleId}>
                  Find
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4">
                  <Text>Start</Text>
                  <Input className="col-span-3" placeholder="Select Date and Time" size="sm" type="datetime-local" value={startValue} onChange={handleStartChange} />
                </div>
                <div className="grid grid-cols-4">
                  <Text>End</Text>
                  <Input
                    className="col-span-3"
                    placeholder="Select Date and Time"
                    size="sm"
                    type="datetime-local"
                    value={endValue}
                    onChange={handleEndChange}
                    min={minEndDate} // Set the minimum allowed value for the end date
                  />
                </div>
                <Button size="sm" onClick={handleDate}>
                  Find order by date
                </Button>
              </div>
            </div>
            {/* Filter ends */}
          </div>
        </div>

        {orderItems.length === 0 ? (
          <div className="col-span-4 pt-7">No orders found</div>
        ) : (
          <div className="col-span-4 flex flex-col gap-6">
            {/* Pagination starts */}
            <div className="flex gap-3 mb-2">
              <Button
                size="xs"
                onClick={() => {
                  handlePaginatePrev();
                }}
              >
                Prev
              </Button>
              <span>
                {currentPage} out of {totalPages}
              </span>
              <Button
                size="xs"
                onClick={() => {
                  handlePaginateNext();
                }}
              >
                Next
              </Button>
            </div>
            {/* Pagination ends */}
            <div className="flex flex-col gap-6">{renderOrderItems()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
