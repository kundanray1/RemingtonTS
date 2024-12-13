import React from 'react';

interface RectangleProps {
  width: number;
  height: number;
  color?: string;
}

const Rectangle: React.FC<RectangleProps> = ({
  width,
  height,
  color = 'lightgray',
}) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill={color}
      stroke="gray"
      strokeWidth="3"
    />
  </svg>
);

export default Rectangle;
