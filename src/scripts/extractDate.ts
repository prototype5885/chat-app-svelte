export type DateFormat = "short" | "medium" | "long";

export function extractTime(id: string, format: DateFormat) {
  const timeChars = id.substring(0, 10); // first 10 characters contain the time
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

  let timestamp = 0;

  for (let i = 0; i < timeChars.length; i++) {
    const char = timeChars[i];
    const value = alphabet.indexOf(char);
    timestamp = timestamp * 32 + value;
  }

  const options: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case "short": {
      options.timeStyle = "short";
      break;
    }
    case "medium": {
      options.year = "numeric";
      options.month = "long";
      options.day = "numeric";
      break;
    }
    case "long": {
      options.year = "numeric";
      options.month = "long";
      options.day = "numeric";
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.hour12 = false;
      break;
    }
    default: {
      throw "Wrong date format";
    }
  }

  return new Date(timestamp).toLocaleString(undefined, options);
}
