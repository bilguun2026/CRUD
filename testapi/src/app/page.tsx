"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Projects } from "@/utils/types";
import { fetchProjects, createProjects } from "@/api/api";
import Link from "next/link";

export default function Home() {
  const queryClient = useQueryClient();

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Projects[], Error>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const mutation = useMutation({
    mutationFn: createProjects,
    onSuccess: () => {
      // Invalidate and refetch todos after mutation
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="w-full h-auto bg-white text-black p-16 grid grid-cols-3 grid-rows-3">
      {projects?.map((project) => (
        <Link href={`/project/${project.id}`}>
          <div
            key={Number(project.id)}
            className="col-span-1 row-span-1 w-96 h-96 border rounded-2xl border-black m-2 flex justify-center items-center flex-col"
          >
            <h1 className="mb-4 text-[32px]">{project.name}</h1>
            <img src={project.avatar} className="w-32 h-32" />
            <p className="text-[15px] opacity-50 mt-8">{project.id}</p>
            <p className="text-[16px] opacity-50">{project.createdAt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
