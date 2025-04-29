"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Projects } from "@/utils/types";
import { fetchProjects, createProjects, deleteProject } from "@/api/api";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const queryClient = useQueryClient();

  const [newProject, setNewProject] = useState({ name: "", avatar: "" });

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Projects[], Error>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProjects,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setNewProject({ name: "", avatar: "" });
    },
    onError: (error) => {
      console.error("Failed to add project:", error);
      alert("Failed to add project");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    },
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: newProject.name,
      avatar: newProject.avatar,
    });
  };

  const handleDeleteProject = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full h-auto bg-white text-black p-16">
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Add New Project</h2>
        <form
          onSubmit={handleAddProject}
          className="flex flex-col gap-4 max-w-md"
        >
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Avatar URL"
            value={newProject.avatar}
            onChange={(e) =>
              setNewProject({ ...newProject, avatar: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Adding..." : "Add Project"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3 grid-rows-3 gap-4">
        {projects?.map((project) => (
          <Link key={project.id} href={`/project/${project.id}`}>
            <div className="col-span-1 row-span-1 w-96 h-96 border rounded-2xl border-black m-2 flex justify-center items-center flex-col relative">
              <h1 className="mb-4 text-[32px]">{project.name}</h1>
              <img src={project.avatar} className="w-32 h-32" />
              <p className="text-[15px] opacity-50 mt-8">{project.id}</p>
              <p className="text-[16px] opacity-50">{project.createdAt}</p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteProject(project.id);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
