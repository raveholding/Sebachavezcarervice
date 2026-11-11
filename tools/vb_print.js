/* ======================= Impresión: comprobantes y papeles del taller (Sistema VB) =======================
   Todo se imprime con la impresora del equipo (o "Guardar como PDF"). Formatos: A4, ticket 80 mm y 58 mm.
   Ningún papel de este módulo es una factura: la factura se emite en ARCA (web o facturador) y acá sólo
   se registra a mano su número para tenerlo a mano. No se simula CAE ni ningún envío. */
(function(){const st=document.createElement('style');st.textContent=
'.prgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.prgrid .card{margin:0;display:flex;flex-direction:column;gap:8px}'+
'.prgrid .card h3{margin:0}.prbtns{display:flex;flex-wrap:wrap;gap:6px}.prbtns .btn{flex:0 0 auto}'+
'.prfmt{display:flex;gap:6px;flex-wrap:wrap}.prvt{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}'+
'@media print{html,body{background:#fff!important}#printArea .pr-tk{width:72mm;font:9pt/1.25 Arial,Helvetica,sans-serif;color:#000}#printArea .pr-tk58{width:48mm;font:8pt/1.25 Arial,Helvetica,sans-serif;color:#000}'+
'#printArea .pr-tk table,#printArea .pr-tk58 table{width:100%;border-collapse:collapse}#printArea .pr-tk td,#printArea .pr-tk58 td{border:0;padding:1px 0;font-size:inherit;vertical-align:top}'+
'#printArea .pr-a4{font:10.5pt/1.35 Arial,Helvetica,sans-serif;color:#000}#printArea .pr-a4 table{width:100%;border-collapse:collapse;margin:6px 0}#printArea .pr-a4 th{background:#eee!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;text-align:left}'+
'#printArea .pr-a4 td,#printArea .pr-a4 th{border:1px solid #999;padding:3px 5px}#printArea .n{text-align:right;white-space:nowrap}#printArea .pbrk{break-after:page}}';document.head.appendChild(st)})();

/* ---------- configuración de impresión y datos fiscales del negocio ---------- */
const prCfg=()=>{const c=DB.cfg;c.print=Object.assign({fmt:'a4',pie:'Gracias por elegirnos.',gar:'La garantía cubre defectos de los repuestos y de la mano de obra indicados, desde la fecha de entrega. No cubre mal uso, golpes, ni intervenciones de terceros. [VERIFICAR / completar por el taller]'},c.print||{});c.fisc=Object.assign({razon:'',cond:'',cuit:'',iibb:'',inicio:''},c.fisc||{});return c.print};
const PR_EMI=[['','— sin cargar —'],['RI','IVA Responsable Inscripto'],['MT','Responsable Monotributo'],['EX','IVA Sujeto Exento']];
const prFiscOk=()=>{prCfg();const f=DB.cfg.fisc;return !!(f.cond&&f.cuit)};
/* letra sugerida para la factura que se emite en ARCA, según emisor y receptor [VERIFICAR con el contador del negocio] */
function prLetra(rec){prCfg();const e=DB.cfg.fisc.cond;if(!e)return '';if(e!=='RI')return 'C';if(rec==='CE')return 'E';return ['RI','MT','MS'].includes(rec)?'A':'B'}
const PRU=['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'],
 PRD=['','','','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'],PRC=['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
function pr999(n){if(n===100)return 'cien';const c=Math.floor(n/100),r=n%100;const t=r<30?PRU[r]:PRD[Math.floor(r/10)]+(r%10?' y '+PRU[r%10]:'');return (PRC[c]+(c&&r?' ':'')+t).trim()}
const prApoc=s=>s.replace(/veintiuno$/,'veintiún').replace(/uno$/,'un');
function prLetras(x){x=Math.round(Math.abs(+x||0)*100)/100;let n=Math.floor(x);const ct=Math.round((x-n)*100);if(n>999999999)return '';
 const mi=Math.floor(n/1e6),mil=Math.floor(n%1e6/1000),re=n%1000;let s=[];
 if(mi)s.push(mi===1?'un millón':prApoc(pr999(mi))+' millones');if(mil)s.push(mil===1?'mil':prApoc(pr999(mil))+' mil');if(re)s.push(pr999(re));
 let w=s.join(' ')||'cero';return 'Son pesos '+w+(ct?' con '+String(ct).padStart(2,'0')+'/100':'')}
const prFact=f=>f&&f.num?'Factura '+f.tipo+' '+String(f.pv).padStart(5,'0')+'-'+String(f.num).padStart(8,'0')+(f.fecha?' del '+fdate(f.fecha):'')+(f.cae?' · CAE '+f.cae:''):'';

/* ---------- motor de impresión ---------- */
function prPrint(html,kind){const p=$('#printArea');if(!p)return;let pg=$('#prpage');if(!pg){pg=document.createElement('style');pg.id='prpage';document.head.appendChild(pg)}
 pg.textContent=kind==='a4'?'@page{size:A4;margin:12mm}':kind==='lbl'?'@page{margin:6mm}':'@page{margin:0}';
 p.innerHTML='<div class="pa pr-'+kind+'">'+html+'</div>';setTimeout(()=>window.print(),60)}
window.addEventListener('afterprint',()=>{const pg=$('#prpage');if(pg)pg.textContent=''});
const prK=()=>{const f=prCfg().fmt;return f==='80'?'tk':f==='58'?'tk58':'a4'};
function prEmisor(tk){prCfg();const c=DB.cfg,f=c.fisc;const fis=[f.razon&&f.razon!==c.nombre?h(f.razon):'',f.cuit?'CUIT '+h(f.cuit):'',f.cond?h(arcaTxt(f.cond)):'',f.iibb?'IIBB '+h(f.iibb):'',f.inicio?'Inicio de act. '+fdate(f.inicio):''].filter(Boolean).join(' · ');
 if(tk)return '<div style="text-align:center"><img src="'+LOGO+'" alt="" style="width:22mm;filter:grayscale(1)"><div style="font-weight:700;font-size:1.15em">'+h(c.nombre)+'</div><div>'+h(c.dir)+'</div><div>Tel. '+h(c.tel)+'</div>'+(fis?'<div>'+fis+'</div>':'')+'</div>';
 return '<div style="display:flex;gap:12px;align-items:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:8px"><img src="'+LOGO+'" alt="" style="width:70px"><div style="flex:1"><div style="font-size:15pt;font-weight:800">'+h(c.nombre)+'</div>'+h(c.dir)+' · Tel./WhatsApp '+h(c.tel)+(c.mail?' · '+h(c.mail):'')+(fis?'<br>'+fis:'')+'</div></div>'}
const prHr='<div style="border-top:1px dashed #000;margin:4px 0"></div>';
const prPie=tk=>{const p=prCfg().pie;return (p?'<p style="text-align:center;margin:6px 0 2px">'+h(p)+'</p>':'')+'<p style="font-size:'+(tk?'7pt':'8pt')+';text-align:center;margin:4px 0 0;color:#333">Sistema: Vincular Business · (387) 4484132 · vincularbusiness.com.ar</p>'};
const prX=(tit,num,rec)=>{const L=prLetra(rec);return '<div style="display:flex;gap:10px;align-items:center;margin:6px 0"><div style="border:2px solid #000;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font:800 18pt Arial">X</div><div><b style="font-size:13pt">'+h(tit)+' '+h(num)+'</b><br><span style="font-size:8.5pt">Documento no válido como factura'+(L?' · Factura a emitir en ARCA: tipo '+L+' (sugerido) [VERIFICAR con el contador]':'')+'</span></div></div>'};

/* ---------- documentos de orden de trabajo ---------- */
const prOtCtx=o=>({o,v:vehOf(o.vehId)||{},c:cliOf(o.cliId)||{},t:otTotal(o),ar:(typeof otArca==='function'?otArca(o):null)||{cond:(cliOf(o.cliId)||{}).cond||'CF',doc:(cliOf(o.cliId)||{}).doc||''}});
function prOtComp(o){const {v,c,t,ar}=prOtCtx(o),k=prK(),tk=k!=='a4';const it=o.items||[];
 if(tk)return [k,prEmisor(1)+prHr+'<div style="text-align:center;font-weight:700">COMPROBANTE INTERNO · X</div><div style="text-align:center">'+otNum(o)+' · '+fdate(o.entregada||TODAY())+'</div><div style="text-align:center;font-size:.9em">Documento no válido como factura</div>'+prHr+
  '<div>Cliente: <b>'+h(c.n||'')+'</b></div><div>'+h(arcaLine(ar))+'</div><div>'+h((v.marca||'')+' '+(v.mod||''))+' · '+h(v.pat||'')+' · '+h(o.km||'')+' km</div>'+prHr+
  '<table>'+it.map(i=>'<tr><td colspan="2">'+h(i.desc)+'</td></tr><tr><td>'+i.qty+' × '+fmt(i.pu)+'</td><td class="n" style="text-align:right">'+fmt(lnNet(i))+'</td></tr>').join('')+'</table>'+prHr+
  '<table><tr><td>Neto</td><td style="text-align:right">'+fmt(t.neto)+'</td></tr><tr><td>'+(o.sinIva?'Sin IVA':'IVA')+'</td><td style="text-align:right">'+fmt(t.iva)+'</td></tr>'+(t.desc>0?'<tr><td>Descuento</td><td style="text-align:right">−'+fmt(t.desc)+'</td></tr>':'')+'<tr><td><b>TOTAL</b></td><td style="text-align:right"><b>'+fmt(t.total)+'</b></td></tr>'+(t.pagado?'<tr><td>Pagado</td><td style="text-align:right">'+fmt(t.pagado)+'</td></tr><tr><td>Saldo</td><td style="text-align:right">'+fmt(Math.max(0,t.saldo))+'</td></tr>':'')+'</table>'+
  ((o.pagos||[]).length?'<div>Pagos: '+o.pagos.map(p=>h(p.medio)+' '+fmt(p.monto)).join(' · ')+'</div>':'')+(o.fact?'<div>'+h(prFact(o.fact))+'</div>':(prLetra(ar.cond)?'<div>Factura a emitir: tipo '+prLetra(ar.cond)+' (sugerido)</div>':''))+prHr+prPie(1)];
 return ['a4',prEmisor()+prX('Comprobante interno',otNum(o),ar.cond)+
  '<p>Fecha: '+fdate(o.entregada||TODAY())+' · Cliente: <b>'+h(c.n||'')+'</b> · '+h(c.tel||'')+'<br>Condición frente a ARCA: <b>'+h(arcaLine(ar))+'</b>'+(typeof cliDom==='function'&&cliDom(c)?' · Domicilio: '+h(cliDom(c)):'')+'<br>Vehículo: <b>'+h((v.marca||'')+' '+(v.mod||''))+'</b> · Patente <b>'+h(v.pat||'')+'</b> · '+h(o.km||'')+' km</p>'+
  '<table><thead><tr><th>Detalle</th><th class="n">Cant.</th><th class="n">P. unit.</th><th class="n">IVA</th><th class="n">Importe</th></tr></thead><tbody>'+it.map(i=>'<tr><td>'+h(i.desc)+'</td><td class="n">'+i.qty+'</td><td class="n">'+fmt(i.pu)+'</td><td class="n">'+(o.sinIva?'—':i.iva+' %')+'</td><td class="n">'+fmt(lnNet(i))+'</td></tr>').join('')+'</tbody></table>'+
  '<p style="text-align:right">'+(t.desc>0?'Descuento −'+fmt(t.desc)+' · ':'')+'Neto '+fmt(t.neto)+' · '+(o.sinIva?'Sin IVA':'IVA '+fmt(t.iva))+' · <b style="font-size:12pt">Total '+fmt(t.total)+'</b>'+(t.pagado?'<br>Pagado '+fmt(t.pagado)+' · Saldo '+fmt(Math.max(0,t.saldo)):'')+'</p>'+
  (o.fact?'<p><b>'+h(prFact(o.fact))+'</b></p>':'')+prPie()]}
function prRecibo(src,monto,medio,fecha,concepto,num){const k=prK(),tk=k!=='a4';const txt=prLetras(monto);
 const body='<p>Recibimos de <b>'+h(src.n||'Consumidor final')+'</b>'+(src.doc?' ('+h(src.doc)+')':'')+' la suma de <b>'+fmt(monto)+'</b> ('+h(txt)+') en concepto de '+h(concepto)+'.</p><p>Medio de pago: <b>'+h(medio||'—')+'</b> · Fecha: '+fdate(fecha||TODAY())+'</p>';
 if(tk)return [k,prEmisor(1)+prHr+'<div style="text-align:center;font-weight:700">RECIBO '+h(num)+'</div><div style="text-align:center;font-size:.9em">Documento no válido como factura</div>'+prHr+body+'<p style="margin-top:16px">Firma: ________________</p>'+prPie(1)];
 return ['a4',prEmisor()+prX('Recibo',num,'')+body+'<p style="margin-top:40px">Firma y aclaración: ______________________________</p>'+prPie()]}
function prEntrega(o){const {v,c,t}=prOtCtx(o);const G=(DB.garantias||[]).filter(g=>g.otId===o.id);
 return ['a4',prEmisor()+'<h2 style="margin:4px 0">CONSTANCIA DE ENTREGA Y GARANTÍA · '+otNum(o)+'</h2><p>Fecha de entrega: <b>'+fdate(o.entregada||TODAY())+'</b>'+(o.entregadaPor?' · Entregó: '+h(o.entregadaPor):'')+'<br>Cliente: <b>'+h(c.n||'')+'</b> · '+h(c.tel||'')+'<br>Vehículo: <b>'+h((v.marca||'')+' '+(v.mod||''))+'</b> · Patente <b>'+h(v.pat||'')+'</b> · Kilometraje de entrega: <b>'+h(o.km||v.km||'')+'</b> km</p>'+
  '<h3 style="margin:8px 0 2px">Trabajos realizados y repuestos colocados</h3><table><thead><tr><th>Detalle</th><th class="n">Cant.</th></tr></thead><tbody>'+(o.items||[]).map(i=>'<tr><td>'+h(i.desc)+'</td><td class="n">'+i.qty+'</td></tr>').join('')+'</tbody></table>'+
  '<h3 style="margin:8px 0 2px">Garantía</h3>'+(G.length?'<table><thead><tr><th>Trabajo / equipo</th><th>N.º de serie</th><th>Desde</th><th>Hasta</th></tr></thead><tbody>'+G.map(g=>'<tr><td>'+h(g.desc)+'</td><td>'+h(g.serie||'—')+'</td><td>'+fdate(g.desde)+'</td><td><b>'+fdate(g.hasta)+'</b></td></tr>').join('')+'</tbody></table>':'<p>Según lo acordado con el taller para cada trabajo.</p>')+'<p style="font-size:9pt">'+h(prCfg().gar)+'</p>'+
  (v.proxKm||v.proxFecha?'<p>Próximo service sugerido: <b>'+(v.proxKm?v.proxKm.toLocaleString('es-AR')+' km':'')+(v.proxKm&&v.proxFecha?' o el ':'')+(v.proxFecha?fdate(v.proxFecha):'')+'</b> (lo que ocurra primero).</p>':'')+
  '<p>El cliente recibe el vehículo en las condiciones descriptas y deja constancia de su conformidad.</p><p style="margin-top:42px">Firma del cliente: ______________________ &nbsp; Aclaración: ______________________ &nbsp; Firma del taller: ______________________</p>'+prPie()]}
function prEtiq(v){const c=DB.cfg,o=cliOf(v.cliId)||{};const box='<div style="width:95mm;height:58mm;border:1.5px solid #000;border-radius:3mm;padding:3mm 4mm;box-sizing:border-box;font:9pt/1.25 Arial,Helvetica,sans-serif;color:#000;display:flex;flex-direction:column;gap:1.5mm">'+
  '<div style="display:flex;gap:3mm;align-items:center"><img src="'+LOGO+'" alt="" style="width:13mm"><div><b style="font-size:10.5pt">'+h(c.nombre)+'</b><br>Tel. '+h(c.tel)+'</div></div>'+
  '<div style="text-align:center;font-weight:800;font-size:12pt;border-top:1px solid #000;border-bottom:1px solid #000;padding:1mm 0">PRÓXIMO SERVICE</div>'+
  '<div style="display:flex;justify-content:space-between;font-size:11pt"><span>a los <b>'+(v.proxKm?v.proxKm.toLocaleString('es-AR'):'________')+'</b> km</span><span>o el <b>'+(v.proxFecha?fdate(v.proxFecha):'___/___/____')+'</b></span></div>'+
  '<div style="font-size:8.5pt">Patente <b>'+h(v.pat)+'</b> · Último service: '+fdate(TODAY())+' a los '+(v.km?v.km.toLocaleString('es-AR'):'____')+' km</div><div style="font-size:8pt">'+h(o.n||'')+'</div></div>';
 return ['lbl',box]}

/* ---------- venta de mostrador ---------- */
const vtNum=v=>'VT-'+String(v.num).padStart(4,'0');
function prVenta(v){const k=prK(),tk=k!=='a4',L=v.lines||[],ar=v.arca||{cond:'CF',doc:''};const ln=l=>typeof lnNet==='function'?lnNet(l):l.qty*l.pu;
 if(tk)return [k,prEmisor(1)+prHr+'<div style="text-align:center;font-weight:700">TICKET · COMPROBANTE INTERNO X</div><div style="text-align:center">'+vtNum(v)+' · '+fdate(v.fecha)+(v.t?' '+new Date(v.t).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}):'')+'</div><div style="text-align:center;font-size:.9em">Documento no válido como factura</div>'+prHr+
  '<div>'+h(v.cliN||'Consumidor final')+'</div><div>'+h(arcaLine(ar))+'</div>'+prHr+'<table>'+L.map(l=>'<tr><td colspan="2">'+h(l.desc)+'</td></tr><tr><td>'+l.qty+' × '+fmt(l.pu)+'</td><td style="text-align:right">'+fmt(ln(l))+'</td></tr>').join('')+'</table>'+prHr+
  '<table>'+(v.sinIva?'':'<tr><td>Neto</td><td style="text-align:right">'+fmt(v.neto)+'</td></tr><tr><td>IVA</td><td style="text-align:right">'+fmt(v.iva)+'</td></tr>')+'<tr><td><b>TOTAL</b></td><td style="text-align:right"><b>'+fmt(v.total)+'</b></td></tr><tr><td>'+h(v.medio)+'</td><td></td></tr></table>'+
  (v.fact?'<div>'+h(prFact(v.fact))+'</div>':(prLetra(ar.cond)?'<div>Factura a emitir: tipo '+prLetra(ar.cond)+' (sugerido)</div>':''))+'<div>Atendió: '+h(v.u||'')+'</div>'+prHr+prPie(1)];
 return ['a4',prEmisor()+prX('Venta',vtNum(v),ar.cond)+'<p>Fecha: '+fdate(v.fecha)+' · Cliente: <b>'+h(v.cliN||'Consumidor final')+'</b> · '+h(arcaLine(ar))+' · Atendió: '+h(v.u||'')+'</p><table><thead><tr><th>Detalle</th><th class="n">Cant.</th><th class="n">P. unit.</th><th class="n">Importe</th></tr></thead><tbody>'+L.map(l=>'<tr><td>'+h(l.desc)+'</td><td class="n">'+l.qty+'</td><td class="n">'+fmt(l.pu)+'</td><td class="n">'+fmt(ln(l))+'</td></tr>').join('')+'</tbody></table>'+
  '<p style="text-align:right">'+(v.sinIva?'Sin IVA':'Neto '+fmt(v.neto)+' · IVA '+fmt(v.iva))+' · <b style="font-size:12pt">Total '+fmt(v.total)+'</b><br>Medio de pago: '+h(v.medio)+'</p>'+(v.fact?'<p><b>'+h(prFact(v.fact))+'</b></p>':'')+prPie()]}

/* ---------- cliente, compras y taller ---------- */
function prCuenta(c){const O=DB.ots.filter(o=>o.cliId===c.id).sort((a,b)=>String(b.fecha).localeCompare(String(a.fecha)));const V=(DB.ventas||[]).filter(v=>v.cliId===c.id);
 let deu=0;const rows=O.map(o=>{const t=otTotal(o);const s=Math.max(0,t.saldo);deu+=s;return '<tr><td>'+fdate(o.fecha)+'</td><td>'+otNum(o)+'</td><td>'+h((vehOf(o.vehId)||{}).pat||'')+'</td><td>'+h(o.estado)+'</td><td class="n">'+fmt(t.total)+'</td><td class="n">'+fmt(t.pagado)+'</td><td class="n">'+(s>0.004?'<b>'+fmt(s)+'</b>':'—')+'</td></tr>'}).join('');
 const cc=+c.saldo||0;
 return ['a4',prEmisor()+'<h2 style="margin:4px 0">ESTADO DE CUENTA</h2><p>Cliente: <b>'+h(c.n)+'</b> · '+h(c.tel||'')+(c.mail?' · '+h(c.mail):'')+'<br>Condición frente a ARCA: '+h(arcaLine({cond:c.cond||'CF',doc:c.doc||''}))+'<br>Emitido el '+fdate(TODAY())+'</p>'+
  '<h3 style="margin:8px 0 2px">Órdenes de trabajo</h3>'+(O.length?'<table><thead><tr><th>Fecha</th><th>Orden</th><th>Patente</th><th>Estado</th><th class="n">Total</th><th class="n">Pagado</th><th class="n">Saldo</th></tr></thead><tbody>'+rows+'</tbody></table>':'<p>Sin órdenes.</p>')+
  (V.length?'<h3 style="margin:8px 0 2px">Compras en mostrador</h3><table><thead><tr><th>Fecha</th><th>Venta</th><th>Medio</th><th class="n">Total</th></tr></thead><tbody>'+V.map(v=>'<tr><td>'+fdate(v.fecha)+'</td><td>'+vtNum(v)+'</td><td>'+h(v.medio)+'</td><td class="n">'+fmt(v.total)+'</td></tr>').join('')+'</tbody></table>':'')+
  '<p style="text-align:right;font-size:12pt">Saldo de órdenes: <b>'+fmt(deu)+'</b>'+(c.cc||cc?'<br>Cuenta corriente: <b>'+fmt(cc)+'</b>':'')+'<br>Total adeudado: <b>'+fmt(deu+Math.max(0,cc))+'</b></p>'+prPie()]}
function prOC(oc){const p=provOf(oc.provId)||{};let tot=0;
 return ['a4',prEmisor()+'<h2 style="margin:4px 0">ORDEN DE COMPRA · OC-'+String(oc.num).padStart(4,'0')+'</h2><p>Fecha: '+fdate(oc.fecha)+' · Estado: '+h(oc.estado||'')+'<br>Proveedor: <b>'+h(p.n||'')+'</b>'+(p.cuit?' · CUIT '+h(p.cuit):'')+' · '+h(arcaTxt(oc.arca||p.cond||'RI'))+(p.tel?' · Tel. '+h(p.tel):'')+(p.mail?' · '+h(p.mail):'')+'</p>'+
  '<table><thead><tr><th>Código</th><th>Cód. proveedor</th><th>Descripción</th><th>Marca</th><th class="n">Cantidad</th><th class="n">Costo ref.</th><th class="n">Subtotal</th></tr></thead><tbody>'+(oc.lines||[]).map(l=>{const r=repOf(l.repId)||{};const s=(+l.qty||0)*(+l.costo||0);tot+=s;return '<tr><td>'+h(r.cod||'')+'</td><td>'+h(r.codProv||'')+'</td><td>'+h(r.desc||'')+'</td><td>'+h(r.marca||'')+'</td><td class="n"><b>'+l.qty+'</b></td><td class="n">'+(l.costo?fmt(l.costo):'—')+'</td><td class="n">'+(s?fmt(s):'—')+'</td></tr>'}).join('')+'</tbody></table>'+
  (tot?'<p style="text-align:right">Total de referencia (neto): <b>'+fmt(tot)+'</b></p>':'')+(oc.obs?'<p>Observaciones: '+h(oc.obs)+'</p>':'')+'<p>Por favor confirmar disponibilidad, precio final y plazo de entrega.</p><p style="margin-top:36px">Autorizó: ______________________</p>'+prPie()]}
function prRepos(pid){const p=provOf(pid)||{};const L=DB.repuestos.filter(r=>r.activo&&r.provId===pid&&(+r.qty||0)<=(+r.alarma||0));
 return ['a4',prEmisor()+'<h2 style="margin:4px 0">PEDIDO DE REPOSICIÓN</h2><p>Proveedor: <b>'+h(p.n||'')+'</b>'+(p.tel?' · Tel. '+h(p.tel):'')+' · Fecha: '+fdate(TODAY())+'</p>'+
  (L.length?'<table><thead><tr><th>Código</th><th>Cód. proveedor</th><th>Descripción</th><th>Marca</th><th class="n">Stock</th><th class="n">Pedir</th></tr></thead><tbody>'+L.map(r=>'<tr><td>'+h(r.cod)+'</td><td>'+h(r.codProv||'')+'</td><td>'+h(r.desc)+'</td><td>'+h(r.marca||'')+'</td><td class="n">'+r.qty+'</td><td class="n"><b>'+((+r.repos||0)>0?r.repos:Math.max(1,(+r.alarma||0)*2-(+r.qty||0)))+'</b></td></tr>').join('')+Array(4).fill('<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>').join('')+'</tbody></table>':'<p>No hay repuestos de este proveedor por debajo del stock mínimo.</p>')+prPie()]}
function prAgenda(f){const T=DB.turnos.filter(t=>t.fecha===f&&t.estado!=='Cancelado').sort((a,b)=>a.hora-b.hora);const O=DB.ots.filter(o=>o.estado!=='Entregado');
 const TA=(DB.tareas||[]).filter(t=>t.est!=='Hecha'&&t.venc&&t.venc<=f);
 return ['a4',prEmisor()+'<h2 style="margin:4px 0">AGENDA DEL TALLER · '+fdate(f)+'</h2>'+
  '<h3 style="margin:8px 0 2px">Turnos ('+T.length+')</h3>'+(T.length?'<table><thead><tr><th>Hora</th><th>Puesto</th><th>Cliente</th><th>Teléfono</th><th>Vehículo</th><th>Servicio</th><th>Estado</th><th>✓</th></tr></thead><tbody>'+T.map(t=>{const c=cliOf(t.cliId)||{},v=vehOf(t.vehId)||{};return '<tr><td>'+String(t.hora).padStart(2,'0')+':00</td><td>'+h(RECURSOS[t.rec]||'')+'</td><td>'+h(c.n||'')+'</td><td>'+h(c.tel||'')+'</td><td>'+h(v.pat||'')+' '+h(v.marca||'')+'</td><td>'+h(t.srv)+'</td><td>'+h(t.estado)+'</td><td style="width:8mm"></td></tr>'}).join('')+'</tbody></table>':'<p>Sin turnos.</p>')+
  '<h3 style="margin:8px 0 2px">Vehículos en el taller ('+O.length+')</h3>'+(O.length?'<table><thead><tr><th>Orden</th><th>Vehículo</th><th>Mecánico</th><th>Estado</th><th>Motivo</th><th>Notas</th></tr></thead><tbody>'+O.map(o=>{const v=vehOf(o.vehId)||{};return '<tr><td>'+otNum(o)+'</td><td>'+h(v.pat||'')+' '+h((v.marca||'')+' '+(v.mod||''))+'</td><td>'+h((userOf(o.mecId)||{n:'—'}).n)+'</td><td>'+h(o.estado)+'</td><td>'+h(o.motivo||'')+'</td><td style="width:35mm"></td></tr>'}).join('')+'</tbody></table>':'<p>No hay vehículos en el taller.</p>')+
  (TA.length?'<h3 style="margin:8px 0 2px">Tareas pendientes</h3><table><thead><tr><th>Responsable</th><th>Tarea</th><th>Vence</th><th>Prioridad</th><th>✓</th></tr></thead><tbody>'+TA.sort((a,b)=>String((userOf(a.uid)||{}).n).localeCompare(String((userOf(b.uid)||{}).n))).map(t=>'<tr><td>'+h((userOf(t.uid)||{n:''}).n)+'</td><td>'+h(t.t)+'</td><td>'+fdate(t.venc)+'</td><td>'+h(t.prio||'')+'</td><td style="width:8mm"></td></tr>').join('')+'</tbody></table>':'')+prPie()]}
function prPrecios(){const A=(typeof AREAS!=='undefined'?AREAS:[]).slice();const S=DB.servicios.filter(s=>s.pu>0&&s.pub!==false);const ids=A.map(a=>a[0]);A.push(['__otros',A.length?'Otros servicios':'Servicios','']);
 const grp=a=>S.filter(s=>a[0]==='__otros'?ids.indexOf(s.area)<0:s.area===a[0]);
 return ['a4',prEmisor()+'<h2 style="margin:4px 0">LISTA DE PRECIOS · MANO DE OBRA</h2><p style="font-size:9pt">Precios finales con IVA al '+fdate(TODAY())+'. De referencia: el valor final depende del vehículo y se confirma en el presupuesto.</p>'+
  A.map(a=>{const L=grp(a);return L.length?'<h3 style="margin:8px 0 2px">'+h(a[2]||'')+' '+h(a[1])+'</h3><table><tbody>'+L.map(s=>'<tr><td>'+h(s.n)+'</td><td class="n" style="width:35mm">'+(s.desde?'desde ':'')+fmt(precioFinalPr(s.pu))+'</td></tr>').join('')+'</tbody></table>':''}).join('')+prPie()]}
const precioFinalPr=n=>typeof precioFinal==='function'?precioFinal(n,21):r2(n*1.21);
function prQR(){if(typeof qrcode!=='function'||typeof menuURL!=='function')return null;const u=menuURL();const q=qrcode(0,'M');q.addData(u);q.make();
 const svg=q.createSvgTag({cellSize:8,margin:2,scalable:true});const c=DB.cfg,M=c.menu||{};
 return ['a4','<div style="text-align:center;font-family:Arial,Helvetica,sans-serif;color:#000;padding-top:6mm"><img src="'+LOGO+'" alt="" style="width:38mm"><div style="font-size:26pt;font-weight:800;margin:4mm 0 1mm">'+h(c.nombre)+'</div><div style="font-size:15pt">'+h(M.bienvenida||'')+'</div>'+
  '<div style="width:115mm;margin:8mm auto 4mm">'+svg.replace('<svg ','<svg style="width:100%;height:auto" ')+'</div><div style="font-size:20pt;font-weight:800">Escaneá y mirá precios, productos y turnos</div><div style="font-size:13pt;margin-top:3mm">Pedidos y consultas por WhatsApp: '+h(c.tel)+'</div><div style="font-size:10pt;margin-top:4mm;word-break:break-all">'+h(u)+'</div>'+
  '<div style="font-size:9pt;margin-top:10mm">'+h(c.dir)+(M.horario?' · '+h(M.horario):'')+'</div></div>']}

/* ---------- acciones ---------- */
const prGo=r=>{if(r)prPrint(r[1],r[0])};
const prOtGet=id=>{const o=otOf(id);if(!o||(typeof otVisible==='function'&&!otVisible(o)))return null;return o};
ACT.prcomp=d=>{const o=prOtGet(d.id);if(!o||!canPrice())return;prGo(prOtComp(o))};
ACT.prentrega=d=>{const o=prOtGet(d.id);if(o)prGo(prEntrega(o))};
ACT.prrecot=d=>{const o=prOtGet(d.id);if(!o||!canPrice())return;const c=cliOf(o.cliId)||{};const P=o.pagos||[];const i=d.i===undefined||d.i===''?P.length-1:+d.i;const p=P[i];if(!p){toast('Esta orden todavía no tiene cobros.',1);return}
 prGo(prRecibo({n:c.n,doc:c.doc},p.monto,p.medio,p.fecha,'pago de la '+otNum(o)+' ('+((vehOf(o.vehId)||{}).pat||'')+')',otNum(o)+'-'+(i+1)))};
ACT.pretiq=d=>{const v=d.v?vehOf(d.v):(prOtGet(d.id)?vehOf(otOf(d.id).vehId):null);if(!v){toast('Elegí un vehículo.',1);return}prGo(prEtiq(v))};
ACT.prvt=d=>{const v=(DB.ventas||[]).find(x=>String(x.num)===String(+d.n)||x.id===d.id);if(v)prGo(prVenta(v))};
ACT.prrecvt=d=>{const v=(DB.ventas||[]).find(x=>x.id===d.id);if(v)prGo(prRecibo({n:v.cliN,doc:(v.arca||{}).doc},v.total,v.medio,v.fecha,'compra en mostrador '+vtNum(v),vtNum(v)))};
ACT.prcta=d=>{const c=cliOf(d.id);if(!c){toast('Elegí un cliente.',1);return}prGo(prCuenta(c))};
ACT.proc=d=>{const o=(DB.ocs||[]).find(x=>x.id===d.id||String(x.num)===String(+d.n));if(o)prGo(prOC(o))};
ACT.prrepos=d=>{if(!d.id){toast('Elegí un proveedor.',1);return}prGo(prRepos(d.id))};
ACT.pragenda=d=>prGo(prAgenda(d.f||TODAY()));
ACT.prprecios=()=>prGo(prPrecios());
ACT.prqr=()=>{const r=prQR();if(!r){toast('El cartel con QR necesita el módulo Menú digital.',1);return}prGo(r)};
ACT.prfmt=d=>{prCfg().fmt=d.v;save();renderView()};
/* registro a mano de la factura emitida en ARCA (no se emite nada desde el sistema) */
ACT.prfact=d=>{if(!canPrice())return;const x=d.k==='vt'?(DB.ventas||[]).find(v=>v.id===d.id):otOf(d.id);if(!x)return;const f=x.fact||{};const rec=d.k==='vt'?((x.arca||{}).cond||'CF'):prOtCtx(x).ar.cond;const sug=prLetra(rec)||'B';
 modal({title:'Registrar la factura emitida en ARCA',ok:'Guardar',body:'<p class="sm mut">Primero emitís la factura en la web de ARCA o en tu facturador. Después cargás acá sus datos para tenerla vinculada a '+(d.k==='vt'?vtNum(x):otNum(x))+'. El sistema no emite facturas ni pide CAE.</p>'+
  '<div class="g2"><div class="f"><label for="pf_t">Tipo</label><select id="pf_t">'+['A','B','C','E','M'].map(t=>'<option'+((f.tipo||sug)===t?' selected':'')+'>'+t+'</option>').join('')+'</select><span class="sm mut">Sugerido: '+sug+' [VERIFICAR con el contador]</span></div><div class="f"><label for="pf_f">Fecha</label><input id="pf_f" type="date" value="'+h(f.fecha||TODAY())+'"></div>'+
  '<div class="f"><label for="pf_p">Punto de venta</label><input id="pf_p" inputmode="numeric" maxlength="5" value="'+h(f.pv||'')+'" placeholder="Ej.: 2"></div><div class="f"><label for="pf_n">Número</label><input id="pf_n" inputmode="numeric" maxlength="8" value="'+h(f.num||'')+'" placeholder="Ej.: 154"></div></div>'+
  '<div class="f"><label for="pf_c">CAE (opcional, 14 números)</label><input id="pf_c" inputmode="numeric" maxlength="14" value="'+h(f.cae||'')+'"></div>'+(x.fact?'<button class="btn d s" type="button" data-act="prfactdel" data-k="'+d.k+'" data-id="'+d.id+'">Quitar el registro</button>':''),
  onOk:()=>{const pv=parseInt(val('pf_p')),n=parseInt(val('pf_n')),cae=val('pf_c').replace(/\D/g,'');if(!(pv>=1&&pv<=99999)){merr('Punto de venta: un número de 1 a 99999.');return false}if(!(n>=1&&n<=99999999)){merr('Número de factura: de 1 a 99999999.');return false}if(cae&&cae.length!==14){merr('El CAE tiene 14 números (o dejalo vacío).');return false}
   x.fact={tipo:val('pf_t'),pv,num:n,fecha:val('pf_f'),cae,u:ME.n};audit('Factura ARCA registrada',(d.k==='vt'?vtNum(x):otNum(x))+' · '+prFact(x.fact));save();renderView();toast('Factura registrada');return true}})};
ACT.prfactdel=d=>{const x=d.k==='vt'?(DB.ventas||[]).find(v=>v.id===d.id):otOf(d.id);if(!x)return;delete x.fact;audit('Registro de factura quitado',d.k==='vt'?vtNum(x):otNum(x));save();closeModal();renderView();toast('Registro quitado')};
/* menú de impresión de una orden */
ACT.prot=d=>{const o=prOtGet(d.id);if(!o)return;const pr=canPrice();const P=o.pagos||[];const b=(a,t,x)=>'<button class="btn" data-act="'+a+'" data-id="'+o.id+'"'+(x||'')+'>'+t+'</button>';
 modal({title:'Imprimir · '+otNum(o),hideOk:true,cancel:'Cerrar',wide:true,foot:'<button class="btn" data-act="otopen" data-id="'+o.id+'">← Volver a la orden</button>',body:'<p class="sm mut">Formato: <b>'+({a4:'Hoja A4',80:'Ticket 80 mm',58:'Ticket 58 mm'}[prCfg().fmt])+'</b> (para tickets y comprobantes). Se cambia en Impresiones.</p><div class="prbtns">'+
  (pr?'<button class="btn" data-act="otprint" data-id="'+o.id+'" data-p="pres">📝 Presupuesto</button>':'')+'<button class="btn" data-act="otprint" data-id="'+o.id+'" data-p="ot">🔧 Orden de trabajo</button>'+
  (pr?b('prcomp','🧾 Comprobante interno'):'')+b('prentrega','✅ Constancia de entrega y garantía')+b('pretiq','🏷️ Etiqueta de próximo service')+'</div>'+
  (pr&&P.length?'<h3 style="margin:12px 0 6px">Recibos</h3><div class="prbtns">'+P.map((p,i)=>'<button class="btn s" data-act="prrecot" data-id="'+o.id+'" data-i="'+i+'">💵 '+fdate(p.fecha)+' · '+h(p.medio)+' · '+fmt(p.monto)+'</button>').join('')+'</div>':'')+
  (pr?'<h3 style="margin:12px 0 6px">Factura</h3><p class="sm">'+(o.fact?'Registrada: <b>'+h(prFact(o.fact))+'</b>':'Sin factura registrada.')+'</p><button class="btn s" data-act="prfact" data-k="ot" data-id="'+o.id+'">'+(o.fact?'Editar registro':'Registrar factura emitida en ARCA')+'</button>':'')}) };

/* ---------- pantalla Impresiones ---------- */
NAV.push(['imprimir','🖨️','Impresiones']);
['jefe','recepcion'].forEach(r=>{if(PERM[r]&&PERM[r]!=='*'&&PERM[r].indexOf('imprimir')<0)PERM[r].push('imprimir')});
if(typeof UXSEC!=='undefined'){const s=UXSEC.find(x=>x[0]==='op');if(s&&s[2].indexOf('imprimir')<0)s[2].push('imprimir')}
if(typeof UX_DESC!=='undefined')UX_DESC.imprimir='Comprobantes, recibos, constancias, etiquetas, órdenes de compra y papeles del taller. Elegí el formato (A4 o ticket) y qué imprimir.';
if(typeof UXKW!=='undefined')UXKW.imprimir='imprimir impresion ticket recibo comprobante factura etiqueta service constancia entrega garantia estado de cuenta orden de compra agenda qr cartel pdf';
UI.pr=UI.pr||{ot:'',vt:'',cli:'',veh:'',oc:'',prov:'',f:''};
CHG.prsel=t=>{UI.pr[t.dataset.k]=t.value;renderView()};
V.imprimir=()=>{const P=prCfg(),S=UI.pr,pr=canPrice();const sel=(k,L,ph)=>'<select data-chg="prsel" data-k="'+k+'" aria-label="'+h(ph)+'"><option value="">'+h(ph)+'</option>'+L.map(x=>'<option value="'+h(x[0])+'"'+(S[k]===x[0]?' selected':'')+'>'+h(x[1])+'</option>').join('')+'</select>';
 const OT=DB.ots.filter(o=>typeof otVisible!=='function'||otVisible(o)).slice().sort((a,b)=>b.num-a.num).slice(0,120);if(!S.ot&&OT[0])S.ot=OT[0].id;const o=S.ot&&otOf(S.ot);
 const VT=(DB.ventas||[]).slice(0,120);if(!S.vt&&VT[0])S.vt=VT[0].id;const vt=VT.find(v=>v.id===S.vt);
 const fis=prFiscOk();const b=(a,t,at,dis)=>'<button class="btn s"'+(dis?' disabled':'')+' data-act="'+a+'"'+(at||'')+'>'+t+'</button>';
 return '<div class="bar"><h2>Impresiones</h2></div>'+
 '<div class="card"><div class="prvt"><b>Formato para tickets y comprobantes:</b><div class="chips prfmt">'+[['a4','📄 Hoja A4'],['80','🧾 Ticket 80 mm'],['58','🧾 Ticket 58 mm']].map(f=>'<button class="chip'+(P.fmt===f[0]?' on':'')+'" data-act="prfmt" data-v="'+f[0]+'">'+f[1]+'</button>').join('')+'</div></div>'+
 '<p class="sm mut" style="margin:0">Se imprime con la impresora del equipo; para guardar un PDF elegí “Guardar como PDF” en la ventana de impresión. Estos papeles <b>no son facturas</b>: la factura se emite en ARCA y acá se registra su número.'+(fis?'':' <b>Faltan los datos fiscales del negocio</b> (CUIT y condición) para que salgan en los papeles'+(ME.rol==='dueno'?': <a href="#" data-act="cfgo" data-t="imp" data-f="pf_cuit">completarlos</a>':'')+'.')+'</p></div>'+
 '<h3 style="margin:14px 0 8px">Para el cliente</h3><div class="prgrid">'+
 '<div class="card"><h3>🔧 Orden de trabajo</h3>'+sel('ot',OT.map(x=>[x.id,otNum(x)+' · '+((vehOf(x.vehId)||{}).pat||'')+' · '+((cliOf(x.cliId)||{}).n||'')+' · '+x.estado]),'Elegir orden')+'<div class="prbtns">'+
  (o?(pr?'<button class="btn s" data-act="otprint" data-id="'+o.id+'" data-p="pres">📝 Presupuesto</button>':'')+'<button class="btn s" data-act="otprint" data-id="'+o.id+'" data-p="ot">🔧 Orden</button>'+(pr?b('prcomp','🧾 Comprobante',' data-id="'+o.id+'"')+b('prrecot','💵 Recibo del último cobro',' data-id="'+o.id+'"',!(o.pagos||[]).length):'')+b('prentrega','✅ Entrega y garantía',' data-id="'+o.id+'"')+b('pretiq','🏷️ Etiqueta de service',' data-id="'+o.id+'"')+(pr?b('prfact',o.fact?'🧾 Factura: '+h(prFact(o.fact)):'Registrar factura ARCA',' data-k="ot" data-id="'+o.id+'"'):''):'<span class="sm mut">No hay órdenes.</span>')+'</div></div>'+
 (can('ventas')?'<div class="card"><h3>🛒 Venta de mostrador</h3>'+sel('vt',VT.map(v=>[v.id,vtNum(v)+' · '+fdate(v.fecha)+' · '+(v.cliN||'Consumidor final')+' · '+fmt(v.total)]),'Elegir venta')+'<div class="prbtns">'+(vt?b('prvt','🧾 Ticket',' data-id="'+vt.id+'"')+b('prrecvt','💵 Recibo',' data-id="'+vt.id+'"')+(pr?b('prfact',vt.fact?'🧾 Factura: '+h(prFact(vt.fact)):'Registrar factura ARCA',' data-k="vt" data-id="'+vt.id+'"'):''):'<span class="sm mut">Todavía no hay ventas.</span>')+'</div></div>':'')+
 '<div class="card"><h3>👤 Estado de cuenta</h3>'+sel('cli',DB.clientes.slice().sort((a,b)=>a.n.localeCompare(b.n)).map(c=>[c.id,c.n+(c.tel?' · '+c.tel:'')]),'Elegir cliente')+'<div class="prbtns">'+b('prcta','🖨 Imprimir estado de cuenta',' data-id="'+h(S.cli)+'"',!S.cli)+'</div></div>'+
 '<div class="card"><h3>🏷️ Etiqueta de próximo service</h3><span class="sm mut">Para pegar en el parabrisas o en el vano motor (10 × 6 cm).</span>'+sel('veh',DB.vehs.slice().sort((a,b)=>String(a.pat).localeCompare(String(b.pat))).map(v=>[v.id,v.pat+' · '+v.marca+' '+v.mod]),'Elegir vehículo')+'<div class="prbtns">'+b('pretiq','🖨 Imprimir etiqueta',' data-v="'+h(S.veh)+'"',!S.veh)+'</div></div></div>'+
 '<h3 style="margin:14px 0 8px">Para el taller</h3><div class="prgrid">'+
 '<div class="card"><h3>📅 Agenda del día</h3><span class="sm mut">Turnos, vehículos en el taller y tareas pendientes, con casillas para tildar.</span><input type="date" data-chg="prsel" data-k="f" value="'+h(S.f||TODAY())+'" aria-label="Fecha de la agenda"><div class="prbtns">'+b('pragenda','🖨 Imprimir agenda',' data-f="'+h(S.f||TODAY())+'"')+'</div></div>'+
 (can('compras')?'<div class="card"><h3>🚚 Compras</h3>'+sel('oc',(DB.ocs||[]).slice().sort((a,b)=>b.num-a.num).map(x=>[x.id,'OC-'+String(x.num).padStart(4,'0')+' · '+((provOf(x.provId)||{}).n||'')+' · '+(x.estado||'')]),'Elegir orden de compra')+'<div class="prbtns">'+b('proc','🖨 Orden de compra',' data-id="'+h(S.oc)+'"',!S.oc)+'</div>'+
  sel('prov',DB.provs.filter(p=>p.activo!==false).map(p=>[p.id,p.n+' · '+DB.repuestos.filter(r=>r.activo&&r.provId===p.id&&(+r.qty||0)<=(+r.alarma||0)).length+' para reponer']),'Elegir proveedor')+'<div class="prbtns">'+b('prrepos','🖨 Pedido de reposición',' data-id="'+h(S.prov)+'"',!S.prov)+'</div></div>':'')+
 '<div class="card"><h3>💲 Lista de precios</h3><span class="sm mut">Mano de obra con IVA, por área, para el mostrador.</span><div class="prbtns">'+b('prprecios','🖨 Imprimir lista')+'</div></div>'+
 (typeof menuURL==='function'&&modOn('webp')?'<div class="card"><h3>📱 Cartel con QR del menú</h3><span class="sm mut">Hoja A4 para el mostrador o la vidriera: al escanearlo se abre el menú digital.</span><div class="prbtns">'+b('prqr','🖨 Imprimir cartel')+'</div></div>':'')+'</div>'};

/* ---------- botones en las pantallas existentes ---------- */
{const _ob=otBody;otBody=o=>_ob(o).replace(/(<button class="btn" data-act="otprint" data-id="([^"]+)" data-p="ot">[^<]*<\/button>)/,'$1<button class="btn" data-act="prot" data-id="$2">🖨 Más impresiones…</button>')}
{const _vt=V.ventas;V.ventas=()=>{let s=_vt().replace(/<tr><td>VT-(\d+)<\/td>/g,'<tr><td><button class="btn s" data-act="prvt" data-n="$1" aria-label="Imprimir ticket VT-$1" title="Imprimir ticket">🖨</button> VT-$1</td>');
 const v=(DB.ventas||[])[0];if(v&&v.u===ME.n&&v.t&&Date.now()-v.t<10*60000){const ban='<div class="card prvt" style="border-left:4px solid #18794a"><b>✓ '+vtNum(v)+' cobrada · '+fmt(v.total)+'</b><span class="sp"></span><button class="btn p s" data-act="prvt" data-id="'+v.id+'">🧾 Imprimir ticket</button>'+(canPrice()?'<button class="btn s" data-act="prfact" data-k="vt" data-id="'+v.id+'">'+(v.fact?'Factura: '+h(prFact(v.fact)):'Registrar factura ARCA')+'</button>':'')+'</div>';
  const j=s.indexOf('</div>',s.indexOf('class="bar"'));s=j>0?s.slice(0,j+6)+ban+s.slice(j+6):ban+s}return s}}
{const _co=V.compras;V.compras=()=>_co().replace(/<tr><td>OC-(\d+)<\/td>/g,'<tr><td><button class="btn s" data-act="proc" data-n="$1" aria-label="Imprimir OC-$1" title="Imprimir orden de compra">🖨</button> OC-$1</td>')}
