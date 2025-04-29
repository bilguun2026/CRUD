import axios from "axios";
import { Projects } from "@/utils/types";

const API_URL = "https://680f994467c5abddd195f23b.mockapi.io/api/";

export const fetchProjects = async (): Promise<Projects[]> => {
  const response = await axios.get(`${API_URL}/projects`);
  return response.data;
};

export const fetchProject = async (id: string): Promise<Projects> => {
  const response = await axios.get(`${API_URL}/projects/${id}`);
  return response.data;
};

export const createProjects = async (
  project: Omit<Projects, "id" | "createdAt" | "isCompleted">
): Promise<Projects> => {
  const response = await axios.post(`${API_URL}/projects`, project);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/projects/${id}`);
};
