import { SERVER_FALLBACK_FESTIVALS, ApiFestivalItem } from "./_fallbackData";

export default async function handler(req: any, res: any) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  } catch {
    // Header safety
  }

  if (req && req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const rawKey = process.env.BUSAN_FESTIVAL_SERVICE_KEY || 
      "w3HMvXhq7mQTBUGR/DJjzvJNJd7ulxWoTsADBgJtayp/bVlHqvUNA6WRtsvv6sIIiu8mj5zYpRE6owlZz4jivw==";

    // Smart key encoding check
    let keyParam = rawKey.trim();
    if (!keyParam.includes('%')) {
      keyParam = encodeURIComponent(keyParam);
    }

    const numOfRows = (req && req.query && req.query.numOfRows) ? req.query.numOfRows : 200;
    const pageNo = (req && req.query && req.query.pageNo) ? req.query.pageNo : 1;

    const apiUrl = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${keyParam}&pageNo=${pageNo}&numOfRows=${numOfRows}&resultType=json`;

    console.log(`[API Proxy] Querying Busan Festival API...`);

    let apiResponse: any = null;
    try {
      apiResponse = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json, text/plain, */*'
        }
      });
    } catch (fetchErr: any) {
      console.warn(`[API Proxy] Fetch error: ${fetchErr?.message}`);
      return res.status(200).json({
        status: "SUCCESS",
        source: "FALLBACK",
        count: SERVER_FALLBACK_FESTIVALS.length,
        items: SERVER_FALLBACK_FESTIVALS
      });
    }

    if (!apiResponse || !apiResponse.ok) {
      console.warn(`[API Proxy] Non-OK response status from data.go.kr`);
      return res.status(200).json({
        status: "SUCCESS",
        source: "FALLBACK",
        count: SERVER_FALLBACK_FESTIVALS.length,
        items: SERVER_FALLBACK_FESTIVALS
      });
    }

    const textData = await apiResponse.text();
    let jsonData: any = null;

    try {
      jsonData = JSON.parse(textData);
    } catch {
      console.warn(`[API Proxy] Response was not JSON, returning fallback.`);
      return res.status(200).json({
        status: "SUCCESS",
        source: "FALLBACK",
        count: SERVER_FALLBACK_FESTIVALS.length,
        items: SERVER_FALLBACK_FESTIVALS
      });
    }

    const fetchedItems = jsonData?.getFestivalKr?.item || [];

    if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
      const normalized: ApiFestivalItem[] = fetchedItems.map((item: any, idx: number) => ({
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

      const existingSeq = new Set(normalized.map((i) => String(i.UC_SEQ)));
      const combined: ApiFestivalItem[] = [...normalized];
      for (const fb of SERVER_FALLBACK_FESTIVALS) {
        if (!existingSeq.has(String(fb.UC_SEQ))) {
          combined.push(fb);
        }
      }

      return res.status(200).json({
        status: "SUCCESS",
        source: "LIVE_API",
        count: combined.length,
        items: combined
      });
    } else {
      return res.status(200).json({
        status: "SUCCESS",
        source: "FALLBACK",
        count: SERVER_FALLBACK_FESTIVALS.length,
        items: SERVER_FALLBACK_FESTIVALS
      });
    }

  } catch (error: any) {
    console.error(`[API Proxy Critical Error]:`, error);
    return res.status(200).json({
      status: "SUCCESS",
      source: "FALLBACK",
      count: SERVER_FALLBACK_FESTIVALS.length,
      items: SERVER_FALLBACK_FESTIVALS
    });
  }
}
