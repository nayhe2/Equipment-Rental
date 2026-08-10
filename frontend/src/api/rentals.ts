import axiosInstance from "./axiosInstance";
import type { Rental, RentalCreateDto } from "./types";

export const getAllRentals = async (): Promise<Rental[]> => {
  const response = await axiosInstance.get<Rental[]>("/api/rental");
  return response.data;
};

export const getRentalsByCustomer = async (
  customerId: number,
): Promise<Rental[]> => {
  const response = await axiosInstance.get<Rental[]>(
    `/api/rental/customer/${customerId}`,
  );
  return response.data;
};

export const createRental = async (dto: RentalCreateDto): Promise<Rental> => {
  const response = await axiosInstance.post<Rental>("/api/rental", dto);
  return response.data;
};

// Wymaga poprawki w RentalController na backendzie (patrz uwaga w opisie zmian)
export const returnRental = async (rentalId: number): Promise<Rental> => {
  const response = await axiosInstance.post<Rental>(
    `/api/rental/${rentalId}/return`,
  );
  return response.data;
};

// Dostępne tylko dla ROLE_ADMIN — backend zwróci 403 dla innych ról
export const getTotalEarnings = async (): Promise<number> => {
  const response = await axiosInstance.get<number>("/api/rental/earnings");
  return response.data;
};
