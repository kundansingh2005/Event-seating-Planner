import React from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { SeatingProvider, useSeating } from './context/SeatingContext';
import Toolbar from './components/Toolbar/Toolbar';
import FloorPlan from './components/FloorPlan/FloorPlan';
import GuestList from './components/GuestList/GuestList';
import { GROUP_COLORS } from './data/sampleData';
import './App.css';

function AppInner() {
  const { guests, tables, assignSeat, getGuestById, seatAssignments } = useSeating();
  const [activeGuest, setActiveGuest] = React.useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = ({ active }) => {
    const guest = getGuestById(active.id);
    setActiveGuest(guest || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveGuest(null);
    if (!over) return;

    const guestId = active.id;
    const seatId = over.id;

    // Only drop onto seats (ids contain "_seat_")
    if (!String(seatId).includes('_seat_')) return;

    // Check if seat is already taken by someone else
    const currentOccupant = seatAssignments[seatId];
    if (currentOccupant && currentOccupant !== guestId) return;

    // Check capacity: find table, make sure not full (already filled by others)
    const tableId = String(seatId).split('_')[0];
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    assignSeat(seatId, guestId);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app">
        <Toolbar />
        <div className="app-body">
          <FloorPlan />
          <GuestList />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeGuest ? (
          <div className="drag-overlay-card">
            <div
              className="drag-overlay-avatar"
              style={{ background: GROUP_COLORS[activeGuest.group] || GROUP_COLORS.Default }}
            >
              {activeGuest.avatar}
            </div>
            <span className="drag-overlay-name">{activeGuest.name}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function App() {
  return (
    <SeatingProvider>
      <AppInner />
    </SeatingProvider>
  );
}
