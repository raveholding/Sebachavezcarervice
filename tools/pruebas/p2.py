import asyncio,sys
from playwright.async_api import async_playwright
U=sys.argv[1] if len(sys.argv)>1 else 'file:///home/claude/tallermecnicosvbdemo/index.html'
WHO=sys.argv[2] if len(sys.argv)>2 else 'Martín Gómez'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':1366,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        J=lambda x:pg.evaluate(x)
        await pg.goto(U);await pg.wait_for_timeout(500);await pg.click('text='+WHO);await pg.wait_for_timeout(300);await J("window.print=()=>{window.__pr=(window.__pr||0)+1}")
        # botón en el detalle de la orden
        oid=await J("DB.ots.find(o=>(o.pagos||[]).length).id")
        await J(f"go('ot');"); n=await J("document.querySelectorAll('[data-act=otopen],[data-act=otdet],[data-act=otview]').length"); 
        sel=await J(f"(document.querySelector('[data-id=\"{oid}\"][data-act^=ot]')||{{}}).dataset?.act||''");print('acción para abrir OT:',sel)
        await pg.click(f'[data-id="{oid}"][data-act="{sel}"]');await pg.wait_for_timeout(200)
        print('botón Más impresiones:',await J("!!document.querySelector('[data-act=prot]')"))
        await pg.click('[data-act=prot]');await pg.wait_for_timeout(150);print('modal:',await J("$('.mh h3').textContent"),'recibos',await J("document.querySelectorAll('#modal [data-act=prrecot]').length"))
        await pg.click('#modal [data-act=prentrega]');await pg.wait_for_timeout(100);print('imprimió entrega:',await J("$('#printArea').textContent.includes('CONSTANCIA')"))
        await pg.screenshot(path='/tmp/t/p2_modal.png')
        # orden de compra
        await J("DB.ocs=DB.ocs||[];if(!DB.ocs.length){const r=DB.repuestos.find(r=>r.activo&&r.provId);DB.seq.oc=(DB.seq.oc||0)+1;DB.ocs.push({id:'ocx',num:DB.seq.oc,provId:r.provId,arca:'RI',fecha:TODAY(),lines:[{repId:r.id,qty:3,costo:r.pc}],estado:'Pendiente',obs:''})}")
        await J("closeModal();UI.compTab='oc';go('compras')");c=await J("document.querySelectorAll('[data-act=proc]').length");print('compras 🖨:',c)
        if c:await pg.click('[data-act=proc]');await pg.wait_for_timeout(100);print('OC impresa:',await J("$('#printArea').textContent.includes('ORDEN DE COMPRA')"))
        # config impresión
        if await J("ME.rol==='dueno'"):
            await J("UI.cfTab='imp';go('config')");await pg.fill('#pf_cuit','20-12345678-0');await pg.wait_for_timeout(100);print('CUIT malo:',await J("$('#er_cuit').textContent"))
            await pg.fill('#pf_cuit','20123456786');await pg.select_option('#pf_cond','MT');await pg.wait_for_timeout(600);print('fisc:',await J("JSON.stringify(DB.cfg.fisc)"),'letra con monotributo:',await J("prLetra('RI')"))
            await pg.screenshot(path='/tmp/t/p2_cfg.png',full_page=True)
        await pg.set_viewport_size({'width':360,'height':780});await J("go('imprimir')");print('desborde móvil:',await J("document.documentElement.scrollWidth"))
        print('errores',errs);await b.close()
asyncio.run(main())
