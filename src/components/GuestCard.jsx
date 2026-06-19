import { useDraggable } from '@dnd-kit/core';
import { GROUPS } from '../PlannerContext';

export default function GuestCard({ guest }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `guest-${guest.id}`,
    data: { type: 'guest', guest },
  });

  const group = GROUPS[guest.group] || GROUPS.family;
  const isSeated = guest.tableId !== null;

  const classes = [
    'guest-card',
    isDragging ? 'is-dragging' : '',
    isSeated ? 'is-seated' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setNodeRef}
      className={classes}
      {...(isSeated ? {} : attributes)}
      {...(isSeated ? {} : listeners)}
    >
      <div
        className="guest-card-indicator"
        style={{ backgroundColor: group.hex }}
      />
      <span className="guest-card-name">{guest.name}</span>
    </div>
  );
}
