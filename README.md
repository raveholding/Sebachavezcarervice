# SebaChavez Car Service · Sistema VB

Sistema de gestión para taller mecánico de servicio integral.
Archivo único: `index.html` (abre en cualquier navegador, sin internet; los datos se guardan en el navegador de la PC o celular donde se use).

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

## Versión para probar (v3: sin datos de ejemplo)
- **Arranca vacío.** La primera vez pide crear al dueño con una **clave de 4 a 8 números** (se guarda cifrada) y muestra **una sola vez** un código de recuperación de 8 números.
- **Ingreso con clave por persona.** El dueño da de alta al personal en *Personal* con su clave inicial; cada uno puede cambiarla en *Mi clave*. Tras 5 intentos fallidos hay una espera de 60 s. Los permisos por rol son los de la v2.
- **Carga inicial:** *Configuración* → precios de mano de obra (los servicios base arrancan en $ 0; se pueden agregar y quitar); *Repuestos* → **Importar (CSV)** con plantilla descargable (alta masiva todo o nada, stock inicial en la trazabilidad); *Equipamiento* arranca “sin relevar”; *Seguridad* sin fechas; *Caja* con el turno cerrado hasta abrirlo.
- **Respaldo:** *Configuración → Exportar respaldo (JSON)*. El panel avisa si pasan 7 días sin respaldo. *Importar respaldo* sólo acepta respaldos del mismo modo.
- **Modo práctica** (para capacitar sin tocar datos reales): abrir `index.html#practica`. Usa datos de ejemplo, sin clave y con una franja de aviso; se guarda aparte del sistema real.
- *Borrar todos los datos* exige escribir BORRAR.

## Descuento e IVA (v3.1)
- **IVA opcional siempre:** cada orden tiene la casilla *Aplicar IVA* (dueño y jefe), también en el cobro; las órdenes nuevas se crean con IVA salvo que se desactive en Configuración. Sin IVA se refleja en totales, impresión, WhatsApp y reportes.
- **Descuento al cobrar:** en *Cobrar y entregar* se puede descontar **en % o en $** sobre la **mano de obra** (no sobre repuestos; tope: 100 % o el valor de la mano de obra). El IVA se calcula sobre la mano de obra ya descontada y la comisión del mecánico también. Si se cancela el cobro, se revierte; al cobrar queda en la auditoría.

## Límites (no afirmar más que esto)
- **Los datos viven sólo en el navegador y el equipo donde se usan.** No hay sincronización entre dispositivos ni copia en la nube; si se borran los datos del navegador o se cambia de equipo, sólo sirve el respaldo.
- **La clave es un control de uso del sistema, no seguridad de servidor:** quien tenga acceso al equipo y sepa usar las herramientas del navegador puede leer o modificar los datos locales. Para varios equipos o seguridad real hace falta un servidor (por ejemplo, Supabase).
- Las dimensiones/rosca/junta cargadas en el modo práctica son de ejemplo y están marcadas “sin verificar”. WEGA no publica API ni descarga de filtros **[VERIFICAR con WEGA]**; se resuelve con enlace a la ficha + importación CSV.
- Sin facturación electrónica ni pagos reales. Textos legales y plazos normativos marcados `[VERIFICAR]`.
- Los respaldos de la versión demo anterior no son compatibles.

Desarrollado por **VINCULAR BUSINESS** · (387) 4484132 · vincularbusiness@gmail.com · “Tu idea, en buenas manos.”
