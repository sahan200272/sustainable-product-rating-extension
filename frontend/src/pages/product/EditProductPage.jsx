import EditProductForm from "../../components/products/EditProductForm";

export default function EditProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Edit Sustainable Product
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update the product details and recalculate its sustainability score.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6">
          <EditProductForm />
        </div>
      </div>
    </div>
  );
}
