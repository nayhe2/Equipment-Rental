import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  Search,
} from "lucide-react";
import {
  getEquipmentPage,
  createEquipment,
  deleteEquipment,
} from "../api/equipment";
import type { Equipment } from "../api/types";

const PAGE_SIZE = 10;

function EquipmentPage() {
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

  const [searchQuery, setSearchQuery] = useState("");

  const loadPage = useCallback(async (pageToLoad: number, search: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEquipmentPage(pageToLoad, PAGE_SIZE, search);
      setItems(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch {
      setError("Failed to load equipment.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadPage(0, searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, loadPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedPrice = Number(pricePerHour.replace(",", "."));
    if (!name.trim()) {
      setFormError("Please enter the equipment name.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setFormError("The hourly rate must be greater than zero.");
      return;
    }

    setIsSaving(true);
    try {
      await createEquipment({ name: name.trim(), pricePerHour: parsedPrice });
      setName("");
      setPricePerHour("");
      setShowForm(false);
      loadPage(0, searchQuery);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setFormError(typeof msg === "string" ? msg : "Failed to add equipment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: Equipment) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setDeletingId(item.id);
    try {
      await deleteEquipment(item.id);
      loadPage(page, searchQuery);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Failed to delete equipment.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage equipment in the rental shop
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Name
            </label>
            <input
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Impact Drill"
            />
          </div>
          <div className="w-40">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Price / Hour
            </label>
            <input
              className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              placeholder="15.00"
              inputMode="decimal"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </button>
          {formError && (
            <p className="w-full text-sm text-red-600">{formError}</p>
          )}
        </form>
      )}

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by equipment name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="p-8 text-center text-gray-400">Loading...</p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="p-8 text-center text-gray-400">
            {searchQuery
              ? "No equipment matches your search."
              : "No equipment."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Price / Hour</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3" />
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
                    {Number(item.pricePerHour).toFixed(2)} zl
                  </td>
                  <td className="px-6 py-4">
                    {item.isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-gray-400 font-medium">
                        <XCircle className="w-4 h-4" /> Rented
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 text-xs font-semibold disabled:opacity-50"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => loadPage(page - 1, searchQuery)}
            disabled={page === 0}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => loadPage(page + 1, searchQuery)}
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
