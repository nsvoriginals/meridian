"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { HabitType } from "@prisma/client";

export async function logHabit(
  type: HabitType,
  date: string,
  done: boolean,
  notes: string = ""
) {
  await prisma.habitLog.upsert({
    where: { habitType_date: { habitType: type, date } },
    update: { done, notes },
    create: { habitType: type, date, done, notes },
  });

  revalidatePath("/");
  revalidatePath("/habits");
}

export async function toggleHabitDay(type: HabitType, date: string) {
  const existing = await prisma.habitLog.findUnique({
    where: { habitType_date: { habitType: type, date } },
  });

  if (existing) {
    await prisma.habitLog.update({
      where: { habitType_date: { habitType: type, date } },
      data: { done: !existing.done },
    });
  } else {
    await prisma.habitLog.create({
      data: { habitType: type, date, done: true },
    });
  }

  revalidatePath("/");
  revalidatePath("/habits");
}
