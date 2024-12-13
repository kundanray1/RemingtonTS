import React from 'react';
import { Group } from 'react-konva';
import Tree from '../assets/Tree';

interface TreeWithInteractionProps {
  x: number;
  y: number;
  size: number;
  color?: string;
  id: number;
  onDragEnd: (id: number, x: number, y: number) => void;
}

const TreeWithInteraction: React.FC<TreeWithInteractionProps> = ({
  x,
  y,
  size,
  color,
  id,
  onDragEnd,
}) => {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={(e) => onDragEnd(id, e.target.x(), e.target.y())}
    >
      <Tree x={0} y={0} size={size} color={color} />
    </Group>
  );
};

export default TreeWithInteraction;
