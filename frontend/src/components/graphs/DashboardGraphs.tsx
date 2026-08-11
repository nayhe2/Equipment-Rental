import { Calendar } from "lucide-react";

// wide vertical bars - each bar is a year
function YearlyBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={item.label} className="flex items-end gap-3">
            <div className="w-10 text-xs text-gray-500 text-right shrink-0 leading-8">
              {item.label}
            </div>
            <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
              <div
                className="h-full bg-black rounded-lg transition-all duration-700 flex items-center justify-end px-2"
                style={{ width: `${pct}%` }}
              >
                {pct > 15 && (
                  <span className="text-[10px] text-white font-medium">
                    {item.value.toFixed(0)} zl
                  </span>
                )}
              </div>
              {pct <= 15 && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-medium">
                  {item.value.toFixed(0)} zl
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// monthly bars with year selector
function MonthlyBarChart({
  data,
  selectedYear,
  years,
  onYearChange,
}: {
  data: { label: string; value: number }[];
  selectedYear: number;
  years: number[];
  onYearChange: (y: number) => void;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-4 h-4 text-gray-400" />
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="text-sm font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-black/5"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end gap-2 h-64">
        {data.map((item) => {
          const pct = max > 0 ? (item.value / max) * 100 : 0;
          const showValue = item.value > 0;
          return (
            <div
              key={item.label}
              className="flex-1 flex flex-col items-center gap-1.5 min-w-0"
            >
              <span
                className={`text-[10px] font-semibold text-gray-700 transition-opacity ${
                  showValue ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.value.toFixed(0)}zl
              </span>
              <div className="w-full bg-gray-100 rounded-t-lg relative h-48 overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-black rounded-t-lg transition-all duration-500"
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 font-medium">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// line chart — last 12 months trend
function TrendLineChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const padX = 60;
  const padY = 40;

  const toX = (i: number) =>
    padX + i * ((800 - padX * 2) / Math.max(data.length - 1, 1));
  const toY = (v: number) => 220 - padY - (v / max) * (220 - padY * 2);

  const points = data.map((d, i) => `${toX(i)},${toY(d.value)}`);

  return (
    <svg
      viewBox="0 0 800 220"
      className="w-full h-64"
      preserveAspectRatio="xMidYMid meet"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((r) => {
        const y = toY(max * r);
        return (
          <line
            key={r}
            x1={padX}
            y1={y}
            x2={800 - padX}
            y2={y}
            stroke="#f3f4f6"
            strokeWidth={1}
          />
        );
      })}

      <line
        x1={padX}
        y1={220 - padY}
        x2={800 - padX}
        y2={220 - padY}
        stroke="#e5e7eb"
        strokeWidth={1}
      />

      <polyline
        fill="none"
        stroke="#000"
        strokeWidth={2.5}
        points={points.join(" ")}
      />

      <polygon
        fill="rgba(0,0,0,0.04)"
        points={`${padX},${220 - padY} ${points.join(" ")} ${800 - padX},${220 - padY}`}
      />

      {data.map((d, i) => {
        const x = toX(i);
        const y = toY(d.value);
        return (
          <g key={d.label}>
            <circle cx={x} cy={y} r={5} fill="#000" />
            <circle cx={x} cy={y} r={3} fill="#fff" />
            <text
              x={x}
              y={220 - padY + 18}
              textAnchor="middle"
              className="text-[9px] fill-gray-400"
            >
              {d.label}
            </text>
            <text
              x={x}
              y={y - 12}
              textAnchor="middle"
              className="text-[10px] fill-gray-700 font-semibold"
            >
              {d.value.toFixed(0)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
export { YearlyBarChart, MonthlyBarChart, TrendLineChart };
