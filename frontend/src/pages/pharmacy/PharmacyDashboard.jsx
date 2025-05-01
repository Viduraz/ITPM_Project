import React, {useEffect} from "react";
import axios from "axios";

const PharmacyDashboard = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {

        const fetchSales = await axios.get("http://localhost:3000/api/pos/");

        const fetchCustomer = await axios.get("http://localhost:3000/api/pos/customer/3");

        console.log("Sales Data:", fetchSales.data);
        console.log("Customer Data:", fetchCustomer.data);
        

      } catch (err) {
        console.error("Error fetching pharmacy data:", err);
      } 
    
    }

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pharmacy Dashboard</h2>
      <p>Welcome to your pharmacy dashboard.</p>
    </div>
  );
};

export default PharmacyDashboard;
