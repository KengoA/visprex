import { useMemo } from "react";
import * as d3 from "d3";
import { InteractionData } from "./CorrelationMatrix";

type RendererProps = {
  width: number;
  height: number;
  data: { x: string; y: string; coef: number }[];
  setHoveredCell: (hoveredCell: InteractionData | null) => void;
};

export const Renderer = ({
  width,
  height,
  data,
  setHoveredCell,
}: RendererProps) => {
  const margin = { top: 10, right: 50, bottom: 30, left: 30 };  
  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom;

  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);

  const domain = Array.from(new Set(data.map(function(d) { return d.x })))

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsHeight])
      .domain(allYGroups)
      .padding(0.01);
  }, [data, height]);

const colorScale = d3.scaleLinear<string>()
    .domain([-1, 0, 1])
    .range(["#B22222", "#fff", "#000080"]);

  const allShapes = data.map((d, i) => {
    const x = xScale(d.x);
    const y = yScale(d.y);

    if (d.coef === null || !x || !y) {
      return null;
    }

    const yPos = domain.indexOf(d.y);
    const xPos = domain.indexOf(d.x);
    if (xPos > yPos) {
        return null;
    }

    return (
      <rect
        key={i}
        r={4}
        x={xScale(d.x)}
        y={yScale(d.y)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={0.7}
        fill={d.coef ? colorScale(d.coef): "gray"}
        rx={5}
        stroke={"white"}
        onMouseEnter={(e) => {
          setHoveredCell({
            xLabel: d.x,
            yLabel: d.y,
            xPos: x + xScale.bandwidth() + margin.left,
            yPos: y + xScale.bandwidth() / 2 + margin.top,
            value: Math.round(d.coef * 100) / 100,
          });
        }}
        onMouseLeave={() => setHoveredCell(null)}
        cursor="pointer"
      />
    );
  });

  const xLabels = allXGroups.map((name, i) => {
    const x = xScale(name);

    if (!x) {
      return null;
    }

    return (
      <text
        key={i}
        x={x + xScale.bandwidth() / 2}
        y={boundsHeight + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
      >
        {name}
      </text>
    );
  });

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[margin.left, margin.top].join(",")})`}
      >
        {allShapes}
        {xLabels}
      </g>
    </svg>
  );
};
