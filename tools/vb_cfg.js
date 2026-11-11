/* ======================= Configuración dinámica + acceso oculto (Sistema VB) =======================
   - Configuración por secciones, con buscador, progreso de puesta en marcha, guardado automático,
     vista previa en vivo, interruptores y ajuste masivo de precios. No quita ninguna opción anterior:
     reutiliza los mismos datos (DB.cfg, DB.servicios) y las mismas acciones (cfflag, cfserv, servadd,
     servdel, uxmod, menucfg, cfimp, cfreset).
   - Acceso oculto: doble clic (o doble toque) sobre el logo del menú público abre el ingreso al panel.
     Sigue pidiendo usuario y clave. Se puede apagar en Configuración → Menú digital. */
(function(){const st=document.createElement('style');st.textContent=
'.cfx{display:grid;grid-template-columns:230px minmax(0,1fr);gap:14px;align-items:start}'+
'.cfnav{position:sticky;top:64px;display:flex;flex-direction:column;gap:2px;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:6px}'+
'.cfnav button{display:flex;align-items:center;gap:10px;text-align:left;border:0;background:transparent;color:var(--tx);font:inherit;font-weight:600;padding:9px 12px;border-radius:10px;min-height:44px;cursor:pointer}'+
'.cfnav button:hover{background:rgba(127,127,127,.12)}.cfnav button.on{background:#3a3d43;color:#fff}'+
'.cfnav .cnt{margin-left:auto;font-size:.72rem;background:#c62828;color:#fff;border-radius:999px;padding:1px 8px;font-weight:700}'+
'.cfhead{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:12px}.cfhead h2{margin:0}'+
'.cfsrch{position:relative;flex:1;min-width:220px;max-width:420px}.cfsrch input{width:100%}'+
'.cfres{position:absolute;left:0;right:0;top:100%;z-index:30;background:var(--card);border:1px solid var(--bd);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);margin-top:4px;overflow:hidden}'+
'.cfres button{display:block;width:100%;text-align:left;border:0;background:transparent;color:var(--tx);font:inherit;padding:10px 12px;min-height:44px;cursor:pointer;border-top:1px solid var(--bd)}'+
'.cfres button:first-child{border-top:0}.cfres button:hover,.cfres button:focus{background:rgba(127,127,127,.14);outline:0}.cfres small{display:block;color:var(--mut)}'+
'.cfprog{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.cfbar{flex:1;min-width:160px;height:10px;border-radius:999px;background:rgba(127,127,127,.22);overflow:hidden}'+
'.cfbar i{display:block;height:100%;background:#18794a;border-radius:999px;transition:width .4s}'+
'.cfmiss{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.cfmiss button{border:1px dashed var(--bd);background:transparent;color:var(--tx);border-radius:999px;padding:6px 12px;font:inherit;font-size:.85rem;font-weight:600;min-height:36px;cursor:pointer}'+
'.cfrow{display:flex;gap:14px;align-items:center;justify-content:space-between;padding:12px 0;border-top:1px solid var(--bd)}.cfrow:first-of-type{border-top:0}.cfrow .t{flex:1}.cfrow b{display:block}'+
'.sw{position:relative;display:inline-block;width:50px;height:28px;flex:0 0 50px}.sw input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;min-height:0;z-index:1}'+
'.sw span{position:absolute;inset:0;background:#8a919b;border-radius:999px;transition:background .2s;pointer-events:none}.sw span:after{content:"";position:absolute;left:3px;top:3px;width:22px;height:22px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}'+
'.sw input:checked+span{background:#18794a}.sw input:checked+span:after{transform:translateX(22px)}.sw input:focus-visible+span{outline:3px solid #1e6fd0;outline-offset:2px}.sw input:disabled{cursor:not-allowed}'+
'.cfok{font-size:.82rem;font-weight:700;color:#18794a;opacity:0;transition:opacity .3s}.cfok.on{opacity:1}html[data-theme=dark] .cfok{color:#6fdc9a}'+
'.cfprev{background:linear-gradient(135deg,#23262b,#3a3d43);color:#fff;border-radius:14px;padding:16px;text-align:center}.cfprev img{width:84px;background:#fff;border-radius:12px;padding:5px}'+
'.cfprev h3{color:#fff;margin:8px 0 2px;font-size:1.2rem}.cfprev p{margin:2px 0;color:#d7dbe0;font-size:.88rem}'+
'.cfmods{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}.cfmod{border:1px solid var(--bd);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px;background:var(--card)}'+
'.cfmod .hd{display:flex;gap:10px;align-items:flex-start;justify-content:space-between}.cfmod.off{opacity:.78}'+
'.cfsc{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}.cfsc button{text-align:left;border:1px solid var(--bd);background:var(--card);color:var(--tx);border-radius:14px;padding:12px;font:inherit;cursor:pointer;min-height:64px}'+
'.cfsc button b{display:block}.cfsc button span{font-size:.84rem;color:var(--mut)}.cfsc button:hover{border-color:#1e6fd0}'+
'.cferr{color:#c62828;font-size:.82rem;font-weight:600;min-height:1em}html[data-theme=dark] .cferr{color:#ff8a80}'+
'.cfhit{animation:cfhit 1.6s ease}@keyframes cfhit{0%,60%{box-shadow:0 0 0 4px #1e6fd0}100%{box-shadow:0 0 0 0 transparent}}'+
'.cfdanger{border-color:#c62828!important}#pub .ph img{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}'+
'@media(max-width:820px){.cfx{grid-template-columns:1fr}.cfnav{position:static;flex-direction:row;overflow-x:auto;padding:4px}.cfnav button{white-space:nowrap;flex:0 0 auto}}'+
'@media(prefers-reduced-motion:reduce){.sw span,.sw span:after,.cfbar i{transition:none}.cfhit{animation:none}}';
document.head.appendChild(st)})();

UI.cfTab=UI.cfTab||'neg';UI.cfQ='';UI.cfMoQ=UI.cfMoQ||'';UI.cfMoF=UI.cfMoF||'';UI.cfAuQ=UI.cfAuQ||'';
const cfMenuOn=()=>typeof webCfgHTML==='function'&&modOn('webp');
const cfTabs=()=>[['neg','🏪','Datos del negocio'],['mod','🧩','Módulos'],['fun','🎛️','Funcionamiento'],['mo','🧰','Mano de obra']].concat(cfMenuOn()?[['menu','📱','Menú digital']]:[]).concat(typeof prCfg==='function'?[['imp','🖨️','Impresión y datos fiscales']]:[]).concat([['acc','🔐','Usuarios y accesos'],['dat','💾','Datos y respaldo'],['aud','🕑','Auditoría']]);
const cfSinPrecio=()=>DB.servicios.filter(s=>!(s.pu>0)).length;
const cfBkDias=()=>DB.cfg.lastBackup?Math.floor((Date.now()-DB.cfg.lastBackup)/864e5):null;
function cfChecks(){const c=DB.cfg,M=c.menu||{};const L=[
 ['Nombre del negocio',(c.nombre||'').trim().length>=3,'neg','cf_n'],
 ['Dirección',!!(c.dir||'').trim(),'neg','cf_d'],
 ['Teléfono / WhatsApp',String(c.tel||'').replace(/\D/g,'').length>=8,'neg','cf_t'],
 ['Correo o una red social',!!((c.mail||'').trim()||(c.ig||'').trim()||(c.fb||'').trim()),'neg','cf_m'],
 ['Precios de mano de obra',DB.servicios.length>0&&!cfSinPrecio(),'mo','cfmoq'],
 ['Respaldo de los últimos 7 días',cfBkDias()!==null&&cfBkDias()<=7,'dat','']];
 if(typeof prFiscOk==='function')L.push(['Datos fiscales (CUIT y condición)',prFiscOk(),'imp','pf_cuit']);
 if(cfMenuOn())L.push(['Horario del menú digital',!!(M.horario||'').trim(),'menu','mc_h']);return L}
/* índice del buscador: [texto, palabras clave, sección, campo] */
const CFIDX=[['Nombre del negocio','razon social titulo marca','neg','cf_n'],['Dirección','domicilio calle ubicacion mapa','neg','cf_d'],['Teléfono / WhatsApp','celular telefono whatsapp contacto','neg','cf_t'],['Correo','mail email','neg','cf_m'],['Facebook','redes','neg','cf_f'],['Instagram','redes ig','neg','cf_i'],
 ['Módulos','prender apagar activar desactivar modulos','mod',''],['Menú digital y pedidos (módulo)','tienda pedidos web','mod',''],['Club y fidelización (módulo)','puntos socios','mod',''],['Garantías (módulo)','serie reclamos','mod',''],['Tareas (módulo)','organigrama mi dia','mod',''],['RR. HH. avanzado (módulo)','legajos sueldos asistencia licencias','mod',''],
 ['Traspasos entre cajas sin rubro','caja traspaso rubro','fun','sw_traspasoSinRubro'],['IVA en órdenes nuevas','iva impuesto factura','fun','sw_ivaDef'],['Recepción cobra y entrega','recepcion cobrar entregar permisos','fun','sw_recepCobra'],
 ['Precios de mano de obra','servicios tarifas catalogo precio','mo','cfmoq'],['Aumentar precios por porcentaje','inflacion aumento ajuste masivo','mo','cfmopct'],['Agregar servicio','nuevo servicio','mo','sv_n'],
 ['Frase de bienvenida del menú','menu bienvenida saludo','menu','mc_b'],['Horario de atención','horarios menu','menu','mc_h'],['Mostrar precios en el menú','consultar precios','menu',''],['Acceso oculto desde el logo','doble clic logo panel ingresar secreto','menu','sw_accOculto'],
 ['CUIT y condición frente a ARCA del negocio','fiscal cuit iibb ingresos brutos inicio actividades razon social monotributo responsable inscripto','imp','pf_cuit'],['Formato de impresión (A4 o ticket)','impresora ticket 80 58 termica papel','imp','pf_fmt'],['Texto al pie y condiciones de garantía','pie ticket garantia leyenda','imp','pf_pie'],
 ['Usuarios y claves','personal clave pin contraseña roles permisos','acc',''],['Mi clave','cambiar mi clave pin','acc',''],
 ['Respaldo','backup copia exportar importar restaurar excel','dat',''],['Borrar o restablecer datos','reset borrar','dat',''],['Auditoría','historial movimientos quien hizo','aud','cfauq']];

V.config=()=>{if(ME.rol!=='dueno')return '<div class="card"><p>Sólo el dueño puede ver la configuración.</p></div>';
 const T=cfTabs();if(!T.some(t=>t[0]===UI.cfTab))UI.cfTab='neg';const ck=cfChecks(),ok=ck.filter(x=>x[1]).length,pc=Math.round(ok*100/ck.length);
 const cnt={imp:ck.filter(x=>x[2]==='imp'&&!x[1]).length,neg:ck.filter(x=>x[2]==='neg'&&!x[1]).length,mo:cfSinPrecio(),dat:(cfBkDias()===null||cfBkDias()>7)?1:0};
 const body={neg:cfNeg,mod:cfMod,fun:cfFun,mo:cfMo,menu:cfMenu,imp:cfImp,acc:cfAcc,dat:cfDat,aud:cfAud}[UI.cfTab]();
 return '<div class="cfhead"><h2>Configuración</h2><div class="cfsrch"><input id="cfq" type="search" placeholder="Buscar un ajuste… (ej.: IVA, horario, clave)" autocomplete="off" data-chg="cfq" aria-label="Buscar un ajuste" aria-controls="cfres"><div id="cfres" class="cfres" hidden></div></div></div>'+
 (pc<100?'<div class="card"><div class="cfprog"><b>Puesta en marcha: '+pc+' %</b><div class="cfbar" role="progressbar" aria-valuenow="'+pc+'" aria-valuemin="0" aria-valuemax="100" aria-label="Puesta en marcha"><i style="width:'+pc+'%"></i></div><span class="sm mut">'+ok+' de '+ck.length+' listos</span></div><div class="cfmiss"><span class="sm mut" style="align-self:center">Te falta:</span>'+ck.filter(x=>!x[1]).map(x=>'<button data-act="cfgo" data-t="'+x[2]+'" data-f="'+x[3]+'">＋ '+h(x[0])+'</button>').join('')+'</div></div>':'')+
 '<div class="cfx"><nav class="cfnav" aria-label="Secciones de configuración">'+T.map(t=>'<button data-act="cftab" data-t="'+t[0]+'" class="'+(UI.cfTab===t[0]?'on':'')+'"'+(UI.cfTab===t[0]?' aria-current="page"':'')+'><span aria-hidden="true">'+t[1]+'</span>'+h(t[2])+(cnt[t[0]]?'<span class="cnt" aria-label="'+cnt[t[0]]+' pendientes">'+cnt[t[0]]+'</span>':'')+'</button>').join('')+'</nav><div id="cfbody">'+body+'</div></div>'};

const cfSw=(id,on,attrs,dis)=>'<span class="sw"><input type="checkbox" role="switch" id="'+id+'"'+(on?' checked':'')+' '+attrs+(dis?' disabled':'')+'><span></span></span>';
const cfOk=k=>'<span class="cfok" id="ok_'+k+'" aria-live="polite">✓ Guardado</span>';
function cfFlash(k){const e=document.getElementById('ok_'+k);if(!e)return;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),1600)}

function cfNeg(){const c=DB.cfg;const F=[['cf_n','nombre','Nombre','',''],['cf_d','dir','Dirección','',''],['cf_t','tel','Teléfono / WhatsApp','tel','Con característica, sin 0 ni 15. Ej.: 387 4484132'],['cf_m','mail','Correo','email',''],['cf_f','fb','Facebook','','Nombre de la página'],['cf_i','ig','Instagram','','Usuario, sin @']];
 return '<div class="g2" style="align-items:start"><div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Datos del negocio</h3>'+cfOk('neg')+'</div><p class="sm mut">Se guardan solos mientras escribís. Salen en el menú digital, en los comprobantes y en los mensajes de WhatsApp.</p>'+
 F.map(f=>'<div class="f"><label for="'+f[0]+'">'+f[2]+'</label><input id="'+f[0]+'"'+(f[3]?' type="'+f[3]+'"':'')+' value="'+h(c[f[1]]||'')+'" data-chg="cfauto" data-f="'+f[1]+'" autocomplete="off">'+(f[4]?'<span class="sm mut">'+f[4]+'</span>':'')+(f[1]==='nombre'?'<div class="cferr" id="er_nombre"></div>':'')+'</div>').join('')+'</div>'+
 '<div class="card"><h3>Así lo ven tus clientes</h3><div class="cfprev" id="cfprev">'+cfPrevHTML()+'</div><p class="sm mut" style="margin-top:8px">Vista previa del encabezado del menú digital y de los comprobantes.</p></div></div>'}
function cfPrevHTML(){const c=DB.cfg;return '<img src="'+LOGO+'" alt=""><h3>'+h(c.nombre||'Nombre del negocio')+'</h3><p>📍 '+h(c.dir||'Dirección')+'</p><p>📞 '+h(c.tel||'Teléfono')+(c.mail?' · ✉️ '+h(c.mail):'')+'</p>'+((c.ig||c.fb)?'<p>'+(c.ig?'Instagram @'+h(c.ig):'')+(c.ig&&c.fb?' · ':'')+(c.fb?'Facebook '+h(c.fb):'')+'</p>':'')}
let cfT=null;CHG.cfauto=t=>{if(ME.rol!=='dueno')return;const f=t.dataset.f;let v=t.value.trim();if(f==='ig')v=v.replace(/^@+/,'');
 if(f==='nombre'){const e=$('#er_nombre');if(v.length<3){if(e)e.textContent='El nombre necesita al menos 3 letras (no se guarda hasta corregirlo).';t.setAttribute('aria-invalid','true');return}if(e)e.textContent='';t.removeAttribute('aria-invalid')}
 DB.cfg[f]=v;const p=$('#cfprev');if(p)p.innerHTML=cfPrevHTML();clearTimeout(cfT);cfT=setTimeout(()=>{const a=DB.audit[0];if(!(a&&a.a==='Datos del negocio editados'&&a.d===f&&Date.now()-a.t<120000))audit('Datos del negocio editados',f);save();cfFlash('neg');if(f==='nombre')document.title=DB.cfg.nombre},450)};

function cfMod(){const M=DB.cfg.mods||{};return '<div class="card"><h3>Módulos</h3><p class="sm mut">Prendé solamente lo que usa el negocio. Apagar un módulo lo oculta del menú; los datos quedan guardados y vuelven al prenderlo.</p><div class="cfmods">'+
 MODS.map(m=>{const on=M[m[0]]!==false;return '<div class="cfmod'+(on?'':' off')+'"><div class="hd"><label for="md_'+m[0]+'" style="font-weight:700;color:var(--tx);margin:0">'+h(m[1])+'</label>'+cfSw('md_'+m[0],on,'data-chg="uxmod" data-k="'+m[0]+'"')+'</div><span class="sm mut">'+h(m[2])+'</span>'+(on&&m[0]!=='rrhh'?'<button class="btn s" style="align-self:flex-start" data-act="go" data-v="'+m[0]+'">Abrir →</button>':on?'<button class="btn s" style="align-self:flex-start" data-act="go" data-v="personal">Abrir Personal →</button>':'<span class="sm mut">Apagado</span>')+'</div>'}).join('')+'</div></div>'}

function cfFun(){const c=DB.cfg;const R=[['ivaDef',c.ivaDef!==false,'IVA en las órdenes nuevas','Las órdenes nuevas se crean con IVA. Siempre se puede quitar en cada orden.'],
 ['recepCobra',!!c.recepCobra,'Recepción puede cobrar y entregar','Por defecto cobran y entregan vehículos sólo el dueño y el jefe de taller.'],
 ['traspasoSinRubro',!!c.traspasoSinRubro,'Traspasos entre cajas sin elegir rubro','Usa el concepto interno oculto “Traspaso interno”. El rubro sigue siendo obligatorio en ingresos y egresos de caja.']];
 return '<div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Cómo funciona el taller</h3>'+cfOk('fun')+'</div>'+R.map(r=>'<div class="cfrow"><div class="t"><label for="sw_'+r[0]+'" style="margin:0;color:var(--tx)"><b>'+r[2]+'</b></label><span class="sm mut">'+r[3]+'</span></div>'+cfSw('sw_'+r[0],r[1],'data-chg="cfflag" data-f="'+r[0]+'"')+'</div>').join('')+'</div>'}
{const _f=CHG.cfflag;CHG.cfflag=t=>{if(ME.rol!=='dueno')return;_f(t);cfFlash('fun')}}

function cfMo(){const q=norm(UI.cfMoQ),F=UI.cfMoF,A=typeof AREAS!=='undefined'?AREAS:[];
 const L=DB.servicios.filter(s=>(!q||norm(s.n).includes(q))&&(!F||(F==='sin'?!(s.pu>0):s.area===F)));const sp=cfSinPrecio();
 return '<div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Mano de obra ('+DB.servicios.length+' servicios)</h3>'+cfOk('mo')+'</div><p class="sm mut">Precio neto, sin IVA. Se guarda al escribir. Las órdenes ya cargadas no cambian.</p>'+
 '<div class="row" style="margin-bottom:8px"><input id="cfmoq" type="search" style="max-width:260px" placeholder="Buscar servicio…" value="'+h(UI.cfMoQ)+'" data-chg="cfmoq" aria-label="Buscar servicio"><div class="chips"><button class="chip'+(F?'':' on')+'" data-act="cfmof" data-v="">Todos</button>'+(sp?'<button class="chip'+(F==='sin'?' on':'')+'" data-act="cfmof" data-v="sin">⚠️ Sin precio ('+sp+')</button>':'')+A.filter(a=>DB.servicios.some(s=>s.area===a[0])).map(a=>'<button class="chip'+(F===a[0]?' on':'')+'" data-act="cfmof" data-v="'+a[0]+'">'+a[2]+' '+h(a[1])+'</button>').join('')+'</div></div>'+
 '<div class="tw" style="max-height:440px"><table class="itbl"><thead><tr><th>Servicio</th><th class="n">Precio neto</th><th class="n">Con IVA</th><th></th></tr></thead><tbody>'+(L.length?L.map(s=>'<tr><td>'+h(s.n)+'</td><td><input style="max-width:140px;margin-left:auto;display:block;text-align:right'+(s.pu>0?'':';border-color:#c62828')+'" inputmode="decimal" data-chg="cfserv" data-id="'+s.id+'" value="'+(s.pu||'')+'" placeholder="0" aria-label="Precio '+h(s.n)+'"></td><td class="n sm" id="pi_'+s.id+'">'+(s.pu>0?fmt(s.pu*1.21):'—')+'</td><td><button class="btn s d" data-act="servdel" data-id="'+s.id+'" aria-label="Quitar '+h(s.n)+'">✕</button></td></tr>').join(''):'<tr><td colspan="4" class="mut c">No hay servicios con ese filtro.</td></tr>')+'</tbody></table></div>'+
 '<div class="g2" style="margin-top:12px;align-items:end"><div class="row" style="align-items:end"><div class="f" style="flex:1"><label for="sv_n">Nuevo servicio</label><input id="sv_n"></div><div class="f"><label for="sv_p">Precio neto</label><input id="sv_p" inputmode="decimal" style="max-width:130px"></div><button class="btn p" data-act="servadd">Agregar</button></div>'+
 '<div class="row" style="align-items:end"><div class="f"><label for="cfmopct">Aumentar o bajar en %</label><input id="cfmopct" inputmode="decimal" placeholder="Ej.: 10 o -5" style="max-width:130px"></div><button class="btn" data-act="cfmopct">Aplicar a '+(L.length===DB.servicios.length?'todos':'los '+L.filter(s=>s.pu>0).length+' filtrados')+'</button></div></div></div>'}
CHG.cfmoq=t=>{UI.cfMoQ=t.value;const p=t.selectionStart;renderView();const n=$('#cfmoq');if(n){n.focus();try{n.setSelectionRange(p,p)}catch(e){}}};
ACT.cfmof=d=>{UI.cfMoF=d.v;renderView()};
CHG.cfserv=t=>{if(ME.rol!=='dueno')return;const s=DB.servicios.find(x=>x.id===t.dataset.id);if(!s)return;const raw=t.value.trim();const v=raw===''?0:numAR(raw);if(!(v>=0)){t.style.borderColor='#c62828';return}t.style.borderColor=v>0?'':'#c62828';s.pu=v;save();const e=document.getElementById('pi_'+t.dataset.id);if(e)e.textContent=v>0?fmt(v*1.21):'—';clearTimeout(t._t);t._t=setTimeout(()=>cfFlash('mo'),400)};
ACT.cfmopct=()=>{const p=num(val('cfmopct'));if(!isFinite(p)||!p||p<-90||p>300){toast('Escribí un porcentaje entre -90 y 300.',1);return}
 const q=norm(UI.cfMoQ),F=UI.cfMoF;const L=DB.servicios.filter(s=>s.pu>0&&(!q||norm(s.n).includes(q))&&(!F||(F==='sin'?false:s.area===F)));if(!L.length){toast('No hay servicios con precio en el filtro.',1);return}
 confirmBox((p>0?'Aumentar':'Bajar')+' '+Math.abs(p)+' % el precio de '+L.length+' servicio(s). Se redondea a la decena. Las órdenes ya cargadas no cambian. ¿Continuar?',()=>{L.forEach(s=>{s.pu=Math.max(0,Math.round(s.pu*(1+p/100)/10)*10)});audit('Precios de mano de obra ajustados',(p>0?'+':'')+p+' % · '+L.length+' servicios');save();renderView();toast('Precios actualizados')},'Aplicar')};

function cfMenu(){const on=DB.cfg.accOculto!==false;
 const w=webCfgHTML().replace('Configuración → Datos del taller','Configuración → Datos del negocio').replace(/<label style="font-weight:500;color:var\(--tx\);display:block;margin-top:6px"><input type="checkbox" style="width:auto;min-height:0" data-chg="menucfg" data-f="(\w+)"( disabled)?( checked)?> ([^<]*)<\/label>/g,(m,f,dis,chk,tx)=>'<div class="cfrow"><div class="t"><label for="mw_'+f+'" style="margin:0;color:var(--tx)"><b>'+tx+'</b></label></div>'+cfSw('mw_'+f,!!chk,'data-chg="menucfg" data-f="'+f+'"',!!dis)+'</div>');
 return w+
 '<div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Acceso oculto al panel</h3>'+cfOk('acc')+'</div><div class="cfrow"><div class="t"><label for="sw_accOculto" style="margin:0;color:var(--tx)"><b>Doble clic en el logo del menú abre el ingreso al sistema</b></label><span class="sm mut">En el celular es un doble toque sobre el logo. No se ve ningún botón: sólo lo sabe el equipo. Igual pide usuario y clave.</span></div>'+cfSw('sw_accOculto',on,'data-chg="cfacc"')+'</div>'+
 '<div class="row"><a class="btn" href="'+h(menuURL())+'" target="_blank" rel="noopener">📱 Abrir el menú digital</a><button class="btn" data-act="go" data-v="webp">Productos, pedidos y turnos →</button></div></div>'}
CHG.cfacc=t=>{if(ME.rol!=='dueno')return;DB.cfg.accOculto=t.checked;audit('Acceso oculto desde el logo',t.checked?'activado':'apagado');save();cfFlash('acc')};

function cfImp(){const P=prCfg(),F=DB.cfg.fisc;return '<div class="g2" style="align-items:start"><div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Datos fiscales del negocio</h3>'+cfOk('imp')+'</div><p class="sm mut">Salen en el encabezado de los comprobantes y sirven para sugerir la letra de la factura. Copialos tal cual figuran en ARCA.</p>'+
 '<div class="f"><label for="pf_raz">Razón social (si es distinta del nombre)</label><input id="pf_raz" value="'+h(F.razon)+'" data-chg="cffis" data-f="razon"></div>'+
 '<div class="f"><label for="pf_cond">Condición frente al IVA</label><select id="pf_cond" data-chg="cffis" data-f="cond">'+PR_EMI.map(x=>'<option value="'+x[0]+'"'+(F.cond===x[0]?' selected':'')+'>'+x[1]+'</option>').join('')+'</select></div>'+
 '<div class="f"><label for="pf_cuit">CUIT</label><input id="pf_cuit" inputmode="numeric" value="'+h(F.cuit)+'" data-chg="cffis" data-f="cuit" placeholder="20-12345678-9"><div class="cferr" id="er_cuit"></div></div>'+
 '<div class="g2"><div class="f"><label for="pf_iibb">Ingresos Brutos</label><input id="pf_iibb" value="'+h(F.iibb)+'" data-chg="cffis" data-f="iibb"></div><div class="f"><label for="pf_ini">Inicio de actividades</label><input id="pf_ini" type="date" value="'+h(F.inicio)+'" data-chg="cffis" data-f="inicio"></div></div></div>'+
 '<div class="card"><h3>Impresión</h3><div class="f"><label id="pf_fmt">Formato de tickets y comprobantes</label><div class="chips">'+[['a4','📄 Hoja A4'],['80','🧾 Ticket 80 mm'],['58','🧾 Ticket 58 mm']].map(f=>'<button class="chip'+(P.fmt===f[0]?' on':'')+'" data-act="prfmt" data-v="'+f[0]+'">'+f[1]+'</button>').join('')+'</div><span class="sm mut">Las constancias, estados de cuenta, órdenes de compra y la agenda salen siempre en A4.</span></div>'+
 '<div class="f"><label for="pf_pie">Texto al pie de tickets y comprobantes</label><input id="pf_pie" value="'+h(P.pie)+'" data-chg="cfprn" data-f="pie" maxlength="140"></div>'+
 '<div class="f"><label for="pf_gar">Condiciones de garantía (constancia de entrega)</label><textarea id="pf_gar" rows="4" data-chg="cfprn" data-f="gar">'+h(P.gar)+'</textarea></div>'+
 '<button class="btn" data-act="go" data-v="imprimir">🖨️ Ir a Impresiones →</button></div></div>'}
let cfFT=null;CHG.cffis=t=>{if(ME.rol!=='dueno')return;prCfg();const f=t.dataset.f;let v=t.value.trim();
 if(f==='cuit'){const e=$('#er_cuit');if(v&&!cuitOk(v)){if(e)e.textContent='CUIT inválido: son 11 números y el último es el dígito verificador.';t.setAttribute('aria-invalid','true');return}if(e)e.textContent='';t.removeAttribute('aria-invalid');if(v)v=cuitFmt(v)}
 DB.cfg.fisc[f]=v;clearTimeout(cfFT);cfFT=setTimeout(()=>{audit('Datos fiscales del negocio',f);save();cfFlash('imp')},450)};
let cfPT=null;CHG.cfprn=t=>{if(ME.rol!=='dueno')return;prCfg()[t.dataset.f]=t.value.trim();clearTimeout(cfPT);cfPT=setTimeout(()=>{save();cfFlash('imp')},450)};
function cfAcc(){const S=[['personal','👷 Personal: usuarios y claves','Agregar personas, elegir su puesto (permisos) y darles o cambiarles la clave.'],['__mipin','🔑 Mi clave','Cambiar tu propia clave de ingreso.']].concat(modOn('tareas')?[['tareas','🗂️ Qué le toca a cada puesto','Responsabilidades por puesto, base del organigrama de tareas.']]:[]);
 return '<div class="card"><h3>Usuarios y accesos</h3><div class="cfsc">'+S.map(s=>'<button '+(s[0]==='__mipin'?'data-act="mipin"':'data-act="go" data-v="'+s[0]+'"')+'><b>'+s[1]+'</b><span>'+s[2]+'</span></button>').join('')+'</div>'+
 '<p class="sm mut" style="margin-top:12px">Si alguien de tu equipo olvida su clave, se la cambiás vos desde Personal. Si el dueño olvida la suya, en la pantalla de ingreso está “Olvidé la clave del dueño”, que usa el código de recuperación que anotaste al crear el sistema.</p></div>'}

function cfDat(){const d=cfBkDias();return '<div class="card'+(d===null||d>7?' cfdanger':'')+'"><h3>Respaldo</h3><p>'+(d===null?'<b>Todavía no hiciste ningún respaldo.</b>':'Último respaldo: <b>'+ftime(DB.cfg.lastBackup)+'</b> ('+(d===0?'hoy':'hace '+d+(d===1?' día':' días'))+').')+'</p><p class="sm mut">Los datos viven sólo en este navegador y este equipo. Hacé un respaldo al menos una vez por semana y guardalo fuera del equipo.</p>'+
 '<div class="row"><button class="btn p" data-act="go" data-v="datos">💾 Respaldo, exportar e importar (Excel) →</button><label class="btn" style="margin:0">Restaurar respaldo .json<input type="file" accept=".json,application/json" id="cf_imp" hidden data-chg="cfimp"></label></div></div>'+
 '<div class="card cfdanger"><h3>Zona delicada</h3><p class="sm mut">'+(MODO==='practica'?'Vuelve a cargar los datos de ejemplo.':'Borra todos los datos reales de este navegador. Hacé un respaldo antes.')+'</p><button class="btn d" data-act="cfreset">'+(MODO==='practica'?'Restablecer datos de práctica':'Borrar todos los datos')+'</button></div>'}

function cfAud(){const q=norm(UI.cfAuQ);const L=DB.audit.filter(a=>!q||norm(a.u+' '+a.a+' '+a.d).includes(q));
 return '<div class="card"><h3>Auditoría</h3><input id="cfauq" type="search" style="max-width:320px;margin-bottom:8px" placeholder="Filtrar por usuario o acción…" value="'+h(UI.cfAuQ)+'" data-chg="cfauq" aria-label="Filtrar auditoría"><div class="tw" style="max-height:460px"><table><thead><tr><th>Cuándo</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>'+(L.slice(0,200).map(a=>'<tr><td>'+ftime(a.t)+'</td><td>'+h(a.u)+'</td><td>'+h(a.a)+'</td><td>'+h(a.d)+'</td></tr>').join('')||'<tr><td colspan="4" class="mut c">Sin movimientos.</td></tr>')+'</tbody></table></div><p class="sm mut">Se guardan los últimos 400 movimientos.</p></div>'}
CHG.cfauq=t=>{UI.cfAuQ=t.value;const p=t.selectionStart;renderView();const n=$('#cfauq');if(n){n.focus();try{n.setSelectionRange(p,p)}catch(e){}}};

ACT.cftab=d=>{UI.cfTab=d.t;renderView();const b=$('#cfbody');if(b&&b.getBoundingClientRect().top<0)b.scrollIntoView({block:'start'})};
ACT.cfgo=d=>{UI.cfTab=d.t;if(d.t==='mo'&&d.f==='cfmoq'&&cfSinPrecio())UI.cfMoF='sin';renderView();setTimeout(()=>{const e=d.f&&document.getElementById(d.f);const tg=e?(e.closest('.cfrow')||e.closest('.f')||e):$('#cfbody .card');if(tg){tg.scrollIntoView({block:'center',behavior:'smooth'});tg.classList.add('cfhit');setTimeout(()=>tg.classList.remove('cfhit'),1700)}if(e&&e.focus)e.focus({preventScroll:true})},30)};
CHG.cfq=t=>{const r=$('#cfres');if(!r)return;const q=norm(t.value.trim());if(!q){r.hidden=true;r.innerHTML='';return}
 const tabs=cfTabs().map(x=>x[0]);const W=q.split(/\s+/);const wd=s=>norm(s).split(/[^a-z0-9ñ]+/).filter(Boolean);
 const hit=(s,w)=>wd(s).some(p=>p.startsWith(w))||(w.length>3&&typeof fz==='function'&&wd(s).some(p=>Math.abs(p.length-w.length)<=2&&fz(p,w)));
 const R=CFIDX.map(x=>[x,W.every(w=>hit(x[0],w))?2:W.every(w=>hit(x[0]+' '+x[1],w))?1:0]).filter(x=>x[1]&&tabs.includes(x[0][2])).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).slice(0,7);
 const N=Object.fromEntries(cfTabs().map(x=>[x[0],x[2]]));r.innerHTML=R.length?R.map(x=>'<button data-act="cfgo" data-t="'+x[2]+'" data-f="'+x[3]+'">'+h(x[0])+'<small>'+h(N[x[2]])+'</small></button>').join(''):'<div class="sm mut" style="padding:10px 12px">No encontré ese ajuste.</div>';r.hidden=false};
document.addEventListener('keydown',e=>{const t=e.target;if(!t||t.id!=='cfq')return;const r=$('#cfres');if(e.key==='Enter'){const b=r&&r.querySelector('button');if(b){e.preventDefault();b.click()}}else if(e.key==='Escape'){t.value='';if(r)r.hidden=true}else if(e.key==='ArrowDown'){const b=r&&r.querySelector('button');if(b){e.preventDefault();b.focus()}}});
document.addEventListener('keydown',e=>{const t=e.target;if(!t||!t.closest||!t.closest('#cfres'))return;if(e.key==='ArrowDown'&&t.nextElementSibling){e.preventDefault();t.nextElementSibling.focus()}else if(e.key==='ArrowUp'){e.preventDefault();(t.previousElementSibling||$('#cfq')).focus()}else if(e.key==='Escape'){$('#cfres').hidden=true;$('#cfq').focus()}});
document.addEventListener('click',e=>{const r=$('#cfres');if(r&&!r.hidden&&!(e.target.closest&&e.target.closest('.cfsrch')))r.hidden=true});
if(typeof UX_DESC!=='undefined')UX_DESC.config='Todo lo que se ajusta del sistema, por secciones. Usá el buscador de arriba para llegar directo a un ajuste. Los cambios se guardan solos.';
if(typeof UXKW!=='undefined')UXKW.config=(UXKW.config||'')+' ajustes preferencias opciones iva precios horario clave usuarios acceso oculto logo';

/* ---- Acceso oculto: doble clic / doble toque sobre el logo del menú público ---- */
(function(){let last=0,lx=0,ly=0,yendo=false;const sel='#pub .ph img';
 const ir=()=>{if(yendo||DB.cfg.accOculto===false)return;yendo=true;const u=location.href.split('#')[0]+sysHash();if(u===location.href)location.reload();else location.href=u};
 document.addEventListener('dblclick',e=>{if(e.target.closest&&e.target.closest(sel)){e.preventDefault();ir()}});
 document.addEventListener('touchend',e=>{if(!(e.target.closest&&e.target.closest(sel))||e.changedTouches.length!==1)return;const p=e.changedTouches[0],n=Date.now();
  if(n-last<450&&Math.abs(p.clientX-lx)<40&&Math.abs(p.clientY-ly)<40){e.preventDefault();last=0;ir()}else{last=n;lx=p.clientX;ly=p.clientY}},{passive:false});
 document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest(sel))e.preventDefault()})})();
