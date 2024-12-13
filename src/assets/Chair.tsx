import React, { useState } from 'react';
import { Group, Rect } from 'react-konva';

interface PoolChairProps {
  x: number;
  y: number;
  width: number; // Chair length
  height: number; // Chair breadth
  rotation?: number; // Rotation angle
  color?: string; // Chair slat color
  sideHandleColor?: string; // Side handle color
  draggable?: boolean;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  onResize?: (newWidth: number, newHeight: number) => void;
  onRotate?: (newRotation: number) => void;
  selected?: boolean;
}

const PoolChair: React.FC<PoolChairProps> = ({
  x,
  y,
  width,
  height,
  rotation = 0,
  color = '#d2a679', // Light brown for slats
  sideHandleColor = '#8b5a2b', // Darker brown for handles
  draggable = true,
  onClick,
  onDragEnd,
  onResize,
  onRotate,
  selected = false,
}) => {
  const slatCount = Math.floor(height / 10); // Number of slats based on height
  const slatWidth = width - 20; // Slats width, with padding from side handles
  const slatHeight = 6; // Height of each slat
  const handleWidth = 10; // Width of side handles
  const handleHeight = height / 2; // Height of side handles

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(e.target.x(), e.target.y())}
      onClick={onClick}
    >
      {/* Left Side Handle */}
      <Rect
        x={-width / 2 + 5}
        y={-height / 4}
        width={handleWidth}
        height={handleHeight}
        fill={sideHandleColor}
        cornerRadius={2}
      />
      {/* Right Side Handle */}
      <Rect
        x={width / 2 - 15}
        y={-height / 4}
        width={handleWidth}
        height={handleHeight}
        fill={sideHandleColor}
        cornerRadius={2}
      />

      {/* Chair Slats */}
      {Array.from({ length: slatCount }).map((_, index) => (
        <Rect
          key={index}
          x={-slatWidth / 2}
          y={-height / 2 + index * (height / slatCount) + 2}
          width={slatWidth}
          height={slatHeight}
          fill={color}
          cornerRadius={2}
        />
      ))}

      {/* Chair Outline */}
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        stroke={selected ? 'red' : 'black'}
        strokeWidth={2}
      />
    </Group>
  );
};

export default PoolChair;
