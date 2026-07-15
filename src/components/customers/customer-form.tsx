"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import {
  createContactSchema,
  type CreateContactInput,
} from "@/lib/validations/contact.schema";
import { SOURCE_LABELS, TEMPERATURE_LABELS } from "@/lib/constants/contact";

export function CustomerForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateContactInput>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      source: "OTHER",
      temperature: "WARM",
      stage: "NEW_LEAD",
    },
  });

  async function onSubmit(data: CreateContactInput) {
    setIsSubmitting(true);

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      toast.error("Gagal menyimpan customer. Coba lagi.");
      return;
    }

    toast.success("Customer berhasil ditambahkan!");
    router.push("/customers");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">No. HP (WhatsApp)</Label>
              <Input
                id="phone"
                placeholder="081234567890"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (opsional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat (opsional)</Label>
            <Input id="address" {...register("address")} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="source">Sumber Lead</Label>
              <Controller
                control={control}
                name="source"
                render={({ field }) => (
                  <select
                    id="source"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Tingkat Ketertarikan</Label>
              <Controller
                control={control}
                name="temperature"
                render={({ field }) => (
                  <select
                    id="temperature"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {Object.entries(TEMPERATURE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/customers")}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Customer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}