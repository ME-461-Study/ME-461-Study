/* ME 461/561 Gas Dynamics study bank. Built from J. A. Rodríguez, "A First Course in Compressible Flow" (course reader v0.2),
   Chapters 1–6, HW 1, 2 and 4 with solutions, and the HW 3 assignment. Notation follows the reader: subscript t = stagnation, θ = shock angle,
   δ = flow deflection, ν = Prandtl–Meyer angle, µ = Mach angle. Math uses \( \) inline and \[ \] display (typeset by MathJax). */
(function () {
"use strict";
const R = String.raw;

const TOPICS = [
  { id: "thermo", name: "Thermo review & perfect gases", short: "Thermo" },
  { id: "rtt", name: "RTT, mass & energy balances", short: "RTT" },
  { id: "ent", name: "Entropy, momentum & friction", short: "Momentum" },
  { id: "stag", name: "Stagnation states & losses", short: "Stagnation" },
  { id: "sound", name: "Sound speed, Mach & causality", short: "Sound" },
  { id: "area", name: "Area change & isentropic flow", short: "Area–Mach" },
  { id: "noz", name: "Nozzles, choking & performance", short: "Nozzles" },
  { id: "ns", name: "Normal shocks & shocks in nozzles", short: "Normal shocks" },
  { id: "tun", name: "Supersonic wind tunnels & starting", short: "Wind tunnels" },
  { id: "mov", name: "Moving & reflected shocks", short: "Moving shocks" },
  { id: "obl", name: "Oblique shocks, Pitot & inlets", short: "Oblique shocks" },
  { id: "pm", name: "Prandtl–Meyer expansion", short: "Prandtl–Meyer" },
  { id: "ext", name: "Jets, airfoils & aerospike", short: "External flows" }
];

/* ---------------- Multiple choice ----------------
   mc(topic, kind, highYield, question, choices (correct first), explanation, source)
   kind: concept | equation | fact. The page shuffles the choices.
   Optional dd / eqs: the longer "Explain more" text and related equation-sheet ids. */
const MC = [], DEEP = {};
let n = 0;
function mc(t, k, mr, q, ch, ex, src, dd, eqs) {
  const id = t + "-" + (++n);
  MC.push({ id, t, k, mr: !!mr, q, ch, a: 0, ex, src });
  if (dd || eqs) DEEP[id] = { d: dd || "", eq: eqs || [] };
}

/* ===== Ch 1: Thermo review & perfect gases ===== */
mc("thermo","concept",1,R`Which statement about an <b>isentropic</b> process is correct?`,
 ["It is both adiabatic and internally reversible","Any adiabatic process is isentropic","It is any process at constant temperature","It is reversible, with heat transfer allowed as long as it is slow"],
 R`Isentropic requires no heat crossing the boundary (adiabatic) <i>and</i> no internal entropy production (reversible). An adiabatic process with friction still produces entropy.`,"Reader §1.2.2; Reader §2.4.3",
 R`Split the entropy change into exchange and production, \(dS = dS_e + dS_i\). Adiabatic sets \(dS_e = 0\); internally reversible sets \(dS_i = 0\). You need both to get \(dS = 0\). The reader also warns about the converse: constant entropy alone doesn't prove adiabatic and reversible, because heat removal could cancel internal production. That nuance shows up again when friction and shocks arrive.`,["entbal","tds"]);
mc("thermo","equation",0,R`In the polytropic relation \(p\,V^n = C\), which exponent describes a reversible adiabatic process of a perfect gas?`,
 [R`\(n = \gamma\)`,R`\(n = 1\)`,R`\(n = 0\)`,R`\(n \to \infty\)`],
 R`\(n = 0\) is isobaric, \(n = 1\) isothermal (for an ideal gas), \(n = \gamma\) reversible adiabatic, and \(n \to \infty\) isochoric.`,"Reader §1.2.3",
 R`It helps to remember the endpoints: \(n=0\) leaves \(p\) constant, and \(n\to\infty\) forces \(V\) constant (take the \(1/n\) root: \(V p^{1/n} = C'\)). The two physically interesting ones sit in between: \(n=1\) is \(pV = mRT\) at fixed \(T\), and \(n=\gamma\) is the isentrope you'll use for every stagnation and sonic reference state.`,["poly"]);
mc("thermo","fact",0,R`Real compression and expansion processes (with some heat transfer) usually have a polytropic exponent in which range?`,
 [R`\(1 < n < \gamma\)`,R`\(0 < n < 1\)`,R`\(n > \gamma\)`,R`\(n < 0\)`],
 R`They sit between isothermal and isentropic. The exponent is usually found empirically.`,"Reader §1.2.3");
mc("thermo","concept",1,R`Methane flows steadily and <b>isothermally</b> through a constant-area duct and speeds up from 20 to 25 m/s. A classmate says \(\dot Q = 0\) because \(T\) is constant. What's wrong with that?`,
 ["Constant T fixes h for a perfect gas, but the kinetic energy rose, so heat had to be added to supply it","Nothing; for a perfect gas, isothermal and adiabatic mean the same thing","Heat transfer is zero, but shaft work must be nonzero to accelerate the gas","Constant T means constant pressure, so the gas cannot accelerate at all"],
 R`SFEE with \(w_s = 0\): \(\dot Q = \dot m\left[\Delta h + \Delta(V^2/2)\right]\). For a perfect gas \(\Delta h = C_p\Delta T = 0\), which leaves \(\dot Q = \dot m\,\Delta(V^2/2) > 0\), into the gas.`,"HW1 #1c",
 R`The trap is mixing up "heat" with "temperature change." Temperature tracks the thermal energy (u and h), not the total energy. Here, pressure and density fall along the duct, so continuity (\(\rho V\) constant) forces the gas to speed up. Without heat input the accelerating gas would cool. With HW 1's numbers, \(\dot Q = (0.0218)(25^2-20^2)/2 \approx 2.45\) W into the gas.`,["sfee","dudh"]);
mc("thermo","equation",0,R`Methane has a molar mass of 16.0 kg/kmol. Its specific gas constant is closest to:`,
 [R`\(520\ \mathrm{J/(kg\,K)}\)`,R`\(287\ \mathrm{J/(kg\,K)}\)`,R`\(8314\ \mathrm{J/(kg\,K)}\)`,R`\(0.52\ \mathrm{J/(kg\,K)}\)`],
 R`\(R = \hat R/M_w = 8314/16.0 \approx 520\ \mathrm{J/(kg\,K)}\). The 0.52 option is the same number in J/(g·K), which is the unit slip to avoid.`,"Reader §1.1.2; HW1 #1a",
 R`Keep the units straight. \(\hat R = 8.314\ \mathrm{J/(mol\,K)} = 8314\ \mathrm{J/(kmol\,K)}\). Divide by the molar mass in the matching unit (kg/kmol) to get J/(kg K). Lighter gases have larger R, and so a larger sound speed at the same temperature.`,["eos"]);
mc("thermo","fact",0,R`For a diatomic perfect gas with its rotational modes excited (like N₂ or O₂ near room temperature), the internal energy and \(\gamma\) are:`,
 [R`\(u = \tfrac52 RT\), \(\gamma = 7/5\)`,R`\(u = \tfrac32 RT\), \(\gamma = 5/3\)`,R`\(u = \tfrac52 RT\), \(\gamma = 5/3\)`,R`\(u = 3RT\), \(\gamma = 4/3\)`],
 R`Monatomic gases have \(u = \tfrac32RT\) and \(\gamma = 5/3\). Diatomic gases add two rotational modes, giving \(u = \tfrac52RT\), \(C_v = \tfrac52R\), \(C_p = \tfrac72R\), and \(\gamma = 7/5\).`,"Reader §1.1.2; Reader §1.2.4",
 R`Each excited quadratic mode adds \(\tfrac12RT\) per unit mass. Three translational modes give \(\tfrac32RT\). A linear molecule adds two rotational axes, giving \(\tfrac52RT\). A nonlinear triatomic like water vapor adds three, giving \(3RT\) and \(\gamma = 4/3\). Then \(C_p = C_v + R\), and \(\gamma = C_p/C_v\) follows.`,["cpcv"]);
mc("thermo","equation",1,R`For air with \(\gamma = 1.4\) and \(R = 287\ \mathrm{J/(kg\,K)}\), \(C_p\) is about:`,
 [R`\(1004.5\ \mathrm{J/(kg\,K)}\)`,R`\(717.5\ \mathrm{J/(kg\,K)}\)`,R`\(401.8\ \mathrm{J/(kg\,K)}\)`,R`\(1435\ \mathrm{J/(kg\,K)}\)`],
 R`\(C_p = \gamma R/(\gamma-1) = 1.4(287)/0.4 = 1004.5\). 717.5 is \(C_v = R/(\gamma-1)\).`,"Reader §4.1.2",
 R`Two identities generate everything: \(C_p - C_v = R\) and \(\gamma = C_p/C_v\). Solving them gives \(C_p = \gamma R/(\gamma - 1)\) and \(C_v = R/(\gamma - 1)\). The combination \(\gamma R = (\gamma-1)C_p\) is what turns \(V^2/2\) into the \(\tfrac{\gamma-1}{2}M^2\) term in \(T_t/T\).`,["cpcv","tt"]);
mc("thermo","concept",0,R`The \(T\,ds\) relations \(T\,ds = du + p\,dv = dh - v\,dp\) were derived assuming a reversible process. Where can you use them?`,
 ["Between any two equilibrium states, reversible or not, because they contain only state properties","Only for reversible processes","Only along isentropic paths, where ds = 0","Only for incompressible substances"],
 R`Once written, every term is a property (exact differential), so the relation holds between any pair of equilibrium states regardless of the actual path.`,"Reader §1.2.4",
 R`This is what lets you compute \(\Delta s\) across a shock or a frictional duct. You can't integrate the real process (it's irreversible), but entropy is a state function. Any convenient path between the same end states gives the same \(\Delta s\), and the \(T\,ds\) equations evaluate it.`,["tds","ds"]);
mc("thermo","fact",0,R`Which pair are <b>path functions</b>, written with inexact differentials?`,
 [R`Heat and work, \(\delta q\) and \(\delta w\)`,R`Internal energy and enthalpy, \(du\) and \(dh\)`,R`Entropy and temperature, \(ds\) and \(dT\)`,R`Pressure and specific volume, \(dp\) and \(dv\)`],
 R`Heat and work are transfers of energy defined only along a process. Properties like \(u, h, s, T, p, v\) have exact differentials.`,"Reader §1.2.4; Reader §2.4");
mc("thermo","equation",1,R`Air (\(C_p = 1004.5\), \(R = 287\) J/(kg K)) is heated at constant pressure from 300 K to 600 K. The specific entropy change is about:`,
 [R`\(+696\ \mathrm{J/(kg\,K)}\)`,R`\(+199\ \mathrm{J/(kg\,K)}\)`,R`\(+497\ \mathrm{J/(kg\,K)}\)`,R`\(0\)`],
 R`\(\Delta s = C_p\ln(T_2/T_1) - R\ln(p_2/p_1) = 1004.5\ln 2 - 0 = 696\ \mathrm{J/(kg\,K)}\). 497 would be \(C_v\ln 2\), the constant-volume answer.`,"Reader §1.2.4",
 R`Pick the form that matches the variables you know. With \((T, p)\) use \(\Delta s = C_p\ln\frac{T_2}{T_1} - R\ln\frac{p_2}{p_1}\). With \((T, v)\) use \(\Delta s = C_v\ln\frac{T_2}{T_1} + R\ln\frac{v_2}{v_1}\). The signs differ because raising pressure at fixed T lowers entropy, while raising volume at fixed T raises it.`,["ds"]);
mc("thermo","concept",0,R`Clausius looked for an integrating factor that would turn \(\delta q\) into an exact differential. What did it turn out to be?`,
 [R`\(1/T\), giving \(ds = \delta q_{rev}/T\)`,R`\(1/p\), giving \(dv = \delta q/p\)`,R`\(T\), giving \(dh = T\,\delta q\)`,R`\(1/C_v\), giving \(dT = \delta q/C_v\)`],
 R`Assuming the factor depends on T only and enforcing equal mixed partial derivatives gives \(f'(T)\,T + f(T) = 0\), so \(f = 1/T\).`,"Reader §1.2.4");
mc("thermo","fact",0,R`How many independent intensive properties fix the state of a simple compressible system?`,
 ["Two","One","Three","It depends on the value of γ"],
 R`The state postulate (the reader's "0₂ law"): the equation of state relates three properties, so specifying any two independent ones fixes the rest.`,"Reader §1.2.4");
mc("thermo","fact",0,R`As a rule of thumb, compressibility effects in a gas flow become important above about:`,
 [R`\(M \approx 0.3\)`,R`\(M \approx 0.1\)`,R`\(M \approx 0.8\)`,R`\(M = 1\)`],
 R`At \(M = 0.3\), the density-change coefficient \(M^2/(1 - M^2) \approx 0.10\). This is a guideline, not a hard boundary; how much density variation is acceptable depends on the accuracy you need.`,"Reader Ch 1; Reader §4.3.1");
mc("thermo","concept",0,R`Why can you write \(du = C_v\,dT\) for an ideal gas in <i>any</i> process, not just a constant-volume one?`,
 ["For an ideal gas u depends on T only, so the partial derivative defining Cv is an ordinary derivative","Because every ideal-gas process is quasi-static","Because Cv and Cp are equal for an ideal gas","It isn't; du = Cv dT only holds at constant volume"],
 R`Since \(u = u(T)\) and \(h = u + RT = h(T)\), \((\partial u/\partial T)_v = du/dT\) and \((\partial h/\partial T)_p = dh/dT\). The change in u or h depends only on the temperature change, whatever the path.`,"Reader §1.2.4",
 R`This single fact does a lot of work in the course. It's why stagnation temperature is conserved when stagnation enthalpy is, why an isothermal perfect-gas flow has \(\Delta h = 0\), and why the energy balance alone can't reject a bad pressure measurement (HW 2 #2d). Pressure never enters \(h\) for a perfect gas.`,["dudh"]);

/* ===== Ch 2: RTT, mass & energy ===== */
mc("rtt","concept",1,R`In the RTT, \(\dfrac{DN}{Dt}\Big|_{CM} = \dfrac{\partial}{\partial t}\!\int_{CV}\!\eta\rho\,d\forall + \int_{CS}\!\eta\rho(\vec V_{cs}\cdot\hat n)\,dA\), what does the surface integral represent?`,
 ["The net outward transport of N by mass crossing the control surface","The rate at which N accumulates inside the control volume","The rate of change of N for the control mass","The external forces or heat acting on the control volume"],
 R`The volume integral is accumulation inside the fixed CV. The surface integral is the net outward flux. Their sum equals the control-mass rate, which the physical law (mass, Newton, first law) supplies.`,"Reader §2.2",
 R`Think of it as bookkeeping: what the control mass gains equals what piles up in the region plus what leaks out through its boundary. The RTT itself contains no physics. It only translates between following matter and watching a region. Choosing \(\eta = 1, e, s, \vec V\) gives the mass, energy, entropy and momentum balances.`,["rtt"]);
mc("rtt","concept",0,R`At an <b>inlet</b> port of a fixed control volume, the factor \(\vec V_{cs}\cdot\hat n\) is:`,
 ["Negative, because n̂ points outward while the fluid moves inward","Positive, because fluid is entering","Zero, because the inlet is a fixed surface","Equal to the full speed V regardless of direction"],
 R`\(\hat n\) always points out of the CV. At an inlet the velocity points in, so the dot product is negative and inflow shows up as negative outward flux, which increases what's stored in the CV.`,"Reader §2.2");
mc("rtt","concept",1,R`For steady flow through a channel with no leaks or branches, which quantity is the same at every section in <b>compressible</b> flow?`,
 [R`\(\rho A V\)`,R`\(A V\)`,R`\(V\)`,R`\(\rho V\)`],
 R`Continuity fixes the product \(\dot m = \rho AV\). Volume flow \(AV\) is not constant: if density drops, a larger volume must pass each second to carry the same mass.`,"Reader §2.3.1",
 R`This sounds obvious, but it's the root of every surprising compressible result. In supersonic flow, density falls faster than velocity rises, so the area has to grow to keep \(\rho AV\) fixed. A diverging section accelerates the gas. If you write \(A_1V_1 = A_2V_2\) out of habit, you've silently assumed incompressible flow.`,["mass","dav"]);
mc("rtt","concept",1,R`Why does <b>enthalpy</b>, rather than internal energy, appear in the energy carried across the control surface?`,
 ["Each bit of mass crossing the surface carries its u plus the flow work pv done to push it across","Because enthalpy includes the kinetic and potential energy","Because the control volume is adiabatic","Because the internal energy of a flowing gas is zero"],
 R`Pressure work at a port is \(\dot m\,pv\). Collecting it with the transported \(u\) gives \(h = u + pv\). The accumulation term inside the CV keeps \(e = u + V^2/2 + gz\), with no flow work.`,"Reader §2.4.1; HW1 #2b",
 R`HW 1 #2 makes the distinction concrete. When a tank fills, the gas already inside is just sitting there holding energy, so its storage term uses \(u\). The incoming gas gets shoved in by the reservoir gas behind it, which does \(pv\) of work per unit mass, so the inflow carries \(h\). The mismatch (\(c_p T_0\) coming in versus \(c_v T\) stored) is why a filling tank heats up.`,["cvenergy","tankfill"]);
mc("rtt","equation",1,R`An insulated rigid tank of air (\(\gamma = 1.4\)) starts at 300 K and is filled from a reservoir at 300 K until its mass doubles. Ignoring kinetic energy in the tank, the final temperature is:`,
 ["360 K","300 K","420 K","330 K"],
 R`\(m_2c_vT_2 - m_1c_vT_1 = \Delta m\,c_pT_0\) with \(\Delta m = m_1\) and \(m_2 = 2m_1\), so \(T_2 = (\gamma T_0 + T_1)/2 = (420 + 300)/2 = 360\) K.`,"HW1 #2b",
 R`Start from the CV energy balance with no outflow, no work and no heat: \(d(mu)/dt = \dot m_{in}h_0\). Integrate to get \(m_2u_2 - m_1u_1 = h_0\Delta m\). Then substitute \(u = c_vT\) and \(h = c_pT\). The 420 K distractor is the evacuated-tank limit (\(T_2 = \gamma T_0\)), which you'd get if \(m_1 = 0\). The final pressure follows from \(p_2 = m_2RT_2/\forall\): 240 kPa for HW 1, comfortably below the 500 kPa reservoir.`,["tankfill","cvenergy"]);
mc("rtt","concept",0,R`An initially <b>evacuated</b>, insulated rigid tank is filled from a large reservoir at \(T_0\). The final gas temperature in the tank is:`,
 [R`\(\gamma T_0\)`,R`\(T_0\)`,R`\(T_0/\gamma\)`,R`\(\tfrac{\gamma+1}{2}\,T_0\)`],
 R`With \(m_1 = 0\): \(m_2c_vT_2 = m_2c_pT_0\), so \(T_2 = \gamma T_0\). The flow work done pushing gas in ends up as extra internal energy.`,"Reader §2.4.1; HW1 #2");
mc("rtt","concept",1,R`In HW 1 #2c, the tank is instead held at 300 K while it fills to the same final mass. The net heat transfer is:`,
 ["Out of the gas: Q = −p₁v₁m₁, removing the flow work brought in","Into the gas, to keep the temperature up","Zero, because the temperature does not change","Out of the gas, equal to c_p T₀ Δm"],
 R`With \(T_2 = T_1 = T_0\): \(Q = m_2u_2 - m_1u_1 - h_0\Delta m = -p_1v_1m_1 = -RT_1m_1 \approx -9.99\) kJ. The incoming flow work would heat the gas, so it must be removed.`,"HW1 #2c",
 R`Write it out with \(\Delta m = m_1\): \(Q = 2m_1u - m_1u - m_1(u + pv) = -m_1pv\). The internal-energy terms cancel exactly because the temperature never changes. What's left is the flow work the reservoir did pushing mass in. To stay at 300 K, that energy has to leave as heat.`,["tankfill"]);
mc("rtt","equation",0,R`An adiabatic nozzle with no shaft work drops the enthalpy by 50 kJ/kg. The inlet speed is negligible and elevation doesn't change. The exit speed is about:`,
 ["316 m/s","224 m/s","50 m/s","7.1 m/s"],
 R`\(V_2 = \sqrt{2\Delta h} = \sqrt{2(50{,}000)} = 316\ \mathrm{m/s}\). Convert kJ to J first.`,"Reader §2.4.2",
 R`The SFEE with \(q = w_s = 0\) and no elevation change says \(h + V^2/2\) is constant. The gas pays for its kinetic energy with enthalpy. The 7.1 m/s distractor comes from forgetting the factor of 1000; the 224 m/s one from forgetting the 2.`,["sfee"]);
mc("rtt","concept",0,R`In the SFEE with \(h\) in kJ/kg, a speed of 300 m/s contributes a kinetic-energy term of:`,
 ["45 kJ/kg","45,000 kJ/kg","90 kJ/kg","0.3 kJ/kg"],
 R`\(V^2/2 = 300^2/2 = 45{,}000\ \mathrm{J/kg} = 45\ \mathrm{kJ/kg}\). Every term in the SFEE must have the same units.`,"Reader §2.4.2");
mc("rtt","concept",0,R`For a <b>steady</b> flow, the material derivative \(DP/Dt\) of a property following a fluid particle is:`,
 ["Possibly nonzero, through the convective term V·∇P","Always zero, since steady means nothing changes","Equal to ∂P/∂t","Zero unless the flow is compressible"],
 R`Steady only removes the local term \(\partial P/\partial t\). A particle moving through a nonuniform field still sees its properties change: \(DP/Dt = \vec V\cdot\nabla P\).`,"Reader §2.1.1");
mc("rtt","concept",0,R`In this course, "one-dimensional flow" means:`,
 ["Properties are uniform across each section and vary only along the duct; the area may change and the duct may bend","The flow moves in a single straight line in a constant-area duct","The velocity is the same everywhere in the flow field","Only the velocity varies; the thermodynamic properties are constant"],
 R`1D means uniform properties across each cross-section, varying along the flow direction. The duct may contract, expand or turn. With area change it's often called quasi-one-dimensional.`,"Reader §2.1.3; Reader §2.5.2");
mc("rtt","equation",1,R`Gas flows steadily and isothermally through a constant-area duct, speeding up from 20 m/s to 25 m/s. The inlet pressure is 200 kPa. The exit pressure is:`,
 ["160 kPa","250 kPa","200 kPa","128 kPa"],
 R`Constant area makes \(\rho V\) constant, so \(\rho_2/\rho_1 = 20/25 = 0.8\). At constant T, \(p \propto \rho\), giving \(p_2 = 0.8(200) = 160\) kPa.`,"HW1 #1a",
 R`Two relations do the work. Continuity, \(\rho_1V_1 = \rho_2V_2\), gives the density ratio. The ideal-gas law, \(p = \rho RT\) with \(T\) fixed, turns it into a pressure ratio. No energy equation is needed for this part, which is a nice reminder to start with mass. The energy equation then gives the heat input needed to sustain the acceleration.`,["mass","eos"]);
mc("rtt","fact",0,R`With the course sign convention, which is true for a compressor?`,
 [R`\(\delta W_s/dt < 0\), because work is done on the fluid`,R`\(\delta W_s/dt > 0\), because work is done on the fluid`,R`\(\delta Q/dt < 0\) by definition`,R`\(\delta W_s/dt = 0\), because shaft work is not counted in the energy balance`],
 R`Heat into the fluid is positive and work done <i>by</i> the fluid is positive. A turbine has \(\delta W_s/dt > 0\); a compressor needs work input, so \(\delta W_s/dt < 0\).`,"Reader §2.4.1");
mc("rtt","fact",0,R`For fully developed laminar flow in a pipe with centerline speed \(V_m\) and constant density, the mass flow rate is:`,
 [R`\(\rho A V_m/2\)`,R`\(\rho A V_m\)`,R`\(\rho A V_m/3\)`,R`\(2\rho A V_m/3\)`],
 R`Integrating the parabolic profile \(V = V_m[1-(r/R)^2]\) over the section gives an average speed of \(V_m/2\).`,"Reader §2.1.2");
mc("rtt","concept",0,R`What is the difference between a control mass and a control volume?`,
 ["A control mass always contains the same matter; a control volume is a region in space that matter can flow through","A control mass is fixed in space; a control volume moves with the fluid","They are the same thing described in different coordinates","A control mass is used for gases and a control volume for liquids"],
 R`The control mass follows particular fluid particles, so its boundary moves and deforms. The control volume is a region you choose, here held fixed. The RTT converts between the two.`,"Reader §2.2");

/* ===== Ch 2: Entropy, momentum & friction ===== */
mc("ent","concept",1,R`An adiabatic duct flow need not be isentropic because:`,
 ["Friction can produce entropy internally (dSᵢ > 0) even though no heat crosses the boundary","Adiabatic flows always lose entropy to the walls","Stagnation enthalpy changes along an adiabatic duct","Shaft work carries entropy into the flow"],
 R`Adiabatic only means \(dS_e = 0\). Friction, mixing, and shocks produce entropy, \(dS_i \ge 0\). This is how Fanno flow can conserve \(h_t\) while \(s\) rises.`,"Reader §2.4.3; Reader §2.5.3",
 R`The reader's entropy split is the tool: \(dS = dS_e + dS_i\), with \(dS_e = \delta Q/T\) at the boundary and \(dS_i \ge 0\) always. An adiabatic duct has zero exchange but can still have production. For a frictional duct, comparing the momentum and pressure-energy equations gives \(T\,ds_i = f\,V^2dx/(2D_e)\): friction is the source.`,["entbal","tdsi"]);
mc("ent","concept",0,R`Which of these does <b>not</b> produce entropy?`,
 ["Shaft work delivered by a turbine","Wall friction","Mixing of two streams","Heat transfer across a finite temperature difference"],
 R`Shaft work carries energy across the boundary but no entropy. Friction, mixing and finite-ΔT heat transfer are all irreversibilities.`,"Reader §2.4.3");
mc("ent","concept",0,R`Why doesn't constant entropy, by itself, prove that a process is adiabatic and reversible?`,
 ["Heat removal could exactly offset internal entropy production","Entropy is not a state property for open systems","Constant entropy requires constant temperature","Reversible processes always change entropy"],
 R`\(dS = dS_e + dS_i\). If heat leaves (\(dS_e < 0\)) while friction produces entropy (\(dS_i > 0\)), the two can cancel.`,"Reader §2.4.3");
mc("ent","concept",1,R`In the pressure-energy equation \(\dfrac{dp}{\rho} + d\!\left(\dfrac{V^2}{2}\right) + g\,dz + T\,ds_i + \delta w_s = 0\), what does the \(T\,ds_i\) term represent?`,
 ["Mechanical energy made unavailable by irreversibility; the energy still exists as internal energy","Heat added through the walls","Energy destroyed by friction, a violation of the first law","Flow work at the inlet and outlet"],
 R`It's the loss of useful mechanical energy to internal irreversibility. The first law still holds; the energy shows up as internal energy, not as pressure or speed.`,"Reader §2.4.3",
 R`The derivation subtracts the energy equation from \(T\,ds = dh - dp/\rho\), and the enthalpy changes cancel. That's why heat transfer disappears from this equation (it's in \(dh\) and \(T\,ds_e\)) and only the production term survives. With \(\delta w_s = ds_i = 0\) you recover Euler's equation; with constant density as well, you get Bernoulli.`,["pe","euler"]);
mc("ent","concept",0,R`When can you integrate Euler's equation \(dp/\rho + V\,dV + g\,dz = 0\) into Bernoulli's \(p/\rho + V^2/2 + gz = \text{const}\)?`,
 ["Only when density is constant; for compressible flow you must keep ∫dp/ρ with a p–ρ relation","Always, for any steady inviscid flow","Only for supersonic flow","Whenever the flow is adiabatic"],
 R`Pulling \(\rho\) out of the integral quietly assumes incompressibility. For compressible flow, thermodynamics (for example the isentrope \(p/\rho^\gamma\) = const) supplies the relation.`,"Reader §2.4.3");
mc("ent","concept",1,R`For steady flow in a horizontal constant-area duct, \(p_1A - p_2A - F_f = \dot m(V_2 - V_1)\). If the pressure drops from 1 to 2, which conclusion is valid?`,
 ["Part of the pressure drop may be accelerating the gas, not just overcoming friction","The whole pressure drop is due to wall friction","The velocity must be constant because the area is constant","The friction force must be negative"],
 R`In compressible flow, density can fall along a constant-area duct, so the gas speeds up even with \(A\) fixed. Some of the net pressure force goes into that momentum increase.`,"Reader §2.5.1",
 R`In incompressible pipe flow, constant area means constant velocity, so any pressure drop is friction. Compressible flow breaks that link. In Fanno flow you'll see friction drive subsonic gas to accelerate toward \(M = 1\) in a constant-area duct. The momentum balance shows both effects at once.`,["mom2"]);
mc("ent","concept",0,R`In the differential momentum balance for a duct of varying area, why is there no explicit \(p\,dA\) term?`,
 ["The axial pressure force on the sloped walls (+p dA) cancels the end-face term, leaving −A dp","Area changes are neglected in quasi-1D flow","Pressure acts only on the end faces","The p dA term is second order and is discarded"],
 R`End faces give \(pA - (p+dp)(A+dA)\). The sloped walls add \(+p\,dA\) to first order (uniform pressure produces no net force on a closed surface). The sum is \(-A\,dp\).`,"Reader §2.5.2");
mc("ent","fact",1,R`The reader uses the Darcy friction factor \(f = 4\tau_w/(\rho V^2/2)\). How does the Fanning factor compare?`,
 ["Fanning is one quarter of Darcy","Fanning is four times Darcy","They are identical","Fanning is half of Darcy"],
 R`Fanning omits the 4 in the numerator, so \(f_{Fanning} = f_{Darcy}/4\). Always check the definition before using a chart or correlation.`,"Reader §2.5.2");
mc("ent","equation",0,R`The hydraulic (equivalent) diameter of a square duct of side \(s\) is:`,
 [R`\(s\)`,R`\(2s\)`,R`\(s/2\)`,R`\(4s\)`],
 R`\(D_e = 4A/P = 4s^2/(4s) = s\). For a circular pipe, \(D_e\) is just the diameter.`,"Reader §2.5.2");
mc("ent","concept",0,R`For a horizontal adiabatic duct with wall friction and no shaft work, which pair of statements is consistent?`,
 [R`\(h + V^2/2\) stays constant and entropy increases`,R`\(h + V^2/2\) decreases and entropy stays constant`,"Friction destroys energy, so total enthalpy decreases","Entropy decreases because the walls do work on the fluid"],
 R`Friction converts mechanical energy into internal energy without any energy leaving. Total enthalpy is conserved while \(ds = ds_i > 0\).`,"Reader §2.5.3");
mc("ent","equation",1,R`A 1000 kg rocket in deep space (400 kg spacecraft, 600 kg fuel) ejects exhaust at 3 km/s relative to itself until the fuel is gone. Its final velocity change is about:`,
 ["2.75 km/s","1.80 km/s","4.50 km/s","1.20 km/s"],
 R`Momentum balance on a CV around the rocket, in an inertial frame, integrates to \(\Delta V = V_{ex}\ln(M_0/M_f) = 3\ln(1000/400) = 2.75\) km/s.`,"HW1 #3",
 R`HW 1's warning: avoid non-inertial frames. Take the CV around the rocket, write \(\tfrac{d}{dt}(M_RV_R) = -(V_R - V_{ex})\dot m\), and use \(dM_R/dt = -\dot m\). The \(V_R\dot m\) terms cancel, leaving \(M_R\,dV_R/dt = \dot mV_{ex}\). Note the burn rate (\(\dot m = 300{,}000\) kg/s, a 2 ms burn) drops out of the final answer; only the mass ratio matters.`,["rocket","cvmom"]);
mc("ent","equation",0,R`Comparing the frictional momentum equation with the pressure-energy equation gives the entropy produced by wall friction:`,
 [R`\(T\,ds_i = f\,\dfrac{V^2}{2D_e}\,dx\)`,R`\(T\,ds_i = -f\,\dfrac{V^2}{2D_e}\,dx\)`,R`\(T\,ds_i = \dfrac{dp}{\rho}\)`,R`\(T\,ds_i = f\,\dfrac{\rho V^2}{2}\,dx\)`],
 R`The pressure, kinetic and elevation terms match, so subtracting leaves \(T\,ds_i = fV^2dx/(2D_e) \ge 0\) for \(dx > 0\), as the second law requires.`,"Reader §2.5.3");

/* ===== Ch 3: Stagnation states & losses ===== */
mc("stag","concept",1,R`The stagnation reference state of a flowing gas is the state it would reach if brought to rest:`,
 ["Isentropically: adiabatically and reversibly, with no shaft work","By any adiabatic process, such as through a shock","At constant pressure","At constant temperature"],
 R`The reference process is defined as isentropic. A real device that stops the gas with friction or a shock reaches a different state; the stagnation state is a reference, not a prediction of what a probe will read.`,"Reader §3.1",
 R`"Reference" is the key word. You never have to stop the fluid to assign it \(T_t\) and \(p_t\). You're asking what state it would reach under ideal conditions. That's why every local state, even one in a frictional or shocked flow, has a well-defined stagnation state with \(s_t = s\).`,["ht","tt"]);
mc("stag","concept",1,R`For steady, adiabatic flow with no shaft work, which quantity stays constant even when friction or a shock is present?`,
 [R`Stagnation enthalpy \(h_t\) (and \(T_t\) for a calorically perfect gas)`,R`Stagnation pressure \(p_t\)`,R`Static pressure \(p\)`,R`Specific entropy \(s\)`],
 R`The energy equation gives \(h_{t1} + q = h_{t2} + w_s\). Reversibility is never used. Stagnation pressure, by contrast, falls whenever entropy is produced.`,"Reader §3.1.1; Reader §3.1.4",
 R`The reader puts this in bold: "for an adiabatic, steady flow with no work, the stagnation enthalpy is constant." It's the first thing to check in nearly every problem. Then ask separately whether \(p_t\) is constant, which needs no losses as well. Fanno flow, normal shocks, and lossy nozzles all keep \(T_t\) and lose \(p_t\).`,["ht","ptloss"]);
mc("stag","equation",0,R`Air (\(C_p = 1004.5\ \mathrm{J/(kg\,K)}\)) at \(T = 300\) K moves at 300 m/s. Its stagnation temperature is about:`,
 ["345 K","390 K","300 K","255 K"],
 R`\(T_t = T + V^2/(2C_p) = 300 + 90{,}000/2009 = 344.8\) K.`,"Reader §3.1.1",
 R`Check it the other way: \(a = \sqrt{1.4(287)(300)} = 347\) m/s, so \(M = 0.864\) and \(T_t/T = 1 + 0.2(0.864)^2 = 1.149\). Both routes give 345 K. The 390 K distractor drops the factor of 2.`,["tt"]);
mc("stag","concept",1,R`What does \(p_{t2}/p_{t1} = e^{-\Delta s/R}\) require?`,
 ["Adiabatic flow, no shaft work, and an ideal gas with constant R (constant cp not needed)","Isentropic flow of a calorically perfect gas","Constant static temperature","Only that the flow is steady"],
 R`It comes from \(dp_t/\rho_t + T_t\,ds_i = 0\) with \(p_t = \rho_tRT_t\). It needs constant \(R\) and fixed composition, but not constant specific heat.`,"Reader §3.1.4",
 R`Physically: with no heat and no work, the only thing that can change \(p_t\) is entropy production, and it can only lower it. Treat a stagnation-pressure drop as a direct measure of loss. You'll use this across shocks (the shock tables' \(p_{t2}/p_{t1}\) column), in diffuser recovery \(\eta_r\), and in the invariant \(p_tA^*\).`,["ptloss","stagpe"]);
mc("stag","equation",1,R`CO₂ (\(R = 189\ \mathrm{J/(kg\,K)}\)) in an adiabatic, no-work device has \(p_{t1} = 7.79\) atm and \(p_{t2} = 6.56\) atm. The specific entropy change is about:`,
 [R`\(+32.6\ \mathrm{J/(kg\,K)}\)`,R`\(-32.6\ \mathrm{J/(kg\,K)}\)`,R`\(+0.172\ \mathrm{J/(kg\,K)}\)`,R`\(+189\ \mathrm{J/(kg\,K)}\)`],
 R`\(\Delta s = -R\ln(p_{t2}/p_{t1}) = -189\ln(6.56/7.79) = +32.6\). Positive, so the process is irreversible but allowed.`,"HW2 #2b",
 R`Get each \(p_t\) from its own local state: \(p_t = p(1 + \tfrac{\gamma-1}{2}M^2)^{\gamma/(\gamma-1)}\), with \(\gamma = 1.29\), \(M_1 = 0.41\), \(M_2 = 0.90\). Then the ratio gives \(\Delta s\). The sign is the check: an adiabatic device can only have \(\Delta s \ge 0\).`,["ptloss","ptp"]);
mc("stag","concept",1,R`A second dataset for the same adiabatic, no-work device gives a downstream pressure that makes \(p_{t2} > p_{t1}\). What's the right conclusion?`,
 ["It violates the second law (Δs < 0), even though the energy balance can still be satisfied","It violates the first law","It is fine if the flow decelerated between the stations","It means heat must have been added"],
 R`\(p_{t2} > p_{t1}\) implies \(\Delta s < 0\) with no heat transfer, which is impossible. The energy balance can't catch this, because a perfect gas's enthalpy depends only on T, not p.`,"HW2 #2d",
 R`This is a useful exam pattern. Ask for the largest downstream pressure the second law allows: set \(p_{t2} = p_{t1}\) and solve for \(p_2\) from the local isentropic relation. In HW 2, \(p_2 \le 7.79/1.638 = 4.76\) atm. The 5 atm dataset fails. The energy balance alone doesn't care about pressure for a perfect gas.`,["ptloss","ptp"]);
mc("stag","concept",1,R`Why can you use the local isentropic relations (\(T_t/T\), \(p_t/p\)) at a state inside a flow that is irreversible between stations?`,
 ["Each state's stagnation reference is defined by an isentropic process from that state; it says nothing about the path between stations","Because irreversible flows are approximately isentropic","Because stagnation pressure is constant everywhere","You can't; they only apply to isentropic flows"],
 R`The relations connect a state to its own reference. What you cannot do in a lossy flow is assume \(p_t\) is the same at both stations.`,"Reader §4.1.3; HW2 #2b",
 R`Picture it on the h–s diagram: the actual states 1 and 2 drift right (entropy rises), and each has a vertical line up to its own stagnation state. Those vertical lines are isentropic by definition; the curve from 1 to 2 is not. Use the stagnation states as bridges: \(T_t\) is shared, and \(p_t\) changes by \(e^{-\Delta s/R}\).`,["ptp","tt","ptloss"]);
mc("stag","concept",0,R`On an h–s diagram for adiabatic, no-work flow from state 1 to state 2 with friction, the stagnation states 1t and 2t lie:`,
 ["At the same height (same hₜ), with 2t to the right at lower pₜ","At the same point, since hₜ is conserved","At the same entropy but different heights","With 2t higher than 1t because friction heats the gas"],
 R`Same \(h_t\) means the same height. But \(s_{t2} = s_2 > s_1 = s_{t1}\), so 2t lies on a lower-pressure isobar.`,"Reader §3.1.2");
mc("stag","concept",0,R`According to the stagnation pressure-energy equation, which of these does <b>not</b> change \(p_t\) in steady 1D flow?`,
 ["An isentropic change of area","Heat transfer","Shaft work","Internal irreversibility"],
 R`\(dp_t/\rho_t + (T_t - T)\,ds_e + T_t\,ds_i + \delta w_s = 0\). Only heat, losses and shaft work appear. An ideal nozzle changes p, T and V a lot, but not \(p_t\).`,"Reader §3.1.3");
mc("stag","fact",0,R`If gravitational potential energy is retained, the stagnation enthalpy is defined as:`,
 [R`\(h_t = h + V^2/2 + gz\)`,R`\(h_t = h + V^2/2\)`,R`\(h_t = u + V^2/2 + gz\)`,R`\(h_t = h + gz\)`],
 R`The reference state brings the fluid to rest at the datum elevation, so both kinetic and potential energy are converted. For most gas flows, \(gz\) is negligible.`,"Reader §3.1.1");

/* ===== Ch 3: Sound speed, Mach & causality ===== */
mc("sound","equation",1,R`Why is the sound speed given by the <b>isentropic</b> derivative, \(a^2 = (\partial p/\partial\rho)_s\)?`,
 ["An infinitesimal acoustic wave involves no heat transfer and no dissipation, so it is adiabatic and reversible","Sound waves are isothermal because they are so fast","The derivation assumes constant pressure","Only gases at rest have a sound speed"],
 R`With conduction and viscosity neglected and the amplitude infinitesimal, the compression is isentropic. An isothermal derivative gives a different, wrong speed.`,"Reader §3.2.3",
 R`The mechanics come from continuity (\(\delta V = a\,\delta\rho/\rho\)) and momentum (\(\delta V = \delta p/(\rho a)\)) in the wave frame, giving \(a^2 = \delta p/\delta\rho\). Thermodynamics then picks the path. For a perfect gas on the isentrope \(p = C\rho^\gamma\), you get \(a = \sqrt{\gamma RT}\). This result doesn't need an ideal gas; it applies to any medium.`,["a"]);
mc("sound","equation",1,R`Newton assumed sound waves were isothermal. For air (\(\gamma = 1.4\)), his prediction compared with the isentropic one is:`,
 ["About 15.5% too low","About 15.5% too high","About 40% too low","Exactly right, since T barely changes in a sound wave"],
 R`\(a_T = \sqrt{RT}\) and \(a_s = \sqrt{\gamma RT}\), so \(a_T/a_s = 1/\sqrt{\gamma} = 0.845\). That's 15.5% low for any \(\gamma > 1\).`,"HW2 #1a",
 R`The isothermal path has \(p = \rho RT\) with \(T\) fixed, so \((\partial p/\partial\rho)_T = RT\). The isentropic path has \(p = C\rho^\gamma\), so \((\partial p/\partial\rho)_s = \gamma p/\rho = \gamma RT\). The gas is stiffer when its temperature is allowed to rise during compression, so the wave travels faster.`,["a"]);
mc("sound","equation",1,R`Two acoustic stations 100 m apart are fixed to a duct with steady air flow. A pulse takes 0.250 s downstream and 0.350 s upstream. The air speed relative to the duct is:`,
 ["57 m/s","343 m/s","400 m/s","286 m/s"],
 R`\(V + a = 100/0.25 = 400\) m/s and \(a - V = 100/0.35 = 286\) m/s. Subtracting and halving gives \(V = 57\) m/s, and adding and halving gives \(a = 343\) m/s.`,"HW2 #1b",
 R`Relative to the duct, the downstream pulse moves at \(V + a\) and the upstream one at \(V - a\) (negative). Two equations, two unknowns. Then \(T = a^2/(\gamma R) = 343^2/(1.4 \cdot 287) \approx 293\) K. This is a classic way to measure flow speed acoustically without anything in the stream.`,["mach","a"]);
mc("sound","concept",1,R`As the flow speed approaches the sound speed from below, what happens to the upstream travel time between the two stations?`,
 ["It grows without bound; at M ≥ 1 an upstream-directed pulse can't reach the upstream station","It shrinks toward zero","It stays constant because a is fixed","It approaches D/(2a)"],
 R`The upstream pulse's lab-frame speed is \(V - a\), which goes to zero as \(M \to 1\). At or above \(M = 1\), the pulse is swept downstream.`,"HW2 #1c; Reader §3.3",
 R`This is causality in one line. Subsonic flow can "hear" what's downstream, which is why a nozzle can respond to back pressure until it chokes. Supersonic flow can't, which is why supersonic flow meets obstacles with shocks instead of adjusting smoothly ahead of time.`,["mach"]);
mc("sound","equation",0,R`The sound speed in air (\(\gamma = 1.4\), \(R = 287\)) at 250 K is about:`,
 ["317 m/s","347 m/s","268 m/s","1003 m/s"],
 R`\(a = \sqrt{\gamma RT} = \sqrt{1.4(287)(250)} = 316.9\) m/s. For a given gas, a depends only on the static temperature.`,"Reader §3.2.3");
mc("sound","concept",0,R`Behind a weak compression wave moving at speed \(a\) into still gas, the gas acquires a small velocity \(\delta V\). Which is true?`,
 [R`\(\delta V = a\,\delta\rho/\rho\) is small and in the direction the wave travels; it is not the wave speed`,R`\(\delta V = a\), because the gas moves with the wave`,R`\(\delta V\) points opposite to the wave's motion`,R`\(\delta V = 0\), because sound doesn't move the gas`],
 R`The disturbance propagates at \(a\); the fluid behind a compression just nudges forward by \(\delta V \ll a\). Keep the wave speed and the fluid velocity separate.`,"Reader §3.2.2");
mc("sound","concept",0,R`The same speed of 340 m/s is measured in two gas flows. Which statement is correct?`,
 ["They can have different Mach numbers if the gases or temperatures differ, since a = √(γRT) is local","They must have the same Mach number","Mach number depends only on speed","Mach number depends only on stagnation temperature"],
 R`Mach number is local: \(M = V/\sqrt{\gamma RT}\), using the static temperature. Helium at 300 K has \(a \approx 1019\) m/s, so 340 m/s there is about M = 0.33.`,"Reader §3.3");
mc("sound","equation",1,R`The Mach angle for \(M = 2\) is:`,
 ["30°","60°","26.6°","45°"],
 R`\(\mu = \sin^{-1}(1/M) = \sin^{-1}(0.5) = 30°\). It approaches 90° as \(M \to 1\) and narrows as M grows.`,"Reader §3.3.2");
mc("sound","concept",0,R`For a point source moving supersonically through still air, the "zone of silence" is:`,
 ["The region outside the Mach cone, which the source's small disturbances have not yet reached","The region inside the Mach cone","The region directly behind the source","The region where the gas is at rest"],
 R`Inside the cone is the zone of action. Outside, the source's acoustic disturbances haven't arrived. "Silence" is relative to that source, not an absence of all sound.`,"Reader §3.3.2");
mc("sound","equation",1,R`A supersonic jet passes directly over an observer at altitude H. The Mach cone reaches the observer after the jet has flown a further distance \(L = H\). The jet's Mach number is:`,
 ["1.41","1.00","2.00","0.71"],
 R`\(\sin\mu = H/\sqrt{H^2 + L^2} = 1/M\), so \(M = \sqrt{1 + (L/H)^2} = \sqrt 2 = 1.41\).`,"HW2 #3a",
 R`Draw the right triangle: the aircraft, the observer, and the point directly above the observer. The Mach line from the aircraft to the observer makes angle \(\mu\) with the flight path, and the hypotenuse is \(\sqrt{H^2+L^2}\). Using \(L = V\Delta t\) gives \(M = \sqrt{1 + (V\Delta t/H)^2}\).`,["boom","muangle"]);
mc("sound","concept",1,R`An aircraft accelerates from subsonic to supersonic speed. Does a Mach cone based on its instantaneous Mach number correctly describe the disturbances it emitted earlier?`,
 ["No; earlier pulses were emitted at lower speeds, so the envelope is not a straight cone at the current µ","Yes; the Mach cone always depends only on the current speed","Yes, as long as the aircraft is supersonic","No, because there is no Mach cone during acceleration"],
 R`The Mach cone construction assumes uniform motion. For an accelerating source, each wavefront is centered at its emission point, and the envelope curves.`,"HW2 #3b",
 R`HW 2 #3b shows the consequence: a pulse emitted later (45 s) can reach the observer before one emitted earlier (0 s), because the aircraft spent the time in between going faster than sound. Arrival time is emission time plus \(\sqrt{x^2 + y^2}/a\), and the later emission point is much closer.`,["boom","muangle"]);
mc("sound","concept",0,R`Why can a finite compression wave steepen into a shock?`,
 ["Gas behind the front is moving and hotter, so later parts travel at V + a faster than the front and catch up","Viscosity makes the compression thinner","Expansion waves behind it push it forward","Sound speed is lower in compressed gas"],
 R`For a perfect gas, compression raises T and therefore a, and the gas also moves forward. Stronger parts catch weaker ones, steepening the profile into a thin shock.`,"Reader §3.4",
 R`Expansions do the opposite: the rarefied, cooler gas behind the front has a lower signal speed, so the wave spreads into a fan. That asymmetry is why you see compression shocks but never expansion shocks in a perfect gas. It also matches the second law: an expansion jump would decrease entropy.`,[]);
mc("sound","concept",0,R`How does the Mach angle compare with the angle of a finite-strength shock from a supersonic body?`,
 ["The Mach cone describes infinitesimal disturbances; a finite shock moves faster than sound relative to the gas ahead and is generally steeper","They are always the same","The shock is always shallower than the Mach angle","Shocks have no angle; they are always normal"],
 R`A finite compression shock travels faster than sound in the gas ahead, so in a steady picture it sits at a larger angle than \(\mu\). As shock strength goes to zero, its angle approaches \(\mu\).`,"Reader §3.4; Reader §5.7.1");
mc("sound","fact",0,R`Sound in a gas is a:`,
 ["Longitudinal wave: the gas moves back and forth along the propagation direction","Transverse wave: the gas moves perpendicular to propagation","Wave that carries the same molecules from source to listener","Wave whose speed depends on its amplitude, even when small"],
 R`The disturbance travels; the molecules only oscillate locally. Compare a stretched string, where the motion is transverse.`,"Reader §3.2");

/* ===== Ch 4: Area change & isentropic flow ===== */
mc("area","equation",1,R`For a calorically perfect gas, the local static-to-stagnation temperature ratio is:`,
 [R`\(\dfrac{T_t}{T} = 1 + \dfrac{\gamma-1}{2}M^2\)`,R`\(\dfrac{T_t}{T} = \left(1 + \dfrac{\gamma-1}{2}M^2\right)^{\gamma/(\gamma-1)}\)`,R`\(\dfrac{T_t}{T} = 1 + \dfrac{\gamma}{2}M^2\)`,R`\(\dfrac{T_t}{T} = 1 + (\gamma - 1)M^2\)`],
 R`From \(T_t = T + V^2/(2C_p)\) with \(V^2 = M^2\gamma RT\) and \(\gamma R = (\gamma-1)C_p\). The second option is the pressure ratio.`,"Reader §4.1.2",
 R`This holds at any point in any adiabatic flow; it doesn't need isentropic flow, because it's just the energy definition of \(T_t\). The pressure version raises the same bracket to \(\gamma/(\gamma-1)\), because \(p_t\) is defined by an isentropic process from the local state.`,["tt","ptp"]);
mc("area","concept",1,R`Supersonic flow enters a <b>converging</b> duct isentropically. In the flow direction, p, ρ and V:`,
 ["p ↑, ρ ↑, V ↓","p ↓, ρ ↓, V ↑","p ↑, ρ ↓, V ↓","p ↓, ρ ↑, V ↑"],
 R`For \(M > 1\), \(dV/V = dA/[A(M^2-1)]\), so \(dA < 0\) gives \(dV < 0\). Pressure and density then rise. A converging section is a supersonic diffuser.`,"Reader §4.3.2",
 R`The sign table has four rows; you only need to remember one physical fact. Pressure always falls when the gas accelerates (\(dp = -\rho V\,dV\)), subsonic or supersonic. What changes at \(M = 1\) is which area change produces acceleration. Subsonic: converge to accelerate. Supersonic: diverge to accelerate.`,["dav"]);
mc("area","concept",1,R`Why can supersonic flow accelerate in a <b>diverging</b> passage?`,
 ["Density falls faster than velocity rises (dρ/ρ = −M² dV/V), so area must grow to keep ρAV constant","The walls do work on the gas","Supersonic flow is incompressible","Friction pulls the gas along"],
 R`At \(M > 1\), the fractional density drop exceeds the fractional velocity gain. Continuity constrains \(\rho AV\), so the area has to increase.`,"Reader §4.3.2",
 R`At low Mach number, density barely changes (\(|d\rho/\rho| = M^2|dV/V| \ll |dV/V|\)), so velocity and area trade off directly and you recover the incompressible result. At \(M = 1\) the two are equal, and area must be stationary. Above \(M = 1\) density dominates.`,["dav","mass"]);
mc("area","concept",1,R`For smooth isentropic flow, \(dA/A = (M^2-1)\,dV/V\). At a location where \(M = 1\):`,
 ["dA must be zero; this is necessary for a smooth sonic passage but doesn't make every throat sonic","The area must be increasing","The velocity must be zero","The equation breaks down and gives no information"],
 R`With finite \(dV/dx\), \(M = 1\) forces \(dA/dx = 0\). The converse doesn't hold: a throat can be subsonic if the back pressure is high.`,"Reader §4.3.2; Reader §4.6",
 R`Use the \(dA = (M^2-1)A\,dV/V\) form here, not the one that divides by \(M^2 - 1\). Sonic flow is only possible at an area extremum, and only the minimum allows a smooth transition from subsonic to supersonic. "Throat is sonic" is a conclusion you must prove (for example by showing the flow is choked), not an assumption.`,["dav"]);
mc("area","equation",0,R`For \(\gamma = 1.4\), \(A/A^*\) at \(M = 2\) is:`,
 ["1.688","1.340","2.000","0.593"],
 R`\(\dfrac{A}{A^*} = \dfrac1M\left[\dfrac{2}{\gamma+1}\left(1+\dfrac{\gamma-1}{2}M^2\right)\right]^{\frac{\gamma+1}{2(\gamma-1)}} = \tfrac12(1.5)^3 = 1.6875\).`,"Reader §4.6; App. A");
mc("area","concept",1,R`Air enters a diverging passage at \(M_1 = 0.5\), and \(A_2/A_2^* = 3.35\). Inverting the area–Mach relation gives \(M_2 = 0.176\) or \(2.754\). Which is right, and why?`,
 ["0.176: the inlet is subsonic and there's no throat, so the flow can only decelerate","2.754: diverging passages accelerate flow","Either one; the area ratio can't decide","Neither; A/A* > 1 has no solution"],
 R`\(A/A^*\) has a subsonic and a supersonic root. Inlet conditions and geometry select the branch. Without a sonic throat, the flow can't cross to supersonic.`,"Reader §4.7.1",
 R`Then \(p_2 = p_1(p_2/p_t)(p_t/p_1) = 4[1+0.2(0.176)^2]^{-3.5}[1+0.2(0.5)^2]^{3.5} = 4.64\) bar. Static pressure rises as the ideal diffuser slows the gas, and \(p_t\) stays constant. Make "which root?" a habit: the table will always offer you both.`,["aastar","chain"]);
mc("area","concept",1,R`What is \(A^*\) in the isentropic relations?`,
 ["A reference area: the area where the flow would be sonic if adjusted isentropically; it equals the throat area only when the throat is choked","Always the geometric throat area","The exit area of a nozzle","The area at which the flow is stagnant"],
 R`\(A^* = \dot m/(\rho^*a^*)\) is defined for any state, even in an all-subsonic flow. Don't automatically set it equal to the throat.`,"Reader §4.6",
 R`In an unchoked venturi, the throat has \(M < 1\) and \(A_{throat} > A^*\): the sonic area is a hypothetical smaller section. Once the throat chokes, \(A_{throat} = A^*\) on the upstream side. After a shock, \(A^*\) grows (see \(p_tA^*\) = const), so the downstream \(A^*\) is larger than the physical throat.`,["aastar","ptastar"]);
mc("area","equation",1,R`For adiabatic flow with losses at fixed mass flow and \(T_t\), how does the sonic reference area change between states 1 and 2?`,
 [R`\(p_{t1}A_1^* = p_{t2}A_2^*\), so \(A^*\) grows as \(p_t\) falls`,R`\(A_1^* = A_2^*\) always`,R`\(A^*\) shrinks as \(p_t\) falls`,R`\(A_2^*/A_1^* = e^{-\Delta s/R}\)`],
 R`Applying the working area equation with both Mach numbers set to 1 gives \(A_2^*/A_1^* = e^{\Delta s/R} = p_{t1}/p_{t2} \ge 1\).`,"Reader §4.6.1",
 R`This invariant is the bridge across a shock in a nozzle. Upstream of the shock, \(A^*\) is the throat. Downstream, \(A^*_2 = A_t\,p_{t1}/p_{t2}\). So the subsonic diffuser after the shock sees a larger reference area, and you can locate the shock from the exit conditions using \(A_ep_e/(A^*_1p_{t1}) = A_ep_e/(A^*_ep_{te})\).`,["ptastar","approd"]);
mc("area","equation",1,R`In the finite-state working equations for adiabatic flow with losses, how does \(\Delta s\) appear?`,
 [R`\(p_2/p_1\) carries \(e^{-\Delta s/R}\); \(A_2/A_1\) carries \(e^{+\Delta s/R}\); \(T_2/T_1\) has no entropy term`,R`All three ratios carry \(e^{-\Delta s/R}\)`,R`Only \(T_2/T_1\) depends on \(\Delta s\)`,R`\(\Delta s\) never appears; the equations assume isentropic flow`],
 R`Energy fixes \(T_t\), so the temperature ratio has no loss term. Losses lower \(p_t\), reducing the pressure ratio, and raise \(A^*\), increasing the area ratio needed for given Mach numbers.`,"Reader §4.5",
 R`HW 2 #2c is a direct use: \(A_2/A_1 = \frac{M_1}{M_2}\left[\frac{1+\frac{\gamma-1}{2}M_2^2}{1+\frac{\gamma-1}{2}M_1^2}\right]^{\frac{\gamma+1}{2(\gamma-1)}}e^{\Delta s/R}\) with \(\gamma = 1.29\), \(M_1 = 0.41\), \(M_2 = 0.9\) and \(\Delta s/R = 32.65/189\) gives 0.763. These equations need \(\Delta s\) supplied from somewhere; they don't predict the losses.`,["workA","workp","workT"]);
mc("area","equation",0,R`The relation \(\dot m = pAM\sqrt{\gamma/(RT)}\):`,
 ["Uses static p and T and holds whether or not the flow is isentropic","Uses stagnation pt and Tt and requires isentropic flow","Applies only at a sonic throat","Applies only to incompressible flow"],
 R`It's just \(\rho AV\) with \(\rho = p/(RT)\) and \(V = M\sqrt{\gamma RT}\) substituted. Replace \(p\) and \(T\) with stagnation values and you get the mass-flow parameter used for choking.`,"Reader §4.1.1");
mc("area","concept",0,R`In a nozzle with fixed \(T_t\), velocity increases with Mach number but not in proportion to it. Why?`,
 ["The static temperature, and therefore a, falls as the gas expands","Because the area changes","Because the stagnation temperature drops","It does increase in proportion; V = Ma with constant a"],
 R`\(V = M\sqrt{\gamma RT_t/(1 + \tfrac{\gamma-1}{2}M^2)}\). As M grows, \(T\) and \(a\) fall, so V levels off.`,"Reader §4.4");
mc("area","concept",0,R`A diverging section of duct is:`,
 ["A nozzle for supersonic flow and a diffuser for subsonic flow","Always a diffuser","Always a nozzle","A nozzle only if it follows a throat"],
 R`Nozzle and diffuser describe what the flow does (accelerate or decelerate), not the shape. Establish the regime before naming the device.`,"Reader §4.4");
mc("area","equation",0,R`For \(\gamma = 1.4\), at \(M = 0.3\) the coefficient \(M^2/(1-M^2)\) relating \(d\rho/\rho\) to \(dA/A\) is about:`,
 ["0.10","0.30","0.01","0.91"],
 R`\(0.09/0.91 \approx 0.099\). Density changes are about a tenth of the fractional area change, which is the basis of the \(M < 0.3\) rule of thumb.`,"Reader §4.3.1");
mc("area","concept",0,R`You know \(M_1\) and \(A_2/A_1\) in an isentropic duct and want \(M_2\). Which chain is correct?`,
 [R`\(\dfrac{A_2}{A_2^*} = \dfrac{A_2}{A_1}\cdot\dfrac{A_1}{A_1^*}\cdot\dfrac{A_1^*}{A_2^*}\), with the last factor equal to 1`,R`\(\dfrac{A_2}{A_2^*} = \dfrac{A_2}{A_1}\)`,R`\(M_2 = M_1\,A_2/A_1\)`,R`\(\dfrac{A_2}{A_2^*} = \dfrac{A_1}{A_2}\cdot\dfrac{A_1}{A_1^*}\)`],
 R`Geometry gives the first factor, \(M_1\) the second, and isentropic flow makes \(A^*\) constant. Then invert \(A/A^*\) on the correct branch.`,"Reader §4.7");
mc("area","concept",0,R`Can you apply the differential area relations, like \(dV/V = dA/[A(M^2-1)]\), across a finite section by treating M as constant?`,
 ["No; the coefficients change with M along the flow, and the relations assume isentropic flow","Yes, as long as the flow is subsonic","Yes, if the area change is less than 10%","Yes; M is constant in an isentropic duct"],
 R`They are local differential statements. For finite changes, use the integrated working equations or tables, and don't carry them across shocks.`,"Reader §4.2.3; Reader §4.5");

/* ===== Ch 4: Nozzles, choking & performance ===== */
mc("noz","equation",1,R`For air (\(\gamma = 1.4\)), an ideal converging nozzle fed from a reservoir chokes when:`,
 [R`\(p_b/p_t \le 0.5283\) (equivalently \(p_t/p_b \ge 1.893\))`,R`\(p_b/p_t \le 0.6339\)`,R`\(p_b/p_t \le 0.8333\)`,R`\(p_b/p_t \le 0.1278\)`],
 R`\(p^*/p_t = [2/(\gamma+1)]^{\gamma/(\gamma-1)} = 0.5283\). 0.8333 is \(T^*/T_t\), and 0.1278 is \(p/p_t\) at M = 2.`,"Reader §4.8.1",
 R`Remember both forms: \(p_b/p_t \le 0.5283\) and \(p_t/p_b \ge 1.893\). The number depends on \(\gamma\) (0.547 for \(\gamma = 1.29\), 0.487 for \(\gamma = 5/3\)). It applies to a converging nozzle, or to the throat of a CD nozzle once it's choked, but not to the back pressure at which a CD nozzle first chokes.`,["pstar"]);
mc("noz","concept",1,R`A converging nozzle is already choked. You lower the back pressure further. What happens?`,
 ["Mass flow and exit pressure stay the same; the extra expansion happens in the jet outside the nozzle","Mass flow increases and the exit becomes supersonic","The exit pressure drops to match the back pressure","The nozzle unchokes"],
 R`The sonic exit blocks small disturbances from traveling upstream. The exit stays at \(p^*\), and \(\dot m\) is fixed by \(p_t\), \(T_t\) and the exit area.`,"Reader §4.4.1; Reader §4.8.1",
 R`Causality again: at the sonic exit, the upstream-directed signal speed \(V - a\) is zero. The nozzle can't "hear" the lower back pressure. Choking doesn't mean the gas stops; it means the mass flow no longer responds to the back pressure. Raising \(p_b\) above \(p^*\) unchokes it.`,["pstar","mdotmax"]);
mc("noz","concept",1,R`For a converging–diverging nozzle with \(A_e/A_t = 2.494\), the back pressure at which the throat <b>first</b> becomes sonic is:`,
 [R`About \(0.961\,p_t\), from the subsonic root at the exit`,R`\(0.5283\,p_t\), the critical pressure ratio`,R`\(0.0642\,p_t\), the design pressure`,R`\(0.436\,p_t\), with a shock at the exit`],
 R`At first critical, the diverging section is a subsonic diffuser. The exit has \(A_e/A^* = 2.494\) on the subsonic branch: \(M_e = 0.240\) and \(p_e/p_t = 0.961\).`,"Reader §4.9.2",
 R`The reader flags this one specifically. The throat itself is at \(p^*/p_t = 0.5283\), but the subsonic diverging section recovers pressure before the exit. So the CD nozzle chokes at a back pressure much higher than 0.5283 \(p_t\). The other options are the third critical (0.0642) and second critical (0.436) values for the same nozzle.`,["aastar","pstar"]);
mc("noz","concept",1,R`For a choked nozzle, the maximum mass flow scales as:`,
 [R`\(\dot m_{max} \propto p_tA^*/\sqrt{T_t}\)`,R`\(\dot m_{max} \propto p_tA^*\sqrt{T_t}\)`,R`\(\dot m_{max} \propto A^*/p_b\)`,R`\(\dot m_{max} \propto p_tT_t/A^*\)`],
 R`Raising \(p_t\) or the throat area increases the flow. Raising \(T_t\) decreases it: \(a^*\) rises, but \(\rho^*\) falls faster.`,"Reader §4.8.2",
 R`Choking means you can't get more mass flow by lowering the back pressure. To change \(\dot m\), you have to change the supply (\(p_t\), \(T_t\)) or the throat. This is why rocket engines throttle with chamber pressure, and why the same throat passes less hot gas than cold gas at the same \(p_t\).`,["mdotmax","fparam"]);
mc("noz","equation",0,R`Air (\(\gamma = 1.4\), \(R = 287\)) at \(p_t = 500\) kPa and \(T_t = 300\) K is choked through a 10 cm² throat. The mass flow is about:`,
 ["1.17 kg/s","0.68 kg/s","2.33 kg/s","11.7 kg/s"],
 R`\(\dot m = A^*\dfrac{p_t}{\sqrt{T_t}}\sqrt{\dfrac{\gamma}{R}}\left(\dfrac{2}{\gamma+1}\right)^{\frac{\gamma+1}{2(\gamma-1)}} = 0.0404\,\dfrac{(10^{-3})(5\times10^5)}{\sqrt{300}} = 1.17\) kg/s.`,"Reader §4.8.2",
 R`For air, the group \(\sqrt{\gamma/R}\,(2/(\gamma+1))^{3} = 0.0404\ \mathrm{\sqrt{K}/(m/s)}\) is worth remembering. Units check: Pa · m² / √K × √K·s/m = kg/s. Use Pa, m², K and J/(kg K) consistently.`,["mdotmax"]);
mc("noz","concept",1,R`A CD nozzle runs with its back pressure between the second and third critical values. The flow is:`,
 ["Supersonic all the way to the exit, over-expanded (pₑ < p_b), with compression waves and shocks outside","Subsonic after an internal normal shock","Under-expanded, with expansion fans outside","Unchoked"],
 R`Between the 2nd (normal shock at the exit) and 3rd (design) conditions, the internal flow is the isentropic supersonic solution, and the jet compresses outside the nozzle.`,"Reader §4.9.2; Reader §5.4",
 R`Order the regimes by decreasing \(p_b\). Above 1st critical: venturi, unchoked. From 1st to 2nd: a normal shock inside the diverging section. From 2nd to 3rd: over-expanded, external oblique shocks. At 3rd: design, matched. Below 3rd: under-expanded, external expansion fans. Once choked, nothing downstream changes \(\dot m\).`,["pstar","aastar"]);
mc("noz","concept",0,R`In the under-expanded regime (\(p_b\) below the design pressure), lowering \(p_b\) further:`,
 ["Leaves the internal supersonic flow unchanged; expansion fans outside the nozzle do the extra adjustment","Moves a shock further into the nozzle","Increases the mass flow","Makes the exit subsonic"],
 R`The flow inside the diverging section is supersonic and can't sense the receiver. The exit pressure stays at its design value, which is now above \(p_b\).`,"Reader §4.9.2");
mc("noz","equation",0,R`Nozzle efficiency compares actual and ideal expansions:`,
 ["From the same inlet state to the same exit static pressure","From the same inlet state to the same exit speed","Between the same stagnation pressures","At the same exit temperature"],
 R`\(\eta_n = (h_1 - h_2)/(h_1 - h_{2s})\), with \(p_{2s} = p_2\) and \(s_{2s} = s_1\). Losses leave the actual exit at higher enthalpy on the same isobar, so \(\eta_n \le 1\).`,"Reader §4.10.1",
 R`Contrast with the diffuser: diffuser efficiency \(\eta_d = (p_2-p_1)/(p_{2s}-p_1)\) compares the same inlet state and the same exit speed (so \(h_2 = h_{2s}\)). The two definitions hold different things fixed. Total pressure recovery \(\eta_r = p_{t2}/p_{t1}\) is a third measure.`,["etan","diffuser"]);
mc("noz","concept",0,R`A real diffuser raises static pressure while losing stagnation pressure. Is that contradictory?`,
 ["No: slowing the gas recovers static pressure, while irreversibility lowers the stagnation reference","Yes: static and stagnation pressure must move together","Yes: a diffuser can't raise static pressure if it has losses","No, but only for supersonic diffusers"],
 R`On an h–s diagram, the actual exit lies at the same enthalpy as the ideal one but at higher entropy, so on a lower isobar. Both \(p_2 \le p_{2s}\) and \(p_{t2} \le p_{t1}\).`,"Reader §4.10.2");
mc("noz","equation",1,R`A CD nozzle has \(p_t = 100\) psia and \(A_e/A_t = 2.494\). Its design (third critical) back pressure is about:`,
 ["6.42 psia","96.1 psia","52.8 psia","43.6 psia"],
 R`At design, the exit is on the supersonic branch: \(M_e = 2.440\) and \(p_e/p_t = 0.06424\). 96.1 psia is first critical, 43.6 psia is second critical, and 52.8 psia is the throat pressure.`,"Reader §4.9.1",
 R`Same nozzle, three answers, depending on the branch and whether a shock is present. All four numbers are worth knowing as a set: they're the reader's running example through Ch 4 and 5.`,["aastar","ptp"]);

/* ===== Ch 5: Normal shocks & shocks in nozzles ===== */
mc("ns","concept",1,R`Across a stationary normal shock in a perfect gas, which quantity is <b>unchanged</b>?`,
 [R`Stagnation temperature \(T_t\)`,R`Stagnation pressure \(p_t\)`,R`Static temperature \(T\)`,R`Specific entropy \(s\)`],
 R`The shock is adiabatic with no work, so \(h_t\) and \(T_t\) are conserved. Static p, ρ, T and s rise; V and \(p_t\) fall.`,"Reader §5.2.3",
 R`Mass flux \(\rho V\) and momentum flux \(p + \rho V^2\) are also equal on both sides; those are the Rankine–Hugoniot balances. The "conserved" list (\(T_t\), \(\rho V\), \(p + \rho V^2\)) is what generates the shock relations. Everything else changes.`,["rh","nspt"]);
mc("ns","equation",1,R`For \(\gamma = 1.4\) and \(M_1 = 2\), the static pressure ratio across a normal shock is:`,
 ["4.50","2.67","1.69","0.721"],
 R`\(p_2/p_1 = 1 + \frac{2\gamma}{\gamma+1}(M_1^2 - 1) = 1 + \frac{2.8}{2.4}(3) = 4.5\). 2.67 is \(\rho_2/\rho_1\), 1.69 is \(T_2/T_1\), and 0.721 is \(p_{t2}/p_{t1}\).`,"Reader §5.2.3; Reader §5.3",
 R`These four numbers at \(M_1 = 2\) are a good memory anchor: \(M_2 = 0.577\), \(p_2/p_1 = 4.5\), \(\rho_2/\rho_1 = 2.667\), \(T_2/T_1 = 1.6875\), \(p_{t2}/p_{t1} = 0.7209\). Check: \(T_2/T_1 = (p_2/p_1)/(\rho_2/\rho_1) = 4.5/2.667\).`,["nsp","nsrho"]);
mc("ns","concept",0,R`The downstream Mach number of a normal shock depends on:`,
 [R`Only \(M_1\) and \(\gamma\)`,R`\(M_1\), \(\gamma\), and the upstream pressure`,R`\(M_1\) and the upstream temperature`,"The duct area"],
 R`\(M_2^2 = \dfrac{1 + \frac{\gamma-1}{2}M_1^2}{\gamma M_1^2 - \frac{\gamma-1}{2}}\). Every normal-shock ratio is a function of \(M_1\) and \(\gamma\) alone; that's why one table covers all cases.`,"Reader §5.2.2");
mc("ns","concept",1,R`Why is an "expansion shock" (supersonic flow jumping to a lower pressure) impossible in a perfect gas?`,
 ["It satisfies mass, momentum and energy, but would decrease entropy in adiabatic flow","It violates conservation of mass","It violates conservation of energy","It would require M₂ > M₁, which the tables don't allow"],
 R`Reversing states 1 and 2 still satisfies the jump equalities. The second law is what rejects it: \(\Delta s < 0\) with no heat transfer.`,"Reader §5.2.3",
 R`This is Rankine's point in the chapter's opening quote: only a sudden compression can persist. The conservation laws alone don't pick the direction. Expansions in supersonic flow instead happen gradually and isentropically, through Prandtl–Meyer fans.`,["nspt"]);
mc("ns","fact",0,R`As \(M_1 \to \infty\) for \(\gamma = 1.4\), a normal shock's density ratio and downstream Mach number approach:`,
 [R`\(\rho_2/\rho_1 \to 6\), \(M_2 \to 0.378\)`,R`\(\rho_2/\rho_1 \to \infty\), \(M_2 \to 0\)`,R`\(\rho_2/\rho_1 \to 4\), \(M_2 \to 0.5\)`,R`\(\rho_2/\rho_1 \to 6\), \(M_2 \to 0\)`],
 R`\(\rho_2/\rho_1 \to (\gamma+1)/(\gamma-1) = 6\) and \(M_2 \to \sqrt{(\gamma-1)/(2\gamma)} = 0.378\). Pressure and temperature ratios grow without bound.`,"Reader §5.2; App. B");
mc("ns","concept",1,R`What's the difference between the jobs of an isentropic table and a normal-shock table?`,
 ["An isentropic table links a state to its own reference states; a shock table links the two actual states across the jump","They are the same table in different units","The shock table applies to subsonic flow and the isentropic table to supersonic flow","An isentropic table is for nozzles; a shock table is for diffusers"],
 R`The reader puts it in bold: keep those jobs separate. Mixing them is the most common error in shock-in-nozzle problems.`,"Reader §5.3",
 R`A typical problem uses both: isentropic relations up to the shock (with \(p_{t1}\), \(A^*_1\)), the shock table across it (giving \(M_2\) and \(p_{t2}/p_{t1}\)), then isentropic relations again downstream with the new \(p_{t2}\) and \(A^*_2\).`,["nspt","aastar"]);
mc("ns","concept",1,R`A normal shock stands in the diverging section of a nozzle. Across it, how do the physical area and the sonic reference area change?`,
 [R`\(A\) is essentially unchanged; \(A^*\) increases because \(p_t\) falls`,R`Both are unchanged`,R`\(A\) jumps up; \(A^*\) is unchanged`,R`\(A^*\) decreases because the flow becomes subsonic`],
 R`The shock is thin, so \(A_3 \approx A_4\). But \(p_{t3}A_3^* = p_{t4}A_4^*\), so the loss in \(p_t\) raises \(A^*\).`,"Reader §5.4.2",
 R`Downstream of the shock, the subsonic flow behaves as if it came from a bigger throat: \(A_4^* = A_t\,p_{t1}/p_{t4}\). That's why the remaining diverging section acts as a diffuser that only needs to match \(p_b\) at the exit.`,["ptastar","nspt"]);
mc("ns","equation",1,R`For the nozzle with \(p_t = 100\) psia and \(A_e/A_t = 2.494\), the back pressure that puts a normal shock exactly at the exit (second critical) is about:`,
 ["43.6 psia","6.4 psia","96.1 psia","52.8 psia"],
 R`Upstream of the exit shock: \(M_3 = 2.440\), \(p_3/p_t = 0.0642\). Across the shock: \(p_4/p_3 = 6.78\). So \(p_b = (6.78)(0.0642)(100) = 43.6\) psia.`,"Reader §5.4.1",
 R`Internal normal shocks exist for \(0.4356 < p_b/p_t < 0.9607\). At the upper end the shock has zero strength at the throat; at the lower end it sits at the exit. Below 0.4356 the shock moves out of the nozzle and the jet becomes over-expanded.`,["nsp","aastar"]);
mc("ns","concept",1,R`To locate a normal shock inside a nozzle from a known back pressure (subsonic exit), the reader multiplies \(A_e/A_t\) by \(p_b/p_{t1}\). Why does that help?`,
 [R`Because \(p_tA^*\) is invariant, the product equals \(A_ep_e/(A_e^*p_{te})\), a function of the exit Mach number alone`,"Because it equals the shock's pressure ratio","Because the product is always 1 at the shock","Because it gives the throat Mach number"],
 R`\(\dfrac{A_ep_e}{A_t\,p_{t1}} = \dfrac{A_ep_e}{A_e^*\,p_{te}}\), and the right side is an isentropic function of \(M_e\). Solve for \(M_e\), then \(p_{te}/p_{t1}\), then the shock's \(M_1\).`,"Reader §5.4.2",
 R`For \(p_b/p_t = 0.6\) and \(A_e/A_t = 2.494\): the product is 1.4964, so \(M_e = 0.381\). Then \(p_{te}/p_{t1} = 0.663\), which is the shock's \(p_{t2}/p_{t1}\). That gives \(M_{shock} = 2.124\), and \(A_s/A_t = 1.875\). It avoids trial-and-error iteration on the shock location.`,["approd","ptastar"]);
mc("ns","concept",0,R`For a very weak normal shock (\(M_1\) slightly above 1), how do the pressure rise and the entropy rise scale with \(M_1^2 - 1\)?`,
 ["Pressure rise is first order; entropy rise is third order","Both are first order","Both are third order","Pressure rise is second order; entropy rise is first order"],
 R`\(\Delta p/p \propto (M_1^2 - 1)\), while \(\Delta s/R \approx \frac{2\gamma}{3(\gamma+1)^2}(M_1^2-1)^3\). Weak shocks are almost isentropic.`,"Reader §6.2.1",
 R`This scaling is the bridge to Prandtl–Meyer theory. Split a finite compression into n tiny shocks: total pressure rise stays finite, but total entropy scales like \(n(1/n)^3 \to 0\). So a smooth turn can compress isentropically, at least until the waves coalesce.`,["weak"]);
mc("ns","equation",0,R`At \(M_1 = 2\), \(p_{t2}/p_{t1} = 0.721\). The entropy increase is:`,
 [R`\(\Delta s = -R\ln(0.721) \approx 0.327R\)`,R`\(\Delta s = R\ln(0.721) \approx -0.327R\)`,R`\(\Delta s = C_p\ln(1.6875)\)`,R`\(\Delta s = 0\), since the shock is adiabatic`],
 R`\(\Delta s = C_p\ln(T_2/T_1) - R\ln(p_2/p_1) = -R\ln(p_{t2}/p_{t1})\). For air that's about 94 J/(kg K). About 28% of the stagnation pressure is lost.`,"Reader §5.3");
mc("ns","concept",0,R`A strong shock can be only a few mean free paths thick, where the continuum model may fail. Why can we still use the jump conditions?`,
 ["Integral balances of mass, momentum and energy hold between control surfaces outside the layer, whatever happens inside","Because viscosity is zero inside the shock","Because the shock is isentropic","Because the jump conditions come from the Navier–Stokes equations"],
 R`Place the control surfaces where the gas is back near equilibrium. Conservation connects those states regardless of the internal structure.`,"Reader §5.1");
mc("ns","concept",0,R`If viscosity is neglected everywhere outside a shock, is the jump across the shock isentropic?`,
 ["No; dissipation inside the thin layer still produces entropy","Yes; an inviscid model has no entropy production","Yes, if the shock is normal","Only for weak shocks"],
 R`Viscosity and conduction are essential inside the shock layer even when negligible elsewhere. The ideal model replaces the layer with a discontinuity that still obeys the second law.`,"Reader §5.1");
mc("ns","equation",0,R`For \(\gamma = 1.4\) and \(M_1 = 3\), the normal-shock stagnation pressure ratio is about:`,
 ["0.328","0.721","0.930","0.0617"],
 R`At M = 3: \(p_{t2}/p_{t1} = 0.328\), so two-thirds of the stagnation pressure is lost. 0.721 is M = 2, 0.930 is M = 1.5, and 0.0617 is M = 5.`,"App. B");

/* ===== Ch 5: Moving & reflected shocks ===== */
mc("mov","concept",1,R`A shock moves at \(V_s\) into gas moving at \(V_1\) (lab frame). Which Mach number belongs in the normal-shock tables?`,
 [R`\(M_1' = |V_1 - V_s|/a_1\), measured in the shock frame`,R`\(V_s/a_1\), always`,R`\(V_1/a_1\), the observer's Mach number`,R`\((V_1 + V_s)/a_1\)`],
 R`Use a Galilean transformation to the frame where the shock is stationary: \(V' = V - V_s\). Static properties are the same in every frame; velocities and Mach numbers are not.`,"Reader §5.5",
 R`Recipe: (1) transform velocities into the shock frame, (2) apply the steady normal-shock relations with \(M_1'\), (3) find \(V_2' = M_2'a_2\) with \(a_2 = \sqrt{\gamma RT_2}\), (4) transform back with \(V_2 = V_2' + V_s\). Watch the signs: the reader uses signed velocities with rightward positive.`,["galilean"]);
mc("mov","concept",1,R`For a shock moving into still air, the lab-frame stagnation temperatures before and after the shock:`,
 ["Differ; hₜ₁ = hₜ₂ only holds in the frame where the shock is stationary","Are equal, since the shock is adiabatic","Are equal to the static temperatures","Differ only if the shock is strong"],
 R`The lab observer sees an unsteady flow. In the lab, \(h_{t2} - h_{t1} = V_s(V_2 - V_1)\). Stagnation properties include kinetic energy, so they depend on the frame.`,"Reader §5.5.2",
 R`In the reader's example (shock at −548.6 m/s into 298 K air): \(T_{t1} = 298\) K but \(T_{t2} = 448.3\) K in the lab. In the shock frame, both are 447.8 K. Energy is conserved either way; the moving shock does work on the gas it sets in motion.`,["htframe","galilean"]);
mc("mov","equation",0,R`In the lab frame, the stagnation enthalpy change across a moving normal shock is:`,
 [R`\(h_{t2} - h_{t1} = V_s(V_2 - V_1)\)`,R`\(h_{t2} - h_{t1} = 0\)`,R`\(h_{t2} - h_{t1} = (V_2^2 - V_1^2)/2\)`,R`\(h_{t2} - h_{t1} = V_s^2/2\)`],
 R`Expanding the shock-frame energy balance \(h_1 + V_1'^2/2 = h_2 + V_2'^2/2\) with \(V' = V - V_s\) gives this.`,"Reader §5.5.2");
mc("mov","concept",1,R`A shock moves left through still air. In the lab frame, the gas behind it:`,
 ["Moves left (the same direction as the shock), but more slowly than the shock","Moves right, opposite to the shock","Stays at rest","Moves left faster than the shock"],
 R`In the reader's example, \(V_s = -548.6\) m/s gives \(V_2 = -275.3\) m/s. The shock outruns the gas it sets in motion.`,"Reader §5.5.1",
 R`In the shock frame, gas enters at 548.6 m/s and leaves at 273.3 m/s (subsonic relative to the shock). Adding back \(V_s\) gives \(-275.3\) m/s in the lab. A blast wave pushes air along behind it; that induced wind is what does damage.`,["galilean"]);
mc("mov","equation",1,R`A shock moves at 548.6 m/s into still air at 101.3 kPa and 298 K (\(a_1 = 346\) m/s). The pressure behind it is about:`,
 ["280 kPa","101 kPa","163 kPa","455 kPa"],
 R`\(M_1' = 548.6/346.0 = 1.585\), so \(p_2/p_1 = 2.766\) and \(p_2 = 280\) kPa.`,"Reader §5.5.1");
mc("mov","equation",1,R`Gas moving at \(V_u\) toward a closed end is stopped by a reflected shock. What condition sets the reflected shock's strength?`,
 [R`\(\Delta V/a_1 = V_u/a_1 = \dfrac{2(M_1'^2-1)}{(\gamma+1)M_1'}\), since the gas behind must be at rest`,R`\(p_2 = p_1\), since the wall is rigid`,R`\(M_1' = V_u/a_1\)`,R`\(T_2 = T_1\), since the wall is adiabatic`],
 R`In the reflected shock's frame, \(V_1' - V_2' = V_u\). Combined with the shock density ratio, this gives a quadratic in \(M_1'\): \(M_1' = \frac{\gamma+1}{4}\frac{V_u}{a_1} + \sqrt{1 + \left(\frac{\gamma+1}{4}\frac{V_u}{a_1}\right)^2}\).`,"Reader §5.6",
 R`Appendix B tabulates \(\Delta V/a_1\) for exactly this use. For \(V_u = 240\) m/s and \(a_1 = 347.2\) m/s, \(M_1' = 1.497\), giving \(p_2 = 4.90\) bar from 2 bar and \(T_2 = 395.5\) K. The reflected shock speed is \(V_R = M_1'a_1 - V_u = 279.9\) m/s.`,["dva","reflM"]);
mc("mov","concept",0,R`After the reflected shock passes, the gas next to the closed end is:`,
 ["At rest, at higher pressure and temperature than behind the incident shock","At rest, back at the original pressure","Moving away from the wall","Moving toward the wall at Vᵤ"],
 R`The wall imposes zero velocity. Reflection compresses the gas a second time; it does not undo the incident shock.`,"Reader §5.6.1");
mc("mov","fact",0,R`Appendix B's \(\Delta V/a_1\) column gives:`,
 ["The velocity drop across a normal shock, normalized by the upstream sound speed","The change in sound speed across the shock","The shock speed divided by a₁","The downstream Mach number"],
 R`\(\Delta V = V_1 - V_2\) in the shock frame. It's the key quantity for moving and reflected shocks, since it's frame-independent.`,"Reader §5.6; App. B");

/* ===== Ch 5: Oblique shocks, Pitot & inlets ===== */
mc("obl","concept",1,R`Across an oblique shock, what happens to the velocity component parallel to the shock?`,
 ["It is unchanged; only the normal component changes, following the normal-shock relations","It decreases by the same ratio as the normal component","It increases to conserve energy","It becomes zero"],
 R`Tangential momentum gives \(J(V_{\parallel 2} - V_{\parallel 1}) = 0\). The normal components obey the full normal-shock balances, using \(M_{\perp 1} = M_1\sin\theta\).`,"Reader §5.7",
 R`This is why oblique shocks inherit every normal-shock tool: compute \(M_{\perp 1}\), read the normal-shock relations, then rebuild the full downstream Mach number from \(M_2 = M_{\perp 2}/\sin(\theta - \delta)\). Because the tangential part survives, the full \(M_2\) can stay supersonic.`,["oblnorm"]);
mc("obl","concept",1,R`Case N: a normal shock at \(M_1 = 2\). Case O: an oblique shock at \(M_1 = 3\) with \(\theta = \sin^{-1}(2/3)\). Same upstream \(p_1\), \(T_1\). Which is identical in the two cases?`,
 ["Static pressure, density and temperature ratios, Δs, and pₜ₂/pₜ₁; not the downstream Mach number","Everything, including the downstream Mach number","Only the pressure ratio","Nothing, because the upstream Mach numbers differ"],
 R`Both have \(M_\perp = 2\), so all the jump ratios match. The downstream Mach number differs: 0.577 for case N, but about 1.82 for case O, because the tangential velocity survives.`,"HW4 #2a",
 R`For case O, the chart gives \(\delta \approx 23.3°\), so \(M_{2,O} = 0.5774/\sin(41.8° - 23.3°) \approx 1.82\). The entropy rise and the \(p_t\) loss are set by the normal component alone, but the full Mach number (and so \(p_t/p\) on each side) needs the total velocity.`,["oblnorm","nspt"]);
mc("obl","concept",1,R`A colleague finds \(p_{t2}\) for the oblique shock (\(M_1 = 3\), \(M_\perp = 2\)) by reading the \(p_{t2}/p_1\) column of the normal-shock table at \(M = 2\). Is that right?`,
 [R`No: \(p_{t2}/p_{t1}\) at \(M_\perp\) is correct, but \(p_{t1}/p_1\) needs the full \(M_1 = 3\), so \(p_{t2}/p_1 = 0.721 \times 36.7 \approx 26.5\)`,"Yes, all ratios use the normal component","No: you need the strong-branch table","Yes, but only for the weak branch"],
 R`The table's \(p_{t2}/p_1\) column assumes the full upstream Mach number equals the normal one. For the oblique case, use \(p_{t2}/p_1 = (p_{t2}/p_{t1})(p_{t1}/p_1)\) with \(p_{t1}/p_1\) at M = 3.`,"HW4 #2b; Reader §5.7.1",
 R`The reader flags this in bold: don't use the \(p_{t2}/p_1\) column at \(M_{\perp 1}\) as the full oblique-shock stagnation-to-static ratio. Stagnation pressure is a property of the state and depends on the full velocity. Case N gives \(p_{t2}/p_1 = 5.64\); case O gives 26.5.`,["oblnorm","nspt","ptp"]);
mc("obl","equation",1,R`In the reader's notation (\(\theta\) = shock angle, \(\delta\) = deflection), the oblique-shock relation is:`,
 [R`\(\tan\delta = 2\cot\theta\,\dfrac{M_1^2\sin^2\theta - 1}{M_1^2(\gamma + \cos 2\theta) + 2}\)`,R`\(\tan\theta = 2\cot\delta\,\dfrac{M_1^2\sin^2\delta - 1}{M_1^2(\gamma + \cos 2\delta) + 2}\)`,R`\(\sin\theta = 1/M_1\)`,R`\(\tan\delta = \dfrac{M_1^2\sin^2\theta - 1}{M_1^2 + 2}\)`],
 R`Many texts call this the θ–β–M relation, where β is the shock angle and θ the deflection. The reader swaps the letters, so check the convention before borrowing a formula.`,"Reader §5.7.1",
 R`The relation gives δ explicitly from θ, but usually you know δ (the wall) and need θ. Read Chart C.1 or solve numerically on the right branch. Sanity checks: δ = 0 at θ = µ (Mach wave) and at θ = 90° (normal shock).`,["tbm"]);
mc("obl","concept",0,R`The limiting shock angles for a fixed \(M_1\) are:`,
 [R`\(\theta_{min} = \mu = \sin^{-1}(1/M_1)\), a Mach wave, and \(\theta = 90°\), a normal shock; both give \(\delta = 0\)`,R`\(\theta_{min} = 0\) and \(\theta_{max} = 90°\)`,R`\(\theta_{min} = \delta\) and \(\theta_{max} = \delta_{max}\)`,R`\(\theta_{min} = 45°\) and \(\theta_{max} = 90°\)`],
 R`A compression shock needs \(M_1\sin\theta > 1\), so \(\theta \ge \mu\). Between the limits, δ rises to \(\delta_{max}\) and falls back to zero.`,"Reader §5.7.1");
mc("obl","concept",1,R`For a deflection \(0 < \delta < \delta_{max}\), two attached solutions exist. Which is true?`,
 ["The strong (larger-θ) solution gives subsonic downstream flow; the weak one is usually supersonic, except near δmax","Both give supersonic downstream flow","The weak solution always gives subsonic downstream flow","The strong solution is never physical"],
 R`The strong branch has the larger \(M_1\sin\theta\), so more compression and loss, and a subsonic \(M_2\). A small slice of the weak branch near \(\delta_{max}\) also has \(M_2 < 1\).`,"Reader §5.7.2",
 R`Which one occurs is set by the boundary conditions, not the algebra. External flow over a modest wedge picks the weak branch. A strong shock needs something downstream (like a back pressure) to support its higher pressure, as HW 4 #3a discusses for the reflected shock: \(p_3/p_2 \approx 4.1\) on the strong branch versus 2.8 on the weak one.`,["tbm","oblM2"]);
mc("obl","concept",1,R`A wedge's half-angle exceeds \(\delta_{max}\) for the oncoming Mach number. What happens?`,
 ["The shock detaches into a curved bow shock, normal near the axis with subsonic flow behind it","The shock stays attached on the strong branch","An expansion fan forms at the tip","The flow passes the wedge without a shock"],
 R`No straight attached shock can turn the flow that much. A detached shock stands ahead of the body, and the subsonic region behind its nearly normal part lets the flow turn gradually.`,"Reader §5.8");
mc("obl","fact",0,R`Over the range \(M_1 \le 5\) for \(\gamma = 1.4\), the largest deflection possible with a single attached oblique shock is about:`,
 ["41.1°","23.0°","90°","34.1°"],
 R`\(\delta_{max}\) grows with \(M_1\): about 12.1° at M = 1.5, 23.0° at M = 2, 34.1° at M = 3, and 41.1° at M = 5. It approaches 45.6° as M → ∞.`,"Reader §5.7.2");
mc("obl","equation",0,R`Once you know \(\theta\) and \(\delta\), the full downstream Mach number of an oblique shock is:`,
 [R`\(M_2 = M_{\perp 2}/\sin(\theta - \delta)\)`,R`\(M_2 = M_{\perp 2}/\sin\theta\)`,R`\(M_2 = M_{\perp 2}\sin(\theta - \delta)\)`,R`\(M_2 = M_{\perp 2}\)`],
 R`The downstream flow makes angle \(\theta - \delta\) with the shock, so its normal component is \(M_2\sin(\theta - \delta)\).`,"Reader §5.7.1");
mc("obl","concept",1,R`Mach 3 flow is turned 25° by a ramp. The incident shock is attached and the flow behind it is supersonic (\(M_2 \approx 1.72\)). Must a regular (straight) reflected shock exist at the flat wall?`,
 ["No: the reflected shock must turn the flow back 25°, but δmax at M = 1.72 is only about 17.4°","Yes: attached incident shock plus supersonic flow guarantees it","Yes, on the strong branch","No, because the incident shock is detached"],
 R`Being supersonic is necessary, not sufficient. The requirement is \(\delta \le \delta_{max}(M_2)\). The real flow forms a different structure, such as a Mach reflection.`,"HW4 #3b",
 R`Two effects work against a steeper ramp: the reflected shock must turn the flow further, and the stronger incident shock leaves a lower \(M_2\), shrinking \(\delta_{max}(M_2)\). Setting \(\delta_{max}(M_2(\delta)) = \delta\) gives the limit; at \(M_1 = 3\) it's about 21.46°. That establishes when regular reflection is impossible, not exactly when the real flow switches.`,["tbm","oblM2"]);
mc("obl","equation",1,R`A Pitot tube in a supersonic stream reads:`,
 [R`\(p_{t2}\), the stagnation pressure behind the normal part of its bow shock`,R`\(p_{t1}\), the freestream stagnation pressure`,R`\(p_1\), the freestream static pressure`,R`\(p_2\), the static pressure just behind the shock`],
 R`A detached shock forms ahead of the probe. On the center streamline it's normal, and the gas then decelerates subsonically (ideally isentropically) to rest. Use \(p_{t2}/p_1\), the Rayleigh Pitot relation, to infer \(M_1\).`,"Reader §5.9",
 R`\(\dfrac{p_{t2}}{p_1} = \left(\dfrac{\gamma+1}{2}M_1^2\right)^{\frac{\gamma}{\gamma-1}}\left(\dfrac{\gamma+1}{2\gamma M_1^2 - (\gamma-1)}\right)^{\frac{1}{\gamma-1}}\). It's the \(p_{t2}/p_1\) column of Appendix B. You need a separate static tap in undisturbed flow to measure \(p_1\). At \(M_1 = 2\), \(p_{t2}/p_1 = 5.64\).`,["pitot"]);
mc("obl","concept",0,R`Why do supersonic inlets use several oblique shocks before a terminal normal shock?`,
 ["Several weak shocks produce less total entropy (better pₜ recovery) than one strong normal shock at the full Mach number","Oblique shocks add stagnation pressure","Normal shocks can't slow supersonic flow to subsonic","To raise the stagnation temperature for combustion"],
 R`Overall recovery is the product of the stages, \(\prod (p_{t,after}/p_{t,before}) = \exp(-\sum\Delta s_j/R)\). At M = 3, two 10° turns keep about 94% of \(p_t\) before the terminal shock; a single normal shock keeps 33%.`,"Reader §5.10",
 R`Use each stage's local normal Mach number for the oblique shocks, and update the flow direction and sound speed between them. The terminal normal shock then sees a much lower Mach number. The SR-71 inlet is the reader's example of this principle.`,["inlet","nspt"]);
mc("obl","concept",0,R`Charts C.2 and C.3 give \(M_2\) and \(p_2/p_1\) for an oblique shock. Which Mach number goes on the horizontal axis?`,
 [R`The full upstream \(M_1\)`,R`The normal component \(M_1\sin\theta\)`,R`The downstream normal Mach number`,R`Either one, since they give the same result`],
 R`The charts already include the projection onto the shock normal. Substituting \(M_{\perp 1}\) would double-count it.`,"Reader §5.7.1; Reader §6.5.2");
mc("obl","equation",0,R`For \(M_1 = 2\) and \(\delta = 10°\) (\(\gamma = 1.4\)), the weak-branch shock angle is about:`,
 ["39.3°","30.0°","83.7°","49.3°"],
 R`Solving the θ–δ–M relation gives θ ≈ 39.3° on the weak branch (83.7° on the strong). The Mach angle is 30°, a lower bound for any compression shock.`,"Reader §5.7.1; App. C");
mc("obl","concept",0,R`Can the 2D wedge results be used directly for supersonic flow around a <b>cone</b>?`,
 ["No; cone flow has three-dimensional relief and needs a different analysis","Yes, with the cone half-angle as δ","Yes, but only on the strong branch","Yes, if the cone is slender"],
 R`The oblique-shock relations describe planar turning. Around a cone, the flow can spread circumferentially, so the shock is weaker than for a wedge of the same angle.`,"Reader §5.8");

/* ===== Ch 6: Prandtl–Meyer expansion ===== */
mc("pm","concept",1,R`For a weak oblique shock at fixed supersonic \(M_1\), how do the pressure rise and the entropy rise scale with the turning angle \(\delta\)?`,
 [R`\(\Delta p/p = O(\delta)\) and \(\Delta s/R = O(\delta^3)\)`,R`Both are \(O(\delta)\)`,R`\(\Delta p/p = O(\delta^2)\) and \(\Delta s/R = O(\delta)\)`,R`Both are \(O(\delta^3)\)`],
 R`Near the Mach-angle limit, \(\delta \propto \epsilon = M_1^2\sin^2\theta - 1\). Pressure rise is linear in \(\epsilon\) and entropy is cubic.`,"Reader §6.2.2",
 R`Divide a turn \(\delta_T\) into n pieces. The pressure change adds up to something finite (\(\propto n\cdot\delta_T/n\)), while the entropy goes like \(n(\delta_T/n)^3 = \delta_T^3/n^2 \to 0\). So a smooth turn compresses or expands isentropically. That's the foundation of Prandtl–Meyer theory, and it's why distributing compression (as in inlets) reduces losses.`,["weak"]);
mc("pm","concept",1,R`Supersonic flow along a smooth <b>concave</b> wall produces compression waves. What happens to them away from the wall?`,
 ["They converge and can coalesce into a shock; the flow is isentropic only in the smooth region before the merger","They spread apart into a fan","They stay parallel and never interact","They reflect back to the wall as expansions"],
 R`Each compression lowers M and raises µ, so the downstream waves are steeper and catch up with the upstream ones. Where they merge, a shock forms and entropy is produced.`,"Reader §6.2.3",
 R`On a convex wall the opposite happens. Expansion raises M and lowers µ, so the waves lean further back and spread out. Expansions stay smooth; compressions eventually steepen. That's the 2D version of the 1D steepening argument from Ch 3.`,["pmturn"]);
mc("pm","equation",1,R`Between two supersonic states connected by a simple isentropic turn, the turning angle is:`,
 [R`\(\delta = \nu(M_2) - \nu(M_1)\), positive for expansion and negative for compression`,R`\(\delta = \mu_2 - \mu_1\)`,R`\(\delta = \nu(M_1) + \nu(M_2)\)`,R`\(\delta = \theta - \mu_1\)`],
 R`\(\nu\) is the accumulated isentropic turning from the sonic state. Add the signed turn to \(\nu_1\) to get \(\nu_2\), then read \(M_2\).`,"Reader §6.3",
 R`The sign tells you the type of turn (expansion vs compression), not a geometric direction. The upper and lower surfaces of a body turn in opposite rotational senses, but an expansion is positive on both. After \(M_2\), get static properties from constant \(T_t\) and \(p_t\): \(T_2/T_1 = (T/T_t)_2/(T/T_t)_1\).`,["pmturn","pmfun"]);
mc("pm","equation",1,R`Air at \(M_1 = 1\) expands around a 28° convex corner. The resulting Mach number is about:`,
 ["2.06","1.28","3.00","1.47"],
 R`\(\nu_1 = 0\), so \(\nu_2 = 28°\). From Appendix A (or inverting Eq. 6.8), \(M_2 \approx 2.06\).`,"Reader §6.3.1",
 R`The fan starts with its first wave at \(\mu_1 = 90°\) (sonic) and ends with its last at \(\mu_2 = 29.0°\) to the final flow direction. Keep going another 12° and \(\nu = 40°\), giving \(M = 2.54\). Successive expansions just add in \(\nu\).`,["pmfun","pmturn"]);
mc("pm","fact",0,R`For \(\gamma = 1.4\), the maximum possible Prandtl–Meyer angle (expansion from M = 1 to M → ∞) is:`,
 ["130.45°","90°","180°","65.2°"],
 R`\(\nu_{max} = \tfrac{\pi}{2}\left(\sqrt{(\gamma+1)/(\gamma-1)} - 1\right) = 90(\sqrt6 - 1)° = 130.45°\). At that limit, p and T go to zero in this model.`,"Reader §6.3");
mc("pm","concept",1,R`Through an ideal Prandtl–Meyer expansion fan, which properties stay constant?`,
 [R`\(s\), \(p_t\) and \(T_t\)`,R`\(p\), \(T\) and \(M\)`,R`\(s\) only; \(p_t\) falls as for a shock`,R`\(M\) and \(\mu\)`],
 R`The fan is steady, adiabatic and isentropic. M and V rise; p, T, ρ and µ fall.`,"Reader §6.2.3",
 R`That's what makes the calculation easy: the stagnation state is a fixed bridge. Expansion fans are the physically admissible way to lower pressure in supersonic flow. A single expansion shock would decrease entropy and is ruled out.`,["pmturn"]);
mc("pm","equation",0,R`For an infinitesimal Prandtl–Meyer turn, the turning and the speed change are related by:`,
 [R`\(d\delta = \sqrt{M^2 - 1}\;dV/V\)`,R`\(d\delta = dV/V\)`,R`\(d\delta = (M^2 - 1)\,dV/V\)`,R`\(d\delta = \sin\mu\;dV/V\)`],
 R`From the velocity triangle with the tangential component unchanged: \(d\delta = \cot\mu\,dV/V = \sqrt{M^2-1}\,dV/V\). Substituting the perfect-gas energy equation gives the \(d\nu\) integrand.`,"Reader §6.3");
mc("pm","equation",1,R`Air at \(M_1 = 2.4\) undergoes a smooth 20° compression (\(\delta = -20°\)). With \(\nu(2.4) = 36.75°\), the Mach number after the turn, in the smooth region, is about:`,
 ["1.66","3.40","2.00","1.20"],
 R`\(\nu_2 = 36.75° - 20° = 16.75°\), giving \(M_2 \approx 1.664\). The gas slows and heats isentropically: \(T_2 = 450\) K from 325 K, and \(p_2 = 4.69\) bar from 1.5 bar.`,"Reader §6.3.3",
 R`A sharp 20° compression corner would need an oblique-shock calculation and would produce entropy, ending at a different state. The smooth answer holds only before the compression waves coalesce. The negative sign is a change in \(\nu\), not a negative value of \(\nu\) itself.`,["pmturn","pmfun"]);
mc("pm","concept",0,R`To expand a stream that's already supersonic (say \(M_1 = 2.06\)) through a further 12°, you start from \(\nu(2.06) = 28°\). Does the flow have to have actually passed through M = 1 and a 28° turn?`,
 [R`No; the sonic reference turn can be imaginary, because \(\nu\) depends only on the endpoint Mach number`,R`Yes; \(\nu\) only applies to flows that started sonic`,"Yes, otherwise the flow isn't isentropic","No, but you must subtract 28° from the result"],
 R`\(\nu\) is a state-like reference (like \(T_t\)): the change in \(\nu\) depends only on the endpoint Mach numbers, so expansion angles add.`,"Reader §6.3.2");
mc("pm","concept",0,R`In a centered expansion fan, the Mach angle of each wave is measured relative to:`,
 ["The local flow direction, which itself turns through the fan","The original freestream direction","The wall upstream of the corner","The horizontal"],
 R`The first wave sits at \(\mu_1\) to the incoming flow; the last sits at \(\mu_2\) to the final flow direction. The fan's total angular span is \((\mu_1 - \mu_2) + \delta\).`,"Reader §6.2.3");
mc("pm","equation",0,R`Air at \(M = 2\) expands through 10°. Using \(\nu(2) = 26.38°\), the new Mach number and pressure ratio are about:`,
 [R`\(M_2 = 2.38\), \(p_2/p_1 = 0.55\)`,R`\(M_2 = 1.65\), \(p_2/p_1 = 1.71\)`,R`\(M_2 = 2.38\), \(p_2/p_1 = 1.82\)`,R`\(M_2 = 3.00\), \(p_2/p_1 = 0.21\)`],
 R`\(\nu_2 = 36.38°\) gives \(M_2 = 2.385\). Then \(p_2/p_1 = (p/p_t)_2/(p/p_t)_1 = 0.0700/0.1278 = 0.548\). A 10° compression would instead give \(M = 1.65\) and \(p_2/p_1 = 1.71\).`,"Reader §6.3; App. A");

/* ===== Ch 6: Jets, airfoils & aerospike ===== */
mc("ext","concept",1,R`At the edge of a free jet, and along a solid wall or the jet's centerline, which boundary conditions apply?`,
 ["The free boundary fixes pressure (p = p_amb) and its shape adjusts; a wall or symmetry line fixes flow direction","Both fix pressure","Both fix flow direction","The free boundary fixes direction; the wall fixes pressure"],
 R`No wall can hold a pressure difference across a free boundary, so its pressure must match ambient. A wall or symmetry line can't be crossed, so the flow must run parallel to it.`,"Reader §6.1; Reader §6.7",
 R`The reader's advice: before calculating, ask what each boundary requires. Satisfying one condition (say, pressure at the boundary) often creates a mismatch elsewhere (say, flow direction at the centerline), which another wave then fixes. That chain is the whole shock-diamond pattern.`,["jetbc"]);
mc("ext","concept",1,R`An over-expanded 2D jet leaves the nozzle (region A, \(p_A < p_{atm}\)). A lip shock makes region B, and the shock reflected from the centerline makes region C. Where must the pressure equal \(p_{atm}\)?`,
 ["Only in B, the region touching the free jet boundary","In A, B and C","In A and C","Only in C"],
 R`B borders the free boundary, so \(p_B = p_{atm}\). A is bounded by the nozzle walls and can't feel the atmosphere (supersonic). C is bounded by shocks and the centerline, and ends up above ambient.`,"HW4 #1b",
 R`HW 4 #1 numbers: \(M_A = 2.6\), \(p_A = 50\) kPa, \(p_{atm} = 101\) kPa. Setting \(p_B/p_A = 2.02\) gives \(\delta \approx 11°\) and \(M_B \approx 2.12\). The reflected shock turns the flow back 11° to horizontal (the centerline acts as a wall), giving \(p_C/p_B \approx 1.8\) and \(p_C \approx 182\) kPa, well above ambient. The next adjustment at the boundary must be an expansion.`,["jetbc","tbm"]);
mc("ext","concept",1,R`A wave "reflects" from a free jet boundary and from a solid wall. How does the reflected wave's character compare in each case?`,
 ["At a free boundary it reverses (compression ↔ expansion); at a wall or symmetry line it is preserved","It's preserved at both","It reverses at both","It reverses at the wall and is preserved at the free boundary"],
 R`At a free boundary the reflection must cancel the pressure change, so a compression reflects as an expansion. At a wall it must restore the flow direction, so a compression reflects as a compression.`,"Reader §6.4.3",
 R`The analogy with light stops there: incident and reflected angles are generally not equal, because the incident wave changed the Mach number and flow direction the reflected wave sees. Always compute the reflected wave from its own upstream state.`,["jetbc"]);
mc("ext","concept",0,R`How does the wave pattern begin for over-expanded vs under-expanded jets?`,
 ["Over-expanded begins with oblique shocks at the lip; under-expanded begins with expansion fans","Both begin with expansion fans","Both begin with oblique shocks","Over-expanded begins with expansion fans; under-expanded with shocks"],
 R`Over-expanded means \(p_e < p_{amb}\), so the jet must compress; under-expanded means \(p_e > p_{amb}\), so it must expand. After that, both cycle through the same compression–expansion sequence.`,"Reader §6.4");
mc("ext","concept",0,R`Why does the shock-diamond (Mach diamond) pattern in a real exhaust plume fade downstream?`,
 ["Shocks generate entropy, and the shear layer between jet and surroundings grows through mixing","The ambient pressure changes along the plume","Expansion fans add energy each cycle","The jet becomes subsonic at the first diamond"],
 R`Each shock is a loss, and turbulent mixing erodes the organized cells. Strongly under-expanded jets can also form a Mach disk.`,"Reader §6.4.2");
mc("ext","equation",1,R`A flat plate at angle of attack \(\alpha\) in supersonic flow has \(p_2\) on its upper surface (after an expansion) and \(p_3\) on its lower surface (after a shock). Its lift and wave drag per unit span are:`,
 [R`\(L' = (p_3 - p_2)c\cos\alpha\), \(D' = (p_3 - p_2)c\sin\alpha\)`,R`\(L' = (p_3 - p_2)c\sin\alpha\), \(D' = (p_3 - p_2)c\cos\alpha\)`,R`\(L' = (p_3 + p_2)c\cos\alpha\), \(D' = 0\)`,R`\(L' = (p_3 - p_2)c\), \(D' = 0\) in inviscid flow`],
 R`Pressure acts normal to the plate, giving \(F_N' = (p_3 - p_2)c\). Resolve it perpendicular and parallel to the freestream. For the ideal flat plate, \(L/D = \cot\alpha\).`,"Reader §6.5.1",
 R`Reader example: \(M_1 = 1.8\), \(p_1 = 0.4\) bar, \(\alpha = 5°\). Upper: \(\nu = 20.73° + 5° = 25.73°\), so \(M_2 = 1.976\) and \(p_2 = 0.305\) bar. Lower: weak shock with \(\theta = 38.44°\), \(M_\perp = 1.119\), so \(p_3 = 0.518\) bar. Then \(L'/c = 2.12 \times 10^4\) Pa and \(D'/c = 1.86 \times 10^3\) Pa. Keep the chord explicit: a force needs an area.`,["plate","pmturn","tbm"]);
mc("ext","concept",0,R`The flat-plate calculation neglects viscosity, yet predicts drag. What kind of drag is it?`,
 ["Wave drag, from the pressure distribution of the shock–expansion system","Skin friction","Induced drag from wingtip vortices","There's no drag in an inviscid model; it's a rounding error"],
 R`The pressure difference acts normal to the inclined plate, so part of it points downstream. That's wave drag, present even in inviscid supersonic flow.`,"Reader §6.5.2");
mc("ext","concept",0,R`At the trailing edge of the flat plate, the upper and lower streams meet across a slip line. What must match across it?`,
 ["Pressure and flow direction; speed and entropy can differ","Pressure, direction, speed and entropy","Speed and direction only","Only the stagnation pressure"],
 R`The two streams went through different wave histories (a fan above, a shock below), so their entropies and speeds differ. Only p and direction are continuous across the slip line.`,"Reader §6.5.1");
mc("ext","concept",0,R`Why are rounded leading edges costly for supersonic airfoils?`,
 ["They produce a detached bow shock that is nearly normal ahead of the nose, with high entropy and wave drag","They cause the flow to stay subsonic everywhere","They prevent any lift","They trigger an expansion fan at the nose"],
 R`A sharp leading edge allows weaker attached shocks when the compression turns are small enough.`,"Reader §6.5");
mc("ext","concept",0,R`A symmetric double-wedge airfoil is pitched to a larger angle of attack. What can happen at the upper leading edge?`,
 ["It can change from a compression (shock) to an expansion (fan)","It always stays a compression","It always becomes a normal shock","Nothing; panel angles fix the waves"],
 R`What matters is the change in local flow direction at each corner, not the panel's angle to the horizontal. Once \(\alpha\) exceeds the half-angle, the upper front panel turns away from the freestream.`,"Reader §6.5.3");
mc("ext","concept",1,R`How does an aerospike (plug) nozzle provide altitude compensation?`,
 ["The atmosphere forms the outer free boundary, which moves in or out with ambient pressure, changing the effective expansion","Its diverging section physically changes shape","It throttles the chamber pressure with altitude","It uses a second throat that opens at high altitude"],
 R`The plug guides one side of the exhaust; the other side is a free boundary at ambient pressure. Low altitude confines the plume tightly; high altitude lets it expand outward.`,"Reader §6.6",
 R`It's the same pressure-matching mechanism behind jet wave patterns, put to use. A conventional bell has a fixed area ratio, so it's over-expanded low and under-expanded high. The aerospike's effective area ratio tracks ambient pressure. Practical plugs are often truncated, with base bleed, and cooling and base drag still cost performance.`,["jetbc"]);
mc("ext","fact",0,R`The reader's simple regular reflection picture of an over-expanded jet assumes regular shock reflection and supersonic flow after each shock. When does it break down?`,
 ["When shocks are strong enough to need a Mach reflection or more complex structure","Never; it's exact for inviscid flow","Only for under-expanded jets","Only for axisymmetric nozzles"],
 R`Strong mismatches can exceed the regular-reflection limit (compare HW 4 #3), producing a Mach reflection or Mach disk.`,"Reader §6.1; HW4 #3");

/* ---------- "Explain more" text for the remaining questions ---------- */
function dd(id, text, eqs) { DEEP[id] = { d: text, eq: eqs || [] }; }
dd("thermo-3",R`An isothermal path (\(n = 1\)) needs enough heat transfer to hold T fixed; a reversible adiabatic path (\(n = \gamma\)) needs none. A real compressor or engine cylinder loses some heat but not enough to stay isothermal, so the fitted exponent lands in between. That's why polytropic models are a practical bridge between the two ideal processes.`,["poly"]);
dd("thermo-9",R`A state function's change depends only on the endpoints, so its differential is exact and integrates to a difference (\(\int du = u_2 - u_1\)). Heat and work depend on how you got there: two paths between the same states can involve very different Q and W. Writing \(\delta q\) instead of \(dq\) is a reminder that there's no "q₂ − q₁".`,["firstlaw"]);
dd("thermo-11",R`With \(f = f(T)\) and the requirement that mixed partial derivatives match, the condition becomes \(f'(T)\,T + f(T) = 0\), whose solution is \(f = 1/T\). That makes \(ds = \delta q_{rev}/T\) exact, so entropy is a state property. The temperature in it is the boundary temperature where heat crosses, which matters later for entropy exchange \(dS_e = \delta Q/T_b\).`,["tds","entbal"]);
dd("thermo-12",R`The equation of state links three properties (for example \(p = \rho RT\)), so you can only choose two freely. This is why one Mach number plus one stagnation property fixes a whole isentropic state, and why HW problems give you exactly two thermodynamic properties at each station.`,["eos"]);
dd("thermo-13",R`From \(d\rho/\rho = \frac{M^2}{1-M^2}\,dA/A\), the density change relative to the area change is about 10% at M = 0.3 and grows fast after that (about 33% at M = 0.5, 178% at M = 0.8). The cutoff depends on the accuracy you need. Strong heating can also change density at low speed, which this rule doesn't cover.`,["dav"]);
dd("rtt-16",R`The outward normal makes the surface integral self-signing: positive where fluid leaves, negative where it enters. For a steady channel, \(\int\rho(\vec V\cdot\hat n)\,dA = (\rho AV)_{out} - (\rho AV)_{in}\). If you ever get a sign confused, ask what should happen to the stored amount when fluid enters: it should go up.`,["rtt"]);
dd("rtt-20",R`With \(m_1 = 0\), the energy balance \(m_2u_2 = h_0m_2\) gives \(c_vT_2 = c_pT_0\). The gas arrives carrying flow work \(pv\) on top of its internal energy, and once it's inside and at rest that flow work has become internal energy. For air at 300 K that's a 420 K tank, which is why filling a scuba tank warms it.`,["tankfill"]);
dd("rtt-23",R`The SFEE is a per-unit-mass balance, so every term must be in the same units. \(V^2/2\) in SI comes out in m²/s² = J/kg. Divide by 1000 to put it in kJ/kg before adding to enthalpy from a table. Forgetting this makes kinetic energy look a thousand times too large.`,["sfee"]);
dd("rtt-24",R`\(\frac{DP}{Dt} = \frac{\partial P}{\partial t} + \vec V\cdot\nabla P\). A steady nozzle has \(\partial/\partial t = 0\) everywhere, yet a gas particle moving through it sees its pressure and temperature fall. That's the convective term: the slope of P along the flow times how fast the particle moves along it.`,["rtt"]);
dd("rtt-25",R`Turbulent high-speed flow has a nearly flat profile over most of the section, which justifies treating properties as uniform across it. One-dimensional doesn't mean straight or constant-area: the duct may bend, contract or expand, as long as each section can be described by single values of p, T, V.`,["mass"]);
dd("rtt-27",R`Heat in and work out are both counted positive, so the first law reads \(\Delta E = Q - W\). A compressor's shaft delivers work to the fluid, so \(\dot W_s < 0\) and the SFEE shows the enthalpy rise it buys: \(w_s = h_{t1} - h_{t2} < 0\).`,["sfee","firstlaw"]);
dd("rtt-28",R`Integrate \(\rho V_m[1 - (r/R)^2]\,2\pi r\,dr\) from 0 to R: the result is \(\rho\,\pi R^2\,V_m/2\). So the mean speed is half the centerline speed for laminar flow. A turbulent profile is much flatter, so its mean speed is much closer to the centerline value, which supports the 1D assumption.`,["mass"]);
dd("rtt-29",R`Physical laws are written for a fixed collection of matter (a control mass), but engineers care about what goes in and out of a region (a control volume). The RTT bridges them: it splits the control-mass rate into change inside the region plus flux across its boundary. Pick a CV whose boundaries cross flow where you know or want properties.`,["rtt"]);
dd("ent-31",R`Entropy crosses a boundary only with heat (\(\delta Q/T_b\)) or with mass. Shaft work carries energy but no entropy, which is why work is "high quality" energy. Irreversibilities inside the system (friction, mixing, finite-ΔT heat transfer, shocks) create entropy that wasn't there before.`,["entbal"]);
dd("ent-32",R`Example: a gas flowing with friction (producing entropy) while being cooled (removing entropy). If the two rates happen to match, \(ds = 0\), but the process is neither adiabatic nor reversible. Only "adiabatic + reversible ⇒ isentropic" is safe; the converse isn't.`,["entbal"]);
dd("ent-34",R`For an isentropic perfect gas, \(\int dp/\rho\) with \(p/\rho^\gamma\) = const integrates to \(\frac{\gamma}{\gamma-1}\frac{p}{\rho}\) = \(c_pT\), and Euler's equation becomes \(c_pT + V^2/2\) = const: the energy equation. Using incompressible Bernoulli in a high-speed gas gives the wrong pressure-velocity relation as soon as density changes matter.`,["euler","pe"]);
dd("ent-36",R`Imagine a uniform pressure acting on the whole closed surface of the element: the net force must be zero. The end faces alone give \(-p\,dA\), so the sloped walls must contribute \(+p\,dA\). With the real pressure varying by dp along the wall, the correction is second order. The net is \(-A\,dp\), and area enters only through continuity.`,["dmom"]);
dd("ent-37",R`Fanning: \(f_F = \tau_w/(\rho V^2/2)\). Darcy (reader): \(f = 4\tau_w/(\rho V^2/2) = 4f_F\). Moody charts are usually Darcy; many heat-transfer texts use Fanning. Plugging a Fanning value into the reader's \(fV^2dx/(2D_e)\) would underestimate friction by a factor of 4.`,["fric"]);
dd("ent-38",R`\(D_e = 4A/P\) is chosen so that a circular pipe gets its real diameter. For a square of side s, \(4s^2/(4s) = s\). For a wide rectangular channel of height h, \(D_e \to 2h\). It lets one friction formula serve noncircular ducts.`,["fric"]);
dd("ent-39",R`Friction acts like a "brake" on the mechanical energy, but the energy it removes becomes internal energy of the same gas. Nothing leaves the system, so \(h_t\) stays constant. What changes is availability: entropy rises and stagnation pressure falls. This is the core of Fanno flow (Ch 7).`,["tdsi","ht"]);
dd("ent-41",R`Both equations share \(dp/\rho + d(V^2/2) + g\,dz\). The momentum equation adds the wall shear term \(fV^2dx/(2D_e)\); the pressure-energy equation adds \(T\,ds_i\). Setting them equal identifies friction as the entropy source, with a sign that's always positive in the flow direction.`,["tdsi","dmom","pe"]);
dd("stag-49",R`Constant \(h_t\) fixes the height of both stagnation points. Each stagnation state has the same entropy as its static state (\(s_t = s\)), and friction raised \(s_2\) above \(s_1\). Along a line of constant h, more entropy means lower pressure (from \(T\,ds = dh - v\,dp\)), so \(p_{t2} < p_{t1}\).`,["ptloss","ht"]);
dd("stag-50",R`An ideal nozzle or diffuser has no heat, no work and no losses, so \(dp_t = 0\): the static pressure can fall to a few percent of \(p_t\) while \(p_t\) itself stays put. This is why \(p_t\) is the natural bridge between stations in isentropic flow.`,["stagpe"]);
dd("stag-51",R`The reference process brings the fluid to rest at the datum elevation, so both kinetic and potential energy convert into enthalpy. For gas flows, \(gz\) is usually tiny compared with \(V^2/2\) (10 m of elevation is about 0.1 kJ/kg), so the course usually drops it.`,["ht"]);
dd("sound-56",R`\(a = \sqrt{\gamma RT}\) with the <i>static</i> temperature. Useful anchors for air: 300 K gives 347 m/s, 288 K gives 340 m/s, and 216.65 K (the stratosphere) gives 295 m/s. Doubling T raises a by √2.`,["a"]);
dd("sound-57",R`From continuity in the wave frame, \(\delta V = a\,\delta\rho/\rho\). For an ordinary sound wave, \(\delta\rho/\rho\) is tiny, so the gas barely moves while the disturbance races ahead at a. The two speeds only become comparable for finite waves, which is where shocks begin.`,["a"]);
dd("sound-58",R`Mach number compares the flow speed with the local signal speed, which depends on the gas (γ, R) and the static temperature. Helium's large R makes its sound speed about three times air's, so the same 340 m/s is subsonic. Hot exhaust can be subsonic at speeds that would be supersonic in cold air.`,["mach","a"]);
dd("sound-59",R`From the right triangle in the Mach-cone construction: the pulse radius \(a\Delta t\) is the side opposite µ and the source travel \(V\Delta t\) is the hypotenuse. So \(\sin\mu = 1/M\). M = 2 gives exactly 30°, M = 3 gives 19.5°, and M = 1.5 gives 41.8°.`,["muangle"]);
dd("sound-60",R`Outside the cone, the source's disturbances haven't arrived yet, so that region has no "advance notice" that the source is coming. That's von Kármán's "creates its own silence." It describes the reach of small disturbances only.`,["muangle"]);
dd("sound-64",R`The finite shock at a body is stronger than a Mach wave, and a stronger compression propagates faster relative to the gas ahead. In the body frame that means a steeper angle than µ. The oblique-shock relations make this precise: \(\theta\) runs from µ (zero strength) up to 90° (normal shock).`,["thmin","muangle"]);
dd("sound-65",R`The disturbance pattern propagates; individual parcels just oscillate about their mean position along the direction of travel. That's why the derivation separates the wave speed a from the tiny induced gas velocity δV.`,["a"]);
dd("area-70",R`At M = 2: \(1 + 0.2(4) = 1.8\), divide by 1.2 to get 1.5, cube it (exponent 3 for γ = 1.4) to get 3.375, then divide by M = 2: 1.6875. The table row reads 1.68750. Useful anchors: M = 1.5 gives 1.176 and M = 3 gives 4.235.`,["aastar"]);
dd("area-75",R`Substitute \(\rho = p/(RT)\) and \(V = M\sqrt{\gamma RT}\) into \(\dot m = \rho AV\). Nothing about the process between stations is assumed. That's why the reader uses it for frictional and shocked flows too, then switches to stagnation variables to see choking.`,["mdot","fparam"]);
dd("area-76",R`As the gas expands, enthalpy turns into kinetic energy, the static temperature falls, and so does a. V rises with M but levels off toward \(V_{max} = \sqrt{2c_pT_t}\), reached only as T → 0. This is why the velocity curve in Fig. 4.2 bends over.`,["tt","a"]);
dd("area-77",R`Name the device by what the flow does. In a CD nozzle at design, the diverging section is a nozzle (supersonic acceleration). The same section at first critical is a diffuser (subsonic deceleration). A supersonic inlet's converging section is a diffuser.`,["dav"]);
dd("area-78",R`\(0.3^2 = 0.09\), and \(0.09/0.91 = 0.099\). Density changes about a tenth as much as the area. At M = 0.5 the factor is 0.33, and it blows up as M → 1, where the incompressible picture fails completely.`,["dav"]);
dd("area-79",R`The chain multiplies known pieces: geometry \(A_2/A_1\), the inlet state's \(A_1/A_1^*\), and \(A_1^*/A_2^*\) (1 if isentropic, \(p_{t2}/p_{t1}\) across a loss). Then invert \(A/A^*\) on the branch the physics selects. It's the same pattern as using \(p_t\) as a bridge for pressures.`,["chain","aastar","ptastar"]);
dd("area-80",R`The coefficients \(1/(M^2-1)\) and \(M^2/(1-M^2)\) change as M changes along the duct, so you can't hold them constant over a finite section. Use the integrated relations (A/A*, the working equations, or tables) for finite changes, and never carry isentropic relations across a shock.`,["dav","workA"]);
dd("noz-87",R`Once the diverging section runs supersonic to the exit, no pressure signal from the receiver can travel upstream into it. The exit state is fixed by geometry and \(p_t\). The remaining expansion from \(p_e\) to \(p_b\) happens in Prandtl–Meyer fans at the lip, the start of the under-expanded jet pattern in Ch 6.`,["aastar","pmturn"]);
dd("noz-89",R`Look at Fig. 4.11: the actual and ideal exits share the same enthalpy (same exit speed), but the actual one has more entropy, so it sits on a lower isobar. The static pressure still rises from inlet to exit, just less than ideal, and the stagnation state slides to a lower pressure at the same \(h_t\).`,["diffuser","ptloss"]);
dd("ns-93",R`Divide everything by the upstream state and the jump conditions become equations in \(M_1\), \(M_2\) and γ only. Upstream p and T set the dimensional values (p₂ = p₁ × ratio) but not the ratios. That's what makes the Appendix B table possible.`,["nsm2"]);
dd("ns-95",R`\(\rho_2/\rho_1 = (\gamma+1)M_1^2/[2 + (\gamma-1)M_1^2] \to (\gamma+1)/(\gamma-1)\). No matter how strong the shock, you can't compress a perfect gas by more than 6 in one jump (γ = 1.4). Pressure and temperature keep growing, so the extra energy goes into heating the gas.`,["nsrho","nsm2"]);
dd("ns-101",R`Both forms agree: \(C_p\ln(1.6875) - R\ln(4.5) = 525.6 - 431.7 = 93.9\) J/(kg K) for air, and \(-287\ln(0.7209) = 93.9\). The \(p_t\) route is usually fastest because the table gives the ratio directly.`,["nspt","ds"]);
dd("ns-102",R`The control surfaces sit just outside the shock layer, in equilibrium gas, but so close together that area change and wall forces are negligible. Mass, momentum and energy are conserved through any internal structure, so the endpoint balances hold even when Navier–Stokes doesn't describe the inside.`,["rh"]);
dd("ns-103",R`Viscosity and conduction become dominant inside the thin layer, where gradients are enormous, even if they're negligible everywhere else. The inviscid model doesn't resolve that layer; it replaces it with a jump that satisfies the conservation laws and must still produce entropy.`,["rh","nspt"]);
dd("ns-104",R`Losses rise steeply with Mach number: 0.993 at M = 1.2, 0.930 at 1.5, 0.721 at 2, 0.328 at 3, 0.062 at 5. That steepness is why supersonic inlets spread the compression over several oblique shocks instead of one normal shock.`,["nspt","inlet"]);
dd("mov-107",R`Start from the shock-frame balance \(h_1 + (V_1 - V_s)^2/2 = h_2 + (V_2 - V_s)^2/2\) and expand the squares. The cross terms leave \(h_{t2} - h_{t1} = V_s(V_2 - V_1)\) in the lab frame. The moving shock is effectively a piston doing work on the gas it sweeps up.`,["htframe","galilean"]);
dd("mov-109",R`\(a_1 = \sqrt{1.4(287)(298)} = 346.0\) m/s, so \(M_1' = 1.585\). Then \(p_2/p_1 = 1 + \frac{2.8}{2.4}(1.585^2 - 1) = 2.766\) and \(p_2 = 280\) kPa. Also \(T_2 = 410.6\) K. The observer's Mach number (zero, still air) is irrelevant; only the speed relative to the shock matters.`,["galilean","nsp"]);
dd("mov-111",R`The wall imposes \(V = 0\). The reflected shock decelerates gas that was moving toward the wall, converting its kinetic energy into a second rise in pressure and temperature. Shock tubes use exactly this to reach very high temperatures in the test gas next to the end wall.`,["reflM"]);
dd("mov-112",R`\(\Delta V/a_1 = 2(M_1^2-1)/[(\gamma+1)M_1]\). Because it's a velocity difference, it's the same in every frame. For a reflected shock you know \(\Delta V = V_u\) but not the shock speed, so you enter this column with \(V_u/a_1\) and read off \(M_1'\).`,["dva"]);
dd("obl-117",R`At \(\theta = \mu\), \(M_1\sin\theta = 1\): the normal component is just sonic and the "shock" has zero strength. At 90° the whole Mach number is normal. In between, δ rises from 0 to δmax and back to 0, so every δ below δmax is hit twice: the weak and strong solutions.`,["thmin","tbm"]);
dd("obl-119",R`A detached bow shock is normal on the axis (subsonic behind it), and more oblique farther out, so the flow behind its outer parts can stay supersonic. The subsonic pocket can turn the flow gradually around the body through its pressure field, which a straight attached shock can't do.`,["tbm"]);
dd("obl-120",R`δmax(M) for γ = 1.4: about 12.1° at M = 1.5, 23.0° at M = 2, 34.1° at M = 3, 41.1° at M = 5, approaching 45.6° as M → ∞. A wedge with a half-angle above these values gets a detached shock at that Mach number.`,["tbm"]);
dd("obl-121",R`The tangential component is unchanged, and the downstream velocity makes angle \(\theta - \delta\) with the shock. So the downstream normal component is \(M_2\sin(\theta - \delta)\), which must equal the normal-shock \(M_{\perp 2}\). Dividing by \(\sin\theta\) alone is a common slip that uses the upstream geometry.`,["oblnorm","oblM2"]);
dd("obl-125",R`The charts are built from the full oblique-shock relations, with curves of constant δ plotted against the incoming Mach number. They do the \(M_1\sin\theta\) projection internally. Use the normal component only with the normal-shock table (Appendix B).`,["tbm","oblnorm"]);
dd("obl-126",R`Solve θ–δ–M with M = 2, δ = 10°: θ ≈ 39.3° (weak) or 83.7° (strong). Check: \(M_\perp = 2\sin 39.3° = 1.267\), \(p_2/p_1 = 1.707\), \(M_2 = 1.64\). The weak solution is only 9° steeper than the Mach angle, as expected for a modest turn.`,["tbm","oblM2"]);
dd("obl-127",R`Around a cone, the flow can relieve itself sideways (around the circumference), so a cone of half-angle δ produces a weaker, shallower shock than a wedge of the same angle and turns the flow gradually behind it (Taylor–Maccoll flow). The reader limits the analysis to planar turning.`,[]);
dd("pm-132",R`As \(M \to \infty\), both arctangents go to π/2, giving \(\nu_{max} = \frac{\pi}{2}(\sqrt{(\gamma+1)/(\gamma-1)} - 1)\). For γ = 1.4 that's \(90(\sqrt6 - 1) = 130.45°\). In practice, real gases condense or the continuum model fails long before.`,["pmfun"]);
dd("pm-134",R`The geometry: across a Mach wave, the tangential velocity \(V\cos\mu\) is unchanged while the flow turns through \(d\delta\). Expanding to first order gives \(d\delta = \cot\mu\,dV/V\), and \(\cot\mu = \sqrt{M^2 - 1}\). This step needs no equation of state; the perfect gas only enters when converting dV/V to dM/M.`,["dnu"]);
dd("pm-136",R`\(\nu\) works like an altitude above a datum (the sonic state). The change \(\nu_2 - \nu_1\) depends only on the endpoint Mach numbers, so you can treat any supersonic stream as if it had expanded from M = 1. That's why the table lists \(\nu\) against M.`,["pmfun","pmturn"]);
dd("pm-137",R`The first wave sees the incoming flow, so it sits at \(\mu_1\) to that direction. Each later wave sees flow that has already turned and sped up. The last wave sits at \(\mu_2\) to the final flow direction, which is rotated by δ, so the fan's angular span is \((\mu_1 - \mu_2) + \delta\).`,["pmturn","muangle"]);
dd("pm-138",R`\(\nu_2 = 26.38° + 10° = 36.38°\) gives \(M_2 = 2.385\). Since \(p_t\) is constant, \(p_2/p_1 = (p/p_t)_2/(p/p_t)_1 = 0.0700/0.1278 = 0.548\). The temperature ratio is 0.842. Expansion lowers p and T and raises M.`,["pmturn","ptp"]);
dd("ext-142",R`Ask what the jet needs at the lip: over-expanded flow (pₑ < p_amb) must be compressed to ambient, so shocks form; under-expanded flow (pₑ > p_amb) must expand, so fans form. Every later wave follows from the alternating requirements at the boundary (pressure) and the centerline (direction).`,["jetbc"]);
dd("ext-143",R`Each shock in the cell structure produces entropy and lowers \(p_t\), so the waves weaken. Meanwhile the shear layer between the jet and the surrounding air grows by turbulent mixing and eats into the inviscid core. After a few cells the organized pattern is gone.`,["jetbc"]);
dd("ext-145",R`Pressure acts perpendicular to the plate, and the plate is tilted by α, so the net pressure force has a component along the freestream: \(D' = (p_3 - p_2)c\sin\alpha\). This exists without viscosity; it's the momentum the wave system carries away. Real wings add skin friction on top.`,["plate"]);
dd("ext-146",R`Across the slip line, a pressure difference would accelerate fluid sideways and the line would move, so p must match. Fluid can't cross it, so the two velocities must be parallel. But the upper stream went through a fan (no loss) and the lower through a shock (loss), so their entropies, temperatures and speeds differ.`,["slip"]);
dd("ext-147",R`The nearly normal part of the bow shock ahead of a blunt nose produces a large stagnation-pressure loss and a subsonic pocket, which shows up as a big pressure drag. A sharp edge lets each surface turn the flow with a weak attached oblique shock or a fan instead.`,["tbm","nspt"]);
dd("ext-148",R`For a double wedge of half-angle ε at incidence α, the upper front panel turns the flow by \(\varepsilon - \alpha\). That's a compression while α < ε and an expansion once α > ε. The lower front panel always compresses, by \(\varepsilon + \alpha\). Always work from the change in local flow direction at each corner.`,["plate","pmturn","tbm"]);
dd("ext-150",R`Regular reflection needs the reflected shock to turn the flow back through the incident deflection, and that requires \(\delta \le \delta_{max}(M_2)\) behind the incident shock, exactly the HW 4 #3 condition. A large pressure mismatch at the lip makes the incident shock strong, lowers M₂, and the condition can fail, giving a Mach disk.`,["tbm","jetbc"]);

/* ===== HW 3: CD nozzles with shocks, and supersonic wind-tunnel starting ===== */
mc("noz","equation",1,R`A CD nozzle must deliver a given design exit pressure \(p_e\) from a reservoir at \(p_t\). How do you size the exit area?`,
 [R`Get \(M_e\) from \(p_e/p_t\) on the isentrope, then \(A_e = A_t\,(A/A^*)_{M_e}\), since the choked throat is \(A^*\)`,R`\(A_e = A_t\,p_t/p_e\)`,R`\(A_e = A_t\,(p_t/p_e)^{1/\gamma}\)`,R`Get \(M_e\) from \(p_e/p_t\), then \(A_e = A_t/M_e\)`],
 R`At design, the whole nozzle is isentropic and the throat is sonic, so \(A_t = A^*\). The pressure ratio fixes \(M_e\) (supersonic root), and the area–Mach relation turns that into \(A_e/A_t\).`,"HW3 #1a; Reader §4.9.1",
 R`This is the reader's design-back-pressure example run in reverse: there, \(A_e/A_t\) was given and \(p_e\) found; here \(p_e\) is given and the area found. Once \(A_e\) is fixed, the other two critical pressures follow from the same area ratio: the subsonic root gives first critical, and a normal shock at \(M_e\) gives second critical.`,["aastar","ptp"]);
mc("noz","concept",1,R`As \(p_b\) rises toward first critical, an internal normal shock moves upstream toward the throat. In the limit, does a finite-strength shock remain at the throat?`,
 ["No: the Mach number just ahead of the shock falls to 1, so the shock's strength goes to zero and the flow becomes the isentropic first-critical solution","Yes: a normal shock with the full exit-pressure jump sits at the throat","Yes, but it turns into an oblique shock","No: the shock leaves the nozzle through the exit"],
 R`The shock can only stand where the flow is supersonic. Moving toward the throat, the upstream Mach number drops to 1, and a Mach-1 normal shock produces no jump. The limiting flow is subsonic–sonic–subsonic and isentropic.`,"HW3 #1c; Reader §5.4.1",
 R`This is also why the nozzle can be choked with \(p_b\) far above \(p^*\). In the first-critical flow, the throat is sonic at \(p^*\), and the subsonic diverging section recovers pressure all the way to the exit. A choked throat only requires M = 1 there, not \(p_b \le p^*\). The reader states the endpoints: shock strength goes to zero at the throat at first critical, and the shock sits at the exit at second critical.`,["aastar","nsp"]);
mc("ns","equation",1,R`In a choked CD nozzle you know \(p_{t1}\) and the static pressure \(p_x\) just ahead of a normal shock. How do you find where the shock stands?`,
 [R`\(M_x\) from \(p_x/p_{t1}\) (isentropic, supersonic), then \(A_x = A_t\,(A/A^*)_{M_x}\), with \(A^* = A_t\) upstream of the shock`,R`\(A_x = A_t\,p_{t1}/p_x\)`,R`Use the normal-shock table with \(p_y/p_x\) to get \(A_x\) directly`,R`\(A_x\) from the exit Mach number and \(A/A^*\)`],
 R`Upstream of the shock, the flow is isentropic from the reservoir, so \(p_t = p_{t1}\) and \(A^*\) is the throat. The local pressure ratio gives \(M_x\), and the area–Mach relation gives the area.`,"HW3 #2a",
 R`Then cross the shock with the tables (\(M_y\), \(p_{ty}/p_{tx}\)) and move to the downstream reference: \(A_y^* = A_t\,p_{t1}/p_{ty}\). The exit area and exit pressure come from the exit Mach number with \(A^*_y\) and \(p_{ty}\). If \(\dot m\) is given instead of \(A_t\), the choked-flow relation gives the throat area first.`,["ptp","aastar","ptastar","mdotmax"]);
mc("ns","concept",1,R`A normal shock stands in the diverging section and the exit is subsonic. A colleague finds the exit Mach number from the subsonic root of the <b>geometric</b> \(A_e/A_t\). What goes wrong?`,
 [R`Downstream of the shock \(A^* = A_t\,p_{t1}/p_{t2}\), larger than \(A_t\), so \(A_e/A_t\) overstates \(A/A^*\) and gives too low an \(M_e\)`,"Nothing; A* is always the geometric throat area","They should use the supersonic root, since the throat is choked",R`\(\gamma\) changes across the shock, so the area–Mach relation no longer applies`],
 R`The area–Mach relation needs the local \(A^*\), and the shock raised it by \(p_{t1}/p_{t2}\). Using \(A_t\) assumes a lossless flow that doesn't exist here.`,"HW3 #2c; Reader §5.4.2",
 R`The size of the error matches the shock's stagnation-pressure loss. With HW 3 #2's numbers, the true exit Mach is 0.50, but the geometric ratio gives about 0.457. The two only agree when the shock vanishes. This is the same \(p_tA^*\) invariant the reader uses to locate a shock from the exit conditions.`,["ptastar","aastar"]);
mc("ns","equation",0,R`Air at \(p_t\), \(T_t\) flows through a choked nozzle at a known mass flow rate. The throat area is:`,
 [R`\(A_t = \dfrac{\dot m\sqrt{T_t}}{p_t\sqrt{\gamma/R}\,\left(\frac{2}{\gamma+1}\right)^{\frac{\gamma+1}{2(\gamma-1)}}}\)`,R`\(A_t = \dot m/(\rho_tV)\)`,R`\(A_t = \dot m\sqrt{T_t}/p_t\)`,R`\(A_t = \dot m RT_t/p_t\)`],
 R`Invert the choked-mass-flow relation. The throat is the sonic section, so it carries the maximum mass flux for the given stagnation state.`,"HW3 #2a; Reader §4.8.2",
 R`The density and speed that set the flux are the sonic values \(\rho^*\) and \(a^*\), not stagnation values. The relation packages them: \(\dot m = A^*\rho^*a^*\). Use SI throughout: Pa, K and J/(kg K) give \(A_t\) in m².`,["mdotmax"]);
mc("tun","concept",1,R`Why does a supersonic wind tunnel with a diffuser need a second throat <b>larger</b> than the first in order to start?`,
 [R`During starting, a normal shock must pass through the test section; behind it \(p_t\) is lower, so the second throat must pass the same mass flow at lower \(p_t\): \(A_2 \ge A_1\,p_{t1}/p_{t2}\)`,"To slow the supersonic flow isentropically after the test section","So that the receiver pressure can be higher than the reservoir pressure","Because the second throat must equal the test-section area"],
 R`Both throats pass the same \(\dot m \propto p_tA^*\). With the starting shock at the test-section Mach number \(M_T\), the second throat needs \(A_2/A_1 \ge (p_{t1}/p_{t2})_{NS}\) at \(M_T\). Otherwise it chokes first and holds the shock upstream.`,"HW3 #3b",
 R`For a Mach 2 test section, the normal-shock \(p_{t2}/p_{t1}\) is 0.7209, so the second throat must be at least 1.387 times the first. If it's smaller, the tunnel stays "unstarted": the shock can't move into the test section no matter how low the receiver pressure goes.`,["start","nspt","ptastar"]);
mc("tun","equation",1,R`A tunnel has a 10.0 cm² first throat and a Mach 2 test section (\(\gamma = 1.4\)). Using the normal-shock loss at the test-section Mach number, what is the smallest second-throat area that lets it start?`,
 ["13.9 cm²","10.0 cm²","16.9 cm²","7.2 cm²"],
 R`\(A_{2,min} = A_1/(p_{t2}/p_{t1})_{M=2} = 10.0/0.7209 = 13.87\) cm². 16.9 cm² is the test section itself, and 7.2 cm² comes from multiplying by the ratio instead of dividing.`,"HW3 #3b–c",
 R`The worst case is the shock standing in the test section, where the Mach number (and so the loss) is largest. Once the shock has been swallowed, the flow through the second throat is supersonic and isentropic again, so the second throat can be closed back toward \(A_1\) without unstarting the tunnel.`,["start","nspt"]);
mc("tun","concept",1,R`A tunnel's second throat is too small to start it. As \(p_b\) is lowered slowly from \(p_{t0}\), what limiting flow is reached?`,
 [R`Both throats sonic, with a normal shock in the first diverging section where \(p_{t1}/p_{t2} = A_2/A_1\), and a subsonic test section`,"A supersonic test section with a subsonic second throat","Only the second throat is sonic; the first throat stays subsonic","The shock passes through the test section and out of the tunnel"],
 R`Once the second throat chokes, it fixes \(p_{t2}A_2 = p_{t1}A_1\). That fixes the shock's loss, and so its position. Lowering \(p_b\) further only changes the flow downstream of the second throat.`,"HW3 #3b",
 R`For HW 3's tunnel (\(A_1 = 10\), \(A_T = 16.875\), \(A_2 = 12\) cm²): \(p_{t2}/p_{t1} = 10/12\), so the shock has \(M_x \approx 1.75\) and stands where \(A \approx 13.9\) cm², before the test section. Behind it the test section runs subsonic (about M 0.47), and the flow reaccelerates to M = 1 at the second throat. This assumes \(A_2 > A_1\); if \(A_2 < A_1\), only the second throat can choke.`,["start","ptastar","nspt"]);
mc("tun","concept",1,R`Assess the claim: "Once the first throat chokes, changes downstream cannot affect the flow anywhere inside the tunnel."`,
 ["False: choking fixes ṁ and the flow upstream of the first throat, but downstream changes (second-throat area, back pressure) can still move a shock in the diverging section or start and unstart the tunnel","True: a sonic throat blocks all downstream information","True, but only when the test section is subsonic","False, because the first throat unchokes whenever the second throat moves"],
 R`A sonic first throat isolates the flow upstream of it. Downstream, subsonic regions (behind a shock) can still communicate upstream as far as the throat, so the shock position responds to \(A_2\) and \(p_b\).`,"HW3 #3c",
 R`Opening the second throat is exactly how you start the tunnel: it lowers the downstream \(p_t\) the second throat can accept, which pulls the shock downstream through the test section. Closing it too far (below the starting value before the shock is swallowed, or below \(A_1\) after) changes the internal flow too. The claim confuses "mass flow is fixed" with "nothing inside can change".`,["start","ptastar"]);
mc("tun","concept",0,R`Why can't a normal shock sit stably in the <b>converging</b> part of a second throat with supersonic flow ahead of it?`,
 ["If it moves downstream, the upstream Mach number drops, the shock weakens and loses less pₜ, so the second throat can pass more flow and the shock is pulled further downstream; it runs through the throat","Normal shocks can't form in converging ducts","Because the flow there is already subsonic","Because the second throat is always sonic"],
 R`In a converging supersonic passage, M falls in the flow direction. The equilibrium is unstable: a small displacement changes the loss in the direction that pushes the shock further. In a diverging passage the effect reverses and the shock is stable.`,"HW3 #3; Reader §5.4",
 R`Follow a small downstream nudge: lower \(M_x\), smaller loss, higher \(p_{t2}\), so the downstream throat can pass more than the supply delivers. Downstream pressure falls and the shock keeps moving. That's why a starting shock, once it enters the second converging section, is swallowed through the second throat.`,["start","nspt"]);
mc("tun","concept",0,R`After a tunnel has started, why close the second throat back down toward the first-throat area?`,
 ["It lowers the Mach number at the terminal shock in the diffuser, cutting the stagnation-pressure loss and the pressure ratio needed to run","It raises the test-section Mach number","It's required to keep the first throat choked","It moves the shock upstream into the test section"],
 R`Once started, the flow is supersonic through the second throat with \(A^* = A_1\). A smaller \(A_2\) means a lower Mach number there and a weaker terminal shock, so less \(p_t\) is lost. It can't go below \(A_1\) (or the actual \(A^*\)) without unstarting.`,"HW3 #3c",
 R`This is the hysteresis HW 3 #3 is built around. The second throat must open to at least \(A_1(p_{t1}/p_{t2})_{M_T}\) to swallow the starting shock, but can then close again (HW 3 ends at 12.0 cm² with a 10.0 cm² first throat) while the tunnel stays started. Ideally the diffuser shock would sit right at a sonic second throat with zero strength; real tunnels stop short of that for margin.`,["start","aastar"]);

/* ---------------- Flashcards (concepts and what each relation does; no number recall) ---------------- */
const CARDS = [];
function card(t, mr, front, back) { CARDS.push({ id: "c-" + t + "-" + CARDS.length, t, mr: !!mr, front, back }); }

card("thermo",1,"Isentropic means…",R`Adiabatic <b>and</b> internally reversible: \(dS_e = 0\) and \(dS_i = 0\). Adiabatic alone isn't enough.`);
card("thermo",0,"Polytropic exponents",R`\(pV^n = C\): \(n = 0\) isobaric, \(n = 1\) isothermal, \(n = \gamma\) reversible adiabatic, \(n \to \infty\) isochoric. Real processes: \(1 < n < \gamma\).`);
card("thermo",0,"γ by molecule type",R`Monatomic: \(u = \tfrac32RT\), \(\gamma = 5/3\). Diatomic: \(u = \tfrac52RT\), \(\gamma = 7/5\). Nonlinear triatomic (H₂O): \(u = 3RT\), \(\gamma = 4/3\).`);
card("thermo",1,"Perfect gas u and h",R`Functions of T only: \(du = C_v\,dT\), \(dh = C_p\,dT\) for any process. Pressure never enters h.`);
card("thermo",0,"Sign convention",R`Heat <b>into</b> the system is positive; work done <b>by</b> the system is positive. Turbine \(\dot W_s > 0\), compressor \(\dot W_s < 0\).`);
card("thermo",0,"Compressibility rule of thumb",R`Important above about \(M \approx 0.3\), where \(M^2/(1-M^2) \approx 0.10\).`);
card("thermo",0,"State postulate (\"0₂ law\")","Two independent intensive properties fix the state of a simple compressible system.");
card("rtt",1,"RTT in words","Rate of change for the control mass = accumulation inside the CV + net outward flux through the CS. Choose η = 1, e, s or V⃗.");
card("rtt",1,"Stored vs. transported energy",R`Stored in the CV: \(e = u + V^2/2 + gz\). Carried across the CS: \(h + V^2/2 + gz\) (u plus flow work pv).`);
card("rtt",1,"Tank-filling results (insulated, rigid)",R`\(m_2u_2 - m_1u_1 = h_0\Delta m\). Evacuated start: \(T_2 = \gamma T_0\). Mass doubling from \(T_1 = T_0\): \(T_2 = (\gamma+1)T_0/2\).`);
card("rtt",0,"Unit trap in the SFEE",R`\(V^2/2\) comes out in J/kg. Divide by 1000 before adding it to h in kJ/kg.`);
card("rtt",0,"Laminar pipe mass flow",R`\(\dot m = \rho A V_m/2\) for the parabolic profile.`);
card("ent",1,"Entropy split",R`\(dS = dS_e + dS_i\). \(dS_e = \delta Q/T_b\) (exchange at the boundary), \(dS_i \ge 0\) (production). Shaft work carries no entropy.`);
card("ent",0,"Entropy sources","Friction, mixing, heat transfer across a finite ΔT, and shocks.");
card("ent",1,"Darcy vs. Fanning",R`Reader (Darcy): \(f = 4\tau_w/(\rho V^2/2)\). Fanning is 1/4 of that. Check before using a chart.`);
card("ent",0,"Hydraulic diameter",R`\(D_e = 4A/P\). Circle: D. Square of side s: s.`);
card("ent",1,"Rocket equation (HW 1 #3)",R`\(\Delta V = V_{ex}\ln(M_0/M_f)\). Use an inertial frame and a CV around the rocket. The burn rate drops out.`);
card("ent",0,"Friction and energy",R`Friction conserves total enthalpy (\(d(h + V^2/2) = 0\), adiabatic and horizontal) while raising entropy: \(T\,ds_i = fV^2dx/(2D_e)\).`);
card("stag",1,"Stagnation state definition","State reached by bringing the flow to rest isentropically: no heat, no work, no losses. A reference, not what a lossy probe reads. s_t = s.");
card("stag",1,"What stays constant?",R`Adiabatic, no work: \(h_t\) (and \(T_t\)) constant, even with friction or shocks. Also no losses: \(p_t\) constant.`);
card("stag",1,"Stagnation-pressure loss",R`\(p_{t2}/p_{t1} = e^{-\Delta s/R}\). Adiabatic, no work, constant R (not constant \(c_p\)).`);
card("stag",0,"What can change pₜ?",R`Heat transfer, irreversibility, shaft work: \(dp_t/\rho_t + (T_t - T)ds_e + T_t\,ds_i + \delta w_s = 0\).`);
card("stag",1,"Second-law check on a dataset",R`If a dataset gives \(p_{t2} > p_{t1}\) in an adiabatic device, \(\Delta s < 0\), which is impossible. The energy balance can't catch it, since h = h(T).`);
card("sound",1,"Sound speed",R`\(a^2 = (\partial p/\partial\rho)_s\). Perfect gas: \(a = \sqrt{\gamma RT}\), using the static T. Isentropic because a small acoustic wave has no heat transfer or losses.`);
card("sound",1,"Why Newton's sound speed was wrong",R`He assumed an isothermal wave, \(a_T = \sqrt{RT}\). The real wave is isentropic, \(a_s = \sqrt{\gamma RT}\), so his value is low by a factor of \(1/\sqrt\gamma\).`);
card("sound",1,"Signal speeds in a moving gas",R`Downstream \(V + a\), upstream \(V - a\). At \(M \ge 1\), both point downstream: no upstream communication.`);
card("sound",1,"Mach angle",R`\(\mu = \sin^{-1}(1/M)\): the half-angle of the envelope of small disturbances. It approaches 90° as M → 1, narrows as M grows, and is undefined for M < 1.`);
card("sound",1,"Boom geometry (HW 2 #3a)",R`\(M = \sqrt{1 + (L/H)^2} = \sqrt{1 + (V\Delta t/H)^2}\).`);
card("sound",0,"Zones","Inside the Mach cone: zone of action. Outside: zone of silence (relative to that source).");
card("sound",0,"Why shocks form","Compression raises T (and a) and moves the gas forward, so later parts catch up. Expansions spread into fans instead.");
card("area",1,"Area–velocity relation",R`\(\dfrac{dA}{A} = (M^2 - 1)\dfrac{dV}{V}\), \(dp = -\rho V\,dV\). Subsonic: converge to accelerate. Supersonic: diverge to accelerate.`);
card("area",1,"Sign table",R`Converging, M < 1: p↓ ρ↓ V↑. Converging, M > 1: p↑ ρ↑ V↓. Diverging, M < 1: p↑ ρ↑ V↓. Diverging, M > 1: p↓ ρ↓ V↑.`);
card("area",1,"Sonic point",R`M = 1 requires dA = 0 (necessary for smooth passage). A throat is not automatically sonic.`);
card("area",1,"A* is a reference",R`\(A^* = \dot m/(\rho^*a^*)\). Equals the throat only when choked. \(p_{t1}A_1^* = p_{t2}A_2^*\): losses raise A*.`);
card("area",1,"Two roots of A/A*","For A/A* > 1 there's a subsonic and a supersonic root. Inlet conditions and geometry pick the branch.");
card("area",0,"Losses in the working equations",R`\(T_2/T_1\): no Δs term. \(p_2/p_1\): \(\times e^{-\Delta s/R}\). \(A_2/A_1\): \(\times e^{+\Delta s/R}\).`);
card("noz",1,"Critical pressure ratio",R`\(p^*/p_t = \left(\frac{2}{\gamma+1}\right)^{\gamma/(\gamma-1)}\) is the pressure ratio at a sonic throat. A converging nozzle chokes once \(p_b/p_t\) falls to it; lowering \(p_b\) further changes nothing inside.`);
card("noz",1,"Choked mass flow",R`\(\dot m_{max} = A^*\dfrac{p_t}{\sqrt{T_t}}\sqrt{\dfrac{\gamma}{R}}\left(\dfrac{2}{\gamma+1}\right)^{\frac{\gamma+1}{2(\gamma-1)}}\). Set by \(p_t\), \(T_t\) and the throat: back pressure can't raise it, and a higher \(T_t\) lowers it.`);
card("noz",1,"CD nozzle critical conditions","1st: throat first sonic, subsonic elsewhere. 2nd: normal shock at the exit. 3rd: design, isentropic supersonic exit matched to p_b.");
card("noz",1,"Regimes by back pressure","Above 1st: venturi. 1st–2nd: internal normal shock. 2nd–3rd: over-expanded, external shocks. Below 3rd: under-expanded, external fans.");
card("noz",0,"First choking of a CD nozzle",R`Happens at a back pressure well above \(p^*\). The throat is at \(p^*\), but the subsonic diverging section recovers pressure before the exit, so use the subsonic root of \(A_e/A^*\).`);
card("noz",0,"Efficiencies",R`Nozzle \(\eta_n = (h_1 - h_2)/(h_1 - h_{2s})\): same exit pressure. Diffuser \(\eta_d = (p_2 - p_1)/(p_{2s} - p_1)\): same exit speed. Recovery \(\eta_r = p_{t2}/p_{t1}\).`);
card("ns",1,"Normal shock: what's conserved",R`\(\rho V\), \(p + \rho V^2\), \(h + V^2/2\) (so \(T_t\)). p, ρ, T, s rise; V, M, \(p_t\) fall.`);
card("ns",0,"Strong-shock limits",R`As \(M_1 \to \infty\), \(\rho_2/\rho_1 \to (\gamma+1)/(\gamma-1)\) and \(M_2 \to \sqrt{(\gamma-1)/(2\gamma)}\), while the p and T ratios grow without bound. Density compression is capped.`);
card("ns",1,"Table jobs","Isentropic table: a state ↔ its own reference. Shock table: actual state 1 ↔ actual state 2.");
card("ns",1,"Shock in a nozzle",R`\(A_3 \approx A_4\), but \(A_4^* = A_3^*p_{t3}/p_{t4}\). Locate it with \(A_ep_e/(A_tp_{t1}) = A_ep_e/(A_e^*p_{te})\) → \(M_e\) → \(p_{te}/p_{t1}\) → \(M_{shock}\).`);
card("ns",0,"Weak-shock scaling",R`\(\Delta p/p \propto M_1^2 - 1\); \(\Delta s/R \approx \frac{2\gamma}{3(\gamma+1)^2}(M_1^2-1)^3\).`);
card("mov",1,"Moving-shock recipe",R`\(V' = V - V_s\) → shock tables with \(M_1' = |V_1 - V_s|/a_1\) → \(V_2' = M_2'\sqrt{\gamma RT_2}\) → \(V_2 = V_2' + V_s\).`);
card("mov",1,"Frame dependence","Static p, T, ρ, s: frame independent. Velocity, M and stagnation properties: frame dependent. hₜ₁ = hₜ₂ only in the shock frame.");
card("mov",1,"Reflected shock condition",R`Gas behind it is at rest: \(\Delta V/a_1 = V_u/a_1\). \(M_1' = \frac{\gamma+1}{4}\frac{V_u}{a_1} + \sqrt{1 + \left(\frac{\gamma+1}{4}\frac{V_u}{a_1}\right)^2}\).`);
card("mov",0,"Lab-frame energy jump",R`\(h_{t2} - h_{t1} = V_s(V_2 - V_1)\).`);
card("obl",1,"Oblique shock rule",R`Tangential velocity unchanged. Use \(M_{\perp1} = M_1\sin\theta\) in the normal-shock relations, then \(M_2 = M_{\perp 2}/\sin(\theta - \delta)\).`);
card("obl",1,"Angle notation trap","Reader: θ = shock angle, δ = deflection. Many texts: β = shock angle, θ = deflection.");
card("obl",1,"Weak vs. strong","Strong (larger θ): subsonic M₂, more loss, needs downstream support. Weak: usually supersonic M₂ (except near δmax); typical for external flow.");
card("obl",1,"Regular reflection condition",R`The reflected shock must turn the flow back by δ, so it needs \(\delta \le \delta_{max}(M_2)\) behind the incident shock. A supersonic \(M_2\) alone isn't enough; when the condition fails, expect a Mach reflection.`);
card("obl",1,"Pitot in supersonic flow",R`Reads \(p_{t2}\) behind its normal bow shock. Get \(M_1\) from \(p_{t2}/p_1\) (Appendix B, last pressure column). Needs a separate static tap.`);
card("obl",0,"Oblique-shock stagnation-pressure trap",R`For an oblique shock, \(p_{t2}/p_{t1}\) at \(M_\perp\) is correct, but \(p_{t1}/p_1\) uses the full \(M_1\). Never read the \(p_{t2}/p_1\) column at \(M_\perp\).`);
card("obl",0,"Inlet recovery",R`\(p_{t,out}/p_{t,in} = \prod_j (p_{t,after}/p_{t,before})_j = \exp(-\sum\Delta s_j/R)\). Several weak shocks beat one normal shock.`);
card("pm",1,"Prandtl–Meyer turning",R`\(\delta = \nu(M_2) - \nu(M_1)\): + expansion, − smooth compression. \(s\), \(p_t\), \(T_t\) constant.`);
card("pm",1,"Concave vs convex walls","Concave: compression waves converge → can coalesce into a shock. Convex: expansion waves diverge → fan.");
card("ext",1,"Boundary conditions","Free boundary: p = p_amb, shape adjusts. Wall or symmetry line: flow tangent, pressure can be anything.");
card("ext",1,"Wave reflections","Free boundary: compression ↔ expansion. Wall/centerline: compression → compression, expansion → expansion.");
card("ext",1,"Flat plate forces",R`\(L' = (p_3 - p_2)c\cos\alpha\), \(D' = (p_3 - p_2)c\sin\alpha\), \(L/D = \cot\alpha\). Wave drag exists without viscosity.`);
card("ext",0,"Slip line","Pressure and direction match across it; speed and entropy need not.");
card("ext",0,"Aerospike","Atmosphere provides the outer free boundary, so the effective expansion adapts with altitude (altitude compensation).");
card("noz",1,"Shock approaching the throat",R`As \(p_b\) rises toward first critical, the shock's upstream Mach number falls to 1 and its strength to zero. The limit is the isentropic subsonic-branch flow, still choked.`);
card("ns",1,"Shock location from the pressure ahead of it",R`\(M_x\) from \(p_x/p_{t1}\) on the supersonic branch, then \(A_x = A_t(A/A^*)_{M_x}\), since \(A^* = A_t\) upstream of the shock.`);
card("ns",1,"A* after a shock",R`Downstream of a shock, use \(A_2^* = A_t\,p_{t1}/p_{t2}\), not \(A_t\). Using the geometric \(A_e/A_t\) gives too low an exit Mach number.`);
card("tun",1,"Starting criterion",R`\(A_2/A_1 \ge (p_{t1}/p_{t2})_{NS}\) at the test-section Mach number: the second throat must pass the same \(\dot m\) behind the starting shock.`);
card("tun",1,"Unstarted tunnel","Both throats sonic, a normal shock fixed in the first diverging section where pₜ₁/pₜ₂ = A₂/A₁, and a subsonic test section. Lowering p_b doesn't fix it.");
card("tun",1,"Choked ≠ isolated","A choked first throat fixes ṁ and the flow upstream of it. Downstream changes (A₂, p_b) can still move shocks and start or unstart the tunnel.");
card("tun",0,"Shock in a converging supersonic passage","Unstable: a downstream nudge weakens the shock, raises pₜ₂ and pulls it further, so it's swallowed through the throat. Shocks are stable only in diverging sections.");
card("tun",0,"Starting hysteresis","Open the second throat past the starting value to swallow the shock, then close it back toward A₁ to cut diffuser losses. It must stay ≥ A* = A₁ to remain started.");

/* ---------------- Equation sheet ----------------
   eq(id, topic, highYield, name, tex, terms[[sym, meaning]], use, assume, watch, labHash) */
const EQ = [];
function eq(id, t, mr, name, tex, terms, use, assume, watch, lab) { EQ.push({ id, t, mr: !!mr, name, tex, terms, use, assume, watch, lab: lab || "" }); }

/* Ch 1 */
eq("eos","thermo",1,"Perfect-gas equation of state",R`p = \rho RT,\qquad p\forall = mRT,\qquad R = \frac{\hat R}{M_w}`,
 [[R`R`,"specific gas constant (287 J/(kg K) for air)"],[R`\hat R`,"universal constant, 8314 J/(kmol K)"],[R`M_w`,"molar mass"]],
 "Linking p, ρ and T at any state; getting R for a new gas (methane: 520 J/(kg K)).","Absolute p and T. Far from phase change.","Use kmol with 8314, or mol with 8.314 and g; mixing them gives answers off by 1000.");
eq("cpcv","thermo",1,"Specific heats",R`C_p - C_v = R,\quad \gamma = \frac{C_p}{C_v},\quad C_p = \frac{\gamma R}{\gamma - 1},\quad C_v = \frac{R}{\gamma-1}`,
 [[R`\gamma`,"ratio of specific heats (1.4 air, 5/3 monatomic)"]],
 "Converting between R, γ, Cp and Cv; turning V²/2 into Mach-number form.","Calorically perfect gas (constant cp, cv).","γR = (γ−1)Cp is the identity behind every Tₜ/T relation.");
eq("dudh","thermo",1,"Perfect-gas u and h",R`du = C_v\,dT,\qquad dh = C_p\,dT,\qquad h = u + pv = u + RT`,
 [],"Energy changes for any process of a perfect gas: only ΔT matters.","Ideal gas: u = u(T), h = h(T).","An isothermal perfect-gas flow has Δh = 0 but can still need heat (HW 1 #1).");
eq("poly","thermo",0,"Polytropic process",R`p\forall^n = C`,
 [[R`n`,"0 isobaric, 1 isothermal, γ reversible adiabatic, ∞ isochoric"]],
 "Approximating real compressions and expansions with some heat transfer.","Quasi-equilibrium process.","Real processes usually have 1 < n < γ.");
eq("firstlaw","thermo",0,"First law (simple compressible, per unit mass)",R`\Delta E = Q - W,\qquad du = \delta q - p\,dv,\qquad dh = \delta q + v\,dp`,
 [[R`\delta q,\ \delta w`,"path functions (inexact differentials)"]],
 "Closed-system energy accounting; the starting point for the Tds relations.","Quasi-static, boundary work only (for the differential forms).","Heat in is positive; work done by the system is positive.");
eq("tds","thermo",1,"Gibbs (Tds) relations",R`T\,ds = du + p\,dv = dh - v\,dp`,
 [],"Entropy changes between any two equilibrium states, reversible path or not.","Simple compressible substance.","Derived assuming reversibility but valid for any process, since every term is a property.");
eq("ds","thermo",1,"Perfect-gas entropy change",R`\Delta s = C_p\ln\frac{T_2}{T_1} - R\ln\frac{p_2}{p_1} = C_v\ln\frac{T_2}{T_1} + R\ln\frac{v_2}{v_1}`,
 [],"Δs across shocks, frictional ducts, or any process between known states.","Calorically perfect gas.","Note the opposite signs on the pressure and volume terms.");
/* Ch 2 */
eq("rtt","rtt",1,"Reynolds transport theorem (fixed CV)",R`\frac{DN}{Dt}\bigg|_{CM} = \frac{\partial}{\partial t}\int_{CV}\eta\rho\,d\forall + \int_{CS}\eta\rho\,(\vec V_{cs}\cdot\hat n)\,dA`,
 [[R`N`,"extensive property"],[R`\eta`,"N per unit mass: 1, e, s or V⃗"],[R`\hat n`,"outward unit normal"]],
 "Starting point for every balance: pick η, then supply DN/Dt from the physical law.","Control volume fixed in space.",R`\(\vec V_{cs}\cdot\hat n < 0\) at inlets. Inflow increases the stored N.`);
eq("mass","rtt",1,"Continuity",R`0 = \frac{\partial}{\partial t}\int_{CV}\rho\,d\forall + \int_{CS}\rho(\vec V\cdot\hat n)\,dA,\qquad \dot m = \rho AV = \text{const (steady 1D)}`,
 [],"Linking density, area and speed between sections.","Steady, 1D, no leaks or branches for the second form.","AV is NOT constant in compressible flow; ρAV is.");
eq("cvenergy","rtt",1,"Energy equation for a control volume",R`\dot Q = \dot W_s + \frac{\partial}{\partial t}\int_{CV}\rho e\,d\forall + \sum_{out}\dot m\!\left(h + \tfrac{V^2}{2} + gz\right) - \sum_{in}\dot m\!\left(h + \tfrac{V^2}{2} + gz\right)`,
 [[R`e`,"u + V²/2 + gz (stored)"],[R`h`,"u + pv (carried across ports)"]],
 "Transient problems such as filling or emptying tanks (HW 1 #2).","Shaft and pressure work only; no viscous work at ports.","Storage uses e (with u); fluxes use h. Each ṁ is a positive magnitude.");
eq("tankfill","rtt",1,"Insulated tank filling from a reservoir",R`m_2u_2 - m_1u_1 = h_0\,\Delta m + Q\;\Rightarrow\; T_2 = \frac{\gamma T_0\,\Delta m + T_1 m_1}{m_2}\ (Q = 0)`,
 [[R`h_0`,"reservoir stagnation enthalpy (= c_p T₀)"]],
 "Final temperature after filling; heat needed to hold the tank isothermal.","Uniform tank state at rest; negligible KE and PE; constant reservoir.",R`Evacuated start: \(T_2 = \gamma T_0\). Held isothermal at \(T_0\): \(Q = -RT_0\,\Delta m\) (heat removed).`);
eq("sfee","rtt",1,"Steady-flow energy equation",R`h_{in} + \frac{V_{in}^2}{2} + gz_{in} + q = h_{out} + \frac{V_{out}^2}{2} + gz_{out} + w_s`,
 [[R`q,\ w_s`,"heat in and shaft work out, per unit mass flowing"]],
 "Any steady single-stream device: nozzles, ducts, compressors, turbines.","Steady, one inlet and one outlet.","Units: V²/2 is J/kg, so divide by 1000 to add it to h in kJ/kg.");
eq("sfeed","rtt",0,"Differential energy equation",R`\delta q = \delta w_s + dh + d\!\left(\frac{V^2}{2}\right) + g\,dz`,
 [],"Property changes along a duct between neighboring sections.","Steady 1D flow.","");
/* Ch 2 entropy, momentum */
eq("entbal","ent",1,"Entropy transport",R`dS = dS_e + dS_i,\quad dS_e = \frac{\delta Q}{T_b},\quad dS_i \ge 0;\qquad \dot m(s_{out} - s_{in}) = \frac{dS_e}{dt} + \frac{dS_i}{dt}`,
 [[R`T_b`,"temperature where heat crosses the boundary"]],
 "Deciding whether a process is possible; showing an adiabatic device must have s_out ≥ s_in.","Steady 1D form for the last equation.","Adiabatic ≠ isentropic. Shaft work carries no entropy.");
eq("pe","ent",0,"Pressure-energy equation",R`\frac{dp}{\rho} + d\!\left(\frac{V^2}{2}\right) + g\,dz + T\,ds_i + \delta w_s = 0`,
 [[R`T\,ds_i`,"mechanical energy lost to irreversibility"]],
 "Connecting pressure changes to speed, elevation, losses and shaft work.","Heat exchanged at the local fluid temperature.","Heat transfer doesn't appear explicitly; it cancels through dh.");
eq("euler","ent",0,"Euler and Bernoulli",R`\frac{dp}{\rho} + V\,dV + g\,dz = 0;\qquad \frac{p}{\rho} + \frac{V^2}{2} + gz = \text{const}\ \ (\rho\ \text{const})`,
 [],"Lossless flow without shaft work.","Bernoulli needs constant density.","For compressible flow keep ∫dp/ρ with a thermodynamic p–ρ relation.");
eq("cvmom","ent",0,"Momentum equation for a control volume",R`\sum\vec F = \frac{\partial}{\partial t}\int_{CV}\rho\vec V\,d\forall + \int_{CS}\rho\vec V(\vec V_{cs}\cdot\hat n)\,dA`,
 [],"Forces on fluid or hardware; rocket thrust (HW 1 #3).","Inertial frame for V⃗.","The force on the support is the negative of the force on the fluid.");
eq("mom2","ent",1,"Momentum between two sections",R`p_1A - p_2A - F_f = \dot m(V_2 - V_1)`,
 [[R`F_f`,"wall-friction force magnitude"]],
 "Constant-area duct with friction; the basis of the normal-shock momentum balance.","Steady 1D, horizontal, straight, constant area.","A pressure drop can accelerate the gas as well as overcome friction.");
eq("dmom","ent",0,"Differential momentum with friction",R`\frac{dp}{\rho} + f\frac{V^2}{2D_e}\,dx + g\,dz + d\!\left(\frac{V^2}{2}\right) = 0`,
 [[R`f`,"Darcy friction factor"],[R`D_e`,"hydraulic diameter"]],
 "Property changes along a duct with wall friction (the start of Fanno flow).","Steady quasi-1D flow.","The wall p dA term cancels the end-face term, leaving −A dp.");
eq("fric","ent",1,"Friction factor and hydraulic diameter",R`f \equiv \frac{4\tau_w}{\rho V^2/2},\qquad D_e \equiv \frac{4A}{P}`,
 [[R`\tau_w`,"wall shear stress"],[R`P`,"wetted perimeter"]],
 "Reading friction factors; noncircular ducts.","","Darcy convention. Fanning omits the 4 (a quarter as large).");
eq("tdsi","ent",0,"Entropy produced by friction",R`T\,ds_i = f\,\frac{V^2}{2D_e}\,dx`,
 [],"Showing friction produces entropy while conserving total energy.","Adiabatic duct, no shaft work, gravity only.","Not a general formula for every irreversibility (mixing, finite-ΔT heat transfer).");
eq("rocket","ent",1,"Rocket velocity change (HW 1 #3)",R`M_R\frac{dV_R}{dt} = \dot m\,V_{ex}\;\Rightarrow\;\Delta V = V_{ex}\ln\frac{M_0}{M_f}`,
 [[R`V_{ex}`,"exhaust speed relative to the rocket"]],
 "Velocity gain of a rocket in free space.","Inertial frame; exhaust pressure force neglected.","The mass flow rate cancels out; only the mass ratio matters.");
/* Ch 3 */
eq("ht","stag",1,"Stagnation enthalpy",R`h_t = h + \frac{V^2}{2} + gz,\qquad h_{t1} + q = h_{t2} + w_s`,
 [],"The first check in any problem: adiabatic + no work ⇒ hₜ constant, even with losses.","Steady 1D flow.","Constant hₜ does not mean constant pₜ.");
eq("tt","stag",1,"Stagnation temperature",R`T_t = T + \frac{V^2}{2C_p} = T\left(1 + \frac{\gamma-1}{2}M^2\right)`,
 [],"Tₜ from a local state; T from Tₜ and M.","Calorically perfect gas; negligible elevation change.","Uses the static T. Holds at any point in any adiabatic flow (no isentropic requirement).","calc-isen");
eq("ptloss","stag",1,"Stagnation-pressure loss",R`\frac{p_{t2}}{p_{t1}} = e^{-\Delta s/R},\qquad dp_t = -\rho_tT_t\,ds_i \le 0`,
 [],"Turning a pₜ ratio into Δs (or the reverse); second-law checks (HW 2 #2).","Adiabatic, no shaft work, ideal gas with constant R.","A rise in pₜ in an adiabatic device means Δs < 0: impossible.");
eq("stagpe","stag",0,"Stagnation pressure-energy equation",R`\frac{dp_t}{\rho_t} + (T_t - T)\,ds_e + T_t\,ds_i + \delta w_s = 0`,
 [],"Identifying what changes pₜ: heat transfer, irreversibility, shaft work.","Heat exchanged at the local fluid temperature T.","An isentropic area change leaves pₜ unchanged.");
/* Ch 3 sound */
eq("a","sound",1,"Speed of sound",R`a^2 = \left(\frac{\partial p}{\partial\rho}\right)_s,\qquad a = \sqrt{\gamma RT}`,
 [],"Local sound speed; Mach number from speed and static temperature.","Infinitesimal, lossless, adiabatic disturbance; perfect gas for √(γRT).",R`Isothermal (Newton) gives \(\sqrt{RT}\), 15.5% low for air. Use static T, not Tₜ.`);
eq("mach","sound",1,"Mach number and signal speeds",R`M = \frac{V}{a},\qquad \text{signals travel at } V + a \text{ and } V - a`,
 [],"Subsonic/supersonic classification; acoustic travel-time problems (HW 2 #1b).","Local values of V and a.","At M ≥ 1, V − a ≥ 0: no upstream communication.");
eq("muangle","sound",1,"Mach angle",R`\mu = \sin^{-1}\!\left(\frac{1}{M}\right)`,
 [],"Mach cone half-angle; minimum oblique-shock angle; wave angles in expansion fans.","Uniform supersonic motion; infinitesimal disturbances.","Not the angle of a finite-strength shock.","cone");
eq("boom","sound",1,"Sonic-boom geometry (HW 2 #3a)",R`\sin\mu = \frac{H}{\sqrt{H^2 + L^2}}\;\Rightarrow\; M = \sqrt{1 + \left(\frac{L}{H}\right)^2} = \sqrt{1 + \left(\frac{V\Delta t}{H}\right)^2}`,
 [[R`H`,"altitude"],[R`L`,"distance flown after passing overhead"]],
 "Mach number from when an observer hears the boom.","Constant speed, uniform atmosphere.","For an accelerating aircraft, an instantaneous Mach cone doesn't describe earlier pulses.","cone");
/* Ch 4 */
eq("ptp","area",1,"Stagnation pressure and density ratios",R`\frac{p_t}{p} = \left(1 + \frac{\gamma-1}{2}M^2\right)^{\frac{\gamma}{\gamma-1}},\qquad \frac{\rho_t}{\rho} = \left(1 + \frac{\gamma-1}{2}M^2\right)^{\frac{1}{\gamma-1}}`,
 [],"Linking a local state to its own reference state; using pₜ as a bridge between stations.","Calorically perfect gas. Valid at any state, even in a lossy flow.","pₜ is the same at two stations only if the flow between them is lossless.","calc-isen");
eq("mdot","area",0,"Mass flow in Mach-number form",R`\dot m = pAM\sqrt{\frac{\gamma}{RT}}`,
 [],"Continuity with static properties; compares sections without assuming isentropic flow.","Perfect gas.","");
eq("dav","area",1,"Differential area relations",R`\frac{dA}{A} = (M^2 - 1)\frac{dV}{V},\quad \frac{d\rho}{\rho} = \frac{M^2}{1-M^2}\frac{dA}{A},\quad dp = -\rho V\,dV = \frac{\rho V^2}{1-M^2}\frac{dA}{A}`,
 [],"Which way properties change in a converging or diverging section.","Steady, isentropic, quasi-1D; no heat, work or elevation change.","Local only: M changes along the duct. M = 1 requires dA = 0.");
eq("workT","area",0,"Working equation: temperature",R`\frac{T_2}{T_1} = \frac{1 + \frac{\gamma-1}{2}M_1^2}{1 + \frac{\gamma-1}{2}M_2^2}`,
 [],"Temperature ratio between two states in adiabatic flow (with or without losses).","Adiabatic, no work, calorically perfect gas.","No entropy term: energy fixes Tₜ.");
eq("workp","area",1,"Working equation: pressure",R`\frac{p_2}{p_1} = \left[\frac{1 + \frac{\gamma-1}{2}M_1^2}{1 + \frac{\gamma-1}{2}M_2^2}\right]^{\frac{\gamma}{\gamma-1}}e^{-\Delta s/R}`,
 [],"Pressure ratio between two states with known Mach numbers and losses.","Adiabatic, no work, calorically perfect gas.","Δs must be supplied; the equation doesn't predict losses.");
eq("workA","area",1,"Working equation: area",R`\frac{A_2}{A_1} = \frac{M_1}{M_2}\left[\frac{1 + \frac{\gamma-1}{2}M_2^2}{1 + \frac{\gamma-1}{2}M_1^2}\right]^{\frac{\gamma+1}{2(\gamma-1)}}e^{\Delta s/R}`,
 [],"Area ratio between two states (HW 2 #2c: 0.763).","Adiabatic, no work, calorically perfect gas.","Positive exponent: losses increase the required area ratio.");
eq("aastar","area",1,"Area–Mach relation",R`\frac{A}{A^*} = \frac{1}{M}\left[\frac{2}{\gamma+1}\left(1 + \frac{\gamma-1}{2}M^2\right)\right]^{\frac{\gamma+1}{2(\gamma-1)}}`,
 [],"Mach number from an area ratio and the reverse; nozzle design and off-design.","Isentropic flow with a fixed A*.","Two roots for A/A* > 1: pick the branch from inlet conditions and geometry.","calc-isen");
eq("star","area",0,"Sonic reference ratios",R`\frac{T^*}{T_t} = \frac{2}{\gamma+1},\quad \frac{p^*}{p_t} = \left(\frac{2}{\gamma+1}\right)^{\frac{\gamma}{\gamma-1}},\quad \frac{\rho^*}{\rho_t} = \left(\frac{2}{\gamma+1}\right)^{\frac{1}{\gamma-1}}`,
 [],"Throat conditions of a choked nozzle.","Calorically perfect gas.","Air: 0.8333, 0.5283, 0.6339.");
eq("ptastar","area",1,"pₜA* invariant",R`p_{t1}A_1^* = p_{t2}A_2^*,\qquad \frac{A_2^*}{A_1^*} = e^{\Delta s/R}`,
 [],"Carrying the flow across a shock or other loss; locating a shock in a nozzle.","Adiabatic, no work, fixed ṁ and Tₜ.","A* grows when pₜ falls; the physical area across a thin shock does not change.");
eq("chain","area",0,"Area-ratio chain",R`\frac{A_2}{A_2^*} = \frac{A_2}{A_1}\cdot\frac{A_1}{A_1^*}\cdot\frac{A_1^*}{A_2^*}`,
 [],"Finding M₂ from M₁ and the geometry.","","The last factor is 1 for isentropic flow; across a loss it equals pₜ₂/pₜ₁.");
/* Ch 4 nozzles */
eq("pstar","noz",1,"Critical pressure ratio",R`\frac{p^*}{p_t} = \left(\frac{2}{\gamma+1}\right)^{\frac{\gamma}{\gamma-1}} = 0.5283\ (\gamma = 1.4),\qquad \frac{p_t}{p^*} = 1.893`,
 [],"Deciding whether a converging nozzle is choked.","Isentropic flow to the throat.","Not the back pressure at which a CD nozzle first chokes.","nozzle");
eq("fparam","noz",0,"Mass-flow parameter",R`\frac{\dot m}{A} = \frac{p_t}{\sqrt{T_t}}\sqrt{\frac{\gamma}{R}}\,M\left(1 + \frac{\gamma-1}{2}M^2\right)^{-\frac{\gamma+1}{2(\gamma-1)}}`,
 [],"Mass flux at any section given the stagnation state and M.","Isentropic from the stagnation state.","Peaks at M = 1, which is why a nozzle chokes.");
eq("mdotmax","noz",1,"Choked mass flow",R`\dot m_{max} = A^*\frac{p_t}{\sqrt{T_t}}\sqrt{\frac{\gamma}{R}}\left(\frac{2}{\gamma+1}\right)^{\frac{\gamma+1}{2(\gamma-1)}}`,
 [],"Mass flow through any choked throat. Air (SI): 0.0404 pₜA*/√Tₜ.","Choked throat; pₜ and Tₜ upstream of the throat.","Lowering back pressure can't raise it. Higher Tₜ lowers it.","nozzle");
eq("etan","noz",0,"Nozzle efficiency",R`\eta_n = \frac{V_2^2 - V_1^2}{V_{2s}^2 - V_1^2} = \frac{h_1 - h_2}{h_1 - h_{2s}}`,
 [[R`2s`,"isentropic exit at the same static pressure"]],
 "Comparing a real nozzle with an ideal one; actual exit speed V₂ ≈ √(2ηₙ(h₁ − h₂ₛ)).","Adiabatic, no work, same exit static pressure.","");
eq("diffuser","noz",0,"Diffuser performance",R`\eta_r = \frac{p_{t2}}{p_{t1}} = e^{-\Delta s/R},\qquad \eta_d = \frac{p_2 - p_1}{p_{2s} - p_1}`,
 [],"Total-pressure recovery and static-pressure-rise efficiency.","ηd compares actual and ideal at the same exit speed (h₂ = h₂ₛ).","The two measures answer different questions; don't swap them.");
/* Ch 5 normal shocks */
eq("rh","ns",1,"Normal-shock jump conditions",R`\rho_1V_1 = \rho_2V_2,\quad p_1 + \rho_1V_1^2 = p_2 + \rho_2V_2^2,\quad h_1 + \frac{V_1^2}{2} = h_2 + \frac{V_2^2}{2}`,
 [],"Any stationary normal shock; the starting point for the shock relations.","Shock-fixed frame, thin layer, no area change, heat or work across it.","Hold only in the frame where the shock is stationary.");
eq("nsmach","ns",0,"Jump conditions in Mach form",R`\frac{p_1M_1}{\sqrt{T_1}} = \frac{p_2M_2}{\sqrt{T_2}},\quad T_1\left(1 + \tfrac{\gamma-1}{2}M_1^2\right) = T_2\left(1 + \tfrac{\gamma-1}{2}M_2^2\right),\quad p_1(1 + \gamma M_1^2) = p_2(1 + \gamma M_2^2)`,
 [],"Deriving or checking shock relations.","Calorically perfect gas.","");
eq("nsm2","ns",1,"Downstream Mach number",R`M_2^2 = \frac{1 + \frac{\gamma-1}{2}M_1^2}{\gamma M_1^2 - \frac{\gamma-1}{2}} = \frac{M_1^2 + \frac{2}{\gamma-1}}{\frac{2\gamma}{\gamma-1}M_1^2 - 1}`,
 [],"M₂ from M₁ (normal shock, or the normal components of an oblique shock).","Calorically perfect gas.","For an oblique shock this gives M⊥₂, not the full M₂.","calc-ns");
eq("nsp","ns",1,"Static pressure ratio",R`\frac{p_2}{p_1} = 1 + \frac{2\gamma}{\gamma+1}(M_1^2 - 1) = \frac{2\gamma M_1^2 - (\gamma-1)}{\gamma+1}`,
 [],"Shock strength; inverting for M₁ from a pressure ratio (HW 4 #1).","","M₁ = 2 gives 4.5.","calc-ns");
eq("nsrho","ns",0,"Density and temperature ratios",R`\frac{\rho_2}{\rho_1} = \frac{V_1}{V_2} = \frac{(\gamma+1)M_1^2}{2 + (\gamma-1)M_1^2},\qquad \frac{T_2}{T_1} = \frac{p_2/p_1}{\rho_2/\rho_1}`,
 [],"Velocity and temperature changes across the shock.","","ρ₂/ρ₁ → (γ+1)/(γ−1) = 6 as M₁ → ∞.","calc-ns");
eq("nspt","ns",1,"Stagnation-pressure ratio and entropy",R`\frac{p_{t2}}{p_{t1}} = \frac{p_2}{p_1}\left[\frac{1 + \frac{\gamma-1}{2}M_2^2}{1 + \frac{\gamma-1}{2}M_1^2}\right]^{\frac{\gamma}{\gamma-1}},\qquad \Delta s = -R\ln\frac{p_{t2}}{p_{t1}}`,
 [],"Loss across a shock; inverting for M₁ in shock-in-nozzle problems.","Shock-fixed frame.","Static pressure rises while pₜ falls.","calc-ns");
eq("approd","ns",1,"Locating a shock from the exit",R`\frac{A_ep_e}{A_t\,p_{t1}} = \frac{A_ep_e}{A_e^*p_{te}} = \frac{1}{M_e}\left(\frac{2}{\gamma+1}\right)^{\frac{\gamma+1}{2(\gamma-1)}}\left(1 + \frac{\gamma-1}{2}M_e^2\right)^{-1/2}`,
 [],"Normal shock inside a CD nozzle when pₑ = p_b is known (subsonic exit).","Choked throat, isentropic before and after the shock.","Then pₜₑ/pₜ₁ = pₑ/(pₜ₁ · pₑ/pₜₑ) gives the shock's pₜ ratio, hence its M₁.","nozzle");
eq("start","tun",1,"Second-throat starting criterion (HW 3 #3)",R`\frac{A_2}{A_1} \ge \frac{A_2^*}{A_1^*} = \left(\frac{p_{t1}}{p_{t2}}\right)_{NS}\!(M_T),\qquad M_T:\ \frac{A_T}{A_1} = \left(\frac{A}{A^*}\right)_{\text{sup}}`,
 [[R`A_1`,"first throat"],[R`A_T`,"test section"],[R`A_2`,"second throat"],[R`M_T`,"test-section Mach number"]],
 "Smallest second throat that lets the starting normal shock pass through the test section.","Quasi-1D, isentropic except across one normal shock; the shock's worst position is the test section.",R`If \(A_2\) is smaller, the second throat chokes first and holds the shock where \(p_{t1}/p_{t2} = A_2/A_1\). After starting, \(A_2\) can be reduced toward \(A_1\).`,"tunnel");
/* Ch 5 moving shocks */
eq("galilean","mov",1,"Shock-frame transformation",R`V_1' = V_1 - V_s,\quad V_2' = V_2 - V_s,\quad M_1' = \frac{|V_1 - V_s|}{a_1}`,
 [[R`V_s`,"signed shock velocity (lab frame)"]],"Moving shocks: convert to the steady problem, solve, convert back.","Constant-speed planar shock between uniform states.","p, T, ρ and s are the same in both frames; V, M and stagnation properties are not.");
eq("htframe","mov",0,"Lab-frame energy jump",R`h_{t2} - h_{t1} = V_s(V_2 - V_1)`,
 [],"Stagnation enthalpy change seen by a stationary observer of a moving shock.","","hₜ is conserved only in the shock frame.");
eq("dva","mov",1,"Velocity jump",R`\frac{\Delta V}{a_1} = \frac{V_1' - V_2'}{a_1} = \frac{2(M_1'^2 - 1)}{(\gamma+1)M_1'}`,
 [],"Reflected shocks (ΔV = Vᵤ); any problem where the velocity change is known.","","Tabulated in Appendix B.");
eq("reflM","mov",1,"Reflected-shock Mach number",R`M_1' = \frac{\gamma+1}{4}\frac{V_u}{a_1} + \sqrt{1 + \left(\frac{\gamma+1}{4}\frac{V_u}{a_1}\right)^2},\qquad V_R = M_1'a_1 - V_u`,
 [[R`V_u`,"speed of the gas approaching the closed end"],[R`V_R`,"reflected-shock speed"]],
 "Shock reflecting from a closed end (gas brought to rest).","Rigid closed end; uniform incoming gas.","Uses the shock density relation, not an isentropic compression.");
/* Ch 5 oblique */
eq("oblnorm","obl",1,"Oblique shock components",R`M_{\perp1} = M_1\sin\theta,\qquad M_{\perp2} = M_2\sin(\theta - \delta),\qquad V_{\parallel1} = V_{\parallel2}`,
 [],"Turning an oblique shock into a normal-shock calculation.","Steady, planar.","Static ratios and pₜ₂/pₜ₁ use M⊥₁. pₜ/p on each side uses the full M.","calc-obl");
eq("tbm","obl",1,"θ–δ–M relation",R`\tan\delta = 2\cot\theta\,\frac{M_1^2\sin^2\theta - 1}{M_1^2(\gamma + \cos 2\theta) + 2}`,
 [[R`\theta`,"shock angle from the upstream flow"],[R`\delta`,"flow deflection"]],
 "Shock angle for a given wall turn, or deflection for a given shock angle.","Calorically perfect gas; straight attached shock.","Other texts write β for shock angle and θ for deflection. Two θ for δ < δmax; none above.","tbm");
eq("oblM2","obl",1,"Downstream Mach number (oblique)",R`M_2 = \frac{1}{\sin(\theta - \delta)}\sqrt{\frac{1 + \frac{\gamma-1}{2}M_1^2\sin^2\theta}{\gamma M_1^2\sin^2\theta - \frac{\gamma-1}{2}}}`,
 [],"Full downstream Mach number; checking whether a reflected shock is possible.","","Weak branch usually supersonic; strong branch subsonic.","calc-obl");
eq("thmin","obl",0,"Limiting shock angles",R`\theta_{min} = \mu = \sin^{-1}\frac{1}{M_1}\ (\text{Mach wave}),\qquad \theta = 90°\ (\text{normal shock})`,
 [],"Bounds on any compression-shock angle.","","δ = 0 at both limits.","tbm");
eq("pitot","obl",1,"Rayleigh Pitot relation",R`\frac{p_{t2}}{p_1} = \left(\frac{\gamma+1}{2}M_1^2\right)^{\frac{\gamma}{\gamma-1}}\left(\frac{\gamma+1}{2\gamma M_1^2 - (\gamma-1)}\right)^{\frac{1}{\gamma-1}}`,
 [[R`p_{t2}`,"Pitot reading behind the bow shock"],[R`p_1`,"freestream static pressure (separate tap)"]],
 "Supersonic Mach number from a Pitot probe.","Normal shock on the center streamline, isentropic deceleration after it.","Subsonic flow: use the isentropic pₜ/p relation instead.","calc-ns");
eq("inlet","obl",0,"Inlet total-pressure recovery",R`\frac{p_{t,out}}{p_{t,in}} = \prod_j\left(\frac{p_{t,after}}{p_{t,before}}\right)_j = \exp\!\left(-\frac{\sum_j\Delta s_j}{R}\right)`,
 [],"Multi-shock inlets; comparing shock systems.","Adiabatic.","Each stage uses its own local normal Mach number.");
/* Ch 6 */
eq("weak","pm",0,"Weak-wave scaling",R`\frac{\Delta s}{R} \approx \frac{2\gamma}{3(\gamma+1)^2}(M_1^2 - 1)^3,\qquad \delta \approx \frac{2\sqrt{M_1^2-1}}{M_1^2(\gamma+1)}\epsilon,\quad \epsilon = M_1^2\sin^2\theta - 1`,
 [],"Why smooth turns are isentropic: Δp/p = O(δ) but Δs/R = O(δ³).","Weak branch, fixed supersonic M₁.","Not uniform as M₁ → 1.");
eq("dnu","pm",0,"Infinitesimal turn",R`d\delta = \sqrt{M^2 - 1}\,\frac{dV}{V} = \frac{\sqrt{M^2-1}}{1 + \frac{\gamma-1}{2}M^2}\,\frac{dM}{M}`,
 [],R`Deriving \(\nu(M)\).`,"Steady 2D isentropic perfect-gas flow.","");
eq("pmfun","pm",1,"Prandtl–Meyer function",R`\nu(M) = \sqrt{\frac{\gamma+1}{\gamma-1}}\tan^{-1}\!\sqrt{\frac{\gamma-1}{\gamma+1}(M^2-1)} - \tan^{-1}\!\sqrt{M^2-1},\qquad \nu_{max} = \frac{\pi}{2}\left(\sqrt{\frac{\gamma+1}{\gamma-1}} - 1\right)`,
 [],R`Tabulated in Appendix A. \(\nu_{max} = 130.45°\) for γ = 1.4.`,R`Perfect gas; \(\nu(1) = 0\).`,"Returns radians if the arctangents do; tables are in degrees.","calc-pm");
eq("pmturn","pm",1,"Simple isentropic turn",R`\delta = \nu(M_2) - \nu(M_1),\qquad \frac{T_2}{T_1} = \frac{1 + \frac{\gamma-1}{2}M_1^2}{1 + \frac{\gamma-1}{2}M_2^2},\qquad \frac{p_2}{p_1} = \left(\frac{T_2}{T_1}\right)^{\frac{\gamma}{\gamma-1}}`,
 [],"Expansion around a convex corner; smooth compression before waves coalesce.","Isentropic; pₜ and Tₜ constant.","δ > 0 expansion, δ < 0 compression. A sharp compression corner needs an oblique shock instead.","corner");
eq("jetbc","ext",1,"Boundary conditions for external flows",R`\text{free boundary: } p = p_{amb};\qquad \text{wall or symmetry line: } \vec V \parallel \text{surface}`,
 [],"Building jet and airfoil wave patterns before calculating anything.","Inviscid, regular-reflection picture.","Free boundary reverses a wave's character on reflection; wall preserves it.","jet");
eq("plate","ext",1,"Flat plate in supersonic flow",R`L' = (p_3 - p_2)\,c\cos\alpha,\qquad D' = (p_3 - p_2)\,c\sin\alpha,\qquad L/D = \cot\alpha`,
 [[R`p_2`,"upper surface (after expansion)"],[R`p_3`,"lower surface (after shock)"],[R`c`,"chord"]],
 "Lift and wave drag per unit span.","Inviscid 2D; attached lower shock.","Upper: Prandtl–Meyer. Lower: oblique shock with δ = α. Keep the chord.");
eq("slip","ext",0,"Slip line conditions",R`p_4 = p_5,\qquad \vec V_4 \parallel \vec V_5`,
 [],"Trailing-edge matching of upper and lower streams.","","Speeds and entropies need not match.");

/* ---------------- Numeric problems for the mock exam (single answer) ---------------- */
const G = window.GD;
const RAIR = 287, GAM = 1.4, CPAIR = 1004.5;
const rnd = (a, b, step) => { const s = step || 1; return Math.round((a + Math.random() * (b - a)) / s) * s; };
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const f = (x, d) => Number(x).toLocaleString("en-US", { maximumFractionDigits: d == null ? 3 : d, minimumFractionDigits: 0 });

const NUM = [], NUMREF = {};
function num(id, t, mr, title, eqs, src, gen) { NUM.push({ id, t, mr: !!mr, title, gen }); NUMREF[id] = { eq: eqs, src }; }

num("n-R","thermo",0,"Specific gas constant",["eos"],"Reader §1.1.2; HW1 #1",()=>{
  const g = pick([["methane",16.04],["helium",4.003],["CO₂",44.01],["argon",39.95],["hydrogen",2.016],["nitrogen",28.01]]);
  const Rg = 8314/g[1];
  return { q:R`Find the specific gas constant of ${g[0]} (molar mass ${g[1]} kg/kmol).`, ans:Rg, unit:"J/(kg·K)",
    steps:[R`\(R = \hat R/M_w = 8314/${g[1]} = ${f(Rg,1)}\ \mathrm{J/(kg\,K)}\)`] };
});
num("n-dsheat","thermo",1,"Entropy change of a perfect gas",["ds"],"Reader §1.2.4",()=>{
  const T1 = rnd(280,400,10), T2 = rnd(450,900,10), p1 = rnd(100,300,10), p2 = rnd(150,800,10);
  const ds = CPAIR*Math.log(T2/T1) - RAIR*Math.log(p2/p1);
  return { q:R`Air (\(C_p = 1004.5\), \(R = 287\) J/(kg K)) goes from ${T1} K, ${p1} kPa to ${T2} K, ${p2} kPa. Find \(\Delta s\).`, ans:ds, unit:"J/(kg·K)", abs:1,
    steps:[R`\(\Delta s = C_p\ln(T_2/T_1) - R\ln(p_2/p_1)\)`,R`\(= 1004.5\ln(${f(T2/T1,4)}) - 287\ln(${f(p2/p1,4)}) = ${f(CPAIR*Math.log(T2/T1),1)} - ${f(RAIR*Math.log(p2/p1),1)} = ${f(ds,1)}\ \mathrm{J/(kg\,K)}\)`] };
});
num("n-sfee","rtt",0,"Adiabatic nozzle exit speed",["sfee"],"Reader §2.4.2",()=>{
  const T1 = rnd(500,1200,10), V1 = rnd(20,120,10), T2 = T1 - rnd(80,300,10);
  const V2 = Math.sqrt(V1*V1 + 2*CPAIR*(T1-T2));
  return { q:R`Air enters an adiabatic nozzle (no shaft work) at ${T1} K and ${V1} m/s and leaves at ${T2} K. Find the exit speed. Use \(C_p = 1004.5\ \mathrm{J/(kg\,K)}\).`, ans:V2, unit:"m/s",
    steps:[R`SFEE: \(h_1 + V_1^2/2 = h_2 + V_2^2/2\)`,R`\(V_2 = \sqrt{V_1^2 + 2C_p(T_1 - T_2)} = \sqrt{${V1}^2 + 2(1004.5)(${T1-T2})} = ${f(V2,1)}\) m/s`] };
});
num("n-tank","rtt",1,"Insulated tank filling",["tankfill","cvenergy"],"HW1 #2b",()=>{
  const T1 = rnd(280,320,5), T0 = rnd(280,400,10), k = pick([1.5,2,2.5,3]);
  const T2 = (GAM*T0*(k-1) + T1)/k;
  return { q:R`An insulated rigid tank of air at ${T1} K is filled from a large reservoir at ${T0} K until its mass is ${k} times the initial mass. Find the final uniform temperature (\(\gamma = 1.4\)).`, ans:T2, unit:"K",
    steps:[R`\(m_2c_vT_2 - m_1c_vT_1 = (m_2 - m_1)c_pT_0\)`,R`\(T_2 = \dfrac{\gamma T_0(m_2/m_1 - 1) + T_1}{m_2/m_1} = \dfrac{1.4(${T0})(${k-1}) + ${T1}}{${k}} = ${f(T2,1)}\) K`] };
});
num("n-isoduct","rtt",1,"Isothermal duct exit pressure",["mass","eos"],"HW1 #1a",()=>{
  const p1 = rnd(120,400,10), V1 = rnd(10,40,1), V2 = V1 + rnd(3,20,1), p2 = p1*V1/V2;
  return { q:R`Gas flows steadily and isothermally through a constant-area duct, accelerating from ${V1} m/s to ${V2} m/s. The inlet pressure is ${p1} kPa. Find the exit pressure.`, ans:p2, unit:"kPa",
    steps:[R`Continuity, constant A: \(\rho_2/\rho_1 = V_1/V_2 = ${f(V1/V2,4)}\)`,R`Isothermal ideal gas: \(p \propto \rho\), so \(p_2 = ${p1}(${f(V1/V2,4)}) = ${f(p2,1)}\) kPa`] };
});
num("n-rocket","ent",1,"Rocket velocity gain",["rocket"],"HW1 #3",()=>{
  const ms = rnd(200,800,50), mf = rnd(300,1500,50), vex = rnd(2,4.5,0.1), dv = vex*Math.log((ms+mf)/ms);
  return { q:R`A ${ms} kg spacecraft carries ${mf} kg of propellant and coasts in free space. Its engine expels exhaust at ${f(vex,1)} km/s relative to the rocket until the propellant is gone. Find its velocity gain.`, ans:dv, unit:"km/s",
    steps:[R`\(\Delta V = V_{ex}\ln(M_0/M_f) = ${f(vex,1)}\ln(${ms+mf}/${ms}) = ${f(dv,3)}\) km/s`] };
});
num("n-tt","stag",0,"Stagnation temperature",["tt"],"Reader §3.1.1",()=>{
  const T = rnd(220,500,5), V = rnd(150,900,10), Tt = T + V*V/(2*CPAIR);
  return { q:R`Air at a static temperature of ${T} K moves at ${V} m/s. Find its stagnation temperature (\(C_p = 1004.5\ \mathrm{J/(kg\,K)}\)).`, ans:Tt, unit:"K",
    steps:[R`\(T_t = T + V^2/(2C_p) = ${T} + ${V}^2/2009 = ${f(Tt,1)}\) K`] };
});
num("n-ds","stag",1,"Entropy rise from a stagnation-pressure loss",["ptloss"],"Reader §3.1.4; HW2 #2b",()=>{
  const r = rnd(0.55,0.98,0.01), gas = pick([["air",287],["CO₂",189],["helium",2077]]), ds = -gas[1]*Math.log(r);
  return { q:R`In adiabatic flow of ${gas[0]} (\(R = ${gas[1]}\ \mathrm{J/(kg\,K)}\)) with no shaft work, the stagnation pressure falls to ${f(r*100,0)}% of its upstream value. Find \(\Delta s\).`, ans:ds, unit:"J/(kg·K)",
    steps:[R`\(\Delta s = -R\ln(p_{t2}/p_{t1}) = -${gas[1]}\ln(${f(r,2)}) = ${f(ds,2)}\ \mathrm{J/(kg\,K)}\)`] };
});
num("n-mach","sound",0,"Mach number from speed and temperature",["a","mach"],"Reader §3.2.3; Reader §3.3",()=>{
  const T = rnd(200,350,5), V = rnd(150,800,10), a = Math.sqrt(GAM*RAIR*T), M = V/a;
  return { q:R`Air at ${T} K moves at ${V} m/s. Find the Mach number.`, ans:M, unit:"",
    steps:[R`\(a = \sqrt{\gamma RT} = \sqrt{1.4(287)(${T})} = ${f(a,1)}\) m/s`,R`\(M = V/a = ${f(M,4)}\)`] };
});
num("n-boom","sound",1,"Mach number from boom timing",["boom","muangle"],"HW2 #3a",()=>{
  const H = rnd(6,15,0.5), L = rnd(5,25,0.5), M = Math.sqrt(1+(L/H)**2);
  return { q:R`A supersonic aircraft at ${f(H,1)} km altitude passes directly over an observer. The boom reaches the observer when the aircraft has flown ${f(L,1)} km beyond the overhead point. Find its Mach number.`, ans:M, unit:"",
    steps:[R`\(\sin\mu = H/\sqrt{H^2+L^2} = 1/M\)`,R`\(M = \sqrt{1 + (L/H)^2} = \sqrt{1 + (${f(L,1)}/${f(H,1)})^2} = ${f(M,4)}\)`] };
});
num("n-isenp","area",1,"Static pressure from Mach number",["ptp"],"Reader §4.1.3; App. A",()=>{
  const pt = rnd(200,2000,50), M = rnd(0.3,3.5,0.05), p = pt*G.PT(M);
  return { q:R`Air (\(\gamma = 1.4\)) flows isentropically from a reservoir at \(p_t = ${pt}\) kPa. Find the static pressure where \(M = ${f(M,2)}\).`, ans:p, unit:"kPa",
    steps:[R`\(p/p_t = (1 + 0.2M^2)^{-3.5} = ${f(G.PT(M),5)}\)`,R`\(p = ${f(p,2)}\) kPa`] };
});
num("n-areaM","area",1,"Exit Mach number from area ratio",["aastar"],"Reader §4.6; Reader §4.9.1",()=>{
  const Ar = rnd(1.2,6,0.05), sup = Math.random() < 0.65, M = G.M_from_A(Ar, sup);
  return { q:R`A choked CD nozzle has \(A_e/A_t = ${f(Ar,2)}\). Find the exit Mach number on the <b>${sup ? "supersonic" : "subsonic"}</b> branch, isentropic flow, \(\gamma = 1.4\).`, ans:M, unit:"",
    steps:[R`Choked, isentropic: \(A_e/A^* = A_e/A_t = ${f(Ar,2)}\)`,R`Invert \(A/A^*\) on the ${sup ? "supersonic" : "subsonic"} branch: \(M_e = ${f(M,4)}\)`,R`(The other root is \(${f(G.M_from_A(Ar,!sup),4)}\).)`] };
});
num("n-diffuser","area",0,"Subsonic diffuser exit Mach number",["aastar","chain"],"Reader §4.7.1",()=>{
  const M1 = rnd(0.3,0.8,0.05), Ar = rnd(1.5,4,0.1), A2 = G.AA(M1)*Ar, M2 = G.M_from_A(A2,false);
  return { q:R`Air enters a diverging passage at \(M_1 = ${f(M1,2)}\), with \(A_2/A_1 = ${f(Ar,1)}\). Assuming isentropic flow, find \(M_2\).`, ans:M2, unit:"",
    steps:[R`\(A_1/A^* = ${f(G.AA(M1),5)}\)`,R`\(A_2/A^* = ${f(Ar,1)}(${f(G.AA(M1),5)}) = ${f(A2,5)}\)`,R`No throat, subsonic inlet: subsonic root \(M_2 = ${f(M2,4)}\)`] };
});
num("n-mdot","noz",1,"Choked mass flow",["mdotmax"],"Reader §4.8.2",()=>{
  const pt = rnd(200,3000,50), Tt = rnd(280,900,10), A = rnd(2,50,1);
  const m = G.mdotMax(pt*1000, Tt, A*1e-4);
  return { q:R`Air (\(\gamma = 1.4\), \(R = 287\)) at \(p_t = ${pt}\) kPa and \(T_t = ${Tt}\) K flows through a choked throat of ${A} cm². Find the mass flow rate.`, ans:m, unit:"kg/s",
    steps:[R`\(\dot m = A^*\dfrac{p_t}{\sqrt{T_t}}\sqrt{\gamma/R}\,(2/2.4)^{3} = 0.040418\,\dfrac{(${A}\times10^{-4})(${pt}\times10^3)}{\sqrt{${Tt}}}\)`,R`\(\dot m = ${f(m,4)}\) kg/s`] };
});
num("n-conv","noz",1,"Converging nozzle exit pressure",["pstar"],"Reader §4.8.1",()=>{
  const pt = rnd(150,800,10), pb = rnd(40,0.95*pt,5), crit = 0.52828*pt, pe = Math.max(pb, crit);
  return { q:R`A converging nozzle is fed from an air reservoir at ${pt} kPa and exhausts to a back pressure of ${f(pb,0)} kPa. Find the exit-plane static pressure.`, ans:pe, unit:"kPa",
    steps:[R`\(p^* = 0.5283\,p_t = ${f(crit,1)}\) kPa`,pb <= crit ? R`\(p_b \le p^*\): choked. The exit stays at \(p_e = p^* = ${f(crit,1)}\) kPa; the jet expands outside.` : R`\(p_b > p^*\): not choked, so the subsonic exit matches \(p_e = p_b = ${f(pb,1)}\) kPa.`] };
});
num("n-design","noz",1,"Design (third critical) back pressure",["aastar","ptp"],"Reader §4.9.1",()=>{
  const pt = rnd(100,2000,50), Ar = rnd(1.5,8,0.1), M = G.M_from_A(Ar,true), p = pt*G.PT(M);
  return { q:R`A CD nozzle with \(A_e/A_t = ${f(Ar,1)}\) is fed by air at \(p_t = ${pt}\) kPa. Find the design back pressure (isentropic supersonic exit).`, ans:p, unit:"kPa",
    steps:[R`Supersonic root of \(A/A^* = ${f(Ar,1)}\): \(M_e = ${f(M,4)}\)`,R`\(p_e/p_t = ${f(G.PT(M),5)}\), so \(p_b = ${f(p,2)}\) kPa`] };
});
num("n-first","noz",0,"First critical back pressure",["aastar","ptp"],"Reader §4.9.2",()=>{
  const pt = rnd(100,1000,50), Ar = rnd(1.3,5,0.1), M = G.M_from_A(Ar,false), p = pt*G.PT(M);
  return { q:R`A CD nozzle with \(A_e/A_t = ${f(Ar,1)}\) is fed by air at \(p_t = ${pt}\) kPa. Find the back pressure at which the throat first becomes sonic.`, ans:p, unit:"kPa",
    steps:[R`At first critical the diverging section is a subsonic diffuser: subsonic root of \(A/A^* = ${f(Ar,1)}\), \(M_e = ${f(M,4)}\)`,R`\(p_b = p_t\,(p/p_t)_e = ${pt}(${f(G.PT(M),5)}) = ${f(p,2)}\) kPa (not \(0.5283\,p_t\))`] };
});
num("n-nsp","ns",1,"Pressure behind a normal shock",["nsp"],"Reader §5.2.3; App. B",()=>{
  const M = rnd(1.2,4,0.05), p1 = rnd(10,150,5), s = G.ns(M);
  return { q:R`Air (\(\gamma = 1.4\)) at ${p1} kPa and \(M_1 = ${f(M,2)}\) crosses a normal shock. Find \(p_2\).`, ans:p1*s.p21, unit:"kPa",
    steps:[R`\(p_2/p_1 = 1 + \tfrac{2.8}{2.4}(M_1^2 - 1) = ${f(s.p21,4)}\)`,R`\(p_2 = ${f(p1*s.p21,2)}\) kPa`] };
});
num("n-nsm2","ns",0,"Downstream Mach number",["nsm2"],"Reader §5.2.2; App. B",()=>{
  const M = rnd(1.1,5,0.05), s = G.ns(M);
  return { q:R`Find the Mach number behind a normal shock in air with \(M_1 = ${f(M,2)}\).`, ans:s.M2, unit:"",
    steps:[R`\(M_2^2 = \dfrac{1 + 0.2M_1^2}{1.4M_1^2 - 0.2} = ${f(s.M2*s.M2,5)}\), so \(M_2 = ${f(s.M2,4)}\)`] };
});
num("n-nspt","ns",1,"Stagnation pressure after a normal shock",["nspt"],"Reader §5.3; App. B",()=>{
  const M = rnd(1.3,3.5,0.05), pt1 = rnd(200,1500,50), s = G.ns(M);
  return { q:R`Air flows at \(M_1 = ${f(M,2)}\) with \(p_{t1} = ${pt1}\) kPa into a normal shock. Find \(p_{t2}\).`, ans:pt1*s.pt21, unit:"kPa",
    steps:[R`\(p_{t2}/p_{t1}\) at \(M_1 = ${f(M,2)}\): \(${f(s.pt21,5)}\) (Appendix B)`,R`\(p_{t2} = ${f(pt1*s.pt21,2)}\) kPa`] };
});
num("n-second","ns",1,"Second critical back pressure",["aastar","nsp"],"Reader §5.4.1",()=>{
  const pt = rnd(100,1000,50), Ar = rnd(1.5,5,0.1), M = G.M_from_A(Ar,true), s = G.ns(M), p = pt*G.PT(M)*s.p21;
  return { q:R`A CD nozzle with \(A_e/A_t = ${f(Ar,1)}\) is fed by air at \(p_t = ${pt}\) kPa. Find the back pressure that holds a normal shock exactly at the exit.`, ans:p, unit:"kPa",
    steps:[R`Just upstream of the exit shock: \(M = ${f(M,4)}\), \(p/p_t = ${f(G.PT(M),5)}\)`,R`Across the shock: \(p_2/p_1 = ${f(s.p21,4)}\)`,R`\(p_b = ${pt}(${f(G.PT(M),5)})(${f(s.p21,4)}) = ${f(p,2)}\) kPa`] };
});
num("n-moving","mov",1,"Pressure behind a moving shock",["galilean","nsp"],"Reader §5.5.1",()=>{
  const T1 = rnd(270,320,1), p1 = rnd(80,110,0.5), Vs = rnd(400,900,10), a1 = Math.sqrt(GAM*RAIR*T1), M = Vs/a1, s = G.ns(M);
  return { q:R`A planar shock moves at ${Vs} m/s into still air at ${f(p1,1)} kPa and ${T1} K. Find the pressure behind it.`, ans:p1*s.p21, unit:"kPa",
    steps:[R`Shock frame: \(M_1' = V_s/a_1 = ${Vs}/${f(a1,2)} = ${f(M,4)}\)`,R`\(p_2/p_1 = ${f(s.p21,4)}\), so \(p_2 = ${f(p1*s.p21,2)}\) kPa`] };
});
num("n-reflect","mov",1,"Reflected-shock Mach number",["reflM","dva"],"Reader §5.6.1",()=>{
  const T1 = rnd(280,450,5), Vu = rnd(100,400,10), a1 = Math.sqrt(GAM*RAIR*T1), M = G.M1_from_dVa1(Vu/a1);
  return { q:R`Air at ${T1} K moving at ${Vu} m/s toward a closed end is brought to rest by a reflected shock. Find the reflected shock's Mach number relative to the gas ahead of it, \(M_1'\).`, ans:M, unit:"",
    steps:[R`\(a_1 = ${f(a1,2)}\) m/s, \(V_u/a_1 = ${f(Vu/a1,4)}\)`,R`\(M_1' = \tfrac{2.4}{4}\tfrac{V_u}{a_1} + \sqrt{1 + (\tfrac{2.4}{4}\tfrac{V_u}{a_1})^2} = ${f(M,4)}\)`] };
});
num("n-oblth","obl",1,"Oblique shock angle",["tbm"],"Reader §5.7.1; App. C",()=>{
  let M, d; do { M = rnd(1.6,4,0.1); d = rnd(4,0.8*G.deltaMax(M).delta,1); } while (!isFinite(G.thetaFromDelta(M,d)));
  const th = G.thetaFromDelta(M,d);
  return { q:R`Air at \(M_1 = ${f(M,1)}\) meets a ${d}° compression corner. Find the weak-branch shock angle \(\theta\).`, ans:th, unit:"°", abs:0.4,
    steps:[R`Solve \(\tan\delta = 2\cot\theta\,\dfrac{M_1^2\sin^2\theta - 1}{M_1^2(\gamma+\cos2\theta)+2}\) for the smaller \(\theta\) (or read Chart C.1)`,R`\(\theta = ${f(th,2)}°\) (strong branch: \(${f(G.thetaFromDelta(M,d,false),2)}°\))`] };
});
num("n-oblp","obl",1,"Pressure behind an oblique shock",["oblnorm","nsp","tbm"],"Reader §5.7.1",()=>{
  let M, d; do { M = rnd(1.8,4,0.1); d = rnd(5,0.75*G.deltaMax(M).delta,1); } while (!isFinite(G.thetaFromDelta(M,d)));
  const th = G.thetaFromDelta(M,d), o = G.oblique(M,th), p1 = rnd(20,100,5);
  return { q:R`Air at \(M_1 = ${f(M,1)}\) and ${p1} kPa is turned ${d}° by a wedge (weak shock). Find \(p_2\).`, ans:p1*o.p21, unit:"kPa",
    steps:[R`\(\theta = ${f(th,2)}°\)`,R`\(M_{\perp1} = M_1\sin\theta = ${f(o.Mn1,4)}\)`,R`\(p_2/p_1 = ${f(o.p21,4)}\), so \(p_2 = ${f(p1*o.p21,2)}\) kPa`] };
});
num("n-pitot","obl",1,"Mach number from a supersonic Pitot reading",["pitot"],"Reader §5.9",()=>{
  const M = rnd(1.3,3.5,0.05), r = G.ns(M).pt2p1;
  return { q:R`A Pitot probe in a supersonic air stream reads \(p_{t2}/p_1 = ${f(r,3)}\), where \(p_1\) comes from a static tap in the undisturbed flow. Find \(M_1\).`, ans:M, unit:"", abs:0.01,
    steps:[R`The probe reads \(p_{t2}\) behind a normal shock; use the Rayleigh Pitot relation or the \(p_{t2}/p_1\) column of Appendix B`,R`Supersonic solution: \(M_1 = ${f(M,3)}\)`] };
});
num("n-pm","pm",1,"Mach number after an expansion",["pmturn","pmfun"],"Reader §6.3; App. A",()=>{
  const M = rnd(1,3,0.05), d = rnd(5,30,1), r = G.pmTurn(M,d);
  return { q:R`Air at \(M_1 = ${f(M,2)}\) expands isentropically around a ${d}° convex corner. Find \(M_2\).`, ans:r.M2, unit:"",
    steps:[R`\(\nu_1 = \nu(${f(M,2)}) = ${f(r.nu1,3)}°\)`,R`\(\nu_2 = ${f(r.nu1,3)}° + ${d}° = ${f(r.nu2,3)}°\)`,R`\(M_2 = ${f(r.M2,4)}\)`] };
});
num("n-pmp","pm",0,"Pressure after a Prandtl–Meyer turn",["pmturn"],"Reader §6.3.3",()=>{
  const M = rnd(1.8,3,0.1), d = pick([-15,-10,-8,8,10,15,20]), p1 = rnd(20,200,10), r = G.pmTurn(M,d);
  return { q:R`Air at \(M_1 = ${f(M,1)}\) and ${p1} kPa turns ${d < 0 ? "smoothly through a " + (-d) + "° compression" : "through a " + d + "° expansion"} (isentropic). Find \(p_2\).`, ans:p1*r.p21, unit:"kPa",
    steps:[R`\(\nu_2 = ${f(r.nu1,3)}° ${d < 0 ? "-" : "+"} ${Math.abs(d)}° = ${f(r.nu2,3)}°\), so \(M_2 = ${f(r.M2,4)}\)`,R`\(p_2/p_1 = (p/p_t)_2/(p/p_t)_1 = ${f(r.p21,4)}\), so \(p_2 = ${f(p1*r.p21,2)}\) kPa`] };
});
num("n-plate","ext",1,"Flat-plate lift per unit span",["plate","pmturn","tbm"],"Reader §6.5.2",()=>{
  const M = rnd(1.6,3,0.1), a = pick([3,4,5,6,8]), p1 = rnd(20,80,5), c = rnd(0.5,3,0.5);
  const up = G.pmTurn(M,a), th = G.thetaFromDelta(M,a), lo = G.oblique(M,th), p2 = p1*up.p21, p3 = p1*lo.p21, L = (p3-p2)*1000*c*Math.cos(a*Math.PI/180);
  return { q:R`A flat plate of chord ${f(c,1)} m is at \(\alpha = ${a}°\) in air at \(M_1 = ${f(M,1)}\) and ${p1} kPa. Find the lift per unit span (shock–expansion theory).`, ans:L, unit:"N/m",
    steps:[R`Upper: \(\nu = ${f(up.nu1,3)}° + ${a}°\), \(M_2 = ${f(up.M2,4)}\), \(p_2 = ${f(p2,3)}\) kPa`,R`Lower: weak shock \(\theta = ${f(th,2)}°\), \(M_\perp = ${f(lo.Mn1,4)}\), \(p_3 = ${f(p3,3)}\) kPa`,R`\(L' = (p_3 - p_2)c\cos\alpha = (${f(p3-p2,3)}\times10^3)(${f(c,1)})\cos${a}° = ${f(L,0)}\) N/m`] };
});

num("n-throatA","noz",1,"Throat area from mass flow",["mdotmax"],"HW3 #2a; Reader §4.8.2",()=>{
  const pt = rnd(3,20,0.5), Tt = rnd(280,600,10), m = rnd(1,10,0.5), A = m/G.mdotMax(pt*1e5, Tt, 1)*1e4;
  return { q:R`A choked nozzle passes ${f(m,1)} kg/s of air (\(\gamma = 1.4\), \(R = 287\)) from a reservoir at ${f(pt,1)} bar and ${Tt} K. Find the throat area.`, ans:A, unit:"cm²",
    steps:[R`\(A_t = \dot m\sqrt{T_t}/(0.040418\,p_t) = ${f(m,1)}\sqrt{${Tt}}/(0.040418\times${f(pt*1e5,0)})\)`,R`\(A_t = ${f(A,3)}\ \mathrm{cm^2}\)`] };
});
num("n-shockA","ns",1,"Shock location from the pressure ahead of it",["ptp","aastar"],"HW3 #2a",()=>{
  const pt = rnd(5,20,0.5), M = rnd(1.3,2.6,0.05), px = Math.round(pt*G.PT(M)*100)/100, Mx = G.M_from_PT(px/pt), At = rnd(5,40,1), Ax = At*G.AA(Mx);
  return { q:R`A choked CD nozzle with a ${At} cm² throat is fed by air at \(p_t = ${f(pt,1)}\) bar. The static pressure just ahead of a normal shock in the diverging section is ${f(px,2)} bar. Find the area where the shock stands.`, ans:Ax, unit:"cm²",
    steps:[R`Isentropic up to the shock: \(p_x/p_t = ${f(px/pt,5)}\), supersonic branch, \(M_x = ${f(Mx,4)}\)`,R`\(A^* = A_t\) upstream of the shock, so \(A_x = ${At}\times(A/A^*)_{M_x} = ${At}\times${f(G.AA(Mx),4)} = ${f(Ax,3)}\ \mathrm{cm^2}\)`] };
});
num("n-start","tun",1,"Second-throat area needed to start a tunnel",["start","aastar","nspt"],"HW3 #3",()=>{
  const A1 = rnd(5,30,0.5), MT = rnd(1.5,3.5,0.1), AT = A1*G.AA(MT), A2 = A1/G.ns(MT).pt21;
  return { q:R`A supersonic wind tunnel has a ${f(A1,1)} cm² first throat and a ${f(AT,2)} cm² test section. Find the smallest second-throat area that lets it start (\(\gamma = 1.4\)).`, ans:A2, unit:"cm²",
    steps:[R`Test section: \(A_T/A_1 = ${f(AT/A1,4)}\), supersonic root \(M_T = ${f(MT,3)}\)`,R`Normal shock at \(M_T\): \(p_{t2}/p_{t1} = ${f(G.ns(MT).pt21,5)}\)`,R`\(A_2 \ge A_1\,p_{t1}/p_{t2} = ${f(A2,3)}\ \mathrm{cm^2}\)`] };
});

window.AAE = { TOPICS, MC, CARDS, EQ, NUM };
window.AAE_DEEP = DEEP;
window.AAE_NUMREF = NUMREF;
})();
