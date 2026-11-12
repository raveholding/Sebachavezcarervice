import asyncio,sys
from playwright.async_api import async_playwright
U='file:///home/claude/tallermecnicosvbdemo/index.html'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);ctx=await b.new_context(viewport={'width':1200,'height':860});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)));J=lambda x:pg.evaluate(x)
        # datos viejos car4 deben reemplazarse por el seed nuevo
        await pg.goto(U);await pg.wait_for_timeout(300);await J("save()");await J("(()=>{const o=JSON.parse(localStorage.getItem(LS));o.demoVer='car4';o.ventas=[];localStorage.setItem(LS,JSON.stringify(o))})()");await pg.reload();await pg.wait_for_timeout(400)
        await pg.screenshot(path='/tmp/t/e1_login.png')
        print('ventas:',await J("DB.ventas.map(v=>'VT-'+v.num+' '+v.cliN+' '+v.total+(v.fact?' '+prFact(v.fact):'')).join(' | ')"))
        print('ocs:',await J("DB.ocs.map(o=>'OC-'+o.num+' '+provOf(o.provId).n+' '+o.lines.length).join(' | ')"),'fisc:',await J("JSON.stringify(DB.cfg.fisc)"),'cuit ok:',await J("cuitOk(DB.cfg.fisc.cuit)"))
        print('cuit clientes:',await J("DB.clientes.filter(c=>c.doc).map(c=>c.n+' '+c.cond+' '+c.doc+' '+cuitOk(c.doc)).join(' | ')"))
        await pg.click('text=Martín Gómez');await pg.wait_for_timeout(300);await J("window.print=()=>{}")
        await J("go('ventas')");await pg.screenshot(path='/tmp/t/e1_ventas.png');await J("UI.compTab='oc';go('compras')");print('OC 🖨:',await J("document.querySelectorAll('[data-act=proc]').length"))
        await J("go('imprimir')");await pg.click('[data-act=prvt]');print('ticket con CUIT del taller:',await J("$('#printArea').textContent.includes('CUIT')"))
        await J("UI.cfTab='dat';go('config')");await pg.screenshot(path='/tmp/t/e1_cfg.png',full_page=True)
        await pg.click('#cfbody [data-act=modoreal]');await pg.wait_for_timeout(600);print('modo:',await J("MODO"),await J("location.hash"))
        await pg.fill('#su_n','Cliente Prueba');await pg.fill('#su_p','1234');await pg.fill('#su_q','1234');await pg.click('[data-act=setupok]');await pg.wait_for_timeout(500)
        if await J("!$('#modal').hidden"):await pg.click('[data-act=mok]');await pg.wait_for_timeout(200)
        print('banner:',await J("($('#pbanner')||{}).textContent"),'ventas limpias:',await J("DB.ventas.length"),'ocs:',await J("DB.ocs.length"),'clientes:',await J("DB.clientes.length"))
        await pg.screenshot(path='/tmp/t/e1_limpia.png')
        await pg.click('#pbanner [data-act=demolimpia]');await pg.wait_for_timeout(150);await pg.click('#modal .btn.p');await pg.wait_for_timeout(400);print('tras vaciar, login de alta:',await J("!!$('#su_n')"))
        await pg.click('text=Volvé a la demo') if await J("!!document.querySelector('[data-act=modopractica]')") else None
        await pg.wait_for_timeout(500);print('volvió a ejemplos:',await J("MODO"),await J("(DB.ventas||[]).length"))
        print('errores',errs);await b.close()
asyncio.run(main())
