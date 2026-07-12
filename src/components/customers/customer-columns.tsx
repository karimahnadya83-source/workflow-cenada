"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  STAGE_LABELS,
  STAGE_BADGE_CLASS,
  SOURCE_LABELS,
  TEMPERATURE_LABELS,
  TEMPERATURE_BADGE_CLASS,
} from "@/lib/constants/contact";

export interface CustomerRow {
  id: string;
  fullName: string;
  phone: string;
  stage: string;
  source: string;
  temperature: string;
  assignedToName: string | null;
  createdAt: string;
}

function SortableHeader({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={onClick}
    >
      {label}
      <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
    </Button>
  );
}

export const customerColumns: ColumnDef<CustomerRow>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <SortableHeader
        label="Nama"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <Link
        href={`/customers/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.fullName}
      </Link>
    ),
  },
  {
    accessorKey: "phone",
    header: "No. HP",
  },
  {
    accessorKey: "stage",
    header: "Status",
    cell: ({ row }) => {
      const stage = row.original.stage;
      return (
        <Badge className={STAGE_BADGE_CLASS[stage] ?? ""}>
          {STAGE_LABELS[stage] ?? stage}
        </Badge>
      );
    },
  },
  {
    accessorKey: "temperature",
    header: "Suhu",
    cell: ({ row }) => {
      const temperature = row.original.temperature;
      return (
        <Badge className={TEMPERATURE_BADGE_CLASS[temperature] ?? ""}>
          {TEMPERATURE_LABELS[temperature] ?? temperature}
        </Badge>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Sumber",
    cell: ({ row }) =>
      SOURCE_LABELS[row.original.source] ?? row.original.source,
  },
  {
    accessorKey: "assignedToName",
    header: "Sales",
    cell: ({ row }) => row.original.assignedToName ?? "-",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader
        label="Tgl Masuk"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), "d MMM yyyy", {
        locale: localeId,
      }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" />}
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            render={<Link href={`/customers/${row.original.id}`} />}
          >
            Lihat Detail
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];