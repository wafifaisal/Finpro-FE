export default function Loading() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-white">
      <svg viewBox="0 0 1320 300" className="absolute w-full h-full">
        <text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          className="font-pacifico fill-transparent stroke-red-700 text-[140px] animate-stroke"
        >
          Nginepin
        </text>
      </svg>
    </div>
  );
}
