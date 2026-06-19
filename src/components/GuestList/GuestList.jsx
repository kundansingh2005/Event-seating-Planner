import React, { useState } from 'react';
import { useSeating } from '../../context/SeatingContext';
import GuestCard from '../GuestCard/GuestCard';
import SearchBar from '../SearchBar/SearchBar';
import { GROUP_COLORS } from '../../data/sampleData';
import './GuestList.css';

const GROUPS = ['Family', 'Friends', 'Work', 'VIP'];

export default function GuestList() {
  const { filteredGuests, seatAssignments, addGuest, getUnseatedGuests } = useSeating();
  const [tab, setTab] = useState('all'); // 'all' | 'unseated' | 'seated'
  const [showAdd, setShowAdd] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', group: 'Family' });

  const seatedIds = new Set(Object.values(seatAssignments));

  const displayed = filteredGuests.filter(g => {
    if (tab === 'unseated') return !seatedIds.has(g.id);
    if (tab === 'seated') return seatedIds.has(g.id);
    return true;
  });

  const handleAddGuest = () => {
    if (!newGuest.name.trim()) return;
    addGuest({ ...newGuest });
    setNewGuest({ name: '', email: '', group: 'Family' });
    setShowAdd(false);
  };

  const unseatedCount = filteredGuests.filter(g => !seatedIds.has(g.id)).length;
  const seatedCount = filteredGuests.filter(g => seatedIds.has(g.id)).length;

  return (
    <aside className="guest-list">
      <div className="guest-list-header">
        <h2 className="guest-list-title">Attendees</h2>
        <button className="add-guest-btn" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕' : '+ Add'}
        </button>
      </div>

      {showAdd && (
        <div className="add-guest-form">
          <input
            placeholder="Full name *"
            value={newGuest.name}
            onChange={e => setNewGuest(p => ({ ...p, name: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAddGuest()}
            autoFocus
          />
          <input
            placeholder="Email (optional)"
            value={newGuest.email}
            onChange={e => setNewGuest(p => ({ ...p, email: e.target.value }))}
          />
          <select
            value={newGuest.group}
            onChange={e => setNewGuest(p => ({ ...p, group: e.target.value }))}
          >
            {GROUPS.map(g => <option key={g}>{g}</option>)}
          </select>
          <button className="confirm-add-btn" onClick={handleAddGuest}>Add Guest</button>
        </div>
      )}

      <SearchBar />

      <div className="guest-tabs">
        <button className={`tab-btn ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
          All <span className="tab-count">{filteredGuests.length}</span>
        </button>
        <button className={`tab-btn ${tab === 'unseated' ? 'active' : ''}`} onClick={() => setTab('unseated')}>
          Waiting <span className="tab-count warn">{unseatedCount}</span>
        </button>
        <button className={`tab-btn ${tab === 'seated' ? 'active' : ''}`} onClick={() => setTab('seated')}>
          Seated <span className="tab-count ok">{seatedCount}</span>
        </button>
      </div>

      {/* Legend */}
      <div className="group-legend">
        {Object.entries(GROUP_COLORS).filter(([k]) => k !== 'Default').map(([group, color]) => (
          <span key={group} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            {group}
          </span>
        ))}
      </div>

      <div className="guest-list-scroll">
        {displayed.length === 0 ? (
          <div className="guest-empty">
            <p>{tab === 'unseated' ? 'All guests are seated! 🎉' : 'No guests found'}</p>
          </div>
        ) : (
          displayed.map(guest => (
            <GuestCard key={guest.id} guest={guest} isSeated={seatedIds.has(guest.id)} />
          ))
        )}
      </div>
    </aside>
  );
}
