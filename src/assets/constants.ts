export const ELEMENTS = {
    pool: {
      name: 'Pool',
      features: [
        { name: 'Depth', options: ['4ft', '6ft', '8ft'] },
        { name: 'Perimeter', options: ['Standard', 'Custom'] },
      ],
      materials: [
        { id: 'tile', name: 'Tile', image: '/images/tile.png', cost: 50 },
        { id: 'stone', name: 'Stone', image: '/images/stone.png', cost: 100 },
      ],
      dimensions: {
        length: 20, // Default length
        width: 10,  // Default width
        depth: 4,   // Default depth in feet
      },
    },
    hotTub: {
      name: 'Hot Tub',
      shapes: [
        {
          title: 'Square Hot Tub',
          key: 'square',
          image: '/images/square-tub.png',
          dimensions: { length: 5, width: 5, depth: 3 }, // Dimensions in feet
        },
        {
          title: 'Octagon Hot Tub',
          key: 'octagon',
          image: '/images/octagon-tub.png',
          dimensions: { radius: 3, depth: 3 }, // Radius for octagon
        },
      ],
      features: [
        { name: 'Jets', options: ['Standard', 'Powerful'] },
        { name: 'Material', options: ['Fiberglass', 'Concrete'] },
      ],
    },
  };
  