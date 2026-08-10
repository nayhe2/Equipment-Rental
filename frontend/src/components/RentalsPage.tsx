import React, { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Loader2, Undo2 } from "lucide-react";
import { getAllRentals, createRental, returnRental } from "../api/rentals";
import { getAllCustomers } from "../api/customers";
import { getAvailableEquipment } from "../api/equipment";
import type { Customer, Equipment, Rental } from "../api/types";
import type { OutletContextType } from "./Layout";

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

function RentalsPage() {
  const { isAdmin } = useOutletContext<OutletContextType>();

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [dueDate, setDueDate] = useState(""); // wartość z <input type="datetime-local">, opcjonalna
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRentals(await getAllRentals());
    } catch {
      setError("Nie udało się pobrać listy wypożyczeń.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
      setFormError("Nie udało się pobrać klientów lub dostępnego sprzętu.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customerId || !equipmentId) {
      setFormError("Wybierz klienta i sprzęt.");
      return;
    }
    setFormError(null);
    setIsSaving(true);
    try {
      await createRental({
        customerId: Number(customerId),
        equipmentId: Number(equipmentId),
        // dueDate jest opcjonalne — wysyłany tylko jeśli admin je ustawił
        dueDate: dueDate ? dueDate : null,
      });
      setCustomerId("");
      setEquipmentId("");
      setDueDate("");
      setShowForm(false);
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setFormError(
        typeof msg === "string" ? msg : "Nie udało się utworzyć wypożyczenia.",
      );
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
      setError("Nie udało się zarejestrować zwrotu.");
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Wypożyczenia
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isAdmin
              ? "Historia i aktywne wypożyczenia sprzętu"
              : "Podgląd historii i aktywnych wypożyczeń"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openForm}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Nowe wypożyczenie
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Klient
            </label>
            <select
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">Wybierz klienta…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Sprzęt (dostępny)
            </label>
            <select
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
            >
              <option value="">Wybierz sprzęt…</option>
              {availableEquipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} — {Number(eq.pricePerHour).toFixed(2)} zł/godz.
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[200px]">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Termin zwrotu (opcjonalnie)
            </label>
            <input
              type="datetime-local"
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Wypożycz
          </button>
          {formError && (
            <p className="w-full text-sm text-red-600">{formError}</p>
          )}
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="p-8 text-center text-gray-400">Ładowanie…</p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : rentals.length === 0 ? (
          <p className="p-8 text-center text-gray-400">
            Brak wypożyczeń do wyświetlenia.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <th className="px-6 py-3">Klient</th>
                <th className="px-6 py-3">Sprzęt</th>
                <th className="px-6 py-3">Wypożyczono</th>
                <th className="px-6 py-3">Termin zwrotu</th>
                <th className="px-6 py-3">Zwrócono</th>
                <th className="px-6 py-3">Koszt</th>
                {isAdmin && <th className="px-6 py-3" />}
              </tr>
            </thead>
            <tbody>
              {rentals.map((r) => {
                const overdue = isOverdue(r);
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
                        <span className="ml-1.5 text-xs">
                          (przeterminowane)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(r.returnDate)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {r.totalCost != null
                        ? `${Number(r.totalCost).toFixed(2)} zł`
                        : "—"}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        {!r.returnDate && (
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
                            Zwrot
                          </button>
                        )}
                      </td>
                    )}
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
