import React, { useEffect, useState, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { getAllCustomers, createCustomer } from "../api/customers";
import type { Customer, CustomerCreateDto } from "../api/types";

const emptyForm: CustomerCreateDto = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  idCardNumber: "",
};

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CustomerCreateDto>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setCustomers(await getAllCustomers());
    } catch {
      setError("Nie udało się pobrać listy klientów.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = (field: keyof CustomerCreateDto, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSaving(true);
    try {
      await createCustomer(form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err: any) {
      const message = err?.response?.data?.message;
      if (message && typeof message === "object") {
        setFieldErrors(message);
      } else {
        setFormError(
          typeof message === "string"
            ? message
            : "Nie udało się dodać klienta.",
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const fields: {
    key: keyof CustomerCreateDto;
    label: string;
    required?: boolean;
  }[] = [
    { key: "firstName", label: "Imię", required: true },
    { key: "lastName", label: "Nazwisko", required: true },
    { key: "email", label: "E-mail", required: true },
    { key: "phoneNumber", label: "Telefon" },
    { key: "idCardNumber", label: "Nr dowodu", required: true },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Klienci
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Baza klientów wypożyczalni
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Dodaj klienta
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {fields.map(({ key, label, required }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {label}
              </label>
              <input
                className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                value={form[key] ?? ""}
                onChange={(e) => updateField(key, e.target.value)}
                required={required}
              />
              {fieldErrors[key] && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors[key]}</p>
              )}
            </div>
          ))}

          <div className="sm:col-span-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Zapisz
            </button>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="p-8 text-center text-gray-400">Ładowanie…</p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : customers.length === 0 ? (
          <p className="p-8 text-center text-gray-400">
            Brak klientów do wyświetlenia.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <th className="px-6 py-3">Imię i nazwisko</th>
                <th className="px-6 py-3">E-mail</th>
                <th className="px-6 py-3">Telefon</th>
                <th className="px-6 py-3">Nr dowodu</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{c.email}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {c.phoneNumber || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{c.idCardNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CustomersPage;
