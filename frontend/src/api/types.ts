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
  dueDate: string | null;
  returnDate: string | null;
  totalCost: number | null;
}

export interface RentalCreateDto {
  customerId: number;
  equipmentId: number;
  dueDate?: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string | Record<string, string>;
}

export interface MonthData {
  month: number;
  amount: number;
}

export interface YearData {
  year: number;
  amount: number;
}
