import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaShoppingCart, FaMoneyBillWave, FaCalendarAlt, FaBoxOpen, FaChartLine, 
  FaArrowUp, FaClipboardList, FaPercentage, FaUsers, FaPills, FaFilePdf, FaDownload 
} from "react-icons/fa";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PharmacyDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averageSale: 0,
    productCount: 0
  });
  const [productBreakdown, setProductBreakdown] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    topSellingProduct: '',
    totalDiscount: 0,
    cashSalesPercentage: 0,
    averageItemsPerSale: 0
  });

  // Function to generate and download PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Pharmacy Sales Report", pageWidth/2, 20, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth/2, 30, { align: 'center' });
    
    // Add summary statistics
    doc.setFontSize(14);
    doc.text("Sales Summary", 14, 45);
    
    // Sales stats as table
    const statsData = [
      ["Total Sales", salesStats.totalSales],
      ["Total Revenue", `LKR ${salesStats.totalRevenue.toLocaleString()}`],
      ["Average Sale", `LKR ${salesStats.averageSale.toLocaleString()}`],
      ["Products Sold", salesStats.productCount],
      ["Top Selling Product", summaryStats.topSellingProduct],
      ["Total Discounts", `LKR ${summaryStats.totalDiscount.toLocaleString()}`],
      ["Cash Payments", `${summaryStats.cashSalesPercentage.toFixed(1)}%`],
      ["Average Items Per Sale", summaryStats.averageItemsPerSale.toFixed(1)]
    ];
    
    // Use autoTable imported directly
    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: statsData,
      theme: 'grid',
      headStyles: { fillColor: [75, 85, 175] }
    });
    
    // Add product breakdown
    doc.setFontSize(14);
    doc.text("Product Sales Breakdown", 14, doc.lastAutoTable.finalY + 15);
    
    const productData = productBreakdown.map(product => [
      product.code,
      product.name,
      product.count,
      `LKR ${product.revenue.toLocaleString()}`
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Product Code", "Product Name", "Quantity Sold", "Revenue"]],
      body: productData,
      theme: 'grid',
      headStyles: { fillColor: [75, 85, 175] }
    });
    
    // Save the PDF
    doc.save("pharmacy-sales-report.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/pos/");
        setSalesData(response.data);
        
        // Calculate dashboard statistics
        const revenue = response.data.reduce((sum, sale) => sum + sale.totalPrice, 0);
        const totalDiscount = response.data.reduce((sum, sale) => sum + sale.discount, 0);
        
        // Create product breakdown
        const productCounts = {};
        let totalItems = 0;
        
        response.data.forEach(sale => {
          const products = JSON.parse(sale.products);
          totalItems += products.length;
          
          products.forEach(product => {
            const key = product.description;
            const qty = parseInt(product.quantity);
            
            if (!productCounts[key]) {
              productCounts[key] = {
                count: qty,
                revenue: qty * parseFloat(product.price),
                code: product.code
              };
            } else {
              productCounts[key].count += qty;
              productCounts[key].revenue += qty * parseFloat(product.price);
            }
          });
        });
        
        // Convert to array and sort by count
        const productArray = Object.entries(productCounts).map(([name, data]) => ({
          name,
          count: data.count,
          revenue: data.revenue,
          code: data.code
        }));
        
        productArray.sort((a, b) => b.count - a.count);
        setProductBreakdown(productArray);
        
        // Calculate additional summary stats
        const cashSales = response.data.filter(sale => sale.paymentMethod.toLowerCase() === 'cash').length;
        const cashSalesPercentage = (cashSales / response.data.length) * 100;
        const topSellingProduct = productArray.length > 0 ? productArray[0].name : 'None';
        const averageItemsPerSale = totalItems / response.data.length;
        
        setSummaryStats({
          topSellingProduct,
          totalDiscount,
          cashSalesPercentage,
          averageItemsPerSale
        });
        
        setSalesStats({
          totalSales: response.data.length,
          totalRevenue: revenue,
          averageSale: revenue / response.data.length,
          productCount: totalItems
        });
      } catch (err) {
        setError("Failed to fetch sales data.");
        console.error("Error fetching pharmacy data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Format currency
  const formatCurrency = (amount) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Pharmacy Dashboard</h2>
          <p className="text-gray-600">Track your sales and inventory in real-time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>
          </div>
          <button
            onClick={generatePDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <FaFilePdf className="mr-2" />
            Download Report
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>
              <h3 className="text-2xl font-bold">{salesStats.totalSales}</h3>
              <p className="text-green-600 text-sm flex items-center mt-1">
                <FaArrowUp className="mr-1" /> 12% from last month
              </p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-full">
              <FaShoppingCart className="text-indigo-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">{formatCurrency(salesStats.totalRevenue)}</h3>
              <p className="text-green-600 text-sm flex items-center mt-1">
                <FaArrowUp className="mr-1" /> 8% from last month
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Sale</p>
              <h3 className="text-2xl font-bold">{formatCurrency(salesStats.averageSale)}</h3>
              <p className="text-green-600 text-sm flex items-center mt-1">
                <FaArrowUp className="mr-1" /> 5% from last month
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <FaChartLine className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Products Sold</p>
              <h3 className="text-2xl font-bold">{salesStats.productCount}</h3>
              <p className="text-green-600 text-sm flex items-center mt-1">
                <FaArrowUp className="mr-1" /> 15% from last month
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-full">
              <FaBoxOpen className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Board */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <FaClipboardList className="mr-2 text-indigo-600" /> 
          Sales Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-100 p-3 rounded-full">
                <FaPills className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h4 className="text-gray-700 font-medium">Top Seller</h4>
              </div>
            </div>
            <p className="text-lg font-semibold">{summaryStats.topSellingProduct}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-3 rounded-full">
                <FaPercentage className="text-green-600 text-xl" />
              </div>
              <div>
                <h4 className="text-gray-700 font-medium">Total Discounts</h4>
              </div>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(summaryStats.totalDiscount)}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-blue-600 text-xl" />
              </div>
              <div>
                <h4 className="text-gray-700 font-medium">Cash Payments</h4>
              </div>
            </div>
            <p className="text-lg font-semibold">{summaryStats.cashSalesPercentage.toFixed(1)}%</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaUsers className="text-yellow-600 text-xl" />
              </div>
              <div>
                <h4 className="text-gray-700 font-medium">Items Per Sale</h4>
              </div>
            </div>
            <p className="text-lg font-semibold">{summaryStats.averageItemsPerSale.toFixed(1)}</p>
          </div>
        </div>
      </div>
      
      {/* Product Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <FaBoxOpen className="mr-2 text-indigo-600" /> 
          Product Sales Breakdown
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productBreakdown.map((product, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <FaShoppingCart className="mr-2 text-indigo-600" /> 
        Recent Sales Transactions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salesData.map((sale) => (
          <div
            key={sale.id}
            className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Sale #{sale.code}</h3>
                <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">
                  {sale.paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {new Date(sale.saledate).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-lg font-bold text-indigo-600">
                  {formatCurrency(sale.totalPrice)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-500">Cash In</p>
                  <p className="font-medium">{formatCurrency(sale.cashin)}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-500">Balance</p>
                  <p className="font-medium">{formatCurrency(sale.balance)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <FaBoxOpen className="mr-1 text-indigo-400" /> Products
                </h4>
                <ul className="space-y-2">
                  {JSON.parse(sale.products).map((product, idx) => (
                    <li key={idx} className="text-sm bg-gray-50 p-2 rounded flex justify-between">
                      <span className="text-gray-700">{product.description}</span>
                      <span>
                        <span className="font-medium">{product.quantity} × {formatCurrency(product.price)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyDashboard;
