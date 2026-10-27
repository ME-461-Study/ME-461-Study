/* Gas-dynamics relations for a calorically perfect gas (ME 461 course reader notation).
   theta = shock angle, delta = deflection, nu = Prandtl–Meyer angle, mu = Mach angle. Angles in degrees at the API. */
(function () {
"use strict";
const D2R = Math.PI / 180, R2D = 180 / Math.PI;

function bisect(fn, lo, hi, tol, it) {
  let flo = fn(lo), fhi = fn(hi);
  if (!isFinite(flo) || !isFinite(fhi) || flo * fhi > 0) return NaN;
  for (let i = 0; i < (it || 200); i++) {
    const mid = 0.5 * (lo + hi), fm = fn(mid);
    if (fm === 0 || (hi - lo) < (tol || 1e-12)) return mid;
    if (flo * fm < 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return 0.5 * (lo + hi);
}

/* ---------- isentropic / reference-state relations ---------- */
const TT = (M, g = 1.4) => 1 / (1 + (g - 1) / 2 * M * M);                 // T/Tt
const PT = (M, g = 1.4) => Math.pow(TT(M, g), g / (g - 1));               // p/pt
const RT = (M, g = 1.4) => Math.pow(TT(M, g), 1 / (g - 1));               // rho/rho_t
const AA = (M, g = 1.4) => (1 / M) * Math.pow((2 / (g + 1)) * (1 + (g - 1) / 2 * M * M), (g + 1) / (2 * (g - 1))); // A/A*
function nu(M, g = 1.4) {           // Prandtl–Meyer, degrees
  if (M < 1) return NaN;
  const k = Math.sqrt((g + 1) / (g - 1)), x = Math.sqrt(M * M - 1);
  return (k * Math.atan(x / k) - Math.atan(x)) * R2D;
}
const nuMax = (g = 1.4) => 90 * (Math.sqrt((g + 1) / (g - 1)) - 1);
const mu = M => (M >= 1 ? Math.asin(1 / M) * R2D : NaN);
const pStarPt = (g = 1.4) => Math.pow(2 / (g + 1), g / (g - 1));
const TStarTt = (g = 1.4) => 2 / (g + 1);
/* mass-flow parameter: mdot*sqrt(Tt)/(A*pt) = sqrt(g/R) M (1+(g-1)/2 M^2)^(-(g+1)/(2(g-1))) */
const flowParam = (M, g = 1.4, R = 287) => Math.sqrt(g / R) * M * Math.pow(1 + (g - 1) / 2 * M * M, -(g + 1) / (2 * (g - 1)));
const mdotMax = (pt, Tt, Astar, g = 1.4, R = 287) => Astar * pt / Math.sqrt(Tt) * Math.sqrt(g / R) * Math.pow(2 / (g + 1), (g + 1) / (2 * (g - 1)));

/* inverses */
function M_from_A(Ar, sup, g = 1.4) {
  if (Ar < 1) return NaN; if (Ar === 1) return 1;
  return sup ? bisect(M => AA(M, g) - Ar, 1, 100) : bisect(M => AA(M, g) - Ar, 1e-7, 1);
}
const M_from_TT = (r, g = 1.4) => Math.sqrt(Math.max(0, (1 / r - 1) * 2 / (g - 1)));
const M_from_PT = (r, g = 1.4) => M_from_TT(Math.pow(r, (g - 1) / g), g);
const M_from_RT = (r, g = 1.4) => M_from_TT(Math.pow(r, g - 1), g);
const M_from_nu = (v, g = 1.4) => (v < 0 || v >= nuMax(g) ? NaN : v === 0 ? 1 : bisect(M => nu(M, g) - v, 1, 1e4));
const M_from_mu = m => 1 / Math.sin(m * D2R);
/* A p / (A* pt) at a subsonic exit (reader Eq. 5.14) */
const APprod = (M, g = 1.4) => AA(M, g) * PT(M, g);
function M_from_APprod(v, g = 1.4) { return bisect(M => APprod(M, g) - v, 1e-7, 1); }

function isen(M, g = 1.4) {
  return { M, TT: TT(M, g), PT: PT(M, g), RT: RT(M, g), AA: AA(M, g), nu: nu(M, g), mu: mu(M) };
}

/* ---------- normal shock (shock-fixed frame) ---------- */
function ns(M1, g = 1.4) {
  const m2 = M1 * M1;
  const M2sq = (1 + (g - 1) / 2 * m2) / (g * m2 - (g - 1) / 2);
  const M2 = Math.sqrt(M2sq);
  const p21 = 1 + 2 * g / (g + 1) * (m2 - 1);
  const r21 = (g + 1) * m2 / (2 + (g - 1) * m2);
  const T21 = p21 / r21;
  const pt21 = p21 * Math.pow((1 + (g - 1) / 2 * M2sq) / (1 + (g - 1) / 2 * m2), g / (g - 1));
  const pt2p1 = pt21 / PT(M1, g);
  const dVa1 = 2 * (m2 - 1) / ((g + 1) * M1);
  return { M1, M2, p21, r21, T21, pt21, pt2p1, dVa1, V21: 1 / r21, dsR: -Math.log(pt21) };
}
const NS_HI = 50;
const M1_from_M2 = (M2, g = 1.4) => bisect(M => ns(M, g).M2 - M2, 1, NS_HI);
const M1_from_p21 = (r, g = 1.4) => Math.sqrt((r - 1) * (g + 1) / (2 * g) + 1);
const M1_from_pt21 = (r, g = 1.4) => bisect(M => ns(M, g).pt21 - r, 1, NS_HI);
const M1_from_pt2p1 = (r, g = 1.4) => bisect(M => ns(M, g).pt2p1 - r, 1, NS_HI);
const M1_from_T21 = (r, g = 1.4) => bisect(M => ns(M, g).T21 - r, 1, NS_HI);
const M1_from_r21 = (r, g = 1.4) => bisect(M => ns(M, g).r21 - r, 1, NS_HI);
const M1_from_dVa1 = (x, g = 1.4) => (g + 1) / 4 * x + Math.sqrt(1 + Math.pow((g + 1) / 4 * x, 2)); // reader Eq. 5.20

/* ---------- oblique shock ---------- */
function deltaFromTheta(M, th, g = 1.4) {   // degrees in, degrees out (Eq. 5.24)
  const t = th * D2R, s = Math.sin(t);
  const num = M * M * s * s - 1, den = M * M * (g + Math.cos(2 * t)) + 2;
  return Math.atan(2 / Math.tan(t) * num / den) * R2D;
}
function thetaAtDmax(M, g = 1.4) {           // golden-section on theta in (mu, 90)
  let a = mu(M), b = 90; const r = (Math.sqrt(5) - 1) / 2;
  let c = b - r * (b - a), d = a + r * (b - a);
  for (let i = 0; i < 200; i++) {
    if (deltaFromTheta(M, c, g) > deltaFromTheta(M, d, g)) b = d; else a = c;
    c = b - r * (b - a); d = a + r * (b - a);
  }
  return (a + b) / 2;
}
function deltaMax(M, g = 1.4) { const th = thetaAtDmax(M, g); return { theta: th, delta: deltaFromTheta(M, th, g) }; }
function thetaFromDelta(M, dl, weak = true, g = 1.4) {
  if (M <= 1) return NaN;
  if (dl === 0) return weak ? mu(M) : 90;
  const dm = deltaMax(M, g);
  if (dl > dm.delta) return NaN;
  return weak ? bisect(t => deltaFromTheta(M, t, g) - dl, mu(M) + 1e-9, dm.theta)
              : bisect(t => deltaFromTheta(M, t, g) - dl, dm.theta, 90 - 1e-9);
}
function oblique(M1, th, g = 1.4) {          // full state from M1 and theta
  const dl = deltaFromTheta(M1, th, g), Mn1 = M1 * Math.sin(th * D2R), s = ns(Mn1, g);
  const M2 = s.M2 / Math.sin((th - dl) * D2R);
  return { M1, theta: th, delta: dl, Mn1, Mn2: s.M2, M2, p21: s.p21, r21: s.r21, T21: s.T21, pt21: s.pt21, dsR: s.dsR };
}
/* sonic-downstream locus: theta at which M2 = 1 on the weak branch */
function thetaSonic(M, g = 1.4) { const tm = thetaAtDmax(M, g); return bisect(t => oblique(M, t, g).M2 - 1, mu(M) + 1e-6, tm); }
/* given M1 and a static-pressure ratio across an oblique shock, find theta (weak or strong are the same theta: unique) */
function thetaFromP21(M, p21, g = 1.4) { const Mn = M1_from_p21(p21, g); return Math.asin(Mn / M) * R2D; }

/* ---------- Prandtl–Meyer turn (positive = expansion) ---------- */
function pmTurn(M1, turn, g = 1.4) {
  const n1 = nu(M1, g), n2 = n1 + turn, M2 = M_from_nu(n2, g);
  return { M1, nu1: n1, nu2: n2, M2, T21: TT(M2, g) / TT(M1, g), p21: PT(M2, g) / PT(M1, g), mu1: mu(M1), mu2: mu(M2) };
}

/* ---------- converging–diverging nozzle with fixed pt, Ae/At ---------- */
function cdNozzle(AeAt, pbpt, g = 1.4) {
  const Msub = M_from_A(AeAt, false, g), Msup = M_from_A(AeAt, true, g);
  const p1st = PT(Msub, g), p3rd = PT(Msup, g), p2nd = p3rd * ns(Msup, g).p21;
  const out = { AeAt, pbpt, Msub, Msup, p1st, p2nd, p3rd };
  if (pbpt >= 1) { out.regime = "no flow"; return out; }
  if (pbpt > p1st) {                     // subsonic everywhere, unchoked
    const Me = M_from_PT(pbpt, g), Astar_Ae = 1 / AA(Me, g);
    out.regime = "subsonic"; out.Me = Me; out.peptt = pbpt; out.AtAstar = AeAt * Astar_Ae; out.choked = false; return out;
  }
  out.choked = true;
  if (pbpt >= p2nd) {                    // normal shock inside the diverging section (or at first critical)
    const prod = AeAt * pbpt, Me = M_from_APprod(prod, g), pte = pbpt / PT(Me, g);
    const Ms = M1_from_pt21(pte, g), As = AA(Ms, g);
    out.regime = pbpt === p1st ? "1st critical" : "internal shock"; out.Me = Me; out.pe = pbpt; out.ptRatio = pte; out.Ms = Ms; out.AsAt = As; out.Ms2 = ns(Ms, g).M2; return out;
  }
  out.Me = Msup; out.pe = p3rd;
  if (Math.abs(pbpt - p3rd) < 1e-9) out.regime = "design (3rd critical)";
  else out.regime = pbpt > p3rd ? "over-expanded" : "under-expanded";
  return out;
}

window.GD = { D2R, R2D, bisect, TT, PT, RT, AA, nu, nuMax, mu, pStarPt, TStarTt, flowParam, mdotMax,
  M_from_A, M_from_TT, M_from_PT, M_from_RT, M_from_nu, M_from_mu, APprod, M_from_APprod, isen,
  ns, M1_from_M2, M1_from_p21, M1_from_pt21, M1_from_pt2p1, M1_from_T21, M1_from_r21, M1_from_dVa1,
  deltaFromTheta, thetaAtDmax, deltaMax, thetaFromDelta, oblique, thetaSonic, thetaFromP21, pmTurn, cdNozzle };
})();
