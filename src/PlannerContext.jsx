import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ── Group definitions ──────────────────────────────────────
export const GROUPS = {
  family: { id: 'family', label: 'Family', color: 'var(--group-family)', bg: 'var(--group-family-bg)', hex: '#7c9fcc' },
  friends: { id: 'friends', label: 'Friends', color: 'var(--group-friends)', bg: 'var(--group-friends-bg)', hex: '#8bc49a' },
  work: { id: 'work', label: 'Work', color: 'var(--group-work)', bg: 'var(--group-work-bg)', hex: '#c9a85c' },
  vip: { id: 'vip', label: 'VIP', color: 'var(--group-vip)', bg: 'var(--group-vip-bg)', hex: '#d4887c' },
};

// ── Default data — enough to look real, not lorem ipsum ────
function makeDefaultState() {
  const tables = [
    { id: uuidv4(), name: 'Head Table', type: 'rect', capacity: 8, x: 560, y: 80 },
    { id: uuidv4(), name: 'Table 1', type: 'round', capacity: 6, x: 240, y: 300 },
    { id: uuidv4(), name: 'Table 2', type: 'round', capacity: 6, x: 560, y: 320 },
    { id: uuidv4(), name: 'Table 3', type: 'round', capacity: 6, x: 880, y: 300 },
    { id: uuidv4(), name: 'Table 4', type: 'round', capacity: 8, x: 400, y: 540 },
    { id: uuidv4(), name: 'Table 5', type: 'round', capacity: 8, x: 720, y: 540 },
  ];

  const guestNames = [
    ['Eleanor Vance', 'vip'], ['Margaret Chen', 'vip'], ['Theodore Ashford', 'vip'],
    ['Richard Harmon', 'family'], ['Susan Harmon', 'family'], ['James Harmon Jr.', 'family'],
    ['Patricia Delgado', 'family'], ['Robert Delgado', 'family'], ['Anna Kowalski', 'family'],
    ['Paul Kowalski', 'family'], ['Catherine Bell', 'family'],
    ['Daniel Ortiz', 'friends'], ['Samantha Rhodes', 'friends'], ['Marcus Webb', 'friends'],
    ['Nina Petrovich', 'friends'], ['Oliver Chang', 'friends'], ['Rachel Kim', 'friends'],
    ['Aaron Foster', 'friends'], ['Lily Nakamura', 'friends'],
    ['Victoria Sterling', 'work'], ['Benjamin Cruz', 'work'], ['Helen Zhao', 'work'],
    ['Kevin Okafor', 'work'], ['Diana Moreno', 'work'],
  ];

  const guests = guestNames.map(([name, group]) => ({
    id: uuidv4(),
    name,
    group,
    tableId: null,
    seatIndex: null,
  }));

  return { tables, guests };
}

// ── Reducer ────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'ADD_TABLE': {
      const newTable = {
        id: uuidv4(),
        name: action.payload.name,
        type: action.payload.type,
        capacity: action.payload.capacity,
        x: 200 + Math.random() * 600,
        y: 150 + Math.random() * 400,
      };
      return { ...state, tables: [...state.tables, newTable] };
    }

    case 'UPDATE_TABLE':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
        // Unseat guests who now exceed capacity
        guests: state.guests.map(g => {
          if (g.tableId === action.payload.id && g.seatIndex >= action.payload.capacity) {
            return { ...g, tableId: null, seatIndex: null };
          }
          return g;
        }),
      };

    case 'DELETE_TABLE':
      return {
        ...state,
        tables: state.tables.filter(t => t.id !== action.payload),
        guests: state.guests.map(g =>
          g.tableId === action.payload ? { ...g, tableId: null, seatIndex: null } : g
        ),
      };

    case 'MOVE_TABLE':
      return {
        ...state,
        tables: state.tables.map(t =>
          t.id === action.payload.id
            ? { ...t, x: action.payload.x, y: action.payload.y }
            : t
        ),
      };

    case 'ADD_GUEST': {
      const newGuest = {
        id: uuidv4(),
        name: action.payload.name,
        group: action.payload.group,
        tableId: null,
        seatIndex: null,
      };
      return { ...state, guests: [...state.guests, newGuest] };
    }

    case 'DELETE_GUEST':
      return {
        ...state,
        guests: state.guests.filter(g => g.id !== action.payload),
      };

    case 'SEAT_GUEST': {
      const { guestId, tableId, seatIndex } = action.payload;
      // Find if someone is already in that seat
      const occupant = state.guests.find(
        g => g.tableId === tableId && g.seatIndex === seatIndex
      );
      const movingGuest = state.guests.find(g => g.id === guestId);
      
      return {
        ...state,
        guests: state.guests.map(g => {
          if (g.id === guestId) {
            return { ...g, tableId, seatIndex };
          }
          // Swap: if there was an occupant, move them to the dragged guest's old spot
          if (occupant && g.id === occupant.id) {
            if (movingGuest.tableId != null) {
              return { ...g, tableId: movingGuest.tableId, seatIndex: movingGuest.seatIndex };
            }
            return { ...g, tableId: null, seatIndex: null };
          }
          return g;
        }),
      };
    }

    case 'UNSEAT_GUEST':
      return {
        ...state,
        guests: state.guests.map(g =>
          g.id === action.payload ? { ...g, tableId: null, seatIndex: null } : g
        ),
      };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────
const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const defaultState = makeDefaultState();
  const [state, dispatch] = useReducer(reducer, defaultState, (initial) => {
    try {
      const saved = localStorage.getItem('seating-planner');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tables?.length >= 0 && parsed.guests?.length >= 0) {
          return parsed;
        }
      }
    } catch (e) { /* ignore */ }
    return initial;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('seating-planner', JSON.stringify(state));
  }, [state]);

  // Computed stats
  const totalGuests = state.guests.length;
  const seatedCount = state.guests.filter(g => g.tableId !== null).length;
  const waitingCount = totalGuests - seatedCount;

  // Export JSON
  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seating-plan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  // Export CSV
  const exportCSV = useCallback(() => {
    const rows = [['Guest Name', 'Group', 'Table', 'Seat']];
    state.guests.forEach(g => {
      const table = state.tables.find(t => t.id === g.tableId);
      rows.push([
        g.name,
        g.group,
        table ? table.name : 'Unassigned',
        g.seatIndex != null ? `Seat ${g.seatIndex + 1}` : '—',
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seating-plan-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  // Import JSON
  const importJSON = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.tables && parsed.guests) {
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      } catch (err) {
        console.error('Invalid file', err);
      }
    };
    reader.readAsText(file);
  }, []);

  const value = {
    ...state,
    dispatch,
    totalGuests,
    seatedCount,
    waitingCount,
    exportJSON,
    exportCSV,
    importJSON,
  };

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be inside PlannerProvider');
  return ctx;
}
