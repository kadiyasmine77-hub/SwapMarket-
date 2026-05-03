import { createBrowserRouter } from "react-router";
import { UserLayout } from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { UserDashboard } from "./pages/user/UserDashboard";
import { PublishItem } from "./pages/user/PublishItem";
import { SearchItems } from "./pages/user/SearchItems";
import { ItemDetail } from "./pages/user/ItemDetail";
import { UserProfile } from "./pages/user/UserProfile";
import { EditItem } from "./pages/user/EditItem";
import { Messages } from "./pages/user/Messages";
import { Favorites } from "./pages/user/Favorites";
import { ExchangeHistory } from "./pages/user/ExchangeHistory";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ManageUsers } from "./pages/admin/ManageUsers";
import { ManageItems } from "./pages/admin/ManageItems";
import { ManageCategories } from "./pages/admin/ManageCategories";
import { Moderation } from "./pages/admin/Moderation";
import { RolesPermissions } from "./pages/admin/RolesPermissions";
import { ActivityLogs } from "./pages/admin/ActivityLogs";
import { PlatformSettings } from "./pages/admin/PlatformSettings";
import { NotFound } from "./pages/NotFound";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "publish", element: <PublishItem /> },
      { path: "search", element: <SearchItems /> },
      { path: "item/:id", element: <ItemDetail /> },
      { path: "item/edit/:id", element: <EditItem /> },
      { path: "profile", element: <UserProfile /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "messages", element: <Messages /> },
      { path: "favorites", element: <Favorites /> },
      { path: "history", element: <ExchangeHistory /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <ManageUsers /> },
      { path: "items", element: <ManageItems /> },
      { path: "categories", element: <ManageCategories /> },
      { path: "moderation", element: <Moderation /> },
      { path: "roles", element: <RolesPermissions /> },
      { path: "logs", element: <ActivityLogs /> },
      { path: "settings", element: <PlatformSettings /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
