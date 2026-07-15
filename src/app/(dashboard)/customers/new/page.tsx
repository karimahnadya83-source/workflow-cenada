import { CustomerForm } from "@/components/customers/customer-form";

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Customer</h1>
        <p className="text-muted-foreground">
          Isi data lead/customer baru di bawah ini.
        </p>
      </div>

      <div className="max-w-2xl">
        <CustomerForm />
      </div>
    </div>
  );
}