import UserManagementSection from "../../components/admin/users/UserManagementSection";

/**
 * AdminUsersPage
 *
 * Route: /admin/users
 * Wraps the UserManagementSection component inside the AdminLayout context.
 * Does NOT modify any internal logic or UI of UserManagementSection.
 */
export default function AdminUsersPage() {
    return <UserManagementSection />;
}
