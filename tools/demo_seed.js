/* ===== DEMO Car Center (Sistema VB): áreas, catálogo, Club y datos de ejemplo de los módulos extra ===== */
const AREAS=[['mec','Mecánica','🔧'],['ele','Electricidad','⚡'],['aud','Car audio y multimedia','🔊'],['ala','Alarmas y seguridad','🚨'],['acc','Accesorios y estética','✨']];
const areaOf=k=>AREAS.find(a=>a[0]===k)||AREAS[0];
const AREA_INST=['ele','aud','ala','acc'];
const CLUBDEF={on:true,cada:1000,ptsx:1,valor:20,niveles:[{n:'Bronce',d:0,b:'Sumás puntos en cada service, instalación y compra'},{n:'Plata',d:400,b:'Lavado de motor sin cargo en cada service'},{n:'Oro',d:1200,b:'5 % menos en mano de obra y prioridad de turno'}],cumple:'10 % de descuento en mano de obra durante tu mes de cumpleaños',vence:12};
const MENUDEF={bienvenida:'Mecánica, car audio, alarmas y accesorios en un solo lugar.',horario:'Lunes a viernes de 8:30 a 18 · Sábados de 9 a 13',precios:true,turnos:true,club:true};
const PREMIOSDEF=[{id:'pr1',n:'Lavado de motor',pts:250,d:'Con desengrasante y secado'},{id:'pr2',n:'Revisión de alarma y controles',pts:300,d:'Chequeo, batería de controles y ajuste de sensores'},{id:'pr3',n:'Kit LED para patente',pts:400,d:'Par de lámparas LED instaladas'},{id:'pr4',n:'Alineación sin cargo',pts:900,d:'Alineación computarizada'}];
const DEMOVER='car4';
const tel10=t=>String(t||'').replace(/\D/g,'').slice(-10);
function extMigrar(o){if(o.modo==='practica'&&o.demoVer!==DEMOVER&&typeof seed==='function')return migrar(seed());
 o.cfg=o.cfg||{};o.seq=o.seq||{};
 if(!o.cfg.club)o.cfg.club=JSON.parse(JSON.stringify(CLUBDEF));if(!o.cfg.menu)o.cfg.menu=Object.assign({},MENUDEF);
 ['solic','pedidos','ptsMov','garantias'].forEach(k=>{if(!Array.isArray(o[k]))o[k]=[]});if(!Array.isArray(o.premios))o.premios=PREMIOSDEF.map(x=>Object.assign({},x));
 (o.servicios||[]).forEach(s=>{if(!s.area)s.area='mec';if(s.pub==null)s.pub=true;if(s.gar==null)s.gar=0;if(s.desc==null)s.desc='';if(s.desde==null)s.desde=false});
 (o.repuestos||[]).forEach(r=>{if(r.pub==null)r.pub=false;if(r.gar==null)r.gar=0;if(r.inst==null)r.inst='';if(r.dest==null)r.dest=false});(o.ots||[]).forEach(x=>{if(!x.area)x.area='mec'});
 (o.clientes||[]).forEach(c=>{if(c.club==null)c.club=false;if(c.pts==null)c.pts=0;if(c.nac==null)c.nac='';if(c.socio==null)c.socio=0});
 rhMigrar(o);
 if(!o.seq.socio)o.seq.socio=Math.max(0,...(o.clientes||[]).map(c=>c.socio||0));['ped','sol'].forEach(k=>{if(!o.seq[k])o.seq[k]=0});return o}
function extSeed(d){
 if(!VB_CLIENTE)d.cfg.nombre='Tu Taller Car Center';d.demoVer=DEMOVER;
 ['solic','pedidos','ptsMov','garantias'].forEach(k=>{if(!Array.isArray(d[k]))d[k]=[]});d.premios=PREMIOSDEF.map(x=>Object.assign({},x));d.cfg.club=JSON.parse(JSON.stringify(CLUBDEF));d.cfg.menu=Object.assign({},MENUDEF);
 if(!d.users.some(u=>u.id==='u8'))d.users.splice(d.users.length-1,0,{id:'u8',n:'Franco Díaz',rol:'mecanico',esp:'Car audio, alarmas y electricidad',com:8});
 /* áreas del catálogo existente */
 d.servicios.forEach(s=>{s.area=(s.id==='s5'||s.id==='s9')?'ele':'mec';s.pub=s.id!=='s12';s.gar=['s2','s7','s10'].includes(s.id)?6:(s.id==='s9'?3:0);s.desde=['s7','s9','s10'].includes(s.id);s.desc=''});
 const SD={s1:'Aceite y filtro según manual, control de niveles y luces',s2:'Pastillas originales o de primera marca, control de discos',s4:'Alineación computarizada y balanceo de las 4 ruedas',s5:'Lectura de fallas con escáner y diagnóstico por escrito',s6:'Control de pérdidas y carga de gas refrigerante',s7:'Correa, tensor y bomba de agua según el vehículo',s9:'Desarme, limpieza y reparación con garantía'};Object.keys(SD).forEach(k=>{const s=d.servicios.find(x=>x.id===k);if(s)s.desc=SD[k]});
 const NS=[['aud','Instalación de estéreo / multimedia Android',35000,1.5,6,'Con interfaz de comandos al volante y cámara si la tiene',false],
  ['aud','Instalación de parlantes (par)',18000,1,6,'Puertas delanteras o traseras, con adaptadores',false],
  ['aud','Instalación de subwoofer y potencia',45000,2.5,6,'Cableado de potencia, fusible y regulación del sistema',false],
  ['aud','Cámara de retroceso',25000,1.5,6,'Instalación oculta conectada a la multimedia',false],
  ['aud','Diagnóstico de audio',9000,0.5,0,'Revisión de ruidos, parlantes y conexiones',false],
  ['ala','Alarma con bloqueo de arranque',55000,3,12,'Sensores de puertas, baúl y capot, sirena y 2 controles',false],
  ['ala','Cierre centralizado (4 puertas)',48000,3,12,'Se integra a la alarma y al control',false],
  ['ala','Sensores de estacionamiento (x4)',38000,2,12,'Con display o aviso sonoro',false],
  ['ala','Rastreo satelital GPS',30000,1.5,12,'Ubicación en el celular y corte de motor a distancia',false],
  ['ala','Revisión de alarma y controles',12000,0.5,0,'Diagnóstico, programación de controles y ajuste de sensores',false],
  ['ele','Levantavidrios eléctricos (par)',52000,3,6,'Kit completo con botoneras',true],
  ['ele','Reparación de instalación eléctrica',20000,1,3,'Por hora, con presupuesto previo',true],
  ['acc','Polarizado completo',60000,3,24,'Film con certificado, laterales y luneta',true],
  ['acc','Luces LED en faros',15000,1,6,'Lámparas LED de alta potencia, con canceller si hace falta',false],
  ['acc','Pulido y restauración de ópticas',22000,1.5,0,'Par de ópticas delanteras',false]];
 NS.forEach((s,i)=>d.servicios.push({id:'s'+(13+i),area:s[0],n:s[1],pu:s[2],h:s[3],gar:s[4],desc:s[5],desde:s[6],pub:true}));
 ['CAR AUDIO','ALARMAS Y SEGURIDAD','ACCESORIOS','INTERIOR Y CONFORT','LIMPIEZA Y CUIDADO','EMERGENCIA Y AUXILIO'].forEach(r=>{if(!d.rubrosRep.includes(r))d.rubrosRep.push(r)});
 ['PIONEER','JBL','SONY','POSITRON','X-28','PHILIPS','3M','GENÉRICO'].forEach(m=>{if(!d.marcas.includes(m))d.marcas.push(m)});
 d.provs.push({id:'p6',n:'Audio Center Mayorista (ejemplo)',cuit:mkCuit('3071',7781),tel:'3874601122',mail:'ventas@audiocenter.example',activo:true,cond:'RI'});
 d.provs.push({id:'p7',n:'Seguridad Vehicular Norte (ejemplo)',cuit:mkCuit('3070',6620),tel:'3874602233',mail:'pedidos@segnorte.example',activo:true,cond:'RI'});
 /* cod, desc, marca, rubro, prov, costo, %gan, stock, alarma, reposición, garantía (meses), aplicación */
 const NP=[['MM-68-CP','Multimedia 6,8" con CarPlay y Android Auto','PIONEER','CAR AUDIO','p6',420000,35,3,1,3,12,'Doble DIN · Bluetooth · entrada de cámara'],
  ['EST-1DIN-BT','Estéreo 1 DIN Bluetooth y USB','SONY','CAR AUDIO','p6',95000,40,6,2,4,12,'Universal'],
  ['PAR-65-2V','Parlantes 6,5" 2 vías (par)','JBL','CAR AUDIO','p6',78000,40,8,2,6,12,'Puertas de la mayoría de los autos'],
  ['PAR-69-3V','Parlantes 6x9" 3 vías (par)','JBL','CAR AUDIO','p6',99000,40,5,2,4,12,'Bandeja trasera / puertas grandes'],
  ['SUB-12-CJ','Subwoofer 12" con cajón','PIONEER','CAR AUDIO','p6',165000,35,2,1,2,12,'Baúl'],
  ['POT-4CH-800','Potencia 4 canales 800 W','PIONEER','CAR AUDIO','p6',190000,35,2,1,2,12,''],
  ['KIT-CAB-8GA','Kit de cables para potencia 8 GA','GENÉRICO','CAR AUDIO','p6',24000,60,6,2,4,0,'Con fusible y terminales'],
  ['ALA-2C-BLQ','Alarma con 2 controles y bloqueo de arranque','POSITRON','ALARMAS Y SEGURIDAD','p7',85000,45,4,2,4,12,'Universal 12 V'],
  ['ALA-PRES','Alarma con sensor de presencia y presentación','X-28','ALARMAS Y SEGURIDAD','p7',110000,40,3,1,3,12,'Universal 12 V'],
  ['CIE-CEN-4P','Kit de cierre centralizado 4 puertas','GENÉRICO','ALARMAS Y SEGURIDAD','p7',42000,50,4,2,4,12,''],
  ['SEN-EST-4','Sensores de estacionamiento x4 con display','GENÉRICO','ALARMAS Y SEGURIDAD','p7',36000,50,5,2,4,12,'Paragolpes trasero'],
  ['GPS-4G','Rastreador GPS 4G con corte de motor','GENÉRICO','ALARMAS Y SEGURIDAD','p7',48000,50,3,1,3,12,'Requiere abono de datos [VERIFICAR con el proveedor]'],
  ['CTRL-REM','Control remoto de alarma (repuesto)','POSITRON','ALARMAS Y SEGURIDAD','p7',9500,70,1,2,6,3,'Compatible con la alarma ALA-2C-BLQ'],
  ['CAM-RET-HD','Cámara de retroceso HD','GENÉRICO','ACCESORIOS','p6',28000,55,6,2,4,6,'Visión nocturna'],
  ['LED-H4','Kit LED H4 6000K (par)','PHILIPS','ACCESORIOS','p1',38000,50,6,2,4,6,'Faros con lámpara H4'],
  ['LED-H7','Kit LED H7 6000K (par)','PHILIPS','ACCESORIOS','p1',36000,50,4,2,4,6,'Faros con lámpara H7'],
  ['POL-35','Film polarizado 35 % (un auto)','3M','ACCESORIOS','p6',38000,60,5,2,4,0,'Con certificado [VERIFICAR normativa vigente]'],
  ['LVD-KIT-2P','Kit levantavidrios eléctricos (par)','GENÉRICO','ACCESORIOS','p7',65000,45,3,1,2,6,'Puertas delanteras'],
  ['TWT-PAR','Tweeters (par) con crossover','JBL','CAR AUDIO','p6',32000,45,6,2,4,12,'Para pilares o puertas delanteras'],
  ['WOOF-10','Woofer 10" 600 W','PIONEER','CAR AUDIO','p6',98000,40,3,1,2,12,'Para cajón cerrado o ported'],
  ['INT-CMD','Interfaz de comandos al volante','GENÉRICO','CAR AUDIO','p6',26000,55,4,1,3,6,'Según marca y modelo del auto'],
  ['MARCO-2DIN','Marco adaptador 2 DIN','GENÉRICO','CAR AUDIO','p6',12000,60,8,2,4,0,'Según modelo del auto'],
  ['CORTA-CORR','Corta corriente oculto','GENÉRICO','ALARMAS Y SEGURIDAD','p7',15000,60,6,2,4,12,'Universal 12 V'],
  ['TRABA-VOL','Traba volante reforzada','GENÉRICO','ALARMAS Y SEGURIDAD','p7',22000,50,5,2,4,6,'Universal'],
  ['DASHCAM-FHD','Cámara dashcam Full HD con visión nocturna','GENÉRICO','ACCESORIOS','p6',45000,50,4,1,3,6,'Graba en memoria microSD'],
  ['BARRA-LED','Barra LED 4x4 de 32"','GENÉRICO','ILUMINACIÓN','p1',58000,50,2,1,2,6,'Camionetas y 4x4'],
  ['LED-T10','Lámparas LED de posición T10 (par)','PHILIPS','ILUMINACIÓN','p1',4500,90,20,4,10,6,'Posición, patente y tablero'],
  ['SOP-CEL','Soporte de celular magnético','GENÉRICO','INTERIOR Y CONFORT','p1',6500,80,15,4,10,0,'Para rejilla de aire'],
  ['CARG-USBC','Cargador 12 V doble USB-C carga rápida','GENÉRICO','INTERIOR Y CONFORT','p1',8500,80,12,4,10,3,''],
  ['FUND-ASI','Fundas de asiento (juego completo)','GENÉRICO','INTERIOR Y CONFORT','p1',52000,50,4,1,3,0,'Cuero ecológico · universales'],
  ['CUB-VOL','Cubre volante de cuero ecológico','GENÉRICO','INTERIOR Y CONFORT','p1',9800,80,10,3,6,0,'Volantes de 37 a 39 cm'],
  ['ALF-GOMA','Alfombras de goma (juego de 4)','GENÉRICO','INTERIOR Y CONFORT','p1',18000,70,6,2,4,0,'Universales recortables'],
  ['AROMA','Aromatizante para salida de aire','GENÉRICO','INTERIOR Y CONFORT','p1',2500,100,30,6,20,0,'Varias fragancias'],
  ['SHAMPOO','Shampoo para autos con cera 1 L','GENÉRICO','LIMPIEZA Y CUIDADO','p1',6000,80,12,3,8,0,''],
  ['KIT-LIMP','Kit de limpieza interior con microfibra','GENÉRICO','LIMPIEZA Y CUIDADO','p1',16000,70,6,2,4,0,'Tablero, tapizados y vidrios'],
  ['REST-OPT','Kit restaurador de ópticas','GENÉRICO','LIMPIEZA Y CUIDADO','p1',12000,70,5,2,4,0,'Para un par de ópticas'],
  ['INFL-12V','Inflador de neumáticos 12 V digital','GENÉRICO','EMERGENCIA Y AUXILIO','p1',28000,55,5,2,4,6,'Con corte automático'],
  ['MATAF-1KG','Matafuegos 1 kg con soporte','GENÉRICO','EMERGENCIA Y AUXILIO','p1',19000,50,8,3,6,12,'Para circular [VERIFICAR normativa y carga]'],
  ['BALIZAS','Balizas triangulares (par)','GENÉRICO','EMERGENCIA Y AUXILIO','p1',7000,70,10,3,6,0,''],
  ['KIT-EMERG','Kit de emergencia (cables, linterna y chaleco)','GENÉRICO','EMERGENCIA Y AUXILIO','p1',21000,60,4,2,4,0,''],
  ['ARRANC-PORT','Arrancador portátil de batería 12 V','GENÉRICO','EMERGENCIA Y AUXILIO','p1',75000,45,3,1,2,12,'Nafta hasta 3.0 y diésel hasta 2.0']];
 const INST={'MM-68-CP':'s13','EST-1DIN-BT':'s13','INT-CMD':'s13','MARCO-2DIN':'s13','PAR-65-2V':'s14','PAR-69-3V':'s14','TWT-PAR':'s14','SUB-12-CJ':'s15','POT-4CH-800':'s15','WOOF-10':'s15','ALA-2C-BLQ':'s18','ALA-PRES':'s18','CIE-CEN-4P':'s19','SEN-EST-4':'s20','GPS-4G':'s21','CAM-RET-HD':'s16','LED-H4':'s26','LED-H7':'s26','POL-35':'s25','LVD-KIT-2P':'s23','CORTA-CORR':'s24','DASHCAM-FHD':'s24','BARRA-LED':'s24'};
 const DEST=['MM-68-CP','PAR-65-2V','ALA-2C-BLQ','DASHCAM-FHD','LED-H4','FUND-ASI','SEN-EST-4','ARRANC-PORT'];
 const n0=d.repuestos.length;
 NP.forEach((p,i)=>{const pv=r2(p[5]*(1+p[6]/100));d.repuestos.push({id:'r'+(n0+i+1),cod:p[0],codProv:p[0],desc:p[1],marca:p[2],rubro:p[3],provId:p[4],pc:p[5],gan:p[6],pv:pv,qty:p[7],alarma:p[8],repos:p[9],venc:false,fvenc:'',pAnt:0,fAct:'',iva:21,rosca:'',junta:'',apl:p[11],activo:true,cods:[],oem:'',eq:[],largo:'',ancho:'',alto:'',dext:'',dint:'',valv:'',picos:'',obs:'',fuente:'',fVerif:'',hist:[],pub:true,gar:p[10],inst:INST[p[0]]||'',dest:DEST.includes(p[0])});
  d.kardex.push({id:'k'+(n0+i+1),t:Date.now()-864e5*30,repId:'r'+(n0+i+1),tipo:'Saldo inicial (ejemplo)',delta:p[7],saldo:p[7],ref:'',u:'sistema'})});
 d.repuestos.forEach(r=>{if(r.pub==null){r.pub=['ACEITE LUBRICANTE','BATERÍAS','ILUMINACIÓN'].includes(r.rubro);r.gar=r.rubro==='BATERÍAS'?12:0}});
 /* Club: socios de ejemplo */
 const nacM=new Date();const mes=String(nacM.getMonth()+1).padStart(2,'0');
 const SO=[['c1','1985-03-14',380],['c2','1992-'+mes+'-21',120],['c4','1978-08-02',1250],['c5','1990-11-30',60]];
 SO.forEach((s,i)=>{const c=d.clientes.find(x=>x.id===s[0]);if(!c)return;c.club=true;c.socio=i+1;c.nac=s[1];c.pts=s[2];
  d.ptsMov.push({id:'pm'+(i+1),cliId:c.id,fecha:addDays(-40+i*5),tipo:'Acumulación',pts:s[2],ref:'Saldo inicial (ejemplo)',u:'sistema'})});
 d.seq.socio=SO.length;
 /* OT de instalaciones */
 const mkI=(cli,veh,mot,est,mec,dias,area,items,extra)=>{d.seq.ot++;const v=d.vehs.find(x=>x.id===veh);const cl=d.clientes.find(x=>x.id===cli)||{};
  const o=Object.assign({id:'ot'+d.seq.ot,num:d.seq.ot,fecha:addDays(-dias),cliId:cli,vehId:veh,km:v.km,motivo:mot,estado:est,mecId:mec,recurso:'4',presAprob:est!=='Recibido'&&est!=='Diagnóstico'&&est!=='Presupuesto',
   items:[],check:{aceite:true,luces:true,neum:true,rayones:false,auxilio:true,docs:true,comb:'1/2',inst:{bat:true,tab:true,vid:true,aud:true,cer:true}},obs:'',pagos:[],entregada:'',ccTomado:0,pedido:'',fotos:[],presEnv:{f:addDays(-dias),u:d.users[0].n},presApF:addDays(-dias),area,arca:{cond:cl.cond||'CF',doc:cl.doc||''},sinIva:false,desc:null},extra||{});
  items.forEach(it=>{if(it[0]==='r'){const r=d.repuestos.find(x=>x.cod===it[1]);o.items.push({k:'rep',repId:r.id,desc:r.desc+' ('+r.marca+')',qty:it[2],pu:r.pv,pu0:r.pv,iva:r.iva,costo:r.pc})}
   else{const s=d.servicios.find(x=>x.n===it[1]);o.items.push({k:'mo',sid:s.id,desc:s.n,qty:it[2],pu:s.pu,pu0:s.pu,iva:21,costo:0})}});
  d.ots.push(o);return o};
 mkI('c2','v3','Instalar multimedia con CarPlay y cambiar parlantes delanteros','En reparación','u8',0,'aud',[['r','MM-68-CP',1],['r','PAR-65-2V',1],['m','Instalación de estéreo / multimedia Android',1],['m','Instalación de parlantes (par)',1]]);
 mkI('c6','v8','Alarma con bloqueo y cierre centralizado','Presupuesto','u8',0,'ala',[['r','ALA-2C-BLQ',1],['r','CIE-CEN-4P',1],['m','Alarma con bloqueo de arranque',1],['m','Cierre centralizado (4 puertas)',1]]);
 const g=mkI('c4','v6','Alarma con bloqueo de arranque y sensores de estacionamiento','Entregado','u8',50,'ala',[['r','ALA-2C-BLQ',1],['r','SEN-EST-4',1],['m','Alarma con bloqueo de arranque',1],['m','Sensores de estacionamiento (x4)',1]],{entregada:addDays(-49),entregadaPor:d.users[0].n});
 g.pagos.push({id:uid('pg'),fecha:g.entregada,medio:'Transferencia',monto:otTotal(g).total,cajaId:''});
 const veh=d.vehs.find(x=>x.id==='v6')||{};
 d.garantias.push({id:'ga1',otId:g.id,cliId:'c4',vehId:'v6',desc:'Alarma con 2 controles y bloqueo de arranque (POSITRON)',desde:g.entregada,hasta:addDays(-49+365),serie:'PX-2231-0458',recl:[]});
 d.garantias.push({id:'ga2',otId:g.id,cliId:'c4',vehId:'v6',desc:'Sensores de estacionamiento x4 con display (GENÉRICO)',desde:g.entregada,hasta:addDays(-49+365),serie:'',recl:[]});
 d.garantias.push({id:'ga3',otId:d.ots[6]?d.ots[6].id:'',cliId:'c1',vehId:'v2',desc:'Cambio de amortiguadores (eje)',desde:addDays(-5),hasta:addDays(12),serie:'',recl:[]});
 /* turnos del box de instalaciones */
 const tuI=(dias,hr,dur,cli,veh,srv,est,ot)=>{d.seq.tu++;d.turnos.push({id:'t'+d.seq.tu,fecha:addDays(dias),hora:hr,dur,rec:4,cliId:cli,vehId:veh,srv,estado:est,otId:ot||''})};
 tuI(0,9,3,'c2','v3','Multimedia CarPlay + parlantes','En taller',d.ots.find(o=>o.area==='aud').id);tuI(0,14,3,'c6','v8','Alarma + cierre centralizado','Confirmado');tuI(1,14,2,'c1','v1','Sensores de estacionamiento','Pendiente');
 /* pedidos y turnos que llegaron por el menú digital */
 const rq=c=>d.repuestos.find(x=>x.cod===c);
 d.seq.ped=1;d.pedidos.push({id:'pw1',num:1,t:Date.now()-36e5*3,n:'Lautaro Sosa (ejemplo)',tel:'3875667788',veh:'Peugeot 208',entrega:'instalar',nota:'¿Tienen turno para el sábado?',estado:'Nuevo',items:[{k:'rep',id:rq('PAR-69-3V').id,qty:1,desc:rq('PAR-69-3V').desc,pu:r2(rq('PAR-69-3V').pv*1.21)},{k:'srv',id:'s14',qty:1,desc:'Instalación de parlantes (par)',pu:r2(18000*1.21)}]});
 d.seq.sol=2;d.solic.push({id:'sw1',num:1,t:Date.now()-36e5*5,fecha:addDays(1),hora:10,sid:'s18',n:'Micaela Torres (ejemplo)',tel:'3874112299',pat:'AD987ZX',veh:'Chevrolet Onix',nota:'Quiero alarma con bloqueo',estado:'Nueva'});
 d.solic.push({id:'sw2',num:2,t:Date.now()-36e5*20,fecha:addDays(2),hora:9,sid:'s1',n:'Raúl Cardozo (ejemplo)',tel:'3875443322',pat:'AB321CC',veh:'Fiat Cronos',nota:'',estado:'Nueva'});
 rhSeed(d);
 return d}
