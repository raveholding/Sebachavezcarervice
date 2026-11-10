/* ===== DEMO: Personal, RR. HH. y tareas — datos base y de ejemplo ===== */
const AREAS_RH=['Dirección','Mecánica','Car audio y alarmas','Recepción y ventas','Administración','Limpieza y mantenimiento'];
const CONTRATOS=['Relación de dependencia','Monotributo (servicios)','Pasantía / práctica','Eventual'];
const AUSTIPOS=['Vacaciones','Enfermedad','Licencia especial','Capacitación','Ausencia con aviso','Ausencia sin aviso'];
const RESPDEF={dueno:['Define precios, metas y compras grandes','Controla caja, cierres y respaldo','Aprueba vacaciones, adelantos y sueldos','Sigue el Club y los resultados del mes'],
 jefe:['Asigna órdenes y puestos de trabajo','Arma y entrega presupuestos','Controla calidad y prueba de ruta antes de entregar','Control semanal de herramientas y EPP'],
 recepcion:['Recibe vehículos con el checklist','Agenda y confirma turnos (también los del menú)','Responde pedidos del menú y WhatsApp','Cobra y entrega cuando está habilitado','Carga clientes nuevos con datos fiscales'],
 mecanico:['Diagnóstico con fotos','Reparación e instalación según la orden','Avisa repuestos que faltan','Deja el puesto limpio y las herramientas en su lugar'],
 limpieza:['Limpieza del salón, baños y boxes','Orden del depósito y residuos','Reposición de insumos de limpieza']};
function rhMigrar(o){['asis','aus','tareas','tarRec','adel'].forEach(k=>{if(!Array.isArray(o[k]))o[k]=[]});o.cfg=o.cfg||{};if(!o.cfg.resp)o.cfg.resp=JSON.parse(JSON.stringify(RESPDEF));
 (o.users||[]).forEach(u=>{u.leg=Object.assign({dni:'',cuil:'',nac:'',tel:'',dom:'',ingreso:'',contrato:CONTRATOS[0],area:u.rol==='dueno'?'Dirección':u.rol==='recepcion'?'Recepción y ventas':u.rol==='limpieza'?'Limpieza y mantenimiento':'Mecánica',jefe:'',basico:0,hin:'08:30',hout:'17:30',dias:'Lunes a viernes',emerg:'',docs:[],capac:[]},u.leg||{})});return o}
function rhSeed(d){rhMigrar(d);const OWN=()=>d.users[0].n;const L={
 u1:{dni:'25111222',ingreso:'2012-03-01',contrato:'Relación de dependencia',area:'Dirección',jefe:'',basico:0,tel:'3874000001',emerg:'Laura (esposa) 3874000011',hin:'08:30',hout:'18:00'},
 u2:{dni:'28333444',ingreso:'2015-06-15',area:'Mecánica',jefe:'u1',basico:1450000,tel:'3874000002',emerg:'Mónica 3874000022'},
 u3:{dni:'35555666',ingreso:'2021-02-01',area:'Recepción y ventas',jefe:'u1',basico:980000,tel:'3874000003',emerg:'Jorge 3874000033',hin:'08:00',hout:'16:00'},
 u4:{dni:'33777888',ingreso:'2018-09-10',area:'Mecánica',jefe:'u2',basico:1150000,tel:'3874000004'},
 u5:{dni:'38999000',ingreso:'2022-04-04',area:'Mecánica',jefe:'u2',basico:1050000,tel:'3874000005'},
 u6:{dni:'31222333',ingreso:'2010-01-20',area:'Mecánica',jefe:'u2',basico:1200000,tel:'3874000006'},
 u8:{dni:'40111999',ingreso:'2023-08-01',contrato:'Monotributo (servicios)',area:'Car audio y alarmas',jefe:'u2',basico:900000,tel:'3874000008'},
 u7:{dni:'30444555',ingreso:'2019-05-02',area:'Limpieza y mantenimiento',jefe:'u3',basico:750000,tel:'3874000007',hin:'07:30',hout:'12:30'}};
 d.users.forEach(u=>{const l=L[u.id];if(!l)return;u.leg=Object.assign({},l,{cuil:mkCuit(u.id==='u3'||u.id==='u7'?'27':'20',+l.dni.slice(0,8)%100000000),nac:'',dom:'Salta (ejemplo)',contrato:l.contrato||'Relación de dependencia',hin:l.hin||'08:30',hout:l.hout||'17:30',dias:'Lunes a viernes',emerg:l.emerg||'',
  docs:[{n:'Alta en ARCA / ART',venc:'',ok:true},{n:'Examen preocupacional',venc:'',ok:u.id!=='u8'},{n:'Contrato o constancia de monotributo firmada',venc:'',ok:true}],capac:[]})});
 const U=id=>d.users.find(x=>x.id===id);
 U('u2').leg.docs.push({n:'Carnet de conducir (prueba de ruta)',venc:addDays(18),ok:true});U('u8').leg.docs.push({n:'Constancia de monotributo al día',venc:addDays(9),ok:true});U('u4').leg.docs.push({n:'Carnet de conducir (prueba de ruta)',venc:addDays(400),ok:true});
 U('u2').leg.capac.push({n:'Inyección electrónica multimarca',f:'2024-05-10'});U('u4').leg.capac.push({n:'Electricidad del automotor avanzada',f:'2023-11-02'});U('u8').leg.capac.push({n:'Instalación de car audio y alarmas',f:'2024-03-15'},{n:'Manejo de rastreo satelital',f:'2025-07-01'});U('u6').leg.capac.push({n:'Manejo seguro de gases refrigerantes',f:'2022-08-20'});
 /* asistencia de los últimos días hábiles */
 const who=['u1','u2','u3','u4','u5','u6','u8','u7'];let k=0;
 for(let i=12;i>=1;i--){const f=addDays(-i),dw=new Date(f+'T12:00:00').getDay();if(dw===0||dw===6)continue;
  who.forEach((id,j)=>{const u=U(id);if(!u)return;if(id==='u6'&&i===2)return;const t0=u.leg.hin.split(':').map(Number),t1=u.leg.hout.split(':').map(Number);const de=((i*7+j*3)%17)-5,ds=((i*5+j*11)%23)-4;
   const hm=(h,m)=>{const x=h*60+m;return String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0')};d.asis.push({id:'as'+(++k),uid:id,f,in:hm(t0[0],t0[1]+de+(id==='u5'&&i%3===0?22:0)),out:hm(t1[0],t1[1]+ds)})})}
 who.filter(id=>id!=='u5').forEach((id,j)=>{const u=U(id);d.asis.push({id:'as'+(++k),uid:id,f:TODAY(),in:u.leg.hin.slice(0,3)+String(Math.max(0,+u.leg.hin.slice(3)-3+j)).padStart(2,'0'),out:''})});
 d.aus.push({id:'au1',uid:'u5',desde:addDays(3),hasta:addDays(9),tipo:'Vacaciones',nota:'Vacaciones de invierno',ok:true,u:OWN()});
 d.aus.push({id:'au2',uid:'u6',desde:addDays(-2),hasta:addDays(-2),tipo:'Enfermedad',nota:'Con certificado',ok:true,u:'Marcelo Torres'});
 d.aus.push({id:'au3',uid:'u3',desde:addDays(30),hasta:addDays(36),tipo:'Vacaciones',nota:'Pedido por la empleada',ok:false,u:'Lucía Ramos'});
 d.adel.push({id:'ad1',uid:'u6',f:addDays(-5),monto:80000,medio:'Efectivo',nota:'Adelanto de sueldo',u:OWN()});
 /* tareas recurrentes y del tablero */
 d.tarRec=[{id:'tr1',t:'Abrir caja y revisar los turnos del día',uid:'u3',area:'Recepción y ventas',freq:'d'},{id:'tr2',t:'Responder pedidos y turnos del menú digital',uid:'u3',area:'Recepción y ventas',freq:'d'},
  {id:'tr3',t:'Orden y limpieza de boxes y elevadores',uid:'u7',area:'Limpieza y mantenimiento',freq:'d'},{id:'tr4',t:'Control de herramientas y EPP',uid:'u2',area:'Mecánica',freq:'s'},
  {id:'tr5',t:'Inventario de car audio y alarmas',uid:'u8',area:'Car audio y alarmas',freq:'s'},{id:'tr6',t:'Exportar el respaldo del sistema',uid:'u1',area:'Dirección',freq:'s'},
  {id:'tr7',t:'Publicar novedades y promos en Instagram',uid:'u3',area:'Recepción y ventas',freq:'s'},{id:'tr8',t:'Control de matafuegos y botiquín',uid:'u2',area:'Mecánica',freq:'m'}];
 const T=(t,uid,area,venc,prio,est,ref)=>d.tareas.push({id:'ta'+(d.tareas.length+1),t,uid,area,venc,prio,est,ref:ref||'',rec:'',crea:OWN(),f:addDays(-1),hecha:est==='Hecha'?{u:(U(uid)||{}).n,f:addDays(-1)}:null});
 T('Pedir 3 alarmas POSITRON y controles de repuesto','u2','Mecánica',addDays(1),'Alta','Pendiente','Stock en alarma');
 T('Llamar a clientes con service vencido (Club → Recordatorios)','u3','Recepción y ventas',TODAY(),'Media','En curso');
 T('Probar cámara de retroceso del Fiesta antes de entregar','u8','Car audio y alarmas',TODAY(),'Alta','Pendiente','OT del Fiesta');
 T('Ordenar depósito de lubricantes','u7','Limpieza y mantenimiento',addDays(2),'Baja','Pendiente');
 T('Capacitar a Nahuel en escáner multimarca','u4','Mecánica',addDays(6),'Media','Pendiente');
 T('Renovar seguro de responsabilidad civil','u1','Dirección',addDays(20),'Alta','Pendiente','Seguridad y ambiente');
 T('Actualizar precios de instalación de audio','u1','Dirección',addDays(-1),'Media','Pendiente');
 T('Revisión del elevador 2','u2','Mecánica',addDays(-3),'Media','Hecha');
 return d}
