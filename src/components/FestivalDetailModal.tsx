import React, { useState } from 'react';
import { X, Calendar, MapPin, Phone, Globe, Heart, Share2, Copy, Check, Ticket, Bus, Sparkles } from 'lucide-react';
import { FestivalItem } from '../types';
import { formatDateRangeKorean, parseFestivalDates } from '../utils/dateUtils';

interface FestivalDetailModalProps {
  festival: FestivalItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (festival: FestivalItem) => void;
}

export const FestivalDetailModal: React.FC<FestivalDetailModalProps> = ({
  festival,
  onClose,
  isBookmarked,
  onToggleBookmark
}) => {
  const [copied, setCopied] = useState(false);

  if (!festival) return null;

  const { startDate, endDate, status } = parseFestivalDates(festival);

  const handleCopyAddress = () => {
    const address = festival.ADDR1 || festival.PLACE || festival.GUGUN_NM;
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: festival.TITLE,
        text: `${festival.TITLE} - 부산 축제 정보`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyAddress();
    }
  };

  // Google Calendar Export URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(festival.TITLE)}&dates=${startDate.replace(/-/g, '')}/${endDate.replace(/-/g, '')}&details=${encodeURIComponent(festival.ITEMCNTNTS || '')}&location=${encodeURIComponent(festival.ADDR1 || festival.PLACE || '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      
      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Header */}
        <div className="relative aspect-[21/9] sm:aspect-[2/1] bg-slate-900 overflow-hidden shrink-0">
          <img
            src={festival.MAIN_IMG_NORMAL || festival.MAIN_IMG_THUMB}
            alt={festival.TITLE}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Top Tags */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="bg-cyan-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
              {festival.GUGUN_NM || "부산"}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full">
              {festival.category || "문화 행사"}
            </span>
          </div>

          {/* Title on Hero Header */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
              {festival.TITLE}
            </h2>
            <p className="text-xs text-cyan-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatDateRangeKorean(festival)}</span>
            </p>
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleBookmark(festival)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isBookmarked
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-white' : 'text-slate-500'}`} />
                <span>{isBookmarked ? '보관됨' : '보관함 담기'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>공유하기</span>
              </button>
            </div>

            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 transition"
            >
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>구글 캘린더 등록</span>
            </a>
          </div>

          {/* Main Description */}
          {festival.ITEMCNTNTS && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                축제 개요 & 소개
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 bg-slate-50/60 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                {festival.ITEMCNTNTS.replace(/<[^>]*>?/gm, '')}
              </p>
            </div>
          )}

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Venue Address */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  장소 및 주소
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="text-cyan-700 hover:underline flex items-center gap-0.5"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? '복사됨' : '주소복사'}</span>
                </button>
              </div>
              <p className="font-semibold text-slate-900 text-sm mt-1">
                {festival.PLACE || festival.MAIN_PLACE || festival.GUGUN_NM}
              </p>
              {festival.ADDR1 && (
                <p className="text-slate-500">{festival.ADDR1} {festival.ADDR2}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Phone className="w-4 h-4 text-cyan-600" />
                문의처 / 전화번호
              </span>
              <p className="font-semibold text-slate-900 text-sm mt-1">
                {festival.CNTCT_TEL ? (
                  <a href={`tel:${festival.CNTCT_TEL}`} className="text-cyan-700 hover:underline">
                    {festival.CNTCT_TEL}
                  </a>
                ) : (
                  '정보 없음'
                )}
              </p>
            </div>

            {/* Admission Price */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Ticket className="w-4 h-4 text-cyan-600" />
                입장료 / 요금
              </span>
              <p className="font-semibold text-slate-900 text-sm mt-1">
                {festival.USAGE_AMOUNT || '무료 또는 상세 문의'}
              </p>
            </div>

            {/* Homepage Link */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Globe className="w-4 h-4 text-cyan-600" />
                공식 홈페이지
              </span>
              <p className="font-semibold text-slate-900 text-sm mt-1">
                {festival.HOMEPAGE_URL ? (
                  <a
                    href={festival.HOMEPAGE_URL.startsWith('http') ? festival.HOMEPAGE_URL : `http://${festival.HOMEPAGE_URL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-700 hover:underline truncate block"
                  >
                    {festival.HOMEPAGE_URL}
                  </a>
                ) : (
                  '홈페이지 정보 없음'
                )}
              </p>
            </div>

          </div>

          {/* Traffic / Transportation Info */}
          {festival.TRFC_INFO && (
            <div className="p-4 bg-cyan-50/60 rounded-2xl border border-cyan-100 space-y-1 text-xs">
              <h4 className="font-bold text-cyan-900 flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-cyan-600" />
                교통 및 찾아오시는 길
              </h4>
              <p className="text-cyan-800 leading-relaxed">
                {festival.TRFC_INFO}
              </p>
            </div>
          )}

          {/* Map Direct Link Button */}
          <div className="pt-2">
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent((festival.ADDR1 || festival.PLACE || festival.TITLE) + ' 부산')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-md"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>네이버 지도에서 위치 보기</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
