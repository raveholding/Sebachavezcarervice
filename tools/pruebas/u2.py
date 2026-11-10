import asyncio,sys,json,collections
from playwright.async_api import async_playwright
U=sys.argv[1];WHO=sys.argv[2]
JS=open('tools/pruebas/contrast.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':1366,'height':900})
        await pg.goto(U);await pg.wait_for_timeout(500);await pg.click('text='+WHO);await pg.wait_for_timeout(400)
        views=await pg.evaluate("NAV.map(n=>n[0]).filter(v=>can(v))")
        tot=collections.Counter();ex={}
        for th in ['light','dark']:
            await pg.evaluate(f"localStorage.setItem('vb.theme','{th}');themeApply()")
            for v in views:
                await pg.evaluate(f"go('{v}')");await pg.wait_for_timeout(60)
                r=await pg.evaluate(JS)
                for x in r:
                    k=(th,v,x['cls'][:40]);tot[k]+=1;ex.setdefault(k,x)
        for k,c in sorted(tot.items()):print(k,c,ex[k]['t'],ex[k]['cr'])
        print('TOTAL',sum(tot.values()))
        await b.close()
asyncio.run(main())
