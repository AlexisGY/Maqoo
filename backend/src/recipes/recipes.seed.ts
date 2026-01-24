export const defaultRecipes = [
  {
    nombre: 'Ensalada de pollo',
    descripcion: 'Ensalada fresca con pollo desmenuzado y vegetales crujientes.',
    instrucciones:
      '1) Cocina y desmenuza la pechuga. 2) Lava y corta lechuga, tomate y cebolla. 3) Mezcla todo en un bowl. 4) Adereza con aceite, limon, sal y pimienta.',
    ingredientes: ['pollo', 'lechuga', 'tomate', 'cebolla', 'aceite', 'limon'],
    tiempo: 25,
    saludable: true,
    economico: true,
  },
  {
    nombre: 'Arroz con verduras',
    descripcion: 'Arroz salteado con vegetales mixtos y especias suaves.',
    instrucciones:
      '1) Pica zanahoria, pimiento, cebolla y ajo. 2) Sofrie en aceite 5 minutos. 3) Agrega arroz cocido y saltea 3-4 minutos. 4) Ajusta sal, pimienta y sirve.',
    ingredientes: ['arroz', 'zanahoria', 'pimiento', 'cebolla', 'aceite', 'ajo'],
    tiempo: 30,
    saludable: true,
    economico: true,
  },
  {
    nombre: 'Pasta al pesto',
    descripcion: 'Pasta con salsa de pesto casera y queso.',
    instrucciones:
      '1) Cocina la pasta al dente. 2) Licua albahaca, ajo, aceite, queso y sal. 3) Mezcla la pasta caliente con el pesto. 4) Sirve con mas queso si deseas.',
    ingredientes: ['pasta', 'albahaca', 'ajo', 'aceite', 'queso'],
    tiempo: 20,
    saludable: false,
    economico: true,
  },
  {
    nombre: 'Tacos de res',
    descripcion: 'Tacos rapidos con carne de res sazonada y vegetales.',
    instrucciones:
      '1) Corta la carne en tiras y salpimenta. 2) Saltea con ajo hasta dorar. 3) Calienta las tortillas. 4) Rellena con carne, cebolla y tomate.',
    ingredientes: ['carne de res', 'tortillas', 'cebolla', 'tomate', 'ajo'],
    tiempo: 20,
    saludable: false,
    economico: false,
  },
  {
    nombre: 'Omelette de vegetales',
    descripcion: 'Huevos con vegetales, ideal para desayuno o cena ligera.',
    instrucciones:
      '1) Bate huevos con sal y pimienta. 2) Saltea pimiento, espinaca y cebolla 3 minutos. 3) Vierte los huevos y cocina a fuego medio hasta cuajar. 4) Dobla y sirve.',
    ingredientes: ['huevo', 'pimiento', 'espinaca', 'cebolla', 'aceite'],
    tiempo: 15,
    saludable: true,
    economico: true,
  },
  {
    nombre: 'Sopa de tomate',
    descripcion: 'Sopa cremosa de tomate con ajo y hierbas.',
    instrucciones:
      '1) Sofrie ajo y cebolla en aceite. 2) Agrega tomate picado y cocina 5 minutos. 3) Vierte caldo y hierve 10-15 minutos. 4) Licua, ajusta sal y sirve caliente.',
    ingredientes: ['tomate', 'ajo', 'cebolla', 'caldo', 'aceite'],
    tiempo: 30,
    saludable: true,
    economico: true,
  },
  {
    nombre: 'Lasana sencilla',
    descripcion: 'Capas de pasta, carne y queso listas al horno.',
    instrucciones:
      '1) Dora carne molida con ajo y cebolla, agrega tomate y reduce 10 minutos. 2) En un refractario alterna capas de pasta precocida, carne y queso. 3) Hornea 25 minutos a 180 C hasta gratinar.',
    ingredientes: ['carne molida', 'pasta para lasana', 'tomate', 'cebolla', 'ajo', 'queso', 'aceite'],
    tiempo: 45,
    saludable: false,
    economico: false,
  },
  {
    nombre: 'Salmon al horno con limon',
    descripcion: 'Filete de salmon jugoso con hierbas y limon.',
    instrucciones:
      '1) Precalienta el horno a 190 C. 2) Coloca el salmon en bandeja, agrega aceite, sal, pimienta y rodajas de limon. 3) Hornea 12-15 minutos hasta que se desmenuce. 4) Sirve con verduras o arroz.',
    ingredientes: ['salmon', 'limon', 'aceite', 'sal', 'pimienta'],
    tiempo: 20,
    saludable: true,
    economico: false,
  },
  {
    nombre: 'Chili con carne',
    descripcion: 'Guiso espeso de carne molida, frijoles y especias.',
    instrucciones:
      '1) Sofrie cebolla y ajo. 2) Agrega carne molida y dora. 3) Incorpora frijoles cocidos, tomate, comino y chile en polvo. 4) Cocina a fuego medio 20 minutos, ajusta sal.',
    ingredientes: ['carne molida', 'frijoles', 'tomate', 'cebolla', 'ajo', 'comino', 'chile en polvo'],
    tiempo: 35,
    saludable: false,
    economico: true,
  },
  {
    nombre: 'Ensalada de garbanzos',
    descripcion: 'Ensalada fria rica en proteina vegetal.',
    instrucciones:
      '1) Mezcla garbanzos cocidos con pepino, tomate y cebolla morada. 2) Adereza con aceite, limon y sal. 3) Agrega hierbas frescas al gusto y sirve fria.',
    ingredientes: ['garbanzos', 'pepino', 'tomate', 'cebolla', 'aceite', 'limon'],
    tiempo: 15,
    saludable: true,
    economico: true,
  },
  {
    nombre: 'Smoothie verde',
    descripcion: 'Batido refrescante con espinaca y fruta.',
    instrucciones:
      '1) Coloca espinaca, platano, manzana y agua en la licuadora. 2) Licua hasta que quede suave. 3) Endulza al gusto y sirve frio.',
    ingredientes: ['espinaca', 'platano', 'manzana', 'agua'],
    tiempo: 5,
    saludable: true,
    economico: true,
  },
  {
    nombre: 'Hamburguesa casera',
    descripcion: 'Carne sazonada a la plancha con vegetales frescos.',
    instrucciones:
      '1) Forma medallones con carne molida, sal y pimienta. 2) Cocina en sarten 3-4 minutos por lado. 3) Tuesta el pan y arma con lechuga, tomate y queso.',
    ingredientes: ['carne molida', 'pan para hamburguesa', 'lechuga', 'tomate', 'queso'],
    tiempo: 25,
    saludable: false,
    economico: false,
  },
];
