import { useState, useEffect } from "react";
import ComparisonHistoryList from "../../components/compare/ComparisonHistoryList";
import { getComparisonHistory, deleteComparison, clearComparisonHistory } from "../../services/comparisonServices";
import { FiLoader, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ComparisonHistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await getComparisonHistory();
      if (response.success) {
        setHistory(response.data);
      } else {
        toast.error("Failed to load comparison history");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading comparison history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteComparison(id);
      if (response.success) {
        toast.success("Comparison removed");
        setHistory(history.filter(c => c._id !== id));
      } else {
        toast.error("Failed to delete comparison");
      }
    } catch (error) {
       console.error(error);
       toast.error("Error deleting comparison");
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await clearComparisonHistory();
      if (response.success) {
        toast.success("All comparison history cleared");
        setHistory([]);
      } else {
        toast.error("Failed to clear history");
      }
    } catch (error) {
       console.error(error);
       toast.error("Error clearing history");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/compare" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors mb-4">
            <FiArrowLeft /> Back to Comparisons
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Comparison History
          </h1>
          <p className="mt-2 text-gray-600">
            Review past sustainability showdowns you've analyzed.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100">
            <FiLoader className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
            <p className="font-medium">Loading history...</p>
          </div>
        ) : (
          <ComparisonHistoryList 
            history={history} 
            onDelete={handleDelete} 
            onClearAll={handleClearAll} 
          />
        )}
      </div>
    </div>
  );
}
