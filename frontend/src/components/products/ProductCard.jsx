import { Link } from "react-router-dom";
import { FiCheck, FiX, FiInfo } from "react-icons/fi";

const booleanFeature = (label, isTrue) => (
  <div className="flex items-center gap-1.5 text-xs text-gray-600">
    {isTrue ? (
      <FiCheck className="text-emerald-500 w-3.5 h-3.5" />
    ) : (
      <FiX className="text-red-400 w-3.5 h-3.5" />
    )}
    <span className={isTrue ? "font-medium" : "text-gray-400"}>{label}</span>
  </div>
);

export default function ProductCard({ product }) {
  // If Cloudinary returns URL or it is seeded data
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url || product.images[0]
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.sustainabilityScore >= 80 && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
              Eco-Friendly
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-emerald-800 border border-emerald-100 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-0.5">
              {product.brand}
            </p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {product.name}
            </h3>
          </div>
          <div className="bg-gray-50 flex flex-col items-center justify-center rounded-lg p-1.5 min-w-[48px] border border-gray-100">
            <span className="text-xs text-gray-400 font-medium pb-0.5 border-b border-gray-200">Score</span>
            <span className="text-sm font-bold text-emerald-600 pt-0.5">
              {Math.round(product.sustainabilityScore)}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Sustainability indicators */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-2 pt-3 border-t border-gray-100">
          {booleanFeature("Recyclable", product.sustainability?.recyclableMaterial)}
          {booleanFeature("Plastic Free", product.sustainability?.plasticFree)}
          {booleanFeature("Cruelty Free", product.sustainability?.crueltyFree)}
          {booleanFeature("Fair Trade", product.sustainability?.fairTradeCertified)}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 pt-0">
        <Link
          to={`/products/${product._id}`}
          className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-medium py-2.5 rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors"
        >
          <FiInfo /> View Details
        </Link>
      </div>
    </div>
  );
}
