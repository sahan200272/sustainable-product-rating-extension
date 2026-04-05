import { useState, useEffect } from "react";
import { FiPackage, FiZap } from "react-icons/fi";
import { getAllProducts } from "../../services/productServices";
import toast from "react-hot-toast";

export default function ComparisonSelector({ onCompare, onQuickCompare, isLoading }) {
  const [mode, setMode] = useState("standard"); // 'standard' or 'quick'

  // Standard Mode State
  const [allProducts, setAllProducts] = useState([]);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");

  // Quick Compare Mode State
  const [quickName1, setQuickName1] = useState("");
  const [quickName2, setQuickName2] = useState("");

  useEffect(() => {
    // Fetch all products for the dropdowns
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        if (response.success && response.data) {
          setAllProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSelect1 = (e) => {
    const val = e.target.value;
    if (selected2 && selected2 === val) {
      toast.error("You cannot compare the same product.");
      return;
    }
    setSelected1(val);
  };

  const handleSelect2 = (e) => {
    const val = e.target.value;
    if (selected1 && selected1 === val) {
      toast.error("You cannot compare the same product.");
      return;
    }
    setSelected2(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "standard") {
      if (!selected1 || !selected2) {
        toast.error("Please select two products to compare.");
        return;
      }
      if (selected1 === selected2) {
        toast.error("Cannot compare the same product.");
        return;
      }
      onCompare(selected1, selected2);
    } else {
      if (!quickName1.trim() || !quickName2.trim()) {
        toast.error("Please enter names for both products.");
        return;
      }
      onQuickCompare(quickName1, quickName2);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Mode Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex shadow-inner">
          <button
            type="button"
            onClick={() => setMode("standard")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "standard"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              <FiPackage /> Database Dropdowns
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode("quick")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "quick"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              <FiZap /> Quick Name Match
            </span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {mode === "standard" ? (
            <>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product 1</label>
                <div className="relative">
                  <select
                    value={selected1}
                    onChange={handleSelect1}
                    disabled={isLoading}
                    className="pl-4 pr-10 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow bg-white appearance-none"
                  >
                    <option value="" disabled>Select a product...</option>
                    {allProducts.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.brand})
                      </option>
                    ))}
                  </select>
                  {/* Custom select arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex font-bold text-gray-300 px-4 pt-4">
                VS
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product 2</label>
                <div className="relative">
                  <select
                    value={selected2}
                    onChange={handleSelect2}
                    disabled={isLoading}
                    className="pl-4 pr-10 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow bg-white appearance-none"
                  >
                    <option value="" disabled>Select a product...</option>
                    {allProducts.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.brand})
                      </option>
                    ))}
                  </select>
                  {/* Custom select arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product 1 Name</label>
                <input
                  type="text"
                  value={quickName1}
                  onChange={(e) => setQuickName1(e.target.value)}
                  disabled={isLoading}
                  placeholder="E.g., Bamboo Toothbrush"
                  className="px-4 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow bg-white"
                />
              </div>
              <div className="hidden md:flex font-bold text-gray-300 px-4 pt-4">
                VS
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product 2 Name</label>
                <input
                  type="text"
                  value={quickName2}
                  onChange={(e) => setQuickName2(e.target.value)}
                  disabled={isLoading}
                  placeholder="E.g., Plastic Toothbrush"
                  className="px-4 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow bg-white"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isLoading || (mode === 'standard' && (!selected1 || !selected2 || selected1 === selected2))}
            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center min-w-[200px] ${
              isLoading || (mode === 'standard' && (!selected1 || !selected2 || selected1 === selected2))
                ? "bg-gray-300 text-gray-100 cursor-not-allowed"
                : mode === "standard"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg"
            }`}
          >
            {isLoading ? "Analyzing..." : "Compare Products"}
          </button>
        </div>
      </form>
    </div>
  );
}
