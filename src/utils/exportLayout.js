export function exportLayout(tables, guests, seatAssignments, eventType) {
  const seatedMap = {};
  Object.entries(seatAssignments).forEach(([seatId, guestId]) => {
    const tableId = seatId.split('_')[0];
    if (!seatedMap[tableId]) seatedMap[tableId] = [];
    const guest = guests.find(g => g.id === guestId);
    if (guest) seatedMap[tableId].push(guest);
  });

  const data = {
    event: eventType,
    exportedAt: new Date().toLocaleString(),
    totalGuests: guests.length,
    seatedGuests: Object.values(seatAssignments).length,
    tables: tables.map(t => ({
      name: t.name,
      capacity: t.capacity,
      shape: t.shape,
      guests: (seatedMap[t.id] || []).map(g => ({ name: g.name, group: g.group, email: g.email })),
      occupancy: `${(seatedMap[t.id] || []).length}/${t.capacity}`,
    })),
    unseatedGuests: guests
      .filter(g => !Object.values(seatAssignments).includes(g.id))
      .map(g => ({ name: g.name, group: g.group })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `seating-layout-${eventType.toLowerCase()}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsCSV(tables, guests, seatAssignments) {
  const rows = [['Guest Name', 'Group', 'Email', 'Table', 'Status']];
  const seatedIds = new Set(Object.values(seatAssignments));

  guests.forEach(guest => {
    let tableName = 'Unassigned';
    Object.entries(seatAssignments).forEach(([seatId, guestId]) => {
      if (guestId === guest.id) {
        const tableId = seatId.split('_')[0];
        const table = tables.find(t => t.id === tableId);
        if (table) tableName = table.name;
      }
    });
    rows.push([guest.name, guest.group || '', guest.email || '', tableName, seatedIds.has(guest.id) ? 'Seated' : 'Unassigned']);
  });

  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `seating-layout.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
