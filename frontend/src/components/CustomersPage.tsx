import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Loader2, Search, Trash2 } from "lucide-react";
import {
  getAllCustomers,
  createCustomer,
  deleteCustomer,
} from "../api/customers";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setCustomers(await getAllCustomers());
    } catch {
      setError("Failed to load customers.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // filtrowanie po imieniu, nazwisku lub numerze dokumentu
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const idCard = c.idCardNumber.toLowerCase();
      return fullName.includes(q) || idCard.includes(q);
    });
  }, [customers, searchQuery]);

  const updateField = (field: keyof CustomerCreateDto, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          typeof message === "string" ? message : "Failed to add customer.",
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!window.confirm(`Delete ${customer.firstName} ${customer.lastName}?`))
      return;
    setDeletingId(customer.id);
    try {
      await deleteCustomer(customer.id);
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Failed to delete customer.");
    } finally {
      setDeletingId(null);
    }
  };

  const fields: {
    key: keyof CustomerCreateDto;
    label: string;
    required?: boolean;
  }[] = [
    { key: "firstName", label: "First Name", required: true },
    { key: "lastName", label: "Last Name", required: true },
    { key: "email", label: "Email", required: true },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "idCardNumber", label: "ID Card Number", required: true },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-400 mt-1">Customer database</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Customer
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
                className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5"
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
              className="px-5 py-2.5 rounded-xl font-semibold bg-black text-white hover:bg-gray-800 disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
          </div>
        </form>
      )}

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID card number..."
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
        ) : filteredCustomers.length === 0 ? (
          <p className="p-8 text-center text-gray-400">
            {searchQuery ? "No customers match your search." : "No customers."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <th className="px-6 py-3">First Name</th>
                <th className="px-6 py-3">Last Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">ID Card</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {c.firstName}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {c.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{c.email}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {c.phoneNumber || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{c.idCardNumber}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 text-xs font-semibold disabled:opacity-50"
                    >
                      {deletingId === c.id ? (
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
    </div>
  );
}

export default CustomersPage;
