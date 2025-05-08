import { useState, useEffect } from 'react';
import useFetch from '../Hooks/useFetch';
import './dashboard.css';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ReferenceLine
} from 'recharts';

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState('month');
    const [filteredYear, setFilteredYear] = useState([]);

    // Track loading and error states from all data sources
    const [isLoadingAll, setIsLoadingAll] = useState(true);
    const [error, setError] = useState(null);

    const { data: profitData, isLoading: profitLoading, error: profitError } = useFetch('dashboard', [timeRange], `profitData&range=${timeRange}`);
    const { data: totalCustomers, isLoading: totalCustomersLoading, error: totalCustomersError } = useFetch('dashboard', [], 'totalCustomers');
    const { data: totalProducts, isLoading: totalProductsLoading, error: totalProductsError } = useFetch('dashboard', [], 'totalProducts');
    const { data: categoryRevenue, isLoading: catRevenueLoading, error: catRevenueError } = useFetch('dashboard', [], 'categoryRevenue');
    const { data: totalOrders, isLoading: orderLoading, error: orderError } = useFetch('dashboard', [], 'totalOrders');
    const { data: totalRevenue, isLoading: revenueLoading, revenueError } = useFetch('dashboard', [], 'totalRevenue');
    const { data: years, isLoading: yearsLoading, error: yearsError } = useFetch('dashboard', [], 'filteredYears');

    // Check if any data is still loading
    useEffect(() => {
        const isAnyLoading =
            orderLoading ||
            revenueLoading ||
            totalProductsLoading ||
            totalCustomersLoading ||
            catRevenueLoading ||
            yearsLoading ||
            profitLoading;

        setIsLoadingAll(isAnyLoading);
    }, [
        orderLoading,
        revenueLoading,
        totalProductsLoading,
        totalCustomersLoading,
        catRevenueLoading,
        yearsLoading,
        profitLoading
    ]);

    // Collect any errors from the hooks
    useEffect(() => {
        const errors = [
            orderError,
            revenueError,
            totalProductsError,
            totalCustomersError,
            catRevenueError,
            yearsError,
            profitError
        ].filter(err => err !== null);

        if (errors.length > 0) {
            setError(errors[0]); // Set the first error encountered
        } else {
            setError(null);
        }
    }, [
        orderError,
        revenueError,
        totalProductsError,
        totalCustomersError,
        catRevenueError,
        yearsError,
        profitError
    ]);

    useEffect(() => {
        // console.log("totalOrders: ", totalOrders);
        // console.log("categoryRevenue: ", categoryRevenue);
        // console.log("years: ", years);
        console.log("profitData: ", profitData);
        console.log("timeRange: ", timeRange);
    }, [totalOrders, categoryRevenue, years, profitData]);

    const topUsers = [
        { name: 'John Smith', orders: 42, spent: 3850, trend: '+8%' },
        { name: 'Sarah Johnson', orders: 38, spent: 3200, trend: '+12%' },
        { name: 'Michael Brown', orders: 32, spent: 2950, trend: '-3%' },
        { name: 'Emily Davis', orders: 30, spent: 2780, trend: '+5%' },
        { name: 'David Wilson', orders: 28, spent: 2500, trend: '+2%' },
    ];

    const topProducts = [
        { name: 'Smartphone X', sold: 320, revenue: 160000, inStock: 128 },
        { name: 'Wireless Earbuds', sold: 450, revenue: 45000, inStock: 85 },
        { name: 'Laptop Pro', sold: 210, revenue: 315000, inStock: 42 },
        { name: 'Smart Watch', sold: 380, revenue: 76000, inStock: 115 },
        { name: 'Bluetooth Speaker', sold: 275, revenue: 27500, inStock: 93 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Custom pie chart label renderer that handles long names better
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius * 1.2;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#334155"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                fontWeight={500}
            >
                {`${name} (${(percent * 100).toFixed(0)}%)`}
            </text>
        );
    };

    // Function to format price with commas 1000000 => 100,000
    const commaInPrice = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' L.L';
    };

    // Show loading indicator if any data is still loading
    if (isLoadingAll) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    // Show error message if any error occurred
    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center m-2" role="alert">
                <div>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Error Loading data</strong>
                    <p className="mb-2 mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Sales Dashboard</h1>

                <div className="filter-container">
                    <i className="bi bi-calendar-date"></i>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="month">This Month</option>
                        <option value="3months">Last 3 Months</option>
                        <option value="6months">Last 6 Months</option>
                        {years && Object.values(years).map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="card-header">
                        <div className="icon-container icon-blue">
                            <i className="fas fa-shopping-bag"></i>
                        </div>
                        <h3 className="card-title">Total Orders</h3>
                    </div>
                    <p className="card-value">{totalOrders.toLocaleString()}</p>
                </div>

                <div className="summary-card">
                    <div className="card-header">
                        <div className="icon-container icon-red">
                            <i className="ti ti-chart-bar"></i>
                        </div>
                        <h3 className="card-title">Total Products</h3>
                    </div>
                    <p className="card-value">{totalProducts.toLocaleString()}</p>
                </div>

                <div className="summary-card">
                    <div className="card-header">
                        <div className="icon-container icon-green">
                            <i className="fas fa-dollar-sign"></i>
                        </div>
                        <h3 className="card-title">Total Revenue</h3>
                    </div>
                    <p className="card-value">{commaInPrice(parseInt(totalRevenue))}</p>
                </div>

                <div className="summary-card">
                    <div className="card-header">
                        <div className="icon-container icon-purple">
                            <i className="fas fa-users"></i>
                        </div>
                        <h3 className="card-title">Total Customers</h3>
                    </div>
                    <p className="card-value">{totalCustomers.toLocaleString()}</p>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="charts-grid">
                {/* Monthly Profits Chart */}
                <div className="chart-container">
                    <h2 className="dashboard-section-title">
                        <i className="ti ti-trending-up"></i>
                        Monthly Profits
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={profitData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 20,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                            <YAxis tick={{ fill: '#64748b' }} />
                            <Tooltip
                                formatter={(value) => [commaInPrice(value), 'Profit']}
                                labelFormatter={(label) => `Month: ${label}`}
                            />
                            {/* <Legend />
                            <ReferenceLine
                                y={3800} stroke="#ef4444" strokeDasharray="3 3"
                                label={{ position: 'right', value: 'Target', fill: '#ef4444' }}
                            /> */}
                            <Line
                                type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3}
                                dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: 'white' }} activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products Breakdown */}
                <div className="chart-container">
                    <h2 className="dashboard-section-title">
                        <i className="ti ti-tag"></i>
                        Top Selling Products
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={topProducts}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                outerRadius={80}
                                innerRadius={60}
                                paddingAngle={2}
                                fill="#8884d8"
                                dataKey="sold"
                                label={renderCustomizedLabel}
                            // labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                            >
                                {topProducts.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name, props) => [`${value} units`, 'Sold']}
                                itemStyle={{ color: '#f1f5f9' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sales by Category */}
            <div className="chart-container category-chart-container">
                <h2 className="dashboard-section-title">
                    <i className="ti ti-chart-bar"></i>
                    Sales by Category
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={categoryRevenue}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f5" />
                        <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                        <YAxis tick={{ fill: '#64748b' }} />
                        <Tooltip
                            formatter={(value) => [commaInPrice(parseInt(value)), 'Revenue']}
                            labelFormatter={(label) => `Category: ${label}`}
                        />
                        <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {categoryRevenue.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="tables-grid">
                {/* Top Customers */}
                <div className="chart-container">
                    <h2 className="dashboard-section-title">
                        <i className="fas fa-users"></i>
                        Top Customers
                    </h2>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th className="center">Orders</th>
                                    <th className="right">Total Spent</th>
                                    <th className="right">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td className="bold">{user.name}</td>
                                        <td className="center">{user.orders}</td>
                                        <td className="right">{commaInPrice(user.spent)}</td>
                                        <td className="right" style={{ color: user.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                                            {user.trend} <i className={user.trend.startsWith('+') ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products Table */}
                <div className="chart-container">
                    <h2 className="dashboard-section-title">
                        <i className="ti ti-tag"></i>
                        Top Products (Details)
                    </h2>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th className="center">Units Sold</th>
                                    <th className="right">Revenue</th>
                                    <th className="center">In Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td className="bold">{product.name}</td>
                                        <td className="center">{product.sold}</td>
                                        <td className="right">{commaInPrice(product.revenue)}</td>
                                        <td className="center" style={{
                                            color: product.inStock < 50 ? '#ef4444' :
                                                product.inStock < 100 ? '#f59e0b' : '#10b981'
                                        }}>
                                            {product.inStock} <i className={
                                                product.inStock < 50 ? 'fas fa-exclamation-circle' :
                                                    product.inStock < 100 ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'
                                            }></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;