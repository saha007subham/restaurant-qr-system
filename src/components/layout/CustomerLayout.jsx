import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { BottomCartBar } from '../common/BottomCartBar';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5EFE4] text-[#5B5146] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 sm:px-6">
        <Outlet />
      </main>
      <BottomCartBar />
    </div>
  );
};

