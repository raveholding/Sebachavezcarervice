# Pruebas de la capa de diseño (Playwright + Chrome)

Correr desde la raíz del repo:

- `python3 tools/pruebas/u1.py <url> "<usuario>" <prefijo>`: barra, Ctrl + K, F1/F2, avisos, secciones, módulos, tema (< 100 ms) y desbordes de 320 a 1440 px.
- `python3 tools/pruebas/u2.py <url> "<usuario>"`: auditor de contraste (4,5:1, o 3:1 en letra grande) en todas las pantallas del rol, en claro y en oscuro. Tiene que dar `TOTAL 0`.
- `python3 tools/pruebas/u5.py <url> "<usuario>" "<#menu>"`: contraste en ventanas, ingreso y menú público.

Ejemplos:
- Demo: `file:///…/index.html` con "Martín Gómez" y `#menu`.
- Seba: `file:///…/index.html#practica` con "Seba Chavez" y `#practica-menu`.
