import EditProductForm from "../../components/products/EditProductForm";
import { FiEdit3 } from "react-icons/fi";

export default function EditProductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4 shadow-sm">
            <FiEdit3 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Edit Sustainable Product
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Update the product details and recalculate its sustainability score.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/50">
          <div className="px-6 py-8 sm:p-10">
            <EditProductForm />
          </div>
        </div>
      </div>
    </div>
  );
}
