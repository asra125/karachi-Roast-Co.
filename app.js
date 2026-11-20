const C = [{ "id": "espresso", "n": "Espresso", "p": 450 }, { "id": "cappuccino", "n": "Cappuccino", "p": 650 }, { "id": "flat-white", "n": "Flat white", "p": 700 }, { "id": "latte", "n": "Caffe latte", "p": 700 }, { "id": "pour-over", "n": "Pour-over", "p": 850 }, { "id": "cold-brew", "n": "Cold brew", "p": 750 }, { "id": "iced-latte", "n": "Iced latte", "p": 750 }, { "id": "caramel-frappe", "n": "Caramel frappe", "p": 900 }, { "id": "croissant", "n": "Butter croissant", "p": 450 }, { "id": "brownie", "n": "Chocolate brownie", "p": 500 }, { "id": "mocha", "n": "Caffe mocha", "p": 800 }, { "id": "muffin", "n": "Blueberry muffin", "p": 480 }]
    ; (() => {
        const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
        let cart = {}; try { cart = JSON.parse(localStorage.getItem('krc') || '{}') } catch (e) { }
        const save = () => { try { localStorage.setItem('krc', JSON.stringify(cart)) } catch (e) { } const cc = $('#cc'), ct = $('#ct'); const cn = Object.entries(cart).reduce((a, [k, n]) => a + (get(k) ? n : 0), 0), sum = Object.entries(cart).reduce((a, [k, n]) => a + (get(k) ? get(k).p * n : 0), 0); if (cc) cc.textContent = cn; if (ct) ct.textContent = sum; };
        const toast = m => { let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.append(t) } t.textContent = m; t.className = 'show'; clearTimeout(t.h); t.h = setTimeout(() => t.className = '', 1800) };
        const get = id => C.find(x => x.id === id);
        const inj = document.createElement('div'); inj.innerHTML = `<button type="button" id="trolley" aria-label="Open your cart" aria-haspopup="dialog"><span class="ti" aria-hidden="true">🛒</span><span class="tb" id="cc">0</span></button><div id="ov" hidden></div><aside id="drawer" role="dialog" aria-modal="true" aria-labelledby="dt" hidden><div class="dh"><h2 id="dt">Your cart</h2><button type="button" id="dx" aria-label="Close cart">×</button></div><div class="db"><div id="cart" aria-live="polite"></div>
<button type="button" class="btn" id="po">Place order</button>
<form id="oform" novalidate hidden><h3>Delivery details</h3><label>Full name<input type="text" name="name" required data-re="^[A-Za-z][A-Za-z .'-]{2,39}$" data-msg="Enter your name using letters only (3 to 40 characters)." autocomplete="name"><span class="err" role="alert"></span></label><label>Mobile number<input type="tel" name="phone" required data-re="^(?:\\+92|0)3\\d{2}-?\\d{7}$" data-msg="Enter a valid Pakistani mobile number, like 0300-1234567 or +923001234567." autocomplete="tel" placeholder="0300-1234567"><span class="err" role="alert"></span></label><label>Delivery address<textarea name="address" rows="3" required data-re="^[\\s\\S]{10,150}$" data-msg="Enter your full address (10 to 150 characters)."></textarea><span class="err" role="alert"></span></label>
<label>Notes (optional)<input type="text" name="notes" maxlength="100"></label><p>Payment: cash on delivery.</p><button class="btn" type="submit">Confirm order</button></form>
<p class="ok" id="ok" hidden>Order ready! WhatsApp will open so you can send it to us.</p></div></aside>`; document.body.append(...inj.children);
        const dr = $('#drawer'), ov = $('#ov'), tr = $('#trolley'); const openD = () => { render(); dr.hidden = false; ov.hidden = false; document.body.classList.add('lock'); $('#dx').focus() }, closeD = () => { dr.hidden = true; ov.hidden = true; document.body.classList.remove('lock'); tr.focus() }; tr.onclick = openD; $('#dx').onclick = closeD; ov.onclick = closeD; document.addEventListener('keydown', e => { if (e.key === 'Escape' && !dr.hidden) closeD() });
        function check(f) { let ok = true; $$('[data-re]', f).forEach(i => { const bad = !new RegExp(i.dataset.re).test(i.value.trim()); i.nextElementSibling.textContent = bad ? i.dataset.msg : ''; i.setAttribute('aria-invalid', bad); if (bad) ok = false }); return ok }
        $$('form').forEach(f => $$('[data-re]', f).forEach(i => i.addEventListener('blur', () => { if (i.value) check({ querySelectorAll: () => [i] }) })));
        document.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) { cart[b.dataset.add] = (cart[b.dataset.add] || 0) + 1; save(); render(); toast(get(b.dataset.add).n + ' added to cart'); const tb = $('#trolley'); tb.classList.remove('pop'); void tb.offsetWidth; tb.classList.add('pop'); const okm = $('#ok'); if (okm) okm.hidden = true } });
        const list = $('#items'); if (list) {
            let F = 'all'; const items = $$('.item', list), q = $('#q'), so = $('#sort');
            const run = () => {
                const k = q.value.trim().toLowerCase(); let v = items.filter(i => { const ok = (F === 'all' || i.dataset.cat === F) && (!k || i.dataset.name.includes(k) || i.dataset.cat.includes(k)); i.hidden = !ok; return ok });
                const s = so.value, d = i => +i.dataset.price; v.sort((a, b) => s === 'pa' ? d(a) - d(b) : s === 'pd' ? d(b) - d(a) : s === 'na' ? a.dataset.name.localeCompare(b.dataset.name) : a.dataset.i - b.dataset.i); v.forEach(i => list.append(i)); $('#none').hidden = v.length > 0
            };
            $$('.chips button').forEach(b => b.onclick = () => { F = b.dataset.f; $$('.chips button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b) }); run() }); q.oninput = run; so.onchange = run
        }
        const cb = $('#cart'); let total = 0;
        function render() {
            const ids = Object.keys(cart).filter(k => cart[k] > 0 && get(k)); total = 0;
            cb.innerHTML = ids.length ? '<ul class="cl">' + ids.map(k => { const c = get(k), n = cart[k]; total += c.p * n; return `<li><span>${c.n}</span><span class="qty"><button type="button" data-d="${k}" aria-label="Remove one ${c.n}">-</button> ${n} <button type="button" data-u="${k}" aria-label="Add one ${c.n}">+</button></span><b>Rs ${c.p * n}</b></li>` }).join('') + `</ul><p class="tot">Total: Rs ${total}</p>` : '<p>Your cart is empty. <a href="menu.html">Browse the coffee menu</a>.</p>'
        }
        if (cb) { render(); cb.onclick = e => { const u = e.target.dataset.u, d = e.target.dataset.d; if (u) cart[u]++; if (d) { cart[d]--; if (cart[d] <= 0) delete cart[d] } if (u || d) { save(); render() } } }
        const of = $('#oform'); if (of) of.onsubmit = e => {
            e.preventDefault(); if (!check(of)) return; if (!total) { toast('Your cart is empty'); return }
            const v = n => of.elements[n].value.trim(), L = Object.keys(cart).filter(k => cart[k] > 0).map(k => `${cart[k]} x ${get(k).n}`).join(', ');
            const t = `New order%0AItems: ${L}%0ATotal: Rs ${total}%0AName: ${v('name')}%0APhone: ${v('phone')}%0AAddress: ${v('address')}%0ANotes: ${v('notes')}`;
            $('#ok').hidden = false; cart = {}; save(); render(); of.reset(); of.hidden = true; window.open('https://wa.me/920000000000?text=' + t, '_blank')
        };
        const cf = $('#cform'); if (cf) cf.onsubmit = e => {
            e.preventDefault(); if (!check(cf)) return; const v = n => cf.elements[n].value.trim(); $('#ok').hidden = false;
            location.href = 'mailto:hello@karachiroast.pk?subject=' + encodeURIComponent('Message from ' + v('name')) + '&body=' + encodeURIComponent(v('message') + '\n\nPhone: ' + v('phone') + '\nEmail: ' + v('email')); cf.reset()
        };
        const ff = $('#fform'); if (ff) ff.onsubmit = e => {
            e.preventDefault(); if (!check(ff)) return; const v = n => ff.elements[n].value.trim(); $('#ok').hidden = false;
            location.href = 'mailto:hello@karachiroast.pk?subject=' + encodeURIComponent('Feedback (' + v('rating') + '/5) from ' + v('name')) + '&body=' + encodeURIComponent(v('message') + '\n\nRating: ' + v('rating') + '/5\nName: ' + v('name') + '\nPhone: ' + v('phone') + '\nEmail: ' + v('email')); ff.reset()
        };
        const po = $('#po'); if (po) po.onclick = () => { if (!total) { toast('Add items to your cart first'); return } of.hidden = false; of.elements.name.focus() };
        const vc = $('#vc'); if (vc) { let n = 1; try { n = (+localStorage.getItem('krc_v') || 0) + 1; localStorage.setItem('krc_v', n) } catch (e) { } vc.textContent = n.toLocaleString(); const vt = $('#vct'); if (vt) vt.textContent = n.toLocaleString() }
        save()
    })();
