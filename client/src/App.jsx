import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import useAuth from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  const isAuthenticated = () => !!localStorage.getItem("token");

  const PageLayout = () => {
    useAuth();
    return <Outlet />;
  };

  const PageRoutes = createBrowserRouter([
    {
      path: "/",
      element: <PageLayout />,
      children: [
        {
          path: "/",
          index: true,
          element: isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />,
        },
        {
          path: "/:userId",
          element: <Dashboard />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
      ],
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <main className="h-full">
      <Toaster />
      <RouterProvider router={PageRoutes} />
    </main>
  );
}

export default App;
