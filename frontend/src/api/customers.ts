import axiosInstance from "./axiosInstance";
import type { Customer, CustomerCreateDto } from "./types";

export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await axiosInstance.get<Customer[]>("/api/customers");
  return response.data;
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  const response = await axiosInstance.get<Customer>(`/api/customers/${id}`);
  return response.data;
};

export const createCustomer = async (
  dto: CustomerCreateDto,
): Promise<Customer> => {
  const response = await axiosInstance.post<Customer>("/api/customers", dto);
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/customers/${id}`);
};
