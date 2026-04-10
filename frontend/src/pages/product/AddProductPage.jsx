import AddProductForm from "../../components/products/AddProductForm";

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Add New Product
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Input the details of your new eco-friendly product. Provide comprehensive sustainability data to calculate its true environmental impact score.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6">
          <AddProductForm />
        </div>
      </div>
    </div>
  );
}