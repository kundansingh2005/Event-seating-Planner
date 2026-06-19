import { useState, useEffect } from 'react';

export default function TableEditModal({ table, onSave, onClose }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('round');
  const [capacity, setCapacity] = useState(6);

  const isNew = !table;

  useEffect(() => {
    if (table) {
      setName(table.name);
      setType(table.type);
      setCapacity(table.capacity);
    } else {
      setName('');
      setCapacity(6);
    }
  }, [table]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      ...(table || {}),
      name: name.trim(),
      type,
      capacity: Math.max(1, Math.min(16, parseInt(capacity, 10) || 6)),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <h3 className="modal-heading">
          {isNew ? 'Add Table' : 'Edit Table'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Head Table, Table 4"
              autoFocus
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Shape</label>
            <select
              className="form-select"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="round">Round</option>
              <option value="rect">Rectangular</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Seats</label>
            <input
              className="form-input"
              type="number"
              min="1"
              max="16"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-accent" disabled={!name.trim()}>
              {isNew ? 'Add Table' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
