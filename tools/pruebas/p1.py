import asyncio,sys,os
from playwright.async_api import async_playwright
U=sys.argv[1] if len(sys.argv)>1 else 'file:///home/claude/tallermecnicosvbdemo/index.html'
WHO=sys.argv[2] if len(sys.argv)>2 else 'Martín Gómez';P=sys.argv[3] if len(sys.argv)>3 else 'p'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':1366,'height':900});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('C:'+m.text) if m.type=='error' else None)
        J=lambda x:pg.evaluate(x)
        await pg.goto(U);await pg.wait_for_timeout(500);await pg.click('text='+WHO);await pg.wait_for_timeout(400)
        await J("window.print=()=>{window.__pr=(window.__pr||0)+1}")
        await J("if(!(DB.ventas||[]).length){const r=DB.repuestos.find(r=>r.activo&&r.qty>0);DB.ventas=[{id:'vtx',num:1,fecha:TODAY(),t:Date.now(),u:ME.n,cliId:'',cliN:'Consumidor final',arca:{cond:'CF',doc:''},lines:[{k:'rep',repId:r.id,desc:r.desc,qty:2,pu:r.pv,iva:21,dt:'%',dv:0}],sinIva:false,medio:'Efectivo',total:r2(r.pv*2),neto:r2(r.pv*2/1.21),iva:r2(r.pv*2-r.pv*2/1.21)}]}")
        await J("go('imprimir')");await pg.wait_for_timeout(150);await pg.screenshot(path=f'/tmp/t/{P}_hub.png',full_page=True)
        print('letras:',await J("[prLetras(1),prLetras(21),prLetras(101),prLetras(1000),prLetras(21000),prLetras(1234567.5),prLetras(100),prLetras(45300.99)].join(' | ')"))
        async def shot(act,name,kind='print'):
            await J("$('#printArea').innerHTML=''");await pg.click(act);await pg.wait_for_timeout(150)
            html=await J("$('#printArea').innerHTML");pdf=f'/tmp/t/{P}_{name}.pdf'
            await pg.emulate_media(media='print');await pg.pdf(path=pdf,prefer_css_page_size=True,print_background=True);await pg.emulate_media(media='screen')
            print(name,'html',len(html),'pdf',os.path.getsize(pdf))
        oid=await J("DB.ots.find(o=>(o.pagos||[]).length&&o.items.length).id");await J(f"UI.pr.ot='{oid}';renderView()")
        await shot('[data-act=prcomp]','comp_a4');await shot('[data-act=prrecot]','recibo');await shot('[data-act=prentrega]','entrega');await shot('[data-act=pretiq][data-id]','etiqueta')
        await pg.click('[data-act=prfmt][data-v="80"]');await pg.wait_for_timeout(100);await shot('[data-act=prcomp]','comp_80');await shot('[data-act=prvt]','venta_80')
        await pg.click('[data-act=prfmt][data-v="58"]');await shot('[data-act=prvt]','venta_58')
        await pg.click('[data-act=prfmt][data-v="a4"]')
        await J("UI.pr.cli=DB.ots[0].cliId;UI.pr.oc=(DB.ocs[0]||{}).id||'';UI.pr.prov=DB.provs[0].id;renderView()")
        await shot('[data-act=prcta]','cuenta');await shot('[data-act=pragenda]','agenda');await shot('[data-act=prprecios]','precios');await shot('[data-act=prrepos]','reposicion')
        if await J("!!UI.pr.oc"):await shot('[data-act=proc]','oc')
        if await J("!!document.querySelector('[data-act=prqr]')"):await shot('[data-act=prqr]','qr')
        # factura ARCA
        await pg.click('[data-act=prfact][data-k=ot]');await pg.wait_for_timeout(100);print('letra sugerida:',await J("$('#pf_t').value"))
        await pg.fill('#pf_p','2');await pg.fill('#pf_n','154');await pg.fill('#pf_c','123');await pg.click('[data-act=mok]');print('CAE corto:',await J("$('#merr').textContent"))
        await pg.fill('#pf_c','');await pg.click('[data-act=mok]');await pg.wait_for_timeout(100);print('registro:',await J(f"prFact(otOf('{oid}').fact)"))
        # botones contextuales
        await J(f"go('ot');"); 
        has=await J(f"typeof otOpen==='function'");
        await J("go('ventas')");print('ventas 🖨:',await J("document.querySelectorAll('[data-act=prvt]').length"))
        await J("UI.compTab='oc';go('compras')");print('compras 🖨:',await J("document.querySelectorAll('[data-act=proc]').length"))
        print('prints:',await J("window.__pr"),'errores:',errs);await b.close()
asyncio.run(main())
