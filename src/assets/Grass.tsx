import React from 'react';
import { Group, Rect, Line } from 'react-konva';

interface GrassProps {
  x: number;
  y: number;
  width: number;
  height: number;
  baseDensity?: number; // Base density for blades per 100x100 area
  bladeLength?: number; // Length of each grass blade
  color?: string; // Base grass area color
  bladeColor?: string; // Color of individual blades
  draggable?: boolean;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  selected?: boolean;
}

const Grass: React.FC<GrassProps> = ({
  x,
  y,
  width,
  height,
  baseDensity = 400, // Blades per 100x100 area
  bladeLength = 400, // Length of grass blades
  color = '#1c370a', // Light green for the base area
  bladeColor = '#a2ba7c',
  draggable = true,
  onClick,
  onDragEnd,
  selected = false,
}) => {
  // Calculate the number of blades based on area and density
  const bladeCount = Math.floor((width * height * baseDensity) / 10000);

  // Generate blades with radial positions and angles
  const blades = Array.from({ length: bladeCount }, () => {
    const centerX = Math.random() * width; // Random starting x within rectangle
    const centerY = Math.random() * height; // Random starting y within rectangle
    const angle = Math.random() * Math.PI * 2; // Random angle in radians
    const endX = centerX + Math.cos(angle) * bladeLength/4; // End x of blade
    const endY = centerY + Math.sin(angle) * bladeLength/4; // End y of blade
    return { centerX, centerY, endX, endY };
  });

  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(e.target.x(), e.target.y())}
      onClick={onClick}
    >
      {/* Base Grass Area */}
      <Rect
        width={width}
        height={height}
        fill={color}
        stroke={selected ? 'red' : 'black'}
        strokeWidth={2}
      />
      {/* Radial Grass Blades */}
      {blades.map((blade, index) => (
        <Line
          key={index}
          points={[blade.centerX, blade.centerY, blade.endX, blade.endY]}
          stroke={bladeColor}
          strokeWidth={1}
          lineCap="round"
          lineJoin="round"
        />
      ))}
    </Group>
  );
};

export default Grass;
