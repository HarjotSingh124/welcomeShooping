export const metadata = {
  title: "Admin Dashboard - HarjotStore",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 text-xl font-bold">
        HarjotStore Admin
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}