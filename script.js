// MegaBot Landing v2

function openModal(){ document.getElementById('modal').classList.add('open'); }
function closeModal(){ document.getElementById('modal').classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Mobile menu
document.getElementById('burger')?.addEventListener('click', () => {
  document.getElementById('navLinks')?.classList.toggle('open');
});

// Smooth scroll + close menu
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    document.getElementById('navLinks')?.classList.remove('open');
  });
});

// Scroll reveal
const els = document.querySelectorAll('.hero-left, .shot, .feat, .pc, .cmp, .faqs details, .block-head, .band-grid div, .cn');
els.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
els.forEach((el, i) => { el.style.transitionDelay = `${(i % 6) * 0.04}s`; io.observe(el); });

// ===== Realtime price ticker (CoinGecko) =====
const TICKER = [
  ['SOL', 'solana'], ['MON', 'monad'], ['BNB', 'binancecoin'],
  ['ETH', 'ethereum'], ['HYPE', 'hyperliquid'], ['TON', 'the-open-network'],
];
async function loadTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  try {
    const ids = TICKER.map(t => t[1]).join(',');
    const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
    if (!r.ok) return;
    const d = await r.json();
    const items = TICKER.map(([sym, id]) => {
      const p = d[id];
      if (!p || typeof p.usd !== 'number') return '';
      const price = p.usd;
      const ch = typeof p.usd_24h_change === 'number' ? p.usd_24h_change : 0;
      const ps = price >= 1
        ? price.toLocaleString('en-US', { maximumFractionDigits: 2 })
        : price.toLocaleString('en-US', { maximumFractionDigits: 6 });
      const up = ch >= 0;
      return `<span class="tk">${sym} <b class="${up ? 'up' : 'down'}">$${ps} ${up ? '▲' : '▼'}${Math.abs(ch).toFixed(1)}%</b></span>`;
    }).join('');
    if (items) track.innerHTML = items + items; // duplicate for seamless marquee loop
  } catch (e) { /* keep last shown prices */ }
}
loadTicker();
setInterval(loadTicker, 60000);
