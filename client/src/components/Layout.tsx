import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FileText, Settings as SettingsIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-1 flex-col">
        <header className="border-b bg-white shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">
                システム開発見積もり
              </h1>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <SettingsIcon className="mr-2 h-4 w-4" />
                設定
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
