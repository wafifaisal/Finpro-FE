interface CustomizedYAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

export const CustomizedYAxisTick = (props: CustomizedYAxisTickProps) => {
  const { x, y, payload } = props;
  const text = payload.value;
  const threshold = 9;

  if (text.length > threshold) {
    const firstLine = text.slice(0, threshold);
    const secondLine = text.slice(threshold);
    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor="end" fill="#666" fontSize={10}>
          <tspan x={0} dy="0">
            {firstLine}
          </tspan>
          <tspan x={0} dy="15">
            {secondLine}
          </tspan>
        </text>
      </g>
    );
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="end" fill="#666" fontSize={10} dy={4}>
        {text}
      </text>
    </g>
  );
};
