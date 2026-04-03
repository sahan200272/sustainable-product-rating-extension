import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productServices";
import ProductCard from "../../components/products/ProductCard";
import { FiLoader, FiPackage } from "react-icons/fi";

export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
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

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            All Sustainable Products
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-600 sm:mx-0 mx-auto">
            Discover and evaluate the sustainability of various products. Browse through our eco-friendly collection.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FiLoader className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
            <p className="font-medium text-lg text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FiPackage className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 max-w-sm">
              It seems there are no products available in the system right now. Add some products to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
