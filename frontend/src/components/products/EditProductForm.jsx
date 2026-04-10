import { useState, useEffect } from "react";
import { updateProduct, getProductById } from "../../services/productServices";
import { FiUploadCloud, FiX, FiCheck, FiLoader } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const PREDEFINED_CATEGORIES = [
    "Electronics",
    "Fashion & Apparel",
    "Home & Living",
    "Beauty & Health",
    "Food & Groceries",
  ];

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    images: [],
    sustainability: {
      recyclableMaterial: true,
      biodegradable: false,
      plasticFree: false,
      carbonFootprint: 0,
      crueltyFree: true,
      fairTradeCertified: false,
      renewableEnergyUsed: true,
      energyEfficiencyRating: 5,
    },
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImagesList, setExistingImagesList] = useState([]);

  useEffect(() => {
    const fetchExistingProduct = async () => {
      try {
        const res = await getProductById(id);
        const prod = res.data;
        if (prod) {
          setFormData({
            name: prod.name,
            brand: prod.brand,
            category: prod.category,
            description: prod.description,
            images: [], // new files
            sustainability: { ...prod.sustainability },
          });
          
          if (prod.images && prod.images.length > 0) {
            setExistingImagesList(prod.images);
          }

          if (!PREDEFINED_CATEGORIES.includes(prod.category)) {
            setIsCustomCategory(true);
          }
        }
      } catch (err) {
        setErrorMessage("Failed to fetch product details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExistingProduct();
  }, [id]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSustainabilityChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      sustainability: {
        ...prev.sustainability,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });

    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // clean up
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const removeExistingImage = (index) => {
      // Typically we'd keep an array of "images to delete" in state
      // For simplicity, we just filter it out visually. 
      // Fully deleting an image from cloudinary usually requires sending the public_id to backend.
      // But we will just ignore that edge case for this specific edit if it's too complex or just hide it.
      setExistingImagesList(prev => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("brand", formData.brand);
      submitData.append("category", formData.category);
      submitData.append("description", formData.description);

      formData.images.forEach((img) => {
        submitData.append("images", img);
      });

      submitData.append(
        "sustainability",
        JSON.stringify(formData.sustainability)
      );

      await updateProduct(id, submitData);
      setSuccessMessage("Product updated successfully! Redirecting...");
      setTimeout(() => {
        navigate(`/admin/products/${id}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-10"><FiLoader className="inline animate-spin w-8 h-8 text-emerald-500" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
          <FiCheck className="w-5 h-5" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800">
          <FiX className="w-5 h-5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Grid for basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            required
            value={formData.brand}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            required={!isCustomCategory}
            value={PREDEFINED_CATEGORIES.includes(formData.category) ? formData.category : (isCustomCategory ? "Other" : "")}
            onChange={(e) => {
              if (e.target.value === "Other") {
                setFormData((prev) => ({ ...prev, category: "" }));
                setIsCustomCategory(true);
              } else {
                setFormData((prev) => ({ ...prev, category: e.target.value }));
                setIsCustomCategory(false);
              }
            }}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
          >
            <option value="" disabled>Select a Category</option>
            {PREDEFINED_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="Other">Add New Category...</option>
          </select>
          {isCustomCategory && (
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleTextChange}
              className="mt-3 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
              placeholder="Type new category..."
            />
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            required
            value={formData.description}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 resize-none"
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Image Upload Area */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Add New Images (Appends to existing)</label>
        <div className="flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-8 bg-gray-50 hover:bg-gray-100 transition-colors mb-4">
          <div className="text-center">
            <FiUploadCloud className="mx-auto h-10 w-10 text-gray-400" />
            <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 hover:text-emerald-500 mt-4 block">
              <span>Upload additional files</span>
              <input type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">Existing Images</span>
          {existingImagesList.length > 0 ? (
             <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 mb-4">
               {existingImagesList.map((img, i) => (
                 <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 h-24">
                   <img src={img.url || img} className="h-full w-full object-cover" />
                 </div>
               ))}
             </div>
          ) : <span className="text-xs text-gray-400">No existing images found.</span>}
          
          {imagePreviews.length > 0 && <span className="text-sm font-semibold text-gray-700 mt-2">New Images to Upload</span>}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
              {imagePreviews.map((url, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border border-emerald-200 h-24">
                  <img src={url} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => removeNewImage(i)} className="p-1.5 bg-red-500 text-white rounded-full"><FiX size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Sustainability Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="p-1.5 bg-lime-100 text-lime-700 rounded-lg">🌱</span>
          Sustainability Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { key: "recyclableMaterial", label: "Recyclable Material" },
            { key: "biodegradable", label: "Biodegradable" },
            { key: "plasticFree", label: "Plastic Free" },
            { key: "crueltyFree", label: "Cruelty Free" },
            { key: "fairTradeCertified", label: "Fair Trade Certified" },
            { key: "renewableEnergyUsed", label: "Renewable Energy Used" },
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${formData.sustainability[item.key] ? "bg-emerald-600" : "bg-gray-200"}`}
                onClick={() => handleSustainabilityChange(item.key, !formData.sustainability[item.key])}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${formData.sustainability[item.key] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Carbon Footprint (kg CO2e)</label>
            <input type="number" step="0.1" value={formData.sustainability.carbonFootprint} onChange={(e) => handleSustainabilityChange("carbonFootprint", Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 bg-gray-50/50" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Energy Efficiency Rating (1-5)</label>
            <input type="number" min="1" max="5" step="1" value={formData.sustainability.energyEfficiencyRating} onChange={(e) => handleSustainabilityChange("energyEfficiencyRating", Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 bg-gray-50/50" />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-semibold text-lg bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md">
          {isSubmitting ? <><FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />Updating...</> : "Update Product"}
        </button>
      </div>
    </form>
  );
}
