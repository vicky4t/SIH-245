import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AppRoutes } from "./routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <NotificationProvider>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                className: "bg-white border-slate-200 text-slate-900 shadow-lg",
                duration: 3500,
              }}
            />
          </NotificationProvider>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
