import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { ELEMENTS } from '../assets/constants';
import { addPool, toggle3DView } from '../features/DocumentList/cadStateSlice';
import Modal from './Modal'; // Import the Modal component

interface ToolBoxProps{
  addElement:()=>void
}



const Toolbox: React.FC<ToolBoxProps> = ({addElement}) => {
  const dispatch = useAppDispatch();


  const handleAddPool = () => {
    const newPool = {
      id: `pool-${Date.now()}`,
      type:'pool',
      length: ELEMENTS.pool.dimensions.length,
      width: ELEMENTS.pool.dimensions.width,
      depth: ELEMENTS.pool.dimensions.depth,
      x: ELEMENTS.pool.position.x, // Use default x-coordinate
      y: ELEMENTS.pool.position.y, // Use default y-coordinate
      perimeter: 2 * (ELEMENTS.pool.dimensions.length + ELEMENTS.pool.dimensions.width),
      material: ELEMENTS.pool.materials[0],
      features: [],
      price: 0,
    };
    newPool.price = 100 * newPool.perimeter;
    dispatch(addPool(newPool));
  };
  



  return (
    <div
      style={{
        width: '200px',
        padding: '10px',
        borderRight: '1px solid gray',
        backgroundColor: '#f7f7f7',
      }}
    >
      <h3>Toolbox</h3>
      <button
        className="text-center border-blue-500 rounded py-2 px-4 hover:bg-green-300"
        onClick={handleAddPool}
      >
        Add Pool
      </button>
      <button
        className="text-center border-blue-500 rounded py-2 px-4 hover:bg-green-300"
        onClick={() => dispatch(toggle3DView())}
      >
        Toggle 3D View
      </button>


    </div>
  );
};

export default Toolbox;
