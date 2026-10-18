"""Local check: every WRONG pick in every moment plays a wrong-answer cue.

Usage:  python3 tools-audio/verify_wrong_picks.py http://localhost:4173/  [picks_per_moment]
Serve the static build first (npx next build && npx serve out -l 4173).
HTMLMediaElement.play is wrapped to LOG each clip and fire "ended" quickly, so the
test is fast and needs no audio device. Exit code 1 if any wrong pick has no cue,
or if a cue file is missing / empty / longer than 1 s.
"""
import asyncio, json, sys
from playwright.async_api import async_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173/"
PICKS = int(sys.argv[2]) if len(sys.argv) > 2 else 4
MOMENTS = [
    ("Morning", "Hiding under the blanket"),
    ("Play Time", "Keeping the toys"),
    ("Meal Time", "Reaching for food quickly"),
    ("Helping Time", "Playing alone nearby"),
    ("Bedtime", "Jumping on the bed"),
]
CORRECT = {"Morning": "Sitting up in bed", "Play Time": "Playing together", "Meal Time": "Ready to eat with a smile", "Helping Time": "Helping with the chore", "Bedtime": "Settling calmly for bed"}
INIT = """
window.__plays=[];
const _p=HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play=function(){window.__plays.push(this.src.replace(location.origin,''));
  const s=this; setTimeout(()=>s.dispatchEvent(new Event('ended')),350); return Promise.resolve();};
"""
# clips that are NOT a wrong-answer cue (ui blips, narration, hint voice, retry voice)
def WRONGSEL(x):
    return "/audio/wrong/" in x or x.endswith("Preview-Mine.mp3")  # (main branch used Preview-Mine per choice)


async def main():
    results, failed = [], False
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/opt/google/chrome/chrome", args=["--no-sandbox", "--disable-dev-shm-usage"], headless=True)
        pg = await (await b.new_context(viewport={"width": 390, "height": 844})).new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.add_init_script(INIT)
        await pg.goto(URL); await pg.wait_for_timeout(1200)
        await pg.click("text=Start the Day")
        seen = set()
        for name, wrong in MOMENTS:
            await pg.wait_for_selector('button[aria-label="%s"]:not([disabled])' % wrong, timeout=20000)
            picks = []
            for n in range(PICKS):
                await pg.wait_for_selector('button[aria-label="%s"]:not([disabled])' % wrong, timeout=20000)
                await pg.wait_for_timeout(250)
                before = len(await pg.evaluate("window.__plays"))
                await pg.locator('button[aria-label="%s"]' % wrong).click(force=True)
                await pg.wait_for_timeout(450)
                plays = (await pg.evaluate("window.__plays"))[before:]
                cues = [x for x in plays if WRONGSEL(x)]
                picks.append(cues)
                seen.update(cues)
                if not cues:
                    failed = True
                await pg.wait_for_timeout(300)
            results.append({"moment": name, "wrong_label": wrong, "cue_per_wrong_pick": picks})
            await pg.wait_for_selector('button[aria-label="%s"]:not([disabled])' % wrong, timeout=20000)
            await pg.locator('button[aria-label="%s"]' % CORRECT[name]).click(force=True)
            await pg.wait_for_timeout(300)
            await pg.wait_for_timeout(2500)
        # every cue file must exist and be non-empty
        for u in sorted(seen):
            r = await pg.request.get(URL.rstrip("/") + u)
            body = await r.body()
            ok = r.status == 200 and len(body) > 1000
            dur = await pg.evaluate("u=>new Promise(res=>{const a=new Audio(u);a.onloadedmetadata=()=>res(a.duration);a.onerror=()=>res(-1)})", u)
            ok = ok and 0.3 < dur <= 1.0
            print(("OK  " if ok else "FAIL"), u, "http", r.status, len(body), "bytes", "decoded duration %.2fs" % dur)
            failed |= not ok
        await b.close()
    for r in results:
        covered = all(r["cue_per_wrong_pick"])
        print(("COVERED " if covered else "NO AUDIO"), r["moment"], "|", r["wrong_label"], "|", r["cue_per_wrong_pick"])
    print("PAGE ERRORS:", errs)
    print("RESULT:", "FAIL" if failed else "PASS")
    sys.exit(1 if failed else 0)

asyncio.run(main())
