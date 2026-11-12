# -*- coding: utf-8 -*-
"""Ajustes SÓLO para el sistema final de SebaChavez Car Service (no se aplica a la demo).
Se corre después de demo_patch.py --cliente:  python3 tools/seba_final.py index.html
- Quita las invitaciones al modo práctica de la pantalla de ingreso (el modo práctica sigue
  existiendo en la dirección #practica, para capacitar, pero ya no se ofrece al entrar).
- Quita textos que hablan de "demo" o "ejemplo" en el sistema real.
- Segundo código EAN (sub código) visible en la lista de repuestos y en la ficha.
- Importador de artículos: acepta Excel, reconoce "EAN 2"/"Código 2" y "precio_venta",
  y omite los artículos repetidos o ya existentes (antes cancelaba toda la carga).
No cambia dónde se guardan los datos: los datos reales del taller quedan intactos."""
import sys
p = sys.argv[1]
s = open(p, encoding='utf-8').read()

def rep(a, b, n=1):
    global s
    c = s.count(a)
    if c < 1:
        raise SystemExit('seba_final: no se encontró: ' + a[:90])
    s = s.replace(a, b, n if n else c)

# 1) ingreso sin invitaciones al modo práctica
rep('<a href="#" data-act="olvide">Olvidé la clave del dueño</a> · <a href="#practica" data-act="modopractica">Modo práctica</a> · 📱',
    '<a href="#" data-act="olvide">Olvidé la clave del dueño</a> · 📱')
rep('<p class="sm mut" style="margin-top:8px">¿Solo querés probar? <a href="#practica" data-act="modopractica">Entrá al modo práctica</a> con datos de ejemplo.</p>', '')

# 2) textos de demo / ejemplo en el sistema real
rep("'Sin cambios registrados desde que se cargó la demo.'", "'Sin cambios registrados.'")
rep("['proveedor','Lista del proveedor'],['ejemplo','Ejemplo sin verificar']];",
    "['proveedor','Lista del proveedor']].concat(MODO==='practica'?[['ejemplo','Ejemplo sin verificar']]:[]);")

rep('Ese respaldo es de datos de práctica o de demostración:','Ese respaldo es de datos de práctica:')
rep("'Práctica / demostración'","'Práctica'")

# 3) segundo código EAN visible: lista
rep('<thead><tr><th>Código</th><th>Descripción</th><th>Rubro</th><th>Marca</th><th>Proveedor</th>',
    '<thead><tr><th>Código</th><th>Código 2 (EAN)</th><th>Descripción</th><th>Rubro</th><th>Marca</th><th>Proveedor</th>')
rep("""<td>'+h(r.cod)+((r.cods||[]).length?' <span class="pill" title="Otros códigos: '+h((r.cods).join(', '))+'">+'+r.cods.length+'</span>':'')+'</td>""",
    """<td>'+h(r.cod)+'</td><td>'+((r.cods||[]).length?h(r.cods[0])+(r.cods.length>1?' <span class="pill" title="Otros códigos: '+h(r.cods.slice(1).join(', '))+'">+'+(r.cods.length-1)+'</span>':''):'—')+'</td>""")
# ficha: siempre se ve el renglón del segundo código
rep("'<label>Otros códigos del mismo producto (hay productos con 2 o más códigos; todos sirven para buscar y escanear)</label><div id=\"rp_cods\">'+(r.cods||[]).map(codRow).join('')+'</div><button type=\"button\" class=\"btn s\" data-act=\"rpaddcod\">➕ Agregar otro código</button></div>'",
    "'<label>Código 2 (EAN) y sub códigos del mismo producto <span class=\"sm mut\">— todos sirven para buscar y escanear</span></label><div id=\"rp_cods\">'+((r.cods||[]).length?r.cods:['']).map(codRow).join('')+'</div><button type=\"button\" class=\"btn s\" data-act=\"rpaddcod\">➕ Agregar otro código</button></div>'")
rep('<div class="row cr" style="margin-bottom:6px"><input class="rp_c2"', '<div class="row cr" style="margin-bottom:6px;flex-wrap:nowrap"><input class="rp_c2" style="flex:1;min-width:0"')
rep('placeholder="Otro código (EAN, del proveedor, de fábrica…)" aria-label="Otro código del producto"',
    'placeholder="Código 2: EAN o sub código (del proveedor, de fábrica…)" aria-label="Código 2 o sub código del producto"')

# 4) importador de artículos
rep("const ICOLS=['codigo','cod_proveedor','otros_codigos','descripcion','marca','rubro','proveedor','costo','ganancia','stock','alarma','reposicion'];",
    "const ICOLS=['codigo','cod_proveedor','otros_codigos','descripcion','marca','rubro','proveedor','costo','ganancia','precio_venta','stock','alarma','reposicion'];\n"
    "const SEBA_HAL={ean_2:'otros_codigos',ean2:'otros_codigos',codigo_2:'otros_codigos',codigo2:'otros_codigos',cod_2:'otros_codigos',codigo_ean_2:'otros_codigos',segundo_codigo:'otros_codigos',sub_codigo:'otros_codigos',subcodigo:'otros_codigos',sub_codigos:'otros_codigos',p_venta:'precio_venta',pventa:'precio_venta',precio:'precio_venta',p_compra:'costo',precio_costo:'costo',precio_compra:'costo'};")
rep("Obligatorias: <b>codigo, descripcion, rubro, proveedor</b>. <code>otros_codigos</code> separados por <code>|</code>.",
    "Obligatorias: <b>codigo, descripcion, rubro, proveedor</b>. <code>otros_codigos</code> es el <b>código 2 (EAN)</b> y los sub códigos, separados por <code>|</code> (también se reconoce la columna “EAN 2” o “Código 2”). <code>precio_venta</code> es opcional: si está, se usa ese precio sin IVA en lugar de la ganancia.")
rep("""const hd=rows[0].map(x=>norm(x).replace(/[^a-z_]/g,''));const ix=k=>hd.indexOf(k);
  for(const k of ['codigo','descripcion','rubro','proveedor'])""",
    """const hd=rows[0].map(x=>{const a=norm(x).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');return SEBA_HAL[a]||norm(x).replace(/[^a-z_]/g,'')});const ix=k=>hd.indexOf(k);
  for(const k of ['codigo','descripcion','rubro','proveedor'])""")
rep("const plan=[],bad=[],seen={};\n  rows.slice(1).forEach((rw,n)=>{const g=k=>ix(k)<0?'':String(rw[ix(k)]==null?'':rw[ix(k)]).trim();const L='fila '+(n+2);\n   const cod=g('codigo')",
    "const plan=[],bad=[],seen={},omit=[];\n  rows.slice(1).forEach((rw,n)=>{const g=k=>ix(k)<0?'':String(rw[ix(k)]==null?'':rw[ix(k)]).trim();const L='fila '+(n+2);\n   const cod=g('codigo')")
rep("if(codeClash(all,null)){bad.push(L+': el código ya existe ('+cod+')');return}\n   for(const c of all){const k=ncode(c);if(seen[k]){bad.push(L+': código repetido en el archivo ('+c+')');return}}\n   const nums={};for(const k of ['costo','ganancia','stock','alarma','reposicion'])",
    "if(codeClash(all,null)){omit.push(L+': ya existe en el sistema ('+cod+' · '+desc+')');return}\n   for(const c of all){const k=ncode(c);if(seen[k]){omit.push(L+': código repetido en el archivo ('+c+' · '+desc+')');return}}\n   const nums={};for(const k of ['costo','ganancia','precio_venta','stock','alarma','reposicion'])")
rep("if(!plan.length){merr('No hay filas para importar.');return false}",
    "if(!plan.length){merr(omit.length?'No hay artículos nuevos: los '+omit.length+' ya existen o están repetidos.':'No hay filas para importar.');return false}")
rep("const pc=p.nums.costo||0,gan=p.nums.ganancia==null?50:p.nums.ganancia,q=p.nums.stock||0;",
    "const pc=p.nums.costo||0,pvx=p.nums.precio_venta||0,gan=pvx>0?(pc>0?r2((pvx/pc-1)*100):0):(p.nums.ganancia==null?50:p.nums.ganancia),q=p.nums.stock||0;")
rep("pc,gan,pv:r2(pc*(1+gan/100)),qty:0,", "pc,gan,pv:pvx>0?r2(pvx):r2(pc*(1+gan/100)),qty:0,")
rep("audit('Importación de artículos',plan.length+' artículos');save();renderView();toast(plan.length+' artículos importados');return true}",
    "audit('Importación de artículos',plan.length+' artículos'+(omit.length?' · '+omit.length+' omitidos por código repetido':''));save();renderView();toast(plan.length+' artículos importados'+(omit.length?' · '+omit.length+' omitidos':''));"
    "if(omit.length)setTimeout(()=>modal({title:'Artículos omitidos ('+omit.length+')',hideOk:true,cancel:'Cerrar',wide:true,body:'<p class=\"sm\">Se importaron <b>'+plan.length+'</b> artículos. Estos no se cargaron porque su código ya estaba en el sistema o se repetía en el archivo:</p><ul class=\"sm\">'+omit.slice(0,300).map(x=>'<li>'+h(x)+'</li>').join('')+'</ul>'}),60);return true}")
# carga de archivo: Excel o CSV
rep('📁 Cargar archivo CSV<input type="file" accept=".csv,text/csv,text/plain" hidden id="fi_file" data-chg="fifile">',
    '📁 Cargar archivo (Excel o CSV)<input type="file" accept=".xlsx,.csv,text/csv,text/plain" hidden id="fi_file" data-chg="fifile">', 0)
rep("CHG.fifile=t=>{const f=t.files[0];if(!f)return;",
    "CHG.fifile=t=>{const f=t.files[0];if(!f)return;if(/\\.xlsx$/i.test(f.name)&&typeof readTabla==='function'){readTabla(f).then(S=>{const x=S.find(z=>z.rows.length>1)||S[0];const a=$('#fi_t');if(a&&x)a.value=x.rows.map(r=>r.map(c=>{c=String(c==null?'':c);return /[;\"\\n]/.test(c)?'\"'+c.replace(/\"/g,'\"\"')+'\"':c}).join(';')).join('\\n')}).catch(e=>toast(e.message||'No se pudo leer el Excel.',1));return}")
rep('Importar (CSV)','Importar (Excel o CSV)',0)
# plantilla de Datos y respaldo con la columna nueva
rep("['WO130','','WO130B','Filtro de aceite','WEGA','FILTRO DE ACEITE','Nombre del proveedor','2500','50','10','3','6']",
    "['WO130','','7798001690000','Filtro de aceite WO130','WEGA','FILTRO DE ACEITE','Nombre del proveedor','2500','50','','10','3','6']")

open(p, 'w', encoding='utf-8').write(s)
print('ok seba_final')
