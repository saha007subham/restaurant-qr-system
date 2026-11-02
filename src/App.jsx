import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerProvider, useCustomer } from './context/CustomerContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { StaffAuthProvider } from './context/StaffAuthContext';
import { DeveloperAuthProvider } from './context/DeveloperAuthContext';
import { RestaurantProvider } from './context/RestaurantContext';

// Layouts
import { CustomerLayout } from './components/layout/CustomerLayout';
import { StaffLayout } from './components/layout/StaffLayout';
import { DeveloperLayout } from './components/layout/DeveloperLayout';

// Customer Pages
import { TableRegisterPage } from './pages/customer/TableRegisterPage';
import { WelcomePage } from './pages/customer/WelcomePage';
import { MenuPage } from './pages/customer/MenuPage';
import { CartPage } from './pages/customer/CartPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { GamePage } from './pages/customer/GamePage';

// Staff Pages & Guards (Stage 2)
import { StaffLoginPage } from './pages/staff/StaffLoginPage';
import { StaffOrdersPage } from './pages/staff/StaffOrdersPage';
import { StaffHistoryPage } from './pages/staff/StaffHistoryPage';
import { StaffStockPage } from './pages/staff/StaffStockPage';
import { StaffRouteGuard } from './components/staff/StaffRouteGuard';

// Developer Pages & Guards (Stage 3)
import { DeveloperLoginPage } from './pages/developer/DeveloperLoginPage';
import { DeveloperDashboardPage } from './pages/developer/DeveloperDashboardPage';
import { DeveloperMenuPage } from './pages/developer/DeveloperMenuPage';
import { DeveloperTablesPage } from './pages/developer/DeveloperTablesPage';
import { DeveloperQRCodesPage } from './pages/developer/DeveloperQRCodesPage';
import { DeveloperStaffPage } from './pages/developer/DeveloperStaffPage';
import { DeveloperCustomersPage } from './pages/developer/DeveloperCustomersPage';
import { DeveloperSettingsPage } from './pages/developer/DeveloperSettingsPage';
import { DeveloperRouteGuard } from './components/developer/DeveloperRouteGuard';

// Root redirect handler
const RootRedirect = () => {
  const { isRegistered, table } = useCustomer();
  if (isRegistered) {
    return <Navigate to="/welcome" replace />;
  }
  const defaultToken = table?.qrToken || 'tbl-patio-04';
  return <Navigate to={`/t/${defaultToken}`} replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <DeveloperAuthProvider>
        <StaffAuthProvider>
          <RestaurantProvider>
            <CustomerProvider>
              <CartProvider>
                <OrderProvider>
                  <Routes>
                    {/* Root redirect */}
                    <Route path="/" element={<RootRedirect />} />

                    {/* Table QR Registration Screen */}
                    <Route path="/t/:qrToken" element={<TableRegisterPage />} />

                    {/* Customer Flow Routes */}
                    <Route element={<CustomerLayout />}>
                      <Route path="/welcome" element={<WelcomePage />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/order-success" element={<OrderSuccessPage />} />
                      <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
                      <Route path="/game" element={<GamePage />} />
                    </Route>

                    {/* Staff Login (Public within Staff zone) */}
                    <Route path="/staff/login" element={<StaffLoginPage />} />

                    {/* Protected Staff Operations Dashboard (Stage 2) */}
                    <Route element={<StaffRouteGuard />}>
                      <Route element={<StaffLayout />}>
                        <Route path="/staff" element={<Navigate to="/staff/orders" replace />} />
                        <Route path="/staff/dashboard" element={<StaffOrdersPage />} />
                        <Route path="/staff/orders" element={<StaffOrdersPage />} />
                        <Route path="/staff/stock" element={<StaffStockPage />} />
                        <Route path="/staff/history" element={<StaffHistoryPage />} />
                      </Route>
                    </Route>

                    {/* Developer Login (Public within Developer zone) */}
                    <Route path="/developer/login" element={<DeveloperLoginPage />} />

                    {/* Protected Developer Suite (Stage 3) */}
                    <Route element={<DeveloperRouteGuard />}>
                      <Route element={<DeveloperLayout />}>
                        <Route path="/developer" element={<Navigate to="/developer/dashboard" replace />} />
                        <Route path="/developer/dashboard" element={<DeveloperDashboardPage />} />
                        <Route path="/developer/menu" element={<DeveloperMenuPage />} />
                        <Route path="/developer/tables" element={<DeveloperTablesPage />} />
                        <Route path="/developer/qr-codes" element={<DeveloperQRCodesPage />} />
                        <Route path="/developer/staff" element={<DeveloperStaffPage />} />
                        <Route path="/developer/customers" element={<DeveloperCustomersPage />} />
                        <Route path="/developer/settings" element={<DeveloperSettingsPage />} />
                      </Route>
                    </Route>

                    {/* Fallback to root */}
                    <Route path="*" element={<RootRedirect />} />
                  </Routes>
                </OrderProvider>
              </CartProvider>
            </CustomerProvider>
          </RestaurantProvider>
        </StaffAuthProvider>
      </DeveloperAuthProvider>
    </BrowserRouter>
  );
}
