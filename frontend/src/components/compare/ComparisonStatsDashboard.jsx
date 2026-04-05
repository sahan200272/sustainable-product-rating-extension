import { FiPieChart, FiTrendingUp, FiActivity, FiUsers } from "react-icons/fi";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

export default function ComparisonStatsDashboard({ stats }) {
  if (!stats) return null;

  const { totalComparisons, mostComparedProducts, last7DaysTrend, averageScoreDifference } = stats;

  const trendData = {
    labels: last7DaysTrend?.map(t => t._id) || [],
    datasets: [
      {
        label: 'Comparisons Made',
        data: last7DaysTrend?.map(t => t.count) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
      }
    ]
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat Cards */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex justify-center items-center flex-shrink-0">
            <FiActivity className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Comparisons</p>
            <h4 className="text-2xl font-black text-gray-900">{totalComparisons || 0}</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex justify-center items-center flex-shrink-0">
            <FiPieChart className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Avg Score Diff</p>
            <h4 className="text-2xl font-black text-gray-900">{Math.round(averageScoreDifference || 0)} pts</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex justify-center items-center flex-shrink-0">
            <FiUsers className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Top Product Count</p>
            <h4 className="text-2xl font-black text-gray-900">
              {mostComparedProducts && mostComparedProducts.length > 0 ? mostComparedProducts[0].count : 0}
            </h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <FiTrendingUp className="text-emerald-500" /> Activity Trend (7 Days)
             </h3>
          </div>
          <div className="h-64 w-full">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>

        {/* Top Compared Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <h3 className="text-lg font-bold text-gray-900">Most Compared Products</h3>
          </div>
          <div className="flex-1 overflow-auto">
            {mostComparedProducts && mostComparedProducts.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {mostComparedProducts.map((item, idx) => (
                  <li key={item._id || idx} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex flex-col">
                      <Link to={`/products/${item._id}`} className="font-semibold text-sm text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                        {item.name || "Unknown Product"}
                      </Link>
                      <span className="text-xs text-gray-500">In {item.count} comparisons</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-600 shrink-0">
                      #{idx + 1}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No sufficient data for calculations yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
