import { useState, useMemo } from 'react';
import { usePlanner, GROUPS } from '../PlannerContext';
import GuestCard from './GuestCard';

export default function Sidebar() {
  const { guests, tables, dispatch } = usePlanner();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'waiting' | 'seated'
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState('family');

  const seatedCount = guests.filter(g => g.tableId !== null).length;
  const waitingCount = guests.length - seatedCount;

  // Filter + search
  const filtered = useMemo(() => {
    let list = guests;
    if (filter === 'waiting') list = list.filter(g => g.tableId === null);
    if (filter === 'seated') list = list.filter(g => g.tableId !== null);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(q));
    }
    return list;
  }, [guests, filter, search]);

  // Group guests by their group for display
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(g => {
      if (!map[g.group]) map[g.group] = [];
      map[g.group].push(g);
    });
    // Order: vip, family, friends, work
    const order = ['vip', 'family', 'friends', 'work'];
    return order
      .filter(key => map[key]?.length > 0)
      .map(key => ({ groupId: key, guests: map[key] }));
  }, [filtered]);

  const handleAddGuest = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    dispatch({ type: 'ADD_GUEST', payload: { name: newName.trim(), group: newGroup } });
    setNewName('');
  };

  const handleDeleteGuest = (guestId) => {
    dispatch({ type: 'DELETE_GUEST', payload: guestId });
  };

  const handleUnseatGuest = (guestId) => {
    dispatch({ type: 'UNSEAT_GUEST', payload: guestId });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Guests</h2>

        {/* Search */}
        <div className="search-field">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search guests..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All<span className="tab-count"> {guests.length}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'waiting' ? 'active' : ''}`}
            onClick={() => setFilter('waiting')}
          >
            Waiting<span className="tab-count"> {waitingCount}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'seated' ? 'active' : ''}`}
            onClick={() => setFilter('seated')}
          >
            Seated<span className="tab-count"> {seatedCount}</span>
          </button>
        </div>
      </div>

      {/* Guest List */}
      <div className="guest-list-area">
        {grouped.length > 0 ? (
          grouped.map(({ groupId, guests: groupGuests }) => {
            const groupInfo = GROUPS[groupId];
            return (
              <div key={groupId} className="group-section">
                <div className="group-label">
                  <div className="group-dot" style={{ backgroundColor: groupInfo.hex }} />
                  <span>{groupInfo.label}</span>
                </div>
                {groupGuests.map(guest => {
                  const isSeated = guest.tableId !== null;
                  const tableName = isSeated
                    ? tables.find(t => t.id === guest.tableId)?.name || '?'
                    : null;
                  return (
                    <div key={guest.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <GuestCard guest={guest} />
                      </div>
                      {isSeated && (
                        <span className="guest-card-seat-info">
                          {tableName}
                        </span>
                      )}
                      {isSeated ? (
                        <button
                          className="guest-card-remove"
                          title="Unseat"
                          onClick={() => handleUnseatGuest(guest.id)}
                          style={{ opacity: 1, color: 'var(--text-tertiary)' }}
                        >
                          ↩
                        </button>
                      ) : (
                        <button
                          className="guest-card-remove"
                          title="Remove guest"
                          onClick={() => handleDeleteGuest(guest.id)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">⊘</div>
            <p>
              {search
                ? 'No guests match your search.'
                : filter === 'seated'
                ? 'No guests seated yet. Drag guests from the waiting list onto seats.'
                : filter === 'waiting'
                ? 'All guests have been seated!'
                : 'No guests added yet. Use the form below to add guests.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Guest Form */}
      <div className="add-guest-area">
        <form className="add-guest-form" onSubmit={handleAddGuest}>
          <div className="add-guest-row">
            <input
              type="text"
              placeholder="Guest name..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <select value={newGroup} onChange={e => setNewGroup(e.target.value)}>
              {Object.values(GROUPS).map(g => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-accent" disabled={!newName.trim()}>
            Add Guest
          </button>
        </form>
      </div>
    </aside>
  );
}
