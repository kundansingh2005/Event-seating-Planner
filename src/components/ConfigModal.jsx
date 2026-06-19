import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../types';

export default function ConfigModal({
  isOpen,
  mode, // 'table' or 'guest'
  initialData, // item details if editing, otherwise null
  onClose,
  onSave
}) {
  const [tableName, setTableName] = useState('');
  const [tableType, setTableType] = useState('round');
  const [tableCapacity, setTableCapacity] = useState(8);

  const [guestName, setGuestName] = useState('');
  const [guestCategory, setGuestCategory] = useState('general');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'table') {
        setTableName(initialData?.name || '');
        setTableType(initialData?.type || 'round');
        setTableCapacity(initialData?.capacity || 8);
      } else if (mode === 'guest') {
        setGuestName(initialData?.name || '');
        setGuestCategory(initialData?.category || 'general');
      }
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'table') {
      if (!tableName.trim()) return;
      onSave({
        ...initialData,
        name: tableName.trim(),
        type: tableType,
        capacity: parseInt(tableCapacity, 10) || 4
      });
    } else {
      if (!guestName.trim()) return;
      onSave({
        ...initialData,
        name: guestName.trim(),
        category: guestCategory
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? 'Edit' : 'Add New'} {mode === 'table' ? 'Table' : 'Guest'}
          </h3>
          <button className="btn btn-secondary btn-icon-only btn-sm" onClick={onClose} style={{ border: 'none' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {mode === 'table' ? (
            <>
              <div className="form-group">
                <label className="form-label">Table / Row Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Table 4, Row B, VIP Circle"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Layout Shape</label>
                <select
                  className="select"
                  value={tableType}
                  onChange={(e) => setTableType(e.target.value)}
                >
                  <option value="round">Round Table</option>
                  <option value="rectangular">Rectangular Table</option>
                  <option value="row">Seat Row (Classroom / Seminar)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Capacity (Max Seats)</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="20"
                  value={tableCapacity}
                  onChange={(e) => setTableCapacity(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Jane Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Group</label>
                <select
                  className="select"
                  value={guestCategory}
                  onChange={(e) => setGuestCategory(e.target.value)}
                >
                  {Object.values(CATEGORIES).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
