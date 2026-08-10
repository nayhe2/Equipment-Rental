// Typy odpowiadające encjom i DTO z backendu (Spring Boot)

export interface Equipment {
  id: number;
  name: string;
  isAvailable: boolean;
  pricePerHour: number;
}

export interface EquipmentCreateDto {
  name: string;
  pricePerHour: number;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  idCardNumber: string;
}

export interface CustomerCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  idCardNumber: string;
}

export interface Rental {
  id: number;
  customer: Customer;
  equipment: Equipment;
  startDate: string;
  dueDate: string | null; // opcjonalny planowany termin zwrotu
  returnDate: string | null;
  totalCost: number | null;
}

export interface RentalCreateDto {
  customerId: number;
  equipmentId: number;
  dueDate?: string | null; // opcjonalny, format zgodny z <input type="datetime-local">
}

// kształt odpowiedzi Spring Data Page<T>
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // aktualna strona (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
}

// ujednolicony kształt błędu z GlobalExceptionHandler
export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string | Record<string, string>;
}
