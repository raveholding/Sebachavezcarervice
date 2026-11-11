import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        ctx=await b.new_context(viewport={'width':1366,'height':860});pg=await ctx.new_page();errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('C:'+m.text) if m.type=='error' else None)
        await pg.goto('http://localhost:8765/');await pg.wait_for_timeout(1500)
        print('sw registrado',await pg.evaluate("navigator.serviceWorker.getRegistrations().then(r=>r.length)"))
        await pg.reload();await pg.wait_for_timeout(1200)
        print('controlado',await pg.evaluate("!!navigator.serviceWorker.controller"),'manifest',await pg.evaluate("!!document.querySelector('link[rel=manifest]')"))
        await pg.click('text=Martín Gómez');await pg.wait_for_timeout(300);await pg.evaluate("DB.clientes.push({id:'off1',n:'Cargado antes de cortar',tel:'',doc:'',cond:'CF'});save()")
        await ctx.set_offline(True)
        await pg.reload();await pg.wait_for_timeout(1200)
        print('sin internet carga',await pg.evaluate("document.title"),'login visible',await pg.evaluate("!$('#login').hidden||!!ME"))
        await pg.click('text=Martín Gómez');await pg.wait_for_timeout(400)
        print('dato conservado',await pg.evaluate("DB.clientes.some(c=>c.id==='off1')"),'chip',await pg.evaluate("!!document.querySelector('.offc')"))
        await pg.evaluate("go('ot');ACT.otnew({})");await pg.select_option('#pk_cli',index=1);await pg.wait_for_timeout(100);await pg.select_option('#pk_veh',index=1);await pg.fill('#n_mot','Orden cargada sin internet');await pg.click('[data-act=mok]');await pg.wait_for_timeout(300)
        print('OT sin internet',await pg.evaluate("DB.ots[0].motivo"))
        await pg.screenshot(path='/tmp/t/x_off.png')
        m=await ctx.new_page();await m.goto('http://localhost:8765/#menu');await m.wait_for_timeout(1000);print('menú sin internet',await m.evaluate("document.querySelectorAll('#pub .pc').length"))
        await ctx.set_offline(False)
        mf=await pg.evaluate("fetch('manifest.webmanifest').then(r=>r.json())");print('manifest',mf['name'],mf['display'],len(mf['icons']))
        print('ERRS',[e for e in errs if 'net::ERR_INTERNET_DISCONNECTED' not in e and 'Failed to load resource' not in e]);await b.close()
asyncio.run(main())
