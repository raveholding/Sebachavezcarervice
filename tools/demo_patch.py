"""Aplica los módulos de la demo Car Center sobre el index.html ya rebrandeado (salida de mk_demo.py).
Uso: python3 tools/demo_patch.py index.html
"""
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
p = sys.argv[1]
CLIENTE = '--cliente' in sys.argv[2:]
s = open(p, encoding='utf-8').read()

def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, (c, a[:100])
    s = s.replace(a, b)

seed_js = open(os.path.join(HERE, 'demo_rrhh_seed.js'), encoding='utf-8').read() + '\n' + open(os.path.join(HERE, 'demo_seed.js'), encoding='utf-8').read()
ext_js = open(os.path.join(HERE, 'demo_ext.js'), encoding='utf-8').read() + '\n' + open(os.path.join(HERE, 'demo_rrhh.js'), encoding='utf-8').read() + '\n' + open(os.path.join(HERE, 'vb_ux.js'), encoding='utf-8').read() + '\n' + open(os.path.join(HERE, 'vb_datos.js'), encoding='utf-8').read() + '\n' + open(os.path.join(HERE, 'qrcode.min.js'), encoding='utf-8').read() + '\n' + open(os.path.join(HERE, 'vb_print.js'), encoding='utf-8').read() + '\n' + open(os.path.join(HERE, 'vb_cfg.js'), encoding='utf-8').read()

# 1) datos, áreas y migración (antes de cargar la base)
rep("let DB=loadDB();", 'const VB_CLIENTE=' + ('true' if CLIENTE else 'false') + ';\n' + seed_js + "\nlet DB=loadDB();")
rep(" return d}\n\n/* ---------- estado ---------- */", " extSeed(d);\n return d}\n\n/* ---------- estado ---------- */")
rep("(o.provs||[]).forEach(p=>{if(!p.cond)p.cond='RI'});return o}", "(o.provs||[]).forEach(p=>{if(!p.cond)p.cond='RI'});return extMigrar(o)}")
rep("servicios:p.servicios.map(s=>({id:s.id,n:s.n,pu:0,h:s.h})),", "servicios:p.servicios.map(s=>Object.assign({},s,{pu:0})),")

# 2) módulos nuevos y ruta del menú público
rep("(function init(){", ext_js + "\n(function init(){if(/menu/i.test(location.hash)){renderMenu();return}")

# 3) OT: tipo de trabajo, checklist de instalaciones, servicio vinculado
rep("body:pickerHTML(d.cli||'',d.veh||'',true)+", "body:pickerHTML(d.cli||'',d.veh||'',true)+otAreaHTML()+")
rep("comb:val('n_comb')},arca);", "comb:val('n_comb')},arca);otAreaRead(o);")
rep(" o.items.push({k:'mo',desc,qty:q,pu:r2(pu),pu0:s?s.pu:r2(pu),iva:21,costo:0,extra:!!o.presAprob});",
    " o.items.push({k:'mo',sid:s?s.id:'',desc,qty:q,pu:r2(pu),pu0:s?s.pu:r2(pu),iva:21,costo:0,extra:!!o.presAprob});")
rep("opts(DB.servicios,'',s=>[s.id,s.n+' · '+fmt(s.pu)],'— elegir servicio —')",
    "opts(DB.servicios,'',s=>[s.id,areaOf(s.area)[2]+' '+s.n+' · '+fmt(s.pu)],'— elegir servicio —')")
rep("<div class=\"row\"><span class=\"pat\">'+h(v.pat)+'</span>", "<div class=\"row\"><span title=\"'+h(areaOf(o.area)[1])+'\">'+areaOf(o.area)[2]+'</span><span class=\"pat\">'+h(v.pat)+'</span>")
rep(" s+=otFlowHTML(o)+otPresHTML(o);", " s+='<div style=\"margin:-2px 0 8px\">'+otAreaBadge(o)+'</div>';\n s+=otFlowHTML(o)+otPresHTML(o);")
rep("'<p class=\"sm\">Recepción: aceite '", "instPrint(o)+'<p class=\"sm\">Recepción: aceite '")

# 4) cobro de la OT: canje de puntos del Club como medio de pago
i = s.index("function pgCalc(o){"); j = s.index("\nCHG.pgdesc=", i)
f = s[i:j]
f2 = (f.replace("return{ef:efA,tr,tj,cc:r2(cc),vuelto,total:r2(efA+tr+tj+cc),resta:r2(t.saldo-efA-tr-tj-cc)}",
                "if(pt>0.004){if(!c||!c.club)return{err:'El cliente no es socio del Club.'};if(pt>ptsPesos(c.pts)+0.004)return{err:'Los puntos alcanzan para '+fmt(ptsPesos(c.pts))+'.'}}\n return{ef:efA,tr,tj,pt,cc:r2(cc),vuelto,total:r2(efA+tr+tj+pt+cc),resta:r2(t.saldo-efA-tr-tj-pt-cc)}")
       .replace("tj=r2(num(val('pg_tj')));", "tj=r2(num(val('pg_tj'))),pt=r2(num(val('pg_pt')));")
       .replace("[ef,tr,tj,cc]", "[ef,tr,tj,cc,pt]")
       .replace("tr+tj", "tr+tj+pt")
       .replace("t.saldo-tr-tj", "t.saldo-tr-tj-pt"))
f2 = f2.replace("tr+tj+pt+pt", "tr+tj+pt").replace("tr+tj-pt", "tr+tj").replace("-tr-tj-pt-pt", "-tr-tj-pt")
assert 'resta:r2(t.saldo-efA-tr-tj-pt-cc)' in f2 and 'ptsPesos' in f2, f2
s = s[:i] + f2 + s[j:]
rep("<input id=\"pg_tj\" inputmode=\"decimal\" data-chg=\"pgcalc\" placeholder=\"0,00\"></div>'+",
    "<input id=\"pg_tj\" inputmode=\"decimal\" data-chg=\"pgcalc\" placeholder=\"0,00\"></div>'+ptsDispHTML(o)+")
rep("  if(r.tj>0)o.pagos.push({id:uid('pg'),fecha:f,medio:'Tarjeta',monto:r.tj,cajaId:''});",
    "  if(r.tj>0)o.pagos.push({id:uid('pg'),fecha:f,medio:'Tarjeta',monto:r.tj,cajaId:''});\n"
    "  if(r.pt>0){const pc=Math.ceil(r.pt/DB.cfg.club.valor-1e-9);o.pagos.push({id:uid('pg'),fecha:f,medio:'Puntos del Club',monto:r.pt,cajaId:''});ptsMov(c,'Canje',-pc,otNum(o));audit('Club: canje como pago',c.n+' · '+otNum(o)+' · −'+pc+' pts = '+fmt(r.pt))}")
rep("if(p.fecha===TODAY()&&p.medio!=='Cuenta corriente')cobHoy+=p.monto", "if(p.fecha===TODAY()&&p.medio!=='Cuenta corriente'&&p.medio!=='Puntos del Club')cobHoy+=p.monto")

# 5) ficha del cliente: Club y fecha de nacimiento
rep("false,true)+arcaHTML('cl',c.cond,c.doc)+", "false,true)+arcaHTML('cl',c.cond,c.doc)+clubCliHTML(c)+")
rep("onOk:()=>{let ar,cd;try{ar=readArca('cl');cd=readCliDatos('cl',ar.cond)}catch(e){merr(e.message);return false}const n=cd.n;",
    "onOk:()=>{let ar,cd;try{ar=readArca('cl');cd=readCliDatos('cl',ar.cond);const nac=val('cl_nac');if(nac&&edad(nac)<18)throw new Error('El Club es para mayores de 18 años (revisá la fecha de nacimiento).')}catch(e){merr(e.message);return false}const n=cd.n;")
rep("Object.assign(x,cd);if(!c.id)DB.clientes.push(x);", "Object.assign(x,cd);if(!c.id)DB.clientes.push(x);clubFromForm(x);")

# 6) turnos: servicios del catálogo como sugerencia
rep("<input id=\"tu_s\" placeholder=\"Ej.: service, alineación, frenos…\">",
    "<input id=\"tu_s\" list=\"tu_sl\" placeholder=\"Ej.: service, alarma, parlantes…\"><datalist id=\"tu_sl\">'+DB.servicios.map(x=>'<option value=\"'+h(x.n)+'\">').join('')+'</datalist>")

# 6b) agenda con el box de instalaciones (5 puestos)
rep(".tg{display:grid;grid-template-columns:60px repeat(4,minmax(150px,1fr));min-width:760px;", ".tg{display:grid;grid-template-columns:60px repeat(5,minmax(150px,1fr));min-width:900px;")

# 7) acceso al menú desde el ingreso
if not CLIENTE:
  rep("<a href=\"#\" data-act=\"modoreal\">Probar el sistema vacío (con claves)</a>",
    "<a href=\"#\" data-act=\"modoreal\">Probar el sistema vacío (con claves)</a><br>📱 <a href=\"#menu\" target=\"_blank\" rel=\"noopener\">Ver el menú digital que ven los clientes</a>")

else:
  rep('<a href="#practica" data-act="modopractica">Modo práctica</a></p>', '<a href="#practica" data-act="modopractica">Modo práctica</a> · 📱 <a href="#menu" target="_blank" rel="noopener">Menú digital</a></p>')
  rep('<a href="#" data-act="modoreal">Ir al sistema real</a></div>', '<a href="#" data-act="modoreal">Ir al sistema real</a> · 📱 <a href="#practica-menu" target="_blank" rel="noopener">Menú digital de práctica</a></div>')

open(p, 'w', encoding='utf-8').write(s)
print('ok demo_patch')
