import { useState, useEffect } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ComparisonStatsDashboard from "../../components/compare/ComparisonStatsDashboard";
import { getComparisonStats } from "../../services/comparisonServices";
import { FiLoader } from "react-icons/fi";
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
    <div className="space-y-6">
      <AdminPageHeader
        title="Comparison Analytics"
        subtitle="Platform-wide statistics on product comparisons."
        showBackButton={true}
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Comparison Analytics" }
        ]}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl shadow-sm border border-slate-100">
          <FiLoader className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
          <p className="font-medium text-sm">Loading analytics...</p>
        </div>
      ) : (
        <ComparisonStatsDashboard stats={stats} />
      )}
    </div>
  );
}
