import React, { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  getEquipmentPage,
  createEquipment,
  deleteEquipment,
} from "../api/equipment";
import type { Equipment } from "../api/types";
import type { OutletContextType } from "./Layout";

const PAGE_SIZE = 10;

function EquipmentPage() {
  const { isAdmin } = useOutletContext<OutletContextType>();

  const [items, setItems] = useState<Equipment[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadPage = useCallback(async (pageToLoad: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEquipmentPage(pageToLoad, PAGE_SIZE);
      setItems(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (err) {
      setError("Nie udało się pobrać listy sprzętu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const parsedPrice = Number(pricePerHour.replace(",", "."));
    if (!name.trim()) {
      setFormError("Podaj nazwę sprzętu.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setFormError("Cena za godzinę musi być liczbą większą od zera.");
      return;
    }

    setIsSaving(true);
    try {
      await createEquipment({ name: name.trim(), pricePerHour: parsedPrice });
      setName("");
      setPricePerHour("");
      setShowForm(false);
      loadPage(0);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setFormError(
        typeof msg === "string"
          ? msg
          : "Nie udało się dodać sprzętu. Sprawdź dane.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: Equipment) => {
    if (!window.confirm(`Usunąć „${item.name}” z listy sprzętu?`)) return;
    setDeletingId(item.id);
    setError(null);
    try {
      await deleteEquipment(item.id);
      loadPage(page);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Nie udało się usunąć sprzętu.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sprzęt
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isAdmin
              ? "Zarządzaj sprzętem w wypożyczalni"
              : "Podgląd sprzętu w wypożyczalni"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Dodaj sprzęt
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
              Nazwa
            </label>
            <input
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Wiertarka udarowa"
            />
          </div>
          <div className="w-40">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Cena / godz.
            </label>
            <input
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              placeholder="np. 15.00"
              inputMode="decimal"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Zapisz
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
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-gray-400">
            Brak sprzętu do wyświetlenia.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <th className="px-6 py-3">Nazwa</th>
                <th className="px-6 py-3">Cena / godz.</th>
                <th className="px-6 py-3">Status</th>
                {isAdmin && <th className="px-6 py-3" />}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {Number(item.pricePerHour).toFixed(2)} zł
                  </td>
                  <td className="px-6 py-4">
                    {item.isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Dostępny
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-gray-400 font-medium">
                        <XCircle className="w-4 h-4" /> Wypożyczony
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                        title="Usuń sprzęt"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold disabled:opacity-50"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Usuń
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => loadPage(page - 1)}
            disabled={page === 0}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">
            Strona {page + 1} z {totalPages}
          </span>
          <button
            onClick={() => loadPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default EquipmentPage;
