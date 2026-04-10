import ReviewManagementSection from "../../components/admin/reviews/ReviewManagementSection";

/**
 * AdminReviewsPage
 *
 * Route: /admin/reviews
 * Wraps the ReviewManagementSection component inside the AdminLayout context.
 * Does NOT modify any internal logic or UI of ReviewManagementSection.
 */
export default function AdminReviewsPage() {
    return <ReviewManagementSection />;
}
