import { useNavigate } from "react-router-dom";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import EditProductForm from "../../components/products/EditProductForm";

export default function EditProductPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Sustainable Product"
        subtitle="Update the product details and recalculate its sustainability score."
        showBackButton={true}
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Products", path: "/admin/products" },
          { label: "Edit Product" }
        ]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6">
          <EditProductForm />
        </div>
      </div>
    </div>
  );
}
