import React, { useState } from 'react';
import { Group, Line, Circle, Text } from 'react-konva';

interface FreeformOvalPoolProps {
  x: number;
  y: number;
  points: { x: number; y: number }[]; // List of anchor points
  borderColor?: string; // Border color
  borderWidth?: number; // Border width
  draggable?: boolean;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  onShapeUpdate?: (newPoints: { x: number; y: number }[]) => void;
  selected?: boolean;
}

const FreeformOvalPool: React.FC<FreeformOvalPoolProps> = ({
  x,
  y,
  points,
  borderColor = '#2a9d8f',
  borderWidth = 8,
  draggable = true,
  onClick,
  onDragEnd,
  onShapeUpdate,
  selected = false,
}) => {
  const [localPoints, setLocalPoints] = useState(points);

  // Update an individual anchor point
  const handleAnchorDrag = (index: number, newX: number, newY: number) => {
    const updatedPoints = [...localPoints];
    updatedPoints[index] = { x: newX, y: newY };
    setLocalPoints(updatedPoints);
    if (onShapeUpdate) {
      onShapeUpdate(updatedPoints);
    }
  };

  // Add a new anchor point
  const addAnchorPoint = (x: number, y: number) => {
    const updatedPoints = [...localPoints, { x, y }];
    setLocalPoints(updatedPoints);
    if (onShapeUpdate) {
      onShapeUpdate(updatedPoints);
    }
  };

//   const generateBezierCurvePoints = () => {
//     const curvePoints: number[] = [];
//     const numPoints = localPoints.length;
  
//     for (let i = 0; i < numPoints; i++) {
//       const prevPoint = localPoints[(i - 1 + numPoints) % numPoints]; // Previous point
//       const currentPoint = localPoints[i]; // Current point
//       const nextPoint = localPoints[(i + 1) % numPoints]; // Next point
//       const nextNextPoint = localPoints[(i + 2) % numPoints]; // Point after next
  
//       // Adjust control points based on segment distances
//       const controlPoint1 = {
//         x: currentPoint.x + (nextPoint.x - prevPoint.x) * 0.2, // Adjust tension (0.2 is the tension factor)
//         y: currentPoint.y + (nextPoint.y - prevPoint.y) * 0.2,
//       };
  
//       const controlPoint2 = {
//         x: nextPoint.x - (nextNextPoint.x - currentPoint.x) * 0.2,
//         y: nextPoint.y - (nextNextPoint.y - currentPoint.y) * 0.2,
//       };
  
//       curvePoints.push(currentPoint.x, currentPoint.y, controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, nextPoint.x, nextPoint.y);
//     }
  
//     return curvePoints;
//   };
const generateClosedBezierCurvePoints = () => {
    const curvePoints: number[] = [];
    const numPoints = localPoints.length;
  
    for (let i = 0; i < numPoints; i++) {
      const prevPoint = localPoints[(i - 1 + numPoints) % numPoints]; // Previous point
      const currentPoint = localPoints[i]; // Current point
      const nextPoint = localPoints[(i + 1) % numPoints]; // Next point
      const nextNextPoint = localPoints[(i + 2) % numPoints]; // Point after next
  
      // Calculate control points
      const controlPoint1 = {
        x: currentPoint.x + (nextPoint.x - prevPoint.x) * 0.25, // Adjusting the tension factor
        y: currentPoint.y + (nextPoint.y - prevPoint.y) * 0.25,
      };
  
      const controlPoint2 = {
        x: nextPoint.x - (nextNextPoint.x - currentPoint.x) * 0.25,
        y: nextPoint.y - (nextNextPoint.y - currentPoint.y) * 0.25,
      };
  
      // Push points in Bezier format: [current, control1, control2, next]
      curvePoints.push(
        currentPoint.x, currentPoint.y, // Start point
        controlPoint1.x, controlPoint1.y, // First control point
        controlPoint2.x, controlPoint2.y, // Second control point
        nextPoint.x, nextPoint.y // End point
      );
    }
  
    return curvePoints;
  };
  
  
  const calculateDistance = (
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number => {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  };



  const bezierPoints = generateClosedBezierCurvePoints();

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
        points={bezierPoints}
        stroke={borderColor}
        strokeWidth={borderWidth}
        closed
        bezier
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
          points={generateClosedBezierCurvePoints()}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 200, y: 200 }}
        fillLinearGradientColorStops={[0, '#69c9ef', 1, '#38a1db']}
        closed
        bezier
      />
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

export default FreeformOvalPool;
