/* ===================================================================
   Sistema VB · capa de experiencia de uso (esqueleto V27.2, sección 7)
   Barra lateral por secciones · barra superior (Ctrl + K, avisos, tema, usuario)
   tema claro / oscuro / automático · ayuda en contexto · panel «Hoy»
   tablero del turno de caja · módulos activables · créditos completos
   No quita funciones: reordena y agrega sobre lo existente.
   =================================================================== */
(function(){const st=document.createElement('style');st.id='vbux';st.textContent=`
:root{--acc:var(--azul);--on-acc:#fff;--zebra:#fafbfc;--hov:#f1f5fb;--shadow:0 1px 2px rgba(16,24,40,.06),0 1px 3px rgba(16,24,40,.08)}
#top{display:none!important}
#uxtop{position:sticky;top:0;z-index:25;background:var(--card);border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:8px;padding:8px 18px;min-height:58px;flex-wrap:wrap}
#uxtop .nm{font-weight:800;font-size:1.02rem;margin-right:4px}
#uxtop .chip2{display:inline-flex;align-items:center;gap:5px;font-size:.76rem;font-weight:700;border-radius:999px;padding:3px 10px;border:1px solid transparent;white-space:nowrap}
.c-ok{background:#e7f6ec;color:#17643a}.c-warn{background:#fff4e0;color:#7a4b00}.c-bad{background:#fdecec;color:#9b1c1c}.c-inf{background:#ecebff;color:#3b2f9e}.c-mut{background:#eef1f4;color:#475467}
#uxtop .tb{border:1px solid var(--bd);background:var(--card);color:var(--tx);border-radius:10px;min-height:44px;min-width:44px;padding:0 12px;display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;position:relative;text-decoration:none}
#uxtop .tb:hover{border-color:var(--acc)}
#uxtop .srch{min-width:220px;justify-content:flex-start;color:var(--mut);font-weight:500}
#uxtop .tb,#uxtop kbd{white-space:nowrap}#uxtop kbd,.uxk kbd,#side kbd{font:600 .72rem/1 ui-monospace,Menlo,Consolas,monospace;border:1px solid currentColor;border-radius:5px;padding:2px 5px;opacity:.85;margin-left:auto}
#uxtop .bell b{position:absolute;top:-6px;right:-6px;background:var(--bad);color:#fff;border-radius:999px;font-size:.7rem;min-width:20px;height:20px;display:flex;align-items:center;justify-content:center;padding:0 5px}
#uxtop .usr{display:inline-flex;align-items:center;gap:8px;font-size:.86rem}
#uxtop .usr .av{width:34px;height:34px}
#uxtop .ham{display:none}
@media(max-width:900px){#uxtop{padding:8px 10px}#uxtop .ham{display:inline-flex}#uxtop .srch{min-width:0}#uxtop .srch span,#uxtop .usr .t,#uxtop .hide-m{display:none}}
#uxbell{position:absolute;right:10px;top:60px;width:min(420px,calc(100vw - 20px));max-height:70vh;overflow:auto;background:var(--card);border:1px solid var(--bd);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.18);z-index:60;padding:8px}
#uxbell button{display:flex;gap:10px;align-items:flex-start;width:100%;text-align:left;background:none;border:0;border-radius:8px;padding:10px;cursor:pointer;color:var(--tx);min-height:44px}
#uxbell button:hover{background:var(--hov)}
/* barra lateral */
#side .brand{display:flex;align-items:center;gap:10px;text-align:left;background:transparent;padding:14px 14px 10px}
#side .brand img{width:46px;height:46px;object-fit:contain;background:#fff;border-radius:10px;padding:3px;margin:0}
#side .brand .bn{font-weight:800;color:#fff;line-height:1.15}#side .brand .bs{font-size:.72rem;color:#9aa1ab}
#side .uxp{display:flex;flex-direction:column;gap:6px;padding:4px 10px 6px}
#side .uxp button{display:flex;align-items:center;gap:10px;width:100%;border:0;border-radius:12px;padding:12px 14px;min-height:48px;font-weight:800;cursor:pointer;background:var(--acc);color:var(--on-acc);box-shadow:0 4px 14px rgba(0,0,0,.25)}
#side .uxp button.b2{background:#2f333a;color:#fff;box-shadow:none;font-weight:700}
#side .uxp button:hover{filter:brightness(1.07)}
#side .uxs{margin-top:6px}
#side .uxs>.sh{display:flex;align-items:center;width:100%;background:none;border:0;color:#9aa3af;font-size:.8rem;font-weight:700;text-transform:none;letter-spacing:.01em;padding:10px 12px 6px;cursor:pointer;min-height:36px}
#side .uxs>.sh::after{content:'▾';margin-left:auto;transition:transform .15s}
#side .uxs.cl>.sh::after{transform:rotate(-90deg)}#side .uxs.cl>.si{display:none}
#side nav button.on{background:var(--acc);color:var(--on-acc)}
#side .badge2.y{background:#f5b301;color:#1d2127}
/* contenido */
.uxdesc{color:var(--mut);margin:-4px 0 12px;max-width:900px;font-size:.93rem}
#view{animation:uxin .16s ease-out}@keyframes uxin{from{opacity:.4;transform:translateY(3px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){#view{animation:none}*{transition:none!important}}
.card,.kpi{box-shadow:var(--shadow);transition:box-shadow .15s,transform .15s}
.kpi:hover{box-shadow:0 6px 18px rgba(16,24,40,.12);transform:translateY(-1px)}
.card{border-radius:14px}.kpi{border-radius:14px}
tbody tr:nth-child(even) td{background:var(--zebra)}tbody tr:hover td{background:var(--hov)}
.btn,.chip,input,select{min-height:44px}.btn.s{min-height:36px}
.empty{text-align:center;color:var(--mut);padding:26px 10px}
/* panel Hoy */
.hoy{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:12px}
.hoy .kpi .v{font-size:1.6rem}.trend{display:flex;gap:6px;align-items:center;font-size:.82rem}
.hoy2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:12px;margin-bottom:14px}
.ulist .it2{display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--bd)}
@media(max-width:900px){.hoy{grid-template-columns:repeat(2,minmax(0,1fr))}.hoy2{grid-template-columns:1fr}}
/* tablero del turno */
.turno{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:12px;margin-bottom:12px}
.steps4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.steps4 button{border:1px solid var(--bd);background:var(--card);border-radius:12px;padding:10px;text-align:left;cursor:pointer;min-height:64px;color:var(--tx)}
.steps4 button.now{border-color:var(--acc);box-shadow:0 0 0 2px var(--acc) inset}.steps4 button.ok{opacity:.75}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px}.dot.g{background:#1f9d55;box-shadow:0 0 0 4px rgba(31,157,85,.18)}.dot.r{background:#d32f2f}.dot.x{background:#98a2b3}
@media(max-width:900px){.turno{grid-template-columns:1fr}.steps4{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* paleta Ctrl + K */
#uxk{position:fixed;inset:0;background:rgba(10,14,22,.5);z-index:80;display:flex;justify-content:center;align-items:flex-start;padding:8vh 12px}
#uxk .bx{width:min(640px,100%);background:var(--card);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:12px}
#uxk input{font-size:1.05rem;min-height:50px;border:2px solid var(--acc)}
#uxk .rs{max-height:56vh;overflow:auto;margin-top:8px}
#uxk .rs button{display:flex;gap:10px;align-items:center;width:100%;text-align:left;border:1px solid transparent;background:none;border-radius:10px;padding:9px 10px;cursor:pointer;min-height:48px;color:var(--tx)}
#uxk .rs button.on{background:var(--hov);border-color:var(--acc)}
#uxk .rs small{display:block;color:var(--mut)}
/* contraste AA en claro (corrige colores de base que quedaban por debajo de 4,5:1) */
:root{--ok:#18794a}
#side .badge2,.btn.d{background:#c62828;border-color:#c62828}
#side .mut,#side .who .mut{color:#a7afbb}
.vbb a.w{background:#1e7e34}.vbb a.m{background:#c2410c}.vbb a.t{background:#2f5fc2}
.tb.Confirmado{background:#18794a}.tb.Pendiente{background:#8a5a00}.tb.Taller{background:#5b34a8}.tb.Cancelado{background:#5f6670}
#uxtop .bell b{top:2px;right:2px}
#uxtop{flex-wrap:nowrap}#uxtop .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px}
@media(max-width:1500px){#uxtop .c-mut{display:none}#uxtop .srch{min-width:180px}#uxtop .srch span{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
@media(max-width:1280px){#uxtop .lbl{display:none}#uxtop .srch span{display:none}#uxtop .srch{min-width:0}}
@media(max-width:600px){#uxtop .usr,#uxtop .chip2{display:none}#uxtop .nm{max-width:140px}#uxtop{gap:6px}}@media(max-width:380px){#uxtop .nm{max-width:96px;font-size:.92rem}#uxtop .tb{padding:0 9px}}
/* tema oscuro: sólo variables + superficies que tenían blanco fijo */
html[data-theme=dark]{--bg:#121417;--card:#1c1f24;--bd:#353a43;--tx:#e9ebef;--mut:#a7afbb;--zebra:#20242a;--hov:#262b33;--grafito:#4b515b;--shadow:0 1px 2px rgba(0,0,0,.4);color-scheme:dark}
html[data-theme=dark] body{background:var(--bg)}
html[data-theme=dark] .btn,html[data-theme=dark] input,html[data-theme=dark] select,html[data-theme=dark] textarea,html[data-theme=dark] .chip,html[data-theme=dark] .kpi,html[data-theme=dark] .tw,html[data-theme=dark] .ucard,html[data-theme=dark] .lbox,html[data-theme=dark] .mbox,html[data-theme=dark] .tk,html[data-theme=dark] .org .nd,html[data-theme=dark] .steps4 button{background:var(--card);color:var(--tx);border-color:var(--bd)}
html[data-theme=dark] .btn:hover{background:#262b33}
html[data-theme=dark] .btn.p{background:#3b82f6;border-color:#3b82f6;color:#fff}html[data-theme=dark] .btn.d{background:#c62828;border-color:#c62828;color:#fff}
html[data-theme=dark] .chip.on{background:#e9ebef;color:#121417;border-color:#e9ebef}
html[data-theme=dark] th{background:#23272e;color:#b9c0ca}html[data-theme=dark] td{border-color:#2c3038}
html[data-theme=dark] #login{background:linear-gradient(160deg,#121417,#1a1d22)}
html[data-theme=dark] .demoflag{background:#3a2e12;border-color:#6b5420;color:#ffe2a3}html[data-theme=dark] .demoflag a{color:#ffd37a}
html[data-theme=dark] .c-ok{background:#163a26;color:#9be2b6}html[data-theme=dark] .c-warn{background:#3d2c0c;color:#ffd38a}html[data-theme=dark] .c-bad{background:#401a1a;color:#ffb4b4}html[data-theme=dark] .c-inf{background:#26234d;color:#c9c5ff}html[data-theme=dark] .c-mut{background:#2a2f37;color:#c4cad3}
html[data-theme=dark] .badge{filter:brightness(.92)}
html[data-theme=dark] [style*="background:#f8fafc"],html[data-theme=dark] [style*="background:#fff8e6"],html[data-theme=dark] [style*="background:#eef6ff"],html[data-theme=dark] [style*="background:#fff"],html[data-theme=dark] [style*="background: #fff"]{background:var(--card)!important;color:var(--tx)!important}
html[data-theme=dark] .kb3 .col{background:#171a1e}
html[data-theme=dark] a:not(.btn):not(.vbb a):not(.pbanner a){color:#8ab4ff}html[data-theme=dark] .vbb a{color:#fff}
html[data-theme=dark] tr.clk:hover td{background:var(--hov)}html[data-theme=dark] tr.sel td{background:#1d3557}html[data-theme=dark] tr.low td{background:#3a300f}html[data-theme=dark] .kcol h4,html[data-theme=dark] .kcol h4 *{color:var(--tx)}html[data-theme=dark] .pbanner a{color:#ffe7a8!important}#uxtop .bell b{background:#c62828!important;color:#fff}
html[data-theme=dark] .mh,html[data-theme=dark] .mf{background:var(--card)}html[data-theme=dark] .dg>div{background:#23272e}
#pub .ph a.btn{background:#1e7e34;border-color:#1e7e34}#pub .pc .im .dst{background:#c62828}
html[data-theme=dark] .kcol{background:#171a1e}html[data-theme=dark] .det{background:var(--card);color:var(--tx)}html[data-theme=dark] .kc{background:var(--card);color:var(--tx);border-color:var(--bd)}
html[data-theme=dark] .tg{background:var(--card)}html[data-theme=dark] .tg .hd{background:#23272e;color:var(--tx);border-color:var(--bd)}html[data-theme=dark] .tg .hr,html[data-theme=dark] .tg .cell{border-color:#2c3038}html[data-theme=dark] .tg .cell:hover{background:#262b33}
html[data-theme=dark] .badge{background:#2f343c;color:#dfe3e8}html[data-theme=dark] .badge.ok{background:#163a26;color:#9be2b6}html[data-theme=dark] .badge.warn{background:#3d2c0c;color:#ffd38a}html[data-theme=dark] .badge.bad{background:#401a1a;color:#ffb4b4}
html[data-theme=dark] .pill{background:#2f343c;color:#dfe3e8}
html[data-theme=dark] .btn.p,html[data-theme=dark] .btn.p.s{background:#2563eb;border-color:#2563eb;color:#fff}
html[data-theme=dark] .pbanner a{color:#ffe7a8}
html[data-theme=dark]{--ok:#4ade80;--bad:#f87171;--warn:#fbbf24}
html[data-theme=dark] td.n[style*="color:var(--ok)"],html[data-theme=dark] [style*="color:var(--ok)"]{color:#4ade80!important}
html[data-theme=dark] .mut,html[data-theme=dark] label{color:var(--mut)}
`;document.head.appendChild(st)})();

/* ---------- tema claro / oscuro / automático ---------- */
const THEMES=[['auto','🌓','Automático'],['light','☀️','Claro'],['dark','🌙','Oscuro']];
function themePref(){try{return localStorage.getItem('vb.theme')||'auto'}catch(e){return 'auto'}}
function themeApply(){const p=themePref();const dark=p==='dark'||(p==='auto'&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches);if($('#pub')){document.documentElement.removeAttribute('data-theme');return}document.documentElement.setAttribute('data-theme',dark?'dark':'light')}
themeApply();try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',themeApply)}catch(e){}
ACT.uxtheme=()=>{const i=THEMES.findIndex(t=>t[0]===themePref());const n=THEMES[(i+1)%THEMES.length];try{localStorage.setItem('vb.theme',n[0])}catch(e){}themeApply();uxTop();toast('Tema: '+n[2])};

/* ---------- módulos activables (el dueño los prende o apaga) ---------- */
const MODS=[['webp','Menú digital y pedidos','Menú público con tienda, turnos online y pedidos por WhatsApp'],['club','Club y fidelización','Puntos, niveles, premios y recordatorios'],['garant','Garantías','Garantías automáticas con N.º de serie y reclamos'],['tareas','Tareas','Mi día, tablero del equipo y tareas recurrentes'],['rrhh','RR. HH. avanzado','Legajos, asistencia, licencias, organigrama y sueldos dentro de Personal']];
const modOn=k=>!DB.cfg.mods||DB.cfg.mods[k]!==false;
const _go=go;go=function(v){if(['webp','club','garant','tareas'].includes(v)&&!modOn(v)){toast('Ese módulo está apagado. El dueño lo activa en Configuración → Módulos.',1);v='dash'}_go(v)};

/* ---------- secciones de la barra lateral ---------- */
const UXSEC=[['op','Operación del taller',['dash','ot','turnos','ventas','caja']],['log','Logística e inventario',['repuestos','compras','equipo']],['cli','Clientes y fidelidad',['clientes','club','garant','webp']],['eq','Equipo',['personal','tareas']],['sys','Sistema',['seguridad','reportes','config']]];
function navClosed(){try{return JSON.parse(localStorage.getItem('vb.navc')||'[]')}catch(e){return[]}}
ACT.uxsec=d=>{let c=navClosed();c=c.includes(d.s)?c.filter(x=>x!==d.s):c.concat([d.s]);try{localStorage.setItem('vb.navc',JSON.stringify(c))}catch(e){}const s=$('#uxs_'+d.s);if(s){s.classList.toggle('cl');s.querySelector('.sh').setAttribute('aria-expanded',!s.classList.contains('cl'))}};
const canNewOT=()=>ME&&can('ot')&&ME.rol!=='mecanico'&&ME.rol!=='limpieza';
const _renderShellUX=renderShell;renderShell=function(){_renderShellUX();try{uxSide();uxTop()}catch(e){console.warn(e)}};
function uxSide(){const side=$('#side'),nav=side&&side.querySelector('nav');if(!nav)return;
 const b=side.querySelector('.brand');if(b)b.innerHTML='<img src="'+LOGO+'" alt="Logo de '+h(DB.cfg.nombre)+'"><div><div class="bn">'+h(DB.cfg.nombre)+'</div><div class="bs">Sistema VB</div></div>';
 const lnk=nav.querySelector('.navmenu');if(lnk)lnk.remove();
 const btn={};[...nav.querySelectorAll('button[data-v]')].forEach(x=>{btn[x.dataset.v]=x});
 ['webp','club','garant','tareas'].forEach(k=>{if(!modOn(k)&&btn[k]){btn[k].remove();delete btn[k]}});
 if(btn.personal&&!modOn('rrhh'))btn.personal.lastChild.nodeType===3&&(btn.personal.lastChild.textContent=btn.personal.lastChild.textContent.replace(' y RR. HH.',''));
 const used=new Set(),cl=navClosed();let html='<div class="uxp">'+(can('ventas')?'<button data-act="uxvender" aria-keyshortcuts="F1"><span aria-hidden="true">🛒</span>Vender<kbd>F1</kbd></button>':'')+(canNewOT()?'<button class="b2" data-act="uxnuevaot" aria-keyshortcuts="F2"><span aria-hidden="true">🔧</span>Nueva orden<kbd>F2</kbd></button>':'')+'</div>';
 const frag=document.createElement('div');
 UXSEC.forEach(s=>{const it=s[2].filter(v=>btn[v]);if(!it.length)return;it.forEach(v=>used.add(v));
  const sec=document.createElement('div');sec.className='uxs'+(cl.includes(s[0])?' cl':'');sec.id='uxs_'+s[0];sec.innerHTML='<button class="sh" data-act="uxsec" data-s="'+s[0]+'" aria-expanded="'+!cl.includes(s[0])+'">'+h(s[1])+'</button><div class="si"></div>';it.forEach(v=>sec.querySelector('.si').appendChild(btn[v]));frag.appendChild(sec)});
 Object.keys(btn).filter(v=>!used.has(v)).forEach(v=>{frag.lastChild?frag.lastChild.querySelector('.si').appendChild(btn[v]):frag.appendChild(btn[v])});
 nav.innerHTML=html;nav.appendChild(frag);
 const bajo=DB.repuestos.filter(r=>r.activo&&r.qty<=r.alarma).length;if(btn.repuestos&&bajo&&!btn.repuestos.querySelector('.badge2'))btn.repuestos.insertAdjacentHTML('beforeend','<span class="badge2 y" title="Stock bajo">'+bajo+'</span>');
 const vb=side.querySelector('.vbs');if(vb)vb.innerHTML=vbShort()}
ACT.uxvender=()=>{if(can('ventas'))go('ventas')};
ACT.uxnuevaot=()=>{if(!canNewOT())return;go('ot');setTimeout(()=>ACT.otnew({}),20)};

/* ---------- barra superior ---------- */
function uxAvisos(){let A=[];try{A=alertas()}catch(e){}return A}
function uxTop(){if(!ME||!$('#main'))return;let t=$('#uxtop');if(!t){t=document.createElement('div');t.id='uxtop';t.setAttribute('role','banner');$('#main').insertBefore(t,$('#view'))}
 const T=DB.turno||{},A=uxAvisos(),th=THEMES.find(x=>x[0]===themePref())||THEMES[0];
 const caja=T.abierto?(T.fecha&&T.fecha<TODAY()?'<span class="chip2 c-bad">● Caja abierta de un día anterior</span>':'<span class="chip2 c-ok">● Caja abierta</span>'):'<span class="chip2 c-warn">● Caja cerrada</span>';
 t.innerHTML='<button class="tb ham" data-act="menu" aria-label="Abrir menú">☰</button><span class="nm">'+h(DB.cfg.nombre)+'</span>'+(MODO==='practica'?'<span class="chip2 '+(VB_CLIENTE?'c-warn':'c-inf')+'">'+(VB_CLIENTE?'MODO PRÁCTICA':'DEMO DE EVALUACIÓN')+'</span>':'')+'<span class="hide-m">'+caja+'</span><span class="chip2 c-mut hide-m" title="Los datos se guardan en este equipo">Datos en este equipo</span>'+
 '<span class="sp"></span><button class="tb srch" data-act="uxk" aria-label="Buscar (Ctrl + K)" aria-keyshortcuts="Control+K">🔍 <span>Buscar cliente, patente, OT, repuesto…</span><kbd>Ctrl K</kbd></button>'+
 '<button class="tb bell" data-act="uxbell" aria-label="Avisos ('+A.length+')" aria-haspopup="true">🔔'+(A.length?'<b>'+A.length+'</b>':'')+'</button>'+
 '<button class="tb" data-act="uxtheme" title="Tema: '+th[2]+' (tocá para cambiar)" aria-label="Tema '+th[2]+'">'+th[1]+'<span class="lbl">'+th[2]+'</span></button>'+
 (modOn('webp')&&typeof menuHash==='function'&&ME.rol!=='mecanico'&&ME.rol!=='limpieza'?'<a class="tb hide-m" href="'+menuHash()+'" target="_blank" rel="noopener" title="Menú público">📱<span class="lbl"> Menú público</span></a>':'')+
 '<span class="usr"><span class="av">'+h(initials(ME.n))+'</span><span class="t"><b>'+h(ME.n.split(' ')[0])+'</b><br><span class="mut">'+h(ROL[ME.rol])+'</span></span></span>'}
ACT.uxbell=()=>{let p=$('#uxbell');if(p){p.remove();return}const A=uxAvisos();p=document.createElement('div');p.id='uxbell';p.setAttribute('role','dialog');p.setAttribute('aria-label','Avisos');
 p.innerHTML='<div class="row" style="padding:4px 8px 8px"><b class="sp">Avisos</b><span class="mut sm">'+A.length+'</span></div>'+(A.length?A.map(a=>'<button data-act="uxbellgo" data-v="'+h(a.go||'dash')+'"><span aria-hidden="true">'+(a.t==='bad'?'🔴':a.t==='warn'?'🟠':'🔵')+'</span><span>'+h(a.x)+'</span></button>').join(''):'<p class="empty">Sin avisos. Todo en orden.</p>');
 document.body.appendChild(p)};
ACT.uxbellgo=d=>{const p=$('#uxbell');if(p)p.remove();go(d.v)};
document.addEventListener('click',e=>{const p=$('#uxbell');if(p&&!e.target.closest('#uxbell')&&!e.target.closest('[data-act=uxbell]'))p.remove()},true);

/* ---------- ayuda en contexto (una línea por pantalla) ---------- */
const UX_DESC={dash:'Cómo viene el taller hoy: trabajos, turnos, cobros y avisos. Tocá cualquier indicador para ir al detalle.',
 ot:'Cada vehículo que entra es una orden: diagnóstico, presupuesto, reparación, listo y entrega. Empezá con “Nueva orden” (F2).',
 ventas:'Venta rápida de repuestos y accesorios en el mostrador. Elegí el cliente si querés que sume puntos o necesitás factura.',
 turnos:'Agenda por puesto de trabajo. Los turnos pedidos desde el menú digital se confirman en “Menú digital y pedidos”.',
 clientes:'Clientes, sus vehículos y la cuenta corriente. Buscá por nombre, teléfono, CUIT o patente.',
 repuestos:'Inventario con códigos, equivalencias y alarmas de stock. Lo que se mueve queda registrado en la trazabilidad.',
 compras:'Proveedores, órdenes de compra e ingreso de mercadería. El ingreso actualiza stock y costos.',
 caja:'Seguí los 4 pasos del día: abrir el turno, cobrar, registrar ingresos y egresos, y cerrar con arqueo.',
 equipo:'Herramientas y equipos del taller con su mantenimiento y calibraciones.',
 seguridad:'Habilitaciones, matafuegos, EPP y residuos: lo que vence aparece en los avisos.',
 personal:'Equipo, roles y comisiones; legajos, asistencia, vacaciones, organigrama y sueldos estimados.',
 reportes:'Números del período para decidir: facturación, márgenes, mecánicos y repuestos. Se exportan a CSV.',
 config:'Datos del taller, catálogo de mano de obra, módulos y respaldo. Sólo la ve el dueño.',
 webp:'Lo que ven y piden tus clientes en el menú digital: pedidos, turnos, catálogo de servicios y productos publicados.',
 club:'Fidelización: socios, puntos, premios y recordatorios listos para mandar por WhatsApp.',
 garant:'Garantías vigentes de trabajos y equipos instalados, con número de serie y reclamos.',
 tareas:'Lo que tiene que hacer cada uno hoy, el tablero del equipo y las tareas que se repiten solas.'};
const _renderViewUX=renderView;renderView=function(){_renderViewUX();try{const v=$('#view'),b=v&&v.querySelector('.bar');if(b&&UX_DESC[VIEW]&&!v.querySelector('.uxdesc'))b.insertAdjacentHTML('afterend','<p class="uxdesc">'+h(UX_DESC[VIEW])+'</p>');
 const vb=v&&v.querySelector('.vb');if(vb)vb.outerHTML=vbBlock();uxTop()}catch(e){console.warn(e)}};

/* ---------- atajos ---------- */
document.addEventListener('keydown',e=>{if(!ME||$('#pub'))return;const k=e.key;
 if((e.ctrlKey||e.metaKey)&&(k==='k'||k==='K')){e.preventDefault();ACT.uxk();return}
 if(!$('#modal').hidden||$('#uxk'))return;
 if(k==='F1'&&VIEW!=='repuestos'&&can('ventas')){e.preventDefault();go('ventas')}
 else if(k==='F2'&&VIEW!=='repuestos'&&canNewOT()){e.preventDefault();ACT.uxnuevaot()}});

/* ---------- buscador universal Ctrl + K ---------- */
function fz(hay,q){hay=norm(hay);if(!q)return 0;if(hay.includes(q))return hay.startsWith(q)?3:2;if(hay.length<=q.length*3){let i=0;for(const ch of hay){if(ch===q[i])i++;if(i===q.length)return 1}}
 if(q.length>=4)return hay.split(/\s+/).some(w=>lev1(w.slice(0,q.length+1),q))?1:0;return 0}
function lev1(a,b){if(Math.abs(a.length-b.length)>1)return false;let i=0,j=0,d=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue}if(++d>1)return false;if(a.length>b.length)i++;else if(b.length>a.length)j++;else{i++;j++}}return d+(a.length-i)+(b.length-j)<=1}
function uxkItems(qr){const q=norm(qr).trim(),R=[];const add=(s,o)=>{if(s>0)R.push(Object.assign({s},o))};
 NAV.filter(n=>can(n[0])&&(n[0]!=='config'||ME.rol==='dueno')&&(!['webp','club','garant','tareas'].includes(n[0])||modOn(n[0]))).forEach(n=>{const f=q?fz(n[2]+' '+(UXKW[n[0]]||''),q):1;add(f?f+1:0,{ic:n[1],t:n[2],d:'Pantalla',a:'go',v:n[0]})});
 if(q){const pt=qr.toUpperCase().replace(/[\s-]/g,'');
  DB.vehs.forEach(v=>{const c=cliOf(v.cliId)||{};const s=v.pat.includes(pt)&&pt.length>=3?4:fz(v.marca+' '+v.mod,q);add(s,{ic:'🚗',t:v.pat+' · '+v.marca+' '+v.mod,d:'Vehículo de '+(c.n||'—'),a:'veh',v:v.id})});
  if(can('clientes'))DB.clientes.forEach(c=>{const dig=qr.replace(/\D/g,'');const s=Math.max(fz(c.n,q),dig.length>=4&&(String(c.tel).includes(dig)||String(c.doc||'').replace(/\D/g,'').includes(dig))?3:0);add(s,{ic:'👤',t:c.n,d:'Cliente'+(c.tel?' · '+c.tel:'')+(c.doc?' · '+c.doc:''),a:'cli',v:c.id})});
  const nn=parseInt(qr.replace(/\D/g,''));DB.ots.filter(otVisible).forEach(o=>{const v=vehOf(o.vehId)||{};const s=(nn&&o.num===nn)?5:fz(o.motivo,q)>1?1:0;add(s,{ic:'🔧',t:otNum(o)+' · '+(v.pat||''),d:o.estado+' · '+o.motivo,a:'ot',v:o.id})});
  if(can('repuestos'))DB.repuestos.filter(r=>r.activo).forEach(r=>{const nc=ncode(qr);const s=nc&&repCodes(r).some(c=>ncode(c)===nc)?5:nc&&nc.length>=3&&repCodes(r).some(c=>ncode(c).includes(nc))?3:fz(r.desc+' '+r.marca,q);add(s,{ic:'📦',t:r.desc+' · '+r.marca,d:r.cod+' · stock '+r.qty+(canPrice()?' · '+fmt(r.pv):''),a:'rep',v:r.id})})}
 return R.sort((a,b)=>b.s-a.s).slice(0,40)}
const UXKW={dash:'inicio resumen hoy',ot:'orden taller presupuesto diagnostico reparacion entrega',ventas:'vender pos mostrador ticket cobrar',turnos:'agenda reserva calendario',clientes:'vehiculo patente cuenta corriente',repuestos:'stock inventario articulo producto',compras:'proveedor orden de compra ingreso mercaderia',caja:'arqueo cierre apertura turno efectivo ingreso egreso',equipo:'herramienta calibracion mantenimiento',seguridad:'matafuego epp residuos habilitacion',personal:'empleado legajo asistencia fichar vacaciones organigrama sueldo adelanto',reportes:'estadistica informe margen',config:'configuracion ajustes modulos respaldo datos del taller',webp:'menu publico pedidos web tienda qr',club:'fidelizacion puntos socios premios',garant:'garantia reclamo serie',tareas:'mi dia pendientes recurrentes responsabilidades'};
let UXK={q:'',i:0,R:[]};
ACT.uxk=()=>{if(!ME||$('#uxk'))return;UXK={q:'',i:0,R:uxkItems('')};const d=document.createElement('div');d.id='uxk';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Buscador');
 d.innerHTML='<div class="bx"><input id="uxkq" placeholder="Buscar cliente, patente, N.º de OT, código o descripción de repuesto, pantalla…" autocomplete="off" aria-label="Buscar" aria-controls="uxkr"><div class="rs" id="uxkr" role="listbox"></div><p class="sm mut" style="margin:8px 4px 0">↑ ↓ para elegir · Enter para abrir · Esc para cerrar · un repuesto elegido se agrega a la venta</p></div>';
 document.body.appendChild(d);uxkDraw();const i=$('#uxkq');i.focus();
 i.addEventListener('input',()=>{UXK.q=i.value;UXK.i=0;UXK.R=uxkItems(i.value);uxkDraw()});
 d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();uxkClose()}else if(e.key==='ArrowDown'){e.preventDefault();UXK.i=Math.min(UXK.R.length-1,UXK.i+1);uxkDraw()}else if(e.key==='ArrowUp'){e.preventDefault();UXK.i=Math.max(0,UXK.i-1);uxkDraw()}else if(e.key==='Enter'){e.preventDefault();uxkPick(UXK.i)}});
 d.addEventListener('click',e=>{if(e.target===d)uxkClose();const b=e.target.closest('[data-uxk]');if(b)uxkPick(+b.dataset.uxk)})};
function uxkDraw(){const r=$('#uxkr');if(!r)return;r.innerHTML=UXK.R.length?UXK.R.map((x,i)=>'<button role="option" aria-selected="'+(i===UXK.i)+'" class="'+(i===UXK.i?'on':'')+'" data-uxk="'+i+'"><span aria-hidden="true" style="font-size:1.3rem">'+x.ic+'</span><span><b>'+h(x.t)+'</b><small>'+h(x.d)+'</small></span></button>').join(''):'<p class="empty">Sin resultados para “'+h(UXK.q)+'”.</p>';const on=r.querySelector('.on');if(on)on.scrollIntoView({block:'nearest'})}
function uxkClose(){const d=$('#uxk');if(d)d.remove()}
function uxkPick(i){const x=UXK.R[i];if(!x)return;uxkClose();
 if(x.a==='go')go(x.v);
 else if(x.a==='cli'){go('clientes');setTimeout(()=>ACT.cliopen({id:x.v}),20)}
 else if(x.a==='ot'){go('ot');setTimeout(()=>ACT.otopen({id:x.v}),20)}
 else if(x.a==='veh'){const o=DB.ots.filter(otVisible).filter(o=>o.vehId===x.v&&o.estado!=='Entregado')[0];if(o){go('ot');setTimeout(()=>ACT.otopen({id:o.id}),20)}else if(can('clientes')){const v=vehOf(x.v);go('clientes');setTimeout(()=>ACT.cliopen({id:v.cliId}),20)}else go('ot')}
 else if(x.a==='rep'){const r=repOf(x.v);if(can('ventas')){UI.vt=UI.vt||{lines:[],sinIva:false,medio:'Efectivo',cli:'',cond:'CF',doc:'',nc:{prov:'Salta',lim:0}};const ya=UI.vt.lines.filter(l=>l.repId===r.id).reduce((a,l)=>a+l.qty,0);
  if(ya+1>r.qty){toast('Sin stock suficiente de '+r.desc+'.',1);UI.repQ=r.cod;go('repuestos');return}const ex=UI.vt.lines.find(l=>l.repId===r.id&&l.k==='rep');if(ex)ex.qty++;else UI.vt.lines.push({k:'rep',repId:r.id,desc:r.desc+' ('+r.marca+')',qty:1,pu:r.pv,pu0:r.pv,iva:r.iva,costo:r.pc,dt:'%',dv:0});go('ventas');toast(r.desc+' agregado a la venta')}
  else{UI.repQ=r.cod;UI.repSel=r.id;go('repuestos')}}}

/* ---------- panel: bloque «Hoy» (sólo dueño y jefe de taller) ---------- */
function cobradoDia(f){let s=0;DB.ots.forEach(o=>(o.pagos||[]).forEach(p=>{if(p.fecha===f&&p.medio!=='Cuenta corriente'&&p.medio!=='Puntos del Club')s+=p.monto}));(DB.ventas||[]).forEach(v=>{if(v.fecha===f)s+=v.total});return r2(s)}
function trendSVG(){const W=560,H=170,P=28;const d=[...Array(7)].map((x,i)=>addDays(i-6)),p=[...Array(7)].map((x,i)=>addDays(i-13));const a=d.map(cobradoDia),b=p.map(cobradoDia);const mx=Math.max(1,...a,...b);
 const X=i=>P+i*(W-2*P)/6,Y=v=>H-P-(v/mx)*(H-2*P);const ln=arr=>arr.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');const dn=['Do','Lu','Ma','Mi','Ju','Vi','Sá'];
 return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Cobrado por día, últimos 7 días contra la semana anterior"><line x1="'+P+'" y1="'+(H-P)+'" x2="'+(W-P)+'" y2="'+(H-P)+'" stroke="currentColor" opacity=".2"/>'+
 '<path d="'+ln(a)+' L'+X(6)+' '+(H-P)+' L'+X(0)+' '+(H-P)+'Z" fill="var(--acc)" opacity=".12"/><path d="'+ln(b)+'" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 5" opacity=".45"/><path d="'+ln(a)+'" fill="none" stroke="var(--acc)" stroke-width="3"/>'+
 a.map((v,i)=>'<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="3.5" fill="var(--acc)"><title>'+fdate(d[i])+': '+fmt(v)+'</title></circle><text x="'+X(i)+'" y="'+(H-8)+'" text-anchor="middle" font-size="11" fill="currentColor" opacity=".7">'+dn[new Date(d[i]+'T12:00:00').getDay()]+'</text>').join('')+'<text x="'+P+'" y="14" font-size="11" fill="currentColor" opacity=".7">'+fmt(mx)+'</text></svg>'}
const _dashUX=V.dash;V.dash=()=>{let s=_dashUX();if(ME.rol!=='dueno'&&ME.rol!=='jefe')return s;
 ['Vehículos en taller','Turnos de hoy','Cobrado hoy (sin cta. cte.)','Repuestos en alarma'].forEach(l=>{s=s.replace(new RegExp('<button class="kpi[^"]*" data-act="go" data-v="[^"]*"><div class="v">[^<]*</div><div class="l">'+l.replace(/[.()]/g,'\\$&')+'</div></button>'),'')});
 const hoy=cobradoDia(TODAY()),ay=cobradoDia(addDays(-1)),pct=ay?Math.round((hoy-ay)/ay*100):null;const ab=DB.ots.filter(o=>o.estado!=='Entregado').length,tu=DB.turnos.filter(t=>t.fecha===TODAY()&&t.estado!=='Cancelado').length,bajo=DB.repuestos.filter(r=>r.activo&&r.qty<=r.alarma).length,pres=DB.ots.filter(o=>o.estado==='Presupuesto'&&!o.presAprob).length;
 const k=(l,v,sub,g,cls)=>'<button class="kpi" data-act="go" data-v="'+g+'"><div class="l">'+l+'</div><div class="v"'+(cls?' style="color:var(--'+cls+')"':'')+'>'+v+'</div><div class="sm mut">'+sub+'</div></button>';
 const ult=[];DB.ots.forEach(o=>(o.pagos||[]).forEach(p=>ult.push({t:p.fecha,x:otNum(o)+' · '+((vehOf(o.vehId)||{}).pat||''),m:p.monto,e:p.medio})));(DB.ventas||[]).forEach(v=>ult.push({t:v.fecha,x:'Venta VT-'+String(v.num).padStart(4,'0'),m:v.total,e:v.medio}));ult.sort((a,b)=>a.t<b.t?1:-1);
 const blk='<h3 style="margin:2px 0 10px">Hoy · '+fdate(TODAY())+'</h3><div class="hoy">'+k('Cobrado hoy',canPrice()?fmt(hoy):'—',pct==null?'sin cobros ayer':'<span class="trend">'+(pct>=0?'▲':'▼')+' '+Math.abs(pct)+' % contra ayer</span>','reportes')+k('Órdenes abiertas',ab,pres?pres+' presupuesto(s) esperando al cliente':'en el taller','ot')+k('Turnos de hoy',tu,'en la agenda','turnos')+k('Stock en alerta',bajo,'repuestos en el mínimo o debajo','repuestos',bajo?'bad':'')+'</div>'+
 (canPrice()?'<div class="hoy2"><div class="card ulist"><h3>Últimos cobros</h3>'+(ult.slice(0,6).map(u=>'<div class="it2"><span><b>'+h(u.x)+'</b><br><span class="sm mut">'+fdate(u.t)+' · '+h(u.e)+'</span></span><b>'+fmt(u.m)+'</b></div>').join('')||'<p class="empty">Todavía no hay cobros.</p>')+'</div><div class="card"><h3>Tendencia de cobros (semana)</h3>'+trendSVG()+'<p class="sm mut" style="margin:4px 0 0">Línea de color: últimos 7 días · línea punteada: semana anterior.</p></div></div>':'');
 const i=s.indexOf('</p>',s.indexOf('class="uxdesc"'));const j=s.indexOf('</div>',s.indexOf('class="bar"'));return j>0?s.slice(0,j+6)+blk+s.slice(j+6):blk+s};

/* ---------- caja: tablero del turno (estado + 4 pasos + indicadores) ---------- */
const _cajaUX=V.caja;V.caja=()=>{const s=_cajaUX();const T=DB.turno||{};const ms=T.abierto?DB.movs.filter(m=>m.turnoId===T.id):[];const ing=ms.filter(m=>m.tipo==='ingreso').reduce((a,m)=>a+m.monto,0),egr=ms.filter(m=>m.tipo==='egreso').reduce((a,m)=>a+m.monto,0);
 const vtas=(DB.ventas||[]).filter(v=>v.fecha===TODAY());const viejo=T.abierto&&T.fecha&&T.fecha<TODAY();const paso=!T.abierto?0:ms.length===0&&!vtas.length?1:2;
 const st=['Abrir el turno','Cobrar y vender','Ingresos y egresos','Arqueo y cierre'],ac=['uxcj0','uxcj1','uxcj2','uxcj3'];
 const dur=T.abierto&&T.t0?Math.round((Date.now()-T.t0)/60000):null;
 const hero='<div class="turno"><div class="card" style="margin:0"><div class="row"><span class="dot '+(viejo?'r':T.abierto?'g':'x')+'"></span><b>'+(viejo?'Caja abierta de un día anterior: cerrala':T.abierto?'Caja abierta':'Caja cerrada')+'</b></div><div class="sm mut" style="margin-top:6px">'+(T.abierto?'Ingresos del turno '+fmt(ing)+' · egresos '+fmt(egr)+(dur!=null?' · abierta hace '+(dur>=60?Math.floor(dur/60)+' h ':'')+(dur%60)+' min':''):'Abrí el turno para cobrar en efectivo.')+'</div>'+(vtas.length?'<div class="sm mut">Ventas de mostrador hoy: '+vtas.length+' · ticket promedio '+fmt(vtas.reduce((a,v)=>a+v.total,0)/vtas.length)+'</div>':'')+'</div>'+
 '<div class="steps4" role="list">'+st.map((x,i)=>'<button role="listitem" class="'+(i===paso?'now':i<paso?'ok':'')+'" data-act="'+ac[i]+'"><span class="sm mut">Paso '+(i+1)+(i<paso?' ✓':'')+'</span><br><b>'+x+'</b></button>').join('')+'</div></div>';
 const j=s.indexOf('</div>',s.indexOf('class="bar"'));return j>0?s.slice(0,j+6)+hero+s.slice(j+6):hero+s};
ACT.uxcj0=()=>{if(DB.turno.abierto){toast('El turno ya está abierto.');return}const i=$('#view input[id^=ap_]');if(i)i.focus()};
ACT.uxcj1=()=>go(can('ventas')?'ventas':'ot');
ACT.uxcj2=()=>{if(!DB.turno.abierto){toast('Primero abrí el turno.',1);return}ACT.cajamov({t:'ingreso'})};
ACT.uxcj3=()=>{if(!DB.turno.abierto){toast('No hay turno abierto.',1);return}ACT.cajacierre()};

/* ---------- configuración: módulos ---------- */
const _cfgUX=V.config;V.config=()=>{const s=_cfgUX();const M=DB.cfg.mods||{};const card='<div class="card"><h3>Módulos</h3><p class="sm mut">Prendé o apagá cada módulo. Apagarlo sólo lo oculta: los datos quedan guardados.</p><div class="g2">'+MODS.map(m=>'<label style="font-weight:500;color:var(--tx);display:flex;gap:10px;align-items:flex-start;border:1px solid var(--bd);border-radius:12px;padding:10px;min-height:44px"><input type="checkbox" data-chg="uxmod" data-k="'+m[0]+'"'+(M[m[0]]===false?'':' checked')+' style="width:auto;min-height:0;margin-top:3px"><span><b>'+h(m[1])+'</b><br><span class="sm mut">'+h(m[2])+'</span></span></label>').join('')+'</div></div>';
 const j=s.indexOf('</div>',s.indexOf('class="bar"'));return j>0?s.slice(0,j+6)+card+s.slice(j+6):card+s};
CHG.uxmod=t=>{if(ME.rol!=='dueno')return;DB.cfg.mods=DB.cfg.mods||{};DB.cfg.mods[t.dataset.k]=t.checked;audit('Módulo '+(t.checked?'activado':'apagado'),t.dataset.k);save();renderShell();renderView()};
/* RR. HH. avanzado apagado: Personal muestra sólo Equipo y roles */
const _perUX=V.personal;V.personal=()=>{if(!modOn('rrhh'))UI.perTab='equipo';let s=_perUX();if(!modOn('rrhh'))s=s.replace(/<div class="chips" style="margin-bottom:10px">[\s\S]*?<\/div>/,'');return s};

/* ---------- créditos de Vincular Business (datos oficiales) ---------- */
const VBWEB='https://www.vincularbusiness.com.ar/';
vbLine=function(){return 'Desarrollado por <b>VINCULAR BUSINESS</b> · Celular (387) 4484132 · <a href="'+VBWEB+'" target="_blank" rel="noopener">www.vincularbusiness.com.ar</a> · vincularbusiness@gmail.com · “Tu idea, en buenas manos.”'};
function vbShort(){return 'Desarrollado por <a href="'+VBWEB+'" target="_blank" rel="noopener">VINCULAR BUSINESS</a> · (387) 4484132'}
vbBlock=function(){return '<div class="vb" role="contentinfo" aria-label="Créditos del desarrollador"><div><b>VINCULAR BUSINESS</b> · Desarrollo de sistemas</div><div class="lema">“Tu idea, en buenas manos.”</div>'+
 '<div class="vbb"><a class="w" href="https://wa.me/'+VBTEL+'?text='+encodeURIComponent(VBMSG)+'" target="_blank" rel="noopener">💬 WhatsApp</a><a class="t" href="tel:+'+VBTEL+'">📞 Llamar</a><a class="t" style="background:#5b5fc7" href="'+VBWEB+'" target="_blank" rel="noopener">🌐 Página web</a><a class="m" href="mailto:vincularbusiness@gmail.com?subject='+encodeURIComponent('Sistema VB · '+DB.cfg.nombre)+'">✉️ Correo</a></div>'+
 '<div class="vbl">Celular (387) 4484132 · www.vincularbusiness.com.ar · vincularbusiness@gmail.com</div></div>'};
/* el menú público siempre en claro (lo usan los clientes) */
const _renderMenuUX=renderMenu;renderMenu=function(){document.documentElement.removeAttribute('data-theme');_renderMenuUX()};
/* hora de apertura del turno para medir su duración */
const _cajaabrirUX=ACT.cajaabrir;ACT.cajaabrir=d=>{_cajaabrirUX(d);if(DB.turno&&DB.turno.abierto&&!DB.turno.t0){DB.turno.t0=Date.now();save();renderView()}};
