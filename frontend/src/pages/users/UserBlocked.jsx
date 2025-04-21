import { useNavigate } from "react-router-dom";

const UserBlocked = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Account Blocked</h2>
                <p className="text-gray-700 mb-4">
                    Your NGO account has been blocked due to policy violations or other issues.
                    If you believe this is a mistake, please contact us for further assistance.
                </p>
                <p className="text-gray-800 font-semibold">Email Support:</p>
                <p className="text-blue-600 font-medium mb-6">support@ngo-platform.com</p>

                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                    Return to Homepage
                </button>
            </div>
        </div>
    );
};

export default UserBlocked;
