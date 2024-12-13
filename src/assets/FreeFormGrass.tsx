import React, { useState } from 'react';
import { Group, Line, Circle, Text } from 'react-konva';

interface FreeformGrassProps {
  x: number;
  y: number;
  points: { x: number; y: number }[]; // Points defining the grass area
  baseDensity?: number; // Density of grass blades
  bladeLength?: number; // Length of grass blades
  bladeColor?: string; // Color of individual blades
  areaColor?: string; // Color of the grass area
  draggable?: boolean;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  onShapeUpdate?: (newPoints: { x: number; y: number }[]) => void;
  selected?: boolean;
}

const FreeformGrass: React.FC<FreeformGrassProps> = ({
  x,
  y,
  points,
  baseDensity = 300,
  bladeLength = 10,
  bladeColor = '#a2ba7c',
  areaColor = '#1c370a',
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

  // Generate random points inside the polygon
  const generateRandomPointInPolygon = (polygon: { x: number; y: number }[]) => {
    const [minX, maxX] = [
      Math.min(...polygon.map((p) => p.x)),
      Math.max(...polygon.map((p) => p.x)),
    ];
    const [minY, maxY] = [
      Math.min(...polygon.map((p) => p.y)),
      Math.max(...polygon.map((p) => p.y)),
    ];

    while (true) {
      const randomX = Math.random() * (maxX - minX) + minX;
      const randomY = Math.random() * (maxY - minY) + minY;

      if (isPointInPolygon({ x: randomX, y: randomY }, polygon)) {
        return { x: randomX, y: randomY };
      }
    }
  };

  // Check if a point is inside the polygon
  const isPointInPolygon = (point: { x: number; y: number }, polygon: { x: number; y: number }[]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };
   // Calculate the distance between two points
   const calculateDistance = (
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number => {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  };


  // Generate grass blades
  const generateBlades = () => {
    return Array.from({ length: baseDensity }, () => {
      const randomPoint = generateRandomPointInPolygon(localPoints);
      const angle = Math.random() * Math.PI * 2; // Random angle
      const endX = randomPoint.x + Math.cos(angle) * bladeLength;
      const endY = randomPoint.y + Math.sin(angle) * bladeLength;
      return { x: randomPoint.x, y: randomPoint.y, endX, endY };
    });
  };

  const blades = generateBlades();

  return (
    <Group
      x={x}
      y={y}
      draggable={draggable}
      onDragEnd={(e) => onDragEnd?.(e.target.x(), e.target.y())}
      onClick={onClick}
    >
      {/* Grass Area */}
      <Line
        points={localPoints.flatMap((p) => [p.x, p.y])}
        fill={areaColor}
        closed
        stroke={selected ? 'red' : 'black'}
        strokeWidth={2}
        onDblClick={(e) => {
          const stage = e.target.getStage();
          const mousePos = stage?.getPointerPosition();
          if (mousePos) {
            addAnchorPoint(mousePos.x - x, mousePos.y - y);
          }
        }}
      />

      {/* Grass Blades Clipped Inside Shape */}
      <Group
        clipFunc={(ctx) => {
          ctx.beginPath();
          ctx.moveTo(localPoints[0].x, localPoints[0].y);
          localPoints.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.closePath();
        }}
      >
        {blades.map((blade, index) => (
          <Line
            key={index}
            points={[blade.x, blade.y, blade.endX, blade.endY]}
            stroke={bladeColor}
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
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
            x={midpoint.x - 15}
            y={midpoint.y - 10}
            text={`${distance}`}
            fontSize={14}
            fill="black"
          />
        );
      })}
    </Group>
  );
};

export default FreeformGrass;
