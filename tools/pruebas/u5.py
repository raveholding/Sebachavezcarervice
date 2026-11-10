import asyncio,sys,collections
from playwright.async_api import async_playwright
U=sys.argv[1];WHO=sys.argv[2];MENU=sys.argv[3]
JS=open('tools/pruebas/contrast.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':1366,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(U);await pg.wait_for_timeout(500)
        for th in ['light','dark']:
            await pg.evaluate(f"localStorage.setItem('vb.theme','{th}');themeApply()");r=await pg.evaluate(JS);print('login',th,len(r),[x['t'] for x in r[:3]])
        await pg.click('text='+WHO);await pg.wait_for_timeout(300)
        acts=["ACT.otopen({id:DB.ots[0].id})","ACT.otnew({})","ACT.cliopen({id:DB.clientes[0].id})","ACT.otentregar({id:DB.ots.find(o=>o.estado==='Listo').id})","ACT.legopen({id:'u2'})","ACT.clubcard({id:'c1'})","ACT.repedit({id:DB.repuestos[0].id})","ACT.uxk()","ACT.uxbell()"]
        for th in ['light','dark']:
            await pg.evaluate(f"localStorage.setItem('vb.theme','{th}');themeApply()")
            for a in acts:
                await pg.evaluate("closeModal();['uxk','uxbell'].forEach(i=>{const e=document.getElementById(i);if(e)e.remove()})")
                try:
                    await pg.evaluate(a);await pg.wait_for_timeout(120)
                except Exception as e: print('ERR',a,str(e)[:80]);continue
                r=await pg.evaluate(JS);c=collections.Counter((x['sel'] or '')[:30]+'|'+x['cls'][:25] for x in r)
                print(th,a[:28],len(r),list(c.items())[:4],[x['t'] for x in r[:2]])
        m=await b.new_page(viewport={'width':390,'height':844});await m.goto(U+MENU);await m.wait_for_timeout(800)
        for t in ['prd','srv','tur','club']:
            await m.evaluate(f"PUB.tab='{t}';renderMenu()");r=await m.evaluate(JS);print('menu',t,len(r),[ (x['t'],x['cr']) for x in r[:4]])
        print('ERRS',errs);await b.close()
asyncio.run(main())
