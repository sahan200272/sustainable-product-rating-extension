import { useEffect, useState } from "react";
import { getAllProducts, searchProducts } from "../../services/productServices";
import ProductCard from "../../components/products/ProductCard";
import { FiLoader, FiPackage, FiSearch, FiCpu } from "react-icons/fi";

export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAIResult, setIsAIResult] = useState(false);

  // Fetch all initially
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setIsAIResult(false);
    try {
      const response = await getAllProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return fetchAll();
    }

    setLoading(true);
    try {
      const response = await searchProducts(searchQuery);
      if (response.success) {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          setIsAIResult(false);
        } else {
          // AI Result (single object)
          setProducts([response.data]);
          setIsAIResult(true);
        }
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center sm:text-left w-full md:w-auto flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Sustainable Products
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Discover and evaluate the sustainability of various products.
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="w-full md:w-96 flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10 pr-4 py-3 w-full rounded-l-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <button 
              type="submit"
              className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-r-xl transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* AI Banner */}
        {isAIResult && !loading && products.length > 0 && (
           <div className="mb-8 p-6 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl shadow-lg border border-indigo-500 flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-full">
                 <FiCpu className="w-8 h-8 text-indigo-300" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-white tracking-widest uppercase">AI Estimated Fallback</h2>
                 <p className="text-indigo-200 mt-1">We couldn't find an exact match in our verified database, so our AI dynamically analyzed sustainability estimates for this product based on its category and name!</p>
              </div>
           </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FiLoader className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
            <p className="font-medium text-lg text-gray-500">Loading...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FiPackage className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 max-w-sm">
              We couldn't find anything matching that query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product, idx) => (
              <ProductCard key={product._id || `ai-${idx}`} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
