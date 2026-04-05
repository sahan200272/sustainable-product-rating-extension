import { useState, useEffect } from "react";
import ComparisonStatsDashboard from "../../components/compare/ComparisonStatsDashboard";
import { getComparisonStats } from "../../services/comparisonServices";
import { FiLoader, FiBarChart2 } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ComparisonStatsPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await getComparisonStats();
      if (response.success) {
        setStats(response.data);
      } else {
        toast.error("Failed to load statistics");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading statistics");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
             <FiBarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Comparison Analytics
            </h1>
            <p className="mt-1 text-gray-600">
              Platform-wide statistics on product comparisons.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100">
            <FiLoader className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p className="font-medium">Loading analytics...</p>
          </div>
        ) : (
          <ComparisonStatsDashboard stats={stats} />
        )}
      </div>
    </div>
  );
}
