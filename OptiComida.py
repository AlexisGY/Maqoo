import json
import networkx as nx
import matplotlib.pyplot as plt

# Archivos JSON
RUTA_RECETAS = "recetas.json"
RUTA_INGREDIENTES = "ingredientes.json"

# =====================================================
#               CARGA Y GUARDADO DE JSON
# =====================================================

def cargar_recetas():
    with open(RUTA_RECETAS, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Convertir ingredientes a sets para comparación rápida
    for r in data:
        r["ingredientes"] = set(r["ingredientes"])
    return data


def cargar_ingredientes():
    try:
        with open(RUTA_INGREDIENTES, "r", encoding="utf-8") as f:
            datos = json.load(f)
            return set(datos.get("ingredientes", []))
    except FileNotFoundError:
        return set()


def guardar_ingredientes(lista):
    data = {"ingredientes": list(lista)}
    with open(RUTA_INGREDIENTES, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


# =====================================================
#          CONSTRUCCIÓN DEL GRAFO DIRIGIDO
# =====================================================

def construir_grafo(recetas):
    G = nx.DiGraph()

    for receta in recetas:
        nombre = receta["nombre"]
        G.add_node(nombre, tipo="receta")

        for ing in receta["ingredientes"]:
            G.add_node(ing, tipo="ingrediente")
            G.add_edge(ing, nombre)

    return G


# =====================================================
#           LÓGICA BOOLEANA MEJORADA
# =====================================================

def receta_valida(receta, ing_usuario, tiempo_disp, R, S, E):
    # Proposiciones
    A = receta["ingredientes"].issubset(ing_usuario)
    T = receta["tiempo"] <= tiempo_disp

    rR = receta["tiempo"] <= 20
    rS = receta["saludable"]
    rE = receta["economico"]

    # Fórmula booleana:
    # A ∧ T ∧ (¬R ∨ rR) ∧ (¬S ∨ rS) ∧ (¬E ∨ rE)
    return (
        A and
        T and
        ((not R) or rR) and
        ((not S) or rS) and
        ((not E) or rE)
    )


# =====================================================
#                  MODO ARBOL SIMPLE
# =====================================================

def arbol_decision():
    print("\n=== Árbol de decisión ===")
    arroz = input("¿Tienes arroz? (s/n): ").lower() == "s"
    huevo = input("¿Tienes huevo? (s/n): ").lower() == "s"
    try:
        tiempo = int(input("¿Cuántos minutos tienes?: "))
    except:
        tiempo = 20

    if arroz and huevo and tiempo <= 20:
        print("→ Sugerencia: Arroz chaufa rápido o Arroz con huevo.")
    elif huevo and tiempo <= 10:
        print("→ Sugerencia: Tortilla de huevo.")
    else:
        print("→ Intenta ver el modo lógico o avanzado.")


# =====================================================
#         MODO LÓGICO (ÁLGEBRA BOOLEANA)
# =====================================================

def leer_ingredientes_teclado():
    txt = input("Ingredientes separados por coma: ").lower().strip()
    if not txt:
        return set()
    return {x.strip() for x in txt.split(",")}


def leer_preferencias():
    R = input("¿Quieres plato rápido (≤20 min)? (s/n): ").lower() == "s"
    S = input("¿Quieres algo saludable? (s/n): ").lower() == "s"
    E = input("¿Quieres algo económico? (s/n): ").lower() == "s"
    return R, S, E


def modo_logico(recetas):
    print("\n=== Modo lógico (Álgebra booleana) ===")
    ing_usuario = leer_ingredientes_teclado()

    try:
        tiempo = int(input("Tiempo disponible (min): "))
    except:
        tiempo = 20

    R, S, E = leer_preferencias()

    validas = [r for r in recetas if receta_valida(r, ing_usuario, tiempo, R, S, E)]

    if validas:
        print("\nRecetas sugeridas:")
        for r in validas:
            print("-", r["nombre"])
    else:
        print("\nNo hay recetas que cumplan la fórmula booleana.")


# =====================================================
#   MOSTRAR GRAFO (COLOREADO SEGÚN DESPENSA)
# =====================================================

def mostrar_grafo_con_despensa(recetas):
    ing_usuario = cargar_ingredientes()
    G = construir_grafo(recetas)

    colores = []
    for nodo, data in G.nodes(data=True):
        if data["tipo"] == "ingrediente":
            if nodo in ing_usuario:
                colores.append("#8cbcac")   # verde suave
            else:
                colores.append("#d0d0d0")   # gris claro
        else:
            necesarios = set(G.predecessors(nodo))
            if necesarios.issubset(ing_usuario):
                colores.append("#ffb347")   # naranja = cocinable
            else:
                colores.append("#e6e6e6")   # gris = no cocinable

    pos = nx.spring_layout(G, seed=42)
    plt.figure(figsize=(10, 7))
    nx.draw(
        G, pos, with_labels=True,
        node_color=colores,
        node_size=1500,
        arrowsize=20,
        font_size=8
    )
    plt.title("Grafo ingrediente → receta (según tu despensa)")
    plt.show()


# =====================================================
#       MODO AVANZADO (GRAFO + INGREDIENTES)
# =====================================================

def modo_grafos(recetas):
    print("\n=== Modo grafos (Análisis + Visualización) ===")

    ing_usuario = cargar_ingredientes()
    if not ing_usuario:
        print("No tienes ingredientes guardados. Ve a 'Gestionar despensa'.")
        return

    print("\nTu despensa:", ", ".join(sorted(ing_usuario)))

    G = construir_grafo(recetas)
    cocinables = []
    casi = {}

    # --- ANÁLISIS (antes modo 4) ---
    for nodo, data in G.nodes(data=True):
        if data["tipo"] == "receta":
            necesarios = set(G.predecessors(nodo))
            falt = necesarios - ing_usuario

            if not falt:
                cocinables.append(nodo)
            elif len(falt) == 1:
                casi[nodo] = next(iter(falt))

    print("\n--- Recetas cocinables ---")
    if cocinables:
        for r in cocinables:
            print("✔", r)
    else:
        print("Ninguna aún.")

    print("\n--- Recetas a 1 ingrediente ---")
    if casi:
        for r, falt in casi.items():
            print(f"• {r} → falta: {falt}")
    else:
        print("Ninguna.")

    # --- VISUALIZACIÓN (antes modo 3) ---
    colores = []
    for nodo, data in G.nodes(data=True):
        if data["tipo"] == "ingrediente":
            if nodo in ing_usuario:
                colores.append("#8cbcac")   # verde suave
            else:
                colores.append("#d0d0d0")   # gris claro
        else:
            necesarios = set(G.predecessors(nodo))
            if necesarios.issubset(ing_usuario):
                colores.append("#ffb347")   # naranja
            else:
                colores.append("#e6e6e6")   # gris
    pos = nx.spring_layout(G, seed=42)
    plt.figure(figsize=(10, 7))
    nx.draw(
        G, pos, with_labels=True,
        node_color=colores,
        node_size=1500,
        arrowsize=20,
        font_size=8
    )
    plt.title("Grafo ingrediente → receta (según tu despensa)")
    plt.show()

# =====================================================
#           GESTIÓN DE DESPENSA JSON
# =====================================================

def gestionar_despensa():
    while True:
        actual = cargar_ingredientes()
        print("\n=== Gestión de despensa ===")
        print("Ingredientes actuales:", ", ".join(sorted(actual)) if actual else "(vacío)")
        print("1) Reemplazar lista completa")
        print("2) Agregar ingredientes")
        print("3) Eliminar ingrediente")
        print("0) Volver")

        op = input("> ")

        if op == "1":
            nuevo = leer_ingredientes_teclado()
            guardar_ingredientes(nuevo)

        elif op == "2":
            nuevo = leer_ingredientes_teclado()
            guardar_ingredientes(actual | nuevo)

        elif op == "3":
            elim = input("Ingrediente a eliminar: ").lower()
            if elim in actual:
                actual.remove(elim)
                guardar_ingredientes(actual)

        elif op == "0":
            break


# =====================================================
#                     MENÚ FINAL
# =====================================================

def menu():
    recetas = cargar_recetas()

    while True:
        print("\n===== OPTICOMIDA =====")
        print("1) Árbol de decisión (Árboles)")
        print("2) Modo lógico (Álgebra booleana)")
        print("3) Modo de grafos| (Grafos dirigidos)")
        print("4) Gestionar despensa")
        print("0) Salir")

        op = input("> ")

        if op == "1": arbol_decision()
        elif op == "2": modo_logico(recetas)
        elif op == "3": modo_grafos(recetas)
        elif op == "4": gestionar_despensa()
        elif op == "0":
            print("Gracias por usar OptiComida ❤️")
            break
        else:
            print("Opción inválida.")

if __name__ == "__main__":
    menu()
