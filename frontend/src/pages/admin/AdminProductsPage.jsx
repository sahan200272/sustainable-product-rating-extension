import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllProducts, deleteProduct } from "../../services/productServices";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiBox,
    FiPackage,
} from "react-icons/fi";

/**
 * AdminProductsPage
 *
 * Route: /admin/products
 * Extracted from AdminDashboard — products section only.
 * No layout shell (AdminLayout provides sidebar + topbar).
 */
export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            const res = await getAllProducts();
            if (res.success && res.data) {
                setProducts(res.data);
            }
        } catch {
            toast.error("Failed to fetch products");
        } finally {
            setProductsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this product?")) {
            try {
                await deleteProduct(id);
                toast.success("Product deleted successfully");
                setProducts((prev) => prev.filter((p) => p._id !== id));
            } catch {
                toast.error("Failed to delete product");
            }
        }
    };

    return (
        <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        Products Datastore
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Monitor, edit, and orchestrate all products available in the public catalog.
                    </p>
                </div>
                <Link
                    to="/admin/add-product"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg"
                >
                    <FiPlus className="h-5 w-5" /> Add New Product
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Product Info
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Brand / Category
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Sustainability
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {productsLoading ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-500" />
                                            <p className="text-sm font-medium text-gray-500">Loading Datastore...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <FiBox className="mb-3 h-12 w-12 text-gray-300" />
                                            <p className="text-lg font-medium text-gray-900">No Products Found</p>
                                            <p className="mt-1 text-sm">Your datastore is currently empty.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img
                                                            className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                                                            src={product.images[0].url || product.images[0]}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                                                            <FiBox className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                    <div className="max-w-[200px] truncate text-xs text-gray-500">
                                                        {product.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{product.brand}</div>
                                            <span className="mt-1 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-24 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            product.sustainabilityScore >= 80
                                                                ? "bg-emerald-500"
                                                                : product.sustainabilityScore >= 50
                                                                  ? "bg-yellow-400"
                                                                  : "bg-red-500"
                                                        }`}
                                                        style={{ width: `${product.sustainabilityScore || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">
                                                    {Math.round(product.sustainabilityScore || 0)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/admin/edit-product/${product._id}`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100"
                                                    title="Edit Product"
                                                >
                                                    <FiEdit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                                                    title="Delete Product"
                                                >
                                                    <FiTrash2 className="h-4 w-4" />
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

            {/* Floating icon for empty product catalog visual hint */}
            {!productsLoading && products.length > 0 && (
                <p className="mt-4 text-right text-xs text-gray-400">
                    <FiPackage className="mr-1 inline h-3 w-3" />
                    {products.length} product{products.length !== 1 ? "s" : ""} in catalog
                </p>
            )}
        </>
    );
}
