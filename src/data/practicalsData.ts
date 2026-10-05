import { FormLevel, SciencePractical } from '../types/curriculum';

export const SCIENCE_PRACTICALS: SciencePractical[] = [
  // --- PHYSICS PRACTICALS ---
  {
    id: 'phys-form1-pendulum',
    subject: 'Physics',
    form: 'Form 1',
    title: 'Determination of Acceleration Due to Gravity (g) Using a Simple Pendulum',
    aim: 'To determine the acceleration due to gravity (g) at the laboratory location using a simple pendulum.',
    safetyRules: [
      'Ensure the retort stand is placed securely on a stable flat bench.',
      'Displace the pendulum bob with a small angle (less than 10°) to maintain simple harmonic motion approximations.',
      'Keep your line of sight in front of the fiducial mark to avoid parallax errors when counting oscillations.',
    ],
    apparatus: [
      'Pendulum bob with small hook',
      'Inextensible thread (approx. 120 cm)',
      'Retort stand, boss, and clamp',
      'Two small wooden or cork pads',
      'Metre rule (0 - 100 cm, precision 1 mm)',
      'Digital stopwatch (precision 0.01 s)',
      'Split cork / optical pin fiducial marker',
    ],
    procedure: [
      'Clamp the thread firmly between the two small wooden pads attached to the retort clamp so that length l can be adjusted.',
      'Measure the length l of the pendulum from the suspension point to the center of the bob using the metre rule (start with l = 100 cm = 1.0 m).',
      'Place an optical pin directly behind the resting bob as a reference fiducial marker.',
      'Displace the bob through a small horizontal angle (θ < 10°) and gently release it from rest.',
      'Start the stopwatch as the bob passes the fiducial point. Count 20 complete oscillations.',
      'Record the time t₁ for 20 oscillations. Repeat for t₂ and compute the mean time t.',
      'Calculate the period T = t / 20 and compute T² (s²).',
      'Repeat the procedure for lengths l = 90 cm, 80 cm, 70 cm, 60 cm, and 50 cm.',
      'Plot a graph of l (vertical axis) against T² (horizontal axis).',
    ],
    expectedObservations:
      'As the length l of the pendulum decreases, the time required for 20 oscillations decreases steadily. The graph of l versus T² gives a straight line passing through the origin (0,0).',
    resultsFormula:
      'T = 2π√(l / g)  ⇒  T² = (4π² / g) × l  ⇒  Gradient S = Δl / ΔT² = g / 4π²  ⇒  g = 4π² × S (m/s²)',
    sampleDataTable: {
      headers: ['Length l (m)', 'Time t₁ for 20 osc (s)', 'Time t₂ (s)', 'Mean time t (s)', 'Period T (s)', 'T² (s²)'],
      rows: [
        [1.00, 40.2, 40.0, 40.10, 2.005, 4.02],
        [0.90, 38.1, 38.3, 38.20, 1.910, 3.65],
        [0.80, 35.8, 36.0, 35.90, 1.795, 3.22],
        [0.70, 33.5, 33.7, 33.60, 1.680, 2.82],
        [0.60, 31.0, 31.2, 31.10, 1.555, 2.42],
        [0.50, 28.3, 28.5, 28.40, 1.420, 2.02],
      ],
    },
    conclusion:
      'The acceleration due to gravity g at the laboratory was determined to be approximately 9.80 m/s², which closely agrees with the standard theoretical value of 9.81 m/s² within experimental limits.',
    discussionQuestions: [
      {
        q: 'Why should the angle of displacement be small (less than 10°)?',
        a: 'Because the derivation of the simple pendulum formula relies on the small-angle approximation sin(θ) ≈ θ (in radians). For large angles, the motion ceases to be purely simple harmonic.',
      },
      {
        q: 'State two precautions taken in this experiment to ensure accurate timing.',
        a: '1. Using a fiducial marker placed at the equilibrium position to count oscillations accurately.\n2. Timing 20 oscillations instead of 1 to minimize human reaction time errors.',
      },
    ],
    nectaExamTip: 'Always calculate gradient using two widely separated points on your best-fit line. Never use original data points unless they lie exactly on the line.',
  },
  {
    id: 'phys-form3-hooke',
    subject: 'Physics',
    form: 'Form 3',
    title: 'Verification of Hooke’s Law and Determination of Spring Constant',
    aim: 'To verify Hooke’s Law for a helical spring and determine its spring constant (k).',
    safetyRules: [
      'Do not overload the spring beyond its elastic limit, otherwise permanent deformation occurs.',
      'Place safety cushions on the floor beneath the slotted masses.',
    ],
    apparatus: [
      'Helical steel spring with pointer',
      'Retort stand and clamp',
      'Vertical metre rule (0 - 100 cm)',
      'Set of slotted masses (50 g each, up to 300 g)',
      'Scale pan / mass hanger (50 g)',
    ],
    procedure: [
      'Suspend the helical spring from the clamp of the retort stand.',
      'Attach a horizontal pointer to the lower end of the spring and align the vertical metre rule beside it.',
      'Note the initial position pointer reading against the ruler with only the empty mass hanger attached (call this x₀).',
      'Add a mass of 50 g (0.49 N) to the hanger. Allow the spring to come to rest and record the new pointer reading x.',
      'Calculate the extension e = x - x₀ (cm or m).',
      'Add successive 50 g masses up to 300 g, recording the pointer reading for each load.',
      'Gradually remove the masses one by one, recording the pointer readings during unloading to ensure elasticity was preserved.',
      'Plot a graph of Load F (N) on the vertical axis against Extension e (m) on the horizontal axis.',
    ],
    expectedObservations:
      'The pointer reading increases linearly as masses are added. When unloaded, the pointer returns to the initial reading x₀, showing elastic recovery.',
    resultsFormula: 'F = k × e  ⇒  Gradient of F versus e gives Spring Constant k = ΔF / Δe (in N/m).',
    conclusion:
      'Hooke’s Law was verified because the extension produced was directly proportional to the applied stretching force within the elastic limit. The spring constant k was determined to be 25.0 N/m.',
    discussionQuestions: [
      {
        q: 'What is meant by the elastic limit of a material?',
        a: 'The maximum load or force that a material can withstand without undergoing permanent plastic deformation upon release of the force.',
      },
    ],
    nectaExamTip: 'Remember that weight F = m × g. Convert grams to kilograms first before multiplying by g (9.8 or 10 N/kg as instructed).',
  },
  {
    id: 'phys-form4-optics-refraction',
    subject: 'Physics',
    form: 'Form 4',
    title: 'Determination of Refractive Index of a Rectangular Glass Block',
    aim: 'To verify Snell’s Law of Refraction and determine the refractive index of a rectangular glass block using optical pins.',
    safetyRules: [
      'Handle the glass block carefully to avoid chipping or breaking.',
      'Push optical pins vertically into the drawing board without bending them.',
    ],
    apparatus: [
      'Rectangular glass block',
      'Drawing board and four thumb pins',
      'Four optical pins',
      'Protractor and 30 cm ruler',
      'White drawing sheet and sharp pencil',
    ],
    procedure: [
      'Fix the white sheet of paper on the wooden drawing board using the thumb pins.',
      'Place the rectangular glass block in the center and trace its boundary ABCD with a sharp pencil.',
      'Remove the glass block. Draw a normal line NN’ at point O on AB and construct an incident ray making an angle of incidence i = 30° to the normal.',
      'Fix two optical pins P₁ and P₂ vertically along the incident ray about 5 cm apart.',
      'Replace the glass block precisely within its outline ABCD.',
      'Look through the opposite face CD of the glass block with one eye closed. Position two other pins P₃ and P₄ so that they appear in a straight line with images of P₁ and P₂.',
      'Remove the block and pins. Draw the emergent ray through P₃ and P₄, and join O to the point of emergence O’ to form the refracted ray.',
      'Measure the angle of refraction r using a protractor.',
      'Repeat the experiment for angles of incidence i = 40°, 50°, 60°, and 70°.',
      'Calculate sin(i) and sin(r), and plot sin(i) against sin(r).',
    ],
    expectedObservations:
      'As light travels from air into the denser glass block, it bends towards the normal (r < i). The ratio sin(i) / sin(r) remains constant.',
    resultsFormula: 'Snell’s Law: n = sin(i) / sin(r)  ⇒  Gradient S of sin(i) vs sin(r) = n (Refractive Index).',
    conclusion:
      'Snell’s Law was verified. The refractive index of the rectangular glass block was found to be n = 1.52, matching standard crown glass.',
    discussionQuestions: [
      {
        q: 'Why should optical pins P₁ and P₂ be placed at least 5 cm apart?',
        a: 'To minimize directional parallax errors when sighting the ray path.',
      },
    ],
    nectaExamTip: 'Ensure all pin prick holes are neatly encircled with pencil. In NECTA practical exams, your actual drawing paper must be submitted with the answer booklet!',
  },

  // --- CHEMISTRY PRACTICALS ---
  {
    id: 'chem-form3-titration-acid-base',
    subject: 'Chemistry',
    form: 'Form 3',
    title: 'Volumetric Analysis: Standardization of Hydrochloric Acid Using Standard Sodium Carbonate Solution',
    aim: 'To determine the concentration (molarity) of an unknown dilute hydrochloric acid solution (Solution A) by titrating it against standard 0.05 M anhydrous sodium carbonate solution (Solution B).',
    safetyRules: [
      'Wear safety goggles and a laboratory coat at all times.',
      'Use a pipette filler; NEVER pipette acid or base solutions by mouth.',
      'Rinse the burette with acid solution and pipette with base solution before filling.',
      'Clean any acid spills on the bench immediately with moist cloth and water.',
    ],
    apparatus: [
      '50 cm³ Burette and burette stand with clamp',
      '20 cm³ or 25 cm³ Pipette and pipette filler',
      'Three 250 cm³ Conical flasks',
      'Filter funnel and white tile',
      'Standard 0.05 M Na₂CO₃ solution (Solution B)',
      'Hydrochloric acid of unknown concentration (Solution A)',
      'Methyl orange indicator solution',
      'Wash bottle with distilled water',
    ],
    procedure: [
      'Rinse the burette with distilled water, then with a small volume of Solution A (HCl).',
      'Fill the burette with Solution A to slightly above the 0.00 cm³ mark, adjust the meniscus to 0.00 cm³, and ensure no air bubble is trapped in the burette tip.',
      'Rinse the pipette with distilled water, then with Solution B (Na₂CO₃).',
      'Pipette accurately 25.0 cm³ of Solution B into a clean 250 cm³ conical flask.',
      'Add 2 to 3 drops of methyl orange indicator into the conical flask. The solution turns golden yellow.',
      'Place the conical flask on the white tile beneath the burette tip.',
      'Titrate by adding Solution A dropwise with continuous gentle swirling until the color changes sharply from yellow to faint orange/pink (the end point).',
      'Record the final burette reading in the titration table to 2 decimal places.',
      'Perform one trial (rough) titration followed by two or three accurate titrations until concordant titers (differing by no more than ± 0.10 cm³) are obtained.',
      'Calculate the average titer volume from concordant readings.',
    ],
    expectedObservations:
      'The initial solution in the conical flask with methyl orange is yellow. As the end point is reached, one single drop turns the solution permanently faint orange/pink.',
    resultsFormula:
      'Reaction: Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂\nMole Ratio: n(HCl) / n(Na₂CO₃) = 2 / 1\nFormula: (M_A × V_A) / (M_B × V_B) = 2 / 1  ⇒  M_A = (2 × M_B × V_B) / V_A (mol/dm³)',
    sampleDataTable: {
      headers: ['Titration', 'Final Reading (cm³)', 'Initial Reading (cm³)', 'Titre Volume (cm³)'],
      rows: [
        ['Rough', '24.80', '0.00', '24.80'],
        ['1st Accurate', '24.10', '0.00', '24.10'],
        ['2nd Accurate', '48.20', '24.10', '24.10'],
        ['3rd Accurate', '24.15', '0.00', '24.15'],
      ],
    },
    conclusion:
      'The average volume of Solution A used was 24.10 cm³. The concentration of hydrochloric acid was calculated to be 0.104 M (mol/dm³).',
    discussionQuestions: [
      {
        q: 'Why is phenolphthalein NOT the best indicator for this titration?',
        a: 'Phenolphthalein changes color around pH 8.3 when only half the sodium carbonate has reacted to form sodium hydrogencarbonate (NaHCO₃). Methyl orange changes at pH 3.1 - 4.4, which marks the complete reaction to CO₂ and H₂O.',
      },
      {
        q: 'Why should the conical flask be placed on a white tile?',
        a: 'To provide a clear, neutral white background for spotting the sharp color transition at the end point.',
      },
    ],
    nectaExamTip: 'Always record burette readings to two decimal places, where the second decimal place is either 0 or 5 (e.g. 24.10, 24.15 cm³). Never omit units!',
  },
  {
    id: 'chem-form4-qualitative-analysis',
    subject: 'Chemistry',
    form: 'Form 4',
    title: 'Qualitative Analysis: Identification of Cations and Anions in an Unknown Salt Sample',
    aim: 'To identify the cation and anion present in the unknown salt sample S using standard systematic wet chemical tests.',
    safetyRules: [
      'Add reagents dropwise first, then in excess; do not rush.',
      'When heating test tubes, point the mouth of the tube away from yourself and others.',
      'Smell gases gently by wafting vapor towards your nose; never inhale directly.',
    ],
    apparatus: [
      'Test tube rack and 6 clean test tubes',
      'Test tube holder and Bunsen burner',
      'Dropping pipettes and spatula',
      'Unknown solid sample S (e.g., Copper(II) Sulphate crystals)',
      'Reagents: 2M NaOH, 2M NH₄OH (aq), BaCl₂ (aq), dilute HNO₃, AgNO₃ (aq)',
    ],
    procedure: [
      'Appearance: Observe the physical state, color, and odor of solid sample S.',
      'Solubility: Place a spatulaful of sample S in a test tube, add 5 cm³ of distilled water, and shake vigorously.',
      'Action of Heat: Heat a small spatula-end of dry sample S in a dry test tube and observe any color change or gas evolved.',
      'Test for Cations: Divide the aqueous solution of S into two portions:\n  - Portion 1: Add dilute NaOH dropwise until in excess.\n  - Portion 2: Add aqueous NH₃ dropwise until in excess.',
      'Test for Anions: To a third portion of solution S, add dilute HNO₃ followed by BaCl₂ solution.',
    ],
    expectedObservations:
      'Sample S is a blue crystalline solid. Dissolves completely in water to give a clear blue solution.\nWith NaOH: Pale blue precipitate insoluble in excess.\nWith NH₃: Pale blue precipitate which dissolves in excess to form an intense deep blue solution.\nWith BaCl₂: Dense white precipitate that does not dissolve in dilute nitric acid.',
    resultsFormula:
      'Cation: Cu²⁺ + 2OH⁻ → Cu(OH)₂ (s) [Blue ppt]\nCu(OH)₂ + 4NH₃ → [Cu(NH₃)₄]²⁺ + 2OH⁻ [Deep blue complex ion]\nAnion: Ba²⁺ + SO₄²⁻ → BaSO₄ (s) [White ppt insoluble in acid]',
    conclusion:
      'Based on the experimental observations, the unknown salt sample S contains the Copper(II) cation (Cu²⁺) and the Sulphate anion (SO₄²⁻), confirming sample S is Copper(II) Sulphate (CuSO₄).',
    discussionQuestions: [
      {
        q: 'Why was dilute nitric acid added before barium chloride in the sulphate test?',
        a: 'To eliminate interfering carbonate (CO₃²⁻) or sulphite (SO₃²⁻) ions which also form white precipitates with barium ions.',
      },
    ],
    nectaExamTip: 'Use standard NECTA reporting format: Table with three columns titled "Test", "Observation", and "Inference".',
  },

  // --- BIOLOGY PRACTICALS ---
  {
    id: 'bio-form2-food-tests',
    subject: 'Biology',
    form: 'Form 2',
    title: 'Food Tests: Identification of Food Substances in Food Solution X',
    aim: 'To investigate the presence of reducing sugars, non-reducing sugars, starch, proteins, and lipids in a provided biological food sample X.',
    safetyRules: [
      'Always use a boiling water bath when heating mixtures with Benedict’s solution; never heat directly over a naked Bunsen flame.',
      'Handle concentrated hydrochloric acid and sodium hydroxide pellets/solution with extreme caution.',
      'Wear safety glasses to protect eyes from hot liquid splatters.',
    ],
    apparatus: [
      'Food solution sample X (extract from maize / bean flour / milk)',
      'Test tubes, test tube rack, and wooden holder',
      'Water bath with boiling water and Bunsen burner',
      'Iodine solution in potassium iodide',
      'Benedict’s solution',
      'Dilute Hydrochloric acid (1M HCl) and Sodium hydrogen carbonate powder (NaHCO₃)',
      '10% Sodium hydroxide solution (NaOH) and 1% Copper(II) sulphate solution (CuSO₄) [Biuret reagent]',
      'Ethanol (95%) and cold distilled water [Emulsion test]',
      'Filter paper for grease spot test',
    ],
    procedure: [
      'Test for Starch: Place 2 cm³ of solution X in a test tube. Add 3 drops of iodine solution. Observe and record color.',
      'Test for Reducing Sugars: Add 2 cm³ of solution X to 2 cm³ of Benedict’s solution. Heat the mixture in a boiling water bath for 5 minutes. Observe color sequence.',
      'Test for Non-reducing Sugars: Add 1 cm³ of dilute HCl to 2 cm³ of solution X. Boil for 2 minutes in water bath to hydrolyze sucrose. Cool, neutralize with NaHCO₃ until fizzing stops. Add 2 cm³ of Benedict’s solution and re-boil for 5 minutes.',
      'Test for Proteins (Biuret Test): Add 2 cm³ of solution X to 2 cm³ of 10% NaOH. Add 3 drops of 1% CuSO₄ without shaking. Observe color at interface.',
      'Test for Lipids (Ethanol Emulsion): Add 2 cm³ of solution X to 3 cm³ of ethanol. Shake thoroughly to dissolve lipids. Decant the clear liquid into a tube with cold distilled water.',
    ],
    expectedObservations:
      'Starch: Solution turns blue-black.\nReducing sugars: Color changes from blue → green → yellow → orange → brick-red precipitate.\nProteins: Solution turns purple / violet.\nLipids: A cloudy white emulsion forms on top of water.',
    resultsFormula: 'Visual colorimetric observation tables according to standard biological reagent reactions.',
    conclusion:
      'Food sample X contains starch, reducing sugars, and proteins, but lipids were absent. This indicates sample X is nutrient-rich cereal or legume flour.',
    discussionQuestions: [
      {
        q: 'What is the role of hydrochloric acid in testing for non-reducing sugars?',
        a: 'Hydrochloric acid hydrolyzes complex disaccharides like sucrose into their constituent reducing monosaccharides (glucose and fructose).',
      },
      {
        q: 'Why must sodium hydrogen carbonate be added before adding Benedict’s solution in the non-reducing sugar test?',
        a: 'Benedict’s reagent requires an alkaline environment to reduce copper(II) ions to copper(I) oxide. The acid must be neutralized first.',
      },
    ],
    nectaExamTip: 'Do not simply write "it became red". Always specify "a brick-red precipitate formed" to earn full observation marks in CSEE Biology Paper 2.',
  },
  {
    id: 'bio-form3-osmosis-potato',
    subject: 'Biology',
    form: 'Form 3',
    title: 'Investigation of Osmosis Using Living Plant Tissue (Potato Cylinders)',
    aim: 'To investigate the effect of different sucrose concentrations on the mass and length of potato tissue cylinders.',
    safetyRules: [
      'Take care when cutting potato cylinders using the cork borer and scalpel blade on the chopping tile.',
      'Always cut downwards onto the cutting tile, never towards your hands.',
    ],
    apparatus: [
      'Large fresh Irish potato tuber',
      'Cork borer (diameter 8 mm)',
      'Sharp scalpel blade and ceramic cutting tile',
      '30 cm ruler with millimeter markings',
      'Electronic balance (precision 0.01 g)',
      'Six boiling tubes or beakers labeled A to F',
      'Sucrose solutions: 0.0 M (distilled water), 0.2 M, 0.4 M, 0.6 M, 0.8 M, 1.0 M',
      'Blotting filter paper and stopwatch',
    ],
    procedure: [
      'Using the cork borer, punch out six uniform cylinders from the potato tuber.',
      'Cut off the potato peel at the ends and trim all cylinders to exactly 50 mm (5.0 cm) in length.',
      'Blot each cylinder gently on filter paper to remove excess surface moisture, and weigh each on the electronic balance. Record the initial mass m₁.',
      'Place one cylinder into each of the six labeled beakers containing the respective sucrose solutions.',
      'Leave the cylinders submerged undisturbed for 60 minutes.',
      'Remove the cylinders, blot lightly with filter paper, and measure their final length and final mass m₂.',
      'Calculate the percentage change in mass: % change = [(m₂ - m₁) / m₁] × 100.',
      'Plot a graph of percentage change in mass against sucrose concentration.',
    ],
    expectedObservations:
      'In distilled water and 0.2 M solution, the cylinders gain mass and become turgid and firm. In high sucrose concentrations (0.6 M - 1.0 M), the cylinders lose mass, shrink in length, and become soft and flaccid.',
    resultsFormula:
      '% Change in Mass = [(Final Mass - Initial Mass) / Initial Mass] × 100\nIsotonic point: The sucrose concentration where % change in mass is zero (graph crosses horizontal axis).',
    conclusion:
      'Water moved into the potato cells by osmosis when external water potential was higher (hypotonic), and moved out when external water potential was lower (hypertonic). The isotonic concentration of the potato cell sap was found to be 0.35 M.',
    discussionQuestions: [
      {
        q: 'Why was it necessary to blot the potato cylinders before weighing?',
        a: 'To remove surface solution droplets which would artificially increase the measured mass without representing internal cell water.',
      },
    ],
    nectaExamTip: 'In your graph, the point where the line intersects the x-axis (0% mass change) represents the exact solute concentration of the plant cell sap.',
  },
];
