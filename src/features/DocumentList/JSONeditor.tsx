// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const calculateArcPoints = (start, end) => {
  const points = [];
  const bulge = start.bulge;

  if (bulge === 0) return points;

  const angle = 4 * Math.atan(bulge);
  const distance = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  const radius = distance / (2 * Math.sin(angle / 2));

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const perpendicularLength = Math.sqrt(radius ** 2 - (distance / 2) ** 2);
  const direction = bulge > 0 ? 1 : -1;
  const normalX = (-dy / distance) * direction;
  const normalY = (dx / distance) * direction;

  const centerX = midX + normalX * perpendicularLength;
  const centerY = midY + normalY * perpendicularLength;

  const startAngle = Math.atan2(start.y - centerY, start.x - centerX);
  let endAngle = Math.atan2(end.y - centerY, end.x - centerX);

  if (bulge < 0 && endAngle > startAngle) endAngle -= 2 * Math.PI;
  if (bulge > 0 && endAngle < startAngle) endAngle += 2 * Math.PI;

  const arcLength = Math.abs(endAngle - startAngle);
  const segments = Math.max(8, Math.ceil(arcLength * 16));
  const deltaAngle = arcLength / segments;

  for (let i = 1; i < segments; i++) {
    const theta = startAngle + deltaAngle * i;
    points.push({
      x: centerX + radius * Math.cos(theta),
      y: centerY + radius * Math.sin(theta),
      z: 0,
    });
  }

  return points;
};

const JSONEditor = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setJsonData(data);
        renderJSON(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.readAsText(file);
  };

  const renderJSON = (data) => {
    const scene = sceneRef.current;
    scene.clear();

    const gridHelper = new THREE.GridHelper(1000, 100);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    const layerColors = {
      Pool: 0x0000ff,
      Deck: 0x00ff00,
      Spa: 0xff0000,
      Steps_And_Benches: 0xffff00,
    };

    data.entities.forEach((entity) => {
      let object = null;

      try {
        if (entity.type === 'POLYLINE') {
          const points = [];
          entity.vertices.forEach((v1, i) => {
            const v2 = entity.vertices[(i + 1) % entity.vertices.length];
            points.push(new THREE.Vector3(v1.x, v1.y, v1.z || 0));

            if (v1.bulge) {
              const arcPoints = calculateArcPoints(v1, v2);
              points.push(...arcPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z || 0)));
            }
          });

          if (entity.is_closed) points.push(points[0]);

          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color: layerColors[entity.layer] || 0xffffff });

          object = entity.is_closed
            ? new THREE.LineLoop(geometry, material)
            : new THREE.Line(geometry, material);
        } else if (entity.type === 'CIRCLE') {
          const geometry = new THREE.CircleGeometry(entity.radius, 64);
          const material = new THREE.MeshBasicMaterial({ color: layerColors[entity.layer] || 0xffff00, wireframe: true });
          object = new THREE.Mesh(geometry, material);
          object.position.set(entity.center.x, entity.center.y, entity.center.z || 0);
        } else if (entity.type === 'LINE') {
          const geometry = new THREE.BufferGeometry();
          const vertices = new Float32Array([
            entity.start.x, entity.start.y, entity.start.z || 0,
            entity.end.x, entity.end.y, entity.end.z || 0,
          ]);
          geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
          const material = new THREE.LineBasicMaterial({ color: layerColors[entity.layer] || 0xffffff });
          object = new THREE.Line(geometry, material);
        }

        if (object) scene.add(object);
      } catch (error) {
        console.warn(`Error rendering entity ${entity.type}:`, error);
      }
    });

    initializeRenderer();
  };

  const initializeRenderer = () => {
    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ canvas });
    }
    const renderer = rendererRef.current;
    renderer.setSize(width, height);

    if (!cameraRef.current) {
      cameraRef.current = new THREE.OrthographicCamera(
        -width / 2, width / 2,
        height / 2, -height / 2,
        1, 1000
      );
      cameraRef.current.position.z = 500;
    }
    const camera = cameraRef.current;

    renderer.render(sceneRef.current, camera);
  };

  useEffect(() => {
    const handleResize = () => {
      initializeRenderer();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileUpload} />
      <div style={{ width: '100%', height: '100%', border: '1px solid black' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default JSONEditor;
