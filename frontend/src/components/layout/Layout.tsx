import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showEventModal, setShowEventModal] = useState(false);

  const handleNewEvent = () => {
    setShowEventModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewEvent={handleNewEvent} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children || <Outlet context={{ showEventModal, setShowEventModal }} />}
        </main>
      </div>
    </div>
  );
}
