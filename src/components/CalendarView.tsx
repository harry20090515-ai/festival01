import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { FestivalItem } from '../types';
import { parseFestivalDates } from '../utils/dateUtils';

interface CalendarViewProps {
  festivals: FestivalItem[];
  onSelectFestival: (festival: FestivalItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  festivals,
  onSelectFestival
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 4, 1)); // Default May 2026 or current year

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Prev / Next month handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar grid
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // Map festivals to days in current month
  const getFestivalsForDay = (dayNumber: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNumber).padStart(2, '0');
    const targetDateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return festivals.filter((fest) => {
      const { startDate, endDate } = parseFestivalDates(fest);
      return targetDateStr >= startDate && targetDateStr <= endDate;
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-5">
      
      {/* Calendar Header Control */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-cyan-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {year}년 {month + 1}월 축제 일정표
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
          >
            오늘 (Today)
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 border-b border-slate-100 pb-2">
        {dayNames.map((d, i) => (
          <div key={d} className={i === 0 ? 'text-rose-500' : i === 6 ? 'text-blue-500' : ''}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        
        {/* Empty Padding Tiles Before 1st Day */}
        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
          <div key={`empty-${idx}`} className="min-h-[90px] sm:min-h-[110px] bg-slate-50/50 rounded-2xl border border-slate-100/50" />
        ))}

        {/* Days of Month */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const dayFestivals = getFestivalsForDay(dayNum);
          const isToday = 
            new Date().getFullYear() === year &&
            new Date().getMonth() === month &&
            new Date().getDate() === dayNum;

          const dayOfWeek = (firstDayOfMonth + idx) % 7;

          return (
            <div
              key={`day-${dayNum}`}
              className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-2xl border transition flex flex-col justify-between ${
                isToday
                  ? 'bg-cyan-50/70 border-cyan-300 ring-2 ring-cyan-500/20'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                    isToday
                      ? 'bg-cyan-600 text-white'
                      : dayOfWeek === 0
                      ? 'text-rose-500'
                      : dayOfWeek === 6
                      ? 'text-blue-500'
                      : 'text-slate-700'
                  }`}
                >
                  {dayNum}
                </span>

                {dayFestivals.length > 0 && (
                  <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-100 px-1.5 py-0.2 rounded-full">
                    {dayFestivals.length}개
                  </span>
                )}
              </div>

              {/* Festival Items Badges inside Day Tile */}
              <div className="mt-1.5 space-y-1 overflow-y-auto max-h-[60px] sm:max-h-[75px] scrollbar-none">
                {dayFestivals.map((fest) => (
                  <button
                    key={fest.UC_SEQ}
                    onClick={() => onSelectFestival(fest)}
                    className="w-full text-left text-[10px] p-1 rounded-md bg-slate-900 text-white hover:bg-cyan-700 transition truncate block shadow-2xs"
                    title={fest.TITLE}
                  >
                    <span className="font-semibold text-cyan-300 mr-1">[{fest.GUGUN_NM}]</span>
                    <span>{fest.TITLE}</span>
                  </button>
                ))}
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
