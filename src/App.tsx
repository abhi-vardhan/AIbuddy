
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { IntlProvider, load } from "@progress/kendo-react-intl";

// Import Kendo styles
import "@progress/kendo-theme-default/dist/all.css";

// Load Kendo Internationalization
load(
  // You can load locales here
  // For example: import enMessages from './locales/en.json'
  {}
);

// Create a new QueryClient instance inside the component
const App = () => {
  // Create QueryClient inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
};

export default App;
