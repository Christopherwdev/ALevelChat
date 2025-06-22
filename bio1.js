const syllabus = {
            'Biology': {
                'units': {
                    1: {
                        'title': 'Biological Molecules',
                        'chapters': [
                            {
                                'title': 'Chapter 1: The Importance of Water',
                                'sections': [
                                    { 'title': '1.1 Water Structure and Properties', 'content': 'Water is a polar molecule due to its bent shape and the electronegativity difference between oxygen and hydrogen. This polarity leads to hydrogen bonding between water molecules. Key properties include high specific heat capacity, high latent heat of vaporisation, cohesion, adhesion, and solvent properties. These properties are vital for life, e.g., temperature regulation, transport in plants, and as a medium for metabolic reactions.' },
                                    { 'title': '1.2 Biological Significance of Water', 'content': 'Water acts as a solvent for ionic and polar molecules, facilitating transport in blood and sap. Its high specific heat capacity helps regulate body temperature and aquatic environments. High latent heat of vaporisation allows cooling through sweating/transpiration. Cohesion and adhesion are crucial for water transport in xylem. Its incompressibility provides support in hydrostatic skeletons.' }
                                ]
                            },
                            {
                                'title': 'Carbohydrates',
                                'sections': [
                                    { 'title': '2.1 Monosaccharides and Disaccharides', 'content': 'Monosaccharides are simple sugars like glucose, fructose, and galactose. They are reducing sugars. Disaccharides are formed from two monosaccharides via a glycosidic bond (condensation reaction), e.g., maltose (glucose+glucose), sucrose (glucose+fructose), lactose (glucose+galactose). Non-reducing sugars like sucrose do not reduce Benedict\'s reagent.' },
                                    { 'title': '2.2 Polysaccharides', 'content': 'Polysaccharides are large polymers of monosaccharides. Starch (amylose and amylopectin) and glycogen are energy storage polysaccharides in plants and animals respectively. Cellulose is a structural polysaccharide in plant cell walls. Starch and glycogen are branched and compact, while cellulose forms strong, unbranched microfibrils due to beta-glucose linkages.' }
                                ]
                            }
                        ]
                    },
                    2: { /* ... Biology Unit 2 content ... */ },
                    // Add more units as needed
                }
            },
            'Chemistry': {
                'units': {
                    1: {
                        'title': 'Structure, Bonding and Periodicity',
                        'chapters': [
                            {
                                'title': 'Atomic Structure',
                                'sections': [
                                    { 'title': '1.1 Subatomic Particles', 'content': 'Atoms consist of protons, neutrons, and electrons. Protons and neutrons are in the nucleus, while electrons orbit the nucleus in energy shells. Protons have a relative mass of 1 and charge of +1. Neutrons have a relative mass of 1 and no charge. Electrons have a negligible mass and charge of -1.' },
                                    { 'title': '1.2 Isotopes', 'content': 'Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons. They have the same chemical properties but different physical properties (e.g., mass). Relative atomic mass is the weighted average of the masses of its isotopes.' }
                                ]
                            },
                            {
                                'title': 'Ionic Bonding',
                                'sections': [
                                    { 'title': '2.1 Formation of Ionic Bonds', 'content': 'Ionic bonds form between metals and non-metals through the transfer of electrons, creating oppositely charged ions. Electrostatic forces of attraction hold these ions together in a giant ionic lattice structure.' },
                                    { 'title': '2.2 Properties of Ionic Compounds', 'content': 'Ionic compounds typically have high melting and boiling points due to strong electrostatic forces. They conduct electricity when molten or in aqueous solution (ions are mobile) but not when solid. They are often soluble in polar solvents like water.' }
                                ]
                            },
                            {
                                'title': 'Covalent Bonding',
                                'sections': [
                                    { 'title': '3.1 Formation of Covalent Bonds', 'content': 'Covalent bonds form between non-metal atoms through the sharing of electron pairs. This sharing allows atoms to achieve a stable outer electron shell. Can be single, double, or triple bonds.' },
                                    { 'title': '3.2 Simple Molecular Structures', 'content': 'Substances with simple molecular structures (e.g., H2O, CO2) have strong covalent bonds within molecules but weak intermolecular forces between molecules. This results in low melting/boiling points, poor electrical conductivity, and varying solubility.' },
                                    { 'title': '3.3 Giant Covalent Structures', 'content': 'Giant covalent structures (e.g., diamond, graphite, silicon dioxide) have all atoms held together by strong covalent bonds in a vast network. This leads to very high melting points, hardness (diamond), and insolubility. Graphite is an exception, conducting electricity due to delocalised electrons.' }
                                ]
                            },
                            {
                                'title': 'Metallic Bonding',
                                'sections': [
                                    { 'title': '4.1 Structure of Metals', 'content': 'Metals consist of a lattice of positive metal ions (cations) surrounded by a sea of delocalised electrons. The delocalised electrons are not associated with any particular atom and are free to move throughout the structure.' },
                                    { 'title': '4.2 Properties of Metals', 'content': 'The sea of delocalised electrons accounts for typical metallic properties: good electrical and thermal conductivity (free electrons), malleability and ductility (ions can slide over each other without disrupting the metallic bond), and high melting/boiling points (strong electrostatic attraction between positive ions and delocalised electrons).' }
                                ]
                            }
                        ]
                    },
                    2: { /* ... Chemistry Unit 2 content ... */ },
                    // Add more units as needed
                }
            },
            'Physics': {
                'units': {
                    1: {
                        'title': 'Mechanics and Materials',
                        'chapters': [
                            {
                                'title': 'Motion',
                                'sections': [
                                    { 'title': '1.1 Displacement, Velocity, Acceleration', 'content': 'Displacement is the vector distance from a fixed point. Velocity is the rate of change of displacement (vector). Acceleration is the rate of change of velocity (vector). Equations of motion (SUVAT equations) can be used for constant acceleration.' },
                                    { 'title': '1.2 Graphs of Motion', 'content': 'Displacement-time graphs: gradient is velocity. Velocity-time graphs: gradient is acceleration, area under graph is displacement. Acceleration-time graphs: area under graph is change in velocity.' }
                                ]
                            },
                            {
                                'title': 'Forces and Newton\'s Laws',
                                'sections': [
                                    { 'title': '2.1 Newton\'s Laws of Motion', 'content': 'Newton\'s First Law: An object remains at rest or in uniform motion unless acted upon by a resultant force. Second Law: The resultant force on an object is directly proportional to the rate of change of its momentum (F=ma). Third Law: If object A exerts a force on object B, then object B exerts an equal and opposite force on object A.' },
                                    { 'title': '2.2 Free-Body Diagrams and Equilibrium', 'content': 'Free-body diagrams show all forces acting on an object. An object is in equilibrium if the resultant force acting on it is zero, meaning it is either at rest or moving at a constant velocity.' }
                                ]
                            }
                        ]
                    },
                    2: { /* ... Physics Unit 2 content ... */ },
                    // Add more units as needed
                }
            }
        };