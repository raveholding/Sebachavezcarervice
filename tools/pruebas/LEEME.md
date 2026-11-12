# Pruebas de la capa de diseño (Playwright + Chrome)

Correr desde la raíz del repo:

- `python3 tools/pruebas/u1.py <url> "<usuario>" <prefijo>`: barra, Ctrl + K, F1/F2, avisos, secciones, módulos, tema (< 100 ms) y desbordes de 320 a 1440 px.
- `python3 tools/pruebas/u2.py <url> "<usuario>"`: auditor de contraste (4,5:1, o 3:1 en letra grande) en todas las pantallas del rol, en claro y en oscuro. Tiene que dar `TOTAL 0`.
- `python3 tools/pruebas/u5.py <url> "<usuario>" "<#menu>"`: contraste en ventanas, ingreso y menú público.

Ejemplos:
- Demo: `file:///…/index.html` con "Martín Gómez" y `#menu`.
- Seba: `file:///…/index.html#practica` con "Seba Chavez" y `#practica-menu`.

- `python3 tools/pruebas/c1.py <url> "<usuario>"`: Configuración (guardado automático, buscador, interruptores, precios, porcentaje, módulos, móvil).
- `python3 tools/pruebas/c2.py`: interruptores del menú y acceso oculto (doble clic, doble toque, apagado) en la demo.
- `python3 tools/pruebas/c3.py <url>`: acceso oculto desde `#menu` y `#practica-menu` en Seba.
- `u2.py` ahora también revisa el contraste de cada sección de Configuración.
- `python3 tools/pruebas/p1.py <url> "<usuario>" <prefijo>`: imprime todos los documentos en A4, 80 y 58 mm (genera PDF en /tmp/t), importe en letras y registro de factura.
- `python3 tools/pruebas/p2.py <url> "<usuario>"`: botón de impresión dentro de la orden, orden de compra y datos fiscales.
- `python3 tools/pruebas/e1.py`: ejemplos de ventas y compras, demo limpia (entrar, vaciar y volver a los ejemplos) en la demo.
