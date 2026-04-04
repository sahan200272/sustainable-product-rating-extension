import { Link } from "react-router-dom";
import { FiArrowLeft, FiTool } from "react-icons/fi";

export default function AdminModerationPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <FiTool className="w-10 h-10 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Moderation Feature Paused</h1>
            <p className="text-gray-500 max-w-md mb-8">
                The content for this page has been temporarily removed while we restructure the Admin interface to prioritize core dynamic product management.
            </p>
            <Link 
                to="/admin/dashboard" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
            >
                <FiArrowLeft /> Back to Dashboard
            </Link>
        </div>
    );
}
