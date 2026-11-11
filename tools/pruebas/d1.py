import asyncio,sys,json,os
from playwright.async_api import async_playwright
U=sys.argv[1];WHO=sys.argv[2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        ctx=await b.new_context(viewport={'width':1366,'height':900},accept_downloads=True)
        pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append('C:'+m.text) if m.type=='error' else None)
        J=lambda x:pg.evaluate(x)
        await pg.goto(U);await pg.wait_for_timeout(500);await pg.click('text='+WHO);await pg.wait_for_timeout(500)
        await J("go('datos')");await pg.wait_for_timeout(400)
        print('copias',await J("document.querySelectorAll('#datsnaps tbody tr').length"))
        await pg.screenshot(path='/tmp/t/x_datos.png')
        async def dl(act):
            async with pg.expect_download() as d: await J(act)
            x=await d.value;path='/tmp/dl/'+x.suggested_filename;await x.save_as(path);return path
        # exportar excel completo + clientes csv/json
        await J("UI.datTab='exp';go('datos')")
        fx=await dl("ACT.datxall()");fc=await dl("ACT.datx({k:'clientes',f:'csv'})");fj=await dl("ACT.datx({k:'repuestos',f:'json'})")
        print('archivos',[os.path.basename(f) for f in (fx,fc,fj)])
        # celda con fórmula
        await J("DB.clientes[0].n='=1+1 malicioso';save()");fc2=await dl("ACT.datx({k:'clientes',f:'csv'})");print('csv fila1',open(fc2,encoding='utf-8-sig').read().splitlines()[1][:40])
        await J("DB.clientes[0].n='Cliente Uno';save()")
        # respaldo json
        fb=await dl("ACT.datbk({f:'json'})");print('respaldo',os.path.getsize(fb)//1024,'KB')
        # respaldo cifrado
        await J("ACT.datbk({f:'enc'})");await pg.fill('#bk_p','clave-segura-1');await pg.fill('#bk_q','clave-segura-1')
        async with pg.expect_download() as d: await pg.click('[data-act=mok]')
        x=await d.value;fe='/tmp/dl/'+x.suggested_filename;await x.save_as(fe);ej=json.load(open(fe));print('cifrado',ej['fmt'],ej['alg'],'texto plano visible:', 'Cliente Uno' in open(fe).read())
        # modificar y restaurar desde cifrado
        n0=await J("DB.clientes.length");await J("DB.clientes.push({id:'zz',n:'Temporal',tel:'',doc:'',cond:'CF'});save()")
        await J("UI.datTab='resp';go('datos')")
        await pg.set_input_files('[data-chg=datrest]',fe);await pg.wait_for_timeout(300)
        await pg.fill('#rs_p','mala');await pg.click('[data-act=mok]');await pg.wait_for_timeout(1500);print('clave mala ->',await J("$('#merr').textContent"))
        await pg.fill('#rs_p','clave-segura-1');await pg.click('[data-act=mok]');await pg.wait_for_timeout(2500)
        print('confirmación',await J("MODAL&&MODAL.title"));await pg.click('[data-act=mok]');await pg.wait_for_timeout(800)
        print('clientes',n0,'->',await J("DB.clientes.length"),'temporal borrado',await J("!DB.clientes.some(c=>c.id==='zz')"))
        await J("UI.datTab='resp';go('datos')");await pg.wait_for_timeout(400);print('copias tras restaurar',await J("document.querySelectorAll('#datsnaps tbody tr').length"))
        # importar xlsx de otro programa
        await J("UI.datTab='imp';UI.datImp='clientes';go('datos')")
        await pg.set_input_files('[data-chg=datimpf]','/tmp/dl/clientes_otro.xlsx');await pg.wait_for_timeout(800)
        print('preview',await J("$('#modal').innerText.slice(0,120).replace(/\\n/g,' ')"))
        print('filas',await J("[...document.querySelectorAll('#modal tbody tr')].map(r=>r.innerText.replace(/\\s+/g,' ')).join(' || ')"))
        await pg.screenshot(path='/tmp/t/x_imp.png')
        await pg.click('[data-act=mok]');await pg.wait_for_timeout(800)
        print('importado',await J("JSON.stringify(DB.clientes.filter(c=>/Migrad/.test(c.n)).map(c=>[c.n,c.cond,c.doc,c.mail]))"),await J("JSON.stringify(DB.vehs.filter(v=>v.pat.startsWith('AE')).map(v=>[v.pat,v.km]))"))
        # precios
        await J("UI.datImp='precios';renderView()");p0=await J("DB.repuestos.find(r=>r.cod===DB.repuestos[0].cod).pv")
        await pg.set_input_files('[data-chg=datimpf]','/tmp/dl/precios.xlsx');await pg.wait_for_timeout(800);await pg.click('[data-act=mok]');await pg.wait_for_timeout(600)
        print('precio WO130',p0,'->',await J("DB.repuestos.find(r=>r.cod===DB.repuestos[0].cod).pv"))
        # repuestos: delega
        await J("UI.datImp='repuestos';renderView()");fp=await dl("ACT.datimpl({f:'xlsx'})")
        await J("UI.datImp='repuestos';renderView()");await pg.set_input_files('[data-chg=datimpf]',fp);await pg.wait_for_timeout(800)
        print('repuestos delegado',await J("VIEW"),await J("($('#fi_t')||{}).value||''")[:60] if False else await J("(($('#fi_t')||{}).value||'').slice(0,50)"))
        await J("closeModal()")
        await J("UI.datTab='off';go('datos')");await pg.wait_for_timeout(500);print('off',await J("$('#datoff').innerText.replace(/\\n/g,' | ').slice(0,300)"))
        print('ERRS',errs);await b.close()
asyncio.run(main())
