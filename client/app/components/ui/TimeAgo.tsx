import type React from "react";

interface TimeAgoProps {
  date: string | Date;
}

const WEEK_DAYS_LT = [
  "sekmadienį",
  "pirmadienį",
  "antradienį",
  "trečiadienį",
  "ketvirtadienį",
  "penktadienį",
  "šeštadienį",
];

export const TimeAgo: React.FC<TimeAgoProps> = ({ date }) => {
  const now = new Date();
  const target = new Date(date);

  const diffMs = now.getTime() - target.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return <span>prieš {diffSeconds} s</span>;
  }

  if (diffMinutes < 60) {
    return <span>prieš {diffMinutes} min</span>;
  }

  if (diffHours < 24) {
    return <span>prieš {diffHours} h</span>;
  }

  if (diffDays === 0) {
    return <span>šiandien</span>;
  }

  if (diffDays === 1) {
    return <span>vakar</span>;
  }

  if (diffDays < 7) {
    return <span>{WEEK_DAYS_LT[target.getDay()]}</span>;
  }

  return <span>{target.toLocaleDateString("lt-LT")}</span>;
};
