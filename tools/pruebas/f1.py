import asyncio,sys,re
from playwright.async_api import async_playwright
U=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=await b.new_page(viewport={'width':1300,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        J=lambda x:pg.evaluate(x);hits={}
        async def scan(where):
            t=await J("document.body.innerText+' '+[...document.querySelectorAll('[placeholder],[title],[aria-label]')].map(e=>(e.placeholder||'')+' '+(e.title||'')+' '+(e.getAttribute('aria-label')||'')).join(' ')")
            for m in re.findall(r".{0,50}(?:demo|DEMO|Demo|ejemplo|Ejemplo|EJEMPLO|práctica|Práctica|PRÁCTICA|evaluaci).{0,50}",t):hits.setdefault(m.strip(),set()).add(where)
        await pg.goto(U);await pg.wait_for_timeout(500);await scan('login-alta')
        await pg.fill('#su_n','Seba Chavez');await pg.fill('#su_p','1234');await pg.fill('#su_q','1234');await pg.click('[data-act=setupok]');await pg.wait_for_timeout(600)
        await scan('modal-codigo');await J("closeModal&&closeModal()")
        V=await J("NAV.map(n=>n[0])")
        for v in V:
            await J(f"go('{v}')");await pg.wait_for_timeout(80);await scan(v)
        for t in await J("cfTabs().map(x=>x[0])"):
            await J(f"UI.cfTab='{t}';go('config')");await pg.wait_for_timeout(60);await scan('config/'+t)
        for t in ['resp','exp','imp','off']:
            await J(f"UI.datTab='{t}';go('datos')");await pg.wait_for_timeout(60);await scan('datos/'+t)
        await J("ME=null;renderLogin&&renderLogin()");await pg.wait_for_timeout(200);await scan('login')
        await pg.goto(U+'#menu');await pg.wait_for_timeout(600);await scan('menu')
        for k,v in sorted(hits.items()):print(sorted(v)[:4],'|',k)
        print('ERRS',errs);await b.close()
asyncio.run(main())
