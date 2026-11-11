import asyncio,glob
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page();msgs=[]
        await pg.goto('file:///tmp/t/new.html');await pg.wait_for_timeout(800)
        await pg.fill('#su_n','Seba Chavez');await pg.fill('#su_p','1234');await pg.fill('#su_q','1234');await pg.click('[data-act=setupok]');await pg.wait_for_timeout(1200)
        await pg.evaluate("UI.datTab='resp';go('datos')");f=sorted(glob.glob('/tmp/dl/respaldo_*practica*.json'))[-1]
        await pg.set_input_files('[data-chg=datrest]',f);await pg.wait_for_timeout(600)
        print('práctica en real:',await pg.evaluate("(document.querySelector('#toast')||{}).textContent||''"),'modal',await pg.evaluate("(document.querySelector('.mh')||{}).textContent||''"))
        await b.close()
asyncio.run(main())
