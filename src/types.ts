export interface FestivalItem {
  UC_SEQ: number | string;
  TITLE: string;
  GUGUN_NM: string; // 구/군 이름 (e.g., 해운대구, 중구)
  LAT?: number | string;
  LNG?: number | string;
  PLACE?: string;
  TITLE_ENG?: string;
  HEADER_ENG?: string;
  MAIN_PLACE?: string;
  ADDR1?: string;
  ADDR2?: string;
  CNTCT_TEL?: string;
  HOMEPAGE_URL?: string;
  TRFC_INFO?: string;
  USAGE_DAY?: string;
  USAGE_DAY_WEEK_AND_TIME?: string;
  USAGE_AMOUNT?: string;
  MAIN_IMG_NORMAL?: string;
  MAIN_IMG_THUMB?: string;
  ITEMCNTNTS?: string;
  MIDDLE_SIZE_RM1?: string;
  // Computed fields
  startDate?: string;
  endDate?: string;
  status?: 'ONGOING' | 'UPCOMING' | 'ENDED';
  category?: string;
}

export interface BusanDistrict {
  id: string;
  name: string;
  nameEng: string;
  lat: number;
  lng: number;
  description: string;
  badgeBg: string;
}

export type ViewMode = 'GRID' | 'CALENDAR' | 'MAP';
export type StatusFilter = 'ALL' | 'ONGOING' | 'UPCOMING' | 'ENDED';

export interface FilterState {
  searchQuery: string;
  district: string; // 'ALL' or specific GUGUN_NM like '해운대구'
  month: number | 'ALL'; // 1-12 or 'ALL'
  status: StatusFilter;
  selectedDate: string; // YYYY-MM-DD or empty
  category: string; // 'ALL' or specific category
}
