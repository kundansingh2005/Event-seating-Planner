import React, { useState } from 'react';
import { useSeating } from '../../context/SeatingContext';
import { exportLayout, exportAsCSV } from '../../utils/exportLayout';
import './Toolbar.css';

const EVENT_TYPES = ['Wedding', 'Seminar', 'Classroom'];

export default function Toolbar() {
  const {
    eventType, setEventType,
    tables, guests, seatAssignments,
    addTable, clearAllAssignments,
    getUnseatedGuests,
  } = useSeating();

  const [showAddTable, setShowAddTable] = useState(false);
  const [tableForm, setTableForm] = useState({ name: '', capacity: 6, shape: 'round' });
  const [showExport, setShowExport] = useState(false);

  const unseatedCount = getUnseatedGuests().length;
  const seatedCount = guests.length - unseatedCount;

  const handleAddTable = () => {
    addTable(tableForm);
    setTableForm({ name: '', capacity: 6, shape: 'round' });
    setShowAddTable(false);
  };

  return (
    <header className="toolbar">
      <div className="toolbar-brand">
        <div className="brand-icon">✦</div>
        <div>
          <h1 className="brand-title">Seating Planner</h1>
          <p className="brand-sub">Drag guests to seats</p>
        </div>
      </div>

      <div className="toolbar-event">
        {EVENT_TYPES.map(e => (
          <button
            key={e}
            className={`event-btn ${eventType === e ? 'active' : ''}`}
            onClick={() => setEventType(e)}
          >
            {e === 'Wedding' ? '💍' : e === 'Seminar' ? '🎓' : '📚'} {e}
          </button>
        ))}
      </div>

      <div className="toolbar-stats">
        <div className="stat">
          <span className="stat-val">{guests.length}</span>
          <span className="stat-label">Guests</span>
        </div>
        <div className="stat">
          <span className="stat-val seated">{seatedCount}</span>
          <span className="stat-label">Seated</span>
        </div>
        <div className="stat">
          <span className="stat-val unseated">{unseatedCount}</span>
          <span className="stat-label">Waiting</span>
        </div>
        <div className="stat">
          <span className="stat-val">{tables.length}</span>
          <span className="stat-label">Tables</span>
        </div>
      </div>

      <div className="toolbar-actions">
        <button className="action-btn primary" onClick={() => setShowAddTable(true)}>
          + Add Table
        </button>
        <div className="export-wrapper">
          <button className="action-btn secondary" onClick={() => setShowExport(!showExport)}>
            ↓ Export
          </button>
          {showExport && (
            <div className="export-dropdown">
              <button onClick={() => { exportLayout(tables, guests, seatAssignments, eventType); setShowExport(false); }}>
                Export JSON
              </button>
              <button onClick={() => { exportAsCSV(tables, guests, seatAssignments); setShowExport(false); }}>
                Export CSV
              </button>
            </div>
          )}
        </div>
        <button className="action-btn danger" onClick={clearAllAssignments}>
          Clear All
        </button>
      </div>

      {showAddTable && (
        <div className="modal-overlay" onClick={() => setShowAddTable(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Table</h3>
            <div className="form-group">
              <label>Table Name</label>
              <input
                value={tableForm.name}
                onChange={e => setTableForm(p => ({ ...p, name: e.target.value }))}
                placeholder={`Table ${tables.length + 1}`}
              />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number" min="2" max="20"
                value={tableForm.capacity}
                onChange={e => setTableForm(p => ({ ...p, capacity: +e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Shape</label>
              <div className="shape-options">
                {['round', 'rectangle'].map(s => (
                  <button
                    key={s}
                    className={`shape-btn ${tableForm.shape === s ? 'active' : ''}`}
                    onClick={() => setTableForm(p => ({ ...p, shape: s }))}
                  >
                    {s === 'round' ? '⭕ Round' : '▭ Rectangle'}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="action-btn secondary" onClick={() => setShowAddTable(false)}>Cancel</button>
              <button className="action-btn primary" onClick={handleAddTable}>Add Table</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
