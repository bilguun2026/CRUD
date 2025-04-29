// src/app/todo/[id]/page.tsx
"use client"; // Required for client-side features like useQuery

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchProject } from "@/api/api";
import { Projects } from "@/utils/types";

export default function TodoDetail() {
  const params = useParams();
  const id = params.id as string; // Get ID from URL

  const {
    data: project,
    isLoading,
    error,
  } = useQuery<Projects, Error>({
    queryKey: ["todo", id],
    queryFn: () => fetchProject(id),
    enabled: !!id, // Only fetch if ID exists
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!project) return <div>Todo not found</div>;

  return (
    <div>
      <h1>{project.name}</h1>
      <p>Completed: {project.isCompleted ? "Yes" : "No"}</p>
      {project.avatar ? (
        <img
          src={project.avatar}
          alt={project.name}
          style={{ maxWidth: "200px" }}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/150?text=Error";
          }}
        />
      ) : (
        <span>No image available</span>
      )}
    </div>
  );
}
