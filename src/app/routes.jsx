import {
  Link,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ReceiptList from "../pages/ReceiptList";
import ReceiptNew from "../pages/ReceiptNew";
import Contact from "../pages/Contact";
import MainLayout from "../components/layout/MainLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import SignIn from "../pages/SignIn";
import InvoiceList from "../pages/invoice/list";
import InvoiceNew from "../pages/invoice/new";
import InvoiceEdit from "../pages/invoice/edit";
import SignUp from "../pages/SignUp";
import ProtectedRoute from "../components/ProtectedRoute";
import UnauthorizedPage from "../pages/Unauthorized";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/404";

export const appRoute = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<MainLayout />}>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receipt"
            element={
              <ProtectedRoute>
                <ReceiptList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receipt/new"
            element={
              <ProtectedRoute>
                <ReceiptNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice"
            element={
              <ProtectedRoute>
                <InvoiceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice/new"
            element={
              <ProtectedRoute>
                <InvoiceNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoice/edit/:id"
            element={
              <ProtectedRoute>
                <InvoiceEdit />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Route>
    </>
  )
);
