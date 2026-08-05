import React from 'react';
import { Search, Calendar as CalendarIcon, MapPin, Grid, Map, RotateCcw, Filter, Check } from 'lucide-react';
import { FilterState, ViewMode, StatusFilter } from '../types';
import { BUSAN_DISTRICTS } from '../data/busanDistricts';

interface FilterSectionProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onReset: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filter,
  setFilter,
  viewMode,
  setViewMode,
  onReset
}) => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const statusOptions: { value: StatusFilter; label: string; countColor: string }[] = [
    { value: 'ALL', label: '전체 축제', countColor: 'text-slate-700' },
    { value: 'ONGOING', label: '🔥 진행 중', countColor: 'text-emerald-600' },
    { value: 'UPCOMING', label: '📅 개최 예정', countColor: 'text-blue-600' },
    { value: 'ENDED', label: '⌛ 지난 축제', countColor: 'text-slate-400' },
  ];

  return (
    <section className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        
        {/* Top Controls: Search Bar & View Modes */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="축제 이름, 장소, 키워드 검색 (예: 불꽃, 해운대, 영화제)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition placeholder:text-slate-400"
            />
            {filter.searchQuery && (
              <button
                onClick={() => setFilter(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Modes Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start md:self-auto">
            <button
              onClick={() => setViewMode('GRID')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'GRID'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-cyan-600" />
              <span>카드 뷰</span>
            </button>

            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'CALENDAR'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-cyan-600" />
              <span>달력 뷰</span>
            </button>

            <button
              onClick={() => setViewMode('MAP')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'MAP'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-cyan-600" />
              <span>지역 지도</span>
            </button>
          </div>

        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              진행 상태:
            </span>
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(prev => ({ ...prev, status: opt.value }))}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  filter.status === opt.value
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-cyan-600 transition px-2.5 py-1 rounded-lg hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>필터 초기화</span>
          </button>
        </div>

        {/* Month Selector Bar */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1 mr-1">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              월별 조회:
            </span>
            <button
              onClick={() => setFilter(prev => ({ ...prev, month: 'ALL', selectedDate: '' }))}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                filter.month === 'ALL' && !filter.selectedDate
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              전체 월
            </button>
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setFilter(prev => ({ ...prev, month: m, selectedDate: '' }))}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                  filter.month === m
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m}월
              </button>
            ))}

            {/* Custom Date Input */}
            <div className="ml-auto flex items-center space-x-2 pl-3 border-l border-slate-200">
              <span className="text-xs text-slate-500 whitespace-nowrap">특정일:</span>
              <input
                type="date"
                value={filter.selectedDate}
                onChange={(e) => setFilter(prev => ({ ...prev, selectedDate: e.target.value, month: 'ALL' }))}
                className="text-xs px-2.5 py-1 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              {filter.selectedDate && (
                <button
                  onClick={() => setFilter(prev => ({ ...prev, selectedDate: '' }))}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  취소
                </button>
              )}
            </div>
          </div>
        </div>

        {/* District Filter Chips */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              지역구(군):
            </span>
            {BUSAN_DISTRICTS.map((dist) => {
              const isSelected = filter.district === dist.id;
              return (
                <button
                  key={dist.id}
                  onClick={() => setFilter(prev => ({ ...prev, district: dist.id }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-slate-800 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                  <span>{dist.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
