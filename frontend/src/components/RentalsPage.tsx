import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  Loader2,
  Undo2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { getAllRentals, createRental, returnRental } from "../api/rentals";
import { getAllCustomers } from "../api/customers";
import { getAvailableEquipment } from "../api/equipment";
import type { Customer, Equipment, Rental } from "../api/types";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pl-PL");
}

function isOverdue(rental: Rental) {
  return (
    !rental.returnDate &&
    !!rental.dueDate &&
    new Date(rental.dueDate) < new Date()
  );
}

function calculateRunningCost(rental: Rental): number {
  const start = new Date(rental.startDate).getTime();
  const now = Date.now();
  let hours = Math.ceil((now - start) / (1000 * 60 * 60));
  if (hours < 1) hours = 1;
  return hours * rental.equipment.pricePerHour;
}

/* ================================================================
   SORTING
   ================================================================ */

type SortColumn =
  | "customer"
  | "equipment"
  | "startDate"
  | "dueDate"
  | "returnDate"
  | "cost";
type SortDirection = "asc" | "desc";

function getSortValue(rental: Rental, column: SortColumn): string | number {
  switch (column) {
    case "customer":
      return `${rental.customer.firstName} ${rental.customer.lastName}`.toLowerCase();
    case "equipment":
      return rental.equipment.name.toLowerCase();
    case "startDate":
      return new Date(rental.startDate).getTime();
    case "dueDate":
      return rental.dueDate ? new Date(rental.dueDate).getTime() : 0;
    case "returnDate":
      return rental.returnDate ? new Date(rental.returnDate).getTime() : 0;
    case "cost":
      if (!rental.returnDate) {
        return calculateRunningCost(rental);
      }
      return rental.totalCost ?? 0;
    default:
      return 0;
  }
}

function sortRentals(
  rentals: Rental[],
  column: SortColumn,
  direction: SortDirection,
): Rental[] {
  return [...rentals].sort((a, b) => {
    const aVal = getSortValue(a, column);
    const bVal = getSortValue(b, column);
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<number | null>(null);

  // search + sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("startDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // load rentals
  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRentals(await getAllRentals());
    } catch {
      setError("Failed to load rentals.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => load(), 30000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  // filter + sort
  const filteredRentals = useMemo(() => {
    let result = rentals;

    // filter by search query (name or ID card)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => {
        const fullName =
          `${r.customer.firstName} ${r.customer.lastName}`.toLowerCase();
        const idCard = r.customer.idCardNumber.toLowerCase();
        return fullName.includes(q) || idCard.includes(q);
      });
    }

    // sort
    return sortRentals(result, sortColumn, sortDirection);
  }, [rentals, searchQuery, sortColumn, sortDirection]);

  // toggle sort on column click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // sort icon helper
  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column)
      return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-black" />
    ) : (
      <ArrowDown className="w-3 h-3 text-black" />
    );
  };

  const HeaderCell = ({
    column,
    label,
    className = "",
  }: {
    column: SortColumn;
    label: string;
    className?: string;
  }) => (
    <th
      className={`px-6 py-3 cursor-pointer select-none hover:bg-gray-50 transition-colors ${className}`}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <SortIcon column={column} />
      </div>
    </th>
  );

  const openForm = async () => {
    setShowForm(true);
    setFormError(null);
    try {
      const [c, e] = await Promise.all([
        getAllCustomers(),
        getAvailableEquipment(),
      ]);
      setCustomers(c);
      setAvailableEquipment(e);
    } catch {
      setFormError("Failed to load form data.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !equipmentId) {
      setFormError("Select customer and equipment.");
      return;
    }
    setFormError(null);
    setIsSaving(true);
    try {
      await createRental({
        customerId: Number(customerId),
        equipmentId: Number(equipmentId),
        dueDate: dueDate || null,
      });
      setCustomerId("");
      setEquipmentId("");
      setDueDate("");
      setShowForm(false);
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setFormError(typeof msg === "string" ? msg : "Failed to create rental.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReturn = async (rentalId: number) => {
    setReturningId(rentalId);
    try {
      await returnRental(rentalId);
      load();
    } catch {
      setError("Failed to register return.");
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rentals</h1>
          <p className="text-sm text-gray-400 mt-1">
            History and active rentals
          </p>
        </div>
        <button
          onClick={openForm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          New Rental
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name or ID card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>
      </div>

      {/* rental form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Customer
            </label>
            <select
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Select...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} {c.idCardNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Equipment
            </label>
            <select
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
            >
              <option value="">Select...</option>
              {availableEquipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} — {Number(eq.pricePerHour).toFixed(2)} zl/h
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[200px]">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Return Date (Optional)
            </label>
            <input
              type="datetime-local"
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Rent
          </button>
          {formError && (
            <p className="w-full text-sm text-red-600">{formError}</p>
          )}
        </form>
      )}

      {/* tabela */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="p-8 text-center text-gray-400">Loading...</p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : filteredRentals.length === 0 ? (
          <p className="p-8 text-center text-gray-400">
            {searchQuery ? "No rentals match your search." : "No rentals."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <HeaderCell column="customer" label="Customer" />
                <HeaderCell column="equipment" label="Equipment" />
                <HeaderCell column="startDate" label="Rented On" />
                <HeaderCell column="dueDate" label="Return Date" />
                <HeaderCell column="returnDate" label="Returned" />
                <HeaderCell column="cost" label="Cost" />
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredRentals.map((r) => {
                const overdue = isOverdue(r);
                const isActive = !r.returnDate;
                const runningCost = isActive ? calculateRunningCost(r) : null;
                return (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {r.customer.firstName} {r.customer.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {r.equipment.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(r.startDate)}
                    </td>
                    <td
                      className={`px-6 py-4 ${overdue ? "text-red-600 font-medium" : "text-gray-500"}`}
                    >
                      {formatDate(r.dueDate)}
                      {overdue && (
                        <span className="ml-1.5 text-xs">(overdue)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(r.returnDate)}
                    </td>
                    <td className="px-6 py-4">
                      {isActive && runningCost !== null ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {runningCost.toFixed(2)} zl
                          </span>
                          <span className="text-[11px] text-gray-400">
                            current amount
                          </span>
                        </div>
                      ) : r.totalCost != null ? (
                        `${Number(r.totalCost).toFixed(2)} zl`
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isActive && (
                        <button
                          onClick={() => handleReturn(r.id)}
                          disabled={returningId === r.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold disabled:opacity-50"
                        >
                          {returningId === r.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Undo2 className="w-3.5 h-3.5" />
                          )}
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RentalsPage;
