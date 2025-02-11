"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import PackingRecordForm from "@/app/(home)/_components/PackingRecordForm";
import Dashboard from "@/app/(home)/_components/Dashboard";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <header className="bg-rose-700/90 text-stone-50 p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Farm Dashboard</h1>
          <p className="text-stone-100/80">Strawberry Packing Tracker</p>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="outline"
            className="border-rose-600/20 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
          >
            {showForm ? "View Dashboard" : "Add New Record"}
          </Button>
        </div>

        {showForm ? <PackingRecordForm /> : <Dashboard />}
      </main>
    </div>
  );
}
