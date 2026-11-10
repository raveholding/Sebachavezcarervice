(()=>{function rgb(s){const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(x=>parseFloat(x));return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}}
function lum(c){const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b)}
function mix(top,bot){const a=top.a;return {r:top.r*a+bot.r*(1-a),g:top.g*a+bot.g*(1-a),b:top.b*a+bot.b*(1-a),a:1}}
function bgOf(el){const st=[];let e=el;while(e&&e.nodeType===1){const cs=getComputedStyle(e);if(cs.backgroundImage&&cs.backgroundImage!=='none'&&!cs.backgroundImage.startsWith('url'))return null;const c=rgb(cs.backgroundColor);if(c&&c.a>0){st.push(c);if(c.a>=1)break}e=e.parentElement}let b={r:255,g:255,b:255,a:1};if(!st.length||st[st.length-1].a<1){const c=rgb(getComputedStyle(document.body).backgroundColor);if(c&&c.a)b=c}for(let i=st.length-1;i>=0;i--)b=mix(st[i],b);return b}
const out=[];const W=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
while(n=W.nextNode()){const t=n.textContent.trim();if(!t)continue;const el=n.parentElement;if(!el||el.closest('#printArea,svg,[hidden]'))continue;const r=el.getBoundingClientRect();if(!r.width||!r.height)continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)===0)continue;
 let op=1,e2=el;while(e2){op*=parseFloat(getComputedStyle(e2).opacity);e2=e2.parentElement}if(op<.3)continue;
 const fg=rgb(cs.color),bg=bgOf(el);if(!fg||!bg)continue;const f2=mix(fg,bg);const L1=lum(f2),L2=lum(bg);const cr=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);const big=parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.66&&+cs.fontWeight>=700);
 if(cr<(big?3:4.5))out.push({bg:JSON.stringify(bg),t:t.slice(0,40),cr:+cr.toFixed(2),cls:(el.className&&el.className.baseVal===undefined?el.className:'')+'|'+el.tagName,sel:(el.closest('[class]')||{}).className})}
return out})()
