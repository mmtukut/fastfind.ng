'use client';

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-body antialiased">
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative bg-gray-200">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600">The dashboard is currently being updated. Please check back later.</p>
        </div>
      </main>
    </div>
  );
}
