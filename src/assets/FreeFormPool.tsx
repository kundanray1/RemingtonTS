import React, { useState } from 'react';
import { Group, Line, Circle, Text } from 'react-konva';

interface FreeformPoolProps {
  x: number;
  y: number;
  points: { x: number; y: number }[]; // List of points forming the pool
  borderColor?: string; // Color of the pool's border
  borderWidth?: number; // Width of the border
  draggable?: boolean;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  onShapeUpdate?: (newPoints: { x: number; y: number }[]) => void;
  selected?: boolean;
}

const FreeformPool: React.FC<FreeformPoolProps> = ({
  x,
  y,
  points,
  borderColor = 'red',
  borderWidth = 10,
  draggable = true,
  onClick,
  onDragEnd,
  onShapeUpdate,
  selected = false,
}) => {
  const [localPoints, setLocalPoints] = useState(points);

  // Update an individual anchor point
  const handleAnchorDrag = (index: number, x: number, y: number) => {
    const updatedPoints = [...localPoints];
    updatedPoints[index] = { x, y };
    setLocalPoints(updatedPoints);
    if (onShapeUpdate) {
      onShapeUpdate(updatedPoints);
    }
  };

  // Generate random bubbles
  const generateBubbles = () => {
    const bubbleCount = 1000; // Number of bubbles
    return Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * 2000 , // Random x offset
      y: Math.random() * 1000 , // Random y offset
      radius: Math.random() * 5 + 3, // Random size of bubbles
      opacity: Math.random() * 0.5 + 0.1, // Random opacity for bubbles
    }));
  };

  const bubbles = generateBubbles();

  // Calculate distance between two points
  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  };
  // Calculate the distance from a point to a line segment
  const pointToSegmentDistance = (point: { x: number; y: number }, start: { x: number; y: number }, end: { x: number; y: number }) => {
    const A = point.x - start.x;
    const B = point.y - start.y;
    const C = end.x - start.x;
    const D = end.y - start.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;

    let xx, yy;
    if (param < 0) {
      xx = start.x;
      yy = start.y;
    } else if (param > 1) {
      xx = end.x;
      yy = end.y;
    } else {
      xx = start.x + param * C;
      yy = start.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };



 // Add a new anchor point
 const addAnchorPoint = (x: number, y: number) => {
    let closestSegmentIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < localPoints.length; i++) {
      const start = localPoints[i];
      const end = localPoints[(i + 1) % localPoints.length];
      const distance = pointToSegmentDistance({ x, y }, start, end);

      if (distance < minDistance) {
        minDistance = distance;
        closestSegmentIndex = i;
      }
    }

    const updatedPoints = [...localPoints];
    updatedPoints.splice(closestSegmentIndex + 1, 0, { x, y });

    setLocalPoints(updatedPoints);
    if (onShapeUpdate) {
      onShapeUpdate(updatedPoints);
    }
  };
  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(e.target.x(), e.target.y())}
      onClick={onClick}
    >
       {/* Pool Border */}
       <Line
        points={localPoints.flatMap((p) => [p.x, p.y])}
        stroke={borderColor}
        strokeWidth={borderWidth}
        closed
        onDblClick={(e) => {
          const stage = e.target.getStage();
          const mousePos = stage?.getPointerPosition();
          if (mousePos) {
            addAnchorPoint(mousePos.x - x, mousePos.y - y);
          }
        }}
      />
      {/* Pool Interior */}
      <Line
        points={localPoints.flatMap((p) => [p.x, p.y])}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 300, y: 300 }}
        fillLinearGradientColorStops={[0, '#69c9ef', 1, '#38a1db']}
        closed
      />



      {/* Distance Labels */}
      {localPoints.map((point, index) => {
        const nextPoint = localPoints[(index + 1) % localPoints.length];
        const distance = calculateDistance(point, nextPoint).toFixed(2);
        const midpoint = {
          x: (point.x + nextPoint.x) / 2,
          y: (point.y + nextPoint.y) / 2,
        };

        return (
          <Text
            key={`distance-${index}`}
            x={midpoint.x - 20} // Offset the text for better visibility
            y={midpoint.y - 10}
            text={`${distance}`}
            fontSize={14}
            fill="black"
          />
        );
      })}

      {/* Clip Group for Bubbles */}
      <Group
        clipFunc={(ctx) => {
          ctx.beginPath();
          ctx.moveTo(localPoints[0].x, localPoints[0].y);
          localPoints.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.closePath();
        }}
      >
        {/* Bubbles */}
        {bubbles.map((bubble, index) => (
          <Circle
            key={index}
            x={bubble.x}
            y={bubble.y}
            radius={bubble.radius}
            fill="white"
            opacity={bubble.opacity}
          />
        ))}
      </Group>

      {/* Anchor Points */}
      {localPoints.map((point, index) => (
        <Circle
          key={index}
          x={point.x}
          y={point.y}
          radius={6}
          fill="white"
          stroke="black"
          strokeWidth={2}
          draggable
          onDragMove={(e) => handleAnchorDrag(index, e.target.x(), e.target.y())}
        />
      ))}
    </Group>
  );
};

export default FreeformPool;
