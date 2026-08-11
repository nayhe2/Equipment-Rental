import axiosInstance from "./axiosInstance";
import type { Equipment, EquipmentCreateDto, PageResponse } from "./types";

export const getEquipmentPage = async (
  page: number,
  size = 10,
  search?: string,
): Promise<PageResponse<Equipment>> => {
  const response = await axiosInstance.get<PageResponse<Equipment>>(
    "/api/equipment",
    {
      params: { page, size, search: search || undefined },
    },
  );
  return response.data;
};

export const getAvailableEquipment = async (): Promise<Equipment[]> => {
  const response = await axiosInstance.get<Equipment[]>(
    "/api/equipment/available",
  );
  return response.data;
};

export const getEquipmentById = async (id: number): Promise<Equipment> => {
  const response = await axiosInstance.get<Equipment>(`/api/equipment/${id}`);
  return response.data;
};

export const createEquipment = async (
  dto: EquipmentCreateDto,
): Promise<Equipment> => {
  const response = await axiosInstance.post<Equipment>("/api/equipment", dto);
  return response.data;
};

export const deleteEquipment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/equipment/${id}`);
};
