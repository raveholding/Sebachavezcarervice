import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':1366,'height':860});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        J=lambda x:pg.evaluate(x)
        await pg.goto('file:///home/claude/tallermecnicosvbdemo/index.html');await pg.wait_for_timeout(400);await pg.click('text=Martín Gómez')
        await J("UI.cfTab='menu';go('config')");print('switches menú:',await J("document.querySelectorAll('#cfbody .sw input').length"))
        v=await J("DB.cfg.menu.precios");await pg.click('#mw_precios');print('precios',v,'->',await J("DB.cfg.menu.precios"));await pg.click('#mw_precios')
        await pg.screenshot(path='/tmp/t/c2_menu.png',full_page=True)
        # acceso oculto: doble clic en el logo del menú
        await pg.goto('file:///home/claude/tallermecnicosvbdemo/index.html#menu');await pg.wait_for_timeout(500)
        print('en menú:',await J("!!document.querySelector('#pub .ph img')"))
        await pg.dblclick('#pub .ph img');await pg.wait_for_timeout(800);print('tras doble clic:',await J("location.hash||'(sin hash)'"),'login visible:',await J("!$('#login').hidden || !$('#app').hidden"))
        # un solo clic no hace nada
        await pg.goto('file:///home/claude/tallermecnicosvbdemo/index.html#real-menu');await pg.wait_for_timeout(500);await pg.click('#pub .ph img');await pg.wait_for_timeout(600);print('un clic:',await J("location.hash"))
        await pg.dblclick('#pub .ph img');await pg.wait_for_timeout(800);print('doble clic real:',await J("location.hash"))
        # móvil: doble toque
        ctx=await b.new_context(viewport={'width':390,'height':800},has_touch=True,is_mobile=True);m=await ctx.new_page()
        await m.goto('file:///home/claude/tallermecnicosvbdemo/index.html#menu');await m.wait_for_timeout(500)
        await m.tap('#pub .ph img');await m.wait_for_timeout(120);await m.tap('#pub .ph img');await m.wait_for_timeout(900);print('doble toque:',await m.evaluate("location.hash||'(sin hash)'"),await m.evaluate("!!document.querySelector('#pub')&&!document.querySelector('#pub').hidden&&document.querySelector('#pub').offsetParent!==null"))
        # apagado
        await pg.goto('file:///home/claude/tallermecnicosvbdemo/index.html#menu');await pg.wait_for_timeout(400);await J("DB.cfg.accOculto=false");await pg.dblclick('#pub .ph img');await pg.wait_for_timeout(600);print('apagado:',await J("location.hash"))
        print('errores',errs);await b.close()
asyncio.run(main())
