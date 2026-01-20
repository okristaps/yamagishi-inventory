'use client';
import React, { useEffect, useState } from 'react';
import MainPage from '@/components/pages/MainPage';


export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only render on client side
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainPage />
    </div>
  );
}
