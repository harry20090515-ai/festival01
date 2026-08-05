import React from 'react';
import { X, Heart, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { FestivalItem } from '../types';
import { formatDateRangeKorean } from '../utils/dateUtils';

interface BookmarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: FestivalItem[];
  onRemoveBookmark: (festival: FestivalItem) => void;
  onClearAll: () => void;
  onSelectFestival: (festival: FestivalItem) => void;
}

export const BookmarkDrawer: React.FC<BookmarkDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onClearAll,
  onSelectFestival
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between z-10 animate-slide-left">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-bold text-base">관심 축제 보관함 ({bookmarks.length})</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-slate-400">
              <Heart className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">보관된 축제가 없습니다.</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                마음에 드는 부산 축제 카드 오른쪽 상단의 하트 버튼을 눌러 보관함에 담아보세요!
              </p>
            </div>
          ) : (
            bookmarks.map((fest) => (
              <div
                key={fest.UC_SEQ}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/80 transition flex items-center space-x-3 group"
              >
                <img
                  src={fest.MAIN_IMG_THUMB || fest.MAIN_IMG_NORMAL}
                  alt={fest.TITLE}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop";
                  }}
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-md">
                    {fest.GUGUN_NM}
                  </span>
                  <h4 
                    onClick={() => {
                      onSelectFestival(fest);
                      onClose();
                    }}
                    className="font-bold text-xs text-slate-900 truncate hover:text-cyan-700 transition cursor-pointer"
                  >
                    {fest.TITLE}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {formatDateRangeKorean(fest)}
                  </p>
                </div>

                <button
                  onClick={() => onRemoveBookmark(fest)}
                  title="보관함에서 삭제"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookmarks.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>전체 비우기</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
            >
              닫기
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
