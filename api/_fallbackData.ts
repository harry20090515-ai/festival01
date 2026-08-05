export interface ApiFestivalItem {
  UC_SEQ: string | number;
  TITLE: string;
  GUGUN_NM: string;
  LAT: number;
  LNG: number;
  PLACE: string;
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
  category?: string;
}

export const SERVER_FALLBACK_FESTIVALS: ApiFestivalItem[] = [
  {
    UC_SEQ: 101,
    TITLE: "2026 부산불꽃축제 (Busan Fireworks Festival)",
    GUGUN_NM: "수영구",
    LAT: 35.1456,
    LNG: 129.1132,
    PLACE: "광안리해수욕장 일원",
    MAIN_PLACE: "광안리해수욕장",
    ADDR1: "부산광역시 수영구 광안해변로 219",
    CNTCT_TEL: "051-713-5000",
    HOMEPAGE_URL: "http://www.bfo.or.kr",
    USAGE_DAY: "2026-11-07 ~ 2026-11-07",
    USAGE_DAY_WEEK_AND_TIME: "2026.11.07(토) 14:00~21:00 (본행사 20:00)",
    USAGE_AMOUNT: "무료 (유료좌석 별도)",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    ITEMCNTNTS: "광안대교를 배경으로 펼쳐지는 세계 최고 수준의 하이라이트 불꽃쇼와 멀티미디어 해상 레이저 연출! 초대형 불꽃과 음악이 아우러지는 부산의 대표 시그니처 축제입니다.",
    TRFC_INFO: "도시철도 2호선 금련산역 또는 광안역 도보 10분",
    category: "야경/불꽃"
  },
  {
    UC_SEQ: 102,
    TITLE: "제31회 부산국제영화제 (BIFF)",
    GUGUN_NM: "해운대구",
    LAT: 35.1711,
    LNG: 129.1271,
    PLACE: "영화의전당, 센텀시티 일원",
    MAIN_PLACE: "영화의전당",
    ADDR1: "부산광역시 해운대구 수영강변대로 120",
    CNTCT_TEL: "1688-3010",
    HOMEPAGE_URL: "https://www.biff.kr",
    USAGE_DAY: "2026-10-02 ~ 2026-10-11",
    USAGE_DAY_WEEK_AND_TIME: "2026.10.02(금) ~ 10.11(일) 10일간",
    USAGE_AMOUNT: "상영관 입장권 9,000원~15,000원",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop",
    ITEMCNTNTS: "아시아 최고의 국제영화제. 전 세계의 다양하고 참신한 세계 명작 영화 상영, 레드카펫, GV(관객과의 대화), 야외 무대인사가 풍성하게 개최됩니다.",
    TRFC_INFO: "도시철도 2호선 센텀시티역 6번 출구 도보 5분",
    category: "문화/영화"
  },
  {
    UC_SEQ: 103,
    TITLE: "2026 부산 원아시아페스티벌 (BOF)",
    GUGUN_NM: "연제구",
    LAT: 35.1941,
    LNG: 129.0739,
    PLACE: "부산아시아드주경기장",
    MAIN_PLACE: "부산아시아드주경기장",
    ADDR1: "부산광역시 연제구 월드컵대로 344",
    CNTCT_TEL: "051-780-2114",
    HOMEPAGE_URL: "http://bof.or.kr",
    USAGE_DAY: "2026-10-18 ~ 2026-10-21",
    USAGE_DAY_WEEK_AND_TIME: "2026.10.18(토) ~ 10.21(화)",
    USAGE_AMOUNT: "공연별 별도 티켓 예매",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    ITEMCNTNTS: "한류 K-POP의 중심! 글로벌 팬들과 함께하는 대형 K-POP 콘서트, 힙합 페스티벌, 팬미팅, 부산 한류 문화 체험존이 운영됩니다.",
    TRFC_INFO: "도시철도 3호선 종합운동장역 9번 출구",
    category: "음악/콘서트"
  },
  {
    UC_SEQ: 104,
    TITLE: "제19회 부산항축제",
    GUGUN_NM: "동구",
    LAT: 35.1152,
    LNG: 129.0422,
    PLACE: "부산항 국제여객터미널 야외주차장 및 영도 국립해양박물관 일원",
    MAIN_PLACE: "부산항 국제여객터미널",
    ADDR1: "부산광역시 동구 충장대로 206",
    CNTCT_TEL: "051-713-5000",
    HOMEPAGE_URL: "http://www.bfo.or.kr",
    USAGE_DAY: "2026-06-06 ~ 2026-06-07",
    USAGE_DAY_WEEK_AND_TIME: "2026.06.06(토) ~ 06.07(일) 10:00~21:00",
    USAGE_AMOUNT: "무료 (체험 프로그램 일부 유료)",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400&auto=format&fit=crop",
    ITEMCNTNTS: "대한민국 대표 항만 축제! 대형 군함 승선 체험, 해군 의장대 시범, 부산항 드론라이트쇼, 항만 투어 등 이색적인 해양 문화 체험을 즐길 수 있습니다.",
    TRFC_INFO: "도시철도 1호선 부산역 9번 출구 (셔틀버스 운행)",
    category: "해양/체험"
  },
  {
    UC_SEQ: 105,
    TITLE: "제21회 해운대 모래축제",
    GUGUN_NM: "해운대구",
    LAT: 35.1587,
    LNG: 129.1604,
    PLACE: "해운대해수욕장 및 구남로 일원",
    MAIN_PLACE: "해운대해수욕장",
    ADDR1: "부산광역시 해운대구 해운대해변로 264",
    CNTCT_TEL: "051-749-4062",
    HOMEPAGE_URL: "https://www.haeundae.go.kr",
    USAGE_DAY: "2026-05-22 ~ 2026-05-25",
    USAGE_DAY_WEEK_AND_TIME: "2026.05.22(금) ~ 05.25(월) (작품전시 6월 중순까지)",
    USAGE_AMOUNT: "무료",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop",
    ITEMCNTNTS: "국내 유일의 친환경 모래 조각 축제. 세계적인 모래 조각 작가들의 초대형 미학 작품 전시, 모래 보드 슬라이드, 해변 퍼레이드, 야간 샌드 버스킹이 개최됩니다.",
    TRFC_INFO: "도시철도 2호선 해운대역 3번/5번 출구 구남로 방향 도보 5분",
    category: "해변/전시"
  },
  {
    UC_SEQ: 106,
    TITLE: "제29회 부산바다축제",
    GUGUN_NM: "사하구",
    LAT: 35.0786,
    LNG: 128.9669,
    PLACE: "다대포해수욕장, 해운대해수욕장 일원",
    MAIN_PLACE: "다대포해수욕장",
    ADDR1: "부산광역시 사하구 다대낙조2길 14",
    CNTCT_TEL: "051-713-5000",
    HOMEPAGE_URL: "http://www.bfo.or.kr",
    USAGE_DAY: "2026-08-01 ~ 2026-08-05",
    USAGE_DAY_WEEK_AND_TIME: "2026.08.01(토) ~ 08.05(수) 17:00~22:00",
    USAGE_AMOUNT: "무료",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=400&auto=format&fit=crop",
    ITEMCNTNTS: "부산의 여름을 뜨겁게 달구는 다대포 노을 속 나이트 풀파티, 해변 힙합&클럽 DJ 파티, 수중 난장 및 서핑 체험!",
    TRFC_INFO: "도시철도 1호선 다대포해수욕장역 1번/2번 출구 바로 앞",
    category: "해상/클럽"
  },
  {
    UC_SEQ: 107,
    TITLE: "2026 부산 수제맥주 페스티벌",
    GUGUN_NM: "해운대구",
    LAT: 35.169,
    LNG: 129.1312,
    PLACE: "벡스코(BEXCO) 야외광장",
    MAIN_PLACE: "벡스코 야외광장",
    ADDR1: "부산광역시 해운대구 APEC로 55",
    CNTCT_TEL: "051-740-7300",
    HOMEPAGE_URL: "http://www.busancraftbeer.com",
    USAGE_DAY: "2026-07-02 ~ 2026-07-05",
    USAGE_DAY_WEEK_AND_TIME: "2026.07.02(목) ~ 07.05(일) 17:00~22:00",
    USAGE_AMOUNT: "입장 무료 (맥주 및 푸드 현장 구매)",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?q=80&w=1200&auto=format&fit=crop",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?q=80&w=400&auto=format&fit=crop",
    ITEMCNTNTS: "전국 및 글로벌 브루어리 100여 종의 시원한 수제맥주와 맛있는 푸드트럭, 재즈/재치있는 감성 버스킹 공연이 펼쳐지는 여름 야외 페스티벌입니다.",
    TRFC_INFO: "도시철도 2호선 벡스코역 9번 출구 또는 센텀시티역 1번 출구",
    category: "음식/미식"
  },
  {
    UC_SEQ: 108,
    TITLE: "제12회 부산낙동강유채꽃축제",
    GUGUN_NM: "강서구",
    LAT: 35.2104,
    LNG: 128.9806,
    PLACE: "대저생태공원 유채꽃단지",
    MAIN_PLACE: "대저생태공원",
    ADDR1: "부산광역시 강서구 대저1동 2314-11",
    CNTCT_TEL: "051-713-5000",
    HOMEPAGE_URL: "http://www.bfo.or.kr",
    USAGE_DAY: "2026-04-04 ~ 2026-04-12",
    USAGE_DAY_WEEK_AND_TIME: "2026.04.04(토) ~ 04.12(일) 09:00~18:00",
    USAGE_AMOUNT: "무료",
    MAIN_IMG_NORMAL: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1200&auto=format&fit=crop",
    MAIN_IMG_THUMB: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=400&auto=format&fit=crop",
    ITEMCNTNTS: "전국 최대 규모 단지의 노란 유채꽃밭! 유채꽃 미로 걷기, 봄꽃 포토존, 유채꽃 야간 라이트업과 유채꽃 스몰웨딩 행사.",
    TRFC_INFO: "도시철도 3호선 강서구청역 1번/3번 출구 도보 3분",
    category: "자연/꽃"
  }
];
