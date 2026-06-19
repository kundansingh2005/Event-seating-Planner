import React, { useState, useRef } from 'react';
import { useSeating } from '../../context/SeatingContext';
import Seat from '../Seat/Seat';
import './Table.css';

export default function Table({ table }) {
  const { removeTable, updateTablePosition, seatAssignments } = useSeating();
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const seats = Array.from({ length: table.capacity }, (_, i) => `${table.id}_seat_${i}`);
  const occupiedCount = seats.filter(sid => seatAssignments[sid]).length;
  const isFull = occupiedCount === table.capacity;

  const handleMouseDown = (e) => {
    if (e.target.closest('.seat') || e.target.closest('.table-remove-btn')) return;
    e.preventDefault();
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - table.x,
      y: e.clientY - table.y,
    };

    const handleMouseMove = (e) => {
      updateTablePosition(
        table.id,
        Math.max(0, e.clientX - dragOffset.current.x),
        Math.max(0, e.clientY - dragOffset.current.y)
      );
    };

    const handleMouseUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const renderRoundSeats = () => {
    const radius = Math.max(52, table.capacity * 10);
    return seats.map((seatId, i) => {
      const angle = (i / seats.length) * 2 * Math.PI - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return (
        <div key={seatId} className="seat-wrapper" style={{ transform: `translate(${x}px, ${y}px)` }}>
          <Seat seatId={seatId} index={i} tableShape="round" />
        </div>
      );
    });
  };

  const renderRectangleSeats = () => {
    const perSide = Math.ceil(table.capacity / 2);
    return seats.map((seatId, i) => {
      const side = i < perSide ? 'top' : 'bottom';
      const pos = i < perSide ? i : i - perSide;
      const spacing = 52;
      const totalWidth = (perSide - 1) * spacing;
      const x = pos * spacing - totalWidth / 2;
      const y = side === 'top' ? -55 : 55;
      return (
        <div key={seatId} className="seat-wrapper" style={{ transform: `translate(${x}px, ${y}px)` }}>
          <Seat seatId={seatId} index={i} tableShape="rectangle" />
        </div>
      );
    });
  };

  return (
    <div
      className={`table-container ${dragging ? 'dragging' : ''} ${isFull ? 'full' : ''}`}
      style={{ left: table.x, top: table.y }}
      onMouseDown={handleMouseDown}
    >
      <div className={`table-surface ${table.shape}`}>
        <div className="table-info">
          <span className="table-name">{table.name}</span>
          <span className={`table-count ${isFull ? 'full' : ''}`}>
            {occupiedCount}/{table.capacity}
          </span>
        </div>

        <div className="seats-container">
          {table.shape === 'round' ? renderRoundSeats() : renderRectangleSeats()}
        </div>
      </div>

      <button
        className="table-remove-btn"
        onClick={() => removeTable(table.id)}
        title="Remove table"
      >×</button>
    </div>
  );
}
