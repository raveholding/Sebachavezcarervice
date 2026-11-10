import asyncio,sys
from playwright.async_api import async_playwright
U=sys.argv[1] if len(sys.argv)>1 else 'file:///home/claude/tallermecnicosvbdemo/index.html'
WHO=sys.argv[2] if len(sys.argv)>2 else 'Martín Gómez'
P=sys.argv[3] if len(sys.argv)>3 else 'u'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':1366,'height':860});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('C:'+m.text) if m.type=='error' else None)
        J=lambda x:pg.evaluate(x)
        await pg.goto(U);await pg.wait_for_timeout(500);await pg.click('text='+WHO);await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'/tmp/{P}_dash.png')
        await J("localStorage.setItem('vb.theme','dark');themeApply()");await pg.wait_for_timeout(100);await pg.screenshot(path=f'/tmp/{P}_dash_dark.png')
        for v in ['ot','caja','repuestos','club','personal','tareas','webp','config']:
            await J(f"go('{v}')");await pg.wait_for_timeout(80);await pg.screenshot(path=f'/tmp/{P}_{v}_dark.png')
        await J("localStorage.setItem('vb.theme','light');themeApply()")
        await J("go('caja')");await pg.screenshot(path=f'/tmp/{P}_caja.png')
        await pg.keyboard.press('Control+k');await pg.wait_for_timeout(100);await pg.keyboard.type('AB98');await pg.wait_for_timeout(150);await pg.screenshot(path=f'/tmp/{P}_k.png')
        print('k results',await J("UXK.R.slice(0,4).map(x=>x.t).join(' | ')"))
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(200);print('after pick',await J("VIEW"),await J("MODAL&&MODAL.title"))
        await J("closeModal()")
        await pg.keyboard.press('Control+k');await pg.keyboard.type('alarma');await pg.wait_for_timeout(150);print('k alarma',await J("UXK.R.slice(0,3).map(x=>x.t).join(' | ')"))
        await pg.keyboard.press('Escape');await pg.keyboard.press('Control+k');await pg.keyboard.type('arqeo');await pg.wait_for_timeout(100);print('k arqeo',await J("UXK.R.slice(0,2).map(x=>x.t).join(' | ')"));await pg.keyboard.press('Escape')
        await pg.keyboard.press('F1');await pg.wait_for_timeout(100);print('F1',await J("VIEW"))
        await pg.keyboard.press('F2');await pg.wait_for_timeout(150);print('F2',await J("MODAL&&MODAL.title"));await J("closeModal()")
        await pg.click('[data-act=uxbell]');await pg.wait_for_timeout(100);await pg.screenshot(path=f'/tmp/{P}_bell.png');print('avisos',await J("document.querySelectorAll('#uxbell button').length"))
        await pg.keyboard.press('Escape');await J("($('#uxbell')||{remove(){}}).remove()")
        await J("ACT.uxsec({s:'log'})");print('sección plegada',await J("$('#uxs_log').classList.contains('cl')"))
        await J("go('config')");await pg.click('[data-chg=uxmod][data-k=club]');await pg.wait_for_timeout(100);print('club oculto',await J("!$('#nav_club')"));await J("go('club')");print('go club apagado ->',await J("VIEW"))
        await J("go('config')");await pg.click('[data-chg=uxmod][data-k=club]');await pg.wait_for_timeout(100);print('club vuelve',await J("!!$('#nav_club')"))
        t0=await J("performance.now()");await J("ACT.uxtheme()");t1=await J("performance.now()");print('tema ms',round(t1-t0,1))
        for w in [320,360,768,1024,1440]:
            await pg.set_viewport_size({'width':w,'height':820});await J("go('dash')");await pg.wait_for_timeout(80)
            ov=await J("document.documentElement.scrollWidth");print(w,'overflow',ov)
            if w==360: await pg.screenshot(path=f'/tmp/{P}_360.png')
        print('ERRS',errs);await b.close()
asyncio.run(main())
