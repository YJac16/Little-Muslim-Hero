"""Local check: every moment has VOICE + SFX at every step, every referenced file exists and decodes.

Usage:  python3 tools-audio/verify_moments.py http://localhost:4173/
Serve the static build first (npx next build && npx serve out -l 4173).
HTMLMediaElement.play is wrapped to LOG each clip and fire "ended" quickly (no audio device needed).
For each of the 5 moments it checks: question voice, "ready" pop sfx, ambience loop, wrong pick -> cue
(+ spoken retry on the first miss), right pick -> preview voice + twinkle + chime + success voice;
plus start whoosh, start greeting, end celebrate sfx and end voice.  Exit code 1 on any gap."""
import asyncio, re, sys
from playwright.async_api import async_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173/"
MOMENTS = [("Morning", "Hiding under the blanket", "Sitting up in bed"), ("Play Time", "Keeping the toys", "Playing together"),
           ("Meal Time", "Reaching for food quickly", "Ready to eat with a smile"), ("Helping Time", "Playing alone nearby", "Helping with the chore"),
           ("Bedtime", "Jumping on the bed", "Settling calmly for bed")]
INIT = """
window.__plays=[];
const _p=HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play=function(){window.__plays.push(this.src.replace(location.origin,''));
  const s=this; if(!s.loop) setTimeout(()=>s.dispatchEvent(new Event('ended')),350); return Promise.resolve();};
"""
ok = True
def need(label, cond, detail=""):
    global ok
    ok &= bool(cond)
    print(("  OK   " if cond else "  GAP  ") + label + (("  " + detail) if detail else ""))
    return cond
def has(plays, pat): return [p for p in plays if re.search(pat, p)]

async def main():
    global ok
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/opt/google/chrome/chrome", args=["--no-sandbox", "--disable-dev-shm-usage"], headless=True)
        pg = await (await b.new_context(viewport={"width": 390, "height": 844})).new_page()
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.add_init_script(INIT)
        await pg.goto(URL); await pg.wait_for_timeout(1200)
        seen = set()
        async def plays(): return await pg.evaluate("window.__plays")
        i0 = len(await plays())
        await pg.click("text=Start the Day"); await pg.wait_for_timeout(300)
        start = (await plays())[i0:]; seen.update(start)
        print("START SCREEN -> game"); need("start whoosh sfx", has(start, r"ui-whoosh"))
        for n, (name, wrong, right) in enumerate(MOMENTS):
            print(f"{name.upper()}")
            mark = i0 if n == 0 else m3   # plays since this moment began (n=0: since Start was tapped)
            await pg.wait_for_selector('button[aria-label="%s"]:not([disabled])' % wrong, timeout=20000)
            await pg.wait_for_timeout(300)
            enter = (await plays())[mark:]; seen.update(enter)
            if n == 0: need("start greeting voice", has(enter, r"Intro-Assalamu"))
            need("question voice", has(enter, r"(Morning|Play|Meal|Helping|Bedtime)-Intro"))
            need("'ready' pop sfx", has(enter, r"card-pop"))
            need("ambience loop", has(enter, r"/ambience/"))
            m2 = len(await plays())
            await pg.locator('button[aria-label="%s"]' % wrong).click(force=True); await pg.wait_for_timeout(1000)
            w = (await plays())[m2:]; seen.update(w)
            need("wrong pick -> cue", has(w, r"/audio/wrong/"), str(has(w, r"/audio/wrong/")))
            need("wrong pick -> spoken 'Try the other picture' (first miss)", has(w, r"Retry-Try"))
            await pg.wait_for_selector('button[aria-label="%s"]:not([disabled])' % wrong, timeout=20000)
            await pg.wait_for_timeout(300)
            m2 = len(await plays())
            await pg.locator('button[aria-label="%s"]' % wrong).click(force=True); await pg.wait_for_timeout(1300)
            w2 = (await plays())[m2:]; seen.update(w2)
            need("2nd wrong pick -> different cue + retry-pop sfx", has(w2, r"/audio/wrong/") and has(w2, r"retry-pop") and has(w2, r"/audio/wrong/") != has(w, r"/audio/wrong/"), str(has(w2, r"/audio/wrong/")))
            await pg.wait_for_selector('button[aria-label="%s"]:not([disabled])' % wrong, timeout=20000)
            m3 = len(await plays())
            await pg.locator('button[aria-label="%s"]' % right).click(force=True); await pg.wait_for_timeout(3200)
            r = (await plays())[m3:]; seen.update(r)
            need("right pick -> preview voice", has(r, r"Preview-"))
            need("right pick -> twinkle + chime sfx", has(r, r"twinkle") and has(r, r"success-chime"))
            need("right pick -> success voice", has(r, r"Success-"))
        await pg.wait_for_timeout(1500)
        e = (await plays())[m3:]; seen.update(e)
        print("END SCREEN"); need("celebrate sfx", has(e, r"celebrate")); need("end voice", has(e, r"End-MashaAllah"))
        # ?wrong=mine override must put "Mine" on every wrong pick
        pg2 = await (await b.new_context(viewport={"width": 390, "height": 844})).new_page()
        await pg2.add_init_script(INIT); await pg2.goto(URL.rstrip("/") + "/?wrong=mine"); await pg2.wait_for_timeout(1000)
        await pg2.click("text=Start the Day"); await pg2.wait_for_selector('button[aria-label="Hiding under the blanket"]:not([disabled])', timeout=20000)
        for _ in range(2):
            k = len(await pg2.evaluate("window.__plays"))
            await pg2.locator('button[aria-label="Hiding under the blanket"]').click(force=True); await pg2.wait_for_timeout(1000)
            got = (await pg2.evaluate("window.__plays"))[k:]
            need("?wrong=mine -> 'Mine' on every wrong pick", has(got, r"wrong-mine"))
            await pg2.wait_for_selector('button[aria-label="Hiding under the blanket"]:not([disabled])', timeout=20000)
        # every clip that played must exist and decode
        print("FILES")
        for u in sorted(seen):
            rr = await pg.request.get(URL.rstrip("/") + u); body = await rr.body()
            dur = await pg.evaluate("u=>new Promise(res=>{const a=new Audio(u);a.onloadedmetadata=()=>res(a.duration);a.onerror=()=>res(-1)})", u)
            need(u, rr.status == 200 and len(body) > 1000 and dur > 0.05, "%d bytes, %.2fs" % (len(body), dur))
        print("PAGE ERRORS:", errs); ok &= not errs
        await b.close()
    print("RESULT:", "PASS" if ok else "FAIL"); sys.exit(0 if ok else 1)
asyncio.run(main())
