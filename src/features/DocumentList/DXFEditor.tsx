// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { Helper } from 'dxf'
import * as THREE from 'three'

const calculateArcPoints = (start, end) => {
  const points = []
  const bulge = start.bulge

  if (bulge === 0) return points // Straight line if no bulge

  const angle = 4 * Math.atan(bulge) // Central angle
  const distance = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2)
  const radius = distance / (2 * Math.sin(angle / 2))

  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  const dx = end.x - start.x
  const dy = end.y - start.y

  const perpendicularLength = Math.sqrt(radius ** 2 - (distance / 2) ** 2)
  const direction = bulge > 0 ? 1 : -1
  const normalX = (-dy / distance) * direction
  const normalY = (dx / distance) * direction

  const centerX = midX + normalX * perpendicularLength
  const centerY = midY + normalY * perpendicularLength

  const startAngle = Math.atan2(start.y - centerY, start.x - centerX)
  let endAngle = Math.atan2(end.y - centerY, end.x - centerX)

  if (bulge < 0 && endAngle > startAngle) endAngle -= 2 * Math.PI
  if (bulge > 0 && endAngle < startAngle) endAngle += 2 * Math.PI

  const arcLength = Math.abs(endAngle - startAngle)
  const segments = Math.max(8, Math.ceil(arcLength * 16))
  const deltaAngle = arcLength / segments

  for (let i = 1; i < segments; i++) {
    const theta = startAngle + deltaAngle * i
    points.push({
      x: centerX + radius * Math.cos(theta),
      y: centerY + radius * Math.sin(theta),
      z: 0,
    })
  }

  return points
}

const DXFEditor = () => {
  const canvasRef = useRef(null)
  const sceneRef = useRef(new THREE.Scene())
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const [dxfHelper, setDxfHelper] = useState(null)
  const [dxfinitialContent, setDxfInitialContent] = useState()

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const dxfContent = e.target.result
      try {
        const helper = new Helper(dxfContent) // Pass content here
        setDxfHelper(helper)

        console.log(helper, 'content')

        renderDXF(helper)
      } catch (error) {
        console.error('Error parsing DXF:', error)
      }
    }

    reader.readAsText(file)
  }

  // Enhanced DXF Renderer
  const renderDXF = (helper) => {
    const scene = sceneRef.current
    scene.clear()

    const entities = helper.denormalised

    const layerColors = {
      Pool: 0x0000ff, // Blue
      Deck: 0x00ff00, // Green
      Spa: 0xff0000, // Red
      Steps_And_Benches: 0xffff00, // Yellow
    }

    entities.forEach((entity) => {
      let object

      try {
        // Process Polyline Entities
        if (entity.type === 'POLYLINE') {
            const points = [];
            for (let i = 0; i < entity.vertices.length; i++) {
                const v1 = entity.vertices[i];
                const v2 = entity.vertices[(i + 1) % entity.vertices.length]; // Wrap-around for closed polylines
        
                // Add current vertex to points
                points.push(new THREE.Vector3(v1.x, v1.y, v1.z || 0));
        
                // Handle bulge for arcs
                if (v1.bulge && v1.bulge !== 0) {
                    const arcPoints = calculateArcPoints(v1, v2);
                    console.log("Computed Arc Points:", arcPoints); // Debugging
                    points.push(...arcPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z || 0)));
                }
            }
        
            // Close the polyline if needed
            if (entity.closed) points.push(points[0]);
        
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: layerColors[entity.layer] || 0xffffff,
            });
        
            object = entity.closed
                ? new THREE.LineLoop(geometry, material)
                : new THREE.Line(geometry, material);
        }
        
        

        if (entity.type === 'ARC') {
          const curve = new THREE.ArcCurve(
            entity.x,
            entity.y,
            entity.r,
            entity.startAngle,
            entity.endAngle,
            false,
          )
          const points = curve.getPoints(50)
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
          object = new THREE.Line(geometry, material)
        }

        if (entity.type === 'CIRCLE') {
          const geometry = new THREE.CircleGeometry(entity.r, 64)
          const material = new THREE.LineBasicMaterial({ color: 0xffff00 })
          object = new THREE.Mesh(geometry, material)
          object.position.set(entity.x, entity.y, entity.z || 0)
        }

        if (entity.type === 'LINE' && entity.start && entity.end) {
          const geometry = new THREE.BufferGeometry()
          const vertices = new Float32Array([
            entity.start.x,
            entity.start.y,
            entity.start.z || 0,
            entity.end.x,
            entity.end.y,
            entity.end.z || 0,
          ])
          geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(vertices, 3),
          )
          const material = new THREE.LineBasicMaterial({ color: 0xffffff })
          object = new THREE.Line(geometry, material)
        }

        if (object && entity.transforms && entity.transforms.length > 0) {
          const transform = entity.transforms[0]
          object.position.set(
            transform.x || 0,
            transform.y || 0,
            transform.z || 0,
          )
          object.scale.set(
            transform.scaleX || 1,
            transform.scaleY || 1,
            transform.scaleZ || 1,
          )
          object.rotation.set(
            transform.rotationX || 0,
            transform.rotationY || 0,
            transform.rotationZ || 0,
          )
        }

        if (object) scene.add(object)
      } catch (error) {
        console.warn(`Error processing entity ${entity.type}:`, error)
      }
    })




    // const gridHelper = new THREE.GridHelper(1000, 100)
    // scene.add(gridHelper)
    initializeRenderer()
  }

  const initializeRenderer = () => {
    const canvas = canvasRef.current
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ canvas })
    }
    const renderer = rendererRef.current
    renderer.setSize(width, height, true)

    if (!cameraRef.current) {
      cameraRef.current = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        1,
        1000,
      )
      cameraRef.current.position.z = 500
    }
    const camera = cameraRef.current

    renderer.render(sceneRef.current, camera)
  }

  const exportDXF = () => {
    if (!dxfHelper) {
      console.error('No DXF data available to export.')
      return
    }

    // Create a Helper instance with valid DXF content
    const dxfContent = dxfHelper.toString() // Generate DXF content from the current state
    const helper = new Helper(dxfContent) // Pass valid DXF content here

    const exportedContent = helper.toString() // Serialize to DXF format
    const blob = new Blob([exportedContent], { type: 'application/dxf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'exported.dxf'
    link.click()
  }

  useEffect(() => {
    const handleResize = () => {
      initializeRenderer()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div>
      <input type="file" accept=".dxf" onChange={handleFileUpload} />
      <button onClick={exportDXF} disabled={!dxfHelper}>
        Export DXF
      </button>
      <div
        style={{
          width: '100%',
          height: '600px',
          border: '1px solid black',
        }}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}

export default DXFEditor
