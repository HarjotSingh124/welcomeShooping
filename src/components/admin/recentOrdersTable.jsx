"use client"
import { useState } from "react";

const mockOrders = [
  { id: 1, customer: "John Doe", total: 120, status: "Pending" },
  { id: 2, customer: "Jane Smith", total: 90, status: "Completed" },
  { id: 3, customer: "Sam Wilson", total: 150, status: "Shipped" },
  { id: 4, customer: "Mary Johnson", total: 80, status: "Cancelled" },
  { id: 5, customer: "Chris Evans", total: 200, status: "Completed" },
];

export default function RecentOrdersTable() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedOrders = [...mockOrders]
    .filter((order) =>
      order.customer.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">Recent Orders</h2>
        <input
          type="text"
          placeholder="Search customer..."
          className="border rounded px-2 py-1 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th
              className="py-2 cursor-pointer"
              onClick={() => handleSort("id")}
            >
              Order ID
            </th>
            <th
              className="py-2 cursor-pointer"
              onClick={() => handleSort("customer")}
            >
              Customer
            </th>
            <th
              className="py-2 cursor-pointer"
              onClick={() => handleSort("total")}
            >
              Total ($)
            </th>
            <th
              className="py-2 cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}