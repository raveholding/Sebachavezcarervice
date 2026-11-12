import asyncio,sys
from playwright.async_api import async_playwright
U=sys.argv[1];X='/home/claude/salida/articulos_tonagu_corregido.xlsx'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=await b.new_page(viewport={'width':1366,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        J=lambda x:pg.evaluate(x)
        await pg.goto(U);await pg.wait_for_timeout(500)
        await pg.fill('#su_n','Seba Chavez');await pg.fill('#su_p','1234');await pg.fill('#su_q','1234');await pg.click('[data-act=setupok]');await pg.wait_for_timeout(600);await J("closeModal()")
        # un artículo que ya existía antes en el sistema (mismo EAN que la planilla)
        await J("DB.provs.push({id:'px',n:'DISTRIBUIDORA SAN ROQUE',cuit:'',tel:'',mail:'',activo:true});DB.repuestos.push({id:'rx',cod:'7798186475110',codProv:'',desc:'Filtro cargado antes',marca:'',rubro:'FILTRO DE AIRE',provId:'px',pc:100,gan:50,pv:150,qty:3,alarma:2,repos:0,iva:21,cods:[],eq:[],hist:[],activo:true});save()")
        n0=await J("DB.repuestos.length")
        # 1) por Datos y respaldo → Importar → Repuestos
        await J("UI.datTab='imp';UI.datImp='repuestos';go('datos')");await pg.wait_for_timeout(100)
        await pg.set_input_files('[data-chg=datimpf]',X);await pg.wait_for_timeout(900)
        print('textarea con filas:',await J("($('#fi_t')||{value:''}).value.split('\\n').length"))
        await pg.click('[data-act=mok]');await pg.wait_for_timeout(800)
        print('importados:',await J(f"DB.repuestos.length-{n0}"),'| aviso omitidos:',await J("($('.mh h3')||{}).textContent||''"),'|',await J("[...document.querySelectorAll('#modal li')].map(x=>x.textContent).slice(0,3)"))
        await J("closeModal()")
        r=await J("JSON.stringify(DB.repuestos.find(r=>r.cod==='7798186478104'))");print('FAP2602:',r[:300])
        print('precio = planilla:',await J("(r=>[r.pc,r.pv,r.gan,r.qty,r.cods])(DB.repuestos.find(r=>r.cod==='7798186478104'))"))
        print('costo 0 con precio:',await J("(r=>[r.desc,r.pc,r.pv,r.gan])(DB.repuestos.find(r=>r.cod==='TR90105'))"))
        print('stock en trazabilidad:',await J("DB.kardex.filter(k=>k.tipo.includes('importación')).length"))
        # lista: columna código 2
        await J("UI.repQ='';go('repuestos')");await pg.wait_for_timeout(200)
        print('encabezado:',await J("[...document.querySelectorAll('#view table thead th')].slice(0,3).map(x=>x.textContent)"))
        # búsqueda por código 2
        await J("UI.repQ='FAP2802';renderView()");print('busca por código 2:',await J("[...document.querySelectorAll('#view table tbody tr')].map(t=>t.textContent).slice(0,2)"))
        await J("UI.repQ='';UI.repSel=DB.repuestos.find(r=>r.cod==='7798186478104').id;renderView()");await pg.screenshot(path='/tmp/t/s_rep.png')
        # venta: escanear el código 2
        print('escaneo código 2 encuentra:',await J("(typeof repByCode==='function'?repByCode('FAP2802'):DB.repuestos.find(r=>repCodes(r).some(c=>ncode(c)===ncode('FAP2802'))))?.desc"))
        # ficha: campo código 2 visible
        await J("ACT.repedit&&ACT.repedit({id:DB.repuestos.find(r=>!(r.cods||[]).length&&r.cod==='2').id})");await pg.wait_for_timeout(200)
        print('ficha sin código 2 muestra el campo:',await J("document.querySelectorAll('#rp_cods .rp_c2').length"),await J("($('#rp_cods')||{}).previousElementSibling?.textContent"))
        await pg.screenshot(path='/tmp/t/s_ficha.png');await J("closeModal()")
        # 2) segunda carga del mismo archivo por Repuestos → Importar (xlsx): todo omitido, sin error
        await J("go('repuestos');ACT.repimp()");await pg.wait_for_timeout(200)
        await pg.set_input_files('#fi_file',X);await pg.wait_for_timeout(900);await pg.click('[data-act=mok]');await pg.wait_for_timeout(300)
        print('recarga:',await J("$('#merr').textContent"))
        print('ERRS',errs);await b.close()
asyncio.run(main())
