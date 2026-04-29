"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleTopic(topicId: string) {
  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic) return;

  await prisma.topic.update({
    where: { id: topicId },
    data: { completed: !topic.completed },
  });

  revalidatePath("/");
  revalidatePath(`/domain/${topic.domainId}`);
}

export async function updateTopicNotes(topicId: string, notes: string) {
  const topic = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!topic) return;

  await prisma.topic.update({
    where: { id: topicId },
    data: { notes },
  });

  revalidatePath(`/domain/${topic.domainId}`);
}

export async function addTopic(domainId: string, title: string) {
  const lastTopic = await prisma.topic.findFirst({
    where: { domainId },
    orderBy: { order: "desc" },
  });

  await prisma.topic.create({
    data: {
      title,
      domainId,
      order: (lastTopic?.order ?? -1) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath(`/domain/${domainId}`);
}
