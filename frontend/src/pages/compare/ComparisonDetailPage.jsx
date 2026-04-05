import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ComparisonResult from "../../components/compare/ComparisonResult";
import { getComparisonById, updateComparison } from "../../services/comparisonServices";
import { FiLoader, FiArrowLeft, FiEdit3, FiSave, FiX } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function ComparisonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [comparison, setComparison] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    aiVerdict: "",
    recommendations: {
      general: [],
      product1Suggestions: [],
      product2Suggestions: []
    }
  });

  useEffect(() => {
    fetchComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchComparison = async () => {
    setIsLoading(true);
    try {
      const response = await getComparisonById(id);
      if (response.success) {
        setComparison(response.data);
      } else {
        toast.error("Failed to load comparison");
        navigate("/compare/history");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading comparison");
      navigate("/compare/history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing && comparison) {
      // initialize edit state
      setEditData({
        aiVerdict: comparison.aiVerdict || "",
        recommendations: {
          general: comparison.recommendations?.general || [],
          product1Suggestions: comparison.recommendations?.product1Suggestions || [],
          product2Suggestions: comparison.recommendations?.product2Suggestions || []
        }
      });
    }
    setIsEditing(!isEditing);
  };

  const handleArrayChange = (field, subfield, value) => {
    // split by new lines for simple array editing
    const arr = value.split('\n').filter(line => line.trim() !== '');
    setEditData({
      ...editData,
      [field]: {
        ...editData[field],
        [subfield]: arr
      }
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await updateComparison(id, editData);
      if (response.success) {
        toast.success("Comparison updated successfully");
        setComparison(response.data);
        setIsEditing(false);
      } else {
        toast.error("Failed to update comparison");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Error updating comparison");
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === "Admin";

  if (isLoading && !comparison) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FiLoader className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
        <p className="font-medium text-gray-500">Loading comparison details...</p>
      </div>
    );
  }

  if (!comparison) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link to="/compare/history" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors">
            <FiArrowLeft /> Back to History
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                >
                  <FiEdit3 /> Edit AI & Recommendations (Admin)
                </button>
              ) : (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                  >
                    <FiX /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2 text-sm"
                  >
                    {isLoading ? <FiLoader className="animate-spin" /> : <FiSave />} Save Changes
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Edit Form overrides result display visually if editing */}
        {isEditing ? (
          <div className="bg-white rounded-2xl shadow-sm border border-indigo-200 p-8 space-y-6">
            <div className="flex items-center gap-2 text-indigo-800 mb-6 pb-4 border-b border-indigo-100">
               <FiEdit3 className="w-6 h-6" />
               <h2 className="text-xl font-bold">Admin Edit Mode</h2>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">AI Verdict</label>
              <textarea
                value={editData.aiVerdict}
                onChange={(e) => setEditData({...editData, aiVerdict: e.target.value})}
                rows={4}
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">General Recommendations (1 per line)</label>
                <textarea
                  value={editData.recommendations.general.join('\n')}
                  onChange={(e) => handleArrayChange('recommendations', 'general', e.target.value)}
                  rows={6}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product 1 Suggestions</label>
                <textarea
                  value={editData.recommendations.product1Suggestions.join('\n')}
                  onChange={(e) => handleArrayChange('recommendations', 'product1Suggestions', e.target.value)}
                  rows={6}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-emerald-50/30"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product 2 Suggestions</label>
                <textarea
                  value={editData.recommendations.product2Suggestions.join('\n')}
                  onChange={(e) => handleArrayChange('recommendations', 'product2Suggestions', e.target.value)}
                  rows={6}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-indigo-50/30"
                />
              </div>
            </div>
          </div>
        ) : (
          <ComparisonResult result={comparison} id={id} />
        )}

      </div>
    </div>
  );
}
