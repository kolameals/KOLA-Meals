import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { UserRole } from '../types/auth';

interface MainLayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  userRole: UserRole | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, isAuthenticated, userRole }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 