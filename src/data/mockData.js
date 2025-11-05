// En un proyecto real, esto vendría de tu API de Spring Boot

export const INITIAL_USERS = [
  {
    id: 'u1',
    name: 'Admin Restaurante',
    email: 'admin@restaurante.com',
    password: 'admin', // En la vida real, esto sería un hash
    photo: 'https://placehold.co/100x100/E91E63/FFFFFF?text=Admin',
    role: 'admin',
    approved: true
  },
  {
    id: 'u2',
    name: 'Cliente Aprobado',
    email: 'cliente@restaurante.com',
    password: 'cliente',
    photo: 'https://placehold.co/100x100/3F51B5/FFFFFF?text=Cliente',
    role: 'user',
    approved: true
  },
  {
    id: 'u3',
    name: 'Cliente Pendiente',
    email: 'pendiente@restaurante.com',
    password: 'pendiente',
    photo: 'https://placehold.co/100x100/FF9800/FFFFFF?text=Pendiente',
    role: 'user',
    approved: false
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Hamburguesa Gourmet',
    description: 'Deliciosa hamburguesa de 200g de carne angus, queso cheddar, tocino y salsa especial.',
    price: 12.99,
    image: 'https://placehold.co/600x400/FFC107/000000?text=Hamburguesa',
    comments: [
      { id: 'c1', user: 'Cliente Aprobado', text: '¡La mejor hamburguesa que he probado!' },
      { id: 'c2', user: 'Admin Restaurante', text: 'Nos alegra que te haya gustado.' }
    ]
  },
  {
    id: 'p2',
    name: 'Pizza Pepperoni',
    description: 'Pizza de 30cm con base de tomate, mozzarella y abundante pepperoni.',
    price: 15.50,
    image: 'https://placehold.co/600x400/E91E63/FFFFFF?text=Pizza',
    comments: [
      { id: 'c3', user: 'Cliente Aprobado', text: 'Muy buena, aunque podría tener más queso.' }
    ]
  },
  {
    id: 'p3',
    name: 'Ensalada César',
    description: 'Ensalada fresca con lechuga romana, pollo a la parrilla, croutons y aderezo césar.',
    price: 9.75,
    image: 'https://placehold.co/600x400/4CAF50/FFFFFF?text=Ensalada',
    comments: []
  },
  {
    id: 'p4',
    name: 'Sushi Mixto',
    description: 'Bandeja de 12 piezas de sushi variado (nigiri y maki).',
    price: 18.20,
    image: 'https://placehold.co/600x400/2196F3/FFFFFF?text=Sushi',
    comments: [
      { id: 'c4', user: 'Cliente Aprobado', text: 'Pescado muy fresco, excelente.' }
    ]
  },
  {
    id: 'p5',
    name: 'Tacos al Pastor',
    description: 'Orden de 3 tacos al pastor con piña, cilantro y cebolla.',
    price: 8.99,
    image: 'https://placehold.co/600x400/FF5722/FFFFFF?text=Tacos',
    comments: []
  },
  {
    id: 'p6',
    name: 'Bebida Refrescante',
    description: 'Limonada con hierbabuena recién preparada.',
    price: 3.50,
    image: 'https://placehold.co/600x400/00BCD4/FFFFFF?text=Bebida',
    comments: []
  }
];