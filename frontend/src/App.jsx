import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardGrid from './components/DashboardGrid';
import SystemTerminatedScreen from './components/SystemTerminatedScreen';
import AddWidgetModal from './components/AddWidgetModal';

function App() {
  const [isTerminated, setIsTerminated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWidgetType, setNewWidgetType] = useState(null);

  const handleAddWidget = (type) => {
    setNewWidgetType(type);
    setIsModalOpen(false);
  };

  if (isTerminated) {
    return <SystemTerminatedScreen />;
  }

  return (
    // The overflow-x-hidden class has been removed from here
    <div className="min-h-screen bg-[#0a0a0a] text-[#e2e8f0] font-mono flex flex-col">
      <Header 
        setIsTerminated={setIsTerminated}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onOpenModal={() => setIsModalOpen(true)}
      />
      
      <main className="flex-grow p-8 mb-10">
        <DashboardGrid 
          isEditing={isEditing} 
          newWidgetType={newWidgetType}
          onWidgetAdded={() => setNewWidgetType(null)}
        />
      </main>
      
      <Footer />

      <AddWidgetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
}

export default App;