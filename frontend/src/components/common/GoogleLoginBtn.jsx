import { GoogleLogin } from "@react-oauth/google";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { googleLogin } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";

export default function GoogleLoginBtn() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const isRequestInFlight = useRef(false);

    const handleSuccess = async (credentialResponse) => {
        if (isRequestInFlight.current) {
            return;
        }

        try {
            isRequestInFlight.current = true;

            // Extracts the ID Token
            const credential = credentialResponse.credential;

            if (!credential) {
                toast.error("Google did not return a valid credential. Please try again.");
                return;
            }
            
            // Calls our backend API endpoint
            const response = await googleLogin(credential);
            
            // Assume the backend responds with { user, token }
            login(response.user, response.token);
            toast.success("Successfully logged in with Google!");
            
            // Redirect based on user role (assuming same rules apply)
            navigate(response.user.role === "Admin" ? "/admin/dashboard" : "/");

        } catch (error) {
            console.error("Google login backend verification failed:", error);
            
            const errorMessage = error?.response?.data?.error 
                || error?.response?.data?.message 
                || "Google login failed. Please try again later.";
                
            toast.error(errorMessage);
        } finally {
            isRequestInFlight.current = false;
        }
    };

    const handleError = () => {
        toast.error("Google authentication process failed. Please try tracking your connection or try again.");
    };

    return (
        <div className="flex justify-center w-full my-2">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap={false}
                theme="outline"
                shape="rectangular"
            />
        </div>
    );
}
