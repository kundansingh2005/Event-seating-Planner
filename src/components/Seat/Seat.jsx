import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSeating } from '../../context/SeatingContext';
import { GROUP_COLORS } from '../../data/sampleData';
import './Seat.css';

export default function Seat({ seatId, index, tableShape }) {
  const { getSeatGuest, highlightedGuest, setSelectedGuest, unassignGuest } = useSeating();
  const guest = getSeatGuest(seatId);

  const { isOver, setNodeRef } = useDroppable({ id: seatId });

  const isHighlighted = highlightedGuest && guest?.id === highlightedGuest;
  const groupColor = guest ? (GROUP_COLORS[guest.group] || GROUP_COLORS.Default) : null;

  return (
    <div
      ref={setNodeRef}
      className={`seat ${guest ? 'occupied' : 'empty'} ${isOver ? 'drag-over' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={groupColor ? { '--seat-color': groupColor } : {}}
      title={guest ? `${guest.name} (${guest.group})` : `Seat ${index + 1}`}
      onClick={() => guest && setSelectedGuest(guest)}
    >
      {guest ? (
        <>
          <div className="seat-avatar">{guest.avatar}</div>
          <button
            className="seat-remove"
            onClick={e => { e.stopPropagation(); unassignGuest(guest.id); }}
            title="Remove from seat"
          >×</button>
        </>
      ) : (
        <div className="seat-number">{index + 1}</div>
      )}
    </div>
  );
}
