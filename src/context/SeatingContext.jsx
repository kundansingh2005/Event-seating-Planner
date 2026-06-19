import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sampleGuests } from '../data/sampleData';

const SeatingContext = createContext(null);

export function SeatingProvider({ children }) {
  const [eventType, setEventType] = useState('Wedding');
  const [guests, setGuests] = useState(sampleGuests);
  const [tables, setTables] = useState([
    { id: 't1', name: 'Table 1', capacity: 6, shape: 'round', x: 80, y: 80 },
    { id: 't2', name: 'Table 2', capacity: 6, shape: 'round', x: 300, y: 80 },
    { id: 't3', name: 'Table 3', capacity: 8, shape: 'rectangle', x: 180, y: 250 },
  ]);
  // seatAssignments: { seatId: guestId }
  const [seatAssignments, setSeatAssignments] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [highlightedGuest, setHighlightedGuest] = useState(null);

  const addTable = useCallback((config) => {
    const newTable = {
      id: uuidv4(),
      name: config.name || `Table ${tables.length + 1}`,
      capacity: config.capacity || 6,
      shape: config.shape || 'round',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    };
    setTables(prev => [...prev, newTable]);
  }, [tables.length]);

  const removeTable = useCallback((tableId) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
    setSeatAssignments(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (key.startsWith(tableId)) delete updated[key];
      });
      return updated;
    });
  }, []);

  const updateTablePosition = useCallback((tableId, x, y) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, x, y } : t));
  }, []);

  const addGuest = useCallback((guestData) => {
    const initials = guestData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    setGuests(prev => [...prev, { id: uuidv4(), avatar: initials, ...guestData }]);
  }, []);

  const removeGuest = useCallback((guestId) => {
    setGuests(prev => prev.filter(g => g.id !== guestId));
    setSeatAssignments(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (updated[key] === guestId) delete updated[key];
      });
      return updated;
    });
  }, []);

  const assignSeat = useCallback((seatId, guestId) => {
    setSeatAssignments(prev => {
      const updated = { ...prev };
      // Remove guest from any previous seat
      Object.keys(updated).forEach(key => {
        if (updated[key] === guestId) delete updated[key];
      });
      if (guestId) {
        updated[seatId] = guestId;
      } else {
        delete updated[seatId];
      }
      return updated;
    });
  }, []);

  const unassignGuest = useCallback((guestId) => {
    setSeatAssignments(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (updated[key] === guestId) delete updated[key];
      });
      return updated;
    });
  }, []);

  const getGuestById = useCallback((id) => guests.find(g => g.id === id), [guests]);

  const getSeatGuest = useCallback((seatId) => {
    const guestId = seatAssignments[seatId];
    return guestId ? getGuestById(guestId) : null;
  }, [seatAssignments, getGuestById]);

  const getUnseatedGuests = useCallback(() => {
    const seatedIds = new Set(Object.values(seatAssignments));
    return guests.filter(g => !seatedIds.has(g.id));
  }, [guests, seatAssignments]);

  const clearAllAssignments = useCallback(() => setSeatAssignments({}), []);

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.group?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SeatingContext.Provider value={{
      eventType, setEventType,
      guests, filteredGuests, addGuest, removeGuest,
      tables, addTable, removeTable, updateTablePosition,
      seatAssignments, assignSeat, unassignGuest,
      getGuestById, getSeatGuest, getUnseatedGuests,
      clearAllAssignments,
      searchQuery, setSearchQuery,
      selectedGuest, setSelectedGuest,
      highlightedGuest, setHighlightedGuest,
    }}>
      {children}
    </SeatingContext.Provider>
  );
}

export const useSeating = () => {
  const ctx = useContext(SeatingContext);
  if (!ctx) throw new Error('useSeating must be used within SeatingProvider');
  return ctx;
};
