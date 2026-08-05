import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterSection } from './components/FilterSection';
import { FestivalCard } from './components/FestivalCard';
import { FestivalDetailModal } from './components/FestivalDetailModal';
import { CalendarView } from './components/CalendarView';
import { MapView } from './components/MapView';
import { BookmarkDrawer } from './components/BookmarkDrawer';
import { FestivalItem, FilterState, ViewMode } from './types';
import { parseFestivalDates, isFestivalInMonth, isFestivalOnDate } from './utils/dateUtils';
import { FALLBACK_FESTIVALS } from './data/fallbackFestivals';
import { Sparkles, Calendar, MapPin, Search, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    district: 'ALL',
    month: 'ALL',
    status: 'ALL',
    selectedDate: '',
    category: 'ALL'
  });

  // View Mode & Selected Festival Modal
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);

  // Bookmarks State (localStorage synced)
  const [bookmarks, setBookmarks] = useState<FestivalItem[]>(() => {
    try {
      const saved = localStorage.getItem('busan_festival_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isBookmarkOpen, setIsBookmarkOpen] = useState<boolean>(false);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('busan_festival_bookmarks', JSON.stringify(bookmarks));
    } catch (err) {
      console.error('Failed to save bookmarks:', err);
    }
  }, [bookmarks]);

  // Fetch data with robust multi-layer fallback for Vercel/production
  const fetchFestivals = async () => {
    setIsLoading(true);
    setError(null);
    let loadedData: FestivalItem[] | null = null;
    let sourceTag = 'API';

    // Layer 1: Try Serverless API Proxy (/api/festivals)
    try {
      const response = await fetch('/api/festivals?numOfRows=300');
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data && data.status === 'SUCCESS' && Array.isArray(data.items) && data.items.length > 0) {
            loadedData = data.items;
            sourceTag = data.source || 'API';
          }
        }
      }
    } catch (e) {
      console.warn('Backend proxy fetch failed, trying direct client fetch:', e);
    }

    // Layer 2: Direct client fetch to data.go.kr if Layer 1 failed
    if (!loadedData || loadedData.length === 0) {
      try {
        const rawKey = (import.meta as any).env?.VITE_BUSAN_FESTIVAL_SERVICE_KEY || 
          "w3HMvXhq7mQTBUGR/DJjzvJNJd7ulxWoTsADBgJtayp/bVlHqvUNA6WRtsvv6sIIiu8mj5zYpRE6owlZz4jivw==";
        
        let keyParam = rawKey.trim();
        if (!keyParam.includes('%')) {
          keyParam = encodeURIComponent(keyParam);
        }

        const directUrl = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${keyParam}&pageNo=1&numOfRows=300&resultType=json`;
        const directRes = await fetch(directUrl);
        if (directRes.ok) {
          const text = await directRes.text();
          const json = JSON.parse(text);
          const fetchedItems = json?.getFestivalKr?.item || [];
          if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
            const normalized: FestivalItem[] = fetchedItems.map((item: any, idx: number) => ({
              UC_SEQ: item.UC_SEQ || `api-${idx}`,
              TITLE: item.MAIN_TITLE || item.TITLE || "부산 축제",
              GUGUN_NM: item.GUGUN_NM || "부산 전체",
              LAT: Number(item.LAT || item.MAPY) || 35.1795543,
              LNG: Number(item.LNG || item.MAPX) || 129.0756416,
              PLACE: item.PLACE || item.MAIN_PLACE || item.ADDR1 || "부산",
              MAIN_PLACE: item.MAIN_PLACE || item.PLACE,
              ADDR1: item.ADDR1 || "",
              ADDR2: item.ADDR2 || "",
              CNTCT_TEL: item.CNTCT_TEL || "",
              HOMEPAGE_URL: item.HOMEPAGE_URL || "",
              TRFC_INFO: item.TRFC_INFO || "",
              USAGE_DAY: item.USAGE_DAY || "",
              USAGE_DAY_WEEK_AND_TIME: item.USAGE_DAY_WEEK_AND_TIME || item.USAGE_DAY || "",
              USAGE_AMOUNT: item.USAGE_AMOUNT || "무료/상세참조",
              MAIN_IMG_NORMAL: item.MAIN_IMG_NORMAL || item.MAIN_IMG_THUMB || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
              MAIN_IMG_THUMB: item.MAIN_IMG_THUMB || item.MAIN_IMG_NORMAL || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
              ITEMCNTNTS: item.ITEMCNTNTS || item.MIDDLE_SIZE_RM1 || "부산의 아름다운 풍경과 열정이 함께하는 문화 축제입니다.",
              MIDDLE_SIZE_RM1: item.MIDDLE_SIZE_RM1 || "",
              category: item.CATE1_NM || item.CATE2_NM || "축제/행사"
            }));
            
            // Merge with local dataset
            const existingSeq = new Set(normalized.map((i) => String(i.UC_SEQ)));
            const combined = [...normalized];
            for (const fb of FALLBACK_FESTIVALS) {
              if (!existingSeq.has(String(fb.UC_SEQ))) {
                combined.push(fb);
              }
            }
            loadedData = combined;
            sourceTag = 'DIRECT_API';
          }
        }
      } catch (e) {
        console.warn('Direct client fetch failed, using fallback dataset:', e);
      }
    }

    // Layer 3: Static fallback dataset
    if (!loadedData || loadedData.length === 0) {
      loadedData = FALLBACK_FESTIVALS;
      sourceTag = 'FALLBACK';
    }

    setFestivals(loadedData);
    setDataSource(sourceTag);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  // Filter Logic
  const filteredFestivals = useMemo(() => {
    return festivals.filter((item) => {
      // 1. Search Query
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchTitle = item.TITLE?.toLowerCase().includes(query);
        const matchPlace = item.PLACE?.toLowerCase().includes(query) || item.ADDR1?.toLowerCase().includes(query);
        const matchContents = item.ITEMCNTNTS?.toLowerCase().includes(query);
        const matchGugun = item.GUGUN_NM?.toLowerCase().includes(query);
        if (!matchTitle && !matchPlace && !matchContents && !matchGugun) {
          return false;
        }
      }

      // 2. District Filter
      if (filter.district !== 'ALL') {
        if (item.GUGUN_NM !== filter.district) {
          return false;
        }
      }

      // 3. Month Filter
      if (filter.month !== 'ALL') {
        if (!isFestivalInMonth(item, Number(filter.month))) {
          return false;
        }
      }

      // 4. Specific Date Filter
      if (filter.selectedDate) {
        if (!isFestivalOnDate(item, filter.selectedDate)) {
          return false;
        }
      }

      // 5. Status Filter
      if (filter.status !== 'ALL') {
        const { status } = parseFestivalDates(item);
        if (status !== filter.status) {
          return false;
        }
      }

      return true;
    });
  }, [festivals, filter]);

  // Toggle bookmark handler
  const handleToggleBookmark = (festival: FestivalItem) => {
    setBookmarks(prev => {
      const exists = prev.some(b => String(b.UC_SEQ) === String(festival.UC_SEQ));
      if (exists) {
        return prev.filter(b => String(b.UC_SEQ) !== String(festival.UC_SEQ));
      } else {
        return [...prev, festival];
      }
    });
  };

  // Stats Counters
  const currentMonthNum = new Date().getMonth() + 1;
  const thisMonthCount = useMemo(() => {
    return festivals.filter(f => isFestivalInMonth(f, currentMonthNum)).length;
  }, [festivals, currentMonthNum]);

  const ongoingCount = useMemo(() => {
    return festivals.filter(f => parseFestivalDates(f).status === 'ONGOING').length;
  }, [festivals]);

  const resetFilters = () => {
    setFilter({
      searchQuery: '',
      district: 'ALL',
      month: 'ALL',
      status: 'ALL',
      selectedDate: '',
      category: 'ALL'
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* App Header */}
      <Header
        totalCount={festivals.length}
        filteredCount={filteredFestivals.length}
        bookmarkedCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarkOpen(true)}
        onRefreshData={fetchFestivals}
        isLoading={isLoading}
        dataSource={dataSource}
      />

      {/* Main Filter Section */}
      <FilterSection
        filter={filter}
        setFilter={setFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onReset={resetFilters}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div 
            onClick={() => setFilter(prev => ({ ...prev, status: 'ALL', month: 'ALL', district: 'ALL', selectedDate: '' }))}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition cursor-pointer"
          >
            <p className="text-[11px] font-medium text-slate-500">전체 등록 축제</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{festivals.length}개</p>
          </div>

          <div 
            onClick={() => setFilter(prev => ({ ...prev, month: currentMonthNum, selectedDate: '' }))}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition cursor-pointer"
          >
            <p className="text-[11px] font-medium text-slate-500">{currentMonthNum}월 개최 축제</p>
            <p className="text-xl font-extrabold text-cyan-600 mt-0.5">{thisMonthCount}개</p>
          </div>

          <div 
            onClick={() => setFilter(prev => ({ ...prev, status: 'ONGOING' }))}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition cursor-pointer"
          >
            <p className="text-[11px] font-medium text-slate-500">🔥 현재 진행 중</p>
            <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{ongoingCount}개</p>
          </div>

          <div 
            onClick={() => setIsBookmarkOpen(true)}
            className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition cursor-pointer"
          >
            <p className="text-[11px] font-medium text-slate-500">❤️ 관심 보관함</p>
            <p className="text-xl font-extrabold text-rose-600 mt-0.5">{bookmarks.length}개</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={fetchFestivals} className="underline font-bold text-rose-900">
              다시 시도
            </button>
          </div>
        )}

        {/* View Mode Contents */}
        {isLoading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 border border-slate-200 p-4 space-y-3 animate-pulse">
                <div className="bg-slate-200 rounded-xl h-40 w-full" />
                <div className="bg-slate-200 rounded h-4 w-3/4" />
                <div className="bg-slate-200 rounded h-3 w-1/2" />
                <div className="bg-slate-200 rounded h-12 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : filteredFestivals.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto my-8">
            <Search className="w-12 h-12 mx-auto text-slate-300" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                조회 조건에 해당하는 축제가 없습니다
              </h3>
              <p className="text-xs text-slate-500">
                지역구, 월별 또는 검색어를 변경해보세요.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
            >
              필터 조건 초기화
            </button>
          </div>
        ) : (
          /* Render based on view mode */
          <>
            {viewMode === 'GRID' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredFestivals.map((fest) => (
                  <FestivalCard
                    key={fest.UC_SEQ}
                    festival={fest}
                    isBookmarked={bookmarks.some(b => String(b.UC_SEQ) === String(fest.UC_SEQ))}
                    onToggleBookmark={handleToggleBookmark}
                    onSelectFestival={setSelectedFestival}
                  />
                ))}
              </div>
            )}

            {viewMode === 'CALENDAR' && (
              <CalendarView
                festivals={filteredFestivals}
                onSelectFestival={setSelectedFestival}
              />
            )}

            {viewMode === 'MAP' && (
              <MapView
                festivals={festivals}
                onSelectFestival={setSelectedFestival}
                selectedDistrict={filter.district}
                onSelectDistrict={(id) => setFilter(prev => ({ ...prev, district: id }))}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs space-y-2">
          <p className="font-semibold text-slate-300">
            부산광역시 공공데이터포털(data.go.kr) 축제 서비스 오픈API 연동
          </p>
          <p className="text-slate-500">
            본 페이지는 부산 지역의 문화·예술·해변 축제 정보를 통합하여 제공합니다.
          </p>
        </div>
      </footer>

      {/* Festival Detail Modal */}
      <FestivalDetailModal
        festival={selectedFestival}
        onClose={() => setSelectedFestival(null)}
        isBookmarked={selectedFestival ? bookmarks.some(b => String(b.UC_SEQ) === String(selectedFestival.UC_SEQ)) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Bookmark Drawer */}
      <BookmarkDrawer
        isOpen={isBookmarkOpen}
        onClose={() => setIsBookmarkOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={() => setBookmarks([])}
        onSelectFestival={setSelectedFestival}
      />

    </div>
  );
}
