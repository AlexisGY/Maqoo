# Maqoo - App Móvil de Recetas

Aplicación móvil desarrollada en React Native con Expo SDK 54 que te ayuda a encontrar qué cocinar según los ingredientes que tienes disponibles.

## Características

- 🍳 **Base de recetas local**: Más de 40 recetas almacenadas localmente
- 🥘 **Gestión de despensa**: Agrega y gestiona tus ingredientes disponibles
- 🔍 **Búsqueda inteligente**: Encuentra recetas con búsqueda fuzzy y filtros avanzados
- ⚡ **Algoritmos optimizados**: Sistema de scoring para recomendar las mejores recetas
- 📱 **Sin conexión**: Funciona completamente offline
- 📸 **Escanear ingredientes**: Preparado para análisis de alimentos con IA (próximamente)

## Tecnologías

- React Native con Expo SDK 54
- NativeWind (Tailwind CSS para React Native)
- AsyncStorage para persistencia local
- React Navigation para navegación
- Expo Camera para funcionalidad de fotos

## Requisitos

- Node.js 18.x, 19.x, 20.x o 21.x (recomendado: 18.x o 20.x LTS)
- npm o yarn
- Expo CLI (incluido con `npx`)

## Instalación

1. Asegúrate de tener una versión compatible de Node.js (18-21):
```bash
node --version
```

2. Instala las dependencias:
```bash
npm install
```

2. Inicia el proyecto:
```bash
npm start
```

3. Escanea el código QR con la app Expo Go en tu dispositivo móvil, o presiona:
   - `a` para Android
   - `i` para iOS
   - `w` para web

## Estructura del Proyecto

```
Maqoo/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── screens/         # Pantallas de la app
│   ├── services/        # Servicios (almacenamiento, recetas)
│   ├── utils/           # Utilidades y algoritmos
│   └── data/            # Datos iniciales
├── App.js               # Componente principal
└── package.json
```

## Funcionalidades Principales

### Home Screen
- Vista de recetas destacadas
- Estadísticas de despensa
- Acceso rápido a búsqueda y gestión de despensa
- Botón para escanear ingredientes

### Búsqueda
- Búsqueda por nombre de receta
- Filtros por tiempo, saludable, económico
- Resultados ordenados por relevancia

### Detalle de Receta
- Información completa de la receta
- Lista de ingredientes con indicadores de disponibilidad
- Porcentaje de ingredientes disponibles

### Gestión de Despensa
- Agregar/eliminar ingredientes
- Búsqueda de ingredientes
- Ingredientes comunes sugeridos

### Escanear Ingredientes (Próximamente)
- Toma fotos de ingredientes
- Preparado para integración con IA de reconocimiento
- Agregará automáticamente ingredientes detectados

## Algoritmos

La app utiliza algoritmos mejorados para:
- **Matching de ingredientes**: Calcula el porcentaje de ingredientes disponibles
- **Scoring de recetas**: Sistema de puntuación basado en múltiples factores
- **Búsqueda fuzzy**: Búsqueda flexible por nombre e ingredientes
- **Recomendaciones**: Ordenamiento inteligente por relevancia

## Estado de Recetas

- **Cocinable**: Tienes todos los ingredientes necesarios
- **Casi cocinable**: Falta 1-2 ingredientes
- **Sugerida**: Falta 3+ ingredientes

## Próximas Funcionalidades

- [ ] Análisis de alimentos con IA mediante fotos
- [ ] Detección automática de ingredientes
- [ ] Recomendaciones basadas en ingredientes detectados
- [ ] Favoritos de recetas
- [ ] Historial de recetas cocinadas

## Licencia

Este proyecto es parte de un trabajo académico.

