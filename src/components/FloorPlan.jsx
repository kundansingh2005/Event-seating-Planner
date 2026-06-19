import { useDroppable } from '@dnd-kit/core';
import { usePlanner } from '../PlannerContext';
import TableNode from './TableNode';

export default function FloorPlan({ onEditTable, onAddTable }) {
  const { tables } = usePlanner();

  // Canvas itself is a droppable — dropping a guest here unseats them
  const { setNodeRef } = useDroppable({
    id: 'canvas-drop',
    data: { type: 'canvas' },
  });

  return (
    <div className="canvas-area">
      <div className="canvas-scroll">
        <div ref={setNodeRef} className="floor-plan">
          <div className="floor-label">Floor Plan</div>

          {tables.map(table => (
            <TableNode
              key={table.id}
              table={table}
              onEdit={onEditTable}
            />
          ))}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="canvas-toolbar">
        <button
          className="btn btn-subtle btn-sm"
          onClick={() => onAddTable('round')}
        >
          + Round Table
        </button>
        <div className="canvas-toolbar-divider" />
        <button
          className="btn btn-subtle btn-sm"
          onClick={() => onAddTable('rect')}
        >
          + Rectangular
        </button>
      </div>
    </div>
  );
}
