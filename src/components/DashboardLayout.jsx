import { useState } from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <header className="sidebar-mobile-header">
        <button
          type="button"
          className="sidebar-mobile-toggle"
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="sidebar-mobile-title">ZeroEmpty</span>
      </header>
      <main className="main-content min-h-screen">
        <div className="main-content-inner">
          {children}
        </div>
      </main>
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          role="button"
          tabIndex={0}
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
