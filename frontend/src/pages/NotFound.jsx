import { useNavigate } from "react-router-dom";
import { Unauthorised } from "../components/Unauthorised";

export const NotFound = () => {
    const storedToken = localStorage.getItem("token");
    const navigate = useNavigate();
    if (!storedToken) {
        setTimeout(() => {
            navigate("/");
        }, 2000);
    } else {
        setTimeout(() => {
            navigate("/dashboard");
        }, 2000);
    }
    if (!storedToken) return <Unauthorised />;

    return (
        <div>
            <div className="text-center text-4xl">404 Page Not Found</div>
            <div className="text-center text-xl">
                redirecting to Dashboard...
            </div>
        </div>
    );
};
