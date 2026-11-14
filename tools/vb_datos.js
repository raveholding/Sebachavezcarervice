/* ===================================================================
   Sistema VB · Datos y respaldo: exportar, importar y migrar
   Respaldo completo (JSON) y cifrado (AES-256-GCM) · copias automáticas locales (IndexedDB)
   Exportación por tabla en CSV / Excel (.xlsx real) / JSON · Excel con todas las hojas
   Importación CSV / Excel / JSON con vista previa, validación, plantillas y copia previa
   Sin dependencias externas: funciona sin internet.
   =================================================================== */

/* ---------- utilidades de archivos ---------- */
function dlBlob(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800)}
/* CSV seguro: neutraliza celdas que una planilla interpretaría como fórmula (=, +, @, -texto, tab) */
const csvSafe=v=>{let c=String(v==null?'':v);if(/^[=+@\t\r]/.test(c)||/^-[^0-9.,]/.test(c))c="'"+c;return c};
csvDown=function(name,rows){const t=rows.map(r=>r.map(c=>{c=csvSafe(c);return /[;"\n\r]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(';')).join('\r\n');dlBlob(name,new Blob(['﻿'+t],{type:'text/csv;charset=utf-8'}))};
const numAR=v=>{let s=String(v==null?'':v).trim().replace(/[$\s]/g,'');if(!s)return NaN;if(s.includes(',')&&s.includes('.'))s=s.replace(/\./g,'').replace(',','.');else if(/^-?\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');else s=s.replace(',','.');const n=parseFloat(s);return isFinite(n)?n:NaN};
const b64e=u=>{let s='';for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s)};
const b64d=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));

/* ---------- ZIP (sin compresión) + XLSX real ---------- */
const CRCT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(u){let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRCT[(c^u[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
function zipStore(files){const enc=new TextEncoder();const parts=[],cent=[];let off=0;
 files.forEach(f=>{const nm=enc.encode(f.name),d=f.data,crc=crc32(d);
  const l=new DataView(new ArrayBuffer(30));l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x0800,true);l.setUint16(12,0x21,true);l.setUint32(14,crc,true);l.setUint32(18,d.length,true);l.setUint32(22,d.length,true);l.setUint16(26,nm.length,true);
  parts.push(new Uint8Array(l.buffer),nm,d);
  const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(14,0x21,true);c.setUint32(16,crc,true);c.setUint32(20,d.length,true);c.setUint32(24,d.length,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);
  cent.push(new Uint8Array(c.buffer),nm);off+=30+nm.length+d.length});
 const cs=cent.reduce((a,x)=>a+x.length,0);const e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cs,true);e.setUint32(16,off,true);
 return new Blob([...parts,...cent,new Uint8Array(e.buffer)])}
const xesc=s=>String(s).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const colL=i=>{let s='';i++;while(i){const m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26)}return s};
const colIdx=s=>{let n=0;for(const ch of String(s).toUpperCase())n=n*26+(ch.charCodeAt(0)-64);return n-1};
function sheetXML(rows){const w=[];rows.forEach(r=>r.forEach((v,i)=>{w[i]=Math.min(60,Math.max(w[i]||8,String(v==null?'':v).length+2))}));
 return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'+(w.length?'<cols>'+w.map((x,i)=>'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+x+'" customWidth="1"/>').join('')+'</cols>':'')+'<sheetData>'+
 rows.map((r,ri)=>'<row r="'+(ri+1)+'">'+r.map((v,ci)=>{const ref=colL(ci)+(ri+1),st=ri===0?' s="1"':'';if(v==null||v==='')return '';if(typeof v==='number'&&isFinite(v))return '<c r="'+ref+'"'+st+'><v>'+v+'</v></c>';if(typeof v==='boolean')return '<c r="'+ref+'" t="b"'+st+'><v>'+(v?1:0)+'</v></c>';return '<c r="'+ref+'" t="inlineStr"'+st+'><is><t xml:space="preserve">'+xesc(v)+'</t></is></c>'}).join('')+'</row>').join('')+'</sheetData></worksheet>'}
function xlsxBlob(sheets){const enc=new TextEncoder(),f=[],add=(n,t)=>f.push({name:n,data:enc.encode(t)}),X='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';const used={};
 const S=sheets.map((s,i)=>{let n=String(s.name||'Hoja'+(i+1)).replace(/[\[\]:*?\/\\]/g,' ').slice(0,31).trim()||'Hoja'+(i+1);while(used[n.toLowerCase()])n=n.slice(0,28)+' '+(i+1);used[n.toLowerCase()]=1;return {n,rows:s.rows}});
 add('[Content_Types].xml',X+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+S.map((s,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('')+'</Types>');
 add('_rels/.rels',X+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
 add('xl/workbook.xml',X+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+S.map((s,i)=>'<sheet name="'+xesc(s.n)+'" sheetId="'+(i+1)+'" r:id="rId'+(i+1)+'"/>').join('')+'</sheets></workbook>');
 add('xl/_rels/workbook.xml.rels',X+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+S.map((s,i)=>'<Relationship Id="rId'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join('')+'<Relationship Id="rId'+(S.length+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
 add('xl/styles.xml',X+'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8EEF6"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>');
 S.forEach((s,i)=>add('xl/worksheets/sheet'+(i+1)+'.xml',sheetXML(s.rows)));
 return new Blob([zipStore(f)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
/* lectura de .xlsx (Excel, LibreOffice, Google Sheets) */
async function unzipAll(buf){const u=new Uint8Array(buf),dv=new DataView(buf);let e=-1;for(let i=u.length-22;i>=Math.max(0,u.length-65557);i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break}}
 if(e<0)throw new Error('El archivo no es un Excel válido (.xlsx). Si es un .xls viejo, guardalo como .xlsx o CSV.');
 const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out={},dec=new TextDecoder();
 for(let k=0;k<n;k++){if(dv.getUint32(p,true)!==0x02014b50)break;const meth=dv.getUint16(p+10,true),cs=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
  const name=dec.decode(u.subarray(p+46,p+46+nl));const lnl=dv.getUint16(lo+26,true),lxl=dv.getUint16(lo+28,true);out[name]={meth,data:u.subarray(lo+30+lnl+lxl,lo+30+lnl+lxl+cs)};p+=46+nl+xl+cl}return out}
async function zText(z,name){const f=z[name];if(!f)return null;let d;if(f.meth===0)d=f.data;else if(f.meth===8){if(typeof DecompressionStream==='undefined')throw new Error('Este navegador no puede leer Excel comprimido: guardá el archivo como CSV.');d=new Uint8Array(await new Response(new Blob([f.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}else throw new Error('Formato de compresión no soportado.');return new TextDecoder().decode(d)}
async function readXlsx(buf){const z=await unzipAll(buf),P=s=>new DOMParser().parseFromString(s,'application/xml'),E=(n,t)=>[...n.getElementsByTagNameNS('*',t)];
 const wbx=await zText(z,'xl/workbook.xml');if(!wbx)throw new Error('El archivo no tiene hojas de Excel.');const wb=P(wbx);const rel={};const rx=await zText(z,'xl/_rels/workbook.xml.rels');if(rx)E(P(rx),'Relationship').forEach(r=>rel[r.getAttribute('Id')]=r.getAttribute('Target'));
 const sst=[];const ssx=await zText(z,'xl/sharedStrings.xml');if(ssx)E(P(ssx),'si').forEach(si=>sst.push(E(si,'t').map(t=>t.textContent).join('')));
 const res=[];for(const s of E(wb,'sheet')){const rid=s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id')||s.getAttribute('r:id');let tg=(rel[rid]||'').replace(/^\//,'');if(!tg.startsWith('xl/'))tg='xl/'+tg;const x=await zText(z,tg);if(!x)continue;const rows=[];
  E(P(x),'row').forEach(r=>{const ri=(parseInt(r.getAttribute('r'))||rows.length+1)-1;const row=[];E(r,'c').forEach(c=>{const ref=(c.getAttribute('r')||'').replace(/\d+/g,'');const ci=ref?colIdx(ref):row.length;const t=c.getAttribute('t');let v='';
   if(t==='inlineStr')v=E(c,'t').map(x=>x.textContent).join('');else{const ve=E(c,'v')[0];v=ve?ve.textContent:'';if(t==='s')v=sst[+v]||'';else if(t==='b')v=v==='1'?'SI':'NO'}row[ci]=v});rows[ri]=row});
  res.push({name:s.getAttribute('name'),rows:Array.from(rows,r=>r?Array.from(r,x=>x==null?'':x):[]).filter(r=>r.some(x=>String(x).trim()!==''))})}return res}
/* lee CSV / Excel / JSON y devuelve [{name, rows}] */
async function readTabla(file){const n=file.name.toLowerCase();if(file.size>20*1024*1024)throw new Error('El archivo es muy grande (máximo 20 MB).');
 if(n.endsWith('.xlsx')||n.endsWith('.xlsm'))return readXlsx(await file.arrayBuffer());
 if(n.endsWith('.xls'))throw new Error('Los .xls viejos no se pueden leer: abrilo en Excel y guardalo como .xlsx o CSV.');
 const t=await file.text();if(n.endsWith('.json')){const o=JSON.parse(t);const a=Array.isArray(o)?o:Array.isArray(o.rows)?o.rows:null;if(!a||!a.length)throw new Error('El JSON debe ser una lista de registros.');const hd=[...new Set(a.flatMap(x=>Object.keys(x)))];return [{name:'json',rows:[hd].concat(a.map(x=>hd.map(k=>x[k]==null?'':x[k])))}]}
 return [{name:'csv',rows:parseCSV(t)}]}

/* ---------- respaldo cifrado (AES-256-GCM, clave derivada con PBKDF2) ---------- */
async function vbKey(pass,salt,it){const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:it,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function cifrar(txt,pass){if(!window.crypto||!crypto.subtle)throw new Error('Este navegador no permite cifrar aquí. Usá el respaldo JSON.');const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),it=310000;
 const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},await vbKey(pass,salt,it),new TextEncoder().encode(txt));return JSON.stringify({fmt:'vb-respaldo-cifrado',v:1,alg:'AES-256-GCM',kdf:'PBKDF2-SHA256',it,salt:b64e(salt),iv:b64e(iv),data:b64e(new Uint8Array(ct))})}
async function descifrar(o,pass){try{const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64d(o.iv)},await vbKey(pass,b64d(o.salt),o.it||310000),b64d(o.data));return new TextDecoder().decode(pt)}catch(e){throw new Error('Clave incorrecta o archivo dañado.')}}

/* ---------- copias automáticas locales (IndexedDB, aparte del almacenamiento principal) ---------- */
const SNAPDB='vb_copias';
function snapOpen(){return new Promise((ok,ko)=>{if(!window.indexedDB)return ko(new Error('sin IndexedDB'));const r=indexedDB.open(SNAPDB,1);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('snap')){const s=d.createObjectStore('snap',{keyPath:'id'});s.createIndex('ls','ls')}};r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)})}
async function snapList(){try{const d=await snapOpen();return await new Promise(ok=>{const q=d.transaction('snap').objectStore('snap').index('ls').getAll(LS);q.onsuccess=()=>ok((q.result||[]).sort((a,b)=>b.t-a.t).map(x=>({id:x.id,t:x.t,motivo:x.motivo,kb:x.kb})));q.onerror=()=>ok([])})}catch(e){return[]}}
async function snapSave(motivo){try{const d=await snapOpen();const txt=JSON.stringify(DB);const rec={id:LS+'_'+Date.now(),ls:LS,t:Date.now(),motivo,kb:Math.round(txt.length/1024),data:txt};
 await new Promise((ok,ko)=>{const tx=d.transaction('snap','readwrite');tx.objectStore('snap').put(rec);tx.oncomplete=ok;tx.onerror=()=>ko(tx.error)});
 const L=await snapList();if(L.length>10){const tx=d.transaction('snap','readwrite');L.slice(10).forEach(x=>tx.objectStore('snap').delete(x.id))}DB.cfg.lastSnap=Date.now();save();return true}catch(e){console.warn('copia local',e);return false}}
async function snapGet(id){const d=await snapOpen();return new Promise((ok,ko)=>{const q=d.transaction('snap').objectStore('snap').get(id);q.onsuccess=()=>ok(q.result);q.onerror=()=>ko(q.error)})}
async function snapDel(id){const d=await snapOpen();return new Promise(ok=>{const tx=d.transaction('snap','readwrite');tx.objectStore('snap').delete(id);tx.oncomplete=ok})}
/* una copia por día, al entrar */
let SNAPCHK=false;function snapDiaria(){if(SNAPCHK||!ME)return;SNAPCHK=true;const l=DB.cfg.lastSnap;if(!l||new Date(l).toISOString().slice(0,10)!==TODAY())snapSave('Copia automática diaria')}

/* ---------- tablas exportables ---------- */
const sinoX=b=>b?'SI':'NO';
const DSETS={
 clientes:['Clientes',()=>[['nombre','telefono','correo','domicilio','localidad','provincia','condicion_arca','cuit_dni','cuenta_corriente','limite','saldo','socio_club','n_socio','puntos','nacimiento']].concat(DB.clientes.map(c=>[c.n,c.tel,c.mail||'',c.dom||'',c.loc||'',c.prov||'',arcaTxt(c.cond||'CF'),c.doc||'',sinoX(c.cc),c.lim||0,c.saldo||0,sinoX(c.club),c.socio||'',c.pts||0,c.nac||'']))],
 vehiculos:['Vehículos',()=>[['patente','marca','modelo','anio','km','cliente','telefono','proximo_service_km','proximo_service_fecha']].concat(DB.vehs.map(v=>{const c=cliOf(v.cliId)||{};return [v.pat,v.marca,v.mod,v.anio||'',v.km||0,c.n||'',c.tel||'',v.proxKm||'',v.proxFecha||'']}))],
 ordenes:['Órdenes de trabajo',()=>[['ot','fecha','estado','area','patente','vehiculo','cliente','condicion_arca','mecanico','km','motivo','neto','iva','total','pagado','saldo','entregada']].concat(DB.ots.map(o=>{const v=vehOf(o.vehId)||{},c=cliOf(o.cliId)||{},t=otTotal(o),pg=(o.pagos||[]).reduce((a,p)=>a+p.monto,0);return [otNum(o),o.fecha,o.estado,typeof areaOf==='function'?areaOf(o.area)[1]:'',v.pat||'',(v.marca||'')+' '+(v.mod||''),c.n||'',arcaTxt((o.arca||{}).cond||c.cond||'CF'),(userOf(o.mecId)||{}).n||'',o.km||0,o.motivo,t.neto,t.iva,t.total,r2(pg),r2(t.total-pg),o.entregada||'']}))],
 ordenes_detalle:['Detalle de órdenes',()=>[['ot','tipo','descripcion','cantidad','precio_unitario','subtotal','adicional']].concat(DB.ots.flatMap(o=>(o.items||[]).map(i=>[otNum(o),i.k==='rep'?'Repuesto':'Mano de obra',i.desc,i.qty,i.pu,r2(i.qty*i.pu),sinoX(i.extra)])))],
 pagos:['Cobros de órdenes',()=>[['ot','fecha','medio','importe']].concat(DB.ots.flatMap(o=>(o.pagos||[]).map(p=>[otNum(o),p.fecha,p.medio,p.monto])))],
 ventas:['Ventas de mostrador',()=>[['venta','fecha','cliente','condicion_arca','cuit_dni','medio','total','usuario','detalle']].concat((DB.ventas||[]).map(v=>['VT-'+String(v.num).padStart(4,'0'),v.fecha,v.cliN||'Consumidor final',arcaTxt((v.arca||{}).cond||'CF'),(v.arca||{}).doc||'',v.medio,v.total,v.u,(v.lines||[]).map(l=>l.qty+' x '+l.desc).join(' | ')]))],
 repuestos:['Repuestos',()=>[['codigo','cod_proveedor','otros_codigos','descripcion','marca','rubro','proveedor','costo','ganancia','precio_venta','iva','stock','alarma','reposicion','aplicacion','publicado_menu']].concat(DB.repuestos.filter(r=>r.activo).map(r=>[r.cod,r.codProv||'',(r.cods||[]).join('|'),r.desc,r.marca,r.rubro,(provOf(r.provId)||{}).n||'',r.pc,r.gan,r.pv,r.iva,r.qty,r.alarma,r.repos,r.apl||'',sinoX(r.pub)]))],
 movimientos_stock:['Movimientos de stock',()=>[['fecha_hora','codigo','descripcion','tipo','cantidad','saldo','referencia','usuario']].concat(DB.kardex.map(k=>{const r=repOf(k.repId)||{};return [ftime(k.t),r.cod||'',r.desc||'',k.tipo,k.delta,k.saldo,k.ref,k.u]}))],
 proveedores:['Proveedores',()=>[['nombre','cuit','condicion_arca','telefono','correo','deuda']].concat(DB.provs.map(p=>[p.n,p.cuit,arcaTxt(p.cond||'RI'),p.tel||'',p.mail||'',typeof provDeuda==='function'?provDeuda(p.id):0]))],
 compras:['Cuenta de proveedores',()=>[['fecha','proveedor','tipo','importe','referencia','usuario']].concat(DB.ledger.map(l=>[l.fecha,(provOf(l.provId)||{}).n||'',l.tipo,l.monto,l.ref,l.u]))],
 caja:['Movimientos de caja',()=>[['fecha_hora','caja','tipo','rubro','detalle','importe','usuario']].concat(DB.movs.map(m=>[ftime(m.t),(DB.cajas.find(c=>c.id===m.cajaId)||{}).n||m.cajaId,m.tipo,(rubFin(m.conc)||{}).n||m.conc,m.ref,m.monto,m.u]))],
 turnos:['Turnos',()=>[['fecha','hora','duracion_h','puesto','cliente','patente','servicio','estado']].concat(DB.turnos.map(t=>[t.fecha,String(t.hora).padStart(2,'0')+':00',t.dur,RECURSOS[t.rec]||'',(cliOf(t.cliId)||{}).n||'',(vehOf(t.vehId)||{}).pat||'',t.srv,t.estado]))],
 servicios:['Catálogo de servicios',()=>[['nombre','area','descripcion','precio','horas','garantia_meses','publicado_menu']].concat(DB.servicios.map(s=>[s.n,typeof areaOf==='function'?areaOf(s.area)[1]:'',s.desc||'',s.pu,s.h,s.gar||0,sinoX(s.pub!==false)]))],
 garantias:['Garantías',()=>[['trabajo_equipo','cliente','patente','desde','hasta','n_serie','reclamos']].concat((DB.garantias||[]).map(g=>[g.desc,(cliOf(g.cliId)||{}).n||'',(vehOf(g.vehId)||{}).pat||'',g.desde,g.hasta,g.serie||'',(g.recl||[]).map(r=>r.f+': '+r.x).join(' | ')]))],
 club:['Puntos del Club',()=>[['fecha','socio','tipo','puntos','referencia','usuario']].concat((DB.ptsMov||[]).map(m=>[m.fecha,(cliOf(m.cliId)||{}).n||'',m.tipo,m.pts,m.ref,m.u]))],
 personal:['Personal',()=>[['nombre','rol','area','puesto','reporta_a','ingreso','contratacion','horario','comision_%','activo']].concat(DB.users.map(u=>{const l=u.leg||{};return [u.n,ROL[u.rol],l.area||'',u.esp||'',l.jefe?(userOf(l.jefe)||{}).n:'',l.ingreso||'',l.contrato||'',(l.hin||'')+'-'+(l.hout||''),u.com||0,sinoX(u.activo!==false)]}))],
 asistencia:['Asistencia',()=>[['fecha','persona','entrada','salida']].concat((DB.asis||[]).map(a=>[a.f,(userOf(a.uid)||{}).n||'',a.in,a.out||'']))],
 tareas:['Tareas',()=>[['tarea','responsable','area','vence','prioridad','estado','referencia']].concat((DB.tareas||[]).map(t=>[t.t,(userOf(t.uid)||{}).n||'',t.area||'',t.venc,t.prio,t.est,t.ref||'']))],
 auditoria:['Auditoría',()=>[['fecha_hora','usuario','accion','detalle']].concat(DB.audit.map(a=>[ftime(a.t),a.u,a.a,a.d]))]};
/* números como número en Excel */
const toCell=v=>typeof v==='number'?v:v;
function dsRows(k){return DSETS[k][1]()}
function expTabla(k,fmt){const rows=dsRows(k),nm=k+'_'+TODAY();
 if(fmt==='csv')csvDown(nm+'.csv',rows);
 else if(fmt==='xlsx')dlBlob(nm+'.xlsx',xlsxBlob([{name:DSETS[k][0],rows}]));
 else{const hd=rows[0];dlBlob(nm+'.json',new Blob([JSON.stringify(rows.slice(1).map(r=>Object.fromEntries(hd.map((h,i)=>[h,r[i]]))),null,1)],{type:'application/json'}))}
 audit('Exportación',DSETS[k][0]+' ('+fmt.toUpperCase()+', '+(rows.length-1)+' filas)')}

/* ---------- importadores ---------- */
const HSYN={nombre:['nombre','razon_social','cliente','nombre_y_apellido','apellido_y_nombre','proveedor','servicio'],telefono:['telefono','tel','celular','whatsapp','movil'],correo:['correo','email','mail','e_mail'],domicilio:['domicilio','direccion','calle'],localidad:['localidad','ciudad'],provincia:['provincia'],
 condicion_arca:['condicion_arca','condicion_iva','condicion','iva_condicion'],cuit_dni:['cuit_dni','cuit','dni','documento','cuil','doc'],patente:['patente','dominio'],marca:['marca'],modelo:['modelo'],anio:['anio','ano','year'],km:['km','kilometros'],
 codigo:['codigo','cod','sku','articulo'],costo:['costo','precio_costo','p_compra','precio_compra'],precio_venta:['precio_venta','precio','pvp','p_venta'],ganancia:['ganancia','margen','pct_ganancia'],
 area:['area','rubro_servicio'],descripcion:['descripcion','detalle'],precio:['precio','importe','valor'],horas:['horas','duracion'],garantia_meses:['garantia_meses','garantia'],publicado_menu:['publicado_menu','publicado','publicar']};
const hnorm=s=>norm(s).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
function hmap(hd){const H=hd.map(hnorm),m={};Object.keys(HSYN).forEach(k=>{const i=H.findIndex(x=>HSYN[k].includes(x));if(i>=0)m[k]=i});return m}
const condDe=s=>{const n=hnorm(s);if(!n)return '';const c=(typeof ARCA_PROV!=='undefined'?ARCA.concat(ARCA_PROV):ARCA).find(a=>hnorm(a[0])===n||hnorm(a[1])===n||hnorm(a[1]).includes(n)||n.includes(hnorm(a[1]).replace(/^iva_/,'')));if(c)return c[0];if(/monotrib/.test(n))return 'MT';if(/inscript/.test(n))return 'RI';if(/exent/.test(n))return 'EX';if(/consumidor|final/.test(n))return 'CF';return null};
const siDe=s=>/^(si|s|1|true|x|yes|verdadero)$/i.test(String(s).trim());
const IMPS={
 clientes:{t:'Clientes y vehículos',req:['nombre'],cols:['nombre','telefono','correo','domicilio','localidad','provincia','condicion_arca','cuit_dni','patente','marca','modelo','anio','km'],ej:['Juan Pérez','3875123456','juan@correo.com','Belgrano 123','Salta','Salta','Consumidor Final','','AB123CD','Fiat','Cronos','2021','45000'],
  plan(rows,m,opt){const P=[],seenTel={};rows.forEach((r,i)=>{const g=k=>m[k]==null?'':String(r[m[k]]==null?'':r[m[k]]).trim();const L={fila:i+2,ok:false,acc:'',msg:'',d:{}};P.push(L);
   const n=g('nombre');if(n.length<3){L.msg='Falta el nombre';return}const tel=g('telefono').replace(/\D/g,'');if(tel&&tel.length<8){L.msg='Teléfono incompleto';return}const mail=g('correo');if(mail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){L.msg='Correo inválido';return}
   let cond='CF';if(g('condicion_arca')){const c=condDe(g('condicion_arca'));if(!c){L.msg='Condición frente a ARCA no reconocida';return}cond=c}
   let ar;try{ar=arcaCheck(cond,g('cuit_dni'),'')}catch(e){L.msg=e.message;return}
   const pat=g('patente').toUpperCase().replace(/[\s-]/g,'');if(pat&&!/^([A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\d{3}|[A-Z0-9]{5,8})$/.test(pat)){L.msg='Patente inválida';return}
   const ex=(tel&&DB.clientes.find(c=>tel10(c.tel)===tel10(tel)))||(ar.doc&&DB.clientes.find(c=>(c.doc||'').replace(/\D/g,'')===ar.doc.replace(/\D/g,'')))||DB.clientes.find(c=>norm(c.n)===norm(n));
   const vx=pat?DB.vehs.find(v=>v.pat===pat):null;if(vx&&ex&&vx.cliId!==ex.id){L.msg='La patente ya es de otro cliente';return}
   L.ok=true;L.d={n,tel,mail,dom:g('domicilio'),loc:g('localidad'),prov:g('provincia'),cond:ar.cond,doc:ar.doc,pat,marca:g('marca'),mod:g('modelo'),anio:parseInt(g('anio'))||0,km:Math.max(0,Math.round(numAR(g('km'))||0)),ex:ex?ex.id:'',vx:!!vx};
   L.acc=ex?(pat&&!vx?'Completa datos y suma vehículo':'Completa datos vacíos'):'Nuevo'+(pat&&!vx?' con vehículo':'')});return P},
  apply(P){let n=0,u=0,v=0;const nuevos={};P.filter(L=>L.ok).forEach(L=>{const d=L.d;let c=d.ex?cliOf(d.ex):nuevos[norm(d.n)+'|'+d.tel];
   if(!c){c={id:uid('c'),n:d.n,tel:d.tel,mail:d.mail,dom:d.dom,loc:d.loc,prov:d.prov||'',doc:d.doc,cond:d.cond,cc:false,lim:0,saldo:0,club:false,pts:0,nac:'',socio:0};DB.clientes.push(c);nuevos[norm(d.n)+'|'+d.tel]=c;n++}
   else{let ch=0;['tel','mail','dom','loc','prov','doc'].forEach(k=>{const kk=k==='tel'?'tel':k;if(!c[kk]&&d[k]){c[kk]=d[k];ch=1}});if((c.cond||'CF')==='CF'&&d.cond!=='CF'){c.cond=d.cond;ch=1}if(ch)u++}
   if(d.pat&&!DB.vehs.some(x=>x.pat===d.pat)){DB.vehs.push({id:uid('v'),cliId:c.id,pat:d.pat,marca:d.marca||'—',mod:d.mod||'—',anio:d.anio,km:d.km,proxKm:0,proxFecha:''});v++}});
   return n+' cliente(s) nuevo(s), '+u+' completado(s), '+v+' vehículo(s)'}},
 proveedores:{t:'Proveedores',req:['nombre','cuit_dni'],cols:['nombre','cuit_dni','condicion_arca','telefono','correo'],ej:['Repuestos del Norte SRL','30-71234567-1','Responsable Inscripto','3874001122','ventas@proveedor.com'],
  plan(rows,m){return rows.map((r,i)=>{const g=k=>m[k]==null?'':String(r[m[k]]==null?'':r[m[k]]).trim();const L={fila:i+2,ok:false,acc:'',msg:'',d:{}};const n=g('nombre');if(n.length<3){L.msg='Falta el nombre';return L}
   const c=g('cuit_dni');if(!cuitOk(c)){L.msg='CUIT inválido';return L}const cuit=cuitFmt(c);let cond='RI';if(g('condicion_arca')){cond=condDe(g('condicion_arca'));if(!cond){L.msg='Condición no reconocida';return L}}
   const ex=DB.provs.find(p=>(p.cuit||'').replace(/\D/g,'')===cuit.replace(/\D/g,''));L.ok=true;L.d={n,cuit,cond,tel:g('telefono'),mail:g('correo'),ex:ex?ex.id:''};L.acc=ex?'Ya existe (se completan datos vacíos)':'Nuevo';return L})},
  apply(P){let n=0,u=0;P.filter(L=>L.ok).forEach(L=>{const d=L.d,p=d.ex?provOf(d.ex):null;if(p){let ch=0;if(!p.tel&&d.tel){p.tel=d.tel;ch=1}if(!p.mail&&d.mail){p.mail=d.mail;ch=1}if(ch)u++}else if(!DB.provs.some(x=>x.cuit===d.cuit)){DB.provs.push({id:uid('p'),n:d.n,cuit:d.cuit,cond:d.cond,tel:d.tel,mail:d.mail,activo:true});n++}});return n+' proveedor(es) nuevo(s), '+u+' completado(s)'}},
 servicios:{t:'Catálogo de servicios',req:['nombre','precio'],cols:['nombre','area','descripcion','precio','horas','garantia_meses','publicado_menu'],ej:['Cambio de aceite y filtro','Mecánica','Aceite según manual y filtro','25000','1','0','SI'],opt:'Actualizar precio, descripción y garantía de los que ya existen',
  plan(rows,m,opt){return rows.map((r,i)=>{const g=k=>m[k]==null?'':String(r[m[k]]==null?'':r[m[k]]).trim();const L={fila:i+2,ok:false,acc:'',msg:'',d:{}};const n=g('nombre');if(n.length<3){L.msg='Falta el nombre';return L}
   const p=numAR(g('precio'));if(!(p>=0)){L.msg='Precio inválido';return L}const A=typeof AREAS!=='undefined'?AREAS:[['mec','Mecánica']];const ar=g('area')?A.find(a=>hnorm(a[1])===hnorm(g('area'))||hnorm(a[0])===hnorm(g('area'))||hnorm(a[1]).includes(hnorm(g('area')))):A[0];if(!ar){L.msg='Área no reconocida';return L}
   const ex=DB.servicios.find(s=>norm(s.n)===norm(n));L.ok=!ex||!!opt;L.d={n,area:ar[0],desc:g('descripcion'),pu:r2(p),h:numAR(g('horas'))||1,gar:parseInt(g('garantia_meses'))||0,pub:g('publicado_menu')?siDe(g('publicado_menu')):true,ex:ex?ex.id:''};L.acc=ex?(opt?'Actualiza precio y datos':''):'Nuevo';if(ex&&!opt)L.msg='Ya existe (tildá “actualizar” para cambiar el precio)';return L})},
  apply(P){let n=0,u=0;P.filter(L=>L.ok).forEach(L=>{const d=L.d;const s=d.ex?srvOf2(d.ex):null;if(s){if(s.pu!==d.pu)audit('Precio de servicio (importación)',s.n+': '+fmt(s.pu)+' → '+fmt(d.pu));Object.assign(s,{pu:d.pu,desc:d.desc||s.desc,gar:d.gar,area:d.area,pub:d.pub});u++}else{DB.servicios.push({id:uid('s'),n:d.n,area:d.area,desc:d.desc,pu:d.pu,h:d.h,gar:d.gar,pub:d.pub,desde:false});n++}});return n+' servicio(s) nuevo(s), '+u+' actualizado(s)'}},
 precios:{t:'Actualizar precios de repuestos (lista del proveedor)',req:['codigo'],cols:['codigo','costo','ganancia','precio_venta'],ej:['WO130','2800','50',''],
  plan(rows,m){return rows.map((r,i)=>{const g=k=>m[k]==null?'':String(r[m[k]]==null?'':r[m[k]]).trim();const L={fila:i+2,ok:false,acc:'',msg:'',d:{}};const c=g('codigo');if(!c){L.msg='Falta el código';return L}
   const nc=ncode(c);const rp=DB.repuestos.find(x=>x.activo&&repCodes(x).some(k=>ncode(k)===nc));if(!rp){L.msg='Código no encontrado';return L}
   const pc=g('costo')?numAR(g('costo')):rp.pc,gan=g('ganancia')?numAR(g('ganancia')):rp.gan;let pv=g('precio_venta')?numAR(g('precio_venta')):r2(pc*(1+gan/100));if(!(pc>=0)||!(gan>=0)||!(pv>0)){L.msg='Precio inválido';return L}
   const varp=rp.pv?Math.round((pv-rp.pv)/rp.pv*100):0;L.ok=true;L.d={id:rp.id,pc:r2(pc),gan,pv:r2(pv)};L.acc=rp.desc+': '+fmt(rp.pv)+' → '+fmt(pv)+' ('+(varp>=0?'+':'')+varp+' %)';if(Math.abs(varp)>60)L.msg='Variación grande, revisala';return L})},
  apply(P){let u=0;P.filter(L=>L.ok).forEach(L=>{const r=repOf(L.d.id);if(!r)return;if(r.pv!==L.d.pv){r.pAnt=r.pv;r.fAct=TODAY()}Object.assign(r,{pc:L.d.pc,gan:L.d.gan,pv:L.d.pv});u++});return u+' precio(s) actualizado(s)'}},
 repuestos:{t:'Repuestos nuevos (alta masiva)',delega:true,cols:typeof ICOLS!=='undefined'?ICOLS:[]}};
const srvOf2=id=>DB.servicios.find(s=>s.id===id);

/* ======================= PANTALLA «Datos y respaldo» (sólo dueño) ======================= */
NAV.push(['datos','💾','Datos y respaldo']);
if(typeof UXSEC!=='undefined'){const sy=UXSEC.find(s=>s[0]==='sys');if(sy&&!sy[2].includes('datos'))sy[2].push('datos')}
if(typeof UX_DESC!=='undefined')UX_DESC.datos='Respaldá, exportá e importá los datos del taller en JSON, Excel o CSV, y prepará el sistema para trabajar sin internet.';
if(typeof UXKW!=='undefined')UXKW.datos='respaldo backup exportar importar excel csv migrar copia sin internet offline instalar';
UI.datTab=UI.datTab||'resp';
V.datos=()=>{if(ME.rol!=='dueno')return '<div class="bar"><h2>Datos y respaldo</h2></div><p class="mut">Sólo el dueño exporta, importa y restaura datos.</p>';const T=UI.datTab;
 const tabs=[['resp','Respaldo y copias'],['exp','Exportar'],['imp','Importar'],['off','Sin internet']];
 return '<div class="bar"><h2>Datos y respaldo</h2><span class="sp"></span><span class="mut sm">'+(DB.cfg.lastBackup?'Último respaldo descargado: '+ftime(DB.cfg.lastBackup):'Todavía no descargaste un respaldo')+'</span></div>'+
 '<div class="chips" role="tablist" style="margin-bottom:10px">'+tabs.map(t=>'<button role="tab" aria-selected="'+(T===t[0])+'" class="chip'+(T===t[0]?' on':'')+'" data-act="dattab" data-t="'+t[0]+'">'+t[1]+'</button>').join('')+'</div><div id="datbody">'+(T==='resp'?datRespHTML():T==='exp'?datExpHTML():T==='imp'?datImpHTML():datOffHTML())+'</div>'};
ACT.dattab=d=>{UI.datTab=d.t;renderView();if(d.t==='resp')datSnapsDraw();if(d.t==='off')datOffDraw()};
const _rvDat=renderView;renderView=function(){_rvDat();if(VIEW==='datos'){if(UI.datTab==='resp')datSnapsDraw();if(UI.datTab==='off')datOffDraw()}try{snapDiaria()}catch(e){}};
/* respaldo */
function datRespHTML(){const sz=Math.round(JSON.stringify(DB).length/1024);
 return '<div class="g2"><div class="card"><h3>Descargar respaldo completo</h3><p class="sm mut">Todo el sistema en un archivo: órdenes, clientes, stock, caja, Club, personal, configuración y usuarios (las claves van cifradas). Sirve para guardar una copia, pasar a otra computadora o migrar. Tamaño actual: '+sz+' KB.</p>'+
 '<div class="row"><button class="btn p" data-act="datbk" data-f="json">⬇ Respaldo (.json)</button><button class="btn" data-act="datbk" data-f="enc">🔒 Respaldo cifrado (.vbk)</button></div><p class="sm mut" style="margin:8px 0 0">El cifrado pide una clave y protege los datos personales si el archivo se pierde o se comparte. Sin esa clave no se puede recuperar.</p></div>'+
 '<div class="card"><h3>Restaurar o migrar desde un respaldo</h3><p class="sm mut">Acepta respaldos .json o cifrados .vbk de este sistema (también de otra computadora o de otro sistema VB de taller). Antes de reemplazar se guarda una copia automática de lo actual.</p><label class="btn" style="margin:0">📂 Elegir respaldo<input type="file" hidden accept=".json,.vbk,application/json" data-chg="datrest"></label></div></div>'+
 '<div class="card"><div class="row"><h3 class="sp" style="margin:0">Copias automáticas en este equipo</h3><button class="btn s" data-act="datsnap">📸 Hacer copia ahora</button></div><p class="sm mut">Se guarda una copia por día al entrar y otra antes de cada importación o restauración (se conservan las últimas 10). Quedan en este navegador: no reemplazan al respaldo descargado.</p><div id="datsnaps"><p class="mut sm">Cargando…</p></div></div>'}
async function datSnapsDraw(){const el=$('#datsnaps');if(!el)return;const L=await snapList();if(!$('#datsnaps'))return;
 el.innerHTML=L.length?'<div class="tw"><table><thead><tr><th>Fecha</th><th>Motivo</th><th class="n">Tamaño</th><th></th></tr></thead><tbody>'+L.map(s=>'<tr><td>'+ftime(s.t)+'</td><td>'+h(s.motivo)+'</td><td class="n">'+s.kb+' KB</td><td><div class="row"><button class="btn s" data-act="datsnapres" data-id="'+h(s.id)+'">Restaurar</button><button class="btn s" data-act="datsnapdl" data-id="'+h(s.id)+'">⬇</button><button class="btn s d" data-act="datsnapdel" data-id="'+h(s.id)+'" aria-label="Borrar copia">✕</button></div></td></tr>').join('')+'</tbody></table></div>':'<p class="mut sm">Todavía no hay copias (o este navegador no permite guardarlas).</p>'}
ACT.datsnap=async()=>{const ok=await snapSave('Copia manual de '+ME.n);toast(ok?'Copia guardada en este equipo':'No se pudo guardar la copia en este navegador',!ok);datSnapsDraw()};
ACT.datsnapdl=async d=>{const s=await snapGet(d.id);if(s)dlBlob('copia_'+new Date(s.t).toISOString().slice(0,16).replace(/[:T]/g,'-')+'.json',new Blob([s.data],{type:'application/json'}))};
ACT.datsnapdel=d=>confirmBox('¿Borrar esta copia automática?',async()=>{await snapDel(d.id);datSnapsDraw()},'Borrar');
ACT.datsnapres=async d=>{const s=await snapGet(d.id);if(!s)return;let o;try{o=JSON.parse(s.data)}catch(e){toast('La copia está dañada.',1);return}datConfirmRestore(o,'copia del '+ftime(s.t))};
ACT.datbk=async d=>{const txt=JSON.stringify(DB,null,1),nm='respaldo_'+hnorm(DB.cfg.nombre).slice(0,30)+'_'+MODO+'_'+TODAY();
 if(d.f==='json'){DB.cfg.lastBackup=Date.now();save();dlBlob(nm+'.json',new Blob([JSON.stringify(Object.assign({},DB,{cfg:DB.cfg}),null,1)],{type:'application/json'}));audit('Respaldo descargado','JSON');renderView();return}
 modal({title:'Respaldo cifrado',ok:'Cifrar y descargar',body:'<p class="sm">Elegí una clave para el archivo. <b>Anotala en un lugar seguro:</b> sin ella el respaldo no se puede abrir (ni el desarrollador puede recuperarlo).</p><div class="g2"><div class="f"><label for="bk_p">Clave (mínimo 8 caracteres)</label><input type="password" id="bk_p" autocomplete="new-password"></div><div class="f"><label for="bk_q">Repetir clave</label><input type="password" id="bk_q" autocomplete="new-password"></div></div>',
  onOk:()=>{const p=val('bk_p'),q=val('bk_q');if(p.length<8){merr('La clave debe tener al menos 8 caracteres.');return false}if(p!==q){merr('Las claves no coinciden.');return false}
   cifrar(JSON.stringify(DB),p).then(t=>{DB.cfg.lastBackup=Date.now();save();dlBlob(nm+'.vbk',new Blob([t],{type:'application/octet-stream'}));audit('Respaldo descargado','cifrado');toast('Respaldo cifrado descargado');renderView()}).catch(e=>toast(e.message,1));return true}})};
function datValida(o){if(!o||typeof o!=='object')return 'No es un respaldo del sistema.';if(o.ver!==2||!Array.isArray(o.ots)||!Array.isArray(o.repuestos)||!Array.isArray(o.clientes)||!Array.isArray(o.users)||!o.cfg)return 'El archivo no tiene la estructura de un respaldo del sistema de taller.';return ''}
CHG.datrest=t=>{const f=t.files[0];t.value='';if(!f)return;f.text().then(async txt=>{let o;try{o=JSON.parse(txt)}catch(e){toast('El archivo no es un respaldo válido.',1);return}
 if(o&&o.fmt==='vb-respaldo-cifrado'){modal({title:'Respaldo cifrado',ok:'Abrir',body:'<div class="f"><label for="rs_p">Clave del respaldo</label><input type="password" id="rs_p" autocomplete="off"></div>',onOk:()=>{descifrar(o,val('rs_p')).then(x=>{closeModal();let d;try{d=JSON.parse(x)}catch(e){toast('El contenido está dañado.',1);return}setTimeout(()=>datConfirmRestore(d,f.name),60)}).catch(e=>merr(e.message));return false}});return}
 datConfirmRestore(o,f.name)})};
function datConfirmRestore(o,origen){const err=datValida(o);if(err){toast(err,1);return}const mo=o.modo||'practica';
 if(MODO==='real'&&mo!=='real'){toast('Ese respaldo es de datos de práctica o de demostración: no se puede cargar en el sistema real.',1);return}
 const cnt=k=>(o[k]||[]).length;modal({title:'Restaurar respaldo',ok:'Reemplazar los datos actuales',body:'<p>Archivo: <b>'+h(origen)+'</b></p><div class="tw"><table><tbody><tr><td>Negocio</td><td><b>'+h((o.cfg||{}).nombre||'—')+'</b></td></tr><tr><td>Tipo de datos</td><td>'+(mo==='real'?'Reales':'Práctica / demostración')+'</td></tr><tr><td>Órdenes · clientes · vehículos</td><td>'+cnt('ots')+' · '+cnt('clientes')+' · '+cnt('vehs')+'</td></tr><tr><td>Repuestos · ventas · movimientos de caja</td><td>'+cnt('repuestos')+' · '+cnt('ventas')+' · '+cnt('movs')+'</td></tr><tr><td>Usuarios</td><td>'+cnt('users')+'</td></tr></tbody></table></div>'+
  '<p class="sm" style="margin-top:8px"><b>Se reemplazan todos los datos de este equipo</b> por los del respaldo. Antes se guarda una copia automática de lo actual para poder volver atrás.'+(mo!==MODO?' El respaldo es de otro tipo de datos y se adapta a este modo.':'')+'</p>',
  onOk:()=>{snapSave('Antes de restaurar '+origen).then(()=>{o.modo=MODO;DB=migrar(o);save();audit('Respaldo restaurado',origen);ME=userOf(ME.id)||DB.users.find(u=>u.rol==='dueno')||DB.users[0];renderShell();toast('Datos restaurados')});return true}})}
/* exportar */
function datExpHTML(){const K=Object.keys(DSETS);return '<p class="sm mut">Cada tabla se descarga en <b>Excel (.xlsx)</b>, <b>CSV</b> (separado por punto y coma, abre en Excel) o <b>JSON</b>. Las celdas que podrían ejecutarse como fórmula se neutralizan.</p>'+
 '<div class="card"><div class="row"><b class="sp">Todo en un solo Excel (una hoja por tabla)</b><button class="btn p" data-act="datxall">⬇ Excel completo</button></div></div>'+
 '<div class="tw"><table><thead><tr><th>Tabla</th><th class="n">Registros</th><th>Descargar</th></tr></thead><tbody>'+K.map(k=>{let n=0;try{n=dsRows(k).length-1}catch(e){}return '<tr><td><b>'+h(DSETS[k][0])+'</b></td><td class="n">'+n+'</td><td><div class="row"><button class="btn s" data-act="datx" data-k="'+k+'" data-f="xlsx">Excel</button><button class="btn s" data-act="datx" data-k="'+k+'" data-f="csv">CSV</button><button class="btn s" data-act="datx" data-k="'+k+'" data-f="json">JSON</button></div></td></tr>'}).join('')+'</tbody></table></div>'}
ACT.datx=d=>{try{expTabla(d.k,d.f);save()}catch(e){toast('No se pudo exportar: '+e.message,1)}};
ACT.datxall=()=>{try{const S=Object.keys(DSETS).map(k=>({name:DSETS[k][0],rows:dsRows(k)}));dlBlob('sistema_'+hnorm(DB.cfg.nombre).slice(0,30)+'_'+TODAY()+'.xlsx',xlsxBlob(S));audit('Exportación','Excel completo ('+S.length+' hojas)');save()}catch(e){toast('No se pudo exportar: '+e.message,1)}};
/* importar */
UI.datImp=UI.datImp||'clientes';
function datImpHTML(){const k=UI.datImp,I=IMPS[k];
 return '<p class="sm mut">Para migrar desde otro sistema o una planilla. Acepta <b>Excel (.xlsx)</b>, <b>CSV</b> (coma o punto y coma) y <b>JSON</b>. Primero se muestra una vista previa con lo que se va a crear, completar o rechazar; nada cambia hasta que confirmás, y antes se guarda una copia automática.</p>'+
 '<div class="chips" style="margin-bottom:10px">'+Object.keys(IMPS).map(x=>'<button class="chip'+(x===k?' on':'')+'" data-act="datimpk" data-k="'+x+'">'+h(IMPS[x].t)+'</button>').join('')+'</div>'+
 '<div class="card"><h3>'+h(I.t)+'</h3>'+(I.delega?'<p class="sm">Usa el importador de Repuestos (con rubros, marcas, proveedores y stock inicial en la trazabilidad). Acá podés cargar el archivo en Excel o CSV y se abre listo para revisar.</p>':'<p class="sm">Columnas: <code>'+I.cols.join(', ')+'</code>. Obligatorias: <b>'+I.req.join(', ')+'</b>. Los nombres de columna se reconocen aunque varíen (por ejemplo “Teléfono”, “Celular” o “WhatsApp”).</p>')+
 (I.opt?'<label style="font-weight:500;color:var(--tx);display:block;margin:6px 0"><input type="checkbox" id="imp_opt" style="width:auto;min-height:0"> '+h(I.opt)+'</label>':'')+
 '<div class="row"><label class="btn p" style="margin:0">📂 Elegir archivo<input type="file" hidden accept=".xlsx,.csv,.txt,.json" data-chg="datimpf"></label><button class="btn" data-act="datimpl" data-f="xlsx">⬇ Plantilla Excel</button><button class="btn" data-act="datimpl" data-f="csv">⬇ Plantilla CSV</button></div></div>'}
ACT.datimpk=d=>{UI.datImp=d.k;renderView()};
ACT.datimpl=d=>{const k=UI.datImp,I=IMPS[k];const cols=I.delega?ICOLS:I.cols,ej=I.delega?['WO130','','WO130B','Filtro de aceite','WEGA','FILTRO DE ACEITE','Nombre del proveedor','2500','50','10','3','6']:I.ej;const rows=[cols,ej];if(d.f==='xlsx')dlBlob('plantilla_'+k+'.xlsx',xlsxBlob([{name:I.t,rows}]));else csvDown('plantilla_'+k+'.csv',rows)};
CHG.datimpf=t=>{const f=t.files[0];t.value='';if(!f)return;const k=UI.datImp,I=IMPS[k],opt=chk('imp_opt');
 readTabla(f).then(S=>{const s=S.find(x=>x.rows.length>1)||S[0];if(!s||s.rows.length<2){toast('El archivo no tiene filas para importar.',1);return}
  if(I.delega){const csv=s.rows.map(r=>r.map(c=>{c=String(c==null?'':c);return /[;"\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(';')).join('\n');go('repuestos');setTimeout(()=>{ACT.repimp();const ta=$('#fi_t');if(ta)ta.value=csv;toast('Archivo cargado: revisalo y tocá “Revisar e importar”.')},40);return}
  const m=hmap(s.rows[0]);const miss=I.req.filter(c=>m[c]==null);if(miss.length){toast('Faltan columnas: '+miss.join(', ')+'. Descargá la plantilla para ver el formato.',1);return}
  const data=s.rows.slice(1);if(data.length>5000){toast('Máximo 5.000 filas por importación.',1);return}
  const P=I.plan(data,m,opt);datPreview(k,P,f.name+(S.length>1?' (hoja “'+s.name+'”)':''))}).catch(e=>toast(e.message||'No se pudo leer el archivo.',1))};
function datPreview(k,P,origen){const I=IMPS[k],ok=P.filter(L=>L.ok),bad=P.filter(L=>!L.ok);
 modal({title:'Vista previa · '+I.t,wide:true,ok:ok.length?'Importar '+ok.length+' fila(s)':'Cerrar',body:'<p>Archivo: <b>'+h(origen)+'</b> · '+P.length+' fila(s): <span class="badge ok">'+ok.length+' para importar</span> '+(bad.length?'<span class="badge bad">'+bad.length+' con errores (se omiten)</span>':'')+'</p>'+
  '<div class="tw" style="max-height:52vh"><table><thead><tr><th>Fila</th><th>Dato</th><th>Qué se hace</th><th>Observación</th></tr></thead><tbody>'+P.slice(0,400).map(L=>'<tr><td>'+L.fila+'</td><td>'+h(L.d.n||L.d.cod||(L.d.id?(repOf(L.d.id)||{}).cod:'')||'')+(L.d.pat?' · '+h(L.d.pat):'')+'</td><td>'+(L.ok?'<span class="badge ok">'+h(L.acc)+'</span>':'<span class="badge bad">Se omite</span>')+'</td><td class="sm">'+h(L.msg||'')+'</td></tr>').join('')+'</tbody></table></div>'+(P.length>400?'<p class="sm mut">Se muestran las primeras 400 filas.</p>':''),
  onOk:()=>{if(!ok.length)return true;snapSave('Antes de importar '+I.t).then(()=>{const r=I.apply(P);audit('Importación · '+I.t,origen+' · '+r+(bad.length?' · '+bad.length+' omitida(s)':''));save();renderView();toast('Importación lista: '+r)});return true}})}
/* sin internet */
function datOffHTML(){const http=/^https?:/.test(location.protocol);
 return '<div class="g2"><div class="card"><h3>Estado de este equipo</h3><div id="datoff"><p class="mut sm">Revisando…</p></div></div>'+
 '<div class="card"><h3>Cómo trabajar sin internet</h3><ol style="margin:0 0 0 18px;padding:0">'+
 '<li><b>Instalá el sistema como aplicación</b> (Chrome o Edge: ícono de instalar en la barra de direcciones; en el celular, “Agregar a la pantalla de inicio”). Desde la primera vez que se abre con internet, queda guardado y abre aunque no haya conexión.</li>'+
 '<li><b>O descargá el archivo</b> y abrilo con doble clic: funciona igual, sin internet. Importante: cada forma de abrirlo guarda sus propios datos, así que elegí una y usá siempre la misma (para pasar datos de una a otra, usá el respaldo).</li>'+
 '<li><b>Activá el almacenamiento permanente</b> para que el navegador no borre los datos si le falta espacio.</li>'+
 '<li><b>Descargá un respaldo cada semana</b> (el sistema avisa a los 7 días) y guardalo fuera de la computadora: pendrive, Drive o correo.</li></ol>'+
 '<div class="row" style="margin-top:10px">'+(http?'<button class="btn p" data-act="datdlhtml">⬇ Descargar el sistema (archivo .html)</button>':'')+'<button class="btn" data-act="datpersist">🔒 Activar almacenamiento permanente</button>'+'<button class="btn" data-act="vbinstall">📲 Instalar como aplicación</button>'+'</div>'+
 '<p class="sm mut" style="margin:8px 0 0">Sin internet no funcionan sólo los enlaces externos: WhatsApp, mapas, Instagram y la página del desarrollador. Todo lo demás (órdenes, caja, stock, ventas, Club, personal, impresiones) sigue igual.</p></div></div>'}
async function datOffDraw(){const el=$('#datoff');if(!el)return;let q={},p=false;try{if(navigator.storage){if(navigator.storage.estimate)q=await navigator.storage.estimate();if(navigator.storage.persisted)p=await navigator.storage.persisted()}}catch(e){}
 const ls=(localStorage.getItem(LS)||'').length*2,sw=!!(navigator.serviceWorker&&navigator.serviceWorker.controller),inst=matchMedia('(display-mode: standalone)').matches;const http=/^https?:/.test(location.protocol);
 const it=(okv,t,x)=>'<div class="row" style="padding:6px 0;border-bottom:1px solid var(--bd)"><span aria-hidden="true">'+(okv?'✅':'⚪')+'</span><span class="sp"><b>'+t+'</b><br><span class="sm mut">'+x+'</span></span></div>';
 if(!$('#datoff'))return;el.innerHTML=it(navigator.onLine,'Conexión',navigator.onLine?'Con internet':'Sin internet: el sistema sigue funcionando')+
 it(http?sw:true,'Disponible sin conexión',http?(sw?'Este sistema ya quedó guardado en el navegador y abre sin internet':'Se activa al recargar la página una vez con internet'):'Abierto como archivo: no necesita internet')+
 it(inst||!http,'Aplicación instalada',inst?'Abierto como aplicación':http?'Todavía no (ver paso 1)':'No hace falta: es un archivo')+
 it(p,'Almacenamiento permanente',p?'Activado: el navegador no borra los datos por falta de espacio':'Sin activar (paso 3)')+
 it(ls<4e6,'Espacio de los datos',Math.round(ls/1024)+' KB usados de unos 5.000 KB disponibles para los datos'+(q.quota?' · disco del navegador: '+Math.round((q.usage||0)/1048576)+' MB de '+Math.round(q.quota/1048576)+' MB':'')+(ls>=4e6?' · <b>Cerca del límite: bajá fotos viejas o exportá y depurá</b>':''))}
ACT.datpersist=async()=>{try{if(!navigator.storage||!navigator.storage.persist)throw 0;const ok=await navigator.storage.persist();toast(ok?'Almacenamiento permanente activado':'El navegador no lo permitió todavía: instalá el sistema como aplicación y volvé a intentar',!ok)}catch(e){toast('Este navegador no permite activarlo.',1)}datOffDraw()};
ACT.datdlhtml=async()=>{try{const r=await fetch(location.href.split('#')[0],{cache:'reload'});if(!r.ok)throw 0;dlBlob(hnorm(DB.cfg.nombre).slice(0,30)+'_sistema.html',await r.blob());toast('Archivo descargado: abrilo con doble clic para usarlo sin internet')}catch(e){toast('Para descargarlo hace falta internet en este momento.',1)}};
ACT.datinstall=async()=>{const e=window.__vbInstall;if(!e)return;e.prompt();try{await e.userChoice}catch(x){}window.__vbInstall=null;renderView()};

/* ---------- aplicación instalable y sin conexión (service worker) ---------- */
(function(){if(!/^https?:/.test(location.protocol))return;const hd=document.head;const add=(t,a)=>{const e=document.createElement(t);Object.keys(a).forEach(k=>e.setAttribute(k,a[k]));hd.appendChild(e)};
 add('link',{rel:'manifest',href:'manifest.webmanifest'});add('link',{rel:'apple-touch-icon',href:'icon-192.png'});add('meta',{name:'theme-color',content:'#23262b'});add('meta',{name:'mobile-web-app-capable',content:'yes'})})();
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.__vbInstall=e});
(function(){if(!('serviceWorker' in navigator)||!/^https?:/.test(location.protocol))return;
 window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').then(reg=>{
  let avisado=false;const avisar=w=>{if(!w)return;const chk=()=>{if(avisado||w.state!=='installed'||!navigator.serviceWorker.controller)return;avisado=true;const b=document.createElement('div');b.className='demoflag';b.style.cssText='position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:90;box-shadow:0 8px 24px rgba(0,0,0,.2);max-width:92vw';b.innerHTML='Hay una versión nueva del sistema. <button class="btn s p" id="vbupd">Actualizar</button>';document.body.appendChild(b);$('#vbupd').onclick=()=>{w.postMessage('skip');setTimeout(()=>location.reload(),300)}};chk();w.addEventListener('statechange',chk)};
  avisar(reg.waiting);avisar(reg.installing);reg.addEventListener('updatefound',()=>avisar(reg.installing))}).catch(()=>{})})})();
/* indicador de conexión en la barra superior */
['online','offline'].forEach(ev=>window.addEventListener(ev,()=>{try{if(ME)uxTop();toast(navigator.onLine?'Volvió internet':'Sin internet: el sistema sigue funcionando y guarda todo en este equipo')}catch(e){}}));
if(typeof uxTop==='function'){const _uxTopD=uxTop;uxTop=function(){_uxTopD();const t=$('#uxtop');if(t&&!navigator.onLine&&!t.querySelector('.offc')){const s=document.createElement('span');s.className='chip2 c-warn offc';s.textContent='● Sin internet';const n=t.querySelector('.nm');if(n)n.after(s)}}}
/* botón visible "Instalar aplicación": instala de verdad cuando el navegador lo permite; si no, muestra los pasos */
(function(){
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const st=document.createElement('style');st.textContent='#vbinst{position:fixed;right:14px;bottom:14px;z-index:40;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:10px 18px;border:0;border-radius:999px;background:#1e6fd0;color:#fff;font:inherit;font-weight:700;box-shadow:0 6px 18px rgba(0,0,0,.28);cursor:pointer}#vbinst:hover{background:#1859ab}#vbinst:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 5px #1e6fd0}#app:not([hidden]) ~ #vbinst{display:none}@media(max-width:900px){#vbinsttop .vbit{display:none}}@media print{#vbinst,#vbinsttop{display:none!important}}';document.head.appendChild(st);
 function pill(){let b=document.getElementById('vbinst');if(standalone()){if(b)b.remove();return}
  if(!b){b=document.createElement('button');b.id='vbinst';b.type='button';b.innerHTML='<span aria-hidden="true">📲</span> Instalar aplicación';b.onclick=()=>ACT.vbinstall();document.body.appendChild(b)}}
 ACT.vbinstall=async()=>{const e=window.__vbInstall;
  if(e){e.prompt();try{const r=await e.userChoice;if(r&&r.outcome==='accepted')toast('Instalando la aplicación…')}catch(x){}window.__vbInstall=null;return}
  if(standalone()){toast('La aplicación ya está instalada en este equipo.');return}
  const ua=navigator.userAgent||'',ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),and=/android/i.test(ua);
  let pasos;
  if(!/^https?:/.test(location.protocol))pasos='<p>Para instalarla, abrí el sistema desde su dirección web (no como archivo). Ahí aparece este mismo botón y se instala con un toque.</p>';
  else if(ios)pasos='<ol style="margin:0 0 0 18px;padding:0"><li>Abrí esta página en <b>Safari</b>.</li><li>Tocá el botón <b>Compartir</b> (el cuadrado con la flecha hacia arriba).</li><li>Elegí <b>Agregar a pantalla de inicio</b> y confirmá con <b>Agregar</b>.</li></ol>';
  else if(and)pasos='<ol style="margin:0 0 0 18px;padding:0"><li>Abrí esta página en <b>Chrome</b>.</li><li>Tocá el menú <b>⋮</b> (arriba a la derecha).</li><li>Elegí <b>Instalar aplicación</b> (o <b>Agregar a la pantalla principal</b>) y confirmá.</li></ol>';
  else pasos='<ol style="margin:0 0 0 18px;padding:0"><li>En <b>Chrome</b> o <b>Edge</b>, buscá el ícono de instalar <b>⊕</b> al final de la barra de direcciones.</li><li>O abrí el menú <b>⋮</b> y elegí <b>Instalar…</b> / <b>Guardar y compartir → Instalar página como aplicación</b>.</li><li>Confirmá con <b>Instalar</b>.</li></ol>';
  modal({title:'📲 Instalar la aplicación',ok:'Entendido',cancel:false,body:'<p>Se instala en el celular o en la computadora, abre en su propia ventana con el ícono del taller y sigue funcionando sin internet.</p>'+pasos+'<p class="sm mut" style="margin:10px 0 0">Si el botón no abre el aviso de instalación de tu navegador, es porque este navegador la instala desde su menú: seguí los pasos de arriba.</p>',onOk:()=>true})};
 ACT.datinstall=ACT.vbinstall;
 window.addEventListener('appinstalled',()=>{window.__vbInstall=null;pill();const t=document.getElementById('vbinsttop');if(t)t.remove();try{toast('Aplicación instalada')}catch(x){}});
 if(typeof uxTop==='function'){const _uxTopI=uxTop;uxTop=function(){_uxTopI();const t=$('#uxtop');if(t&&!standalone()&&!t.querySelector('#vbinsttop')){const b=document.createElement('button');b.className='tb';b.id='vbinsttop';b.type='button';b.setAttribute('aria-label','Instalar aplicación');b.title='Instalar aplicación';b.innerHTML='📲<span class="vbit"> Instalar</span>';b.onclick=()=>ACT.vbinstall();const th=t.querySelector('[data-act="uxtheme"]');if(th)t.insertBefore(b,th);else t.appendChild(b)}}}
 pill()})();
/* el respaldo de Configuración lleva a la pantalla nueva */
ACT.cfexp=()=>{UI.datTab='resp';go('datos')};
