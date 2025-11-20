# 🍽️ OptiComida  
### Asistente inteligente para decidir qué cocinar usando Matemática Discreta

**OptiComida** es un asistente que recomienda qué puedes cocinar según los ingredientes que tienes en casa utilizando conceptos fundamentales de **Matemática Discreta**:

- Árboles de decisión  
- Lógica proposicional (álgebra booleana)  
- Grafos dirigidos (NetworkX)  

El sistema analiza tus ingredientes almacenados en un archivo JSON, evalúa las recetas posibles mediante lógica booleana y utiliza teoría de grafos para determinar qué platos puedes preparar o qué tan cerca estás de poder hacerlo.

---

# 🎯 Objetivos del proyecto

- Aplicar **árboles de decisión** para seleccionar recetas de manera estructurada.  
- Implementar **álgebra booleana** para evaluar condiciones del usuario sobre cada receta.  
- Modelar recetas e ingredientes mediante **grafos dirigidos bipartitos**.  
- Determinar recetas cocinables usando **predecesores en un grafo**.  
- Visualizar el grafo coloreado según la despensa del usuario.  
- Almacenar la información en formato **JSON** para modularidad y escalabilidad.

---

# 🧠 Conceptos de Matemática Discreta aplicados

## 1️⃣ Árboles de decisión  
La función `arbol_decision()` implementa un **árbol binario simple** en el que el usuario responde preguntas como:

- ¿Tienes arroz?  
- ¿Tienes huevo?  
- ¿Cuántos minutos tienes?

Cada pregunta es un **nodo**, las respuestas son **ramas** y las hojas contienen recetas posibles.

---

## 2️⃣ Lógica proposicional y álgebra booleana  

En el modo lógico, cada receta se evalúa mediante una **fórmula formal** basada en proposiciones:

- **A**: tienes todos los ingredientes  
- **T**: tienes tiempo suficiente  
- **R**: quieres algo rápido  
- **S**: quieres algo saludable  
- **E**: quieres algo económico  
- **rR**, **rS**, **rE**: propiedades reales de la receta  

La fórmula usada es:

A ∧ T ∧ (¬R ∨ rR) ∧ (¬S ∨ rS) ∧ (¬E ∨ rE)


Lo que corresponde a:

A ∧ T ∧ (R → rR) ∧ (S → rS) ∧ (E → rE)


Esto aplica:

- implicación lógica,  
- conjunción,  
- disyunción,  
- negación.  

---

## 3️⃣ Grafos dirigidos (ingrediente → receta)

El sistema construye un **grafo bipartito dirigido**:

ingrediente → receta


Ejemplo:
``` text
arroz → Arroz con huevo
huevo → Arroz con huevo
aceite → Arroz con huevo
sal → Arroz con huevo
```

Con este modelo se puede:

- identificar **predecesores** (ingredientes necesarios),  
- determinar **recetas alcanzables** según la despensa,  
- distinguir **nodos fuente** (ingredientes),  
- distinguir **nodos sumidero** (recetas),  
- visualizar conexiones y dependencias,  
- colorear nodos según disponibilidad.

---

# ⚙️ Características principales del sistema

- Base de recetas en `recetas.json`.  
- Despensa del usuario en `ingredientes.json`.  
- Modo lógico basado en álgebra booleana.  
- **Modo avanzado unificado**: análisis + grafo dirigido.  
- Detección de:
  - recetas cocinables,  
  - recetas a un ingrediente,  
  - ingredientes más útiles.  
- Visualización de grafo con NetworkX + Matplotlib.  

---

# 📁 Estructura del proyecto

```text
📦 OptiComida
┣ 📜 OptiComida.py
┣ 📜 recetas.json
┗ 📜 ingredientes.json
```

---

# 🛠️ Requisitos

- Python 3.9+
- Dependencias:

```bash
pip install networkx matplotlib
```

# ▶️ Ejecución
```bash
python OptiComida.py
```
# 🎮 Modos de uso del programa
## 1) Árbol de decisión

Pequeño árbol binario que, a partir de preguntas simples, sugiere recetas inmediatas.

## 2) Modo lógico (Álgebra booleana)

El usuario ingresa:

- ingredientes actuales,

- tiempo disponible,

- si desea rapidez, salud o economía.

El sistema evalúa cada receta con la fórmula lógica y muestra solo las válidas.

## 3) Modo avanzado (Análisis + Grafo) ⭐ 

Este modo combina análisis matemático y visualización del grafo.

### ✔ Análisis matemático:

Para cada receta:

- obtiene sus predecesores (ingredientes requeridos),

- determina si es cocinable,

- si le falta 1 ingrediente, o

- si es inalcanzable.

Ejemplo de salida:

``` text
Recetas cocinables:
✔ Arroz con huevo

Recetas a 1 ingrediente:
• Puré de papa → falta: leche
```
### ✔ Visualización gráfica:

Dibuja el grafo dirigido con colores:

- 🟩 verde: ingrediente disponible

- 🟧 naranja: receta cocinable

- ⚪ gris: nodo no disponible

Esto permite observar claramente:

- cómo se conectan los ingredientes con las recetas,

- qué tan cerca estás de poder cocinar algo,

- qué ingrediente desbloquea más recetas.

# 📝 Conclusiones

- OptiComida integra en un solo proyecto varios ejes de la Matemática Discreta:

- Árboles: estructura y decisiones binarias.

- Lógica booleana: expresión formal para validar recetas.

- Grafo dirigido: modelado ingrediente → receta.

- Predecesores y alcanzabilidad: identificación de recetas posibles.

- Persistencia JSON: modularidad y escalabilidad.

Este proyecto demuestra cómo la teoría puede aplicarse a la vida real de manera simple, intuitiva e inteligente.