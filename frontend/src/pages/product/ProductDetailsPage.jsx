import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, deleteProduct } from "../../services/productServices";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { 
  FiArrowLeft, FiLoader, FiCheck, FiX, 
  FiBox, FiActivity, FiCpu, FiAlertCircle, FiEdit, FiTrash2 
} from "react-icons/fi";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.success && response.data) {
          setProduct(response.data);
          if (response.data.images?.length > 0) {
            setSelectedImage(response.data.images[0].url || response.data.images[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        navigate("/products");
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <FiLoader className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-500 text-lg font-medium">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <FiAlertCircle className="w-16 h-16 text-yellow-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6 max-w-md text-center">
          We couldn't find the requested product. It might have been removed or the link is incorrect.
        </p>
        <Link to="/products" className="px-6 py-2 bg-emerald-600 font-semibold text-white rounded-xl shadow-md">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const defaultImage = "https://via.placeholder.com/600x400?text=No+Image+Available";
  
  // Format boolean feature rows
  const FeatureRow = ({ label, isTrue }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-1.5 font-medium">
        {isTrue ? (
          <><FiCheck className="text-emerald-500 w-4 h-4" /><span className="text-emerald-700">Yes</span></>
        ) : (
          <><FiX className="text-red-400 w-4 h-4" /><span className="text-red-500">No</span></>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <Link 
            to="/products" 
            className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Products
          </Link>

          {user?.role === "Admin" && (
            <div className="flex gap-3">
              <Link 
                to={`/edit-product/${id}`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition-colors shadow-sm"
              >
                <FiEdit /> Edit Product
              </Link>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition-colors shadow-sm"
              >
                <FiTrash2 /> Delete Product
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Interactive Image Gallery */}
            <div className="p-8 lg:p-10 bg-gray-50/50 flex flex-col justify-center border-r border-gray-100">
              <div className="aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 flex items-center justify-center shadow-inner">
                <img 
                  src={selectedImage || defaultImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {product.images.map((img, idx) => {
                    const imgUrl = img.url || img;
                    return (
                      <button 
                        key={idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === imgUrl ? 'border-emerald-500 shadow-md ring-2 ring-emerald-100' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                      >
                         <img src={imgUrl} className="w-full h-full object-cover" alt="Thumbnail" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Info Section */}
            <div className="p-8 lg:p-10 flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3 text-sm">
                  <span className="font-bold text-emerald-600 tracking-widest uppercase">{product.brand}</span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                  <span className="text-gray-500">{product.category}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                <p className="text-lg text-gray-600 leading-relaxed min-h-[4rem]">
                  {product.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {/* Score Widget */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col items-center justify-center text-center">
                   <FiActivity className="text-emerald-500 w-8 h-8 mb-2" />
                   <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-widest">Sustainability Score</h3>
                   <div className="text-5xl font-black text-emerald-600 mt-2">
                     {Math.round(product.sustainabilityScore)}<span className="text-2xl text-emerald-400 font-bold">/100</span>
                   </div>
                </div>

                {/* Optional AI Widget */}
                {product.aiSustainablityScore > 0 && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm flex flex-col items-center justify-center text-center">
                     <FiCpu className="text-indigo-500 w-8 h-8 mb-2" />
                     <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-widest">AI Evaluated Trust</h3>
                     <div className="text-5xl font-black text-indigo-600 mt-2">
                       {Math.round(product.aiSustainablityScore)}<span className="text-2xl text-indigo-400 font-bold">/100</span>
                     </div>
                  </div>
                )}
              </div>

              {/* Sustainability Matrix */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <FiBox className="text-gray-400" /> Sustainability Data
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                   <FeatureRow label="Recyclable Material" isTrue={product.sustainability?.recyclableMaterial} />
                   <FeatureRow label="Biodegradable" isTrue={product.sustainability?.biodegradable} />
                   <FeatureRow label="Plastic-Free" isTrue={product.sustainability?.plasticFree} />
                   <FeatureRow label="Cruelty-Free" isTrue={product.sustainability?.crueltyFree} />
                   <FeatureRow label="Fair Trade Certified" isTrue={product.sustainability?.fairTradeCertified} />
                   <FeatureRow label="Renewable Energy Used" isTrue={product.sustainability?.renewableEnergyUsed} />
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                   <div>
                     <span className="block text-sm text-gray-500 font-medium">Carbon Footprint</span>
                     <span className="font-bold text-gray-900 text-lg">{product.sustainability?.carbonFootprint} kg</span> CO₂e
                   </div>
                   <div className="text-right">
                     <span className="block text-sm text-gray-500 font-medium">Energy Efficiency</span>
                     <span className="font-bold text-gray-900 text-lg">{product.sustainability?.energyEfficiencyRating}</span> / 5
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Description Panel */}
          {product.aiSustainabilityDescription && (
             <div className="bg-indigo-900 text-indigo-50 p-8 lg:p-12 border-t flex flex-col lg:flex-row gap-8 items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div className="lg:w-1/4 flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                      <FiCpu className="w-8 h-8 text-indigo-300" />
                   </div>
                   <h3 className="text-lg font-bold text-white tracking-widest uppercase">AI Insight</h3>
                   <p className="text-indigo-300 text-sm mt-1">Automated environmental analysis</p>
                </div>
                <div className="lg:w-3/4">
                  <p className="text-xl leading-relaxed font-serif text-indigo-100 italic">
                    "{product.aiSustainabilityDescription}"
                  </p>
                </div>
             </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
