import asyncio,sys
from playwright.async_api import async_playwright
U=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);pg=await b.new_page();e=[];pg.on('pageerror',lambda x:e.append(str(x)))
        for h,exp in [('#menu',''),('#practica-menu','#practica')]:
            await pg.goto(U+h);await pg.wait_for_timeout(500);await pg.dblclick('#pub .ph img');await pg.wait_for_timeout(800)
            print(h,'->',repr(await pg.evaluate("location.hash")),'esperado',repr(exp),'| ingreso visible:',await pg.evaluate("!$('#login').hidden||!$('#app').hidden"))
        print('ERRS',e);await b.close()
asyncio.run(main())
