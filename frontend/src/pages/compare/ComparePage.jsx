import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ComparisonSelector from "../../components/compare/ComparisonSelector";
import ComparisonResult from "../../components/compare/ComparisonResult";
import { compareProducts, quickCompareByName } from "../../services/comparisonServices";
import toast from "react-hot-toast";
import { FiLoader, FiLayers } from "react-icons/fi";

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle incoming url query parameters for direct comparisons
    const p1 = searchParams.get("product1");
    const p2 = searchParams.get("product2");
    const n1 = searchParams.get("name1");
    const n2 = searchParams.get("name2");

    if (p1 && p2) {
      handleStandardCompare(p1, p2);
      // clean params from URL silently to avoid re-triggering on nav
      setSearchParams({}, { replace: true });
    } else if (n1 && n2) {
      handleQuickCompare(n1, n2);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStandardCompare = async (id1, id2) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await compareProducts(id1, id2);
      if (response.success) {
        setResult(response.data);
      } else {
        toast.error(response.error || "Failed to compare products");
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Error running comparison";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCompare = async (name1, name2) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await quickCompareByName(name1, name2);
      if (response.success) {
        setResult(response.data);
      } else {
        toast.error(response.error || "Failed to compare by name");
      }
    } catch (error) {
      console.error(error);
      const is404 = error.response?.status === 404;
      const msg = is404 
        ? "No products found matching those names. Try database search." 
        : (error.response?.data?.error || "Error running quick comparison");
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Back Button */}
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors w-fit"
          >
            &larr; Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <FiLayers className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Compare Sustainability
          </h1>
          <p className="text-lg text-gray-600">
            Select two products to see a detailed breakdown of their ecological footprint, materials, and overall sustainability score.
          </p>
        </div>

        {/* Selector */}
        <ComparisonSelector 
          onCompare={handleStandardCompare}
          onQuickCompare={handleQuickCompare}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FiLoader className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
            <p className="font-medium text-lg text-gray-500">Analyzing products...</p>
            <p className="text-sm text-gray-400 mt-2 max-w-sm text-center">Our AI is compiling sustainability metrics and formatting the breakdown. This may take a few seconds.</p>
          </div>
        )}

        {/* Result */}
        {!isLoading && result && (
          <div id="comparison-result-view" className="scroll-mt-10">
             <ComparisonResult result={result} />
          </div>
        )}

      </div>
    </div>
  );
}
