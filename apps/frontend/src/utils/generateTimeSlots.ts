import moment from 'moment';

interface TimeSlot {
  _id: string;
  startTime: string;
  maxResourcePerHour: number;
}

export const generateTimeSlots = (
  openingHour: string,
  closingHour: string,
  maxResourcePerHour: number
): TimeSlot[] => {
  // Define the format for the time strings
  const timeFormat = 'h:00A';

  // Parse the opening and closing hours into Moment objects
  const start = moment(openingHour, timeFormat);
  const end = moment(closingHour, timeFormat);

  // Array to hold the generated time slots
  const timeSlots: TimeSlot[] = [];

  let idCounter = 1;

  // Generate time slots from opening to closing hour
  while (start.isSameOrBefore(end)) {
    timeSlots.push({
      _id: idCounter.toString(), // Use a simple numeric ID
      startTime: start.format(timeFormat),
      maxResourcePerHour,
    });

    // Increment the ID counter
    idCounter++;

    // Move to the next hour
    start.add(1, 'hour');
  }

  return timeSlots;
};
