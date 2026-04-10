import { useNavigate } from "react-router-dom";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AddProductForm from "../../components/products/AddProductForm";

export default function AddProductPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add New Product"
        subtitle="Input the details of your new eco-friendly product. Provide comprehensive sustainability data to calculate its true environmental impact score."
        showBackButton={true}
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Products", path: "/admin/products" },
          { label: "Add Product" }
        ]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6">
          <AddProductForm />
        </div>
      </div>
    </div>
  );
}