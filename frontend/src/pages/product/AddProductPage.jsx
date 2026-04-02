import AddProductForm from "../../components/products/AddProductForm";
import { FiBox } from "react-icons/fi";

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4 shadow-sm">
            <FiBox className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Add New Sustainable Product
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Input the details of your new eco-friendly product. Provide comprehensive sustainability data to calculate its true environmental impact score.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/50">
          <div className="px-6 py-8 sm:p-10">
            <AddProductForm />
          </div>
        </div>
      </div>
    </div>
  );
}