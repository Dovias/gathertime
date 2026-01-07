export function getFormattedDate() {
  const today = new Date().toLocaleDateString("lt-LT", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return formattedDate;
}

export const pad = (n: number) => String(n).padStart(2, "0");

export const toBackendLocalDateTime = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours(),
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

export const startOfWeek = (base: Date) => {
  const start = new Date(base);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const endOfWeek = (base: Date) => {
  const start = startOfWeek(base);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 0);
  return end;
};

export const parseLocalDateTime = (value: string): Date => {
  const normalized = value.trim().replace(" ", "T");
  const [datePart, timePart = "00:00:00"] = normalized.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh = "0", mm = "0", ssRaw = "0"] = timePart.split(":");
  const [ss = "0", ms = "0"] = ssRaw.split(".");
  return new Date(y, m - 1, d, Number(hh), Number(mm), Number(ss), Number(ms));
};

export const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
    aStart <= bEnd && aEnd >= bStart;

export const formatDateForInput = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
};