import React from 'react';
import { Calendar, MapPin, Phone, Heart, ExternalLink, Ticket, ArrowRight } from 'lucide-react';
import { FestivalItem } from '../types';
import { parseFestivalDates, formatDateRangeKorean, getDaysUntil } from '../utils/dateUtils';

interface FestivalCardProps {
  festival: FestivalItem;
  isBookmarked: boolean;
  onToggleBookmark: (festival: FestivalItem) => void;
  onSelectFestival: (festival: FestivalItem) => void;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  isBookmarked,
  onToggleBookmark,
  onSelectFestival
}) => {
  const { startDate, status } = parseFestivalDates(festival);
  const daysUntil = getDaysUntil(startDate);

  // Status Badge Styling
  const getStatusBadge = () => {
    if (status === 'ONGOING') {
      return (
        <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          진행 중
        </span>
      );
    }
    if (daysUntil === 0) {
      return (
        <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
          D-DAY 오늘!
        </span>
      );
    }
    if (daysUntil > 0 && daysUntil <= 30) {
      return (
        <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
          D-{daysUntil} 예정
        </span>
      );
    }
    if (status === 'UPCOMING') {
      return (
        <span className="bg-slate-700 text-slate-100 text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs">
          개최 예정
        </span>
      );
    }
    return (
      <span className="bg-slate-300 text-slate-600 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
        종료됨
      </span>
    );
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between h-full">
      
      <div>
        {/* Thumbnail Image Header */}
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectFestival(festival)}>
          <img
            src={festival.MAIN_IMG_NORMAL || festival.MAIN_IMG_THUMB}
            alt={festival.TITLE}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback image if image URL breaks
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop";
            }}
          />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
            {getStatusBadge()}
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              {festival.GUGUN_NM || "부산"}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(festival);
            }}
            title={isBookmarked ? "보관함에서 제거" : "보관함에 추가"}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900 text-white transition active:scale-90 z-10"
          >
            <Heart className={`w-4 h-4 transition ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>

          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-2.5 left-3 right-3 text-white">
            <span className="text-[11px] text-cyan-300 font-medium tracking-wide">
              {festival.category || "문화 축제"}
            </span>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-4 space-y-3">
          
          {/* Title */}
          <h3 
            onClick={() => onSelectFestival(festival)}
            className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-cyan-700 transition cursor-pointer"
          >
            {festival.TITLE}
          </h3>

          {/* Meta Details */}
          <div className="space-y-1.5 text-xs text-slate-600">
            
            {/* Date */}
            <div className="flex items-center text-slate-700 font-medium">
              <Calendar className="w-3.5 h-3.5 text-cyan-600 shrink-0 mr-2" />
              <span className="line-clamp-1">{formatDateRangeKorean(festival)}</span>
            </div>

            {/* Location */}
            <div className="flex items-start">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2 mt-0.5" />
              <span className="line-clamp-1">{festival.PLACE || festival.ADDR1 || festival.GUGUN_NM}</span>
            </div>

            {/* Admission Amount if present */}
            {festival.USAGE_AMOUNT && (
              <div className="flex items-center">
                <Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                <span className="line-clamp-1 text-slate-500">{festival.USAGE_AMOUNT}</span>
              </div>
            )}

          </div>

          {/* Short snippet summary */}
          {festival.ITEMCNTNTS && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              {festival.ITEMCNTNTS.replace(/<[^>]*>?/gm, '')}
            </p>
          )}

        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
        {festival.CNTCT_TEL ? (
          <a
            href={`tel:${festival.CNTCT_TEL}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] text-slate-500 hover:text-cyan-700 flex items-center gap-1"
          >
            <Phone className="w-3 h-3 text-cyan-600" />
            <span>{festival.CNTCT_TEL}</span>
          </a>
        ) : (
          <span className="text-[11px] text-slate-400">문의 정보 없음</span>
        )}

        <button
          onClick={() => onSelectFestival(festival)}
          className="text-xs text-cyan-700 font-semibold hover:text-cyan-900 flex items-center gap-1 group-hover:translate-x-0.5 transition"
        >
          <span>상세보기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
