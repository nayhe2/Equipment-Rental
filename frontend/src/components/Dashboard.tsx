import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Package,
  Users,
  ClipboardList,
  Wallet,
  TrendingUp,
  BarChart3,
  Calendar,
} from "lucide-react";
import { getAvailableEquipment } from "../api/equipment";
import { getAllCustomers } from "../api/customers";
import {
  getAllRentals,
  getTotalEarnings,
  getMonthlyEarnings,
  getYearlyEarnings,
} from "../api/rentals";
import {
  YearlyBarChart,
  MonthlyBarChart,
  TrendLineChart,
} from "./graphs/DashboardGraphs";
import type { OutletContextType } from "./Layout";

interface Stats {
  availableEquipment: number;
  activeRentals: number;
  customers: number;
  earnings: number | null;
}

function Dashboard() {
  const { isAdmin } = useOutletContext<OutletContextType>();

  const [stats, setStats] = useState<Stats | null>(null);
  const [yearly, setYearly] = useState<{ label: string; value: number }[]>([]);
  const [monthly, setMonthly] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [last12, setLast12] = useState<{ label: string; value: number }[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const allYears = useMemo(
    () => Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i),
    [currentYear],
  );

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const [eq, rentals, customers] = await Promise.allSettled([
        getAvailableEquipment(),
        getAllRentals(),
        getAllCustomers(),
      ]);

      const availableEquipment =
        eq.status === "fulfilled" ? eq.value.length : 0;
      const allRentals = rentals.status === "fulfilled" ? rentals.value : [];
      const activeRentals = allRentals.filter((r) => !r.returnDate).length;
      const customersCount =
        customers.status === "fulfilled" ? customers.value.length : 0;

      let earnings: number | null = null;
      if (isAdmin) {
        try {
          earnings = await getTotalEarnings();
        } catch {
          earnings = null;
        }
      }

      setStats({
        availableEquipment,
        activeRentals,
        customers: customersCount,
        earnings,
      });

      // earnings charts
      if (isAdmin) {
        try {
          const y = await getYearlyEarnings();
          const yearMap = new Map(y.map((item) => [item.year, item.amount]));
          const yearlyData = allYears.map((year) => ({
            label: String(year),
            value: yearMap.get(year) || 0,
          }));
          setYearly(yearlyData);
        } catch {
          setYearly(allYears.map((y) => ({ label: String(y), value: 0 })));
        }

        await loadMonthly(selectedYear);
        await loadLast12();
      }

      setIsLoading(false);
    };

    load();
  }, [isAdmin, selectedYear]);

  const loadMonthly = async (year: number) => {
    try {
      const m = await getMonthlyEarnings(year);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthMap = new Map(m.map((item) => [item.month, item.amount]));
      const monthlyData = months.map((name, idx) => ({
        label: name,
        value: monthMap.get(idx + 1) || 0,
      }));
      setMonthly(monthlyData);
    } catch {
      setMonthly(
        Array.from({ length: 12 }, (_, i) => ({
          label: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][
            i
          ],
          value: 0,
        })),
      );
    }
  };

  const loadLast12 = async () => {
    try {
      const now = new Date();
      const currentY = now.getFullYear();
      const currentM = now.getMonth() + 1;

      const [curr, prev] = await Promise.all([
        getMonthlyEarnings(currentY),
        getMonthlyEarnings(currentY - 1),
      ]);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const allMonths: { label: string; value: number }[] = [];
      for (let m = 1; m <= 12; m++) {
        const found = prev.find((x) => x.month === m);
        allMonths.push({
          label: `${monthNames[m - 1]} ${currentY - 1}`,
          value: found ? found.amount : 0,
        });
      }
      for (let m = 1; m <= 12; m++) {
        const found = curr.find((x) => x.month === m);
        allMonths.push({
          label: `${monthNames[m - 1]} ${currentY}`,
          value: found ? found.amount : 0,
        });
      }

      const startIdx = currentM;
      const last12Data = allMonths.slice(startIdx, startIdx + 12);
      setLast12(last12Data);
    } catch {
      setLast12([]);
    }
  };

  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
    await loadMonthly(year);
  };

  const cards = [
    {
      label: "Available Equipment",
      value: stats?.availableEquipment,
      icon: Package,
    },
    {
      label: "Active Rentals",
      value: stats?.activeRentals,
      icon: ClipboardList,
    },
    {
      label: "Customers",
      value: stats?.customers,
      icon: Users,
    },
    ...(isAdmin
      ? [
          {
            label: "Total Earnings",
            value: stats?.earnings,
            icon: Wallet,
            format: (v: number) => `${v.toFixed(2)} zl`,
          },
        ]
      : []),
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
        Dashboard
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Overview of the rental shop&apos;s status
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, format }: any) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 mb-4">
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              {isLoading
                ? "..."
                : value != null
                  ? format
                    ? format(value)
                    : value
                  : "—"}
            </p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* earnings charts */}
      {isAdmin && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Yearly earnings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-900" />
                <h2 className="text-lg font-bold text-gray-900">
                  Earnings by year (2020 – {currentYear})
                </h2>
              </div>
              {isLoading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : yearly.length === 0 ? (
                <p className="text-gray-400 text-sm">No data.</p>
              ) : (
                <YearlyBarChart data={yearly} />
              )}
            </div>

            {/* monthly earnings with year selector */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-900" />
                <h2 className="text-lg font-bold text-gray-900">
                  Earnings by month
                </h2>
              </div>
              {isLoading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : (
                <MonthlyBarChart
                  data={monthly}
                  selectedYear={selectedYear}
                  years={allYears}
                  onYearChange={handleYearChange}
                />
              )}
            </div>
          </div>

          {/* last 12 months trend */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gray-900" />
              <h2 className="text-lg font-bold text-gray-900">
                Last 12 months trend
              </h2>
            </div>
            {isLoading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : last12.length === 0 ? (
              <p className="text-gray-400 text-sm">No data.</p>
            ) : (
              <TrendLineChart data={last12} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
