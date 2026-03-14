import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { MainLayout } from "./MainLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { VALID_ROUTES } from "../../shared/ValidRoutes.js";

function App() {
    const [authToken, setAuthToken] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (token) => {
        setAuthToken(token);
        navigate(VALID_ROUTES.HOME);
    };

    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route
                    path={VALID_ROUTES.HOME}
                    element={
                        <ProtectedRoute authToken={authToken}>
                            <AllImages authToken={authToken} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={VALID_ROUTES.UPLOAD}
                    element={
                        <ProtectedRoute authToken={authToken}>
                            <UploadPage authToken={authToken} />
                        </ProtectedRoute>
                    }
                />
                <Route path={VALID_ROUTES.LOGIN} element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path={VALID_ROUTES.REGISTER} element={<LoginPage isRegistering={true} onLoginSuccess={handleLoginSuccess} />} />
                <Route
                    path={VALID_ROUTES.IMAGE_DETAILS}
                    element={
                        <ProtectedRoute authToken={authToken}>
                            <ImageDetails authToken={authToken} />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
