// Script v3: Translates ALL remaining 60 nodes that still have bio_en===bio
// Run: node add_en_v3.js

const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'data.js');
const raw = fs.readFileSync(filePath, 'utf8');
const i = raw.indexOf('{');
const j = raw.lastIndexOf('}');
const data = JSON.parse(raw.slice(i, j + 1));

// ── Extended group translation map ────────────────────────────────────────
const GROUP_EN = {
  "Organizaciones de Divulgación": "Disclosure Organisations",
  "Marco Legislativo": "Legislative Framework",
  "Empresas Privadas UAP": "Private UAP Companies",
  "Contratistas de Defensa": "Defence Contractors",
  "Agencias de Inteligencia": "Intelligence Agencies",
  "Programas Gubernamentales": "Government Programs",
  "Incidentes Nucleares": "Nuclear Incidents",
  "Audiencias y Divulgación": "Hearings & Disclosure",
  "Contacto y Testigos Civiles": "Contact & Civilian Witnesses",
  "Avistamientos Militares": "Military Sightings",
  "Crashes y Recuperaciones": "Crashes & Recoveries",
  "Canales": "Channels",
};

// ── Full translations for each remaining node ─────────────────────────────
const V3 = {

  // ── Lote #395–#425 (personas nuevas) + nodos previos aún sin traducir ──
  "richard_doty": {
    role_en: "AFOSI Counterintelligence and Disinformation",
    bio_en: "Year of his testimony in the corpus: 2026 (Area52 / DEBRIEFED ep.100).\n\nWho he is: A former AFOSI counterintelligence agent (U.S. Air Force Office of Special Investigations), as widely cited as he is controversial for his role in disinformation operations.\n\nWhat he claims: He describes a USAF sergeant allegedly abducted and surveilled in a multi-department sting operation —his most convincing witness, he says—, a DIA branch dedicated to investigating abductions, the Air Force paying informants, surveillance of UFO conventions, a recovered object that supposedly ended up in a mine shaft, and monks who would communicate with non-humans. He closes with his famous game of 'three stories, one is a lie'.\n\nRelevance: He embodies the central problem of the file: the blurry line between testimony, intelligence operation and deliberate disinformation."
  },
  "julia_mossbridge": {
    role_en: "Precognition and 'Inner Disclosure'",
    bio_en: "Year of her testimony in the corpus: 2026 (Area52 / DEBRIEFED ep.99).\n\nWho she is: A PhD researcher of precognition and consciousness, author of 'Have a Nice Disclosure'.\n\nWhat she brings: She recounts fragmented childhood memories of 'tests' she was allegedly subjected to and frames it as an 'inner disclosure'. She discusses the GATE program, types of mental and informational 'time travel', predictive-physiology experiments (the body gets aroused before winning), the thesis that 'information is mind', and interpersonal synchronization (blinking, breathing).\n\nRelevance: She provides the science-of-consciousness angle: she insists the phenomenon demands studying consciousness, not just 'race cars in the sky'."
  },
  "mario_woods": {
    role_en: "The November 5th Encounter",
    bio_en: "Year of his testimony in the corpus: 2026 (Area52 / DEBRIEFED ep.94; the encounter he describes happened in the 1970s).\n\nWho he is: A USAF security veteran and experiencer.\n\nWhat he describes: A close encounter while on duty on a November 5th: a huge craft, beings of differing heights, 45 seconds of blinding white light inside his vehicle, missing time (he woke at 6:15 with no explanation) and a later interrogation at 'November control' where he was made to write a full report. He also recounts an intrusion into his bedroom as a child and the weight of his Christian faith.\n\nRelevance: A detailed military testimony of a close encounter with missing time and an internal silencing protocol."
  },
  "roy_teague": {
    role_en: "A Police Inspector Investigates UFOs",
    bio_en: "Year of the key case: 1993 (object radar-tracked at ~28,800 mph).\n\nWho he is: A serving British police inspector (27 years of service, West Midlands), author of 'Close Encounters of the Police Kind'.\n\nWhat he brings: He collects testimonies from British officers about sightings. He opens with a 1993 case at a missile-detection radar station —an object that covered ~640 miles in 80 seconds, after which operators were ordered 'this didn't happen, you don't talk about it'—. He explains his methodology: 'gold standard' in-person interviews, reading non-verbal communication, cross-checking police databases and Flightradar/astronomy apps, and the stigma that stops police and military from reporting.\n\nRelevance: He brings police investigative rigor and the problem of institutional stigma in UAP reporting."
  },
  "jeffrey_mishlove": {
    role_en: "Parapsychology and Consciousness",
    bio_en: "Year of his testimony in the corpus: 2026 (Jesse Michels / American Alchemy).\n\nWho he is: A PhD parapsychologist, host of 'New Thinking Allowed'.\n\nWhat he brings: Cases such as Ted Owens, 'the PK Man' who allegedly predicted mass sightings and supposedly 'foretold' the Challenger disaster, and Ingo Swann and remote viewing. He tells how he won Robert Bigelow's essay contest on the survival of consciousness after death, and explores synchronicity, contemplative traditions and a view of consciousness as a whole coming to know itself.\n\nRelevance: He links the phenomenon with parapsychology, remote viewing and the survival of consciousness."
  },
  "brandon_fugal": {
    role_en: "The Owner of Skinwalker Ranch",
    bio_en: "Year of his testimony in the corpus: 2026 (Jesse Michels / American Alchemy).\n\nWho he is: A real-estate magnate and owner of Skinwalker Ranch; he calls himself a 'steward' rather than owner.\n\nWhat he describes: He breaks his silence about the ranch phenomenon: equipment tampering, acute medical episodes, wolf-like creatures that would survive gunshots, the Navajo 'curse' over the mesa that crosses the property, the 'cosmic zoo' hypothesis (intelligences monitoring us), an aggressive drilling operation he suspects was a cover, and spiritual experiments (a rabbi whose chants would open 'portals').\n\nRelevance: He gives a first-hand voice to the most famous paranormal/UFO epicenter in the corpus, Skinwalker Ranch."
  },
  "jordan_jozak": {
    role_en: "The Boy from the Program",
    bio_en: "Testimony given: 2026 (exclusive interview with American Alchemy / Jesse Michels).\n\nWho he is: A witness who claims to have been recruited as a child into a classified UAP program. He describes being pulled out of the public school system for years and placed in a 'gate classroom', subjected to experiments involving a sedative 'pink drink'.\n\nThe breaking point (January 2023): After surviving a suicide attempt, his memories began to break through as traumatic, PTSD-like flashbacks. He describes the experience as 'Jason Bourne meets Stranger Things'.\n\nThe exploited ability: shifting his consciousness into UAP craft and piloting them with thought —a mind-machine interface—; the program's goal was allegedly to digitize his brain signals to create a reproducible neural interface. He also mentions a 'reliquary': a crystal orb that seemed conscious and adapted its internal structure when observed.\n\nHow to treat it: Extraordinary and impossible-to-verify material; it connects UAP technology with consciousness. Testimony on the record."
  },
  "aldo_rebelo": {
    role_en: "Former Defense Minister of Brazil",
    bio_en: "Position: Former Defense Minister of Brazil (2015–2016) and presidential candidate, with decades at the center of Brazilian power.\n\nHis acknowledgment: In a conversation with American Alchemy (Jesse Michels), he explicitly acknowledged that the UAP phenomenon is real — the highest-ranking official (equivalent to a Secretary of Defense) to go that far in public acknowledgment.\n\nColares and Operation Prato (1977): He validated the 'Chupa-Chupa' attacks in Colares, Pará, where luminous objects fired beams of light at hundreds of villagers, causing burns and anemia, officially investigated by the Brazilian Air Force in Operation Prato.\n\nVarginha (1996): He claimed that something landed, that creatures with oily skin and red eyes were recovered, and that at least one was treated by a neurosurgeon — making Varginha one of the most institutionally validated cases in the corpus.\n\nCommitment: To open Brazil's archives if the U.S. opens its own."
  },
  "desclasificacion_pursue_war_gov_ufo": {
    name_en: "PURSUE Declassification (war.gov/UFO)",
    role_en: "The U.S. Officially Opens Its UAP Archives (2026)",
    group_en: "Hearings & Disclosure",
    bio_en: "Event Description: On May 8, 2026, by direct order of President Donald Trump, the U.S. Department of War (the former Department of Defense, renamed by the executive) launched war.gov/UFO, the official portal of the PURSUE program (Presidential Unsealing and Reporting System for UAP Encounters). It is a multi-agency effort to locate, review, identify, declassify and progressively release the historical records and documents on Unidentified Anomalous Phenomena (UAP) held by the federal government.\n\nWhat was released: The first batch included reports, photographs, videos, witness accounts, military files, astronaut transcripts and other historical materials linked to unresolved sightings and investigations, with dates ranging from 1944–1945 to recent years. The administration announced that more files would be added 'on an ongoing basis'.\n\nSignificance and relevance: For the first time a government like the U.S. recognizes the phenomenon as a legitimate category of public communication and declassifies the material through an official, permanent channel. It marks a structural shift after decades of denial and disinformation: it institutionalizes disclosure and moves the pressure from individual testimony (Grusch, the Congressional hearings) to the documentary transparency of the State itself. Even so, the research community keeps an open debate —'data alone is not disclosure'— about whether this is a real opening or a partial, controlled release."
  },
  "disclosure_forum_2026": {
    role_en: "Humanity at the Edge of Discovery",
    group_en: "Hearings & Disclosure",
    bio_en: "The Event: In June 2026, the Disclosure Foundation gathered physicists, historians, economists, intelligence professionals, legislators, educators and journalists for more than seven hours in the historic Kennedy Caucus Room of the U.S. Senate.\n\nWhat was revealed: There was no dramatic Grusch-style revelation nor official admission of recovered non-human technology. But it was acknowledged that decisive UAP data is still withheld by the USAF, the CIA and the DOE: former intelligence director John Ratcliffe confirmed the existence of never-released UAP satellite data, and neither the data on underwater UAP nor the analyses of the hundreds of annual military sightings received by AARO have been made public.\n\nThe scientific debate: Physicists discussed wormholes, extra dimensions and faster-than-light propulsion as explanatory frameworks for the phenomenon.\n\nThe real headline (according to Richard Dolan): The forum offered no new evidence, but it showed a cultural shift: disclosure has become institutionalized, moving from a researchers' gathering to a policy conference in Washington, with the phenomenon almost taken for granted — the field's deepest turn in a decade.\n\nRelevance: Alongside the launch of war.gov/UFO, it is one of the two faces of the 2026 institutional awakening."
  },
  "colares_para_1977": {
    name_en: "Colares, Pará 1977",
    role_en: "The 'Chupa-Chupa' and Operation Prato",
    group_en: "Contact & Civilian Witnesses",
    bio_en: "Event Description: Between 1977 and 1978, the island of Colares and the Pará region (northern Brazil) experienced a wave of encounters known as the 'Chupa-Chupa': luminous objects that descended at night and projected beams of light onto the inhabitants, causing burns, marks and, in several cases, blood extraction and anemia. Hundreds of villagers were affected.\n\nThe official investigation: Amid the alarm, the Brazilian Air Force opened Operation Prato (Operação Prato), led by Captain Uyrangê Hollanda, which collected photographs, reports and testimonies; much of the material remained classified for decades.\n\nRelevance: It is one of the best state-documented cases of physical contact, vindicated in 2026 by former Defense Minister Aldo Rebelo."
  },

  // ── Roles (subtítulos) que faltaban por traducir ──────────────────────
  "kevin_knuth":            { role_en: "The Physicist Who Quantified the Tic Tac's Impossibility" },
  "almirante_thomas_wilson":{ role_en: "The DIA Deputy Director Who Was Denied Access" },
  "edgar_mitchell":         { role_en: "The Apollo 14 Astronaut, Keeper of the Wilson-Davis Memo" },
  "john_e_mack":            { role_en: "The Harvard Psychiatrist Who Paid for Taking Abductions Seriously" },
  "anna_paulina_luna":      { role_en: "The Congresswoman Who Coordinated the Trump Declassification" },
  "eric_burlison":          { role_en: "The Legislator Who Brought Grusch On as a Congressional Advisor" },
  "kirsan_ilyumzhinov":     { role_en: "The Sitting Leader Who Declared 'I Was Invited by Aliens'" },
  "haim_eshed":             { role_en: "The Israeli General Who Spoke of the 'Galactic Federation'" },
  "nick_pope":              { role_en: "The British MoD's 'Real X-Files Agent'" },
  "russell_targ":           { role_en: "The Laser Physicist Who Co-Founded Remote Viewing at Stanford" },
  "roberto_pinotti":        { role_en: "The Dean of Italian Ufology and the 1933 Magenta Case" },
  "tim_phillips":           { role_en: "Kirkpatrick's Successor at the Head of AARO" },

  // ── People (fixed typos in v1) ─────────────────────────────────────────
  "harald_malmgren": {
    bio_en: "Year of Death and Public Legacy: 2023 (Death); 2017–2023 (Period of his most specific UAP statements).\n\nProfessional Background: High-level economist and geopolitical analyst with exceptional credentials. He served as Special Assistant to President Lyndon B. Johnson and as U.S. Deputy Trade Representative. Malmgren was a prominent international consultant whose clients included foreign governments and multinational corporations. His deep experience at the intersection of politics, economics and national security, together with his access to top governmental circles for decades, positioned him as an unusual and well-connected information source in the later years of his life.\n\nKey Publications & Statements: Although not a central public figure in ufology, Malmgren came to prominence within the community after researcher Richard Dolan revealed private conversations with him. According to Dolan, Malmgren claimed to have first-hand knowledge — through his high-level intelligence contacts — that the UAP phenomenon was absolutely real and of non-human origin. Specifically, Malmgren allegedly stated that a 'mothership' of enormous dimensions was located in the solar system and that several world powers, including the U.S., Russia and China, were aware of its presence. His statements, filtered through Dolan, carried significant weight due to his credible track record in matters of state.\n\nMedia Appearances: Harald Malmgren did not give extensive public interviews on the UAP topic. His impact occurred almost entirely through his private communications with Richard Dolan."
  },

  // ── Events (fixed typos in v2) ──────────────────────────────────────────
  "levelland_texas": {
    name_en: "Levelland, Texas",
    role_en: "Eleven Cars Stalled by the Same Object",
    bio_en: "Event Description: On the night of November 2–3, 1957, a wave of vehicle-stalling incidents was reported near Levelland, Texas. Over approximately four hours, at least eleven separate drivers reported their vehicles' engines dying and headlights failing as they approached a luminous egg-shaped object sitting on or near the road. When the object departed, vehicles restarted spontaneously.\n\nKey Features: The incidents were reported by independent witnesses who had no contact with each other, all describing the same sequence: engine failure on approach, object departure, spontaneous restart. The electromagnetic interference pattern was consistent across all reports.\n\nInstitutional Response: Project Blue Book investigated and attributed the incidents to ball lightning and electrical storms, despite no storm being reported that night. Sheriff Weir Clem personally witnessed an object, but his account was also minimised.\n\nRelevance: Levelland 1957 is the classic case for electromagnetic effects of UAPs on vehicle systems — a pattern that appears repeatedly in the global incident record and that constitutes one of the most physically verifiable interactions between UAPs and human technology."
  },

  "hanford_nuclear_reservation": {
    name_en: "Hanford Nuclear Reservation",
    role_en: "UFOs Over the Plutonium",
    bio_en: "Event Description: From the late 1940s, personnel at the Hanford Site in Washington State — the primary U.S. facility for plutonium production for nuclear weapons — reported multiple encounters with unidentified aerial objects. The Hanford Site contained the largest concentration of nuclear reactors and plutonium processing facilities in the Western hemisphere during the Cold War.\n\nDocumented Incidents: Multiple reports from Hanford security personnel and site workers from 1945 to the 1970s described objects with extraordinary flight characteristics over the reactor complexes. Some of these reports were routed through the Atomic Energy Commission (AEC) rather than the USAF, which accounts for their relative obscurity compared to military cases.\n\nRelevance: Hanford incidents are part of the broader pattern of UAP activity specifically concentrated around nuclear production and storage facilities — a pattern that spans Malmstrom, Rendlesham, the 1975 USAF base wave, and Hanford itself. The consistent association of UAPs with nuclear sites, whether weapons storage or production, is one of the most statistically significant patterns in the global UAP incident record."
  },

  // ── Agencies / Programs (all with Spanish bio_en) ───────────────────────
  "to_the_stars_academy_ttsa": {
    name_en: "To The Stars Academy (TTSA)",
    role_en: "The Trojan Horse of Disclosure",
    group_en: "Disclosure Organisations",
    bio_en: "Origins and Structure: To The Stars Academy of Arts and Science (TTSA) was founded in October 2017 by musician Tom DeLonge (Blink-182), together with a board of former officials including Luis Elizondo (ex-AATIP), Christopher Mellon (ex-DoD), Hal Puthoff (physicist, ex-SRI), Jim Semivan (ex-CIA) and others. It was structured as a publicly traded company (OTC: TTSA), combining an entertainment division (films, books, music) with an 'aerospace science and technology' division.\n\nOperational Role in the 2017 Revelation: TTSA was the vehicle that orchestrated the coordinated leak of the Tic Tac, Gimbal and GoFast videos to the New York Times in December 2017. Elizondo acted as the primary source, Mellon as the bridge to the defence establishment, and DeLonge as the public face capable of speaking to media without the stigma of a former official. The corporate structure allowed its members to operate in the grey zone between classified (where they maintained connections) and public (where they could speak freely). It also signed a real research contract with the U.S. Army for advanced materials research.\n\nLegacy and Transformation: TTSA effectively dissolved as an operational entity in 2021, when several of its founding members went their separate ways. Its legacy is demonstrating that disclosure did not have to come from the government: it could be forced from outside, with the right people, at the right moment, through the right media. It is the operational manual that defines the current era.\n\nThe WikiLeaks 2016 Factor: TTSA's public founding in October 2017 was preceded by the WikiLeaks release (October 7, 2016) of Hillary Clinton campaign chairman John Podesta's emails, which documented Tom DeLonge's prior contacts with senior military and intelligence officials. Jacques Vallée documented his meetings with several of those advisors in Forbidden Science 6: Scattered Castles (2021), and expressed deep distrust about the project's actual intentions."
  },

  "americans_for_safe_aerospace_asa": {
    name_en: "Americans for Safe Aerospace (ASA)",
    role_en: "The Pilots Who Broke the Silence",
    group_en: "Disclosure Organisations",
    bio_en: "Origins: Americans for Safe Aerospace (ASA) was founded by retired Lieutenant Commander Ryan Graves after his Congressional testimony in July 2023, as a direct response to the institutional void he had personally experienced: as an active pilot with documented UAP encounters, he had no safe, stigma-free channel for reporting them. The non-profit operates as a repository of pilot testimonies and an advocacy group for changing FAA and DoD reporting protocols.\n\nThe Scale of the Problem It Documents: ASA has collected testimonies from dozens of commercial and military pilots who claim to have had UAP encounters but have not formally reported them for fear of professional consequences. Graves estimates that, given the existing stigma, official reports represent a minimal fraction of actual encounters. This systematic under-reporting has direct aviation safety consequences: an unidentified object sharing airspace with commercial aircraft without any authority's knowledge is a risk regardless of its origin.\n\nRelevance: ASA is institutional proof that the stigma is not a perception but an operational reality with measurable consequences. The decision to create the organisation after testifying, rather than simply giving interviews, reflects a strategic understanding of how institutional change works: it needs a permanent entity, not just media moments. ASA has presented its work to the FAA, Congress and the ICAO, beginning to integrate the UAP problem into the conventional aviation safety system."
  },

  "nicap_y_mufon": {
    name_en: "NICAP and MUFON",
    role_en: "The Civilian Research Organisations",
    group_en: "Disclosure Organisations",
    bio_en: "NICAP (1956–1980): The National Investigations Committee on Aerial Phenomena (NICAP) was founded in 1956 by physicist T. Townsend Brown, pioneer in electrogravitics research. Under the subsequent direction of Major Donald Keyhoe, a former Navy pilot and writer, NICAP became the largest UFO research organisation in the world, with tens of thousands of members and chapters across the U.S. Keyhoe launched a persistent, documented campaign to force Congressional hearings and the opening of Blue Book files.\n\nThe CIA Infiltration of NICAP: Subsequent FOIA documents revealed that NICAP was infiltrated by the CIA almost from its inception. Several of its directors had documented ties to the agency, including executive director Jack Acuff. The Robertson Panel had explicitly recommended monitoring civilian UFO research organisations. This infiltration is the clearest example of the Robertson Panel's practical policy implementation: not only minimising the phenomenon in the media but also controlling the groups attempting to investigate it.\n\nMUFON and the Current Era: The Mutual UFO Network (MUFON), founded in 1969, is the largest active civilian UAP research organisation, with investigators in over 40 countries. Its report database is one of the world's largest. However, its quality has been criticised by serious researchers for lack of methodological rigour and episodes of problematic management. The tension between coverage breadth and scientific rigour is the endemic problem of civilian research organisations."
  },

  "earthtech_international_y_el_institute_for_advance": {
    name_en: "EarthTech International and the Institute for Advanced Studies",
    role_en: "Frontier Physics",
    group_en: "Private UAP Companies",
    bio_en: "Overview: EarthTech International, Inc. is a private research company based in Austin, Texas, co-founded by physicist Dr. Hal Puthoff and associated with the Institute for Advanced Studies at Austin (IASA). Its mandate is frontier physics research: advanced propulsion, zero-point energy, spacetime metrics, and other topics at or beyond the boundary of accepted conventional physics.\n\nScientific Output: Puthoff and his collaborators at EarthTech/IASA have published scientific papers in peer-reviewed journals on topics such as zero-point energy extraction from the quantum vacuum, traversable wormholes and warp propulsion. These papers are not science fiction: they are serious theoretical physics exploring whether known physics permits technologies that would be indistinguishable from the behaviours observed in the best UAP cases. EarthTech was also a subcontractor for AATIP through BAASS, producing several of the program's technical reports.\n\nRelevance: EarthTech/IASA is the bridge between conventional academic physics and UAP research. The fact that a physicist of Puthoff's calibre — with a Stanford doctorate and career at SRI and the CIA — devotes his professional life to studying whether known physics can explain UAP capabilities is itself a signal that the phenomenon deserves serious scientific attention. His most recent conclusions, shared at public conferences, suggest that some capabilities observed in the best cases are theoretically possible within known physics but require levels of energy or spacetime control that are far ahead of current human technology."
  },

  "la_ndaa_y_la_obligacion_legislativa_de_investigar_": {
    name_en: "The NDAA and the Legislative Mandate to Investigate UAPs",
    group_en: "Legislative Framework",
    bio_en: "Overview: The National Defense Authorization Act (NDAA) is the annual law that authorises the U.S. defence budget. Starting in 2021, Congress began including specific UAP-related provisions in the NDAA, converting the topic into a legal obligation for the DoD rather than a voluntary initiative. The 2021 NDAA mandated the UAPTF report. The 2022 NDAA created AARO. The 2023 NDAA included formal protections for UAP whistleblowers.\n\nThe Significance of the Legal Change: Using the NDAA as the legislative vehicle for UAP investigation is strategically important for several reasons. First, the NDAA is legislation with virtually guaranteed passage — Congress cannot afford not to pass the defence budget. Second, including UAP provisions in the NDAA makes them part of current law, not mere recommendations. Third, it links the UAP topic to national security, which is the only framework in which the defence establishment takes things seriously.\n\nThe UAP Disclosure Act of 2023: Senators Chuck Schumer and Mike Rounds introduced the UAP Disclosure Act, included in the Senate version of the 2024 NDAA. Modelled on the JFK Records Act, it would have required the transfer of all UAP records to the National Archives. It was significantly weakened in its passage through the House. Schumer attributed the obstruction to 'people in the dark'. The weakened version that was signed by the president includes a records review mandate that may be the starting point for more ambitious future legislative attempts."
  },

  "las_protecciones_para_whistleblowers_uap": {
    name_en: "UAP Whistleblower Protections",
    role_en: "The Most Important Change",
    group_en: "Legislative Framework",
    bio_en: "Overview: One of the most significant provisions introduced in the 2023 NDAA, thanks to the work of Senator Kirsten Gillibrand (D-NY), was the establishment of formal protections for whistleblowers reporting to AARO information about illegal or unauthorised UAP programs. The law guaranteed immunity from prosecution for individuals who revealed to AARO their participation in non-human technology recovery programs that had been concealed from Congress.\n\nThe Whistleblower Paradox: The existence of these protections is, in itself, an implicit acknowledgement that there are people with information who fear legal repercussions for sharing it. If no one were in that situation, the protections would be unnecessary. The fact that Congress considered it necessary to pass specific protections for this type of information suggests that legislators had received indications that illegal programs existed whose participants wanted to speak but were afraid.\n\nThe Grusch Case as Test: The David Grusch case was the practical test of these protections. Grusch used the Intelligence Community Inspector General channel, not the AARO channel, for his initial complaint. His attorney, former ICIG Charles McCullough, chose that channel precisely because it offered the most robust protections. The question that remains open is whether the AARO-to-Congress channel that Gillibrand created will be sufficiently robust to protect future whistleblowers who decide to speak through it."
  },

  "el_geipan_frances": {
    name_en: "The French GEIPAN",
    role_en: "When a Government Decides to Be Transparent",
    group_en: "Disclosure Organisations",
    bio_en: "Overview: GEIPAN (Groupement d'Études et d'Informations sur les Phénomènes Aérospatiaux Non-identifiés) is the French government's official office for UAP investigation, attached to CNES (Centre National d'Études Spatiales), the French space agency. Originally created in 1977 as GEPAN, reorganised in 1988 as SEPRA, and in its current form since 2005. Unlike its equivalents in the U.S. or UK, GEIPAN operates with an active transparency mandate: it publishes its case analyses in a public database accessible on its website.\n\nThe Results: GEIPAN classifies cases in four categories: A (explained), B (probably explained), C (insufficient information), and D (unexplained). According to its own statistics, approximately 3% of investigated cases are classified as Category D: objects with verified physical behaviours that have no possible conventional explanation. For a country the size of France, that 3% across thousands of cases represents a significant evidence corpus.\n\nComparative Relevance: GEIPAN is the most powerful counterpoint to the narrative that the UAP phenomenon cannot be seriously investigated. France has demonstrated it is possible: a government agency, with public funding, qualified technical personnel and a transparency policy, can produce serious research on the phenomenon and publish it. The question this existence raises is simple: if France can do it, why can't the U.S.? The answer to that question is precisely what the channel attempts to address."
  },

  "scu_scientific_coalition_for_uap_studies": {
    name_en: "SCU (Scientific Coalition for UAP Studies)",
    role_en: "The Missing Rigour",
    group_en: "Disclosure Organisations",
    bio_en: "Overview: The Scientific Coalition for UAP Studies (SCU) is an organisation of scientists, engineers and technical analysts dedicated to applying rigorous scientific methodology to the analysis of UAP data. Its members include physicists, aerospace engineers, image analysis experts and radar specialists. Its best-known work is the 161-page analysis of the 2013 Aguadilla, Puerto Rico case, which concluded that the object filmed by the Coast Guard showed capabilities that 'challenge known technology'.\n\nMethodology: What distinguishes the SCU from other UAP research organisations is its strictly technical methodology. Its analyses begin with first-hand data (government videos, radar data), apply physics and geometry to extract objective parameters (speed, altitude, thermal profile), and only then draw conclusions. This process eliminates speculation and produces reproducible, criticisable results. Its publications have appeared in peer-reviewed scientific journals — exceptional in the field.\n\nRelevance: The SCU represents the model for what conventional UAP research should be: credentialed scientists, reproducible methodology, open publication. Its existence demonstrates that serious science about the phenomenon is possible. The problem is not that the phenomenon is impossible to study scientifically, but that the institutions that should be doing it — universities, government agencies — have been blocked for decades by institutional stigma. The SCU has been filling that void from outside the system."
  },

  "proyecto_galileo_avi_loeb": {
    name_en: "The Galileo Project (Avi Loeb)",
    role_en: "The Official Scientific Search",
    group_en: "Disclosure Organisations",
    bio_en: "Overview: The Galileo Project was founded in 2021 by Harvard astrophysicist Dr. Avi Loeb following his proposal that the interstellar object 'Oumuamua might be artificial technology. The initiative is the first systematic search for evidence of extraterrestrial technological civilisations (ETCs) funded with private donations and operated with open scientific methodology. It has raised over $1.7 million in private donations and has collaborators at several universities.\n\nOperational Approach: The Galileo Project operates on three fronts: developing a network of telescopes with high-resolution cameras to monitor the sky and detect objects with unusual signatures; analysing satellite data to identify non-human objects in near-Earth space; and recovering and analysing materials of interstellar origin. On this third front, Loeb led a 2023 underwater expedition in the Pacific to recover metallic spherules from the ocean linked to the interstellar meteorite IM1, finding materials with unusual isotopic compositions.\n\nRelevance: The Galileo Project is the scientific response to the field's credibility dilemma: instead of depending on testimonies or leaked documents, it produces its own data with public, reproducible methodology. Loeb has been criticised by the scientific establishment for 'contaminating' serious astrophysics with speculation. His response is that the bias against non-human technology research is exactly the same bias the Robertson Panel planted in 1953, and that the only way to overcome it is to produce data that cannot be ignored."
  },

  "el_programa_sap_no_autorizado": {
    name_en: "The Unauthorised SAP Program",
    role_en: "The Structure of Maximum Secrecy",
    group_en: "Government Programs",
    bio_en: "Special Access Programs: Special Access Programs (SAPs) are the highest classification level in the U.S. government, above Top Secret/SCI. They are divided into two categories: Acknowledged SAPs (publicly recognised in general terms) and Unacknowledged SAPs (USAPs), whose very existence is classified. USAPs can be funded through 'black budgets' that do not require specific Congressional approval for each spending line, and whose access is controlled by 'need to know' criteria that can exclude even the Secretary of Defense.\n\nGrusch's Allegation: David Grusch claimed under oath in July 2023 that USAPs existed related to the recovery and study of non-human technology that had been concealed from Congress for decades. More specifically, he stated that the financial mechanism used for these programs involved contracts with private defence companies, where program costs were hidden within other conventional R&D contracts. This practice, if true, would be illegal under Congressional oversight laws.\n\nThe Manhattan Project Precedent: This is not the first time the U.S. has maintained a scientific-military program of the greatest importance entirely outside public and Congressional knowledge. The Manhattan Project was funded with hidden funds within the Army Corps of Engineers budget and its existence was unknown to most of Congress until the bombs were dropped in 1945. This historical precedent is the most powerful argument for the plausibility of similar programs existing today."
  },

  "el_memo_wilson_davis": {
    name_en: "The Wilson-Davis Memo",
    role_en: "The Admiral Who Was Denied Access",
    group_en: "Government Programs",
    bio_en: "The Document: In 2019, a 15-page document was leaked purporting to transcribe a private 2002 meeting between retired Admiral Thomas R. Wilson, former DIA director, and physicist and defence contractor Dr. Eric Davis. According to the document, Wilson had attempted to access a special access program related to recovered non-human material and had been refused by the private contractor managing it — who told him he lacked authorisation despite his rank.\n\nImplications: If authentic, its implications are extraordinary: the Director of the Defense Intelligence Agency — one of the positions with greatest access to classified information in the U.S. — would have been blocked from accessing a program managed by a private contractor. This would confirm the structure described by Grusch in 2023: the most sensitive programs are controlled by private contractors and are effectively beyond the reach of conventional government oversight, including the intelligence services themselves.\n\nAuthenticity Debate: Wilson initially denied the document's existence. Eric Davis neither confirmed nor denied it publicly. However, the Las Vegas letterhead paper, the consistency of details with known movements of Wilson at the time, and the general context are considered by researchers such as Richard Dolan and Ross Coulthart as indicators of authenticity.\n\nDetailed Structure (UAP Gerb 2025): The document was discovered in the estate of Apollo 14 astronaut Edgar Mitchell after his death and leaked publicly in 2018. The 'Oversight Committee' described is composed of exactly three persons: a security director typically from the NSA, an internal program director from the contractor, and a corporate lawyer. The probable contractor is Lockheed Martin, with a staff of 400–800 isolated workers. In 2022, the memorandum was formally entered into the Congressional record."
  },

  "wright_patterson_afb": {
    name_en: "Wright-Patterson AFB",
    role_en: "The Warehouse of Secrets",
    group_en: "Government Programs",
    bio_en: "History: Wright-Patterson Air Force Base in Dayton, Ohio, is the largest and most important U.S. Air Force base in terms of aeronautical research and development. It is home to the Air Force Research Laboratory (AFRL), the National Air and Space Intelligence Center (NASIC), and was historically headquarters to Project Blue Book. Its Hangar 18 — more precisely the complex known as the Foreign Technology Division (FTD) — has been consistently identified by multiple witnesses since the 1950s as the storage location for recovered non-human-origin material.\n\nTestimonies: Senator Barry Goldwater, former presidential candidate and USAF veteran with high-level access, publicly stated on multiple occasions that he had attempted to access the 'blue room' at Wright-Patterson to see the stored material, and had been refused by General Curtis LeMay with a response that Goldwater described as 'the worst language I have ever been subjected to in my life'. This testimony from a U.S. Senator is difficult to dismiss on grounds of credibility.\n\nCurrent Relevance: Wright-Patterson remains the neurological centre of USAF aerospace intelligence. The NASIC is the agency responsible for analysing foreign aerial technology — the institutional equivalent of what a non-human recovered technology analysis programme would be. The institutional continuity between the historical Foreign Technology Division and the current NASIC is noted by researchers as one of the threads connecting historical recoveries to current programs."
  },

  "general_dynamics_y_el_complejo_industrial_militar_": {
    name_en: "General Dynamics and the Military-Industrial Complex",
    group_en: "Defence Contractors",
    bio_en: "The Complex Concept: President Dwight Eisenhower, in his famous farewell address of January 17, 1961, warned the country about the danger of the 'military-industrial complex': the combination of interests between the armed forces, Congress and the defence industry that could acquire disproportionate political influence and operate outside democratic control. This warning, made by a five-star general and eight-year president, is the most important conceptual framework for understanding the structure of UAP concealment.\n\nGeneral Dynamics in the UAP Context: General Dynamics, one of the five large defence contractors, manufactures Navy nuclear submarines, Army armoured vehicles and classified communications systems. Its specific relevance in the UAP context is its role in the classified communication and transport infrastructure that would be needed to manage material and personnel of special access programs. General Dynamics's logistical and security capabilities are precisely those that would allow material to be moved and stored without leaving an institutional paper trail.\n\nEisenhower's Warning as Interpretive Key: Eisenhower's 1961 warning takes on an additional dimension when the context is known: it was Eisenhower who, as president, attempted to be briefed on the most classified programs and encountered resistance. According to researcher Grant Cameron, Eisenhower went so far as to threaten to invade Area 51 with troops if he did not receive information. If the president who created the CIA and NASA found closed doors, his warning was not abstract but based on direct personal experience of the problem."
  },

  "los_metamateriales": {
    name_en: "The Metamaterials",
    role_en: "The Most Controversial Physical Evidence",
    group_en: "Defence Contractors",
    bio_en: "Overview: Metamaterials are engineered materials with properties that do not exist in nature: nanoscale structures that produce electromagnetic responses impossible for natural materials, such as negative refractive indices or invisibility at certain frequencies. Their relevance in the UAP context arises because multiple testimonies — including those of Hal Puthoff, Linda Moulton Howe and Tom DeLonge — claim that the government or its contractors possess metamaterials of non-human origin with properties that exceed known human manufacturing capability.\n\nDocumented Cases: Linda Moulton Howe claims to have received material fragments from a former intelligence officer who described them as coming from a UAP recovery. Analysis of these materials by physicist Dr. Robert Sarber found ultra-thin layer structures of bismuth and magnesium with properties that have not been replicated with known technology. TTSA claimed in 2017 to be in possession of advanced materials with unusual properties, without being able to reveal their provenance.\n\nRelevance: Metamaterials are the point of contact between the reverse engineering claim and the possibility of scientific verification. If materials of non-human origin with verifiable laboratory properties existed, they would constitute the most direct physical evidence available. The problem is that all testimonies about their existence are second-hand or from anonymous sources. However, the fact that Puthoff — one of the most respected physicists in the field — claims to have analysed materials of this type in the AATIP context makes the claim considerably more difficult to dismiss than if it came from an uncredentialed source."
  },

  "las_patentes_de_la_marina": {
    name_en: "The Navy Patents",
    role_en: "Future Propulsion in the Public Record",
    group_en: "Defence Contractors",
    bio_en: "Overview: Between 2016 and 2020, inventor Dr. Salvatore Pais, working for the Naval Air Warfare Center Aircraft Division (NAWCAD), filed and obtained a series of extraordinary patents: a 'Hybrid Aerospace-Underwater Craft' capable of operating in air, water and space without transition; a force field generator; and a high-energy plasma propulsor. These patents, which are public documents accessible in the USPTO database, describe technologies that correspond exactly to the behaviours observed in the best UAP cases.\n\nThe Navy's Defence: What makes these patents extraordinarily significant is not only their content but the way the Navy defended them. When the USPTO attempted to reject the hybrid vehicle patent as 'non-operable' (i.e., impossible according to known physics), the NAWCAD chief of research wrote an official letter to the USPTO stating that the technology was 'operable' and that China was working on similar principles. This active defence by the Navy is the most direct proof that the patents are not speculative fiction but reflect real research.\n\nThe UAP Connection: Dr. Pais described his concept as based on the 'Pais Effect' principle: the generation of high-frequency rotating electromagnetic fields. Researchers who have analysed the patents are divided: some consider them physically possible but far ahead of current technology; others dismiss them as pseudoscience. Journalist Tim McMillan of The War Zone has extensively documented this case, noting that the coherence between capabilities described in the patents and those observed in the Tic Tac, Gimbal and GoFast videos is too precise to be coincidental."
  },

  "la_dia_y_la_inteligencia_sobre_tecnologia_no_human": {
    name_en: "The DIA and Intelligence on Non-Human Technology",
    group_en: "Intelligence Agencies",
    bio_en: "Overview: The Defense Intelligence Agency (DIA) is the U.S.'s primary military intelligence organisation, responsible for analysing the military capabilities and threats of foreign actors. Its relevance in the UAP context is multiple: it was one of the funders of Project Stargate; it was the organisation that produced the report on the 1976 Tehran incident (one of the most institutionally documented cases); and it was the organisation under whose supervision the UAPTF operated.\n\nFOIA Documents: FOIA requests to the DIA on UAPs have produced some of the most revealing documents available. The Tehran report, the analysis of Malmstrom incidents, and several internal advanced propulsion studies have been partially declassified. A 1988 DIA study titled 'Unidentified Aerial Vehicles' analyses the capabilities of several unexplained cases with technical seriousness that contrasts with the public posture of minimisation.\n\nThe DIA's Role in AATIP: Although AATIP was nominally a DoD program under the Undersecretary of Defense for Intelligence, the DIA played a central role. DIA physicist James T. Lacatski conceived the original program and presented the proposal to Harry Reid. Lacatski published in 2023 the book Inside the Government's Investigation of the UAP Phenomenon, which offers the most internally available public perspective on the real functioning of AATIP, confirming that the program studied phenomena that went far beyond simple aerial sightings."
  },

  "el_nro_y_los_satelites_que_lo_vieron_todo": {
    name_en: "The NRO and the Satellites That Saw Everything",
    group_en: "Intelligence Agencies",
    bio_en: "Overview: The National Reconnaissance Office (NRO) is the agency responsible for the design, construction and operation of U.S. spy satellites. Its existence was classified until 1992. Its satellites have resolution capability allowing objects smaller than 30 centimetres to be distinguished from orbit, and continuously monitor virtually the entire Earth's surface. Its relevance in the UAP context is straightforward: if there are unidentified objects operating at altitudes within the range of reconnaissance satellites, the NRO would have detected them.\n\nThe Resolution Argument: Researcher Christopher Mellon has repeatedly noted that the claim of 'insufficient data' on UAPs conflicts with the fact that the NRO operates the most sophisticated optical and radar sensor network in human history. If the objects observed by military pilots and detected by naval radars are real, the NRO should have high-resolution images of them. The absence of those images from the public debate is itself significant: either they are not being shared, or they reveal something that is not meant to be shown.\n\nThe Black Budget: The NRO's budget is one of the largest in the intelligence community, estimated at over $10 billion annually. A fraction of that budget, funded in discrete lines, could fund programmes analysing anomalous phenomena completely outside public knowledge."
  },

  "el_fbi_y_el_fenomeno": {
    name_en: "The FBI and the Phenomenon",
    role_en: "From Hoover to Digital Documents",
    group_en: "Intelligence Agencies",
    bio_en: "History of Involvement: FBI involvement in the UFO phenomenon begins almost simultaneously with the start of the modern phenomenon in 1947. Director J. Edgar Hoover showed a documented personal interest in flying disc reports, instructing his field agents to collect information. However, his relations with the USAF on the topic were conflictive: FOIA documents show that Hoover was frustrated at being excluded from the most sensitive information circuit, and that on several occasions he expressed distrust that the USAF was telling him everything.\n\nThe FBI's Digital Vault: In 2011, the FBI launched its declassified digital document archive, the 'Vault', and the first document to go viral was the 1950 Hottel memo, which surpassed one million accesses in its first weeks. The FBI currently has publicly available hundreds of UFO-related documents spanning 1947 to the 1970s. Reading them reveals an agency that took reports seriously enough to investigate them, but that never had complete access to USAF or CIA information.\n\nCurrent Relevance: The FBI has federal jurisdiction over any threat to national airspace that may involve a federal crime. In theory, the unauthorised special access programmes Grusch described to Congress would constitute federal crimes under several laws, including obstruction of Congressional oversight. Whether the FBI is investigating these allegations, or is also being excluded from the information circuit, is one of the most significant outstanding questions in the current legislative debate."
  },

  "uap_media_uk_y_el_periodismo_de_investigacion_inte": {
    name_en: "UAP Media UK and International Investigative Journalism",
    group_en: "Disclosure Organisations",
    bio_en: "Overview: UAP Media UK is a journalistic organisation founded by researcher Gary Heseltine, a former National Police detective specialising in witness testimony analysis, and researcher Mark Mahoney. Their focus is investigative journalism applied to the UAP phenomenon from a British and international perspective. They have organised conferences with first-tier witnesses and produced documentaries on key cases.\n\nThe UK Disclosure Movement: The disclosure phenomenon is not exclusively American. In the UK, the Ministry of Defence operated its own UAP investigation unit, known as DI55, until its official dissolution in 2009. Researcher Nick Pope, who worked for that unit between 1991 and 1994, is the British equivalent of Luis Elizondo: a former official who has spoken publicly about the seriousness with which the government treated the topic internally while publicly minimising it.\n\nRelevance: The international perspective on the phenomenon is essential for the channel because it dismantles the narrative that UAP is an American cultural obsession. The Rendlesham Forest case occurred on British territory and involved USAF personnel. The Belgian triangles were documented by the Belgian Air Force. The COMETA Report was produced by French generals. This global dimension points to the fact that any institutional response to the phenomenon will necessarily have to be international — adding another layer of complexity to the disclosure debate."
  },

  "the_phenomenon_y_el_documental_como_herramienta_de": {
    name_en: "The Phenomenon and the Documentary as a Disclosure Tool",
    group_en: "Disclosure Organisations",
    bio_en: "The Documentary Format: The documentary The Phenomenon (2020), directed by James Fox and narrated by actor Peter Coyote, is considered the best UAP documentary ever produced. It features statements from senior former officials (including former acting Secretary of Defense Christopher Mellon and physicist Jacques Vallée), documents historical cases with archival footage, and culminates with the testimonies of the children of Ruwa school, Zimbabwe. It was nominated for the Critics Choice Documentary Award.\n\nThe Media Ecosystem of Disclosure: The Phenomenon does not operate alone but as part of a media ecosystem that includes TV series (Elizondo's Unidentified: Inside America's UFO Investigation on History Channel), podcasts (Need to Know with Richard Dolan and Bryce Zabel, Weaponized with George Knapp and Jeremy Corbell), YouTube channels (Jeremy Corbell, Danny Sheehan), and books (Elizondo's Impossible, Lacatski's Skinwalkers at the Pentagon). This ecosystem is the communication infrastructure of the disclosure movement.\n\nRelevance for the Channel: The existence of this media ecosystem is both an opportunity and a challenge for ReDescubriendo. The opportunity: there is proven demand for serious content on the topic. The challenge: there is also a growing volume of low-quality, speculative and sensationalist content that damages the field's credibility. The channel positions itself explicitly at the rigour pole, using the timelines and documentation as a factual anchor, to differentiate itself from the media noise."
  },

  "cufos_y_el_legado_cientifico_de_hynek": {
    name_en: "CUFOS and Hynek's Scientific Legacy",
    group_en: "Disclosure Organisations",
    bio_en: "Overview: The Center for UFO Studies (CUFOS) was founded in 1973 by Dr. J. Allen Hynek as a response to the frustration he felt with Project Blue Book's approach and its closure in 1969. Hynek wanted an organisation that would apply genuine scientific rigour to the study of the phenomenon, rather than the public relations that had characterised Blue Book. CUFOS published the Journal of UFO Studies, a peer-reviewed publication that was the first scientific journal dedicated exclusively to the topic.\n\nThe Hynek Method: Hynek's scientific legacy is the most important in academic ufology. His Close Encounter classification system (CE1, CE2, CE3, now extended to CE4 and CE5) remains the standard used by all research organisations. His insistence that the 5% of Blue Book cases remaining unexplained deserved serious study — when that 5% represented over 700 cases — is the central statistical argument of scientific ufology: if a small but consistent fraction of cases is genuinely inexplicable, that is more significant than the 95% that can be explained.\n\nRelevance: CUFOS continues to operate as an archive and research centre. Its historical database is the most complete of any civilian organisation. For the channel, CUFOS and Hynek's legacy represent the scientific reference standard: any claim about the phenomenon must be measured against the methodological rigour Hynek attempted to establish. His figure connects the historical Blue Book period with the modern era of disclosure, being the scientific thread that runs throughout the channel's narrative."
  },

  "the_black_vault": {
    name_en: "The Black Vault",
    role_en: "The World's Largest FOIA Archive",
    group_en: "Disclosure Organisations",
    bio_en: "Overview: The Black Vault is the world's largest non-governmental online repository of government documents declassified under the Freedom of Information Act (FOIA), founded and managed by researcher John Greenewald Jr. since 1996, when he was a teenager. It contains over 2.5 million pages of CIA, FBI, DIA, NSA, USAF and other agency documents on a wide range of classified topics, including the world's largest private collection of declassified UAP documents.\n\nThe FOIA Method as Research Tool: Greenewald has filed over 10,000 FOIA requests throughout his career, developing encyclopaedic knowledge of classification and declassification procedures across different agencies. His analyses of the redaction patterns in delivered documents — what is blacked out, what is left visible, what classification methodology is used — are themselves revealing about what the government considers most sensitive. The Black Vault has been a source for multiple New York Times, Washington Post and other media reports on UAP documents.\n\nRelevance: The Black Vault democratises access to the documentary evidence of the phenomenon. Before its existence, accessing FOIA documents required legal knowledge, time and resources. Greenewald has made it possible for anyone in the world to access the same documents as professional researchers — essential infrastructure for the channel's approach of channelling important information that deserves to be amplified."
  },

  "el_inspector_general_de_la_comunidad_de_inteligenc": {
    name_en: "The Intelligence Community Inspector General",
    role_en: "The Legal Channel for Whistleblowers",
    group_en: "Legislative Framework",
    bio_en: "Overview: The Intelligence Community Inspector General (ICIG) is the independent oversight body responsible for investigating fraud, waste, abuse and misconduct within the 17 agencies of the U.S. intelligence community. Its importance in the UAP context is that it was the channel David Grusch used to file his complaint, and it was the ICIG that classified that complaint as 'credible and urgent', which obliged it to be communicated to Congress.\n\nGrusch's Legal Process: Grusch's complaint followed the process established by the Intelligence Community Whistleblower Protection Act: submission to the ICIG, assessment of credibility and urgency by the ICIG, mandatory communication to Congress if the assessment is positive. This process is specifically designed to protect whistleblowers revealing information about illegal programs within the intelligence community. The fact that the ICIG classified it as 'credible and urgent' has specific legal consequences and cannot be dismissed as mere opinion.\n\nLimitations of the System: However, the system has significant limitations. The ICIG can investigate and communicate, but has no enforcement power. If the programs described by Grusch are protected by classifications that exceed the ICIG's own access level, the investigation can be blocked. This is precisely the situation that the legislative movement is trying to resolve: creating a mechanism with sufficient legal authority to overcome the classifications that currently protect the most sensitive programs from scrutiny, even from the Inspector General."
  },

  "la_ley_de_registros_de_jfk": {
    name_en: "The JFK Records Act",
    role_en: "The Model for UAP Disclosure",
    group_en: "Legislative Framework",
    bio_en: "Overview: The President John F. Kennedy Assassination Records Collection Act of 1992 is the law that mandated the collection and declassification of all government documents related to the Kennedy assassination, establishing mandatory publication deadlines. This law is the explicit model Senator Schumer used to draft the 2023 UAP Disclosure Act: if Congress could force the declassification of documents about an assassination, it can force the declassification of documents about UAPs with the same legal mechanism.\n\nLessons from the JFK Process: The JFK Records Act experience offers important lessons for the UAP disclosure process. Thirty years after its passage, a significant fraction of the documents remains classified, with deadlines indefinitely extended by successive presidents citing national security reasons. This experience suggests that even a well-drafted UAP disclosure law might face decades-long declassification processes subject to the same delaying manoeuvres.\n\nRelevance: The parallel between the JFK and UAP cases is deeper than the legal. In both cases, there are government documents that multiple institutional actors have an interest in keeping classified. In both cases, the 'national security' justification can be used indefinitely to block transparency. And in both cases, the public and independent researchers have to build their analyses on partial, fragmentary evidence inevitably filtered by the interests of those who control the archives."
  },

  "las_audiencias_clasificadas": {
    name_en: "The Classified Briefings",
    role_en: "What Congress Knows and Cannot Say",
    group_en: "Legislative Framework",
    bio_en: "Overview: Parallel to the public hearings of 2022 and 2023, Congress has held multiple classified UAP briefing sessions. Representatives Tim Burchett, Mike Quigley and Senator Marco Rubio, among others, have publicly stated having received classified briefings whose content they cannot reveal, and having been disturbed by what they heard.\n\nThe Classification Paradox: The situation creates a communicative paradox: legislators know more than they can say, and what they do say — that the topic is 'serious', that they are 'disturbed', that there is a 'massive cover-up' — is explicit enough to signal that what they cannot say is even more significant. Rubio has stated that he has received testimony from persons with credentials at 'high access levels' who affirm the existence of non-human technology recovery programs. This statement, in the context of his classified access as former Chairman of the Senate Intelligence Committee, is not an opinion but a reflection of what he was briefed.\n\nThe Oversight Problem: Legislators have also stated having been blocked in accessing information that they have a constitutional right to oversee. AARO and the DoD have been accused of not fully cooperating with Congressional requests. This situation — programs operating outside the reach of the legislative branch — is precisely what the U.S. Constitution prohibits, and is the central legal and political knot of the ongoing debate."
  },

  "the_black_money": {
    name_en: "The Black Money",
    role_en: "The Black Budget and the Financing of Secrecy",
    group_en: "Private UAP Companies",
    bio_en: "The Black Budget System: The U.S. 'black budget' is the set of classified budget items from the Defence and Intelligence departments whose specific contents are not public. According to documents published by Edward Snowden in 2013, the intelligence budget for fiscal year 2013 was approximately $52.6 billion. The DoD's classified R&D budget adds over $20 billion. The total combined federal classified spending exceeds $80 billion annually.\n\nThe Mechanics of Financial Concealment: The mechanism Grusch described for funding UAP recovery programs is consistent with known black budget practices. Funds are allocated to R&D contracts with vague descriptions ('Advanced Research Project X'), which are in turn subcontracted in successive layers until the final destination of the funds is practically impossible to trace from outside. This system is not specific to UAPs: it is the same mechanism used to fund classified weapons programs, intelligence technology and covert operations.\n\nRelevance: Understanding the black budget is essential to understanding why 'lack of documentation' on UAP programs is not proof of their non-existence. In a system where tens of billions of dollars are spent each year on projects whose descriptions are deliberately opaque, the absence of a budget line labelled 'non-human technology recovery' proves nothing. What the black budget does prove is that the government has the technical and legal capacity to fund large-scale secret programs without Congress or the public knowing."
  },

  "immaculate_constellation": {
    name_en: "Immaculate Constellation",
    role_en: "The Most Secret UAP Collection Programme",
    group_en: "Private UAP Companies",
    bio_en: "Overview: Immaculate Constellation is the name of an alleged special access UAP data collection and analysis programme that David Grusch described in interviews following his Congressional testimony. According to Grusch, it is a centralised repository of satellite imagery and intelligence on UAPs collected by military satellite systems and sensors, whose existence has been concealed from both UAPTF and AARO.\n\nInvestigative Journalism: The name 'Immaculate Constellation' was subsequently confirmed by investigative journalist Michael Shellenberger, who claimed to have corroborated its existence with independent sources.\n\nImplication: If Immaculate Constellation exists as Grusch describes, its most important implication is that the U.S. government possesses high-quality UAP imagery that has not been shared with the official investigation offices (UAPTF, AARO) or with Congress. That would mean the public debate about 'lack of evidence' is being deliberately fed by the retention of the most significant evidence.\n\nMatthew Brown Update (2025): Brown — former State Department contractor and author of the IC report entered into the Congressional record — describes Immaculate Constellation as an unacknowledged SAP operation supervised by the NSC/White House, not the DoD, placing it outside the audit perimeter of AARO or the armed committees of Congress. The programme collects UAP/NHI intelligence from multiple platforms (NRO, NGA, military sensors, IC) and segregates it via AI algorithms to a reduced subset of authorised recipients. Brown discovered IC accidentally during a voluntary cleanup of a TS/SCI server in OSD Policy. He and Dylan Borland have launched a UAP lawfare NGO to pursue disclosure through the judicial system given the blocking of executive and legislative channels."
  },

  "el_area_51_groom_lake": {
    name_en: "Area 51 (Groom Lake)",
    role_en: "The Secret Within the Secret",
    group_en: "Government Programs",
    bio_en: "History: Area 51, officially known as Groom Lake or the USAF Nevada Test and Training Range, is the world's most famous secret aircraft test facility. It was used to develop the U-2 (from 1955), the SR-71 (from 1962) and the F-117 (from 1977), among others. Its existence was officially denied by the U.S. government until 2013, when it was acknowledged in declassified CIA documents.\n\nArea 51 and UFOs: The historical irony of Area 51 is that the secrecy required to protect the development of radically advanced conventional aircraft (U-2, SR-71) contributed to fuelling the UFO narrative in the 1950s and 60s: commercial pilots saw aircraft with performance impossible for the era and reported them as UFOs. The CIA, according to its own declassified documents, concluded that over 50% of the unexplained sightings of the 1950s and 60s were actually secret American aircraft. But this was classified, leaving those sightings publicly unexplained.\n\nThe Secret Within the Secret: The most significant aspect of Area 51 for the channel is that it definitively demonstrated that the U.S. can maintain radically advanced aerospace programmes in complete secrecy for decades. If they could keep the SR-71 secret, they could keep anything secret. And if the secrecy of conventional projects contributed to the UFO narrative, the natural question is whether there is something more at Groom Lake that is still as secret as the U-2 was in 1955."
  },

  "fenix_space_y_la_nueva_generacion_de_empresas_aero": {
    name_en: "Fenix Space and the New Generation of Private Aerospace Companies",
    group_en: "Private UAP Companies",
    bio_en: "Overview: The proliferation of private aerospace companies — SpaceX, Blue Origin, Virgin Galactic, and hundreds of smaller startups — has created a new category of space actors operating with far less oversight than traditional defence contractors and with access to cutting-edge space technology. In the UAP context, these companies are relevant because they have the technical capacity to deploy sensors in space that could detect and characterise unidentified objects, and do so without the obligation to classify their data.\n\nThe Elon Musk Factor: The case of Elon Musk and SpaceX is particularly significant. SpaceX has deployed the Starlink constellation of over 4,000 satellites with optical sensors covering virtually the entire Earth's surface. If those satellites have detected anomalous objects, SpaceX would have images of them. The absence of any public statement from Musk on the topic — despite his track record of public statements on virtually every other topic — has been noted by several researchers as potentially significant.\n\nFuture Relevance: The new generation of private aerospace companies represents both an opportunity and a risk for the disclosure movement. The opportunity: government-independent sensor data that cannot be classified. The risk: that these companies, by obtaining defence government contracts, are incorporated into the same special access and secrecy system that characterises traditional contractors. The dynamic between the private aerospace sector and the national security state is one of the most important elements to watch in the coming years."
  },

  "el_complejo_de_inteligencia_y_la_comunidad_de_los_": {
    name_en: "The Intelligence Complex and the Community of 17",
    role_en: "The Total Network",
    group_en: "Intelligence Agencies",
    bio_en: "Overview: The U.S. Intelligence Community consists of 17 independent agencies, including the CIA, NSA, DIA, NRO, FBI, Army Intelligence, Navy and USAF, among others. Each has its own classified budget, its own protocols and, crucially, its own data collection programmes. The fragmentation of this community, with multiple parallel channels and little horizontal sharing, is precisely what allows unauthorised special access programmes to exist for decades without any individual agency having the complete picture.\n\nCompartmentalisation as a Tool: The information compartmentalisation system — where each person or unit knows exactly what they need for their specific task — was designed to protect sensitive programs from enemy infiltration. But it has a side effect: it makes it practically impossible for any individual, including senior intelligence community officials, to have a complete view of what the system as a whole is doing in a given area. David Grusch described exactly this problem: people with high-level access in one agency who could not access programs in another agency because compartmentalisation was horizontal, not just vertical.\n\nRelevance: The structure of 17 means that the UAP phenomenon, if it has been the subject of serious and sustained government investigation, may have been studied by multiple agencies independently and without coordination. This would imply that existing data are fragmentary, dispersed across multiple classified silos, and that no entity currently has the complete picture — which is why legislators who have received classified briefings say they are 'disturbed' but cannot give a definitive answer: they have probably only seen fragments of the puzzle."
  },

  "la_era_post_grusch": {
    name_en: "The Post-Grusch Era",
    role_en: "The Current State of Disclosure",
    group_en: "Legislative Framework",
    bio_en: "The Present Moment: In early 2026, the UAP disclosure phenomenon is at a historically unprecedented turning point. The 2023 Congressional hearings, Grusch's complaint, the partially blocked UAP Disclosure Act, the publication of the AARO report that contradicts Grusch, and the continued activity of the UAP Caucus have created a state of active institutional contradiction: part of the government acknowledges the problem, part denies it, and whistleblowers keep appearing.\n\nMost Recent Developments: In 2024, several new whistleblowers presented before Congress in classified sessions, according to statements from UAP Caucus members. Former intelligence officer Karl Nell publicly declared that the presence of non-human intelligence on Earth is a fact, not a hypothesis. Researcher Jake Barber, with verifiable military credentials, claimed to have participated in non-human material recovery operations. Ross Coulthart published new research pointing to specific facilities linked to the programs.\n\nRelevance for the Channel: The current state of disclosure is exactly the kind of historical moment ReDescubriendo is designed for. There is too much information, too much noise, too many contradictory claims. The value of the channel's timelines is precisely contextualising them: showing that what is happening today is the result of a decades-long process, with identifiable actors, verifiable documentation and coherent patterns. The current information chaos is not accidental: it is the predictable consequence of the narrative control system, designed in 1953, beginning to fail."
  },

  "doe_nest": {
    name_en: "DOE/NEST",
    role_en: "The Nuclear Emergency Team as UAP Recovery Program",
    group_en: "Government Programs",
    bio_en: "Overview: The Nuclear Emergency Support Team (NEST) was established on November 1, 1974 under the authority of the Atomic Energy Commission (AEC), predecessor of the current Department of Energy (DOE). Its public mission is to respond to nuclear emergencies, accidents and radiological threats. Its classified mandate, according to UAP Gerb and insider testimonies collected on his channel, includes the role of primary recovery team for technology of unknown origin (TUO), operating under cover of its declared nuclear missions.\n\nThe Legal Framework for Secrecy: The key to NEST's power to maintain secrecy is the Atomic Energy Act of 1954. This law allows any material to be classified as 'transclassified foreign nuclear material', a designation that places it under exclusive DOE authority and makes it inaccessible to Congressional intelligence committees. According to Gerb, this legal architecture explains why UAP disclosure amendments in the NDAA specifically cite the Atomic Energy Act as a barrier to transparency: recovered material would have been classified under this law, placing it beyond the reach of any conventional legislative oversight.\n\nThe Laboratory Network: NEST operates through the DOE/NNSA national laboratories network: Los Alamos, Sandia, Lawrence Livermore, Oak Ridge, and others. This network provides the scientific and security infrastructure necessary to study exotic materials away from public scrutiny. Gerb notes that the rotation of personnel between AARO and Oak Ridge National Laboratory — including former AARO director Sean Kirkpatrick who became CTO of Oak Ridge in 2023 — suggests an active institutional connection between the official UAP research program and the DOE laboratory network."
  },

  "sandia_national_laboratories": {
    name_en: "Sandia National Laboratories",
    role_en: "The Scientific Arsenal of the UAP Secret",
    group_en: "Government Programs",
    bio_en: "Overview: Sandia National Laboratories (SNL) is one of the three major DOE/NNSA R&D laboratories, alongside Los Alamos and Lawrence Livermore. It operates as a Federally Funded Research and Development Center (FFRDC) managed by the National Technology and Engineering Solutions of Sandia (NTESS) consortium, headquartered in Albuquerque, New Mexico — 75 miles from Roswell. Its missions include nuclear weapons systems engineering, advanced materials science and classified defence technologies.\n\nThe UAP Connection (UAP Gerb): Researcher Gerb documented in his Sandia documentary the laboratory's involvement in non-human origin technology analysis programmes. Arguments include: geographical proximity to multiple historical crash retrieval sites (Roswell, Aztec, adjacent Kirtland AFB); Sandia's role in exotic materials analysis for the DoD; and documented links between Sandia and the Stargate remote viewing program. The laboratory has access to materials analytical capabilities that no private company possesses, making it the natural candidate for analysing materials of anomalous origin.\n\nThe Kirtland AFB Link: Sandia shares facilities with Kirtland Air Force Base, which is simultaneously one of the bases with the most UAP sighting history from the 1940s–50s (Green Fireballs) and home to the Air Force Nuclear Weapons Center. This triple coincidence — materials analysis laboratory, UAP sighting history, nuclear arsenal — is not overlooked by researchers like Gerb.\n\nThe AT&T Connection: According to the Eisenhower Briefing document in the MJ-12 corpus, a craft that impacted on December 6, 1950 between El Indio, Texas and Guerrero, Mexico was transferred to Sandia/AEC laboratories at Kirtland AFB for analysis. Sandia was managed at that time by AT&T Corporation (1949–1993), before passing to Lockheed Martin. The Sandia–AT&T–Lockheed chain links the laboratory to the core of the corporate legacy apparatus."
  },

  "nro": {
    name_en: "NRO",
    role_en: "The Satellites That Saw Everything and the Immaculate Constellation Programme",
    group_en: "Intelligence Agencies",
    bio_en: "Overview: The National Reconnaissance Office (NRO), created secretly in 1960–1961 and declassified in 1992, is the agency responsible for the design, construction and operation of U.S. spy satellites. It operates with one of the intelligence community's largest classified budgets — estimated at $15 billion annually — and manages the world's most sophisticated satellite constellation, including the AI programme known as Sentient, capable of automatically analysing imagery from virtually the entire planet in near-real time.\n\nThe Grusch-NRO Connection: Whistleblower David Grusch worked as an intelligence officer at the NRO and NGA (National Geospatial-Intelligence Agency) before becoming the representative of those agencies to the UAPTF. His position gave him direct access to the most advanced satellite imaging systems. According to researcher UAP Gerb, the agency allegedly provided image intelligence (IMINT) of UAP objects to a special access programme designated Immaculate Constellation, established in 2017 and managed within the intelligence apparatus under OSD supervision.\n\nCrash Retrievals and the Jason Advisory Group (UAP Gerb 2025): NRO satellites allegedly captured imagery and telemetry of non-human craft incursion and crash events over decades — data that would have been channelled directly to the Immaculate Constellation programme without passing through conventional AARO channels. The Jason Advisory Group, formed in 1960 under Eisenhower and administered since then by the MITRE Corporation, reportedly comprises 30–60 elite scientists directly connected to the UAP programme — a structure UAP Gerb considers 'as fundamental to UAP programmes as Sandia, Lawrence Livermore and Los Alamos combined'."
  },

  "saic_science_applications_international_corporatio": {
    name_en: "SAIC (Science Applications International Corporation)",
    role_en: "The Largest Defence Intelligence Contractor",
    group_en: "Defence Contractors",
    bio_en: "Overview: Science Applications International Corporation (SAIC) is one of the largest U.S. defence and intelligence contractors, with decades of classified research contracts spanning intelligence analysis, advanced technology development and special programs. With tens of thousands of employees holding security clearances, SAIC has been identified by multiple UAP researchers as a key node in the legacy programs network.\n\nThe UAP Connection: UAP researcher UAP Gerb produced an extensive documentary on SAIC's role in UAP programs. According to his research, SAIC served as a primary analytical and engineering contractor for several classified UAP-related programs, providing scientific expertise for the analysis of recovered materials and the evaluation of UAP performance data. SAIC's intelligence division, in particular, would have had access to the most sensitive collection data.\n\nThe AARO Connection: Former AARO director Sean Kirkpatrick's trajectory — from AARO to a senior position at Oak Ridge National Laboratory — mirrors patterns seen with other officials who moved between official UAP investigation offices and DOE laboratory/contractor positions, suggesting an ongoing institutional relationship between these entities.\n\nRelevance: SAIC represents the intelligence contractor dimension of the UAP corporate landscape: a company so deeply embedded in classified government work, with such broad clearances across so many agencies, that it functions as a connective tissue between separate classified programs."
  },

  "lockheed_martin_skunk_works_org": {
    name_en: "Lockheed Martin Skunk Works (Org)",
    role_en: "Advanced Development Programs",
    group_en: "Defence Contractors",
    bio_en: "See the Lockheed Martin / Skunk Works node for full background. This organisational node represents the Advanced Development Programs (ADP) entity specifically — the operational division within Lockheed Martin responsible for the most classified and advanced aircraft programs.\n\nRelevance: The Skunk Works organisation is the institutional template for how classified reverse engineering programs could operate within a large publicly-traded company: a fully compartmentalised division with its own security protocols, funding streams and personnel, invisible to the rest of the company and opaque to Congressional oversight through its special access program structure."
  },

  "northrop_grumman": {
    name_en: "Northrop Grumman",
    role_en: "The Tejon Ranch Programs",
    group_en: "Defence Contractors",
    bio_en: "See the Northrop Grumman and Tejon Ranch node for full background. This node specifically represents the corporate entity Northrop Grumman and its role across multiple classified programs beyond the Tejon Ranch facility — including stealth technology, advanced sensors and the B-21 Raider bomber.\n\nUAP Relevance: Multiple whistleblowers, including David Grusch and Matthew Brown, have specifically named Northrop Grumman as one of the defence contractors allegedly holding recovered UAP materials and conducting reverse engineering programs. Brown specifically identified a former Northrop Grumman official (ex-deputy SAPCO of DARPA) as a key figure in coordinating responses against UAP whistleblowers."
  },

  "u_s_navy_los_programas_uap": {
    name_en: "U.S. Navy — The UAP Programs",
    role_en: "The Service That Started Modern Disclosure",
    group_en: "Intelligence Agencies",
    bio_en: "Overview: The U.S. Navy has been the primary source of credible modern UAP testimony and documentation: the Tic Tac (2004), Gimbal and GoFast (2014–2015) videos were all captured by Navy platforms; Ryan Graves and David Fravor are Navy pilots; Jay Stratton was a Navy intelligence official; the UAPTF was a Navy-initiated body. The Navy's central role in modern UAP disclosure is not accidental — its operational domain (ocean, air, space) overlaps most directly with UAP activity areas.\n\nThe Reporting System Reform: In 2019, following media pressure after the New York Times revelations, the Navy issued new instructions creating a formal, non-punitive reporting protocol for UAP encounters by pilots and other personnel. This was the first institutional acknowledgement that UAP encounters were occurring regularly enough to require systematic reporting infrastructure.\n\nClassified Navy Research: Beyond the public UAPTF, there is evidence of classified Navy research into UAP propulsion and technology. Salvatore Pais's extraordinary patents were filed through NAWCAD (Naval Air Warfare Center Aircraft Division), and the Navy's active defence of those patents as 'operable' technology suggests ongoing classified research into the principles they describe.\n\nRelevance: The Navy's disproportionate representation in the modern UAP disclosure record — relative to Air Force, Army or other services — may reflect either the Navy's greater exposure to UAP activity in the maritime domain, or a greater willingness within Navy culture to acknowledge and report these encounters."
  },

  "operacion_laser_strike": {
    name_en: "Operation Laser Strike",
    role_en: "The Pentagon's UAP Engagement Protocol",
    group_en: "Government Programs",
    bio_en: "Overview: Operation Laser Strike is one of the alleged classified protocols for military engagement or response to UAP incursions over sensitive facilities. While its specific details remain classified, researcher UAP Gerb has documented references to it in the context of military responses to UAP incidents at nuclear installations.\n\nContext: The existence of formalised response protocols for UAP encounters — distinct from the standard procedures for responding to conventional aircraft intrusions — would be evidence of an official military acknowledgement that UAPs represent a distinct and recurring phenomenon requiring specialised handling. The development of such protocols would also imply significant institutional knowledge about UAP behaviour and capabilities.\n\nRelevance: Operation Laser Strike is mentioned here as evidence of the institutional depth of the UAP response framework — suggesting that the phenomenon has been integrated into military planning at a level far beyond what official public statements have acknowledged."
  },

  "ffrdcs_y_uarcs": {
    name_en: "FFRDCs and UARCs",
    role_en: "Federally Funded Research: The Government's Institutional Framework",
    group_en: "Government Programs",
    bio_en: "Overview: Federally Funded Research and Development Centers (FFRDCs) and University Affiliated Research Centers (UARCs) are quasi-governmental research organisations that operate at the intersection of government, academia and industry. They include institutions such as RAND Corporation, MITRE Corporation, MIT Lincoln Laboratory, Aerospace Corporation, and the national laboratories (Los Alamos, Sandia, Lawrence Livermore). These entities have permanent security clearances, long-term government relationships and access to classified data that goes beyond what any typical government contractor has.\n\nRelevance to UAP: In the UAP context, FFRDCs and UARCs are relevant because they represent the institutional architecture through which classified UAP research could be conducted with both scientific credibility and deep secrecy. An FFRDC like MITRE has the mandate to conduct long-term strategic research for multiple government clients simultaneously — and would be well-positioned to serve as a coordination point for UAP-related technical analysis across agency boundaries.\n\nThe MITRE-Jason Connection: The Jason Advisory Group, an elite group of academic scientists working on classified defence problems since 1960, is administered through MITRE. UAP Gerb has argued that Jason's role in evaluating exotic technologies makes it a plausible candidate for scientific assessment of recovered materials — providing the academic credibility layer that raw contractor analysis might lack."
  },

  "rs_33": {
    name_en: "RS/33 (Gabinetto RS/33)",
    role_en: "Mussolini's Secret UAP Cabinet",
    group_en: "Government Programs",
    bio_en: "Overview: RS/33 (Regia Società 33, or more likely Raccolta Straordinaria 33) was an alleged secret research cabinet established by Mussolini's fascist Italian government following the reported 1933 Magenta crash. According to documents received by researcher Roberto Pinotti in 1996, this cabinet was attached to the Royal Academy of Italy and tasked with studying the recovered craft and biological material.\n\nDocumentation: The RS/33 documentation consists of a nine-point protocol, an organisational chart (listing Mussolini, Foreign Minister Ciano, Air Marshal Balbo, astronomer Cecchini and possibly Marconi), and a series of telegrams from the Stefani news agency classifying information about the crash with highest priority. Forensic analysis by the Tribunal of Como confirmed the documents' paper, ink and handwriting as authentic to the period.\n\nContext: RS/33 would represent the first documented government UAP research program in history — predating the U.S. programs (Sign, Grudge, Blue Book) by over a decade and establishing the foundational pattern: immediate military response, scientific analysis, total secrecy, and inter-agency compartmentalisation. Luis Elizondo confirmed in 2021 that he had seen authentic Mussolini-era documentation about the Magenta event through his intelligence sources."
  },

  "eg_g_special_projects": {
    name_en: "EG&G Special Projects",
    role_en: "The Contractor That Managed Area 51",
    group_en: "Defence Contractors",
    bio_en: "Overview: EG&G (Edgerton, Germeshausen and Grier) was one of the most secretive U.S. government contractors of the Cold War era, managing the most classified aspects of nuclear testing and special access programs. The company operated the Janet Airlines fleet (unmarked aircraft that transport workers to Area 51 and other classified sites) and managed the Tonopah Test Range and Nevada Test Site operations. It was acquired by URS Corporation in 1999 and subsequently by AECOM.\n\nThe UAP Connection: Multiple researchers have identified EG&G as one of the key nodes in the UAP legacy programs structure — specifically for its role in providing logistics, security and transportation for classified materials and personnel. Bob Lazar claimed that his transport to Site S-4 used aircraft operated by EG&G. The 'Wilson-Davis Memo' describes the oversight committee of a contractor program consistent with EG&G's known structure and security protocols.\n\nRelevance: EG&G represents the 'invisible contractor' dimension of the UAP infrastructure: a company so deeply embedded in the most secret government operations that its very name rarely appeared in public records, yet which managed the physical infrastructure through which classified programs actually operated."
  },

  "galileo_sidekick_y_looking_glass": {
    name_en: "Galileo, Sidekick and Looking Glass",
    role_en: "The Alleged Inner Programs",
    group_en: "Government Programs",
    bio_en: "Overview: 'Galileo', 'Sidekick' and 'Looking Glass' are names that have appeared in various whistleblower testimonies as alleged program names within the broader UAP recovery and study enterprise. 'Galileo' was the name Bob Lazar attributed to the project under which he claimed to have studied recovered craft propulsion at Site S-4. 'Looking Glass' has appeared in multiple testimonies as a programme potentially related to the study of non-linear time or dimensional technology. 'Sidekick' has appeared in fewer testimonies but is associated with similar themes.\n\nStatus: None of these programme names has been officially confirmed or denied. The FOIA requests for documents referencing these names have either produced no results or heavily redacted documents. Their persistence across multiple independent testimonies — from different whistleblowers who claim not to have been in contact with each other — gives them slightly more evidentiary weight than a single-source claim.\n\nRelevance: These programme names illustrate the broader challenge of evaluating UAP whistleblower testimony: enough independent sources use similar names and describe similar structures to suggest a shared reality, but the evidence falls short of the documentary verification needed to confirm the details."
  },

  "el_comite_vigilante": {
    name_en: "The Oversight Committee",
    role_en: "The Hidden Controllers of the Programme",
    group_en: "Government Programs",
    bio_en: "Overview: The 'Oversight Committee' (Comité Vigilante in Spanish UAP discourse) refers to the three-person supervisory structure described in the Wilson-Davis Memo as controlling access to and knowledge of the most sensitive UAP recovery and reverse engineering programmes held within private contractor facilities.\n\nStructure: According to the memo, the committee consists of: (1) a security director typically drawn from the NSA; (2) an internal programme director from the contractor; and (3) a corporate lawyer. This structure gives legal authority to deny access even to the most senior government officials — as demonstrated by Wilson's failed attempt to access the programme despite his DIA director rank.\n\nSignificance: If the Oversight Committee structure is real, it represents the core mechanism through which the most sensitive UAP programmes have been kept secret for decades. It is not a conspiracy in the conventional sense — it is a formalised bureaucratic structure with legal authority, operating within recognised frameworks of classified programme management, but doing so in a way that effectively removes these programmes from any meaningful democratic oversight."
  },

  "edwards_afb": {
    name_en: "Edwards AFB",
    role_en: "The Test Facility Where UFOs Were Also Tested",
    group_en: "Government Programs",
    bio_en: "Overview: Edwards Air Force Base in California is the primary advanced aircraft flight testing facility in the U.S., home to the Air Force Test Center (AFTC) and NASA's Armstrong Flight Research Center. It is where virtually every advanced American military aircraft has been tested, from the X-series experimental aircraft to the B-2 and F-22.\n\nThe UAP Connection: Multiple UAP researchers, particularly UAP Gerb, have documented alleged connections between Edwards and UAP reverse engineering programmes. President Eisenhower's alleged meeting with extraterrestrials at Edwards in 1954 is one of the most frequently cited stories in disclosure circles, though evidence for it consists entirely of third-hand accounts. More substantively, the presence of advanced aircraft testing infrastructure and the precedent of developing technologies with no acknowledged aeronautical lineage makes Edwards a plausible location for testing UAP-derived propulsion concepts.\n\nThe Test Pilot Testimony: Former USAF test pilot Captain Robert Collins and others have described classified research at Edwards into unconventional propulsion systems that seemed inconsistent with conventional aeronautical R&D. While these testimonies are not definitively verifiable, they are consistent with the broader pattern of classified advanced propulsion research described by multiple independent sources."
  },

  "sarbacher_y_el_grupo_secreto_de_recuperacion": {
    name_en: "Sarbacher and the Secret Recovery Group",
    role_en: "The First Insider Confirmation",
    group_en: "Government Programs",
    bio_en: "See the Dr. Robert Irving Sarbacher person node for full biography. This programme node represents the secret recovery group that Sarbacher confirmed existed — the small team led by Dr. Vannevar Bush that studied recovered UAP materials in the late 1940s and early 1950s.\n\nStructure: Based on Sarbacher's testimony and subsequent research, this group appears to have operated within the Research and Development Board (RDB) of the Department of Defense, with Vannevar Bush as the senior scientific authority. Other possible members included James Forrestal (Secretary of Defense, 1947–1949) and General Nathan Twining.\n\nSignificance: The Sarbacher-confirmed recovery group is the documented origin point of the institutional UAP secrecy structure that subsequent researchers have traced through to the present day. If a recovery group existed under Bush's direction in 1947–1952, its institutional descendants — whatever form they took — would be the direct precursors of the programs described by Grusch, Wilson and others."
  },

  "philip_corso_y_el_ejercito_como_canal_de_transfere": {
    name_en: "Philip Corso and the Army as Technology Transfer Channel",
    group_en: "Government Programs",
    bio_en: "See the Colonel Philip J. Corso person node for full biography. This concept node represents the 'technology seeding' mechanism Corso described — the use of the Army's Foreign Technology Desk as a conduit for transferring alleged UAP-derived materials to private contractors (Bell Labs, IBM, Hughes Aircraft, Dow Corning) as 'foreign technology' to be reverse engineered and commercialised.\n\nThe Technology Seeding Thesis: If Corso's account is accurate, it would explain several otherwise puzzling accelerations in 20th-century technology: the rapid commercialisation of transistors (Bell Labs, 1947–1952), integrated circuits, fiber optics and night vision, all of which underwent unusually rapid development in the years immediately following Roswell. Critics note that the timelines for these developments don't perfectly align with a Roswell-origin thesis, but Corso's defenders argue that analysis of the recovered materials preceded practical implementation by years.\n\nRelevance: The Army-as-transfer-channel concept is important because it suggests a different model for UAP programme structure than the SAP contractor model: instead of classified continuous research, materials were distributed for independent commercial development, maintaining secrecy through the dispersal of fragments rather than centralisation."
  },

  "el_nodo_manhattan_uap": {
    name_en: "The Manhattan UAP Node",
    role_en: "The Nuclear-UAP Interface",
    group_en: "Government Programs",
    bio_en: "Overview: The 'Manhattan UAP Node' concept refers to the documented pattern of correlation between nuclear programme activities (the Manhattan Project sites, nuclear tests, weapons storage facilities) and UAP incidents — a connection so consistent across decades and geographies that many researchers consider it one of the most significant patterns in the entire UAP corpus.\n\nKey Connections: Trinity 1945 (UAP crash near the first atomic test site), Roswell 1947 (near Alamogordo and RAAF nuclear base), Green Fireballs (over Los Alamos and Sandia), Malmstrom 1967 (ICBM deactivation), Autumn 1975 (USAF nuclear base wave), Rendlesham 1980 (nuclear weapons storage). The pattern holds across the U.S., USSR, France and UK.\n\nInterpretations: Various hypotheses have been proposed: UAPs monitor nuclear technology out of concern about humanity's destructive capability; nuclear tests produce energy signatures that attract UAPs; UAP recovery sites were deliberately located near nuclear facilities for research synergies; or the correlation is coincidental, reflecting the fact that nuclear facilities are among the most monitored and staffed locations, therefore generating more sightings. Researcher Robert Hastings has documented over 150 cases of UAPs over nuclear facilities, making the statistical argument for intentionality compelling regardless of interpretation."
  },

  "dumbs": {
    name_en: "DUMBs (Deep Underground Military Bases)",
    role_en: "The Underground Infrastructure",
    group_en: "Government Programs",
    bio_en: "Overview: Deep Underground Military Bases (DUMBs) are classified underground military facilities constructed during the Cold War — and allegedly continuing to be built — for command-and-control continuity, classified weapons storage and advanced research. Known legitimate facilities include the Cheyenne Mountain Complex (NORAD), Raven Rock Mountain Complex, and Site R. Alleged classified facilities are far more numerous.\n\nThe UAP Connection: Multiple UAP whistleblowers have described underground facilities as key locations for UAP-related programs: storage of recovered craft, biological research on non-human entities, and reverse engineering activities. Bob Lazar described Site S-4 as a set of underground hangars. David Grusch, while not specifying locations, confirmed the existence of off-base facilities outside normal oversight.\n\nEvidentiary Status: The existence of a classified underground facility network beyond publicly acknowledged facilities is difficult to evaluate. Satellite imagery and geological surveys have identified anomalous underground construction at multiple locations. The level of secrecy applied to some nuclear and classified military sites makes independent verification practically impossible.\n\nRelevance: Whether or not DUMBs house UAP-related programs specifically, the documented existence of a parallel classified physical infrastructure — separate from the publicly acknowledged military base network — is itself significant evidence that the government's classified activities extend far beyond what is publicly acknowledged."
  },

  "hidden_wing": {
    name_en: "Hidden Wing",
    role_en: "The USAF's Secret UAP Program",
    group_en: "Government Programs",
    bio_en: "Overview: 'Hidden Wing' is the alleged name of a classified USAF programme specifically dedicated to UAP reverse engineering, documented by researcher UAP Gerb in his investigative series on USAF legacy programs. The programme allegedly operates within the Air Force Material Command (AFMC) structure, using the Foreign Technology Division (now NASIC) as its analytic backbone.\n\nStructure: According to Gerb's research, Hidden Wing represents the Air Force's parallel to the Navy/DoD AATIP/AAWSAP effort — an Air Force-specific programme for studying recovered non-human technology that predates the modern disclosure era and has operated continuously since the late 1940s. Its existence would explain why multiple Air Force witnesses describe classified UAP research without being able to link it to officially acknowledged programmes.\n\nRelevance: The Hidden Wing concept illustrates the broader thesis that each military branch maintained its own classified UAP investigation and reverse engineering capacity, operating in parallel and in compartmentalised isolation from each other — which would explain why even senior officials across branches had difficulty obtaining a complete picture of the full programme scope."
  },

  "trw_systems_y_bdm_international": {
    name_en: "TRW Systems and BDM International",
    role_en: "The Intelligence Contractors",
    group_en: "Defence Contractors",
    bio_en: "Overview: TRW Systems and BDM International were major U.S. defence contractors that, according to UAP researcher UAP Gerb, played significant roles in classified UAP legacy programmes alongside Northrop Grumman, SAIC and Lockheed Martin.\n\nTRW Systems: TRW was a major space and defence contractor, now part of Northrop Grumman (acquired 2002). It was responsible for major satellite systems and held extensive classified contracts with the NRO and other intelligence agencies. Its space intelligence work would have provided natural overlap with any programme monitoring or analysing anomalous space objects.\n\nBDM International: BDM International was a defence analytics and intelligence consulting firm (acquired by TRW in 1997). It provided classified analytical services to multiple government clients and was identified by some researchers as having participated in classified assessments of UAP-related materials.\n\nRelevance: TRW/BDM represents the intelligence analytics dimension of the UAP contractor landscape — companies providing not physical engineering but classified analysis and strategic assessment that would be essential for making sense of recovered materials and ongoing UAP activity patterns."
  },

  "aawsap": {
    name_en: "AAWSAP",
    role_en: "The Real Pentagon UAP Program",
    group_en: "Government Programs",
    bio_en: "Overview: AAWSAP (Advanced Aerospace Weapon System Applications Program) was the classified predecessor to the publicly named AATIP, awarded as a $22 million DIA contract to Robert Bigelow's BAASS in 2008 and running until 2012. Created and directed by Dr. James Lacatski of the DIA, it was the most comprehensive and expensive government UAP research programme ever acknowledged.\n\nScope: AAWSAP investigated not just UAP sightings but a broad range of anomalous phenomena, including cattle mutilations, poltergeist activity and the full gamut of experiences at Skinwalker Ranch. This breadth — far beyond standard aeronautical analysis — was a deliberate choice by Lacatski, who believed the phenomenon required a holistic scientific approach.\n\nThe 38 DIRDs: Under AAWSAP, 38 Defense Intelligence Reference Documents (DIRDs) were produced by leading physicists covering topics including warp drive, wormhole physics, traversable wormholes, dark energy and inertial mass reduction — effectively a classified physics crash course in UAP propulsion concepts.\n\nRelevance: AAWSAP is significant because it demonstrates the U.S. government's willingness to fund serious, expensive research into phenomena that officially did not exist — and to commission theoretical physics work that presupposes the reality of UAP propulsion."
  },

  "los_peads_de_eisenhower": {
    name_en: "Eisenhower's PEADs",
    role_en: "The Presidential Emergency Action Documents",
    group_en: "Government Programs",
    bio_en: "Overview: Presidential Emergency Action Documents (PEADs) are pre-drafted executive orders and proclamations prepared for use in extreme national emergencies, allowing the President to take sweeping unilateral actions without Congressional approval. Their existence has been confirmed in general terms, but their specific contents are among the most closely held secrets in the U.S. government — reportedly never shared with Congress.\n\nThe UAP Connection: Researchers have speculated that some PEADs may contain provisions related to UAP disclosure — either authorising emergency disclosure under specific circumstances, or establishing command authority over UAP programmes in ways that bypass normal oversight. This speculation is consistent with the broader pattern of UAP programme management being routed outside normal oversight channels.\n\nEisenhower's Legacy: President Eisenhower's tenure (1953–1961) coincides with the period when the modern UAP secrecy structure was consolidated — post-Roswell, post-Robertson Panel, during the height of the Cold War. His farewell warning about the military-industrial complex, and accounts of his frustrated attempts to be briefed on classified programmes, suggest he may have been more personally invested in UAP matters than has been publicly acknowledged. The PEADs issued during his administration could contain the original authorising documents for the UAP programme structures that subsequent whistleblowers have described."
  },

  "operation_yellow_fruit": {
    name_en: "Operation Yellow Fruit",
    role_en: "The Black Program That Overlaps with UAP",
    group_en: "Government Programs",
    bio_en: "Overview: Operation Yellow Fruit was a classified U.S. Army intelligence programme active in the 1980s, exposed when several of its members were prosecuted for financial fraud. The programme operated under the Army's Intelligence Support Activity (ISA) and was designed to create 'cover businesses' that could fund covert operations without congressional appropriations oversight.\n\nThe UAP Intersection: The Operation Yellow Fruit case is relevant to UAP research because it demonstrated that the U.S. military was capable of and willing to operate entirely off-budget covert programmes using commercial cover, exactly the funding mechanism that David Grusch described for UAP recovery programmes. The prosecution revealed that the programme had diverted millions of dollars into unauthorised activities while maintaining plausible deniability through complex financial structures.\n\nRelevance: Yellow Fruit is a documented historical precedent for the exact type of financial irregularity Grusch alleged in the UAP context — demonstrating that these are not hypothetical mechanisms but tested practices with documented historical precedents. The fact that similar structures existed for conventional covert operations significantly strengthens the plausibility of Grusch's allegations."
  },

  "stardust": {
    name_en: "Stardust",
    role_en: "Alleged Advanced UAP Material Programme",
    group_en: "Government Programs",
    bio_en: "Overview: 'Stardust' is an alleged programme name that has appeared in UAP whistleblower testimonies in connection with the collection, storage and analysis of recovered non-human materials. Unlike better-documented programme names, Stardust has fewer corroborating sources but appears in the context of DOE/NNSA-connected programmes.\n\nContext: The name has surfaced in connection with the Sandia National Laboratories and Los Alamos network, suggesting that if the programme exists, it operates within the DOE laboratory infrastructure rather than the DoD contractor network. This would be consistent with the DOE's unique legal authority under the Atomic Energy Act to classify materials recovered from anomalous sources as 'transclassified foreign nuclear material'.\n\nRelevance: Stardust, like Galileo and Looking Glass, is mentioned here as an example of the programme names that appear across multiple independent testimonies — suggesting that a named programme infrastructure exists even if the specific operational details cannot be confirmed from public sources."
  },

  "quantum_generative_materials": {
    name_en: "Quantum Generative Materials",
    role_en: "The Physics of Recovered Materials",
    group_en: "Government Programs",
    bio_en: "Overview: 'Quantum Generative Materials' refers to a theoretical class of exotic materials that would be capable of generating energy from quantum vacuum fluctuations or manipulating spacetime at a local level — properties that would be required for any UAP propulsion system operating on the principles described by witnesses. The term has appeared in the context of AATIP/AAWSAP research and in the broader physics literature on exotic propulsion.\n\nScientific Context: Hal Puthoff and Eric Davis have both written about the theoretical possibility of materials that could couple to quantum vacuum energy, and the potential for such materials to enable propulsion without conventional fuel consumption. Garry Nolan's analysis of alleged UAP-origin metamaterials found isotopic ratios inconsistent with terrestrial manufacturing — raising the possibility that the materials themselves encode information about non-human manufacturing processes.\n\nRelevance: The concept of quantum generative materials represents the theoretical physics endpoint of the UAP reverse engineering hypothesis: if the recovered craft operated on principles related to zero-point energy or quantum vacuum manipulation, then the materials from which they were constructed would themselves show evidence of those principles — and their analysis would be the key to replicating the underlying technology."
  },

  "apro": {
    name_en: "APRO (Aerial Phenomena Research Organization)",
    role_en: "The First Serious Civilian UAP Research Body",
    group_en: "Disclosure Organisations",
    bio_en: "Overview: The Aerial Phenomena Research Organization (APRO) was founded in 1952 by Jim and Coral Lorenzen in Tucson, Arizona, and operated until 1988. It was the first serious civilian UAP research organisation with a scientific advisory board including physicists, astronomers and medical professionals.\n\nSignificance: APRO predates NICAP and operated for 36 years, producing one of the most extensive physical evidence case files in civilian UAP research. Its advisors included figures such as Dr. James Harder (civil engineering, Berkeley) and Dr. Leo Sprinkle (psychology, University of Wyoming). The organisation's focus on physical evidence — trace marks, physiological effects, electromagnetic interference — established methodological precedents that later organisations followed.\n\nThe APRO-Intelligence Connection: FOIA documents revealed that APRO, like NICAP, was monitored by the intelligence community. Some researchers have suggested that the simultaneous monitoring and occasional apparent cooperation between APRO and government agencies suggests a more complex relationship than simple surveillance — possibly including the use of civilian organisations as collection points for UAP data that the government could access without official resources.\n\nRelevance: APRO represents the serious civilian scientific tradition of UAP research — an organisation that maintained scientific standards over three decades and accumulated evidence that continues to inform modern research, yet operated entirely outside institutional support and is now largely forgotten outside specialist circles."
  },

  "el_foreign_material_exploitation": {
    name_en: "Foreign Material Exploitation (FME)",
    role_en: "The Official Mechanism and its UAP Extension",
    group_en: "Government Programs",
    bio_en: "Overview: Foreign Material Exploitation (FME) is the official U.S. military programme for obtaining, analysing and exploiting foreign-manufactured military equipment for intelligence and countermeasure development. It is a legitimate, well-documented programme operating through the Defense Intelligence Agency and multiple military service commands. Its relevance to UAP research is that it provides the bureaucratic and legal template within which non-human technology analysis could be conducted.\n\nThe Corso Mechanism: Colonel Philip Corso claimed that recovered UAP materials were channelled through the Army's Foreign Technology Division — a component of the FME apparatus — as 'foreign technology' to civilian contractors. Whether or not Corso's specific account is accurate, the FME structure provides exactly the kind of bureaucratic cover that would be needed: classified materials can be introduced into the FME system with a 'foreign origin' designation without specifying what country or entity they came from.\n\nCurrent Structure: Modern FME activities are coordinated through the Foreign Materiel Intelligence Branch (FMIB) of the Defense Intelligence Agency and service-specific intelligence commands. The classified budget for FME activities is substantial, and the programme operates with extensive legal authorities for acquiring and analysing foreign technology that would extend, at least technically, to materials of unknown origin.\n\nRelevance: Understanding FME is essential to understanding how UAP materials could be studied within the U.S. government structure without creating a paper trail labelled 'alien technology' — a categorisation that would trigger both legal and oversight requirements that the programme managers apparently wished to avoid."
  },
};

// ── Additional group translations ──────────────────────────────────────────
const EXTRA_GROUPS = {
  "Organizaciones de Divulgación": "Disclosure Organisations",
  "Marco Legislativo":             "Legislative Framework",
  "Empresas Privadas UAP":         "Private UAP Companies",
  "Contratistas de Defensa":       "Defence Contractors",
  "Agencias de Inteligencia":      "Intelligence Agencies",
  "Programas Gubernamentales":     "Government Programs",
  "Incidentes Nucleares":          "Nuclear Incidents",
  "Audiencias y Divulgación":      "Hearings & Disclosure",
  "Contacto y Testigos Civiles":   "Contact & Civilian Witnesses",
  "Avistamientos Militares":       "Military Sightings",
  "Crashes y Recuperaciones":      "Crashes & Recoveries",
  "Canales":                       "Channels",
  "Figuras Históricas":            "Historical Figures",
  "Científicos e Investigadores":  "Scientists & Researchers",
  "Periodistas Clave":             "Key Journalists",
  "Whistleblowers y Testigos":     "Whistleblowers & Witnesses",
  "Figuras Militares":             "Military Figures",
  "Figura política":               "Political Figure",
};

// ── Apply v3 translations ─────────────────────────────────────────────────
let updated = 0;
for (const node of data.nodes) {
  const over = V3[node.id];
  if (!over) continue;
  if (over.name_en  !== undefined) node.name_en  = over.name_en;
  if (over.role_en  !== undefined) node.role_en  = over.role_en;
  if (over.bio_en   !== undefined) node.bio_en   = over.bio_en;
  if (over.group_en !== undefined) node.group_en = over.group_en;
  updated++;
}

// Apply group translations to ALL nodes (catch any remaining Spanish groups)
let groupsFixed = 0;
for (const node of data.nodes) {
  const en = EXTRA_GROUPS[node.group] || GROUP_EN[node.group];
  if (en && node.group_en === node.group) { node.group_en = en; groupsFixed++; }
  else if (en && !node.group_en) { node.group_en = en; groupsFixed++; }
}

// Also fix role_en and name_en for nodes that still have Spanish (bio_en fixed, but role/name might not be)
// Translate common Spanish role phrases
const ROLE_MAP = {
  "Gimbal, GoFast y el Estigma": "Gimbal, GoFast and the Stigma",
  "El Caballo de Troya de la Divulgación": "The Trojan Horse of Disclosure",
  "Los Pilotos que Rompieron el Silencio": "The Pilots Who Broke the Silence",
  "Las Organizaciones Civiles de Investigación": "The Civilian Research Organisations",
  "La Física de Frontera": "Frontier Physics",
  "El Cambio más Importante": "The Most Important Change",
  "Cuando un Gobierno Decide Ser Transparente": "When a Government Decides to Be Transparent",
  "El Rigor que Faltaba": "The Missing Rigour",
  "La Búsqueda Científica Oficial": "The Official Scientific Search",
  "La Estructura del Secreto Máximo": "The Structure of Maximum Secrecy",
  "El Almirante que No Pudo Acceder": "The Admiral Who Was Denied Access",
  "El Almacén de los Secretos": "The Warehouse of Secrets",
  "El Archivo FOIA más Grande del Mundo": "The World's Largest FOIA Archive",
  "El Canal Legal de los Whistleblowers": "The Legal Channel for Whistleblowers",
  "El Modelo Para la Divulgación UAP": "The Model for UAP Disclosure",
  "Lo que el Congreso Sabe y no Puede Decir": "What Congress Knows and Cannot Say",
  "El Presupuesto Negro y la Financiación del Secreto": "The Black Budget and the Financing of Secrecy",
  "El Programa de Recopilación UAP más Secreto": "The Most Secret UAP Collection Programme",
  "El Secreto Dentro del Secreto": "The Secret Within the Secret",
  "La Tecnología Avanzada como Puente": "Advanced Technology as Bridge",
  "El Estado Actual de la Divulgación": "The Current State of Disclosure",
  "El Equipo de Emergencia Nuclear como Programa de Recuperación UAP": "The Nuclear Emergency Team as UAP Recovery Program",
  "El Arsenal Científico del Secreto UAP": "The Scientific Arsenal of the UAP Secret",
  "Los Satélites que Vieron Todo y el Programa Immaculate Constellation": "The Satellites That Saw Everything and the Immaculate Constellation Programme",
  "De Hoover a los Documentos Digitales": "From Hoover to Digital Documents",
  "La Red Total": "The Total Network",
  "OVNIs Sobre los Secretos Nucleares de Nuevo México": "UFOs Over New Mexico's Nuclear Secrets",
  "Diez Misiles Nucleares Desactivados Simultáneamente": "Ten Nuclear Missiles Simultaneously Deactivated",
  "El Almacén Nuclear y los Destellos": "The Nuclear Storage Area and the Light Beams",
  "La Ola de Incursiones en Bases Nucleares de la USAF": "The Wave of USAF Nuclear Base Incursions",
  "La Ciencia Desafía a la USAF": "Science Challenges the USAF",
  "Los Pilotos Comerciales Hablan": "Commercial Pilots Speak Out",
  "La Gran Revelación del AATIP": "The Great AATIP Revelation",
  "La Marina Reconoce los Videos": "The Navy Acknowledges the Videos",
  "El Gobierno Admite 143 Casos Sin Explicación": "The Government Admits 143 Unexplained Cases",
  "Grusch, Fravor y Graves Bajo Juramento": "Grusch, Fravor and Graves Under Oath",
  "El Primer Caso de Abducción Documentado": "The First Documented Abduction Case",
  "La Abducción con Siete Testigos": "The Abduction with Seven Witnesses",
  "La Primera Gran Filtración Técnica": "The First Major Technical Leak",
  "62 Niños y la Nave en el Patio del Recreo": "62 Children and the Craft in the Schoolyard",
  "Los Objetos Filmados en TV": "Objects Filmed on TV",
  "El Disco Bajo las Nubes": "The Disc Under the Clouds",
  "El Año que Todo Cambió": "The Year Everything Changed",
  "El Crash del Desierto y el Ingeniero": "The Desert Crash and the Engineer",
  "Primer Piloto Muerto en Intercepción": "First Pilot Killed in Intercept",
};

let rolesFixed = 0;
for (const node of data.nodes) {
  const enRole = ROLE_MAP[node.role];
  if (enRole && (node.role_en === node.role || !node.role_en)) {
    node.role_en = enRole;
    rolesFixed++;
  }
  // Also fix name_en for Spanish names
  const spanishNames = {
    "Caso Magenta, Italia": "Magenta Case, Italy",
    "Roswell, Nuevo México": "Roswell, New Mexico",
    "Aztec, Nuevo México": "Aztec, New Mexico",
    "Coyame, México": "Coyame, Mexico",
    "La Ola de 1947": "The 1947 Wave",
    "Kingman, Arizona": "Kingman, Arizona",
    "Tehran, Irán": "Tehran, Iran",
    "Las Luces de Phoenix": "The Phoenix Lights",
    "La Anomalía del Mar Báltico": "The Baltic Sea Anomaly",
    "La Ola de Triángulos de Bélgica": "The Belgian Triangle Wave",
    "Otoño de 1975": "Autumn of 1975",
    "Primera Audiencia del Congreso": "First Congressional Hearing",
    "Proyecto de Revisión de la FAA": "FAA Review Project",
    "Desclasificación Parcial del DoD": "Partial DoD Declassification",
    "Informe UAPTF": "UAPTF Report",
    "Primera Audiencia Pública del Congreso sobre UAPs en 54 Años": "First Public Congressional Hearing on UAPs in 54 Years",
    "Audiencia Histórica": "The Historic Hearing",
    "Betty y Barney Hill": "Betty and Barney Hill",
    "El Caso Kaikoura, Nueva Zelanda": "The Kaikoura Case, New Zealand",
    "La Ola de Triángulos de Bélgica": "The Belgian Triangle Wave",
    "El Memo Wilson-Davis": "The Wilson-Davis Memo",
    "Almirante Thomas Wilson": "Admiral Thomas Wilson",
    "La NDAA y la Obligación Legislativa de Investigar UAPs": "The NDAA and the Legislative Mandate to Investigate UAPs",
    "Las Protecciones para Whistleblowers UAP": "UAP Whistleblower Protections",
    "El GEIPAN Francés": "The French GEIPAN",
    "El Programa SAP No Autorizado": "The Unauthorised SAP Program",
    "La DIA y la Inteligencia sobre Tecnología No Humana": "The DIA and Intelligence on Non-Human Technology",
    "El NRO y los Satélites que lo Vieron Todo": "The NRO and the Satellites That Saw Everything",
    "El FBI y el Fenómeno": "The FBI and the Phenomenon",
    "UAP Media UK y el Periodismo de Investigación Internacional": "UAP Media UK and International Investigative Journalism",
    "The Phenomenon y el Documental como Herramienta de Divulgación": "The Phenomenon and the Documentary as a Disclosure Tool",
    "CUFOS y el Legado Científico de Hynek": "CUFOS and Hynek's Scientific Legacy",
    "El Inspector General de la Comunidad de Inteligencia": "The Intelligence Community Inspector General",
    "La Ley de Registros de JFK": "The JFK Records Act",
    "Las Audiencias Clasificadas": "The Classified Briefings",
    "El Área 51 (Groom Lake)": "Area 51 (Groom Lake)",
    "Fenix Space y la Nueva Generación de Empresas Aeroespaciales Privadas": "Fenix Space and the New Generation of Private Aerospace Companies",
    "El Complejo de Inteligencia y la Comunidad de los 17": "The Intelligence Complex and the Community of 17",
    "La Era Post-Grusch": "The Post-Grusch Era",
    "General Dynamics y el Complejo Industrial-Militar de la Defensa": "General Dynamics and the Military-Industrial Complex",
    "Los Metamateriales": "The Metamaterials",
    "Las Patentes de la Marina": "The Navy Patents",
    "EarthTech International y el Institute for Advanced Studies": "EarthTech International and the Institute for Advanced Studies",
    "Coronel Philip J. Corso": "Colonel Philip J. Corso",
    "Proyecto Galileo (Avi Loeb)": "The Galileo Project (Avi Loeb)",
    "El Memo Wilson-Davis": "The Wilson-Davis Memo",
    "La Era Post-Grusch": "The Post-Grusch Era",
    "Proyecto de Revisión de la FAA": "FAA Review Project",
  };
  const enName = spanishNames[node.name];
  if (enName && (node.name_en === node.name || !node.name_en)) {
    node.name_en = enName;
  }
}

console.log(`✅ Nodes updated: ${updated} with v3 translations`);
console.log(`✅ Groups fixed for additional nodes: ${groupsFixed}`);
console.log(`✅ Roles translated: ${rolesFixed}`);

// Verify: how many nodes still have bio_en === bio?
const stillSpanish = data.nodes.filter(n => (n.bio_en||'') === (n.bio||'') && (n.bio||'').length > 20);
console.log(`\n⚠️  Nodes still with Spanish bio_en: ${stillSpanish.length}`);
if (stillSpanish.length > 0) {
  console.log('   IDs:', stillSpanish.map(n => n.id).join(', '));
}

// ── Write back ─────────────────────────────────────────────────────────────
const out = `// REDESCUBRIENDO — Dataset
// Nodes: ${data.nodes.length} — Edges: ${data.edges.length} — Threads: ${data.threads.length}
// Generado automáticamente por scripts/build-data.js. NO EDITAR A MANO.
// Para regenerar: npm run build

window.RDC_DATA = ${JSON.stringify(data, null, 2)};
`;
fs.writeFileSync(filePath, out, 'utf8');
console.log('\n✅ data.js written.');
