import { useState, useEffect, useMemo } from 'react';
import useFetch from '../Hooks/useFetch';
import './dashboard.css';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ReferenceLine,
    Area,
    AreaChart
} from 'recharts';

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState('3months');
    const [isLoadingAll, setIsLoadingAll] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data with useFetch hooks
    const { data: profitData, isLoading: profitLoading, error: profitError } = useFetch('dashboard', [timeRange], `profitData&range=${timeRange}`);
    const { data: totalCustomers, isLoading: totalCustomersLoading, error: totalCustomersError } = useFetch('dashboard', [], 'totalCustomers');
    const { data: totalProducts, isLoading: totalProductsLoading, error: totalProductsError } = useFetch('dashboard', [], 'totalProducts');
    const { data: categoryRevenue, isLoading: catRevenueLoading, error: catRevenueError } = useFetch('dashboard', [], 'categoryRevenue');
    const { data: topCustomers, isLoading: topCustomersLoading, error: topCustomersError } = useFetch('dashboard', [], 'topCustomers');
    const { data: topProducts, isLoading: topProductsLoading, error: topProductsError } = useFetch('dashboard', [], 'topProducts');
    const { data: totalOrders, isLoading: orderLoading, error: orderError } = useFetch('dashboard', [], 'totalOrders');
    const { data: totalRevenue, isLoading: revenueLoading, error: revenueError } = useFetch('dashboard', [], 'totalRevenue');
    const { data: years, isLoading: yearsLoading, error: yearsError } = useFetch('dashboard', [], 'filteredYears');

    // Calculate monthly growth rate (new feature)
    const growthRate = useMemo(() => {
        if (profitData && profitData.length >= 2) {
            const lastMonth = profitData[profitData.length - 1].profit;
            const previousMonth = profitData[profitData.length - 2].profit;
            if (previousMonth !== 0) {
                return ((lastMonth - previousMonth) / previousMonth) * 100;
            }
        }
        return 0;
    }, [profitData]);

    // Check if any data is still loading
    useEffect(() => {
        const isAnyLoading =
            orderLoading ||
            revenueLoading ||
            totalProductsLoading ||
            totalCustomersLoading ||
            catRevenueLoading ||
            topCustomersLoading ||
            topProductsLoading ||
            yearsLoading ||
            profitLoading;

        setIsLoadingAll(isAnyLoading);
    }, [
        orderLoading,
        revenueLoading,
        totalProductsLoading,
        totalCustomersLoading,
        catRevenueLoading,
        topCustomersLoading,
        topProductsLoading,
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
            topCustomersError,
            topProductsError,
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
        topCustomersError,
        topProductsError,
        yearsError,
        profitError
    ]);

    console.log('categoryRevenue: ', categoryRevenue);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

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
            <div className="error-container">
                <div className="error-icon">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h3>Error Loading Data</h3>
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="retry-button"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-main">
                    <h1 className="dashboard-title">Sales Dashboard</h1>
                    <div className="dashboard-stats">
                        <span className={`growth-indicator ${growthRate >= 0 ? 'positive' : 'negative'}`}>
                            <i className={`fas fa-${growthRate >= 0 ? 'arrow-up' : 'arrow-down'}`}></i>
                            {Math.abs(growthRate).toFixed(1)}%
                        </span>
                        <span className="stats-period">vs last month</span>
                    </div>
                </div>

                <div className="filter-container">
                    <i className="bi bi-calendar-date"></i>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="filter-select"
                        aria-label="Select time range"
                    >
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
                            <i className="fas fa-box"></i>
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

            {/* Main Dashboard Content - conditionally rendered based on mobile tab */}
            <div className={'dashboard-content'}>
                <div className="charts-grid">
                    {/* Monthly Profits Chart */}
                    <div className="chart-container">
                        <h2 className="dashboard-section-title">
                            <i className="fas fa-chart-line"></i>
                            Monthly Profits
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
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
                                {/* <ReferenceLine
                                    y={3800} stroke="#ef4444" strokeDasharray="3 3"
                                    label={{ position: 'right', value: 'Target', fill: '#ef4444', fontSize: 12 }}
                                /> */}
                                <defs>
                                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#profitGradient)"
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Products Breakdown */}
                    <div className="chart-container">
                        <h2 className="dashboard-section-title">
                            <i className="fas fa-chart-pie"></i>
                            Top Selling Products
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={topProducts.map(product => ({
                                        ...product,
                                        total_sold: Number(product.total_sold)
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    outerRadius={80}
                                    innerRadius={60}
                                    paddingAngle={2}
                                    fill="#8884d8"
                                    dataKey="total_sold"
                                    nameKey="name"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {topProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) => [`${value} units`, 'Sold']}
                                    itemStyle={{ color: '#f1f5f9' }}
                                    contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderRadius: '4px', border: 'none', padding: '8px 12px' }}
                                />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    iconSize={10}
                                    wrapperStyle={{ fontSize: 12, paddingLeft: 20 }}
                                    formatter={(value, entry) => {
                                        // Shorten long product names in legend
                                        return value.length > 15 ? `${value.substring(0, 12)}...` : value;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="chart-container category-chart-container">
                    <h2 className="dashboard-section-title">
                        <i className="fas fa-chart-bar"></i>
                        Profits by Category
                    </h2>
                    {/* Calculate max value explicitly */}
                    {(() => {
                        // Find max revenue in the data
                        const maxRevenue = Math.max(...categoryRevenue.map(item => parseFloat(item.revenue)));
                        // Round up to nice boundary
                        const yAxisMax = Math.ceil(maxRevenue / 1000000) * 1000000;
                        // Create tick values - divide the range into 5 steps
                        const tickValues = [];
                        for (let i = 0; i <= 5; i++) {
                            tickValues.push((yAxisMax / 5) * i);
                        }

                        return (
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
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#64748b' }}
                                        angle={-40}
                                        textAnchor="end"
                                        height={70}
                                    />
                                    <YAxis
                                        tick={{ fill: '#64748b' }}
                                        domain={[0, yAxisMax]}
                                        ticks={tickValues}
                                        tickFormatter={(value) => {
                                            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                                            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                                            return value;
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value) => [commaInPrice(parseInt(value)), 'Revenue']}
                                        labelFormatter={(label) => `Category: ${label}`}
                                    />
                                    <Bar dataKey="revenue" name="Revenue" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                        {categoryRevenue.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        );
                    })()}
                </div>
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
                                </tr>
                            </thead>
                            <tbody>
                                {topCustomers.map((user, index) => (
                                    <tr key={index}>
                                        <td className="bold">{user.name}</td>
                                        <td className="center">{user.total_orders}</td>
                                        <td className="right">{commaInPrice(user.total_spent)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products Table */}
                <div className="chart-container">
                    <h2 className="dashboard-section-title">
                        <i className="fas fa-tag"></i>
                        Top Products (Details)
                    </h2>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th className="center">Units Sold</th>
                                    <th className="right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td className="bold">{product.name}</td>
                                        <td className="center">{product.total_sold}</td>
                                        <td className="right">{commaInPrice(product.total_revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <footer className="dashboard-footer">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
            </footer>
        </div>
    );
}

export default Dashboard;