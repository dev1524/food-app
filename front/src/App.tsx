import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import SignUp from "./UI/auth/Signup";
import MainLayput from "./UI/Main/MainLayput";
import Login from "./UI/auth/Login";
import UserProfile from "./UI/pages/user/UserProfile";
import ForgotPassword from "./UI/auth/ForgetPassword";
import HeroSection from "./UI/pages/HeroSection";
import SearchPage from "./UI/pages/SearchPage";
import ViewMenu from "./UI/pages/ViewMenu";
import Cart from "./UI/pages/Cart";
import AddResturents from "./UI/admin/AddResturents";
import AddMenu from "./UI/admin/AddMenu";
import AdminOrder from "./UI/admin/AdminOrder";
import UserOrderPage from "./UI/pages/user/UserOrderPage";
import { UserStore } from "./store/UserStroe";
import { useEffect } from "react";
import { useThemeStore } from "./store/UseThemeStore";
import CaptainSignUp from "./UI/auth/admin/CaptainSignUp";
import CaptainLogin from "./UI/auth/admin/CaptainLogin";
import Auth from "./UI/pages/Auth";

import Loading from "./UI/pages/utils/Loading";
import Dashboard from "./UI/Layout/Dashboard";
import RestaurantTable from "./UI/admin/Data/AllRestaurents";
import AllUsers from "./UI/admin/Data/AllUsers";

function App() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  // Protected Routes

  const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const { isAuthentiacte } = UserStore();
    if (!isAuthentiacte) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const AuthRoutes = ({ children }: { children: React.ReactNode }) => {
    const { isAuthentiacte } = UserStore();
    if (isAuthentiacte) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // admin route
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAdmin, user } = UserStore();
    if (!isAdmin || !user?.isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayput />,
      children: [
        { path: "/", element: <HeroSection /> },
        // user-page

        {
          path: "/profile",
          element: (
            <ProtectedRoutes>
              <UserProfile />
            </ProtectedRoutes>
          ),
        },

        // auth
        {
          path: "/login",
          element: (
            <AuthRoutes>
              <Login />
            </AuthRoutes>
          ),
        },
        {
          path: "/signup",

          element: (
            <AuthRoutes>
              <SignUp />
            </AuthRoutes>
          ),
        },

        {
          path: "/forget-password",
          element: (
            <AuthRoutes>
              <ForgotPassword />
            </AuthRoutes>
          ),
        },
        {
          path: "/auth",
          element: (
            <AuthRoutes>
              <Auth />
            </AuthRoutes>
          ),
        },
        {
          path: "/restaurant-signup",
          element: (
            <AuthRoutes>
              <CaptainSignUp />
            </AuthRoutes>
          ),
        },
        {
          path: "/restaurant-login",
          element: (
            <AuthRoutes>
              <CaptainLogin />
            </AuthRoutes>
          ),
        },
        {
          path: "/order-status",
          element: (
            <ProtectedRoutes>
              <UserOrderPage />
            </ProtectedRoutes>
          ),
        },

        // main pages
        { path: "/search/:text", element: <SearchPage /> },
        { path: "/resturent-menu/:id", element: <ViewMenu /> },
        {
          path: "/cart-page",
          element: (
            <ProtectedRoutes>
              <Cart />
            </ProtectedRoutes>
          ),
        },

        // Admin
        {
          path: "/admin",
          element: (
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          ),
        },
        {
          path: "/admin/resturent/:id",
          element: (
            <AdminRoute>
              <RestaurantTable />
            </AdminRoute>
          ),
        },

        {
          path: "/admin",
          element: (
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          ),
          children: [
            { index: true, element: <h1>Welcome Dashboard</h1> }, // default content
            { path: "users", element: <AllUsers /> },
            { path: "resturent/:id", element: <RestaurantTable /> }, // ✅ now param works
            { path: "menus", element: <h1>Menus page</h1> },
            { path: "orders", element: <h1>Orders page</h1> },
          ],
        },

        {
          path: "/admin/add-resturents",
          element: (
            <AdminRoute>
              <AddResturents />
            </AdminRoute>
          ),
        },
        {
          path: "/admin/add-menu",
          element: (
            <AdminRoute>
              <AddMenu />
            </AdminRoute>
          ),
        },
        {
          path: "/admin/order",
          element: (
            <AdminRoute>
              <AdminOrder />
            </AdminRoute>
          ),
        },
      ],
    },
  ]);
  const { CheckingAuth, isCheckAuth } = UserStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    CheckingAuth(); // 🔐 Step 2: Check auth
    initializeTheme(); // 🎨 Step 3: Init theme
  }, [CheckingAuth, initializeTheme, API_URL]);

  if (isCheckAuth) {
    return <Loading />;
  }

  return (
    <>
      <main>
        <RouterProvider router={appRouter}></RouterProvider>
      </main>
    </>
  );
}

export default App;
