import React, { useState } from 'react';
import { Shape } from '../../services/ShareTypes';
import PropertiesPanel from '../../components/PropertiesPanel';
import Canvas from '../../components/Canvas';
import Toolbox from '../../components/Toolbox';
import { useAppSelector } from '../../hooks/redux';


const DocumentList: React.FC = () => {
const pools=useAppSelector(state=>state.cadStateSlice.pools)
 
  const [elements, setElements] = useState<Shape[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);

  const addElement = (type: Shape['type']) => {
    const newElement: Shape =
      type === 'grass'
        ? {
            id: elements.length + 1,
            type,
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            color: 'green',
          }
        : type === 'pathway'
        ? {
            id: elements.length + 1,
            type,
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            color: 'brown',
          }
        : type === 'pool'
        ? {
            id: elements.length + 1,
            type,
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            color: 'blue',
          }
        : type === 'furniture'
        ? {
            id: elements.length + 1,
            type,
            x: 100,
            y: 100,
            width: 50,
            height: 50,
            color: 'gray',
          }
        : type === 'tree'
        ? {
            id: elements.length + 1,
            type,
            x: 100,
            y: 100,
            radius: 30,
            color: 'green',
          }
        : type === 'plant-bed'
        ? {
            id: elements.length + 1,
            type,
            x: 100,
            y: 100,
            width: 100,
            height: 50,
            color: 'darkgreen',
          }
        : type === 'border'
        ? {
            id: elements.length + 1,
            type,
            x: 100,
            y: 100,
            width: 800,
            height: 10,
            color: 'black',
          }
        : type === 'freeformGrass'
        ? {
            id: elements.length + 1,
            type,
            x: 100,
            y: 100,
            points: [
              { x: 50, y: 50 },


              { x: 150, y: 50 },
              { x: 150, y: 100 },
              { x: 50, y: 100 },
            ],
            color: 'green',
          }
        : {
            id: elements.length + 1,
            type,
            x: 100,
            y: 100,
            points: [
              { x: 50, y: 100 },
              { x: 100, y: 100 },
              { x: 150, y: 50 },
              { x: 150, y: 100 },
              { x: 50, y: 100 },
            ],
            borderColor: '#69c9ef',
            borderWidth: 8,
          };
    setElements([...elements, newElement]);
  };

  const updateElement = (id: number, newProps: Partial<Shape>) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '300vh' }}>
      {/* Toolbox for adding elements */}
      <Toolbox addElement={addElement} />

      {/* Main Canvas for designing */}
      <Canvas
        // elements={pools}
        setSelectedElementId={setSelectedElementId}
        updateElement={updateElement}
        selectedElementId={selectedElementId}
      />

      {/* Properties panel for editing selected element */}
      {selectedElementId && (
        <PropertiesPanel
          element={elements.find((el) => el.id === selectedElementId)!}
          updateElement={updateElement}
        />
      )}
    </div>
  );

}

export default DocumentList
