import React, { useState } from 'react';
import { MapPin, Navigation, Info, ArrowRight } from 'lucide-react';
import { FestivalItem } from '../types';
import { BUSAN_DISTRICTS } from '../data/busanDistricts';

interface MapViewProps {
  festivals: FestivalItem[];
  onSelectFestival: (festival: FestivalItem) => void;
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  festivals,
  onSelectFestival,
  selectedDistrict,
  onSelectDistrict
}) => {
  const [activeDistrictId, setActiveDistrictId] = useState<string>(
    selectedDistrict !== 'ALL' ? selectedDistrict : '해운대구'
  );

  const currentDistrictInfo = BUSAN_DISTRICTS.find(d => d.id === activeDistrictId) || BUSAN_DISTRICTS[1];

  const districtFestivals = festivals.filter(f => 
    activeDistrictId === 'ALL' || f.GUGUN_NM === activeDistrictId
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-600" />
            <span>부산 지역구별 축제 지형 탐색</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            부산의 16개 구·군을 선택하고 주요 대표 축제 위치 및 상세 정보를 탐색하세요.
          </p>
        </div>

        {/* Selected District Badge */}
        <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{currentDistrictInfo.name} ({districtFestivals.length}개 축제)</span>
        </div>
      </div>

      {/* District Selector Map Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {BUSAN_DISTRICTS.filter(d => d.id !== 'ALL').map((dist) => {
          const count = festivals.filter(f => f.GUGUN_NM === dist.id).length;
          const isActive = activeDistrictId === dist.id;

          return (
            <button
              key={dist.id}
              onClick={() => {
                setActiveDistrictId(dist.id);
                onSelectDistrict(dist.id);
              }}
              className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between h-24 ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-cyan-500/30'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <div>
                <span className={`text-xs font-bold block ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {dist.name}
                </span>
                <span className={`text-[10px] block truncate mt-0.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}>
                  {dist.nameEng}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}개
                </span>
                <MapPin className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* District Highlights & Festivals List */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
        
        {/* District Info Banner */}
        <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {currentDistrictInfo.name} 축제 가이드
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentDistrictInfo.description}
            </p>
          </div>
        </div>

        {/* District Festival Cards List */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            {currentDistrictInfo.name} 소속 개최 축제 ({districtFestivals.length})
          </h4>

          {districtFestivals.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-slate-200/60 text-slate-500 text-xs">
              <Info className="w-6 h-6 mx-auto text-slate-400 mb-2" />
              <span>현재 선택된 {currentDistrictInfo.name}에 등록된 축제가 없습니다.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {districtFestivals.map((fest) => (
                <div
                  key={fest.UC_SEQ}
                  onClick={() => onSelectFestival(fest)}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">
                      {fest.GUGUN_NM}
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-cyan-700 transition">
                      {fest.TITLE}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      📍 {fest.PLACE || fest.ADDR1 || fest.GUGUN_NM}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{fest.USAGE_DAY || '일정 상세보기'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-600 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
