import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllProducts, deleteProduct } from "../../services/productServices";
import { FiPlus, FiEdit2, FiTrash2, FiBox, FiLogOut, FiActivity } from "react-icons/fi";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await getAllProducts();
            if (res.success && res.data) {
                setProducts(res.data);
            }
        } catch (error) {
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this product?")) {
            try {
                await deleteProduct(id);
                toast.success("Product deleted successfully");
                setProducts(prev => prev.filter(p => p._id !== id));
            } catch (err) {
                toast.error("Failed to delete product");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Top Navigation */}
            <nav className="bg-indigo-900 shadow-xl border-b border-indigo-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                                <FiActivity className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Management Hub
                            </h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-white font-semibold text-sm">{user?.name}</span>
                                <span className="text-indigo-300 text-xs font-medium uppercase tracking-wider">Administrator</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-800 text-indigo-100 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors text-sm font-semibold border border-indigo-700"
                            >
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Products Datastore
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Monitor, edit, and orchestrate all products available in the public catalog.
                        </p>
                    </div>
                    <Link
                        to="/add-product"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:shadow-lg focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        <FiPlus className="w-5 h-5" /> Add New Product
                    </Link>
                </div>

                {/* Main Data Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Product Info
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Brand / Category
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Sustainability
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-16">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-3"></div>
                                                <p className="text-gray-500 text-sm font-medium">Loading Datastore...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-16">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <FiBox className="w-12 h-12 mb-3 text-gray-300" />
                                                <p className="text-lg font-medium text-gray-900">No Products Found</p>
                                                <p className="text-sm mt-1">Your datastore is currently empty.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img className="h-10 w-10 rounded-lg object-cover border border-gray-200" src={product.images[0].url || product.images[0]} alt="" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                                <FiBox className="text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                        <div className="text-xs text-gray-500 max-w-[200px] truncate">{product.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{product.brand}</div>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 mt-1">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${
                                                                product.sustainabilityScore >= 80 ? 'bg-emerald-500' : 
                                                                product.sustainabilityScore >= 50 ? 'bg-yellow-400' : 'bg-red-500'
                                                            }`} 
                                                            style={{ width: `${product.sustainabilityScore || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700">
                                                        {Math.round(product.sustainabilityScore || 0)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        to={`/edit-product/${product._id}`}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                                                        title="Edit Product"
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
