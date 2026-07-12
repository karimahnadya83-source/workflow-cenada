import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CustomerTable } from "@/components/customers/customer-table";
import {
  customerColumns,
  type CustomerRow,
} from "@/components/customers/customer-columns";

async function getCustomers(): Promise<CustomerRow[]> {
  const contacts = await prisma.contact.findMany({
    include: {
      assignedTo: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return contacts.map((contact) => ({
    id: contact.id,
    fullName: contact.fullName,
    phone: contact.phone,
    stage: contact.stage,
    source: contact.source,
    temperature: contact.temperature,
    assignedToName: contact.assignedTo?.name ?? null,
    createdAt: contact.createdAt.toISOString(),
  }));
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer</h1>
          <p className="text-muted-foreground">
            Kelola seluruh data lead dan customer Anda.
          </p>
        </div>
        <Button render={<Link href="/customers/new" />} nativeButton={false}>          <Plus className="h-4 w-4" />
          Tambah Customer
        </Button>
      </div>

      <CustomerTable columns={customerColumns} data={customers} />
    </div>
  );
}