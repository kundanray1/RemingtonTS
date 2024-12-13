import React, { useState, useEffect } from 'react';
import { ELEMENTS } from '../assets/constants';
import { updatePool } from '../features/DocumentList/cadStateSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

const Modal: React.FC<{ poolId: string; onClose: () => void }> = ({ poolId, onClose }) => {
  const dispatch = useAppDispatch();
  const pool = useAppSelector((state) => state?.cadSlice?.pools?.find((p) => p.id === poolId));
const state= useAppSelector(state=>state)
  console.log(state)
  const [length, setLength] = useState(pool?.length || 20);
  const [width, setWidth] = useState(pool?.width || 10);
  const [depth, setDepth] = useState(pool?.depth || 4);
  const [material, setMaterial] = useState(pool?.material || ELEMENTS.pool.materials[0]);
  const [features, setFeatures] = useState(pool?.features || []);


  useEffect(() => {
    if (pool) {
      setLength(pool.length);
      setWidth(pool.width);
      setDepth(pool.depth);
      setMaterial(pool.material);
      setFeatures(pool.features);
    }
  }, [pool]);

  const handleSave = () => {
    const perimeter = 2 * (length + width);
    dispatch(
      updatePool({
        id: poolId,
        updates: { length, width, depth, material, features, perimeter },
      })
    );
    onClose();
  };

  const handleFeatureChange = (featureName: string, value: string) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.name === featureName ? { ...f, value } : f
      )
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          width: '500px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Customize Pool</h3>
        <div>
          <label>Length (ft):</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Width (ft):</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Depth (ft):</label>
          <select value={depth} onChange={(e) => setDepth(Number(e.target.value))}>
            {ELEMENTS.pool.features.find((f) => f.name === 'Depth')?.options.map((option) => (
              <option key={option} value={Number(option.replace('ft', ''))}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Material:</label>
          <select
            value={material.id}
            onChange={(e) =>
              setMaterial(ELEMENTS.pool.materials.find((m) => m.id === e.target.value)!)
            }
          >
            {ELEMENTS.pool.materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        {features.map((feature) => (
          <div key={feature.name}>
            <label>{feature.name}:</label>
            <select
              value={feature.value}
              onChange={(e) => handleFeatureChange(feature.name, e.target.value)}
            >
              {ELEMENTS.pool.features
                .find((f) => f.name === feature.name)
                ?.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>
        ))}
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
