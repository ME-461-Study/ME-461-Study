/* Multi-part, homework-style problems for ME 461/561 (Ch 1–6).
   Each generator returns { setup, parts:[{ q, ans, unit, sig?, abs?, steps:[] }] }.
   gen(o) accepts overrides so answers can be checked against the homework and reader examples. */
(function () {
"use strict";
const R = String.raw, G = window.GD;
const RAIR = 287, GAM = 1.4, CPAIR = 1004.5, D2R = Math.PI / 180;
const rnd = (a, b, s) => { const st = s || 1; return Math.round((a + Math.random() * (b - a)) / st) * st; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const f = (x, d) => Number(x).toLocaleString("en-US", { maximumFractionDigits: d == null ? 3 : d, minimumFractionDigits: 0 });
const HW = [];
function hw(id, t, mr, title, based, eq, src, gen) { HW.push({ id, t, mr: !!mr, title, based, eq, src, gen }); }

/* ---------- HW 1 #1: isothermal duct ---------- */
hw("hw-isoduct","rtt",1,"Isothermal duct: mass flow, exit pressure, heat","HW 1 #1",["mass","eos","sfee","dudh"],"HW1 #1; Reader §2.3–2.4",(o={})=>{
  const gas = o.gas ?? pick([["methane",16.0,1.32],["nitrogen",28.0,1.4],["helium",4.0,1.667],["air",28.97,1.4]]);
  const D = o.D ?? pick([2,3,4,5]), p1 = o.p1 ?? rnd(150,400,10), T = o.T ?? rnd(250,350,5), V1 = o.V1 ?? rnd(10,40,1), V2 = o.V2 ?? V1 + rnd(3,15,1);
  const Rg = 8314/gas[1], A = Math.PI*(D/200)**2, rho1 = p1*1000/(Rg*T), m = rho1*A*V1, p2 = p1*V1/V2, Q = m*(V2*V2 - V1*V1)/2;
  return { setup: R`${gas[0][0].toUpperCase()+gas[0].slice(1)} (\(\hat m = ${gas[1]}\) kg/kmol, \(\gamma = ${gas[2]}\)) enters a horizontal ${D} cm diameter duct at ${p1} kPa, ${T} K and ${V1} m/s, and leaves at ${V2} m/s. The flow is steady and isothermal, with no shaft work and uniform properties at each section.`,
    parts: [
      { q: "Specific gas constant", ans: Rg, unit: "J/(kg·K)", steps: [R`\(R = 8314/${gas[1]} = ${f(Rg,1)}\ \mathrm{J/(kg\,K)}\)`] },
      { q: "Mass flow rate", ans: m, unit: "kg/s", sig: true, steps: [R`\(\rho_1 = p_1/(RT) = ${f(p1*1000,0)}/(${f(Rg,1)}\cdot${T}) = ${f(rho1,4)}\ \mathrm{kg/m^3}\)`, R`\(A = \pi(${f(D/200,3)})^2 = ${A.toExponential(3)}\ \mathrm{m^2}\)`, R`\(\dot m = \rho_1AV_1 = ${f(m,5)}\) kg/s`] },
      { q: "Exit pressure", ans: p2, unit: "kPa", steps: [R`Constant A: \(\rho_2 = \rho_1V_1/V_2\). Isothermal: \(p \propto \rho\)`, R`\(p_2 = p_1V_1/V_2 = ${p1}(${V1}/${V2}) = ${f(p2,2)}\) kPa`] },
      { q: "Heat-transfer rate (positive into the gas)", ans: Q, unit: "W", steps: [R`SFEE: \(\dot Q = \dot m[\Delta h + \Delta(V^2/2)]\), with \(\Delta h = C_p\Delta T = 0\)`, R`\(\dot Q = ${f(m,5)}(${V2}^2 - ${V1}^2)/2 = ${f(Q,3)}\) W, into the gas`] }
    ] };
});

/* ---------- HW 1 #2: tank filling ---------- */
hw("hw-tank","rtt",1,"Filling an insulated tank","HW 1 #2",["tankfill","cvenergy","eos"],"HW1 #2; Reader §2.4.1",(o={})=>{
  const Vt = o.Vt ?? rnd(0.05,0.5,0.05), p1 = o.p1 ?? rnd(80,200,10), T1 = o.T1 ?? rnd(280,320,5), T0 = o.T0 ?? T1, k = o.k ?? pick([1.5,2,2.5,3]), p0 = o.p0 ?? rnd(500,1000,50);
  const m1 = p1*1000*Vt/(RAIR*T1), dm = (k-1)*m1, m2 = k*m1, T2 = (GAM*T0*dm + T1*m1)/m2, p2 = m2*RAIR*T2/Vt/1000;
  const Qiso = -RAIR*T1*dm;
  return { setup: R`A rigid, insulated ${f(Vt,2)} m³ tank holds air at ${p1} kPa and ${T1} K. A valve connects it to a large reservoir at ${p0} kPa and ${T0} K. The valve is closed once the tank's mass is ${k} times its initial value. The final tank gas is uniform and at rest. Use \(R = 287\ \mathrm{J/(kg\,K)}\), \(\gamma = 1.4\); neglect KE and PE.`,
    parts: [
      { q: "Initial mass in the tank", ans: m1, unit: "kg", steps: [R`\(m_1 = p_1\forall/(RT_1) = ${f(p1*1000,0)}(${f(Vt,2)})/(287\cdot${T1}) = ${f(m1,4)}\) kg`] },
      { q: "Mass admitted", ans: dm, unit: "kg", steps: [R`\(\Delta m = (${k} - 1)m_1 = ${f(dm,4)}\) kg`] },
      { q: "Final temperature", ans: T2, unit: "K", steps: [R`Stored energy uses u, incoming flux uses h: \(m_2c_vT_2 - m_1c_vT_1 = \Delta m\,c_pT_0\)`, R`\(T_2 = (\gamma T_0\Delta m + T_1m_1)/m_2 = ${f(T2,2)}\) K`] },
      { q: "Final pressure", ans: p2, unit: "kPa", steps: [R`\(p_2 = m_2RT_2/\forall = ${f(p2,2)}\) kPa (below the ${p0} kPa reservoir, as it must be)`] },
      ...(T0 === T1 ? [{ q: R`If the tank were instead held at ${T1} K throughout, the net heat transfer (positive into the gas)`, ans: Qiso/1000, unit: "kJ", steps: [R`\(Q = m_2u - m_1u - h_0\Delta m = \Delta m(u - h) = -RT_1\Delta m\)`, R`\(Q = -287(${T1})(${f(dm,4)}) = ${f(Qiso/1000,3)}\) kJ (heat removed)`] }] : [])
    ] };
});

/* ---------- HW 1 #3: rocket in free space ---------- */
hw("hw-rocket","ent",1,"Rocket course correction","HW 1 #3",["rocket","cvmom","mass"],"HW1 #3; Reader §2.5",(o={})=>{
  const Ms = o.Ms ?? rnd(200,800,50), Mf = o.Mf ?? rnd(300,1500,50), A = o.A ?? pick([0.25,0.5,1,2]), vex = o.vex ?? rnd(2000,4000,100), rho = o.rho ?? pick([20,50,100,200]);
  const md = rho*A*vex, tb = Mf/md, dv = vex*Math.log((Ms+Mf)/Ms), half = vex*Math.log((Ms+Mf)/(Ms+Mf/2));
  return { setup: R`A rocket coasting in deep space has a ${Ms} kg structure and ${Mf} kg of propellant. Its nozzle (exit area ${f(A,2)} m²) expels exhaust at a uniform ${vex} m/s relative to the rocket, with density ${rho} kg/m³. Neglect exhaust pressure forces.`,
    parts: [
      { q: "Exhaust mass flow rate", ans: md, unit: "kg/s", steps: [R`\(\dot m = \rho_{ex}A V_{ex} = ${rho}(${f(A,2)})(${vex}) = ${f(md,0)}\) kg/s`] },
      { q: "Burn time", ans: tb, unit: "s", sig: tb < 0.01, steps: [R`\(t_b = M_f/\dot m = ${Mf}/${f(md,0)} = ${f(tb,6)}\) s`] },
      { q: "Velocity gain when half the propellant is gone", ans: half, unit: "m/s", steps: [R`\(V_R(t) = V_{ex}\ln\!\dfrac{M_0}{M_0 - \dot mt}\)`, R`\(= ${vex}\ln(${Ms+Mf}/${Ms+Mf/2}) = ${f(half,1)}\) m/s`] },
      { q: "Final velocity gain", ans: dv, unit: "m/s", steps: [R`CV around the rocket, inertial frame: \(M_R\,dV_R/dt = \dot mV_{ex}\)`, R`\(\Delta V = V_{ex}\ln(M_0/M_s) = ${vex}\ln(${Ms+Mf}/${Ms}) = ${f(dv,1)}\) m/s`] }
    ] };
});

/* ---------- HW 2 #1: sound speed and acoustic stations ---------- */
hw("hw-sound","sound",1,"Acoustic stations in a duct","HW 2 #1",["a","mach"],"HW2 #1; Reader §3.2–3.3",(o={})=>{
  const T = o.T ?? rnd(250,400,5), Vt = o.V ?? rnd(20,120,1), D = o.D ?? pick([50,100,150,200]);
  const a = Math.sqrt(GAM*RAIR*T), tp = D/(Vt+a), tm = D/(a-Vt);
  const tpR = o.tp ?? Math.round(tp*10000)/10000, tmR = o.tm ?? Math.round(tm*10000)/10000;
  const up = D/tpR, dn = D/tmR, V = (up - dn)/2, aa = (up + dn)/2, TT = aa*aa/(GAM*RAIR);
  return { setup: R`Two acoustic stations fixed to a straight duct are ${D} m apart. Air (\(\gamma = 1.4\), \(R = 287\)) flows steadily and uniformly between them. A small pulse takes \(t_+ = ${f(tpR,4)}\) s to travel downstream and \(t_- = ${f(tmR,4)}\) s to travel upstream.`,
    parts: [
      { q: R`Ratio of Newton's isothermal sound speed to the isentropic one, \(a_T/a_s\)`, ans: 1/Math.sqrt(GAM), unit: "", steps: [R`\(a_T = \sqrt{RT}\), \(a_s = \sqrt{\gamma RT}\), so \(a_T/a_s = 1/\sqrt{1.4} = 0.8452\): 15.5% low`] },
      { q: "Air speed relative to the duct", ans: V, unit: "m/s", steps: [R`\(V + a = D/t_+ = ${f(up,2)}\) m/s; \(a - V = D/t_- = ${f(dn,2)}\) m/s`, R`\(V = (${f(up,2)} - ${f(dn,2)})/2 = ${f(V,2)}\) m/s`] },
      { q: "Sound speed relative to the air", ans: aa, unit: "m/s", steps: [R`\(a = (${f(up,2)} + ${f(dn,2)})/2 = ${f(aa,2)}\) m/s`] },
      { q: "Static temperature", ans: TT, unit: "K", steps: [R`\(T = a^2/(\gamma R) = ${f(aa,2)}^2/(1.4\cdot287) = ${f(TT,1)}\) K`] }
    ] };
});

/* ---------- HW 2 #2: adiabatic device with losses ---------- */
hw("hw-device","stag",1,"Adiabatic device: stagnation states, entropy, area","HW 2 #2",["tt","ptp","ptloss","workA"],"HW2 #2; Reader §3.1, §4.5",(o={})=>{
  const gas = o.gas ?? pick([["CO₂",1.29,189],["air",1.4,287],["argon",1.667,208]]);
  const g = gas[1], Rg = gas[2], hm = (g-1)/2;
  let p1, T1, p2, T2, M2, M1, ds;
  for (let k = 0; k < 50; k++) {
    T1 = o.T1 ?? rnd(450,800,10); M2 = o.M2 ?? rnd(0.6,0.95,0.05); p1 = o.p1 ?? rnd(4,10,0.5);
    const Tt = T1*(1 + hm*rnd(0.1,0.3,0.01)**2); T2 = o.T2 ?? Math.round(Tt/(1 + hm*M2*M2)/5)*5;
    M1 = Math.sqrt((T2*(1+hm*M2*M2)/T1 - 1)/hm);
    const pt1 = p1*Math.pow(1+hm*M1*M1, g/(g-1));
    p2 = o.p2 ?? Math.round(pt1*rnd(0.75,0.95,0.01)/Math.pow(1+hm*M2*M2, g/(g-1))*2)/2;
    const pt2 = p2*Math.pow(1+hm*M2*M2, g/(g-1)); ds = -Rg*Math.log(pt2/pt1);
    if (isFinite(M1) && M1 > 0.05 && M1 < M2 && ds > 0) break;
  }
  const Tt = T2*(1 + hm*M2*M2), pt1 = p1*Math.pow(1+hm*M1*M1, g/(g-1)), pt2 = p2*Math.pow(1+hm*M2*M2, g/(g-1));
  const V1 = M1*Math.sqrt(g*Rg*T1), A21 = (M1/M2)*Math.pow((1+hm*M2*M2)/(1+hm*M1*M1),(g+1)/(2*(g-1)))*Math.exp(ds/Rg), p2max = pt1/Math.pow(1+hm*M2*M2, g/(g-1));
  return { setup: R`${gas[0]} (\(\gamma = ${gas[1]}\), \(R = ${Rg}\ \mathrm{J/(kg\,K)}\)) flows steadily through a horizontal, adiabatic device with no shaft work, one inlet and one outlet. At section 1, \(p_1 = ${f(p1,1)}\) atm and \(T_1 = ${T1}\) K. At section 2, \(p_2 = ${f(p2,1)}\) atm, \(T_2 = ${T2}\) K and \(M_2 = ${f(M2,2)}\).`,
    parts: [
      { q: "Upstream Mach number", ans: M1, unit: "", steps: [R`\(T_t\) is constant: \(T_1(1 + \tfrac{\gamma-1}{2}M_1^2) = T_2(1 + \tfrac{\gamma-1}{2}M_2^2) = ${f(Tt,2)}\) K`, R`\(M_1 = \sqrt{(T_t/T_1 - 1)\cdot 2/(\gamma-1)} = ${f(M1,4)}\)`] },
      { q: "Upstream velocity", ans: V1, unit: "m/s", steps: [R`\(V_1 = M_1\sqrt{\gamma RT_1} = ${f(M1,4)}\sqrt{${g}(${Rg})(${T1})} = ${f(V1,1)}\) m/s`] },
      { q: "Upstream stagnation pressure", ans: pt1, unit: "atm", steps: [R`\(p_{t1} = p_1(1 + \tfrac{\gamma-1}{2}M_1^2)^{\gamma/(\gamma-1)} = ${f(pt1,3)}\) atm`] },
      { q: "Downstream stagnation pressure", ans: pt2, unit: "atm", steps: [R`\(p_{t2} = ${f(p2,1)}(1 + ${f(hm,3)}(${f(M2,2)})^2)^{${f(g/(g-1),3)}} = ${f(pt2,3)}\) atm`] },
      { q: "Specific entropy change", ans: ds, unit: "J/(kg·K)", steps: [R`\(\Delta s = -R\ln(p_{t2}/p_{t1}) = -${Rg}\ln(${f(pt2/pt1,4)}) = ${f(ds,2)}\ \mathrm{J/(kg\,K)}\) (> 0: irreversible, allowed)`] },
      { q: R`Area ratio \(A_2/A_1\)`, ans: A21, unit: "", steps: [R`\(\dfrac{A_2}{A_1} = \dfrac{M_1}{M_2}\left[\dfrac{1+\frac{\gamma-1}{2}M_2^2}{1+\frac{\gamma-1}{2}M_1^2}\right]^{\frac{\gamma+1}{2(\gamma-1)}}e^{\Delta s/R} = ${f(A21,4)}\)`] },
      { q: R`Largest \(p_2\) the second law allows (same inlet, same \(T_2\), \(M_2\))`, ans: p2max, unit: "atm", steps: [R`\(\Delta s \ge 0 \Rightarrow p_{t2} \le p_{t1}\)`, R`\(p_{2,max} = p_{t1}/(1 + \tfrac{\gamma-1}{2}M_2^2)^{\gamma/(\gamma-1)} = ${f(p2max,3)}\) atm`] }
    ] };
});

/* ---------- HW 2 #3a: boom geometry ---------- */
hw("hw-boom","sound",1,"Hearing a supersonic aircraft","HW 2 #3a",["boom","muangle","a"],"HW2 #3a; Reader §3.3.2",(o={})=>{
  const H = o.H ?? rnd(5,15,0.5), T = o.T ?? rnd(216,290,1), M = o.M ?? rnd(1.2,3,0.1);
  const a = Math.sqrt(GAM*RAIR*T), V = M*a, mu = Math.asin(1/M)/D2R, L = H*Math.sqrt(M*M-1), dt = L*1000/V;
  return { setup: R`An aircraft flies level at \(M = ${f(M,1)}\) at an altitude of ${f(H,1)} km and passes directly over a stationary observer. Take the air as uniform at ${T} K (\(\gamma = 1.4\), \(R = 287\)).`,
    parts: [
      { q: "Flight speed", ans: V, unit: "m/s", steps: [R`\(a = \sqrt{1.4(287)(${T})} = ${f(a,2)}\) m/s; \(V = Ma = ${f(V,1)}\) m/s`] },
      { q: "Mach angle", ans: mu, unit: "°", abs: 0.1, steps: [R`\(\mu = \sin^{-1}(1/${f(M,1)}) = ${f(mu,2)}°\)`] },
      { q: "Distance flown past the overhead point when the boom arrives", ans: L, unit: "km", steps: [R`\(M = \sqrt{1 + (L/H)^2} \Rightarrow L = H\sqrt{M^2 - 1} = ${f(L,3)}\) km`] },
      { q: "Delay between overhead passage and hearing the boom", ans: dt, unit: "s", steps: [R`\(\Delta t = L/V = ${f(L*1000,0)}/${f(V,1)} = ${f(dt,2)}\) s`] }
    ] };
});

/* ---------- HW 2 #3b: accelerating aircraft ---------- */
hw("hw-accel","sound",1,"Disturbances from an accelerating aircraft","HW 2 #3b",["mach","boom"],"HW2 #3b",(o={})=>{
  const x0 = o.x0 ?? -rnd(25000,45000,1000), y = o.y ?? rnd(6000,12000,500), V0 = o.V0 ?? rnd(120,200,10), acc = o.acc ?? pick([5,8,10,12]), a = o.a ?? 300, te = o.te ?? pick([30,40,45,50]);
  const ts = (a - V0)/acc, x = t => x0 + V0*t + 0.5*acc*t*t, xs = x(ts);
  const arr0 = Math.hypot(x0, y)/a, arrE = te + Math.hypot(x(te), y)/a;
  return { setup: R`An observer is at \((0, 0)\). At \(t = 0\) an aircraft at \((${f(x0,0)}, ${f(y,0)})\) m moves in \(+x\) at ${V0} m/s and accelerates horizontally at ${acc} m/s² at constant altitude. Take \(a = ${a}\) m/s and a uniform, still atmosphere.`,
    parts: [
      { q: "Time at which the aircraft becomes sonic", ans: ts, unit: "s", steps: [R`\(V(t) = ${V0} + ${acc}t = ${a} \Rightarrow t = ${f(ts,3)}\) s`] },
      { q: "x-position where it becomes sonic", ans: xs, unit: "m", steps: [R`\(x = x_0 + V_0t + \tfrac12a_ct^2 = ${f(xs,1)}\) m`] },
      { q: R`Time the observer receives the disturbance emitted at \(t = 0\)`, ans: arr0, unit: "s", steps: [R`\(t = 0 + \sqrt{x_0^2 + y^2}/a = ${f(Math.hypot(x0,y),1)}/${a} = ${f(arr0,2)}\) s`] },
      { q: R`Time the observer receives the disturbance emitted at \(t = ${te}\) s`, ans: arrE, unit: "s", steps: [R`\(x(${te}) = ${f(x(te),1)}\) m`, R`\(t = ${te} + \sqrt{x^2 + y^2}/a = ${f(arrE,2)}\) s`, arrE < arr0 ? R`It arrives first: the aircraft spent the time between emissions going faster than sound, so the later pulse started much closer.` : R`The earlier pulse still arrives first here, because the aircraft was not yet far enough ahead of its own sound.`] }
    ] };
});

/* ---------- Reader 4.7.1: subsonic diffuser ---------- */
hw("hw-diffuser","area",1,"Subsonic diffuser","Reader Ex. 4.7.1",["aastar","chain","ptp","tt"],"Reader §4.7.1",(o={})=>{
  const M1 = o.M1 ?? rnd(0.3,0.8,0.05), Ar = o.Ar ?? rnd(1.5,3.5,0.1), p1 = o.p1 ?? rnd(1,6,0.5), T1 = o.T1 ?? rnd(280,600,10);
  const A1 = G.AA(M1), A2 = A1*Ar, M2 = G.M_from_A(A2,false), Msup = G.M_from_A(A2,true), p2 = p1*G.PT(M2)/G.PT(M1), T2 = T1*G.TT(M2)/G.TT(M1), pt = p1/G.PT(M1);
  return { setup: R`Air (\(\gamma = 1.4\)) enters a diverging passage at \(M_1 = ${f(M1,2)}\), \(p_1 = ${f(p1,1)}\) bar and \(T_1 = ${T1}\) K. The area ratio is \(A_2/A_1 = ${f(Ar,1)}\). The flow is steady and isentropic.`,
    parts: [
      { q: R`\(A_1/A^*\)`, ans: A1, unit: "", steps: [R`\(A_1/A^* = \dfrac{1}{M_1}\left[\dfrac{1 + 0.2M_1^2}{1.2}\right]^3 = ${f(A1,5)}\)`] },
      { q: R`\(A_2/A^*\)`, ans: A2, unit: "", steps: [R`\(A_2/A^* = (A_2/A_1)(A_1/A^*) = ${f(Ar,1)}(${f(A1,5)}) = ${f(A2,5)}\); \(A^*\) unchanged (isentropic)`] },
      { q: "Exit Mach number", ans: M2, unit: "", steps: [R`Roots: \(${f(M2,4)}\) and \(${f(Msup,4)}\)`, R`Subsonic inlet, no throat: the flow decelerates, so \(M_2 = ${f(M2,4)}\)`] },
      { q: "Exit static pressure", ans: p2, unit: "bar", steps: [R`\(p_t = p_1/(p/p_t)_1 = ${f(pt,4)}\) bar, constant`, R`\(p_2 = p_t(p/p_t)_2 = ${f(p2,4)}\) bar (rises in a diffuser)`] },
      { q: "Exit static temperature", ans: T2, unit: "K", steps: [R`\(T_2 = T_1\dfrac{1 + 0.2M_1^2}{1 + 0.2M_2^2} = ${f(T2,2)}\) K`] }
    ] };
});

/* ---------- Reader 4.8–4.9, 5.4.1: CD nozzle operating map ---------- */
hw("hw-cdmap","noz",1,"CD nozzle: mass flow and critical back pressures","Reader Ex. 4.9.1 & 5.4.1",["mdotmax","aastar","ptp","nsp","pstar"],"Reader §4.8–4.9; Reader §5.4.1",(o={})=>{
  const pt = o.pt ?? rnd(200,2000,50), Tt = o.Tt ?? rnd(280,1000,10), At = o.At ?? rnd(5,50,1), Ar = o.Ar ?? rnd(1.6,4,0.05);
  const Msub = G.M_from_A(Ar,false), Msup = G.M_from_A(Ar,true), p1 = pt*G.PT(Msub), p3 = pt*G.PT(Msup), p2 = p3*G.ns(Msup).p21, m = G.mdotMax(pt*1000,Tt,At*1e-4);
  return { setup: R`A converging–diverging nozzle with a ${At} cm² throat and \(A_e/A_t = ${f(Ar,2)}\) is supplied with air (\(\gamma = 1.4\), \(R = 287\)) from a large reservoir at ${pt} kPa and ${Tt} K.`,
    parts: [
      { q: "Mass flow rate when choked", ans: m, unit: "kg/s", steps: [R`\(\dot m = 0.040418\,A_tp_t/\sqrt{T_t} = 0.040418(${At}\times10^{-4})(${pt}\times10^3)/\sqrt{${Tt}} = ${f(m,4)}\) kg/s`] },
      { q: "Design exit Mach number", ans: Msup, unit: "", steps: [R`Supersonic root of \(A/A^* = ${f(Ar,2)}\): \(M_e = ${f(Msup,4)}\)`] },
      { q: "Third critical (design) back pressure", ans: p3, unit: "kPa", steps: [R`\(p_e = p_t(p/p_t) = ${pt}(${f(G.PT(Msup),5)}) = ${f(p3,2)}\) kPa`] },
      { q: "First critical back pressure", ans: p1, unit: "kPa", steps: [R`Subsonic root: \(M_e = ${f(Msub,4)}\)`, R`\(p_b = ${pt}(${f(G.PT(Msub),5)}) = ${f(p1,2)}\) kPa (well above \(0.5283p_t = ${f(0.52828*pt,1)}\) kPa)`] },
      { q: "Second critical back pressure (normal shock at the exit)", ans: p2, unit: "kPa", steps: [R`Shock at \(M = ${f(Msup,4)}\): \(p_2/p_1 = ${f(G.ns(Msup).p21,4)}\)`, R`\(p_b = ${f(p3,3)}(${f(G.ns(Msup).p21,4)}) = ${f(p2,2)}\) kPa`] }
    ] };
});

/* ---------- Reader 5.4.2: locating an internal shock ---------- */
hw("hw-shockloc","ns",1,"Locating a normal shock in a nozzle","Reader Ex. 5.4.2",["approd","ptastar","nspt","aastar"],"Reader §5.4.2",(o={})=>{
  const Ar = o.Ar ?? rnd(1.8,3.5,0.05), z = G.cdNozzle(Ar, 0.5);
  const pb = o.pb ?? Math.round((z.p2nd + (z.p1st - z.p2nd)*rnd(0.2,0.8,0.01))*1000)/1000, n = G.cdNozzle(Ar, pb), prod = Ar*pb;
  return { setup: R`Air flows through a CD nozzle with \(A_e/A_t = ${f(Ar,2)}\). The back pressure is \(p_b = ${f(pb,3)}\,p_{t1}\), which lies between the first and second critical values, so a normal shock stands in the diverging section and the exit is subsonic (\(p_e = p_b\)). Flow is isentropic except across the shock; \(\gamma = 1.4\).`,
    parts: [
      { q: R`\(A_ep_e/(A_tp_{t1})\)`, ans: prod, unit: "", steps: [R`\(${f(Ar,2)}\times${f(pb,3)} = ${f(prod,4)}\)`] },
      { q: "Exit Mach number", ans: n.Me, unit: "", steps: [R`Because \(p_{t1}A_t = p_{te}A_e^*\), the product equals \(\dfrac{A_ep_e}{A_e^*p_{te}} = \dfrac{1}{M_e}(1/1.2)^3(1 + 0.2M_e^2)^{-1/2}\)`, R`Solve (subsonic): \(M_e = ${f(n.Me,4)}\)`] },
      { q: R`Stagnation-pressure ratio \(p_{te}/p_{t1}\)`, ans: n.ptRatio, unit: "", steps: [R`\(p_{te}/p_{t1} = (p_e/p_{t1})/(p_e/p_{te}) = ${f(pb,3)}/${f(G.PT(n.Me),5)} = ${f(n.ptRatio,5)}\)`, "This is the whole loss, taken across the shock."] },
      { q: "Mach number just upstream of the shock", ans: n.Ms, unit: "", steps: [R`Invert \(p_{t2}/p_{t1}\) on the supersonic branch: \(M_s = ${f(n.Ms,4)}\) (downstream \(${f(n.Ms2,4)}\))`] },
      { q: R`Area ratio at the shock \(A_s/A_t\)`, ans: n.AsAt, unit: "", steps: [R`Upstream of the shock \(A^* = A_t\), so \(A_s/A_t = A/A^*\) at \(M_s\) \(= ${f(n.AsAt,4)}\)`] }
    ] };
});

/* ---------- Reader 5.3: normal shock properties ---------- */
hw("hw-ns","ns",1,"Standing normal shock","Reader §5.3",["nsp","nsrho","nspt","tt","ptp"],"Reader §5.3; App. B",(o={})=>{
  const M1 = o.M1 ?? rnd(1.3,4,0.05), p1 = o.p1 ?? rnd(10,120,5), T1 = o.T1 ?? rnd(200,400,5), s = G.ns(M1);
  const pt1 = p1/G.PT(M1), Tt = T1/G.TT(M1), V1 = M1*Math.sqrt(GAM*RAIR*T1), T2 = T1*s.T21, V2 = s.M2*Math.sqrt(GAM*RAIR*T2), ds = -RAIR*Math.log(s.pt21);
  return { setup: R`Air (\(\gamma = 1.4\), \(R = 287\)) at \(M_1 = ${f(M1,2)}\), \(p_1 = ${p1}\) kPa and \(T_1 = ${T1}\) K approaches a standing normal shock.`,
    parts: [
      { q: "Upstream stagnation pressure", ans: pt1, unit: "kPa", steps: [R`\(p_{t1} = p_1(1 + 0.2M_1^2)^{3.5} = ${f(pt1,2)}\) kPa`] },
      { q: "Downstream Mach number", ans: s.M2, unit: "", steps: [R`\(M_2 = ${f(s.M2,5)}\)`] },
      { q: "Downstream static pressure", ans: p1*s.p21, unit: "kPa", steps: [R`\(p_2/p_1 = ${f(s.p21,5)}\), so \(p_2 = ${f(p1*s.p21,2)}\) kPa`] },
      { q: "Downstream static temperature", ans: T2, unit: "K", steps: [R`\(T_2/T_1 = ${f(s.T21,5)}\), so \(T_2 = ${f(T2,2)}\) K (and \(T_{t2} = T_{t1} = ${f(Tt,1)}\) K)`] },
      { q: "Downstream stagnation pressure", ans: pt1*s.pt21, unit: "kPa", steps: [R`\(p_{t2}/p_{t1} = ${f(s.pt21,5)}\), so \(p_{t2} = ${f(pt1*s.pt21,2)}\) kPa`] },
      { q: "Entropy increase", ans: ds, unit: "J/(kg·K)", steps: [R`\(\Delta s = -R\ln(p_{t2}/p_{t1}) = ${f(ds,2)}\ \mathrm{J/(kg\,K)}\)`] },
      { q: "Downstream velocity", ans: V2, unit: "m/s", steps: [R`\(V_2 = V_1(\rho_1/\rho_2) = ${f(V1,1)}/${f(s.r21,4)} = ${f(V2,1)}\) m/s`] }
    ] };
});

/* ---------- Reader 5.5.1: moving shock ---------- */
hw("hw-moving","mov",1,"Shock moving into still air","Reader Ex. 5.5.1",["galilean","nsp","htframe","tt"],"Reader §5.5",(o={})=>{
  const p1 = o.p1 ?? rnd(80,110,0.1), T1 = o.T1 ?? rnd(270,320,1), Vs = o.Vs ?? rnd(420,900,0.1);
  const a1 = Math.sqrt(GAM*RAIR*T1), M = Vs/a1, s = G.ns(M), T2 = T1*s.T21, V2p = s.M2*Math.sqrt(GAM*RAIR*T2), V2 = Vs - V2p, Tt2 = T2 + V2*V2/(2*CPAIR);
  return { setup: R`A planar shock moves at ${f(Vs,1)} m/s into still air at ${f(p1,1)} kPa and ${T1} K (\(\gamma = 1.4\), \(R = 287\), \(C_p = 1004.5\)). Report lab-frame speeds as magnitudes in the direction the shock travels.`,
    parts: [
      { q: R`Shock-frame upstream Mach number \(M_1'\)`, ans: M, unit: "", steps: [R`\(a_1 = ${f(a1,2)}\) m/s; \(M_1' = ${f(Vs,1)}/${f(a1,2)} = ${f(M,5)}\)`] },
      { q: "Pressure behind the shock", ans: p1*s.p21, unit: "kPa", steps: [R`\(p_2/p_1 = ${f(s.p21,5)}\), so \(p_2 = ${f(p1*s.p21,2)}\) kPa`] },
      { q: "Temperature behind the shock", ans: T2, unit: "K", steps: [R`\(T_2/T_1 = ${f(s.T21,5)}\), so \(T_2 = ${f(T2,2)}\) K`] },
      { q: "Lab-frame speed of the gas behind the shock", ans: V2, unit: "m/s", steps: [R`\(V_2' = M_2'\sqrt{\gamma RT_2} = ${f(s.M2,5)}\sqrt{1.4(287)(${f(T2,2)})} = ${f(V2p,2)}\) m/s relative to the shock`, R`Transform back: the gas follows the shock at \(${f(Vs,1)} - ${f(V2p,2)} = ${f(V2,2)}\) m/s`] },
      { q: "Lab-frame stagnation temperature behind the shock", ans: Tt2, unit: "K", steps: [R`\(T_{t2} = T_2 + V_2^2/(2C_p) = ${f(Tt2,2)}\) K, versus \(T_{t1} = ${T1}\) K: stagnation properties depend on the frame`] }
    ] };
});

/* ---------- Reader 5.6.1: reflected shock ---------- */
hw("hw-reflect","mov",1,"Shock reflection from a closed end","Reader Ex. 5.6.1",["reflM","dva","nsp"],"Reader §5.6",(o={})=>{
  const p1 = o.p1 ?? rnd(1,5,0.5), T1 = o.T1 ?? rnd(280,500,5), Vu = o.Vu ?? rnd(100,450,10);
  const a1 = Math.sqrt(GAM*RAIR*T1), M = G.M1_from_dVa1(Vu/a1), s = G.ns(M), T2 = T1*s.T21, VR = M*a1 - Vu;
  return { setup: R`Behind an incident shock, air at \(p_1 = ${f(p1,1)}\) bar and \(T_1 = ${T1}\) K moves at \(V_u = ${Vu}\) m/s toward the closed end of a tube. A reflected shock brings it to rest (\(\gamma = 1.4\), \(R = 287\)).`,
    parts: [
      { q: R`\(V_u/a_1\)`, ans: Vu/a1, unit: "", steps: [R`\(a_1 = ${f(a1,2)}\) m/s; \(V_u/a_1 = ${f(Vu/a1,5)}\)`] },
      { q: R`Reflected-shock Mach number \(M_1'\)`, ans: M, unit: "", steps: [R`Gas behind is at rest, so \(\Delta V/a_1 = V_u/a_1\)`, R`\(M_1' = \tfrac{\gamma+1}{4}\tfrac{V_u}{a_1} + \sqrt{1 + (\tfrac{\gamma+1}{4}\tfrac{V_u}{a_1})^2} = ${f(M,5)}\)`] },
      { q: "Pressure next to the wall", ans: p1*s.p21, unit: "bar", steps: [R`\(p_2/p_1 = ${f(s.p21,5)}\), so \(p_2 = ${f(p1*s.p21,3)}\) bar`] },
      { q: "Temperature next to the wall", ans: T2, unit: "K", steps: [R`\(T_2 = ${T1}(${f(s.T21,5)}) = ${f(T2,2)}\) K`] },
      { q: "Reflected shock speed in the lab frame", ans: VR, unit: "m/s", steps: [R`\(V_R = M_1'a_1 - V_u = ${f(M*a1,2)} - ${Vu} = ${f(VR,2)}\) m/s`] }
    ] };
});

/* ---------- Reader 5.9: Pitot ---------- */
hw("hw-pitot","obl",0,"Supersonic Pitot measurement","Reader §5.9",["pitot","ptp","nspt"],"Reader §5.9",(o={})=>{
  const M = o.M ?? rnd(1.4,3.5,0.05), p1 = o.p1 ?? rnd(10,80,1), T1 = o.T1 ?? rnd(200,300,5), s = G.ns(M), pt2 = p1*s.pt2p1, pt1 = p1/G.PT(M), V = M*Math.sqrt(GAM*RAIR*T1);
  return { setup: R`A Pitot probe in a supersonic air stream reads ${f(pt2,2)} kPa. A static tap in the undisturbed stream reads ${p1} kPa, and the static temperature is ${T1} K (\(\gamma = 1.4\), \(R = 287\)).`,
    parts: [
      { q: R`Ratio \(p_{t2}/p_1\)`, ans: s.pt2p1, unit: "", steps: [R`\(${f(pt2,2)}/${p1} = ${f(s.pt2p1,4)}\)`] },
      { q: "Freestream Mach number", ans: M, unit: "", abs: 0.005, steps: [R`Solve the Rayleigh Pitot relation (or the \(p_{t2}/p_1\) column of Appendix B) on the supersonic branch: \(M_1 = ${f(M,3)}\)`] },
      { q: "Freestream speed", ans: V, unit: "m/s", steps: [R`\(V_1 = M_1\sqrt{\gamma RT_1} = ${f(V,1)}\) m/s`] },
      { q: "Freestream stagnation pressure (what an isentropic probe would read)", ans: pt1, unit: "kPa", steps: [R`\(p_{t1} = p_1(1 + 0.2M_1^2)^{3.5} = ${f(pt1,2)}\) kPa, versus \(p_{t2} = ${f(pt2,2)}\) kPa read behind the shock`] }
    ] };
});

/* ---------- HW 4 #2: normal vs oblique with equal normal Mach ---------- */
hw("hw-twocase","obl",1,"Normal vs. oblique shock with the same normal Mach number","HW 4 #2",["oblnorm","tbm","nspt","ptp"],"HW4 #2; Reader §5.7",(o={})=>{
  const Mn = o.Mn ?? rnd(1.5,2.5,0.1), MO = o.MO ?? Math.round((Mn + rnd(0.5,1.5,0.1))*10)/10, th = Math.asin(Mn/MO)/D2R;
  const s = G.ns(Mn), ob = G.oblique(MO, th), ptN = s.pt21/G.PT(Mn), ptO = s.pt21/G.PT(MO);
  return { setup: R`Two stationary planar shocks act on air with the same \(p_1\) and \(T_1\) (\(\gamma = 1.4\)). Case N: normal shock at \(M_1 = ${f(Mn,1)}\). Case O: \(M_1 = ${f(MO,1)}\) with shock angle \(\theta = \sin^{-1}(${f(Mn,1)}/${f(MO,1)}) = ${f(th,2)}°\).`,
    parts: [
      { q: "Upstream normal Mach number in case O", ans: Mn, unit: "", steps: [R`\(M_{\perp1} = ${f(MO,1)}\sin${f(th,2)}° = ${f(Mn,2)}\), the same as case N, so all static ratios, \(\Delta s\) and \(p_{t2}/p_{t1}\) match`] },
      { q: "Downstream Mach number, case N", ans: s.M2, unit: "", steps: [R`\(M_2 = ${f(s.M2,4)}\)`] },
      { q: "Flow deflection in case O", ans: ob.delta, unit: "°", abs: 0.2, steps: [R`From the θ–δ–M relation at \(M_1 = ${f(MO,1)}\), \(\theta = ${f(th,2)}°\): \(\delta = ${f(ob.delta,2)}°\)`] },
      { q: "Downstream Mach number, case O", ans: ob.M2, unit: "", steps: [R`\(M_2 = M_{\perp2}/\sin(\theta - \delta) = ${f(s.M2,4)}/\sin(${f(th-ob.delta,2)}°) = ${f(ob.M2,4)}\): still supersonic`] },
      { q: R`\(p_{t2}/p_1\), case N`, ans: ptN, unit: "", steps: [R`\((p_{t2}/p_{t1})(p_{t1}/p_1) = ${f(s.pt21,5)}\times${f(1/G.PT(Mn),4)} = ${f(ptN,4)}\)`] },
      { q: R`\(p_{t2}/p_1\), case O`, ans: ptO, unit: "", steps: [R`Same \(p_{t2}/p_{t1} = ${f(s.pt21,5)}\), but \(p_{t1}/p_1\) uses the full \(M_1 = ${f(MO,1)}\): \(${f(1/G.PT(MO),4)}\)`, R`\(p_{t2}/p_1 = ${f(ptO,3)}\). Reading the table's \(p_{t2}/p_1\) column at \(M_\perp\) would wrongly give \(${f(ptN,3)}\).`] }
    ] };
});

/* ---------- HW 4 #3: regular reflection ---------- */
hw("hw-reflection","obl",1,"Regular reflection of an oblique shock from a wall","HW 4 #3a",["tbm","oblM2","oblnorm"],"HW4 #3; Reader §5.7.2",(o={})=>{
  let M1, d, o1, th2;
  for (let k = 0; k < 60; k++) {
    M1 = o.M1 ?? rnd(2.2,4,0.1); d = o.d ?? rnd(6,18,1);
    const t1 = G.thetaFromDelta(M1,d); if (!isFinite(t1)) continue;
    o1 = G.oblique(M1,t1); th2 = G.thetaFromDelta(o1.M2,d); if (isFinite(th2)) break;
  }
  const o2 = G.oblique(o1.M2, th2), refl = th2 - d;
  return { setup: R`Mach ${f(M1,1)} air (\(\gamma = 1.4\)) flows above a flat wall. An upper ramp turns the stream down through \(\delta = ${d}°\), creating a weak incident oblique shock that reaches the lower wall. Assume a regular reflection on the weak branch.`,
    parts: [
      { q: "Incident shock angle", ans: o1.theta, unit: "°", abs: 0.3, steps: [R`Weak root of θ–δ–M at \(M_1 = ${f(M1,1)}\), \(\delta = ${d}°\): \(\theta_1 = ${f(o1.theta,2)}°\)`] },
      { q: "Mach number between the shocks", ans: o1.M2, unit: "", steps: [R`\(M_{\perp1} = ${f(o1.Mn1,4)}\) → \(M_{\perp2} = ${f(o1.Mn2,4)}\)`, R`\(M_2 = M_{\perp2}/\sin(\theta_1 - \delta) = ${f(o1.M2,4)}\)`] },
      { q: R`Reflected shock angle measured from the region-2 flow`, ans: th2, unit: "°", abs: 0.3, steps: [R`The wall forces the flow back to horizontal, so the reflected shock also turns it ${d}°`, R`Check \(\delta_{max}(M_2) = ${f(G.deltaMax(o1.M2).delta,2)}° \ge ${d}°\) ✓; weak root: \(\theta_2 = ${f(th2,2)}°\)`] },
      { q: "Reflected shock angle measured from the wall", ans: refl, unit: "°", abs: 0.3, steps: [R`Region-2 flow is inclined ${d}° toward the wall, so the shock sits at \(\theta_2 - \delta = ${f(refl,2)}°\) to the wall (not equal to \(\theta_1\): reflections aren't mirror-like)`] },
      { q: "Mach number after the reflected shock", ans: o2.M2, unit: "", steps: [R`\(M_3 = ${f(o2.M2,4)}\)`] },
      { q: R`Overall static pressure ratio \(p_3/p_1\)`, ans: o1.p21*o2.p21, unit: "", steps: [R`\((p_2/p_1)(p_3/p_2) = ${f(o1.p21,4)}\times${f(o2.p21,4)} = ${f(o1.p21*o2.p21,4)}\)`] }
    ] };
});

/* ---------- HW 4 #1: over-expanded jet ---------- */
hw("hw-jet","ext",1,"First shock cell of an over-expanded jet","HW 4 #1",["jetbc","tbm","oblnorm","nsp"],"HW4 #1; Reader §6.1, §6.4",(o={})=>{
  let MA, pA, pamb, thA, oA, thB;
  for (let k = 0; k < 80; k++) {
    MA = o.MA ?? rnd(2,3.5,0.1); pamb = o.pamb ?? 101; pA = o.pA ?? rnd(35,80,1);
    thA = G.thetaFromP21(MA, pamb/pA); oA = G.oblique(MA, thA);
    thB = G.thetaFromDelta(oA.M2, oA.delta); if (oA.M2 > 1 && isFinite(thB)) break;
  }
  const oB = G.oblique(oA.M2, thB);
  return { setup: R`Air leaves a 2D nozzle in parallel, horizontal flow (region A) at \(M_A = ${f(MA,1)}\) and \(p_A = ${pA}\) kPa into an atmosphere at ${pamb} kPa (\(\gamma = 1.4\)). A lip shock forms region B at the free boundary; its reflection from the centerline forms region C. Use weak branches and assume symmetric, inviscid flow.`,
    parts: [
      { q: R`Pressure ratio across the lip shock, \(p_B/p_A\)`, ans: pamb/pA, unit: "", steps: [R`B touches the free boundary, so \(p_B = p_{atm} = ${pamb}\) kPa: \(p_B/p_A = ${f(pamb/pA,4)}\)`] },
      { q: "Flow deflection through the lip shock", ans: oA.delta, unit: "°", abs: 0.3, steps: [R`\(M_\perp = \sqrt{(p_B/p_A - 1)\tfrac{2.4}{2.8} + 1} = ${f(oA.Mn1,4)}\), so \(\theta = \sin^{-1}(M_\perp/M_A) = ${f(thA,2)}°\)`, R`θ–δ–M: \(\delta = ${f(oA.delta,2)}°\) toward the centerline`] },
      { q: "Mach number in region B", ans: oA.M2, unit: "", steps: [R`\(M_B = M_{\perp2}/\sin(\theta - \delta) = ${f(oA.M2,4)}\)`] },
      { q: "Pressure in region C", ans: pamb*oB.p21, unit: "kPa", steps: [R`The centerline acts as a wall: the reflected shock turns the flow back by the same \(${f(oA.delta,2)}°\)`, R`At \(M_B = ${f(oA.M2,3)}\): \(\theta = ${f(thB,2)}°\), \(p_C/p_B = ${f(oB.p21,4)}\)`, R`\(p_C = ${f(pamb*oB.p21,2)}\) kPa, above ambient, which is allowed because C doesn't touch the free boundary`] }
    ] };
});

/* ---------- Reader 6.3: Prandtl–Meyer corner sequence ---------- */
hw("hw-pm","pm",1,"Expansion fan and smooth compression","Reader Ex. 6.3.1–6.3.3",["pmturn","pmfun","muangle"],"Reader §6.3",(o={})=>{
  const M1 = o.M1 ?? rnd(1.2,2.6,0.05), d = o.d ?? rnd(8,25,1), p1 = o.p1 ?? rnd(20,200,5), T1 = o.T1 ?? rnd(220,400,5), dc = o.dc ?? rnd(5,d,1);
  const e = G.pmTurn(M1,d), c = G.pmTurn(e.M2,-dc);
  return { setup: R`Air (\(\gamma = 1.4\)) at \(M_1 = ${f(M1,2)}\), ${p1} kPa and ${T1} K expands around a sharp ${d}° convex corner. Downstream, the wall then curves smoothly back through ${dc}° of compression. Treat both turns as simple isentropic waves.`,
    parts: [
      { q: R`\(\nu_1\)`, ans: e.nu1, unit: "°", abs: 0.05, steps: [R`\(\nu(${f(M1,2)}) = ${f(e.nu1,3)}°\) (Appendix A or Eq. 6.8)`] },
      { q: "Mach number after the expansion", ans: e.M2, unit: "", steps: [R`\(\nu_2 = ${f(e.nu1,3)}° + ${d}° = ${f(e.nu2,3)}°\), so \(M_2 = ${f(e.M2,4)}\)`] },
      { q: "Pressure after the expansion", ans: p1*e.p21, unit: "kPa", steps: [R`\(p_t\) constant: \(p_2 = p_1(p/p_t)_2/(p/p_t)_1 = ${f(p1*e.p21,3)}\) kPa`] },
      { q: "Angle of the last wave of the fan, measured from the final flow direction", ans: e.mu2, unit: "°", abs: 0.1, steps: [R`\(\mu_2 = \sin^{-1}(1/${f(e.M2,4)}) = ${f(e.mu2,2)}°\) (the first wave is at \(\mu_1 = ${f(e.mu1 || 90,2)}°\))`] },
      { q: "Mach number after the smooth compression", ans: c.M2, unit: "", steps: [R`\(\nu_3 = ${f(e.nu2,3)}° - ${dc}° = ${f(c.nu2,3)}°\), so \(M_3 = ${f(c.M2,4)}\)`] },
      { q: "Temperature after the compression", ans: T1*G.TT(c.M2)/G.TT(M1), unit: "K", steps: [R`\(T_t\) constant: \(T_3 = T_1\dfrac{1 + 0.2M_1^2}{1 + 0.2M_3^2} = ${f(T1*G.TT(c.M2)/G.TT(M1),2)}\) K`] }
    ] };
});

/* ---------- Reader 6.5.2: flat plate ---------- */
hw("hw-plate","ext",1,"Flat plate at incidence (shock–expansion theory)","Reader Ex. 6.5.2",["plate","pmturn","tbm","oblnorm"],"Reader §6.5",(o={})=>{
  const M1 = o.M1 ?? rnd(1.6,3,0.1), a = o.a ?? pick([3,4,5,6,7,8]), p1 = o.p1 ?? rnd(0.2,1,0.05), c = o.c ?? pick([1,1.5,2,3]);
  const up = G.pmTurn(M1,a), th = G.thetaFromDelta(M1,a), lo = G.oblique(M1,th), p2 = p1*up.p21, p3 = p1*lo.p21, dp = (p3-p2)*1e5, ca = Math.cos(a*D2R), sa = Math.sin(a*D2R);
  return { setup: R`A flat plate of chord ${c} m sits at \(\alpha = ${a}°\) in air (\(\gamma = 1.4\)) at \(M_1 = ${f(M1,1)}\) and \(p_1 = ${f(p1,2)}\) bar. Neglect friction; forces are per unit span.`,
    parts: [
      { q: "Upper-surface Mach number", ans: up.M2, unit: "", steps: [R`Expansion: \(\nu = ${f(up.nu1,3)}° + ${a}° = ${f(up.nu2,3)}°\), so \(M_2 = ${f(up.M2,4)}\)`] },
      { q: "Upper-surface pressure", ans: p2, unit: "bar", steps: [R`\(p_2 = p_1(p/p_t)_2/(p/p_t)_1 = ${f(p2,4)}\) bar`] },
      { q: "Lower-surface shock angle", ans: th, unit: "°", abs: 0.3, steps: [R`Weak shock with \(\delta = ${a}°\): \(\theta = ${f(th,3)}°\)`] },
      { q: "Lower-surface pressure", ans: p3, unit: "bar", steps: [R`\(M_\perp = ${f(lo.Mn1,4)}\), \(p_3/p_1 = ${f(lo.p21,4)}\), so \(p_3 = ${f(p3,4)}\) bar`] },
      { q: "Lift per unit span", ans: dp*c*ca, unit: "N/m", steps: [R`\(L' = (p_3 - p_2)c\cos\alpha = (${f(dp,0)}\ \mathrm{Pa})(${c})\cos${a}° = ${f(dp*c*ca,0)}\) N/m`] },
      { q: "Wave drag per unit span", ans: dp*c*sa, unit: "N/m", steps: [R`\(D' = (p_3 - p_2)c\sin\alpha = ${f(dp*c*sa,0)}\) N/m; \(L/D = \cot${a}° = ${f(ca/sa,3)}\)`] }
    ] };
});

/* ---------- Reader 5.10: inlet pressure recovery ---------- */
hw("hw-inlet","obl",0,"Two-ramp inlet vs. a single normal shock","Reader §5.10",["inlet","tbm","oblnorm","nspt"],"Reader §5.10",(o={})=>{
  let M1, d, o1, o2;
  for (let k = 0; k < 60; k++) {
    M1 = o.M1 ?? rnd(2.2,3.5,0.1); d = o.d ?? rnd(6,12,1);
    const t1 = G.thetaFromDelta(M1,d); if (!isFinite(t1)) continue; o1 = G.oblique(M1,t1);
    const t2 = G.thetaFromDelta(o1.M2,d); if (!isFinite(t2)) continue; o2 = G.oblique(o1.M2,t2); if (o2.M2 > 1.05) break;
  }
  const nT = G.ns(o2.M2), rec = o1.pt21*o2.pt21*nT.pt21, single = G.ns(M1).pt21;
  return { setup: R`A 2D inlet in Mach ${f(M1,1)} air (\(\gamma = 1.4\)) turns the flow through two successive ${d}° ramps (two weak oblique shocks), followed by a terminal normal shock.`,
    parts: [
      { q: "Mach number after the first ramp shock", ans: o1.M2, unit: "", steps: [R`\(\theta = ${f(o1.theta,2)}°\), \(M_\perp = ${f(o1.Mn1,4)}\), \(p_{t}\) ratio \(${f(o1.pt21,5)}\), \(M = ${f(o1.M2,4)}\)`] },
      { q: "Mach number after the second ramp shock", ans: o2.M2, unit: "", steps: [R`From \(M = ${f(o1.M2,4)}\): \(\theta = ${f(o2.theta,2)}°\), \(M_\perp = ${f(o2.Mn1,4)}\), \(p_t\) ratio \(${f(o2.pt21,5)}\), \(M = ${f(o2.M2,4)}\)`] },
      { q: "Overall total-pressure recovery of the inlet", ans: rec, unit: "", steps: [R`Terminal normal shock at \(M = ${f(o2.M2,4)}\): \(p_{t2}/p_{t1} = ${f(nT.pt21,5)}\)`, R`Product: \(${f(o1.pt21,4)}\times${f(o2.pt21,4)}\times${f(nT.pt21,4)} = ${f(rec,4)}\)`] },
      { q: "Recovery of a single normal shock at the freestream Mach number", ans: single, unit: "", steps: [R`\(p_{t2}/p_{t1}\) at \(M = ${f(M1,1)}\): \(${f(single,4)}\), much worse`] }
    ] };
});

/* ---------- HW 3 #1: sizing a CD nozzle and its critical back pressures ---------- */
hw("hw3-design","noz",1,"Sizing a CD nozzle and its critical receiver pressures","HW 3 #1",["aastar","ptp","nsp","mdotmax","pstar"],"HW3 #1; Reader §4.9, §5.4.1",(o={})=>{
  const pt = o.pt ?? rnd(5,30,1), TtC = o.TtC ?? rnd(0,300,5), At = o.At ?? rnd(5,40,1), pd = o.pd ?? Math.round(pt*rnd(0.04,0.25,0.01)*10)/10;
  const Me = G.M_from_PT(pd/pt), Ar = G.AA(Me), Ae = At*Ar, s2 = G.ns(Me), p2 = pd*s2.p21, Msub = G.M_from_A(Ar,false), p1 = pt*G.PT(Msub), m = G.mdotMax(pt*1e5, TtC+273.15, At*1e-4);
  return { setup: R`Air (\(\gamma = 1.4\), \(R = 287\)) is supplied from a large reservoir at \(p_t = ${pt}\) bar and \(T_t = ${TtC}\) °C to a CD nozzle with a ${At} cm² throat. Flow is isentropic except across a stationary normal shock, if present. The nozzle is designed for a receiver pressure of ${f(pd,1)} bar.`,
    parts: [
      { q: "Mass flow rate", ans: m, unit: "kg/s", steps: [R`\(T_t = ${f(TtC+273.15,2)}\) K`, R`\(\dot m = 0.040418\,A_tp_t/\sqrt{T_t} = ${f(m,4)}\) kg/s`] },
      { q: "Design exit Mach number", ans: Me, unit: "", steps: [R`\(p_e/p_t = ${f(pd/pt,5)}\), so \(M_e = \sqrt{5[(p_t/p_e)^{2/7} - 1]} = ${f(Me,4)}\)`] },
      { q: "Exit area for design operation", ans: Ae, unit: "cm²", steps: [R`Throat choked, so \(A_t = A^*\): \(A_e/A_t = (A/A^*)_{M_e} = ${f(Ar,4)}\)`, R`\(A_e = ${f(Ae,3)}\ \mathrm{cm^2}\)`] },
      { q: "Receiver pressure that places a normal shock at the exit", ans: p2, unit: "bar", steps: [R`Shock at \(M_e = ${f(Me,4)}\): \(p_2/p_1 = ${f(s2.p21,4)}\)`, R`\(p_b = ${f(pd,3)}\times${f(s2.p21,4)} = ${f(p2,3)}\) bar`] },
      { q: "Limiting receiver pressure as the shock approaches the throat", ans: p1, unit: "bar", steps: [R`The shock strength goes to zero at the throat, leaving the isentropic subsonic branch (first critical): \(M_e = ${f(Msub,4)}\)`, R`\(p_b = ${pt}\times${f(G.PT(Msub),5)} = ${f(p1,3)}\) bar, well above \(p^* = ${f(pt*G.pStarPt(),3)}\) bar, yet the throat is sonic`] }
    ] };
});

/* ---------- HW 3 #2: shock location from the pressure ahead of it ---------- */
hw("hw3-shockp","ns",1,"Normal shock from the pressure ahead of it","HW 3 #2",["mdotmax","ptp","aastar","nspt","ptastar"],"HW3 #2; Reader §5.4.2",(o={})=>{
  let pt, Tt, px, Mx, Me, m, At, n, Ax, As2, Ae;
  for (let k = 0; k < 100; k++) {
    pt = o.pt ?? rnd(4,20,1); Tt = o.Tt ?? rnd(280,500,10); m = o.m ?? rnd(1,10,0.5); Me = o.Me ?? rnd(0.3,0.6,0.05);
    px = o.px ?? Math.round(pt*G.PT(rnd(1.3,2.3,0.01))*10)/10; Mx = G.M_from_PT(px/pt);
    At = m/G.mdotMax(pt*1e5, Tt, 1)*1e4; n = G.ns(Mx); Ax = At*G.AA(Mx); As2 = At/n.pt21; Ae = As2*G.AA(Me);
    if (Mx > 1.05 && Ae > Ax * 1.02) break;
  }
  const pe = pt*n.pt21*G.PT(Me), wrong = G.M_from_A(Ae/At,false);
  return { setup: R`A CD nozzle receives air (\(\gamma = 1.4\), \(R = 287\)) from a reservoir at ${pt} bar and ${Tt} K. The static pressure just before a stationary normal shock in the diverging section is ${f(px,1)} bar. The exit Mach number is ${f(Me,2)} and the mass flow rate is ${f(m,1)} kg/s. Flow is isentropic outside the shock.`,
    parts: [
      { q: "Geometric throat area", ans: At, unit: "cm²", steps: [R`Choked: \(A_t = \dot m\sqrt{T_t}/(0.040418\,p_t) = ${f(At,3)}\ \mathrm{cm^2}\)`] },
      { q: "Mach number just ahead of the shock", ans: Mx, unit: "", steps: [R`Isentropic from the reservoir: \(p_x/p_t = ${f(px/pt,5)}\), supersonic branch, \(M_x = ${f(Mx,4)}\)`] },
      { q: "Area at which the shock stands", ans: Ax, unit: "cm²", steps: [R`\(A_x = A_t(A/A^*)_{M_x} = ${f(At,3)}\times${f(G.AA(Mx),4)} = ${f(Ax,3)}\ \mathrm{cm^2}\)`] },
      { q: R`Stagnation-pressure ratio across the shock, \(p_{t2}/p_{t1}\)`, ans: n.pt21, unit: "", steps: [R`Normal shock at \(M_x\): \(M_y = ${f(n.M2,4)}\), \(p_{t2}/p_{t1} = ${f(n.pt21,5)}\)`] },
      { q: "Exit pressure", ans: pe, unit: "bar", steps: [R`\(p_{te} = ${pt}\times${f(n.pt21,5)} = ${f(pt*n.pt21,4)}\) bar`, R`\(p_e = p_{te}(p/p_t)_{M_e} = ${f(pe,4)}\) bar`] },
      { q: "Exit area", ans: Ae, unit: "cm²", steps: [R`Downstream reference: \(A_2^* = A_t\,p_{t1}/p_{t2} = ${f(As2,3)}\ \mathrm{cm^2}\)`, R`\(A_e = A_2^*(A/A^*)_{M_e} = ${f(As2,3)}\times${f(G.AA(Me),4)} = ${f(Ae,3)}\ \mathrm{cm^2}\)`] },
      { q: R`Exit Mach number a colleague would get from the subsonic root of the geometric \(A_e/A_t\)`, ans: wrong, unit: "", steps: [R`\(A_e/A_t = ${f(Ae/At,4)}\), subsonic root \(${f(wrong,4)}\), versus the true ${f(Me,2)}`, R`Invalid: after the shock \(A^* = A_t\,p_{t1}/p_{t2}\), not \(A_t\). The ${f(100*(1-wrong/Me),1)}% error comes entirely from the shock's \(p_t\) loss.`] }
    ] };
});

/* ---------- HW 3 #3: wind-tunnel starting ---------- */
hw("hw3-tunnel","tun",1,"Starting a supersonic wind tunnel","HW 3 #3",["start","aastar","nspt","ptastar"],"HW3 #3",(o={})=>{
  const A1 = o.A1 ?? rnd(5,20,0.5), MT = o.MT ?? rnd(1.6,3,0.1), AT = o.AT ?? Math.round(A1*G.AA(MT)*1000)/1000, MTx = G.M_from_A(AT/A1,true);
  const req = A1/G.ns(MTx).pt21, A2 = o.A2 ?? Math.round((A1 + (req - A1)*rnd(0.3,0.85,0.01))*10)/10;
  const M2s = G.M_from_A(A2/A1,true), Mx = G.M1_from_pt21(A1/A2), Ax = A1*G.AA(Mx), MTu = G.M_from_A(AT/A2,false);
  return { setup: R`A wind tunnel is fed from a large reservoir at fixed \(p_{t0}\), \(T_{t0}\). The first throat is \(A_1 = ${f(A1,1)}\) cm², the test section \(A_T = ${f(AT,3)}\) cm², and the adjustable second throat (the tunnel exit) is \(A_2 = ${f(A2,1)}\) cm². Air, \(\gamma = 1.4\); quasi-1D and isentropic except across at most one normal shock. Assume the receiver pressure is low enough for the flows described.`,
    parts: [
      { q: "Test-section Mach number in the supersonic (started) flow", ans: MTx, unit: "", steps: [R`\(A_T/A_1 = ${f(AT/A1,4)}\) with \(A^* = A_1\); supersonic root: \(M_T = ${f(MTx,4)}\)`] },
      { q: "Second-throat Mach number in the started flow", ans: M2s, unit: "", steps: [R`The flow decelerates isentropically in the contraction but stays supersonic, since \(A_2 > A^* = A_1\)`, R`Supersonic root of \(A_2/A_1 = ${f(A2/A1,4)}\): \(M_2 = ${f(M2s,4)}\)`] },
      { q: "Smallest second-throat area that lets the tunnel start", ans: req, unit: "cm²", steps: [R`The starting shock is strongest in the test section: \(p_{t2}/p_{t1} = ${f(G.ns(MTx).pt21,5)}\) at \(M_T\)`, R`\(A_{2,min} = A_1\,p_{t1}/p_{t2} = ${f(req,3)}\) cm² > ${f(A2,1)} cm², so this tunnel can't start by lowering \(p_b\) alone`] },
      { q: "Mach number just ahead of the shock in the unstarted limiting flow", ans: Mx, unit: "", steps: [R`Both throats sonic: \(p_{t1}A_1 = p_{t2}A_2\), so \(p_{t2}/p_{t1} = A_1/A_2 = ${f(A1/A2,4)}\)`, R`Invert the normal-shock \(p_t\) ratio: \(M_x = ${f(Mx,4)}\)`] },
      { q: "Area where that shock stands", ans: Ax, unit: "cm²", steps: [R`\(A_x = A_1(A/A^*)_{M_x} = ${f(Ax,3)}\) cm², ahead of the test section`] },
      { q: "Test-section Mach number in the unstarted flow", ans: MTu, unit: "", steps: [R`Behind the shock \(A^* = A_2\): subsonic root of \(A_T/A_2 = ${f(AT/A2,4)}\), \(M_T = ${f(MTu,4)}\)`, R`Start by opening the second throat above ${f(req,2)} cm² to swallow the shock, then close it back to ${f(A2,1)} cm²; the started flow survives because \(A_2 > A_1\).`] }
    ] };
});

window.AAE_HW = HW;
})();
