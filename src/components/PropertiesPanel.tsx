import React, { useState } from 'react';
import { Shape } from '../types/ShareTypes';

interface PropertiesPanelProps {
  element: Shape;
  updateElement: (id: number, newProps: Partial<Shape>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  element,
  updateElement,
}) => {
  const [x, setX] = useState(element.x);
  const [y, setY] = useState(element.y);
  const [width, setWidth] = useState(element.width || 0);
  const [height, setHeight] = useState(element.height || 0);

  const handleUpdate = () => {
    updateElement(element.id, { x, y, width, height });
  };

  return (
    <div style={{ width: '200px', padding: '10px', borderLeft: '1px solid gray' }}>
      <h3>Properties</h3>
      <div>
        <label>X:</label>
        <input
          type="number"
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Y:</label>
        <input
          type="number"
          value={y}
          onChange={(e) => setY(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Width:</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Height:</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
      </div>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default PropertiesPanel;
