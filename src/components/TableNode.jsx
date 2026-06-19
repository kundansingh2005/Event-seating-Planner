import { useDraggable } from '@dnd-kit/core';
import { usePlanner } from '../PlannerContext';
import Seat from './Seat';

export default function TableNode({ table, onEdit }) {
  const { guests, dispatch } = usePlanner();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `table-${table.id}`,
    data: { type: 'table', table },
  });

  const seatedGuests = guests.filter(g => g.tableId === table.id);
  const seatedCount = seatedGuests.length;
  const isFull = seatedCount >= table.capacity;

  // Build seats array
  const seats = [];
  for (let i = 0; i < table.capacity; i++) {
    const guestAtSeat = seatedGuests.find(g => g.seatIndex === i) || null;
    seats.push(
      <Seat key={`${table.id}-s${i}`} tableId={table.id} seatIndex={i} guest={guestAtSeat} />
    );
  }

  // Position seats around the table
  const renderSeats = () => {
    if (table.type === 'round') {
      const radius = 68;
      return seats.map((seat, i) => {
        const angle = (i * 2 * Math.PI) / table.capacity - Math.PI / 2;
        const x = Math.round(radius * Math.cos(angle));
        const y = Math.round(radius * Math.sin(angle));
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
          }}>
            {seat}
          </div>
        );
      });
    }

    // Rectangular: seats on long sides
    const half = Math.ceil(table.capacity / 2);
    const topSeats = seats.slice(0, half);
    const bottomSeats = seats.slice(half);
    const seatSpacing = 36;

    return (
      <>
        {/* Top row */}
        <div style={{
          position: 'absolute',
          top: '-36px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: `${seatSpacing - 28}px`,
        }}>
          {topSeats}
        </div>
        {/* Bottom row */}
        <div style={{
          position: 'absolute',
          bottom: '-36px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: `${seatSpacing - 28}px`,
        }}>
          {bottomSeats}
        </div>
      </>
    );
  };

  const nodeClasses = [
    'table-node',
    isDragging ? 'is-dragging' : '',
    isFull ? 'is-full' : '',
  ].filter(Boolean).join(' ');

  const surfaceClass = table.type === 'round' ? 'table-surface-round' : 'table-surface-rect';

  return (
    <div
      ref={setNodeRef}
      className={nodeClasses}
      style={{ left: table.x, top: table.y }}
    >
      {/* Table surface — the draggable part */}
      <div className="table-center" {...listeners} {...attributes}>
        <div className={surfaceClass}>
          <span className="table-name-label">{table.name}</span>
          <span className="table-count-label">{seatedCount} / {table.capacity}</span>
        </div>
      </div>

      {/* Seats around the table */}
      {renderSeats()}

      {/* Hover actions */}
      <div className="table-actions-bar">
        <button
          className="table-action-btn"
          title="Edit table"
          onClick={(e) => { e.stopPropagation(); onEdit(table); }}
        >
          ✎
        </button>
        <button
          className="table-action-btn danger"
          title="Delete table"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: 'DELETE_TABLE', payload: table.id });
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
