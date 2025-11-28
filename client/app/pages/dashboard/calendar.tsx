import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";
import type { FreeTime } from "../../models/FreeTime.ts";
import { getFormattedDate } from "../../utilities/date";
import type { Route } from "./+types/calendar.ts";
import { userContext } from "../../context.ts";
import RegisterFreeTimeForm from "../../components/forms/RegisterFreeTimeForm.tsx";
import RegisterMeetingForm from "../../components/forms/RegisterMeetingForm.tsx";

export function clientLoader({ context }: Route.ClientLoaderArgs) {
  return context.get(userContext);
}

export default function Calendar({ loaderData: user }: Route.ComponentProps) {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeLabelsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [freeTimes, setFreeTimes] = useState<FreeTime[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formType, setFormType] = useState<"none" | "meeting" | "free-time">(
    "none",
  );

  useLayoutEffect(() => {
    const updateScrollbarWidth = () => {
      if (!scrollContainerRef.current) return;
      const { offsetWidth, clientWidth } = scrollContainerRef.current;
      setScrollbarWidth(offsetWidth - clientWidth);
    };

    updateScrollbarWidth();
    window.addEventListener("resize", updateScrollbarWidth);
    return () => window.removeEventListener("resize", updateScrollbarWidth);
  }, []);

  const weekDays = useMemo(() => {
    const days = [];
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }

    return days;
  }, [currentWeek]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = weekDays[0];
        const endDate = new Date(weekDays[6]);
        endDate.setHours(23, 59, 59, 999);

        const startDateTime = startDate.toISOString().slice(0, 19);
        const endDateTime = endDate.toISOString().slice(0, 19);

        const freeTimesResponse = await fetch(
          `http://localhost:8080/freetime/user/${user.id}?startDateTime=${startDateTime}&endDateTime=${endDateTime}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (freeTimesResponse.ok) {
          const freeTimesData: FreeTime[] = await freeTimesResponse.json();
          setFreeTimes(freeTimesData);
        }
      } catch (error) {
        console.error(`Error fetching data:`, error);
      }
    };

    fetchData();
  }, [weekDays, user.id]);

  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutSide);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [isDropdownOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (timeLabelsRef.current) {
      timeLabelsRef.current.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
    }
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const formatHeader = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString("lt-LT", { month: "long" })} ${start.getFullYear()}`;
  };

  const getEventPosition = (entry: FreeTime, day: Date) => {
    const entryStart = new Date(entry.startDateTime);
    const entryEnd = new Date(entry.endDateTime);

    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const displayStart = entryStart < dayStart ? dayStart : entryStart;
    const displayEnd = entryEnd > dayEnd ? dayEnd : entryEnd;

    const pixelsPerHour = 64;

    const startTotalHours =
      displayStart.getHours() + displayStart.getMinutes() / 60;
    const endTotalHours =
      displayEnd.getHours() +
      displayEnd.getMinutes() / 60 +
      (displayEnd > dayEnd ? 1 : 0);

    const top = startTotalHours * pixelsPerHour;
    const height = (endTotalHours - startTotalHours) * pixelsPerHour;

    return { top: `${top}px`, height: `${height}px` };
  };

  const getColorForEntry = ({ meeting }: FreeTime): string => {
    if (meeting === null) return "bg-purple-600";
    switch (meeting.status) {
      case "ARRANGED":
        return "bg-yellow-400";
      case "CONFIRMED":
        return "bg-green-400";
      case "CANCELED":
        return "bg-red-400";
      case "TIMEOUT":
        return "bg-gray-400";
      default:
        return "bg-blue-400";
    }
  };

  const getTextColorForEntry = ({ meeting }: FreeTime): string => {
    if (meeting === null) return "text-white";
    switch (meeting.status) {
      case "ARRANGED":
        return "text-amber-900";
      case "CONFIRMED":
        return "text-white";
      case "CANCELED":
        return "text-white";
      case "TIMEOUT":
        return "text-white";
      default:
        return "text-white";
    }
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date: Date) => isSameDay(date, today);
  const isTomorrow = (date: Date) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return isSameDay(date, tomorrow);
  };

  const getEntriesForDay = (day: Date): FreeTime[] => {
    const entries: FreeTime[] = freeTimes
      .filter((freeTime) => {
        const freeTimeStart = new Date(freeTime.startDateTime);
        const freeTimeEnd = new Date(freeTime.endDateTime);
        const dayStart = new Date(day);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(day);
        dayEnd.setHours(23, 59, 59, 999);

        return freeTimeStart <= dayEnd && freeTimeEnd >= dayStart;
      })
      .map((ft) => ({ ...ft, type: "freetime" as const }));

    return entries;
  };

  const getTodayMeetings = () => {
    return freeTimes.filter((meeting) => {
      const meetingDate = new Date(meeting.startDateTime);
      return isToday(meetingDate);
    });
  };

  const getTomorrowMeetings = () => {
    return freeTimes.filter((meeting) => {
      const meetingDate = new Date(meeting.startDateTime);
      return isTomorrow(meetingDate);
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const getCurrentMonthDays = () => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() || 7;
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 1; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getFormattedLabel = ({ meeting }: FreeTime): string => {
    return meeting == null ? "Laisvas laikas" : (meeting.summary ?? "");
  };

  const monthDays = getCurrentMonthDays();
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-6">
          <div className="text-base font-semibold text-gray-800 mb-2">
            {today.toLocaleDateString("lt-LT", { month: "long" })}
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs text-center">
            {["P", "A", "T", "K", "P", "Š", "S"].map((day) => (
              <div
                key={day}
                className="text-gray-500 font-normal text-[11px] pb-2"
              >
                {day}
              </div>
            ))}
            {monthDays.map((date, i) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${today.getMonth()}-${i}`}
                    className="py-1"
                  ></div>
                );
              }
              const dateObj = new Date(
                today.getFullYear(),
                today.getMonth(),
                date,
              );
              const todayCheck = isToday(dateObj);
              const tomorrowCheck = isTomorrow(dateObj);
              return (
                <div
                  key={`date-${date}`}
                  className={`py-1.5 ${
                    todayCheck
                      ? "bg-blue-500 text-white rounded-full font-bold"
                      : tomorrowCheck
                        ? "bg-gray-100 rounded-full"
                        : "text-gray-600 hover:bg-gray-50 rounded-full cursor-pointer"
                  }`}
                >
                  {date}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-400 text-xs">
              <FaCircle />
            </span>
            <span className="text-sm font-semibold text-gray-700">
              Šiandien
            </span>
          </div>
          {getTodayMeetings().length > 0 ? (
            <div className="space-y-2">
              {getTodayMeetings()
                .filter((freeTime) => freeTime.meeting !== null)
                .map((freeTime) => {
                  return (
                    <div
                      key={freeTime.id}
                      className="flex items-center text-xs"
                    >
                      <span
                        className={`${getColorForEntry(freeTime).replace("bg-", "text-")} text-xs mr-2`}
                      >
                        <FaCircle />
                      </span>
                      <span className="text-gray-700 flex-1 truncate">
                        {freeTime.meeting!.summary}
                      </span>
                      <span className="ml-2 text-gray-500">
                        {new Date(freeTime.startDateTime).toLocaleDateString(
                          "lt-LT",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">
              Šiandien susitikimų nėra
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 text-xs">
              <FaCircle />
            </span>
            <span className="text-sm font-semibold text-gray-700">Rytoj</span>
          </div>
          {getTomorrowMeetings().length > 0 ? (
            <div className="space-y-2">
              {getTomorrowMeetings()
                .filter((freeTime) => freeTime.meeting !== null)
                .map((freeTime) => {
                  return (
                    <div
                      key={freeTime.id}
                      className="flex items-center text-xs"
                    >
                      <span
                        className={`${getColorForEntry(freeTime).replace("bg-", "text-")} text-xs mr-2`}
                      >
                        <FaCircle />
                      </span>
                      <span className="text-gray-700 flex-1 truncate">
                        {freeTime.meeting!.summary}
                      </span>
                      <span className="ml-2 text-gray-500">
                        {new Date(freeTime.startDateTime).toLocaleDateString(
                          "lt-LT",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">
              Rytoj susitikimų nėra
            </p>
          )}
        </div>
      </aside>
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <div className="w-full mb-4 px-6 pt-6">
          <p className="text-2xl text-black">{getFormattedDate()}</p>
        </div>

        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-normal text-gray-800">
                {formatHeader()}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateWeek("prev")}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Previous week"
                >
                  <FaChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={goToToday}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  Šiandien
                </button>
                <button
                  type="button"
                  onClick={() => navigateWeek("next")}
                  className="p-2 hover:bg-gray-100 rounded"
                  title="Next week"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-2"
              >
                Registruoti laiką
                <span className="text-xl leading-none relative top-[-1px]">
                  +
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setFormType("meeting");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Registruoti susitikimą
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setFormType("free-time");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Registruoti laisvą laiką
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden bg-gray-50">
          <div className="flex flex-1">
            <div className="w-16 flex-shrink-0 bg-gray-50 flex flex-col">
              <div className="h-16 bg-gray-50 border-b border-gray-200"></div>
              <div className="flex-1 overflow-hidden relative">
                <div ref={timeLabelsRef}>
                  {timeSlots.map((hour) => (
                    <div key={hour} className="h-16 relative">
                      <span className="absolute top-1 right-2 text-xs text-gray-500">
                        {`${hour}:00`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 border-l border-gray-200 flex flex-col">
              <div
                className="grid grid-cols-7 border-b border-gray-200 bg-white"
                style={{ paddingRight: scrollbarWidth }}
              >
                {weekDays.map((day) => {
                  const dayIsToday = isToday(day);
                  return (
                    <div
                      key={day.toISOString()}
                      className="border-r border-gray-200 h-16 flex flex-col items-center justify-center"
                    >
                      <div className="text-xs text-gray-600 font-medium">
                        {day.toLocaleDateString("lt-LT", {
                          weekday: "short",
                        })}
                      </div>
                      <div
                        className={`text-lg font-normal ${
                          dayIsToday
                            ? "bg-blue-500 text-white rounded-full w-9 h-9 flex items-center justify-center"
                            : "text-gray-800"
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                ref={scrollContainerRef}
                className="overflow-y-scroll flex-1"
                onScroll={handleScroll}
              >
                <div className="grid grid-cols-7">
                  {weekDays.map((day) => {
                    const dayIsToday = isToday(day);
                    return (
                      <div
                        key={day.toISOString()}
                        className="relative border-r border-gray-200"
                      >
                        {timeSlots.map((hour) => (
                          <div
                            key={hour}
                            className={`h-16 border-b border-gray-100 ${
                              dayIsToday ? "bg-blue-50/30" : ""
                            }`}
                          ></div>
                        ))}

                        {getEntriesForDay(day).map((freeTime) => {
                          const pos = getEventPosition(freeTime, day);
                          const color = getColorForEntry(freeTime);
                          const textColor = getTextColorForEntry(freeTime);
                          return (
                            <div
                              key={freeTime.id}
                              className={`absolute left-1 right-1 ${color} ${textColor} rounded shadow-sm p-2 text-xs overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}
                              style={{ top: pos.top, height: pos.height }}
                            >
                              <div className="flex items-start gap-1">
                                <span className="text-[8px] mt-1 flex-shrink-0">
                                  <FaCircle />
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold truncate">
                                    {getFormattedLabel(freeTime)}
                                  </div>
                                </div>
                                {freeTime.meeting != null && (
                                  <div className="text-[10px] opacity-80 truncate mt-1">
                                    {freeTime.meeting.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {formType === "free-time" && (
        <RegisterFreeTimeForm
          onClose={() => setFormType("none")}
          onSubmit={async (data) => {
            try {
              const freeTimeData = {
                ownerId: user.id,
                startDateTime: data.startDateTime,
                endDateTime: data.endDateTime,
              };

              await fetch("http://localhost:8080/freetime", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(freeTimeData),
              });

              const startDate = weekDays[0];
              const endDate = new Date(weekDays[6]);
              endDate.setHours(23, 59, 59, 999);

              const startDateTime = startDate.toISOString().slice(0, 19);
              const endDateTime = endDate.toISOString().slice(0, 19);

              const freeTimesResponse = await fetch(
                `http://localhost:8080/freetime/user/${user.id}?startDateTime=${startDateTime}&endDateTime=${endDateTime}`,
                { headers: { "Content-Type": "application/json" } },
              );

              if (freeTimesResponse.ok) {
                const freeTimesData: FreeTime[] =
                  await freeTimesResponse.json();
                setFreeTimes(freeTimesData);
              }
            } catch (error) {
              console.error("Error at POST:", error);
            }
          }}
        />
      )}
      {formType === "meeting" && (
        <RegisterMeetingForm
          freeTimes={freeTimes}
          onClose={() => setFormType("none")}
          onSubmit={async (data) => {
            try {
              const completeData = {
                ownerId: user.id,
                ...data,
                participants: [],
              };

              const response = await fetch("http://localhost:8080/meeting", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(completeData),
              });

              if (!response.ok) {
                const errorText = await response.text();
                console.error("Error creating meeting:", errorText);
                return;
              }

              console.log("Meeting created successfully");

              const startDate = weekDays[0];
              const endDate = new Date(weekDays[6]);
              endDate.setHours(23, 59, 59, 999);

              const startDateTime = startDate.toISOString().slice(0, 19);
              const endDateTime = endDate.toISOString().slice(0, 19);

              const freeTimesResponse = await fetch(
                `http://localhost:8080/freetime/user/${user.id}?startDateTime=${startDateTime}&endDateTime=${endDateTime}`,
                { headers: { "Content-Type": "application/json" } },
              );

              if (freeTimesResponse.ok) {
                const freeTimesData: FreeTime[] =
                  await freeTimesResponse.json();
                setFreeTimes(freeTimesData);
              }
            } catch (error) {
              console.error("Error at POST:", error);
            }
          }}
        />
      )}
    </div>
  );
}
