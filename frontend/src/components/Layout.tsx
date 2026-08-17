import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  LogOut,
} from "lucide-react";

export interface OutletContextType {
  isAdmin: boolean;
}

interface LayoutProps {
  onLogout: () => void;
  isAdmin: boolean;
  role: string | null;
}

function Layout({ onLogout, isAdmin, role }: LayoutProps) {
  const isEmployee = role === "ROLE_EMPLOYEE";

  const navItems = [
    { to: "/home", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/home/equipment", label: "Equipment", icon: Package },
    { to: "/home/customers", label: "Customers", icon: Users },
    { to: "/home/rentals", label: "Rentals", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <div>
            <p className="font-bold text-gray-900 leading-tight">Rental</p>
            <span
              className={`inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                isAdmin ? "bg-black text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {isAdmin ? "Admin" : isEmployee ? "Employee" : "User"}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-2">
          <p className="px-3 text-[11px] text-gray-300 truncate">
            {role ? role.replace("ROLE_", "") : ""}
          </p>
        </div>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet context={{ isAdmin } satisfies OutletContextType} />
      </main>
    </div>
  );
}

export default Layout;
