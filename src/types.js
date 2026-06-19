// Event templates and data categories constants

export const CATEGORIES = {
  // Wedding Categories
  vip: { id: 'vip', label: 'VIP', color: '#f59e0b', bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  bride: { id: 'bride', label: "Bride's Side", color: '#ec4899', bg: '#fce7f3', text: '#9d174d', border: '#fbcfe8' },
  groom: { id: 'groom', label: "Groom's Side", color: '#3b82f6', bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
  // General Categories
  general: { id: 'general', label: 'General Guest', color: '#10b981', bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  // Seminar Categories
  speaker: { id: 'speaker', label: 'Speaker', color: '#8b5cf6', bg: '#ede9fe', text: '#5b21b6', border: '#ddd6fe' },
  organizer: { id: 'organizer', label: 'Organizer', color: '#ef4444', bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  // Classroom Categories
  student: { id: 'student', label: 'Student', color: '#06b6d4', bg: '#ecfeff', text: '#155e75', border: '#cffafe' },
  teacher: { id: 'teacher', label: 'Teacher', color: '#f97316', bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' }
};

export const TEMPLATES = {
  wedding: {
    id: 'wedding',
    label: 'Wedding Seating Plan',
    description: 'Round tables, VIP sections, and split families.',
    tables: [
      { id: 't-1', name: 'Head Table (VIP)', type: 'round', capacity: 6, x: 450, y: 100, seats: {} },
      { id: 't-2', name: "Bride's Family", type: 'round', capacity: 8, x: 220, y: 250, seats: {} },
      { id: 't-3', name: "Groom's Family", type: 'round', capacity: 8, x: 680, y: 250, seats: {} },
      { id: 't-4', name: 'Friends Table A', type: 'round', capacity: 8, x: 220, y: 450, seats: {} },
      { id: 't-5', name: 'Friends Table B', type: 'round', capacity: 8, x: 680, y: 450, seats: {} },
    ],
    guests: [
      // VIPs
      { id: 'g-1', name: 'Evelyn Bennett (Grandmother)', category: 'vip', tableId: null, seatIndex: null },
      { id: 'g-2', name: 'Arthur Bennett (Grandfather)', category: 'vip', tableId: null, seatIndex: null },
      { id: 'g-3', name: 'Mayor Richard Cole', category: 'vip', tableId: null, seatIndex: null },
      { id: 'g-4', name: 'Lady Genevieve Cole', category: 'vip', tableId: null, seatIndex: null },
      
      // Bride's family
      { id: 'g-5', name: 'Sarah Miller (Mother of Bride)', category: 'bride', tableId: null, seatIndex: null },
      { id: 'g-6', name: 'David Miller (Father of Bride)', category: 'bride', tableId: null, seatIndex: null },
      { id: 'g-7', name: 'Jessica Miller (Sister of Bride)', category: 'bride', tableId: null, seatIndex: null },
      { id: 'g-8', name: 'Michael Miller (Brother of Bride)', category: 'bride', tableId: null, seatIndex: null },
      { id: 'g-9', name: 'Uncle George Miller', category: 'bride', tableId: null, seatIndex: null },
      { id: 'g-10', name: 'Aunt Clara Miller', category: 'bride', tableId: null, seatIndex: null },

      // Groom's family
      { id: 'g-11', name: 'Mary Davis (Mother of Groom)', category: 'groom', tableId: null, seatIndex: null },
      { id: 'g-12', name: 'Robert Davis (Father of Groom)', category: 'groom', tableId: null, seatIndex: null },
      { id: 'g-13', name: 'Thomas Davis (Brother of Groom)', category: 'groom', tableId: null, seatIndex: null },
      { id: 'g-14', name: 'Emily Davis (Sister of Groom)', category: 'groom', tableId: null, seatIndex: null },
      { id: 'g-15', name: 'Aunt Susan Davis', category: 'groom', tableId: null, seatIndex: null },
      { id: 'g-16', name: 'Uncle Frank Davis', category: 'groom', tableId: null, seatIndex: null },

      // Friends
      { id: 'g-17', name: 'Liam Wilson (Best Man)', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-18', name: 'Olivia Taylor (Maid of Honor)', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-19', name: 'Lucas Martin', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-20', name: 'Emma Anderson', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-21', name: 'Henry Thomas', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-22', name: 'Sophia Jackson', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-23', name: 'Ethan White', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-24', name: 'Isabella Harris', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-25', name: 'James Martin', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-26', name: 'Charlotte Clark', category: 'general', tableId: null, seatIndex: null },
    ]
  },
  seminar: {
    id: 'seminar',
    label: 'Corporate Seminar Layout',
    description: 'Long rectangular tables, panelist rows, and speaker stage.',
    tables: [
      { id: 't-1', name: 'Speaker Panel Row', type: 'row', capacity: 4, x: 450, y: 80, seats: {} },
      { id: 't-2', name: 'Attendee Block Left 1', type: 'rectangular', capacity: 10, x: 230, y: 240, seats: {} },
      { id: 't-3', name: 'Attendee Block Right 1', type: 'rectangular', capacity: 10, x: 670, y: 240, seats: {} },
      { id: 't-4', name: 'Attendee Block Left 2', type: 'rectangular', capacity: 10, x: 230, y: 440, seats: {} },
      { id: 't-5', name: 'Attendee Block Right 2', type: 'rectangular', capacity: 10, x: 670, y: 440, seats: {} },
    ],
    guests: [
      // Speakers
      { id: 'g-1', name: 'Dr. Jane Foster (Keynote)', category: 'speaker', tableId: null, seatIndex: null },
      { id: 'g-2', name: 'Prof. Charles Xavier', category: 'speaker', tableId: null, seatIndex: null },
      { id: 'g-3', name: 'Tony Stark (Panelist)', category: 'speaker', tableId: null, seatIndex: null },
      { id: 'g-4', name: 'Bruce Banner (Panelist)', category: 'speaker', tableId: null, seatIndex: null },

      // Organizers
      { id: 'g-5', name: 'Nick Fury (Event Coordinator)', category: 'organizer', tableId: null, seatIndex: null },
      { id: 'g-6', name: 'Phil Coulson (Co-organizer)', category: 'organizer', tableId: null, seatIndex: null },
      { id: 'g-7', name: 'Maria Hill (Press Relations)', category: 'organizer', tableId: null, seatIndex: null },

      // General Attendees
      { id: 'g-8', name: 'Peter Parker', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-9', name: 'Ned Leeds', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-10', name: 'Mary Jane Watson', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-11', name: 'Gwen Stacy', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-12', name: 'Miles Morales', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-13', name: 'Harry Osborn', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-14', name: 'Steve Rogers', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-15', name: 'Natasha Romanoff', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-16', name: 'Clint Barton', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-17', name: 'Sam Wilson', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-18', name: 'Bucky Barnes', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-19', name: 'Wanda Maximoff', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-20', name: 'Vision', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-21', name: 'Carol Danvers', category: 'general', tableId: null, seatIndex: null },
      { id: 'g-22', name: 'T\'Challa', category: 'general', tableId: null, seatIndex: null },
    ]
  },
  classroom: {
    id: 'classroom',
    label: 'Classroom / Lecture Hall',
    description: 'Rows facing a blackboard, teacher desk, and dual seating blocks.',
    tables: [
      { id: 't-1', name: 'Teacher Desk', type: 'rectangular', capacity: 2, x: 450, y: 70, seats: {} },
      { id: 't-2', name: 'Row A Left', type: 'row', capacity: 4, x: 250, y: 200, seats: {} },
      { id: 't-3', name: 'Row A Right', type: 'row', capacity: 4, x: 650, y: 200, seats: {} },
      { id: 't-4', name: 'Row B Left', type: 'row', capacity: 4, x: 250, y: 340, seats: {} },
      { id: 't-5', name: 'Row B Right', type: 'row', capacity: 4, x: 650, y: 340, seats: {} },
      { id: 't-6', name: 'Row C Left', type: 'row', capacity: 4, x: 250, y: 480, seats: {} },
      { id: 't-7', name: 'Row C Right', type: 'row', capacity: 4, x: 650, y: 480, seats: {} },
    ],
    guests: [
      // Teachers
      { id: 'g-1', name: 'Professor Minerva McGonagall', category: 'teacher', tableId: null, seatIndex: null },
      { id: 'g-2', name: 'Professor Albus Dumbledore', category: 'teacher', tableId: null, seatIndex: null },

      // Students
      { id: 'g-3', name: 'Harry Potter', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-4', name: 'Hermione Granger', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-5', name: 'Ron Weasley', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-6', name: 'Draco Malfoy', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-7', name: 'Neville Longbottom', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-8', name: 'Luna Lovegood', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-9', name: 'Ginny Weasley', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-10', name: 'Fred Weasley', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-11', name: 'George Weasley', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-12', name: 'Cho Chang', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-13', name: 'Cedric Diggory', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-14', name: 'Seamus Finnigan', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-15', name: 'Dean Thomas', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-16', name: 'Lavender Brown', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-17', name: 'Pansy Parkinson', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-18', name: 'Blaise Zabini', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-19', name: 'Gregory Goyle', category: 'student', tableId: null, seatIndex: null },
      { id: 'g-20', name: 'Vincent Crabbe', category: 'student', tableId: null, seatIndex: null },
    ]
  }
};
