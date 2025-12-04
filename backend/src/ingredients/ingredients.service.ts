import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

export interface IngredientPrediction {
  name: string;
  confidence: number;
}

export interface IngredientRecognitionResult {
  ingredients: IngredientPrediction[];
}

export type UploadedIngredientFile = {
  buffer: Buffer;
  originalname?: string;
  mimetype?: string;
};

@Injectable()
export class IngredientsService {
  private readonly logger = new Logger(IngredientsService.name);

  async recognize(file: UploadedIngredientFile | null | undefined): Promise<IngredientRecognitionResult> {
    if (!file?.buffer) {
      throw new BadRequestException('Se requiere una imagen para analizar.');
    }

    const provider = (process.env.INGREDIENT_AI_PROVIDER || '').toLowerCase();

    if (provider === 'vision') {
      return this.forwardToGoogleVision(file);
    }

    if (process.env.INGREDIENT_AI_URL) {
      return this.forwardToProvider(file);
    }

    return this.mockRecognition(file.originalname || 'foto');
  }

  private async forwardToGoogleVision(file: UploadedIngredientFile): Promise<IngredientRecognitionResult> {
    try {
      const apiKey = process.env.INGREDIENT_AI_KEY;
      if (!apiKey) {
        throw new Error('INGREDIENT_AI_KEY es requerido para usar Google Cloud Vision');
      }

      const endpoint =
        process.env.INGREDIENT_AI_URL ||
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      const body = {
        requests: [
          {
            image: { content: file.buffer.toString('base64') },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 20 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
            ],
          },
        ],
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'El servicio de Google Vision devolvió un error');
      }

      const payload = await response.json();
      return this.normalizeResponse(payload);
    } catch (error) {
      this.logger.error('Error al invocar Google Vision', error as Error);
      throw new InternalServerErrorException('No se pudo procesar la imagen con Google Vision.');
    }
  }

  private async forwardToProvider(file: UploadedIngredientFile): Promise<IngredientRecognitionResult> {
    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype || 'image/jpeg' });
      formData.append(
        'image',
        blob,
        file.originalname || 'ingredient.jpg',
      );

      const headers: Record<string, string> = {};
      if (process.env.INGREDIENT_AI_KEY) {
        headers['Authorization'] = `Bearer ${process.env.INGREDIENT_AI_KEY}`;
      }

      const response = await fetch(process.env.INGREDIENT_AI_URL as string, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'El servicio de IA devolviС un error');
      }

      const payload = await response.json();
      return this.normalizeResponse(payload);
    } catch (error) {
      this.logger.error('Error al invocar el proveedor de IA', error as Error);
      throw new InternalServerErrorException('No se pudo procesar la imagen con el proveedor de IA.');
    }
  }

  private normalizeResponse(payload: any): IngredientRecognitionResult {
    const rawItems =
      payload?.ingredients || payload?.predictions || payload?.items || payload?.detections || [];

    const ingredients: IngredientPrediction[] = [];

    if (Array.isArray(rawItems)) {
      ingredients.push(
        ...rawItems
          .map((item: any) => ({
            name: (item?.name || item?.label || item?.class)?.toString().toLowerCase(),
            confidence: Number(item?.confidence ?? item?.score ?? item?.probability ?? 0),
          }))
          .filter((item) => item.name),
      );
    }

    const labelAnnotations = payload?.responses?.[0]?.labelAnnotations;
    if (Array.isArray(labelAnnotations)) {
      ingredients.push(
        ...labelAnnotations
          .map((item: any) => ({
            name: item?.description?.toString().toLowerCase(),
            confidence: Number(item?.score ?? 0),
          }))
          .filter((item) => item.name && item.confidence > 0.3), // Filtrar por confianza mínima
      );
    }

    // Procesar objetos localizados y filtrar solo comida
    const localizedObjects = payload?.responses?.[0]?.localizedObjectAnnotations;
    if (Array.isArray(localizedObjects)) {
      ingredients.push(
        ...localizedObjects
          .map((item: any) => ({
            name: item?.name?.toString().toLowerCase(),
            confidence: Number(item?.score ?? 0),
          }))
          .filter((item) => item.name && item.confidence > 0.3),
      );
    }

    const stopwords = new Set([
      'fruit',
      'fruits',
      'produce',
      'food',
      'ingredient',
      'vegetable',
      'vegetables',
      'citrus',
      'citrus fruit',
      'natural foods',
    ]);

    // Palabras clave de objetos no comestibles que deben ser filtrados
    const nonFoodKeywords = new Set([
      'ceramic',
      'ceramics',
      'cerámica',
      'plate',
      'plato',
      'bowl',
      'tazón',
      'dish',
      'dishes',
      'container',
      'contenedor',
      'pottery',
      'porcelana',
      'porcelain',
      'vase',
      'vaso',
      'cup',
      'taza',
      'mug',
      'jar',
      'tarro',
      'bottle',
      'botella',
      'glass',
      'vidrio',
      'plastic',
      'plástico',
      'metal',
      'metálico',
      'wood',
      'madera',
      'furniture',
      'mueble',
      'table',
      'mesa',
      'counter',
      'mostrador',
      'kitchen',
      'cocina',
      'appliance',
      'electrodoméstico',
      'utensil',
      'utensilio',
      'knife',
      'cuchillo',
      'fork',
      'tenedor',
      'spoon',
      'cuchara',
      'paper',
      'papel',
      'bag',
      'bolsa',
      'packaging',
      'empaque',
      'label',
      'etiqueta',
      'text',
      'texto',
      'writing',
      'escritura',
    ]);

    const synonymRules: Array<{ test: RegExp; value: string }> = [
      { test: /apple/, value: 'manzana' },
      { test: /banana|plantain/, value: 'platano' },
      { test: /orange/, value: 'naranja' },
      { test: /lemon|lime/, value: 'limon' },
      { test: /grape/, value: 'uva' },
      { test: /pear/, value: 'pera' },
      { test: /peach/, value: 'durazno' },
      { test: /strawberry/, value: 'fresa' },
      { test: /blueberry/, value: 'arandano' },
      { test: /raspberry/, value: 'frambuesa' },
      { test: /mango/, value: 'mango' },
      { test: /pineapple/, value: 'pina' },
      { test: /tomato/, value: 'tomate' },
      { test: /potato/, value: 'papa' },
      { test: /carrot/, value: 'zanahoria' },
      { test: /lettuce/, value: 'lechuga' },
      { test: /onion/, value: 'cebolla' },
      { test: /garlic/, value: 'ajo' },
      { test: /pepper|bell pepper|chili/, value: 'pimiento' },
      { test: /cucumber/, value: 'pepino' },
      { test: /zucchini|courgette/, value: 'calabacin' },
      { test: /spinach/, value: 'espinaca' },
      { test: /broccoli/, value: 'brocoli' },
      { test: /cauliflower/, value: 'coliflor' },
      { test: /chicken/, value: 'pollo' },
      { test: /beef|steak/, value: 'carne de res' },
      { test: /pork/, value: 'cerdo' },
      { test: /fish/, value: 'pescado' },
      { test: /shrimp/, value: 'camaron' },
      { test: /egg/, value: 'huevo' },
      { test: /milk|dairy/, value: 'leche' },
      { test: /cheese/, value: 'queso' },
    ];

    const normalizeName = (rawName: string): string | null => {
      const value = rawName.toLowerCase().trim();
      if (!value || stopwords.has(value)) {
        return null;
      }
      
      // Filtrar objetos no comestibles
      const words = value.split(/\s+/);
      for (const word of words) {
        if (nonFoodKeywords.has(word)) {
          return null;
        }
      }
      
      // Verificar si contiene palabras clave de objetos no comestibles
      for (const keyword of nonFoodKeywords) {
        if (value.includes(keyword)) {
          return null;
        }
      }
      
      const rule = synonymRules.find((r) => r.test.test(value));
      return rule ? rule.value : value;
    };

    const deduped = new Map<string, number>();
    for (const item of ingredients) {
      const normalizedName = normalizeName(item.name);
      if (!normalizedName) continue;
      const confidence = Math.max(0, Math.min(1, isNaN(item.confidence) ? 0 : item.confidence));
      
      // Filtrar por confianza mínima más alta para evitar falsos positivos
      if (confidence < 0.4) continue;
      
      const prev = deduped.get(normalizedName) ?? 0;
      if (confidence > prev) {
        deduped.set(normalizedName, confidence);
      }
    }

    const normalized: IngredientPrediction[] = Array.from(deduped.entries())
      .map(([name, confidence]) => ({ name, confidence }))
      .sort((a, b) => b.confidence - a.confidence);

    return { ingredients: normalized };
  }

  private mockRecognition(seed: string): IngredientRecognitionResult {
    const normalizedSeed = seed.toLowerCase();
    const pantryCandidates: IngredientPrediction[][] = [
      [
        { name: 'tomate', confidence: 0.92 },
        { name: 'cebolla', confidence: 0.85 },
        { name: 'cilantro', confidence: 0.78 },
      ],
      [
        { name: 'pollo', confidence: 0.9 },
        { name: 'paprika', confidence: 0.73 },
        { name: 'ajo', confidence: 0.69 },
      ],
      [
        { name: 'zanahoria', confidence: 0.88 },
        { name: 'papas', confidence: 0.81 },
        { name: 'apio', confidence: 0.7 },
      ],
      [
        { name: 'manzana', confidence: 0.86 },
        { name: 'pera', confidence: 0.74 },
        { name: 'plСtano', confidence: 0.68 },
      ],
    ];

    const selectedIndex = normalizedSeed.includes('pollo')
      ? 1
      : normalizedSeed.includes('ensalada') || normalizedSeed.includes('verde')
        ? 0
        : normalizedSeed.includes('sopa')
          ? 2
          : normalizedSeed.includes('fruta') || normalizedSeed.includes('fruit')
            ? 3
            : Math.floor(Math.random() * pantryCandidates.length);

    return { ingredients: pantryCandidates[selectedIndex] };
  }
}
