import { useDroppable } from '@dnd-kit/core';
import { usePlanner, GROUPS } from '../PlannerContext';

export default function Seat({ tableId, seatIndex, guest }) {
  const { dispatch } = usePlanner();

  const seatId = `seat-${tableId}-${seatIndex}`;
  const { setNodeRef, isOver } = useDroppable({
    id: seatId,
    data: { type: 'seat', tableId, seatIndex },
  });

  const group = guest ? GROUPS[guest.group] : null;
  const initials = guest
    ? guest.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '';

  const handleDoubleClick = () => {
    if (guest) {
      dispatch({ type: 'UNSEAT_GUEST', payload: guest.id });
    }
  };

  const isEmpty = !guest;
  const classes = [
    'seat',
    isEmpty ? 'is-empty' : 'is-occupied',
    isOver ? 'is-over' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setNodeRef}
      className={classes}
      style={
        guest
          ? { backgroundColor: group?.hex || '#888', borderColor: group?.hex || '#888' }
          : undefined
      }
      onDoubleClick={handleDoubleClick}
    >
      {guest ? (
        <>
          <span className="seat-initials">{initials}</span>
          <div className="seat-tooltip">{guest.name}</div>
        </>
      ) : (
        <span style={{ fontSize: '7px', opacity: 0.4 }}>{seatIndex + 1}</span>
      )}
    </div>
  );
}
