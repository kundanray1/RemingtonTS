import React from 'react';
import { Group, Rect } from 'react-konva';

interface PathwayProps {
  x: number;
  y: number;
  width: number;
  height: number;
  tileSize?: number; // Size of each tile
  tileColor1?: string; // Primary tile color
  tileColor2?: string; // Secondary tile color
  draggable?: boolean;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  selected?: boolean;
}

const Pathway: React.FC<PathwayProps> = ({
  x,
  y,
  width,
  height,
  tileSize = 40, // Default size of each tile
  tileColor1 = '#d3d3d3', // Light gray
  tileColor2 = '#a9a9a9', // Dark gray
  draggable = true,
  onClick,
  onDragEnd,
  selected = false,
}) => {
  const tiles = [];
  const rows = Math.ceil(height / tileSize);
  const cols = Math.ceil(width / tileSize);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const xPos = col * tileSize;
      const yPos = row * tileSize;

      // Determine the tile width and height to cut overflow
      const tileWidth = Math.min(tileSize, width - xPos);
      const tileHeight = Math.min(tileSize, height - yPos);

      // Skip drawing tiles that are fully out of bounds
      if (tileWidth <= 0 || tileHeight <= 0) continue;

      const isPrimaryColor = (row + col) % 2 === 0; // Alternate color pattern

      tiles.push({
        x: xPos,
        y: yPos,
        width: tileWidth,
        height: tileHeight,
        color: isPrimaryColor ? tileColor1 : tileColor2,
      });
    }
  }

  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(e.target.x(), e.target.y())}
      onClick={onClick}
    >
      {/* Render each tile */}
      {tiles.map((tile, index) => (
        <Rect
          key={index}
          x={tile.x}
          y={tile.y}
          width={tile.width}
          height={tile.height}
          fill={tile.color}
          stroke="black"
          strokeWidth={1}
        />
      ))}

      {/* Outline for selection */}
      <Rect
        width={width}
        height={height}
        fill="transparent"
        stroke={selected ? 'red' : 'transparent'}
        strokeWidth={2}
      />
    </Group>
  );
};

export default Pathway;
