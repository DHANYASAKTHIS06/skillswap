import { Outlet } from "react-router";
import { Suspense } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import AIChatbot from "./components/AIChatbot";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-16 pb-20 lg:pb-4">
          <div className="container mx-auto p-4 lg:p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
