import React from 'react';
import { Group, Circle, Line } from 'react-konva';

interface TreeProps {
  x: number;
  y: number;
  radius: number; // Overall canopy radius
  branchCount?: number; // Number of branches/leaves
  leafRadius?: number; // Radius of each leaf node
  draggable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
}

const Tree: React.FC<TreeProps> = ({
  x,
  y,
  radius,
  branchCount = 20,
  leafRadius = 10,
  draggable = true,
  selected = false,
  onClick,
  onDragEnd,
}) => {
  // Generate radial branch points
  const branches = Array.from({ length: branchCount }, (_, i) => {
    const angle = (i / branchCount) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(e.target.x(), e.target.y())}
      onClick={onClick}
    >
      {/* Tree Canopy */}
      {branches.map((branch, index) => (
        <Circle
          key={index}
          x={branch.x}
          y={branch.y}
          radius={leafRadius}
          fill="green"
          stroke={selected ? 'red' : 'black'}
          strokeWidth={1}
        />
      ))}

      {/* Central Circle */}
      <Circle
        x={0}
        y={0}
        radius={leafRadius * 2} // Slightly larger central leaf
        fill="darkBrown"
        stroke={selected ? 'red' : 'black'}
        strokeWidth={2}
      />
    </Group>
  );
};

export default Tree;
