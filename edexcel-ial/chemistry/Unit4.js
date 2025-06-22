const CHEMISTRY_UNIT_4_CONTENT = `
# Unit 4: Rates, Equilibria and Further Organic Chemistry  

## 12\. Kinetics

### 12.1 Rate Concepts and Measurement

* Key terms:

  * Rate of reaction: Change in concentration of reactant/product per unit time  
  * Rate equation: Rate \= k\[A\]^m\[B\]^n where k is the rate constant  
  * Order: Power to which concentration is raised in rate equation  
  * Overall order: Sum of individual orders (m \+ n)  
  * Half-life: Time for concentration to halve  
  * Rate-determining step: Slowest step in a multi-step reaction  
* Experimental techniques:

  * Titration: Samples removed and titrated at intervals  
  * Colorimetry: Measuring color change as reaction proceeds  
  * Mass change: For reactions producing/consuming gases  
  * Gas volume: Measuring volume of gas evolved  
* Determining order:

  * Initial-rate method: Using different starting concentrations  
  * Half-life method: Constant half-life indicates first order  
  * Graphical methods:  
    * Zero order: \[A\] vs time is straight line  
    * First order: ln\[A\] vs time is straight line  
    * Second order: 1/\[A\] vs time is straight line

### 12.2 Reaction Mechanisms

* Reaction mechanisms from rate equations:

  * Rate-determining step contains species that appear in rate equation  
  * If rate \= k\[A\]\[B\], both A and B are in the rate-determining step  
  * If rate \= k\[A\]², either A reacts with itself or 2A react in the rate-determining step  
* SN1 and SN2 mechanisms:

  * SN1 (unimolecular):  
    * Rate \= k\[RX\] (first order)  
    * Rate-determining step: Formation of carbocation  
    * Common for tertiary halogenoalkanes  
  * SN2 (bimolecular):  
    * Rate \= k\[RX\]\[Nu\] (second order)  
    * One-step mechanism with transition state  
    * Common for primary halogenoalkanes

### 12.3 Activation Energy

* Arrhenius equation:

  * k \= Ae^(-Ea/RT)  
  * Taking natural logarithms: ln k \= ln A \- Ea/RT  
  * Plot of ln k vs 1/T gives straight line with gradient \-Ea/R  
* Catalysts:

  * Heterogeneous: Catalyst in different phase from reactants  
    * Provides surface for adsorption  
    * Weakens bonds in adsorbed molecules  
  * Homogeneous: Catalyst in same phase as reactants  
    * Forms intermediate species  
    * Example: Fe²⁺ catalyst in I⁻ \+ S₂O₈²⁻ reaction

## 13\. Entropy and Energetics

### 13.1 Entropy

* Definition:

  * Measure of disorder/randomness in a system  
  * Symbol: S, units: J K⁻¹ mol⁻¹  
* Entropy trends:

  * Increases with temperature  
  * Increases in state changes: solid → liquid → gas  
  * Perfect crystals at 0 K have zero entropy  
* Entropy changes:

  * Phase changes: ΔS positive for melting/boiling  
  * Dissolving: Usually positive (more disorder)  
  * Reactions: Depends on change in number of gas molecules  
* Total entropy change:

  * ΔS\_total \= ΔS\_system \+ ΔS\_surroundings  
  * ΔS\_surroundings \= \-ΔH/T  
  * Reaction is feasible when ΔS\_total is positive  
* Temperature effect:

  * Higher temperatures favor endothermic reactions (ΔS\_surroundings becomes less negative)

### 13.2 Lattice Energy

* Key terms:

  * Lattice energy: Energy released when one mole of ionic solid forms from gaseous ions  
  * Electron affinity: Energy change when an electron is added to a gaseous atom  
  * Atomization energy: Energy to form one mole of gaseous atoms from element  
* Born-Haber cycle:

  * Thermochemical cycle relating lattice energy to other energy terms  
  * Used to calculate lattice energy indirectly  
* Factors affecting lattice energy:

  * Ionic charge: Higher charge \= stronger attraction \= more negative lattice energy  
  * Ionic radius: Smaller radius \= stronger attraction \= more negative lattice energy  
* Covalent character:

  * Difference between experimental and theoretical lattice energy indicates covalent bonding  
  * Caused by polarization of anions by small, highly charged cations

### 13.3 Solution Energetics

* Key terms:

  * Enthalpy of solution: Energy change when one mole of solute dissolves  
  * Enthalpy of hydration: Energy released when one mole of gaseous ions are hydrated  
* Relation to lattice energy:

  * ΔH\_solution \= ΔH\_lattice \+ ΔH\_hydration  
  * Solubility depends on balance between these terms  
* Factors affecting solubility:

  * More negative hydration enthalpies favor solubility  
  * Less negative lattice energies favor solubility

## 14\. Chemical Equilibria

### 14.1 Equilibrium Constants

* Equilibrium constant expressions:

  * K\_c: In terms of concentrations (mol dm⁻³)  
    * For reaction aA \+ bB ⇌ cC \+ dD  
    * K\_c \= \[C\]^c\[D\]^d / \[A\]^a\[B\]^b  
  * K\_p: In terms of partial pressures (atm)  
    * K\_p \= (p\_C)^c(p\_D)^d / (p\_A)^a(p\_B)^b  
* Units:

  * Depend on overall change in number of moles  
  * If Δn \= 0, K\_c has no units  
  * If Δn ≠ 0, K\_c has units (mol dm⁻³)^Δn  
* Heterogeneous equilibria:

  * Pure solids and liquids omitted from equilibrium expressions

### 14.2 Equilibrium Position

* Effect of changes on equilibrium:

  * Concentration/pressure: Position changes to oppose change  
  * Temperature:  
    * Exothermic reaction: K decreases with temperature  
    * Endothermic reaction: K increases with temperature  
  * Catalyst: No effect on position, only on rate  
* Relation to entropy:

  * ΔS\_total \= R ln K  
  * Larger K means more positive ΔS\_total  
* Predicting extent of reaction:

  * Large K: Reaction goes almost to completion  
  * Small K: Reaction barely proceeds  
  * K ≈ 1: Significant amounts of all species present

## 15\. Acid-base Equilibria

### 15.1 Acid-Base Theories

* Brønsted-Lowry theory:  
  * Acid: Proton (H⁺) donor  
  * Base: Proton (H⁺) acceptor  
  * Conjugate pairs:  
    * Acid loses H⁺ to form conjugate base  
    * Base gains H⁺ to form conjugate acid

### 15.2 pH and Acid Strength

* pH definition:

  * pH \= \-log₁₀\[H⁺\]  
  * \[H⁺\] \= 10⁻ᵖᴴ  
  * At 25°C: pH 7 is neutral, \<7 is acidic, \>7 is alkaline  
* Strong vs. weak acids:

  * Strong acid: Completely dissociated in water (e.g., HCl, HNO₃, H₂SO₄)  
  * Weak acid: Partially dissociated in water (e.g., CH₃COOH, HF)  
* Acid dissociation constant (K\_a):

  * For HA ⇌ H⁺ \+ A⁻  
  * K\_a \= \[H⁺\]\[A⁻\]/\[HA\]  
  * pK\_a \= \-log₁₀(K\_a)  
  * Larger K\_a indicates stronger acid  
* pH calculations:

  * Strong acid: pH \= \-log₁₀\[acid\]  
  * Weak acid: pH \= ½(pK\_a \- log₁₀\[acid\])

### 15.3 Water and Bases

* Ionic product of water (K\_w):

  * H₂O ⇌ H⁺ \+ OH⁻  
  * K\_w \= \[H⁺\]\[OH⁻\] \= 1.0 × 10⁻¹⁴ at 25°C  
  * pK\_w \= 14 at 25°C  
* pH of strong bases:

  * pOH \= \-log₁₀\[OH⁻\]  
  * pH \= 14 \- pOH

### 15.4 Titrations and Indicators

* Titration curves:

  * Strong acid \+ strong base:  
    * Steep change at equivalence point  
    * pH 7 at equivalence point  
  * Weak acid \+ strong base:  
    * Less steep change  
    * pH \> 7 at equivalence point  
  * Strong acid \+ weak base:  
    * Less steep change  
    * pH \< 7 at equivalence point  
  * Weak acid \+ weak base:  
    * Very gradual change  
    * pH depends on relative strengths  
* Indicators:

  * Change color over specific pH range  
  * Should change color at equivalence point  
  * Selection based on titration curve

### 15.5 Buffer Solutions

* Definition:

  * Resists pH change when small amounts of acid/base added  
  * Contains weak acid and its salt, or weak base and its salt  
* Mechanism of action:

  * Added H⁺ reacts with conjugate base  
  * Added OH⁻ reacts with weak acid  
* pH calculation:

  * Henderson-Hasselbalch equation: pH \= pK\_a \+ log₁₀(\[salt\]/\[acid\])  
* Applications:

  * Biological systems: Blood, cellular fluids  
  * Food preservation: Prevent pH changes  
  * Pharmaceuticals: Maintain drug stability

## 16\. Organic Chemistry: Carbonyls, Carboxylic Acids and Chirality

### 16.1 Chirality

* Chiral center (asymmetric carbon):

  * Carbon bonded to four different groups  
  * Creates non-superimposable mirror images (enantiomers)  
* Optical isomerism:

  * Optical activity: Ability to rotate plane-polarized light  
  * Enantiomers:  
    * Identical physical and chemical properties (except with other chiral molecules)  
    * Rotate plane-polarized light in opposite directions  
  * Racemic mixture:  
    * Equal mixture of enantiomers  
    * Optically inactive (rotations cancel out)  
* Importance in mechanisms:

  * SN1: Tends to form racemic mixtures (carbocation intermediate)  
  * SN2: Inversion of configuration at carbon

### 16.2 Carbonyl Compounds (Aldehydes and Ketones)

* Structure:

  * Contain C=O (carbonyl) group  
  * Aldehydes: Carbonyl at end of chain (-CHO)  
  * Ketones: Carbonyl within chain (R-CO-R')  
* Physical properties:

  * No hydrogen bonding between molecules  
  * Lower boiling points than alcohols of similar mass  
  * More soluble in water than hydrocarbons (can form H-bonds with water)  
* Reactions:

  * Oxidation test:  
    * Aldehydes reduce Fehling's/Benedict's solution (blue to brick-red)  
    * Aldehydes reduce Tollens' reagent (silver mirror)  
    * Aldehydes oxidized by K₂Cr₂O₇/H₂SO₄ (orange to green)  
    * Ketones do not undergo these reactions  
  * Reduction:  
    * With LiAlH₄: Aldehydes → primary alcohols, ketones → secondary alcohols  
  * Nucleophilic addition:  
    * With HCN/KCN: Forms hydroxynitriles (cyanohydrins)  
    * Mechanism: CN⁻ attacks δ⁺ carbon of carbonyl  
  * With 2,4-dinitrophenylhydrazine (2,4-DNPH):  
    * Forms orange/yellow precipitate  
    * Confirms presence of carbonyl group  
  * Iodoform test:  
    * Methyl ketones and ethanal react with I₂/NaOH  
    * Forms yellow precipitate of CHI₃  
    * Test for CH₃CO- group

### 16.3 Carboxylic Acids

* Structure:

  * Contain \-COOH group  
  * Form dimers through hydrogen bonding  
* Physical properties:

  * Higher boiling points due to extensive hydrogen bonding  
  * Soluble in water (smaller molecules)  
* Preparation:

  * Oxidation of alcohols or aldehydes  
  * Hydrolysis of nitriles  
* Reactions:

  * Reduction: With LiAlH₄ → primary alcohols  
  * Salt formation: With bases → carboxylate salts  
  * With PCl₅: Forms acyl chlorides  
  * Esterification: With alcohols \+ acid catalyst → esters

### 16.4 Carboxylic Acid Derivatives

* Acyl chlorides:

  * Highly reactive  
  * React with:  
    * Water → carboxylic acids  
    * Alcohols → esters  
    * Ammonia → amides  
    * Amines → substituted amides  
* Esters:

  * Formed from acid \+ alcohol with H⁺ catalyst  
  * Hydrolysis:  
    * Acid hydrolysis: Acid \+ alcohol  
    * Alkaline hydrolysis (saponification): Carboxylate salt \+ alcohol  
* Polyesters:

  * Formed by condensation polymerization  
  * Dicarboxylic acid \+ diol  
  * Example: Terylene (PET)

### 16.5 Spectroscopy and Chromatography

* Mass spectrometry:

  * Accurate masses to 4 decimal places  
  * Fragmentation patterns aid identification  
* NMR spectroscopy:

  * Carbon-13 NMR:  
    * Different carbon environments give different peaks  
    * Chemical shift (δ) value indicates environment  
  * Proton (¹H) NMR:  
    * Chemical shift indicates proton environment  
    * Peak area proportional to number of protons  
    * Splitting pattern shows adjacent protons ((n+1) rule)  
* Chromatography:

  * Paper/TLC:  
    * R\_f value \= distance moved by spot / distance moved by solvent  
  * HPLC/GC:  
    * Column chromatography techniques  
    * Separate based on retention time  
    * Often coupled with mass spectrometry  
    * Applications in forensics, drug testing
`;