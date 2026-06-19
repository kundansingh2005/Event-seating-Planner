import React, { useRef } from 'react';
import { useSeating } from '../../context/SeatingContext';
import Table from '../Table/Table';
import './FloorPlan.css';

export default function FloorPlan() {
  const { tables, eventType } = useSeating();
  const floorRef = useRef(null);

  const eventLabel = {
    Wedding: { icon: '💍', hint: 'Drag tables to arrange. Drop guests onto seats.' },
    Seminar: { icon: '🎓', hint: 'Set up rows for your seminar attendees.' },
    Classroom: { icon: '📚', hint: 'Arrange desks for your classroom.' },
  }[eventType];

  return (
    <div className="floor-plan" ref={floorRef}>
      <div className="floor-header">
        <span className="floor-event-badge">
          {eventLabel.icon} {eventType} Floor Plan
        </span>
        <span className="floor-hint">{eventLabel.hint}</span>
      </div>

      <div className="floor-canvas">
        {/* Grid dots background via CSS */}
        <div className="floor-grid" />

        {tables.length === 0 && (
          <div className="floor-empty">
            <div className="floor-empty-icon">🪑</div>
            <p>No tables yet — click <strong>+ Add Table</strong> to start</p>
          </div>
        )}

        {tables.map(table => (
          <Table key={table.id} table={table} />
        ))}

        {/* Stage / Front area */}
        <div className="floor-stage">
          {eventType === 'Wedding' ? '🌸 Stage / Altar' : eventType === 'Seminar' ? '📢 Podium / Front' : '📋 Whiteboard'}
        </div>
      </div>
    </div>
  );
}
