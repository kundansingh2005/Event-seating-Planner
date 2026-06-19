import { useDroppable, useDraggable } from '@dnd-kit/core';
import { X } from 'lucide-react';
import { CATEGORIES } from '../types';

export default function SeatNode({ tableId, seatIndex, guest, onRemove }) {
  const seatId = `seat-${tableId}-${seatIndex}`;

  // Droppable hook
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: seatId,
    data: {
      type: 'seat',
      tableId,
      seatIndex
    }
  });

  // Draggable hook (only active if there is a guest seated here)
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging
  } = useDraggable({
    id: guest ? `guest-${guest.id}` : `empty-seat-${seatId}`,
    disabled: !guest,
    data: {
      type: 'guest',
      guest
    }
  });

  // Combine both refs
  const setRef = (element) => {
    setDropRef(element);
    setDragRef(element);
  };

  const category = guest ? (CATEGORIES[guest.category] || CATEGORIES.general) : null;
  const initials = guest
    ? guest.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <div
      ref={setRef}
      className={`seat-node ${guest ? 'occupied' : 'empty'} ${isOver ? 'is-over' : ''} ${isDragging ? 'dragging' : ''}`}
      style={
        guest
          ? {
              backgroundColor: category.color,
              borderColor: category.border,
              color: '#ffffff'
            }
          : {}
      }
      onDoubleClick={guest ? () => onRemove(guest.id) : undefined}
      {...(guest ? attributes : {})}
      {...(guest ? listeners : {})}
    >
      {guest ? (
        <>
          <span style={{ fontSize: '10px', pointerEvents: 'none' }}>{initials}</span>
          <div className="seat-tooltip" style={{ pointerEvents: 'auto' }}>
            <span>{guest.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(guest.id);
              }}
              style={{
                marginLeft: '6px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                padding: 0
              }}
              title="Remove Guest"
            >
              <X size={8} />
            </button>
          </div>
        </>
      ) : (
        <span style={{ opacity: 0.4, fontSize: '9px' }}>{seatIndex + 1}</span>
      )}
    </div>
  );
}
