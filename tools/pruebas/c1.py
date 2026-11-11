import asyncio,sys
from playwright.async_api import async_playwright
U=sys.argv[1] if len(sys.argv)>1 else 'file:///home/claude/tallermecnicosvbdemo/index.html'
WHO=sys.argv[2] if len(sys.argv)>2 else 'Martín Gómez';P=sys.argv[3] if len(sys.argv)>3 else 'c'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':1366,'height':860});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('C:'+m.text) if m.type=='error' else None)
        J=lambda x:pg.evaluate(x)
        await pg.goto(U);await pg.wait_for_timeout(500);await pg.click('text='+WHO);await pg.wait_for_timeout(400)
        await J("go('config')");await pg.wait_for_timeout(150);await pg.screenshot(path=f'/tmp/t/{P}_neg.png',full_page=True)
        # autosave nombre + preview
        await pg.fill('#cf_n','Ta');await pg.wait_for_timeout(600);print('nombre corto no guarda:',await J("DB.cfg.nombre"),'|',await J("$('#er_nombre').textContent"))
        await pg.fill('#cf_n','Taller Prueba');await pg.fill('#cf_i','@prueba');await pg.wait_for_timeout(700)
        print('guardado:',await J("JSON.parse(localStorage.getItem(LS)).cfg.nombre"),await J("DB.cfg.ig"),'| preview:',await J("$('#cfprev h3').textContent"),'| ok:',await J("$('#ok_neg').className"))
        # buscador
        await pg.fill('#cfq','iva');await pg.wait_for_timeout(150);print('buscar iva:',await J("[...document.querySelectorAll('#cfres button')].map(b=>b.textContent)"))
        await pg.keyboard.press('Enter');await pg.wait_for_timeout(200);print('tab:',await J("UI.cfTab"),'focus:',await J("document.activeElement.id"))
        await pg.screenshot(path=f'/tmp/t/{P}_fun.png')
        v0=await J("DB.cfg.recepCobra");await pg.click('#sw_recepCobra');print('switch recepCobra',v0,'->',await J("DB.cfg.recepCobra"))
        await pg.fill('#cfq','orario');await pg.wait_for_timeout(150);print('buscar orario:',await J("[...document.querySelectorAll('#cfres button')].map(b=>b.textContent)"))
        # mano de obra
        await J("UI.cfTab='mo';renderView()");s=await J("DB.servicios.find(s=>s.pu>0).id")
        await pg.fill(f'[data-chg=cfserv][data-id={s}]','10.000');await pg.wait_for_timeout(300);print('precio 10.000 ->',await J(f"DB.servicios.find(x=>x.id==='{s}').pu"))
        await pg.fill('#cfmoq','alarma');await pg.wait_for_timeout(150);n=await J("document.querySelectorAll('[data-chg=cfserv]').length");print('filtro alarma:',n,'focus',await J("document.activeElement.id"))
        before=await J("DB.servicios.filter(s=>s.pu>0&&norm(s.n).includes('alarma')).map(s=>s.pu)")
        await pg.fill('#cfmopct','10');await pg.click('[data-act=cfmopct]');await pg.wait_for_timeout(200);await pg.click('#modal .btn.p');await pg.wait_for_timeout(200)
        print('+10%:',before[:3],'->',await J("DB.servicios.filter(s=>s.pu>0&&norm(s.n).includes('alarma')).map(s=>s.pu)")[:3] if False else await J("DB.servicios.filter(s=>s.pu>0&&norm(s.n).includes('alarma')).map(s=>s.pu).slice(0,3)"))
        await pg.screenshot(path=f'/tmp/t/{P}_mo.png',full_page=True)
        for t in ['mod','menu','acc','dat','aud']:
            await J(f"UI.cfTab='{t}';renderView()");await pg.wait_for_timeout(80);await pg.screenshot(path=f'/tmp/t/{P}_{t}.png',full_page=True)
        await J("UI.cfTab='mod';renderView()");g0=await J("modOn('garant')");await pg.click('#md_garant');print('módulo garant',g0,'->',await J("modOn('garant')"));await pg.click('#md_garant')
        await J("localStorage.setItem('vb.theme','dark');themeApply();UI.cfTab='neg';renderView()");await pg.screenshot(path=f'/tmp/t/{P}_neg_dark.png')
        await J("localStorage.setItem('vb.theme','light');themeApply()")
        await pg.set_viewport_size({'width':360,'height':780});await J("renderView()");await pg.screenshot(path=f'/tmp/t/{P}_movil.png',full_page=True)
        print('desborde móvil:',await J("document.documentElement.scrollWidth"))
        print('errores:',errs);await b.close()
asyncio.run(main())
