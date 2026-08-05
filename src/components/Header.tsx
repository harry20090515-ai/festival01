import React from 'react';
import { Calendar, Sparkles, Heart, MapPin, RefreshCw } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  filteredCount: number;
  bookmarkedCount: number;
  onOpenBookmarks: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
  dataSource: string;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  filteredCount,
  bookmarkedCount,
  onOpenBookmarks,
  onRefreshData,
  isLoading,
  dataSource
}) => {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                  부산 축제 가이드
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-medium">
                  Busan Festival
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>해양 수도 부산광역시 공공데이터 연동</span>
                <span className="text-slate-600">•</span>
                <span>{today}</span>
              </p>
            </div>
          </div>

          {/* Action Badges & Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 self-end sm:self-center">
            
            {/* Status / Count Pill */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs flex items-center space-x-2 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                조회 <strong className="text-white font-semibold">{filteredCount}</strong>개 / 총 {totalCount}개
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefreshData}
              disabled={isLoading}
              title="데이터 새로고침"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Bookmark Drawer Toggle */}
            <button
              onClick={onOpenBookmarks}
              className="relative flex items-center space-x-1.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition shadow-sm active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>보관함</span>
              {bookmarkedCount > 0 && (
                <span className="ml-1 bg-white text-rose-600 font-bold text-[11px] px-1.5 py-0.2 rounded-full shadow-inner">
                  {bookmarkedCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
