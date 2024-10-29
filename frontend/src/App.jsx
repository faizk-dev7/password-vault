import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";

// Pages
import Auth from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { UserProfile } from "./pages/UserProfile";
import { Credentials } from "./pages/Credentials";
import { NotFound } from "./pages/NotFound";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
            <Route index element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users/:id/profile" element={<UserProfile />} />
            <Route path="/users/:id/credentials" element={<Credentials />} />
            <Route path="*" element={<NotFound />} />
        </Route>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
