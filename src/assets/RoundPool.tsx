import React from 'react';

interface RoundPoolProps {
  size: number;
  color?: string;
}

const RoundPool: React.FC<RoundPoolProps> = ({ size, color = 'lightblue' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="45" fill={color} />
    <circle cx="50" cy="50" r="35" fill="white" />
  </svg>
);

export default RoundPool;
