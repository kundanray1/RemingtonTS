export type Point = {
  x: number;
  y: number;
};

export type GrassShape = {
  id: number;
  type: 'grass';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type PathwayShape = {
  id: number;
  type: 'pathway';
  x: number;
  y: number;
  width: number;
  height: number;
  texture?: string;
  color: string;
};

export type PoolShape = {
  id: number;
  type: 'pool';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type FurnitureShape = {
  id: number;
  type: 'furniture';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type TreeShape = {
  id: number;
  type: 'tree';
  x: number;
  y: number;
  radius: number;
  color: string;
};

export type PlantBedShape = {
  id: number;
  type: 'plant-bed';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type BorderShape = {
  id: number;
  type: 'border';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type FreeformGrassShape = {
  id: number;
  type: 'freeformGrass';
  x: number;
  y: number;
  points: Point[];
  color: string;
};

export type FreeformOvalPoolShape = {
  id: number;
  type: 'freeformOvalPool';
  x: number;
  y: number;
  points: Point[];
  borderColor: string;
  borderWidth: number;
};

export type Shape =
  | GrassShape
  | PathwayShape
  | PoolShape
  | FurnitureShape
  | TreeShape
  | PlantBedShape
  | BorderShape
  | FreeformGrassShape
  | FreeformOvalPoolShape;
