import { useLayoutEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";
import Navigation from "./Navigation.tsx";

interface CalendarEvent {
  id: string;
  title: string;
  subtitle?: string;
  startTime: string;
  endTime: string;
  date: Date;
  color: string;
  textColor?: string;
}

function Calendar() {
  const navigate = useNavigate();
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeLabelsRef = useRef<HTMLDivElement>(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

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

  const [events] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Susitikimas su Povilu",
      subtitle: "Susitikimas",
      startTime: "13:00",
      endTime: "15:00",
      date: new Date(2025, 10, 25),
      color: "bg-green-300",
      textColor: "text-green-900",
    },
    {
      id: "2",
      title: "Talk Lunch",
      subtitle: "Pietų pokalbis su Arūnu",
      startTime: "13:00",
      endTime: "14:00",
      date: new Date(2025, 10, 26),
      color: "bg-purple-500",
      textColor: "text-white",
    },
    {
      id: "3",
      title: "1 on 1",
      subtitle: "Skombutis su Coach",
      startTime: "15:00",
      endTime: "16:00",
      date: new Date(2025, 10, 25),
      color: "bg-blue-600",
      textColor: "text-white",
    },
    {
      id: "4",
      title: "Mokymai",
      startTime: "16:00",
      endTime: "17:00",
      date: new Date(2025, 10, 25),
      color: "bg-red-400",
      textColor: "text-white",
    },
    {
      id: "5",
      title: "Susitikimas su Povilu",
      subtitle: "Susitikimas",
      startTime: "18:00",
      endTime: "19:00",
      date: new Date(2025, 10, 4),
      color: "bg-green-300",
      textColor: "text-green-900",
    },
  ]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (timeLabelsRef.current) {
      timeLabelsRef.current.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem("user");
      navigate(AppRoutes.LOG_IN);
    }
  };

  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const weekDays = getWeekDays();
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const formatHeader = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString("lt-LT", { month: "long" })} ${start.getFullYear()}`;
  };

  const getEventPosition = (event: CalendarEvent) => {
    const [startHour, startMin] = event.startTime.split(":").map(Number);
    const [endHour, endMin] = event.endTime.split(":").map(Number);
    const top = (startHour * 60 + startMin) * (60 / 60);
    const height =
      ((endHour - startHour) * 60 + (endMin - startMin)) * (60 / 60);
    return { top: `${top}px`, height: `${height}px` };
  };

  const formatDate = () => {
      const now = new Date();
      const monthDay = new Intl.DateTimeFormat('lt-LT', {
          month: 'long',
          day: 'numeric'

      }).format(now);

      const weekday = new Intl.DateTimeFormat('lt-LT', {
          weekday: 'long'
      }).format(now);

      const capitalizedMonthDay = monthDay.charAt(0).toUpperCase() + monthDay.slice(1);
      const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

      return `${capitalizedMonthDay}, ${capitalizedWeekday}`;
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

  const getTodayEvents = () => events.filter((e) => isToday(e.date));
  const getTomorrowEvents = () => events.filter((e) => isTomorrow(e.date));

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
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

  const monthDays = getCurrentMonthDays();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navigation onLogout={handleLogout} />

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

        {getTodayEvents().length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400 text-xs">
                <FaCircle />
              </span>
              <span className="text-sm font-semibold text-gray-700">
                Šiandien
              </span>
            </div>
            <div className="space-y-2">
              {getTodayEvents().map((event) => (
                <div key={event.id} className="flex items-center text-xs">
                  <span className="text-green-300 text-xs mr-2">
                    <FaCircle />
                  </span>
                  <span className="text-gray-700 flex-1 truncate">
                    {event.title}
                  </span>
                  <span className="ml-2 text-gray-500">{event.startTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {getTomorrowEvents().length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 text-xs">
                <FaCircle />
              </span>
              <span className="text-sm font-semibold text-gray-700">Rytoj</span>
            </div>
            <div className="space-y-2">
              {getTomorrowEvents().map((event) => (
                <div key={event.id} className="flex items-center text-xs">
                  <span
                    className={`mr-2 ${
                      event.color === "bg-purple-500"
                        ? "text-purple-500"
                        : event.color === "bg-blue-600"
                          ? "text-blue-600"
                          : event.color === "bg-red-400"
                            ? "text-red-400"
                            : "text-green-300"
                    }`}
                  >
                    <FaCircle size={8} />
                  </span>
                  <span className="text-gray-700 flex-1 truncate">
                    {event.title}
                  </span>
                  <span className="ml-2 text-gray-500">{event.startTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <div className="w-full mb-4 px-6 pt-6">
          <p className="text-2xl text-black">{formatDate()}</p>
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
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-2"
              >
                Savaitė
                <span className="text-gray-400">▼</span>
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-2"
              >
                Registruoti laiką
                <span className="text-xl leading-none">+</span>
              </button>
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

                        {getEventsForDay(day).map((event) => {
                          const pos = getEventPosition(event);
                          return (
                            <div
                              key={event.id}
                              className={`absolute left-1 right-1 ${event.color} ${event.textColor} rounded shadow-sm p-2 text-xs overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}
                              style={{ top: pos.top, height: pos.height }}
                            >
                              <div className="flex items-start gap-1">
                                <span className="text-[8px] mt-1 flex-shrink-0">
                                  <FaCircle />
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold truncate">
                                    {event.title}
                                  </div>
                                  <div className="text-[10px] opacity-90">
                                    {event.startTime}
                                  </div>
                                  {event.subtitle && (
                                    <div className="text-[10px] opacity-80 truncate mt-1">
                                      {event.subtitle}
                                    </div>
                                  )}
                                </div>
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
    </div>
  );
}

export default Calendar;
