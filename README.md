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
- **Descuento al cobrar (opcional):** en *Cobrar y entregar* el dueño o el jefe puede ofrecer un descuento **en % o en $** sobre el **total de la venta** (repuestos + mano de obra + IVA), antes de cerrar el cobro. Tope: 100 % o el total. Se prorratea entre neto, IVA, repuestos y mano de obra, por lo que los reportes y la comisión del mecánico quedan consistentes. Si se cancela el cobro, se revierte; al cobrar queda en la auditoría y se muestra en pantalla, impresión y WhatsApp.

## Correcciones v3.2
- **Mecánico sin precios en ningún lado:** se auditó cada pantalla, ficha de repuesto, trazabilidad y órdenes; ve solo artículos y stock. Además se bloquearon por código las acciones con precios (Excel, listados con precio, ajuste de precios) y se limpia el aviso en pantalla al salir.
- **Roles:** el dueño asigna el rol de cada persona desde *Personal* (lista desplegable) y puede activar/desactivar accesos; no puede cambiarse su propio rol ni dejar el sistema sin un dueño activo. Todo queda en la auditoría.
- **Venta de mostrador** (módulo nuevo, dueño/jefe/recepción): repuestos del inventario o **productos nuevos** fuera del inventario, **precio editable** y **descuento (% o $) por renglón**, IVA opcional, cobro en efectivo (entra a caja), transferencia o tarjeta; descuenta stock y deja trazabilidad.
- **Órdenes de trabajo:** precio editable también en repuestos, **descuento por renglón en cualquier producto o servicio**, producto nuevo, y además el descuento general sobre el total al cobrar.

## Condición frente a ARCA (v3.3)
- **Al elegir el cliente** en una **orden de trabajo** o en una **venta de mostrador** se elige su condición frente a ARCA: Consumidor Final, IVA Responsable Inscripto, Responsable Monotributo, Monotributista Social, IVA Sujeto Exento, IVA No Alcanzado, Sujeto No Categorizado o Cliente del Exterior. Se completa sola con la de la ficha del cliente y se puede cambiar en el momento.
- **CUIT obligatorio y validado** (dígito verificador) para Responsable Inscripto, Monotributo, Monotributista Social y Exento; para Consumidor Final el CUIT/CUIL/DNI es opcional.
- Lo elegido **se guarda en la ficha del cliente** y **queda registrado en la OT o en la venta** (aunque después cambie la ficha). Los cambios quedan en la auditoría.
- **OT:** se ve en la cabecera (botón *Cambiar* para el dueño, jefe y recepción, mientras no esté entregada), en la impresión de la OT y del presupuesto y en el CSV de órdenes. El mecánico no la ve.
- **Ventas de mostrador:** se puede elegir un cliente, crear uno nuevo o dejar “Consumidor final (sin identificar)”. Cualquier condición distinta de Consumidor Final exige identificar al cliente. La lista de ventas muestra cliente y condición.
- **Compras:** en la ficha del proveedor, en el *Ingreso de mercadería* y en la *Orden de compra* se elige la condición del proveedor (sin Consumidor Final; incluye Proveedor del Exterior). Queda en la OC y en el libro del proveedor.
- Clientes y proveedores cargados antes de esta versión arrancan como Consumidor Final y Responsable Inscripto, respectivamente.
- **Alta completa del cliente** desde cualquier lugar donde se cree (ficha de clientes, nueva OT, turno nuevo y venta de mostrador): nombre o razón social, teléfono, correo, domicilio, localidad, provincia, cuenta corriente y límite, condición frente a ARCA y CUIT/DNI. Para Responsable Inscripto, Monotributo y Exento se exige el domicilio fiscal; el correo se valida.
- Es un dato de registro: el sistema **no emite facturas** ni consulta el padrón de ARCA.

## Sistema VB completo (v4): menú digital, Club, garantías, RR. HH. y tareas
Mismos módulos que la demo [tallermecnicoSVBdemo](https://raveholding.github.io/tallermecnicoSVBdemo/), con los datos del taller:
- **Menú digital público** en `index.html#menu` (con los datos reales; el de práctica es `#practica-menu`):
  - **Tienda** con categorías, destacados, buscador, ficha de producto y botón **“Con instalación”**.
  - **Servicios** por área con precio final, duración y garantía.
  - **Carrito** que envía el pedido por WhatsApp.
  - **Turnos online** con horarios libres reales.
  - Alta al **Club** y consulta de la tarjeta.
- **Menú digital y pedidos:**
  - Bandeja de pedidos y turnos del menú. Un pedido se pasa a venta o turno, y la confirmación sale por WhatsApp.
  - **Catálogo de servicios** con área, descripción, precio, duración, garantía y publicación.
  - Productos publicados y destacados, y configuración del menú.
- **Áreas de trabajo:** mecánica, electricidad, car audio, alarmas y accesorios. Las instalaciones suman el control eléctrico previo y van al box de instalaciones.
- **Club y fidelización:**
  - Puntos, niveles y premios. Los puntos se pueden usar como pago al cobrar la orden.
  - Tarjeta del socio.
  - Recordatorios por WhatsApp: service, cumpleaños, garantías y clientes inactivos.
- **Garantías** automáticas al entregar o vender, con número de serie y reclamos.
- **Personal y RR. HH.:**
  - Legajos, asistencia (entrada y salida), vacaciones y licencias.
  - **Organigrama** y sueldos estimados con adelantos.
- **Tareas:** Mi día, tablero del equipo, tareas recurrentes y **responsabilidades por puesto**.
- **Datos reales intactos:** al actualizar no se borra nada; los módulos nuevos arrancan vacíos con valores por defecto. El modo práctica carga datos de ejemplo nuevos.

**Cómo se arma:**
- `index.html` se genera con `sh tools/build.sh` a partir de `tools/base.html` (el núcleo del taller) más los módulos de `tools/`, que son los mismos que usa la demo.
- Los cambios propios del taller se hacen en `tools/base.html`, y después se vuelve a correr el armado.

## Diseño Sistema VB (esqueleto V27.2, sección 7)
Capa de diseño común a los dos sistemas (`tools/vb_ux.js`). No quita funciones: reordena y agrega.
- **Barra lateral por secciones plegables:** Operación del taller · Logística e inventario · Clientes y fidelidad · Equipo · Sistema. Arriba van los botones principales **Vender [F1]** y **Nueva orden [F2]**, y en la barra se ven los avisos (órdenes, stock bajo en amarillo, pedidos y tareas).
- **Barra superior:** nombre del negocio, estado (modo, caja abierta o cerrada, de un día anterior en rojo), **buscador Ctrl + K**, **campana de avisos** con lista, **tema** (Automático → Claro → Oscuro), acceso al menú público y usuario con su rol.
- **Buscador universal (Ctrl + K):**
  - Busca por patente, cliente (nombre, teléfono o CUIT), N.º de OT, repuesto (código exacto, parcial o descripción) y pantallas.
  - Tolera errores de tipeo: “arqeo” lleva a Caja.
  - Un repuesto elegido se agrega a la venta. Sólo muestra lo que el rol puede abrir.
- **Tema claro, oscuro y automático:** sólo cambia variables CSS, lo hace en < 5 ms y recuerda la elección en cada equipo. El menú público queda siempre en claro.
- **Ayuda en contexto:** cada pantalla tiene una línea que dice para qué sirve y por dónde empezar.
- **Panel “Hoy”** (dueño y jefe de taller):
  - Cobrado hoy contra ayer, órdenes abiertas con presupuestos esperando, turnos y stock en alerta.
  - Últimos cobros y tendencia de los últimos 7 días contra la semana anterior.
  - Sin indicadores repetidos.
- **Caja:** tablero del turno con estado (verde abierta, gris cerrada, rojo si es de un día anterior), **4 pasos del día** con el paso actual marcado y como atajo, ingresos y egresos, duración y ticket promedio.
- **Módulos activables** (Configuración → Módulos): menú digital, Club, garantías, tareas y RR. HH. avanzado. Apagarlos sólo los oculta; los datos quedan.
- **Créditos** completos: Celular (387) 4484132 · www.vincularbusiness.com.ar · correo, con botones WhatsApp · Llamar · Página web · Correo.
- **Accesibilidad:**
  - Contraste AA verificado por auditor automático: 0 textos por debajo de 4,5:1 en todas las pantallas de dueño, recepción y mecánico, en claro y en oscuro, más ventanas, ingreso y menú público.
  - Controles de ≥ 44 px, sin desbordes de 320 a 1440 px y respeta “reducir movimiento”.
- Pruebas en `tools/pruebas/` (ver LEEME).

## Datos y respaldo (v5)

Pantalla **Sistema → Datos y respaldo** (solo el dueño). Funciona sin internet y sin servicios externos.

- **Respaldo completo**: archivo `.json` con todo el sistema, o `.vbk` **cifrado** con clave (AES-256-GCM, clave derivada con PBKDF2-SHA256). Si se pierde la clave del respaldo cifrado, no se puede abrir: anotarla en un lugar seguro.
- **Restaurar**: valida el archivo y, antes de reemplazar, deja una copia automática del estado actual. El sistema real no acepta respaldos de práctica o de demostración.
- **Copias automáticas en el equipo**: una por día y otra antes de cada restauración o importación; se guardan las últimas 10 en el navegador. No reemplazan al respaldo en un pendrive o en la nube.
- **Exportar**: cada tabla (clientes, vehículos, órdenes, ventas, repuestos, stock, proveedores, compras, caja, turnos, servicios, garantías, Club, personal, asistencia, tareas, auditoría) en Excel, CSV o JSON, o un Excel completo con todas las hojas. El CSV usa `;` y viene protegido contra fórmulas peligrosas.
- **Importar** desde Excel (.xlsx), CSV o JSON: clientes con vehículos, proveedores, servicios, actualización de precios por código y repuestos. Reconoce encabezados con distintos nombres, muestra una vista previa con las filas aceptadas y rechazadas (con el motivo) y recién después aplica. No lee el formato viejo .xls: guardarlo antes como .xlsx.

## Sin internet (v5)

- Después de abrirlo una vez con internet, el sistema **vuelve a abrir y trabaja sin conexión** (queda guardado en el equipo). Arriba aparece "● Sin internet" mientras no hay conexión.
- **Instalar como app**: desde Datos y respaldo → Sin internet, o desde el menú del navegador ("Instalar" / "Agregar a pantalla de inicio").
- **Almacenamiento permanente**: pedirlo en la misma pestaña, para que el navegador no borre los datos al quedarse sin espacio.
- **Copia del programa**: botón para descargar el `.html`, que abre con doble clic en cualquier computadora aunque no haya internet.
- Los datos viven **en ese navegador y ese equipo**: hacer un respaldo al menos una vez por semana y guardarlo fuera del equipo. Borrar los datos del navegador borra el sistema.
- Lo que necesita internet: compartir por WhatsApp, abrir mapas y recibir las versiones nuevas (cuando hay una, aparece el aviso para actualizar).

## Configuración dinámica y acceso oculto (v6)

- **Configuración por secciones**: Datos del negocio, Módulos, Funcionamiento, Mano de obra, Menú digital, Usuarios y accesos, Datos y respaldo y Auditoría. Están todas las opciones de antes.
- **Buscador de ajustes** arriba ("IVA", "horario", "clave"…): lleva directo al ajuste y lo resalta. Tolera errores de tipeo.
- **Puesta en marcha**: barra de progreso y lista de lo que falta (datos de contacto, precios sin cargar, respaldo vencido). Cada pendiente es un botón que lleva al lugar.
- **Se guarda solo**: los datos del negocio y los precios se guardan mientras se escribe (aparece "✓ Guardado") y la vista previa muestra cómo lo ve el cliente. El nombre no se guarda si queda vacío.
- **Interruptores** en lugar de casillas, con la explicación de cada opción.
- **Mano de obra**: búsqueda, filtro por área y "Sin precio", precio con IVA al lado, acepta "10.000" y **aumento o baja por porcentaje** a todos o a los filtrados (redondea a la decena; las órdenes cargadas no cambian).
- **Acceso oculto al panel**: en el menú digital público, **doble clic (o doble toque en el celular) sobre el logo** abre el ingreso al sistema. No se ve ningún botón y sigue pidiendo usuario y clave. Se apaga en Configuración → Menú digital.

## Impresiones (v7)

Pantalla **Operación → Impresiones** (dueño, jefe de taller y recepción) y botones en cada lugar: "🖨 Más impresiones…" dentro de cada orden, 🖨 en cada venta y en cada orden de compra, y aviso para imprimir el ticket apenas se cobra una venta.

- **Para el cliente**: presupuesto, orden de trabajo, comprobante interno (con la X y "Documento no válido como factura"), recibo de cada cobro con el importe en letras, constancia de entrega con garantías y próximo service, ticket de venta, estado de cuenta y etiqueta de próximo service (10 × 6 cm).
- **Para el taller**: agenda del día (turnos, vehículos en el taller y tareas, con casillas), orden de compra, pedido de reposición por proveedor, lista de precios de mano de obra y cartel A4 con el QR del menú digital.
- **Formato**: hoja A4, ticket de 80 mm o de 58 mm (impresoras térmicas). Para un PDF, "Guardar como PDF" en la ventana de impresión. Funciona sin internet.
- **Factura**: el sistema **no emite facturas ni pide CAE**. Se emite en ARCA (web o facturador) y después se **registra a mano** el tipo, punto de venta, número y, si se quiere, el CAE, para que quede vinculada a la orden o a la venta y salga en los papeles. Sugiere la letra según la condición del negocio y del cliente [VERIFICAR con el contador].
- **Configuración → Impresión y datos fiscales**: CUIT (con control del dígito verificador), condición frente al IVA, Ingresos Brutos, inicio de actividades, texto al pie y condiciones de garantía. Hasta que se completen, la puesta en marcha lo marca como pendiente.
- El QR usa la biblioteca qrcode-generator 2.0.4 (Kazuhiko Arase, licencia MIT), incluida dentro del archivo.

## Ejemplos de ventas y compras, y demo limpia (v7.1)

- Los datos de ejemplo suman 5 ventas de mostrador (consumidor final, monotributista y responsable inscripto, con distintos medios de pago), una de ellas con factura registrada, y 2 órdenes de compra pendientes. Así se pueden mostrar el ticket, el recibo, la orden de compra y el registro de factura sin cargar nada antes.
- La versión de los datos de ejemplo pasó a `car5`: los datos de **práctica** guardados con la versión anterior se reemplazan solos por los nuevos. Los datos reales no se tocan.

## Límites (no afirmar más que esto)
- **Los datos viven sólo en el navegador y el equipo donde se usan.** No hay sincronización entre dispositivos ni copia en la nube; si se borran los datos del navegador o se cambia de equipo, sólo sirve el respaldo.
- **La clave es un control de uso del sistema, no seguridad de servidor:** quien tenga acceso al equipo y sepa usar las herramientas del navegador puede leer o modificar los datos locales. Para varios equipos o seguridad real hace falta un servidor (por ejemplo, Supabase).
- Las dimensiones/rosca/junta cargadas en el modo práctica son de ejemplo y están marcadas “sin verificar”. WEGA no publica API ni descarga de filtros **[VERIFICAR con WEGA]**; se resuelve con enlace a la ficha + importación CSV.
- Lo que se pide desde el menú digital queda en el navegador donde se hizo y llega por WhatsApp; para que llegue a todos los equipos hace falta la nube. La asistencia es un registro interno y los sueldos, una estimación (la liquidación legal la hace el contador).
- Sin facturación electrónica ni pagos reales. Textos legales y plazos normativos marcados `[VERIFICAR]`.
- Los respaldos de la versión demo anterior no son compatibles.

Desarrollado por **VINCULAR BUSINESS** · (387) 4484132 · vincularbusiness@gmail.com · “Tu idea, en buenas manos.”
