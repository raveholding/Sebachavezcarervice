# SebaChavez Car Service · Sistema VB (demo)

Demo funcional del sistema de gestión para taller mecánico de servicio integral.
Archivo único: `index.html` (abre en cualquier navegador, sin internet; los datos se guardan en el navegador).

**Taller:** Jujuy 251 - Salta · WhatsApp 3875971922 · schavezcarservice@gmail.com · Facebook sebachavezcarservice · Instagram sebachavez_carservice

## Módulos
Órdenes de trabajo · Turnos · Clientes y vehículos · Repuestos e inventario · Proveedores y compras · Caja · Equipamiento · Seguridad y ambiente · Personal · Reportes · Configuración.

## Correcciones de la reunión con el cliente (v2)
**Flujo de la orden de trabajo:** Recibido → Diagnóstico (mecánico) → Presupuesto (jefe de taller / dueño) → En reparación (mecánico) → Listo → Entregado y cobrado (jefe de taller / dueño).

- **Mecánico: sin precios ni valores** en ninguna pantalla (órdenes, repuestos, panel, impresiones). Ve sólo sus órdenes y las que están sin asignar. No tiene acceso al presupuesto.
- **Diagnóstico con fotos:** el mecánico escribe el diagnóstico, sube hasta 6 imágenes (o saca la foto desde el celular), recomienda repuestos/trabajos sin precios y lo envía al jefe o dueño.
- **Presupuesto:** lo arma y entrega el dueño o el jefe de taller; el cliente lo aprueba **sin cobrar**.
- **Cobro al entregar el vehículo:** se pueden sumar adicionales (por ejemplo, cambio de focos) hasta ese momento; quedan marcados como “adicional”. El mecánico confirma la reparación y pasa la unidad al jefe/dueño, que cobra y entrega. Recepción sólo cobra/entrega si se activa la opción en Configuración.
- **Mano de obra editable en el momento:** valor y horas se editan en la tabla de la OT, hay “trabajo libre” con descripción y valor propio; queda marcado “valor editado” y auditado.
- **Inventario:** campo para **otros códigos** del mismo producto (buscan y escanean igual), **dimensiones y equivalencias** con los mismos campos de la ficha de wega.com.ar (largo, ancho, alto, diámetros, rosca, junta, válvula, picos, observaciones, equivalencias, OEM), enlace a la ficha del catálogo, fecha de verificación e importación/exportación por CSV.
- **Trazabilidad:** por artículo, cambios de ficha (quién, cuándo, antes/después y fuente), movimientos de stock (OT, ingresos, ajustes) y en qué OT/vehículo se usó. Si falta stock, el sistema sugiere los equivalentes disponibles (declarados o con misma rosca y junta).

## Límites de la demo
- Datos de ejemplo. Las dimensiones/rosca/junta/aplicaciones cargadas, salvo las del WO130 (de la pantalla del taller), son de ejemplo y están marcadas “sin verificar”: confirmar contra el catálogo antes de recomendar un reemplazo.
- WEGA no publica API ni descarga de filtros que permita conectar el catálogo automáticamente **[VERIFICAR con WEGA]**; por eso se resuelve con enlace a la ficha + importación CSV. El patrón del enlace a cada ficha se comprobó con un ejemplo.
- Sin facturación electrónica, pagos reales, nube ni multiusuario. Textos legales y plazos normativos marcados `[VERIFICAR]`.
- Los respaldos de la versión anterior de la demo no son compatibles (cambió el formato de datos).

Desarrollado por **VINCULAR BUSINESS** · (387) 4484132 · vincularbusiness@gmail.com · “Tu idea, en buenas manos.”
