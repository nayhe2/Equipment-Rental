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

export const returnRental = async (rentalId: number): Promise<Rental> => {
  const response = await axiosInstance.post<Rental>(
    `/api/rental/${rentalId}/return`,
  );
  return response.data;
};

export const getTotalEarnings = async (): Promise<number> => {
  const response = await axiosInstance.get<number>("/api/rental/earnings");
  return response.data;
};

export const getMonthlyEarnings = async (
  year: number,
): Promise<{ month: number; amount: number }[]> => {
  const response = await axiosInstance.get<[number, number][]>(
    `/api/rental/earnings/monthly/${year}`,
  );
  return response.data.map(([month, amount]) => ({
    month,
    amount: Number(amount),
  }));
};

export const getYearlyEarnings = async (): Promise<
  { year: number; amount: number }[]
> => {
  const response = await axiosInstance.get<[number, number][]>(
    "/api/rental/earnings/yearly",
  );
  return response.data.map(([year, amount]) => ({
    year,
    amount: Number(amount),
  }));
};
