import { ChevronLeft, ChevronsLeft, ChevronsRight, FileText } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [location] = useLocation();
  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    return location === path || (path === "/" && location.startsWith("/estimate"));
  };

  return (
    <div
      className={`relative h-screen bg-white shadow-md transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {isOpen && <h2 className="text-lg font-bold">メニュー</h2>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </Button>
      </div>
      <nav className="p-4">
        <ul>
          <li>
            <Link
              href="/"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100 ${
                isActive("/") ? "bg-slate-100 font-semibold" : ""
              }`}
            >
              <FileText className="h-5 w-5" />
              {isOpen && <span>見積もり</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
