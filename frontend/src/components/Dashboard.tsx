import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Package, Users, ClipboardList, Wallet } from "lucide-react";
import { getAvailableEquipment } from "../api/equipment";
import { getAllCustomers } from "../api/customers";
import { getAllRentals, getTotalEarnings } from "../api/rentals";
import type { OutletContextType } from "./Layout";

interface Stats {
  availableEquipment: number;
  activeRentals: number;
  customers: number | null;
  earnings: number | null;
}

function Dashboard() {
  const { isAdmin } = useOutletContext<OutletContextType>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      // /api/customers i /api/rental/earnings są zablokowane dla nie-admina (403),
      // więc w ogóle ich nie odpytujemy, jeśli użytkownik nie jest adminem.
      const [equipmentResult, rentalsResult, customersResult, earningsResult] =
        await Promise.allSettled([
          getAvailableEquipment(),
          getAllRentals(),
          isAdmin ? getAllCustomers() : Promise.reject("not-admin"),
          isAdmin ? getTotalEarnings() : Promise.reject("not-admin"),
        ]);

      setStats({
        availableEquipment:
          equipmentResult.status === "fulfilled"
            ? equipmentResult.value.length
            : 0,
        activeRentals:
          rentalsResult.status === "fulfilled"
            ? rentalsResult.value.filter((r) => !r.returnDate).length
            : 0,
        customers:
          customersResult.status === "fulfilled"
            ? customersResult.value.length
            : null,
        earnings:
          earningsResult.status === "fulfilled" ? earningsResult.value : null,
      });
      setIsLoading(false);
    };

    loadStats();
  }, [isAdmin]);

  const baseCards = [
    {
      label: "Dostępny sprzęt",
      value: stats?.availableEquipment,
      icon: Package,
    },
    {
      label: "Aktywne wypożyczenia",
      value: stats?.activeRentals,
      icon: ClipboardList,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
        Panel
      </h1>
      <p className="text-sm text-gray-400 mb-8">Przegląd stanu wypożyczalni</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {baseCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 mb-4">
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              {isLoading ? "…" : value}
            </p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </div>
        ))}

        {isAdmin && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {isLoading ? "…" : (stats?.customers ?? "—")}
              </p>
              <p className="text-sm text-gray-400 mt-1">Klienci</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ring-1 ring-black/5">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white mb-4">
                <Wallet className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {isLoading
                  ? "…"
                  : stats?.earnings != null
                    ? `${stats.earnings.toFixed(2)} zł`
                    : "—"}
              </p>
              <p className="text-sm text-gray-400 mt-1">Przychód łącznie</p>
            </div>
          </>
        )}
      </div>

      {!isAdmin && (
        <p className="text-xs text-gray-400 mt-4">
          Lista klientów i zestawienie przychodów są widoczne tylko dla kont
          administratora.
        </p>
      )}
    </div>
  );
}

export default Dashboard;
