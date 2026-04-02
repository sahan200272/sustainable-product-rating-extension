import { useState } from "react";
import { addProduct } from "../../services/productServices";
import { FiUploadCloud, FiX, FiCheck, FiLoader } from "react-icons/fi";

export default function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const removeImage = (index) => {
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

      // Send sustainability as a JSON string. The backend will parse it.
      submitData.append(
        "sustainability",
        JSON.stringify(formData.sustainability)
      );

      const response = await addProduct(submitData);
      setSuccessMessage("Product added successfully!");
      // Optionally reset form here
    } catch (error) {
      console.error("Error submitting:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to add product. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleClasses = (checked) =>
    `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
      checked ? "bg-emerald-600" : "bg-gray-200"
    }`;

  const togglePinClasses = (checked) =>
    `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
      checked ? "translate-x-5" : "translate-x-0"
    }`;

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
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow text-gray-900 bg-gray-50/50"
            placeholder="e.g. SolarCharg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            required
            value={formData.brand}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow text-gray-900 bg-gray-50/50"
            placeholder="e.g. SunTech"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category"
            required
            value={formData.category}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow text-gray-900 bg-gray-50/50"
            placeholder="e.g. Electronics"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            required
            value={formData.description}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow text-gray-900 bg-gray-50/50 resize-none"
            placeholder="Describe the product and its primary purpose..."
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Image Upload Area */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Product Images
        </label>
        <div className="flex justify-center rounded-xl border border-dashed border-gray-300 px-6 py-8 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="text-center">
            <FiUploadCloud className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
              <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500">
                <span>Upload a file</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-500">PNG, JPG up to 5MB</p>
          </div>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {imagePreviews.map((url, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <img
                  src={url}
                  alt={`Preview ${i}`}
                  className="h-24 w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Sustainability Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="p-1.5 bg-lime-100 text-lime-700 rounded-lg">🌱</span>
          Sustainability Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {/* Toggles */}
          {[
            { key: "recyclableMaterial", label: "Recyclable Material" },
            { key: "biodegradable", label: "Biodegradable" },
            { key: "plasticFree", label: "Plastic Free" },
            { key: "crueltyFree", label: "Cruelty Free" },
            { key: "fairTradeCertified", label: "Fair Trade Certified" },
            { key: "renewableEnergyUsed", label: "Renewable Energy Used" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="flex flex-col">
                <span className="text-sm font-medium leading-6 text-gray-900">
                  {item.label}
                </span>
              </span>
              <button
                type="button"
                className={toggleClasses(formData.sustainability[item.key])}
                onClick={() =>
                  handleSustainabilityChange(
                    item.key,
                    !formData.sustainability[item.key]
                  )
                }
              >
                <span className={togglePinClasses(formData.sustainability[item.key])} />
              </button>
            </div>
          ))}

          {/* Number Inputs */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Carbon Footprint (kg CO2e)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.sustainability.carbonFootprint}
              onChange={(e) =>
                handleSustainabilityChange(
                  "carbonFootprint",
                  Number(e.target.value)
                )
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Energy Efficiency Rating (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              step="1"
              value={formData.sustainability.energyEfficiencyRating}
              onChange={(e) =>
                handleSustainabilityChange(
                  "energyEfficiencyRating",
                  Number(e.target.value)
                )
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-semibold text-lg bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </button>
      </div>
    </form>
  );
}