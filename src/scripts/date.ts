export type DateFormat = "short" | "medium" | "long";

function extractTimestamp(id: string): number {
  const timeChars = id.substring(0, 10); // first 10 characters contain the time
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

  let timestamp = 0;

  for (let i = 0; i < timeChars.length; i++) {
    const char = timeChars[i];
    const value = alphabet.indexOf(char);
    timestamp = timestamp * 32 + value;
  }
  return timestamp;
}

export function getShortDate(id: string): string {
  const timestamp = extractTimestamp(id);
  return new Date(timestamp).toLocaleString(undefined, { timeStyle: "short" });
}

export function getMediumDate(id: string): string {
  const timestamp = extractTimestamp(id);
  return new Date(timestamp).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getLongDate(id: string): string {
  const timestamp = extractTimestamp(id);
  const date = new Date(timestamp);

  // check if msg is from today
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return date.toLocaleString(undefined, { timeStyle: "short" });
  }

  // check if msg is from yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday at ${date.toLocaleString(undefined, { timeStyle: "short" })}`;
  }

  // return long date if older than above
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function isSameDay(currentID: string, nextID: string): boolean {
  const currentDate = new Date(extractTimestamp(currentID));
  const nextDate = new Date(extractTimestamp(nextID));
  return (
    currentDate.getFullYear() === nextDate.getFullYear() &&
    currentDate.getMonth() === nextDate.getMonth() &&
    currentDate.getDate() === nextDate.getDate()
  );
}

export function isOlderThanFiveMins(
  currentID: string,
  nextID: string,
): boolean {
  const currentMins = extractTimestamp(currentID) / (1000 * 60);
  const nextMins = extractTimestamp(nextID) / (1000 * 60);

  const difference = nextMins - currentMins;
  return difference > 5.0;
}

export function utcToLocal(date: string) {
  return new Date(`${date}Z`).toLocaleString();
}
