"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus
) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return;

  await prisma.project.update({
    where: { id: projectId },
    data: { status },
  });

  revalidatePath(`/domain/${project.domainId}`);
}

export async function addProject(
  domainId: string,
  title: string,
  description: string,
  status: ProjectStatus = ProjectStatus.TODO
) {
  await prisma.project.create({
    data: { title, description, status, domainId },
  });

  revalidatePath(`/domain/${domainId}`);
}
