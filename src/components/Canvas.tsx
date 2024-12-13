import React, { useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';

import PoolChair from '../assets/Chair';
import FreeformGrass from '../assets/FreeFormGrass';
import FreeformOvalPool from '../assets/FreeFormOvalPool';
import FreeformPool from '../assets/FreeFormPool';
import Pathway from '../assets/PathWay';
import Tree from '../assets/Tree';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import Modal from './Modal';
import { updatePool } from '../features/DocumentList/cadStateSlice';
import type { Shape } from '../services/ShareTypes';

interface CanvasProps {
  elements: Shape[];
  setSelectedElementId: (id: number | null) => void;
  updateElement: (id: number, newProps: Partial<Shape>) => void;
  selectedElementId: number | null;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  setSelectedElementId,
  updateElement,
  selectedElementId,
}) => {
  const { totalPrice, pools } = useAppSelector((state) => state.cadStateSlice);
  const dispatch = useAppDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);

  const handlePoolClick = (id: string) => {
    setSelectedPoolId(id);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedPoolId(null);
    setIsModalVisible(false);
  };

  const handleDragEnd = (id: number, x: number, y: number) => {
    updateElement(id, { x, y });
  };

  const renderElement = (element: any) => {
    switch (element.type) {
      case 'pool':
        return (
          <FreeformPool
            key={element.id}
            x={element.x || 50}
            y={element.y || 50}
            points={
              element.points || [
                { x: 50, y: 50 },
                { x: 150, y: 50 },
                { x: 150, y: 100 },
                { x: 50, y: 100 },
              ]
            }
            borderColor="blue"
            borderWidth={2}
            draggable
            onShapeUpdate={(newPoints) =>
              updateElement(element.id, { points: newPoints })
            }
            onDragEnd={(x, y) => handleDragEnd(element.id, x, y)}
            onClick={() => handlePoolClick(element.id)}
            selected={selectedElementId === element.id}
          />
        );
      default:
        return null;
    }
  };

  const drawGrid = (width: number, height: number, gridSize: number) => {
    const lines = [];
    for (let i = 0; i < width / gridSize; i++) {
      const x = i * gridSize;
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, height]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    for (let i = 0; i < height / gridSize; i++) {
      const y = i * gridSize;
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, width, y]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    return lines;
  };

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <div className="p-2 bg-green-400">
        <h2 className="text-3xl text-white">Total Cost: ${totalPrice}</h2>
      </div>

      <Stage
        width={window.innerWidth - 200}
        height={window.innerHeight}
        style={{ background: '#f0f0f0' }}
        onMouseDown={() => setSelectedElementId(null)}
      >
        <Layer>
          {drawGrid(window.innerWidth - 200, window.innerHeight, 50)}
        </Layer>
        <Layer>{pools.map((element) => renderElement(element))}</Layer>
      </Stage>

      {isModalVisible && selectedPoolId && (
        <Modal poolId={selectedPoolId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Canvas;
