import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSeating } from '../../context/SeatingContext';
import { GROUP_COLORS } from '../../data/sampleData';
import './GuestCard.css';

export default function GuestCard({ guest, isSeated }) {
  const { removeGuest, seatAssignments, tables, setHighlightedGuest, highlightedGuest } = useSeating();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: guest.id,
    disabled: isSeated,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const groupColor = GROUP_COLORS[guest.group] || GROUP_COLORS.Default;

  // Find which table/seat this guest is at
  const getSeatInfo = () => {
    const entry = Object.entries(seatAssignments).find(([, gId]) => gId === guest.id);
    if (!entry) return null;
    const [seatId] = entry;
    const tableId = seatId.split('_')[0];
    const table = tables.find(t => t.id === tableId);
    return table ? table.name : 'Seated';
  };

  const seatInfo = isSeated ? getSeatInfo() : null;
  const isHighlighted = highlightedGuest === guest.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`guest-card ${isSeated ? 'seated' : 'unseated'} ${isDragging ? 'dragging' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      onMouseEnter={() => setHighlightedGuest(guest.id)}
      onMouseLeave={() => setHighlightedGuest(null)}
      {...(isSeated ? {} : { ...listeners, ...attributes })}
    >
      <div className="guest-avatar" style={{ background: groupColor }}>
        {guest.avatar}
      </div>
      <div className="guest-info">
        <span className="guest-name">{guest.name}</span>
        <span className="guest-meta">
          <span className="guest-group" style={{ color: groupColor }}>{guest.group}</span>
          {seatInfo && <span className="guest-seat">· {seatInfo}</span>}
        </span>
      </div>
      {isSeated ? (
        <span className="guest-status seated-badge">✓</span>
      ) : (
        <span className="guest-drag-handle" title="Drag to seat">⠿</span>
      )}
      <button
        className="guest-remove"
        onClick={(e) => { e.stopPropagation(); removeGuest(guest.id); }}
        title="Remove guest"
      >×</button>
    </div>
  );
}
