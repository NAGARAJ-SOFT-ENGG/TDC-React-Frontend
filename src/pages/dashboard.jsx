import Sidebar from "../components/sidebar";
import Header from "../components/header";
import StatCard from "../components/statcard";

export default function Dashboard() {
  return (
    <div className="flex bg-blue-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Header />
        <div className="mt-6 flex gap-6">
          <StatCard number={200} label="Total Orders" />
          <StatCard number={120} label="New Orders" />
          <StatCard number={180} label="Ongoing Orders" />
          <StatCard number={200} label="Total Providers" />
        </div>
      </main>
    </div>
  );
}



