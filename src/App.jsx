import { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { usePlanner, GROUPS } from './PlannerContext';
import Sidebar from './components/Sidebar';
import FloorPlan from './components/FloorPlan';
import TableEditModal from './components/TableEditModal';

export default function App() {
  const {
    tables,
    dispatch,
    totalGuests,
    seatedCount,
    waitingCount,
    exportJSON,
    exportCSV,
    importJSON,
  } = usePlanner();

  const [activeDrag, setActiveDrag] = useState(null);
  const [modalState, setModalState] = useState({ open: false, table: null, defaultType: 'round' });
  const fileRef = useRef(null);

  // Sensor — require 5px movement before drag activates
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const sensors = useSensors(sensor);

  // ── Drag handlers ──────────────────────────────────────
  const handleDragStart = ({ active }) => {
    const data = active.data.current;
    setActiveDrag({
      id: active.id,
      type: data.type,
      guest: data.guest || null,
      table: data.table || null,
    });
  };

  const handleDragEnd = ({ active, over, delta }) => {
    setActiveDrag(null);
    const data = active.data.current;

    // Table movement
    if (data.type === 'table') {
      const t = data.table;
      dispatch({
        type: 'MOVE_TABLE',
        payload: {
          id: t.id,
          x: Math.max(0, Math.min(1300, t.x + delta.x)),
          y: Math.max(0, Math.min(800, t.y + delta.y)),
        },
      });
      return;
    }

    // Guest drag
    if (data.type === 'guest') {
      const guest = data.guest;

      // Dropped onto a seat
      if (over?.data?.current?.type === 'seat') {
        dispatch({
          type: 'SEAT_GUEST',
          payload: {
            guestId: guest.id,
            tableId: over.data.current.tableId,
            seatIndex: over.data.current.seatIndex,
          },
        });
        return;
      }

      // Dropped onto canvas background or nothing — unseat
      if (!over || over.data?.current?.type === 'canvas') {
        if (guest.tableId !== null) {
          dispatch({ type: 'UNSEAT_GUEST', payload: guest.id });
        }
      }
    }
  };

  // ── Modal handlers ─────────────────────────────────────
  const handleAddTable = (type) => {
    setModalState({ open: true, table: null, defaultType: type });
  };

  const handleEditTable = (table) => {
    setModalState({ open: true, table, defaultType: table.type });
  };

  const handleModalSave = (data) => {
    if (modalState.table) {
      dispatch({ type: 'UPDATE_TABLE', payload: { ...modalState.table, ...data } });
    } else {
      dispatch({ type: 'ADD_TABLE', payload: { ...data, type: data.type || modalState.defaultType } });
    }
    setModalState({ open: false, table: null, defaultType: 'round' });
  };

  const handleModalClose = () => {
    setModalState({ open: false, table: null, defaultType: 'round' });
  };

  // ── Import handler ─────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) importJSON(file);
    e.target.value = '';
  };

  // ── Active drag overlay content ────────────────────────
  let overlayContent = null;
  if (activeDrag?.type === 'guest' && activeDrag.guest) {
    const group = GROUPS[activeDrag.guest.group];
    overlayContent = (
      <div className="drag-overlay-card">
        <div className="drag-overlay-dot" style={{ backgroundColor: group?.hex || '#888' }} />
        <span>{activeDrag.guest.name}</span>
      </div>
    );
  }

  const pct = totalGuests > 0 ? Math.round((seatedCount / totalGuests) * 100) : 0;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app-shell">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="app-header">
          <div className="app-brand">
            <h1>Seating Planner</h1>
            <span>Event Layout</span>
          </div>
          <div className="header-actions">
            <button className="btn btn-ghost btn-sm" onClick={exportJSON}>
              ↓ JSON
            </button>
            <button className="btn btn-ghost btn-sm" onClick={exportCSV}>
              ↓ CSV
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
              ↑ Import
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </header>

        {/* ── Stats Bar ──────────────────────────────────── */}
        <div className="stats-bar">
          <div className="stat-item">
            <span>Total</span>
            <strong>{totalGuests}</strong>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span>Seated</span>
            <strong>{seatedCount}</strong>
          </div>
          <div className="stat-divider" />
          <div className="stat-item stat-accent">
            <span>Waiting</span>
            <strong>{waitingCount}</strong>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span>Tables</span>
            <strong>{tables.length}</strong>
          </div>
          <div style={{ flex: 1 }} />
          <div className="stat-item">
            <span style={{ marginRight: '6px' }}>{pct}% seated</span>
            <div style={{
              width: '80px',
              height: '4px',
              background: 'var(--surface-3)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: pct === 100 ? 'var(--status-success)' : 'var(--accent)',
                borderRadius: '2px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </div>

        {/* ── Main Body ──────────────────────────────────── */}
        <div className="app-body">
          <Sidebar />
          <FloorPlan
            onEditTable={handleEditTable}
            onAddTable={handleAddTable}
          />
        </div>
      </div>

      {/* ── Drag Overlay ─────────────────────────────────── */}
      <DragOverlay dropAnimation={null}>
        {overlayContent}
      </DragOverlay>

      {/* ── Table Edit Modal ─────────────────────────────── */}
      {modalState.open && (
        <TableEditModal
          table={modalState.table}
          onSave={handleModalSave}
          onClose={handleModalClose}
        />
      )}
    </DndContext>
  );
}
