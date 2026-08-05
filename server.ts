import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { FALLBACK_FESTIVALS } from "./src/data/fallbackFestivals";
import { FestivalItem } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy Endpoint for Busan Festival Data
  app.get("/api/festivals", async (req, res) => {
    try {
      const userKey = process.env.BUSAN_FESTIVAL_SERVICE_KEY || 
        "w3HMvXhq7mQTBUGR/DJjzvJNJd7ulxWoTsADBgJtayp/bVlHqvUNA6WRtsvv6sIIiu8mj5zYpRE6owlZz4jivw==";
      
      const numOfRows = req.query.numOfRows || 200;
      const pageNo = req.query.pageNo || 1;

      // Construct API URL carefully to prevent double encoding issues
      // serviceKey can be passed directly if already URL-encoded or unencoded
      const apiUrl = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${encodeURIComponent(userKey)}&pageNo=${pageNo}&numOfRows=${numOfRows}&resultType=json`;

      console.log(`[API Proxy] Fetching Busan Festivals from data.go.kr...`);

      const apiResponse = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json, text/plain, */*'
        }
      });

      if (!apiResponse.ok) {
        // If data.go.kr returns non-200 or fails, fall back gracefully
        console.warn(`[API Proxy] Data API returned HTTP ${apiResponse.status}, serving combined dataset.`);
        return res.json({
          status: "SUCCESS",
          source: "FALLBACK",
          count: FALLBACK_FESTIVALS.length,
          items: FALLBACK_FESTIVALS
        });
      }

      const textData = await apiResponse.text();
      let jsonData: any = null;

      try {
        jsonData = JSON.parse(textData);
      } catch (err) {
        console.warn(`[API Proxy] Response was not valid JSON, using fallback data.`);
        return res.json({
          status: "SUCCESS",
          source: "FALLBACK",
          count: FALLBACK_FESTIVALS.length,
          items: FALLBACK_FESTIVALS
        });
      }

      // Format check from data.go.kr: getFestivalKr.item
      const fetchedItems = jsonData?.getFestivalKr?.item || [];

      if (Array.isArray(fetchedItems) && fetchedItems.length > 0) {
        // Clean & merge data
        const normalized: FestivalItem[] = fetchedItems.map((item: any, idx: number) => ({
          UC_SEQ: item.UC_SEQ || `api-${idx}`,
          TITLE: item.MAIN_TITLE || item.TITLE || "부산 축제",
          GUGUN_NM: item.GUGUN_NM || "부산 전체",
          LAT: item.LAT || item.MAPY || 35.1795543,
          LNG: item.LNG || item.MAPX || 129.0756416,
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

        // Merge fallback unique entries to ensure robust dataset
        const existingSeq = new Set(normalized.map((i: FestivalItem) => String(i.UC_SEQ)));
        const combined: FestivalItem[] = [...normalized];
        for (const fb of FALLBACK_FESTIVALS) {
          if (!existingSeq.has(String(fb.UC_SEQ))) {
            combined.push(fb);
          }
        }

        return res.json({
          status: "SUCCESS",
          source: "LIVE_API",
          count: combined.length,
          items: combined
        });
      } else {
        // Return fallback list if API response items array is empty
        return res.json({
          status: "SUCCESS",
          source: "FALLBACK",
          count: FALLBACK_FESTIVALS.length,
          items: FALLBACK_FESTIVALS
        });
      }

    } catch (error: any) {
      console.error(`[API Proxy Error]:`, error);
      return res.json({
        status: "SUCCESS",
        source: "FALLBACK",
        count: FALLBACK_FESTIVALS.length,
        items: FALLBACK_FESTIVALS
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
