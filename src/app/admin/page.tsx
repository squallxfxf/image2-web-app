import { AdminDashboard } from '@/components/AdminDashboard';

export default async function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      <AdminDashboard />
    </main>
  );
}
