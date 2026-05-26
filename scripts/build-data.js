#!/usr/bin/env node
// REDESCUBRIENDO — build-data.js
//
// Regenera /data.js a partir de:
//   - source/corpus_full.json     (vídeos procesados del podcast)
//   - source/Personas.xlsx        (timeline KnightLab — personas)
//   - source/Eventos.xlsx         (timeline KnightLab — eventos)
//   - source/GruposProgramas.xlsx (timeline KnightLab — agencias + programas)
//
// Salida:
//   - data.js → window.RDC_DATA = { nodes, edges, threads }
//
// No edites data.js a mano. Si necesitas cambios:
//   - Vídeos:        source/corpus_full.json
//   - Personas:      source/Personas.xlsx
//   - Eventos:       source/Eventos.xlsx
//   - Agencias/Prog: source/GruposProgramas.xlsx
//   - Hilos (threads), aliases, banned list, canales: este mismo fichero (constantes abajo).
//
// Tras editar cualquier source: `npm run build` y commit/push del data.js resultante.

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC  = path.join(ROOT, 'source');
const OUT  = path.join(ROOT, 'data.js');

// ============================================================
// 1. CANALES — 15 canales en el corpus, mapeados a 13 brazos de la galaxia.
// ============================================================
// `corpusName` debe coincidir EXACTAMENTE con la cadena del campo `canal` en
// corpus_full.json. `bloc` es el id 1..13 usado por graph.jsx para asignar
// brazo, y por panels.jsx para mostrar el chip.

const CHANNELS = [
  { id: 'ch_jesse_michels',                       name: 'American Alchemy (Jesse Michels)',  corpusName: 'Jesse Michels',                                bloc: 6 },
  { id: 'ch_documental_s4_luigi_project_gravitar', name: 'Documental S4 (Project Gravitar)',  corpusName: 'Documental S4 / Luigi (Project Gravitar)',     bloc: 6 },
  { id: 'ch_weaponized_jeremy_corbell_george_knapp', name: 'Weaponized (Corbell & Knapp)',    corpusName: 'Weaponized (Jeremy Corbell & George Knapp)',   bloc: 1 },
  { id: 'ch_jeremy_corbell',                      name: 'WEAPONIZED · Jeremy Corbell',         corpusName: 'Jeremy Corbell',                               bloc: 1 },
  { id: 'ch_jason_samosa',                        name: 'Jason Samosa',                        corpusName: 'Jason Samosa',                                 bloc: 2 },
  { id: 'ch_area52',                              name: 'Area52 / DEBRIEFED',                  corpusName: 'Area52',                                       bloc: 3 },
  { id: 'ch_the_sol_foundation',                  name: 'The Sol Foundation',                  corpusName: 'The Sol Foundation',                           bloc: 5 },
  { id: 'ch_richard_dolan_intelligent_disclosure', name: 'Intelligent Disclosure · Richard Dolan', corpusName: 'Richard Dolan Intelligent Disclosure',     bloc: 7 },
  { id: 'ch_ashton_forbes',                       name: 'Ashton Forbes',                       corpusName: 'Ashton Forbes',                                bloc: 8 },
  { id: 'ch_uap_gerb',                            name: 'UAP Gerb',                            corpusName: 'UAP Gerb',                                     bloc: 4 },
  { id: 'ch_newsnation',                          name: 'NewsNation / Reality Check',          corpusName: 'NewsNation',                                   bloc: 9 },
  { id: 'ch_that_ufo_podcast',                    name: 'That UFO Podcast',                    corpusName: 'That UFO Podcast',                             bloc: 10 },
  { id: 'ch_polarity',                            name: 'Polarity',                            corpusName: 'Polarity',                                     bloc: 11 },
  { id: 'ch_vetted',                              name: 'VETTED',                              corpusName: 'VETTED',                                       bloc: 12 },
  { id: 'ch_dr_steven_greer',                     name: 'Dr. Steven Greer',                    corpusName: 'Dr. Steven Greer',                             bloc: 13 }
];

const CHANNEL_BY_CORPUS_NAME = Object.fromEntries(CHANNELS.map(c => [c.corpusName, c]));

// ============================================================
// 2. NODO ESPECIAL — núcleo galáctico
// ============================================================

const PHENOMENON_NODE = {
  id: 'the_phenomenon',
  name: 'El fenómeno',
  role: 'El núcleo sin nombre',
  type: 'phenomenon',
  group: 'Núcleo galáctico',
  bio: "El centro de gravedad de esta galaxia es lo que las naciones, agencias y testigos han ido llamando de muchas formas: UAP, UFO, OVNI, Foo Fighters, NHI, Fastwalkers, USOs, fenómeno aéreo, fenómeno transmedium, no humanos…\n\nNinguno de esos nombres captura lo que realmente es. Lo único cierto, después de décadas de testimonios, materiales recuperados, físicos verificables y declaraciones oficiales bajo juramento, es que existe — y que durante mucho tiempo se ha tratado de negar, esconder, manipular o instrumentalizar.\n\nEs el agujero negro alrededor del cual orbita todo lo demás del corpus: cada persona, cada agencia, cada evento, cada programa secreto. Sin él, esta galaxia no existiría.",
  year: null,
  media: null,
  mediaCredit: '',
  mediaCaption: '',
  blocs: [],
  videos: [],
  videoCount: 0,
  canal: 0,
  degree: 0,
  fixed: true
};

// ============================================================
// 3. ALIASES — qué tokens detectar en los vídeos para considerar mención.
// ============================================================
// Reglas:
//   - Para personas, el alias por defecto es el nombre completo. Aquí añadimos
//     aliases adicionales útiles (apellido solo si único, apodos…).
//   - Para no-personas, el alias por defecto es el nombre corto (parte antes
//     del primer ":"). Aquí añadimos palabras clave reconocibles.
//   - Si un alias queda dentro de la BANNED_WORDS, se elimina.

const ALIASES_BY_ID = {
  // Personas — apellidos solos / apodos que disparan mención fiable.
  // Las KEYS deben coincidir con el ID que produce slugify(headline antes de ":").
  // Si añades una persona nueva y el slug colisiona, mira el log y ajusta.
  david_grusch:                        ['david grusch', 'grusch'],
  bob_lazar:                           ['bob lazar', 'lazar'],
  luis_elizondo:                       ['luis elizondo', 'elizondo', 'lue elizondo'],
  jeremy_corbell:                      ['jeremy corbell', 'corbell'],
  george_knapp:                        ['george knapp', 'knapp'],
  jacques_vallee:                      ['jacques vallee', 'vallee', 'jacques vallée', 'vallée'],
  j_allen_hynek:                       ['allen hynek', 'hynek', 'j allen hynek'],
  leslie_kean:                         ['leslie kean', 'kean'],
  christopher_mellon:                  ['christopher mellon', 'chris mellon', 'mellon'],
  ross_coulthart:                      ['ross coulthart', 'coulthart'],
  hal_puthoff_y_el_programa_baass:     ['hal puthoff', 'harold puthoff', 'puthoff'],
  jake_barber:                         ['jake barber'],
  jay_stratton:                        ['jay stratton', 'stratton'],
  eric_w_davis:                        ['eric w davis', 'eric davis'],
  travis_walton:                       ['travis walton'],
  coronel_philip_j_corso:              ['coronel corso', 'philip corso', 'philip j corso', 'corso'],
  john_e_mack:                         ['john mack', 'john e mack', 'dr mack'],
  diana_walsh_pasulka:                 ['diana pasulka', 'diana walsh pasulka', 'pasulka'],
  prof_garry_nolan:                    ['garry nolan', 'nolan'],
  avi_loeb:                            ['avi loeb', 'loeb'],
  john_b_alexander:                    ['john alexander', 'john b alexander', 'colonel alexander'],
  linda_moulton_howe:                  ['linda moulton howe', 'moulton howe'],
  matthew_brown:                       ['matthew brown', 'matt brown'],
  james_lacatski:                      ['james lacatski', 'lacatski'],
  beatriz_villarroel:                  ['villarroel', 'beatriz villarroel'],
  karl_nell:                           ['karl nell', 'carl nell'],
  salvatore_pais:                      ['salvatore pais', 'salvatore cesar pais'],
  anna_paulina_luna:                   ['paulina luna', 'anna paulina luna', 'rep luna'],
  eric_burlison:                       ['eric burlison', 'burlison'],
  rep_tim_burchett:                    ['tim burchett', 'burchett'],
  sgt_lyn_buchanan:                    ['lyn buchanan', 'buchanan'],
  skip_atwater:                        ['skip atwater', 'atwater'],
  joe_mcmoneagle:                      ['joe mcmoneagle', 'mcmoneagle'],
  russell_targ:                        ['russell targ', 'targ'],
  ryan_graves:                         ['ryan graves', 'graves'],
  david_fravor:                        ['david fravor', 'fravor'],
  bob_salas:                           ['bob salas', 'salas'],
  ralph_blumenthal:                    ['ralph blumenthal', 'blumenthal'],
  jim_semivan:                         ['jim semivan', 'semivan'],
  marco_rubio:                         ['marco rubio'],
  sen_kirsten_gillibrand:              ['kirsten gillibrand', 'gillibrand'],
  sen_mike_rounds:                     ['mike rounds', 'rounds'],
  andre_carson:                        ['andré carson', 'andre carson'],
  jared_moskowitz:                     ['jared moskowitz', 'moskowitz'],
  admiral_tim_gallaudet:               ['tim gallaudet', 'gallaudet'],
  michael_herrera:                     ['michael herrera'],
  edgar_mitchell:                      ['edgar mitchell'],
  almirante_thomas_wilson:             ['admiral wilson', 'almirante wilson', 'thomas wilson'],
  dr_robert_irving_sarbacher:          ['sarbacher', 'robert sarbacher'],
  arthur_stansel_jr_fritz_werner:      ['arthur stansel', 'stansel', 'fritz werner'],
  kirsan_ilyumzhinov:                  ['ilyumzhinov'],
  haim_eshed:                          ['haim eshed', 'eshed'],
  nick_pope:                           ['nick pope'],
  roberto_pinotti:                     ['roberto pinotti', 'pinotti'],
  kevin_knuth:                         ['kevin knuth', 'knuth'],
  harald_malmgren:                     ['harald malmgren', 'malmgren'],
  thomas_townsend_brown:               ['thomas townsend brown', 'townsend brown'],
  peter_levenda:                       ['peter levenda', 'levenda'],
  danny_sheehan:                       ['danny sheehan', 'sheehan'],
  richard_dolan:                       ['richard dolan', 'dolan'],
  dylan_borland:                       ['dylan borland', 'borland'],
  brett_feddersen:                     ['brett feddersen', 'feddersen'],
  john_blitch:                         ['john blitch', 'blitch'],
  angela_ford:                         ['angela ford'],
  carl_gustav_jung:                    ['carl gustav jung', 'carl jung', 'jung'],
  william_tompkins:                    ['william tompkins', 'tompkins'],
  carey_schmitt:                       ['carey schmitt'],
  timothy_tyler_d_taylor:              ['tyler d taylor', 'tim taylor'],

  // Eventos / casos — palabras clave reconocibles
  roswell_nuevo_mexico:                ['roswell'],
  caso_magenta_italia:                 ['magenta', 'magenta italia'],
  kingman_arizona:                     ['kingman'],
  coyame_mexico:                       ['coyame'],
  kecksburg_pennsylvania:              ['kecksburg'],
  rendlesham_forest_uk:                ['rendlesham'],
  rendlesham_woodbridge:               ['rendlesham', 'woodbridge'],
  varginha_brasil:                     ['varginha'],
  westall_australia:                   ['westall'],
  trinity_1945:                        ['trinity 1945', 'trinity nuevo méxico', 'trinity new mexico'],
  caso_manises:                        ['manises'],
  caso_mantell:                        ['mantell'],
  aztec_nuevo_mexico:                  ['aztec'],
  las_luces_de_phoenix:                ['phoenix lights', 'luces de phoenix'],
  uss_nimitz:                          ['uss nimitz', 'nimitz', 'tic tac', 'tictac'],
  japan_air_lines_1628:                ['japan air lines', 'jal 1628'],
  malmstrom_afb:                       ['malmstrom'],
  primera_audiencia_publica_del_congreso_sobre_uaps_: ['audiencia 2023', 'audiencia publica 2023'],
  audiencia_del_congreso_nov_2024:     ['audiencia 2024', 'audiencia noviembre 2024'],

  // Lugares / programas / agencias
  el_area_51_groom_lake:               ['area 51', 'groom lake'],
  bob_lazar_y_el_area_51:              ['lazar area 51'],
  skinwalker_ranch:                    ['skinwalker ranch', 'skinwalker'],
  wright_patterson_afb:                ['wright patterson', 'wright-patterson'],
  aatip:                               ['aatip'],
  aawsap:                              ['aawsap'],
  uaptf_y_aaro:                        ['aaro', 'uaptf'],
  informe_uaptf:                       ['informe uaptf', 'uaptf report'],
  el_inspector_general_de_la_comunidad_de_inteligenc: ['icig', 'inspector general'],
  mj_12_majestic_12:                   ['mj 12', 'mj-12', 'majestic 12', 'majestic-12'],
  el_memo_wilson_davis:                ['wilson davis', 'wilson-davis', 'memo wilson'],
  project_sign_grudge_y_blue_book:     ['blue book', 'project sign', 'project grudge', 'proyecto sign', 'proyecto grudge'],
  proyecto_stargate_cia_dia:           ['stargate', 'remote viewing', 'vision remota'],
  sol_foundation:                      ['sol foundation'],
  to_the_stars_academy_ttsa:           ['to the stars academy', 'ttsa', 'to the stars'],
  lockheed_martin_skunk_works:         ['lockheed', 'skunk works'],
  northrop_grumman_y_el_rancho_tejon:  ['northrop', 'northrop grumman', 'rancho tejon'],
  saic_science_applications_international_corporatio: ['saic'],
  bigelow_aerospace_baass:             ['bigelow', 'baass'],
  eg_g_special_projects:               ['eg&g', 'eg g'],
  mufon:                               ['mufon'],
  cufos:                               ['cufos'],
  el_uap_caucus_del_congreso:          ['uap caucus'],
  uap_disclosure_act:                  ['uap disclosure act', 'uapda'],
  la_ndaa_y_la_obligacion_legislativa_de_investigar_: ['ndaa', 'schumer amendment', 'enmienda schumer'],

  // Aliases extra para nodos legacy con nombres largos (recuperan cobertura)
  la_cia_y_el_fenomeno_ovni:                  ['cia'],
  bob_lazar_y_el_area_51:                     ['bob lazar', 'lazar', 'area 51'],
  david_grusch_event:                         ['david grusch', 'grusch'],
  boeing_y_el_fantasma_de_la_propulsion_avanzada: ['boeing', 'phantom works'],
  ttsa_y_el_contrato_con_el_ejercito:         ['ttsa', 'to the stars academy'],
  galileo_sidekick_y_looking_glass:           ['looking glass', 'sidekick', 'galileo project'],
  proyecto_galileo_avi_loeb:                  ['galileo project', 'proyecto galileo', 'avi loeb'],
  el_memorandum_twining:                      ['memorandum twining', 'twining'],
  el_informe_condon:                          ['informe condon', 'condon report'],
  la_ola_de_triangulos_de_belgica:            ['triangulos belgica', 'belgian triangle wave'],
  panel_robertson_cia:                        ['panel robertson', 'robertson panel'],
  americans_for_safe_aerospace_asa:           ['americans for safe aerospace', 'asa'],
  nicap_y_mufon:                              ['nicap'],
  cufos_y_el_legado_cientifico_de_hynek:      ['cufos'],
  sandia_national_laboratories:               ['sandia'],
  raytheon_bbn_technologies:                  ['raytheon', 'bbn technologies'],
  northrop_grumman:                           ['northrop', 'northrop grumman'],
  betty_y_barney_hill:                        ['betty y barney hill', 'barney hill', 'betty hill', 'hill abduction']
};

// Palabras genéricas que NUNCA deben usarse como alias (causarían falsos positivos).
const BANNED_WORDS = new Set([
  'uap', 'ovni', 'ufo', 'ufos', 'ovnis', 'el', 'la', 'los', 'las', 'de', 'del',
  'fenomeno', 'fenómeno', 'gobierno', 'eeuu', 'usa', 'estados unidos',
  'programa', 'programas', 'agencia', 'agencias', 'grupo', 'grupos',
  'caso', 'casos', 'incidente', 'incidentes', 'evento', 'eventos',
  'historia', 'historias', 'documento', 'documentos', 'testigo', 'testigos',
  'congreso', 'senado', 'pentagono', 'pentágono',
  'tecnologia', 'tecnología', 'ciencia', 'ciencias',
  'humano', 'humanos', 'humana', 'humanas', 'no humano', 'no humana',
  'el fenomeno', 'el fenómeno',
  'proyecto', 'proyectos',
  'force', 'air force', 'navy',
  'capitan', 'capitán', 'coronel', 'general', 'comandante', 'mayor', 'doctor', 'dr',
  'sr', 'sra', 'sir',
  'estados', 'unidos',
  'inteligencia', 'defensa', 'seguridad',
  'fundacion', 'fundación', 'foundation',
  'corporacion', 'corporación', 'empresa', 'compania', 'compañía',
  'centro', 'instituto', 'agencia', 'comite', 'comité',
  'sin'
]);

// ============================================================
// 4. THREADS — curados a mano. No se generan automáticamente.
// ============================================================
// Para añadir un hilo nuevo: añade un objeto al array con id, title, desc y
// la lista de IDs de nodos que pertenecen al hilo. El campo `blocs` se
// recalcula al final del build (no lo escribas a mano).

const THREADS = [
  {
    id: 't_aatip',
    title: 'AATIP, AAWSAP y los programas serios',
    desc: 'El expediente moderno tiene una columna vertebral institucional: AAWSAP (2008) bajo Lacatski y Stratton, después AATIP bajo Elizondo, con Puthoff y Eric Davis como brazo científico desde BAASS. El Skinwalker Ranch fue el laboratorio de campo, y los 38 DIRDs la producción técnica derivada. Es la única ventana en la que el gobierno trató el fenómeno como un problema de investigación real, antes de que AARO lo reemplazara con escepticismo oficial.',
    nodes: ['aatip','aawsap','skinwalker_ranch','luis_elizondo','hal_puthoff_y_el_programa_baass','jay_stratton','eric_w_davis','sol_foundation','uaptf_y_aaro','el_uap_caucus_del_congreso','james_lacatski']
  },
  {
    id: 't_grusch',
    title: 'El catalizador David Grusch',
    desc: 'En 2022 David Grusch presentó una denuncia formal ante el ICIG que la propia inspección calificó como "urgente y creíble". La audiencia pública del Congreso en 2023 lo convirtió en el primer insider con credenciales impecables que afirmaba bajo juramento la existencia de un programa de recuperación de craft no humano. Abrió la puerta a Coulthart, Barber, Burchett, Burlison y Luna, y desencadenó el ciclo completo de audiencias 2024-2025.',
    nodes: ['david_grusch','primera_audiencia_publica_del_congreso_sobre_uaps_','audiencia_del_congreso_nov_2024','el_inspector_general_de_la_comunidad_de_inteligenc','ross_coulthart','jake_barber','rep_tim_burchett','sen_mike_rounds','el_uap_caucus_del_congreso','uap_disclosure_act','la_ndaa_y_la_obligacion_legislativa_de_investigar_','anna_paulina_luna','eric_burlison']
  },
  {
    id: 't_roswell',
    title: 'Roswell — el origen del relato parcializado',
    desc: 'Cuatro testigos cuentan Roswell desde cuatro ángulos: el funerario local que vio cuerpos, el coronel Philip Corso con acceso desde Fort Riley, MJ-12 como presunta estructura de custodia post-1947, y Richard Doty con las operaciones de desinformación post-1979. El memo Wilson-Davis añade una pieza más a la cadena. Roswell no es un evento aislado: es un campo de batalla narrativo donde cada fuente valida o problematiza el relato canónico.',
    nodes: ['roswell_nuevo_mexico','mj_12_majestic_12','coronel_philip_j_corso','aztec_nuevo_mexico','wright_patterson_afb','el_memo_wilson_davis','dr_robert_irving_sarbacher']
  },
  {
    id: 't_stargate',
    title: 'Stargate / visión remota / psionics',
    desc: 'Stargate (CIA/DIA, 1972-1995) institucionalizó la visión remota como activo de inteligencia operativa durante más de dos décadas. Hal Puthoff y Russell Targ lideraron el ala científica en SRI, Joe McMoneagle fue el visor estrella, Skip Atwater coordinó, y Sgt. Lyn Buchanan y John B. Alexander entrenaron operadores. No es un programa periférico: es la prueba documentada de que el aparato de seguridad nacional invirtió recursos sostenidos en psionics como infraestructura real.',
    nodes: ['proyecto_stargate_cia_dia','sgt_lyn_buchanan','skip_atwater','john_b_alexander','hal_puthoff_y_el_programa_baass','prof_garry_nolan','joe_mcmoneagle','russell_targ']
  },
  {
    id: 't_sol',
    title: 'Eje Sol Foundation',
    desc: 'Sol Foundation es el think-tank académico que articula la divulgación moderna fuera del Pentágono: Garry Nolan (Stanford), Karl Nell (coronel retirado, autor del marco "controlled disclosure"), Hal Puthoff, Jacques Vallée, Diana Pasulka (humanidades), Beatriz Villarroel (astronomía peer-reviewed), Christopher Mellon y Leslie Kean. Es la pieza que da legitimidad institucional al expediente y donde se cocinan los marcos editoriales que después llegan al Congreso y a la prensa seria.',
    nodes: ['sol_foundation','prof_garry_nolan','karl_nell','diana_walsh_pasulka','hal_puthoff_y_el_programa_baass','jacques_vallee','christopher_mellon','leslie_kean','jay_stratton','beatriz_villarroel']
  },
  {
    id: 't_aaro',
    title: 'AARO como freno institucional',
    desc: 'AARO (creada en 2022) sustituyó al UAPTF y absorbió la legitimidad acumulada por AAWSAP/AATIP, pero su informe histórico de 2024 bajo Sean Kirkpatrick concluyó que no existe evidencia verificable de recuperaciones — en contradicción directa con la denuncia de Grusch. La oficina se convirtió en el contramovimiento institucional desde dentro: escepticismo oficial que sostiene la negación plausible mientras el Congreso presiona por desclasificación.',
    nodes: ['uaptf_y_aaro','aatip','aawsap','david_grusch','informe_uaptf']
  },
  {
    id: 't_mh370',
    title: 'MH370 / ZPE / warp',
    desc: 'El cluster de Ashton Forbes conecta el caso MH370 con física teórica heterodoxa pero documentada: las patentes USPTO de Salvatore Pais (zero-point energy, propulsión por campo electromagnético de alta frecuencia), Casimir, Sakharov 1967, GEM theory y los trabajos de Thomas Townsend Brown sobre electrogravitación. Es la perspectiva "agencias 3-letras" (CIA, FBI, DOE) que el resto del corpus no cubre — material especulativo pero con anclajes verificables en patentes y papers.',
    nodes: ['ch_ashton_forbes','salvatore_pais','thomas_townsend_brown']
  },
  {
    id: 't_corpora',
    title: 'Contratistas y captura corporativa',
    desc: 'La hipótesis fuerte de Grusch y otros denunciantes es que el programa no se oculta por compartimentación clásica sino por fragmentación entre contratistas privados: Lockheed (Skunk Works), Northrop (Rancho Tejón), SAIC, EG&G, Bigelow Aerospace y TTSA. Mover la custodia al sector privado neutraliza la supervisión del Congreso. Es el mecanismo de gobernanza que permite negar bajo juramento sin perjurio técnico — y por qué la desclasificación es tan difícil.',
    nodes: ['lockheed_martin_skunk_works','northrop_grumman_y_el_rancho_tejon','saic_science_applications_international_corporatio','bigelow_aerospace_baass','eg_g_special_projects','to_the_stars_academy_ttsa']
  },
  {
    id: 't_classic',
    title: 'Casos clásicos: Magenta, Roswell, Coyame, Kingman',
    desc: 'Los crashes que abrieron el expediente, ordenados cronológicamente: Magenta 1933 (Italia fascista, programa RS/33 bajo Marconi), Trinity 1945 (familia Padilla, pre-Roswell), Roswell 1947, Aztec 1948, Kingman 1953, Kecksburg 1965, Coyame 1974 (México, CIA-Fort Bliss) y Rendlesham 1980. Establecen el patrón estructural recurrente: recuperación militar inmediata, custodia compartimentada, y testimonio que solo emerge décadas después o post-mortem.',
    nodes: ['caso_magenta_italia','roswell_nuevo_mexico','coyame_mexico','kingman_arizona','aztec_nuevo_mexico','kecksburg_pennsylvania','trinity_1945','rendlesham_forest_uk']
  },
  {
    id: 't_military',
    title: 'Avistamientos militares confirmados',
    desc: 'Casos con radar, FLIR, audio ATC y testimonio bajo juramento: USS Nimitz 2004 (Fravor y el Tic-Tac), Ryan Graves y los avistamientos diarios del USS Roosevelt 2014-2015, Malmstrom 1967 (apagado simultáneo de 10 misiles ICBM con Bob Salas), Rendlesham 1980 (memo Halt junto a almacenamiento nuclear), Japan Air Lines 1628 sobre Alaska, Manises 1979 (España), Mantell 1948, Westall 1966 (Australia) y las luces de Phoenix 1997. Es el suelo evidencial duro del expediente moderno.',
    nodes: ['uss_nimitz','japan_air_lines_1628','malmstrom_afb','rendlesham_forest_uk','las_luces_de_phoenix','caso_manises','caso_mantell','westall_australia','david_fravor','ryan_graves']
  },
  {
    id: 't_journalism',
    title: 'Periodismo y divulgación',
    desc: 'La cadena de periodistas que sostuvo el expediente cuando el mainstream lo descartaba: Leslie Kean (artículos NYT 2017 + libro fundacional con Mellon), Ralph Blumenthal (NYT), Ross Coulthart (NewsNation y DEBRIEFED), Jeremy Corbell con George Knapp (Weaponized, los vídeos Navy), Linda Moulton Howe (décadas de testimonios), Jesse Michels (American Alchemy), Richard Dolan (investigación histórica) y Nick Pope (Ministry of Defence UK). Sin esta capa no hay relato público sostenido.',
    nodes: ['leslie_kean','ralph_blumenthal','ross_coulthart','jeremy_corbell','george_knapp','linda_moulton_howe','ch_jesse_michels','richard_dolan','nick_pope']
  },
  {
    id: 't_abduction',
    title: 'Abducción / contacto',
    desc: 'La rama que la psiquiatría académica tomó en serio en los 90: John E. Mack (psiquiatra de Harvard y Premio Pulitzer, documentó rasgos clínicos en más de 200 experiencers), Betty y Barney Hill 1961 (el caso paradigmático con hipnosis regresiva), Travis Walton 1975 (5 días desaparecido con testigos múltiples). Jacques Vallée aporta el marco interpretativo no-extraterrestre (Magonia) y Diana Pasulka el ángulo de fenómeno religioso. Material incómodo pero documentado.',
    nodes: ['john_e_mack','travis_walton','betty_y_barney_hill','jacques_vallee','diana_walsh_pasulka']
  }
];

// ============================================================
// 5. UTILIDADES
// ============================================================

function slugify(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50);
}

function stripHTML(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseHeadline(headline) {
  // "Nombre: Rol"  →  { name: "Nombre", role: "Rol" }
  // "Solo headline" → { name: "Solo headline", role: "" }
  const i = headline.indexOf(':');
  if (i === -1) return { name: headline.trim(), role: '' };
  return { name: headline.slice(0, i).trim(), role: headline.slice(i + 1).trim() };
}

// ============================================================
// 6. LECTURA DE FUENTES
// ============================================================

function readSheet(file) {
  const wb = XLSX.readFile(path.join(SRC, file));
  const sh = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sh, { defval: null });
  // Filtrar fila "title" de TimelineJS y filas sin Headline
  return rows.filter(r => r.Headline && r.Type !== 'title');
}

const corpus = JSON.parse(fs.readFileSync(path.join(SRC, 'corpus_full.json'), 'utf8'));
const personasRows = readSheet('Personas.xlsx');
const eventosRows  = readSheet('Eventos.xlsx');
const grupos       = readSheet('GruposProgramas.xlsx');

console.log(`[1/6] Fuentes leídas:`);
console.log(`      - corpus_full.json:   ${corpus.length} vídeos`);
console.log(`      - Personas.xlsx:      ${personasRows.length} filas`);
console.log(`      - Eventos.xlsx:       ${eventosRows.length} filas`);
console.log(`      - GruposProgramas.xlsx: ${grupos.length} filas`);

// ============================================================
// 7. CREAR NODOS desde los xlsx
// ============================================================

function typeForGP(row) {
  const t = row.Type || '';
  return /(Programa|Marco Legisla|Precedente|Audiencias y Legisla)/i.test(t)
    ? 'program' : 'agency';
}

function rowToNode(row, type) {
  const { name, role } = parseHeadline(String(row.Headline).trim());
  return {
    id: slugify(name),
    name,
    role,
    type,
    group: row.Type || '',
    bio: stripHTML(row.Text),
    year: row.Year ? Number(row.Year) : null,
    media: row.Media || null,
    mediaCredit: row['Media Credit'] || '',
    mediaCaption: row['Media Caption'] || ''
  };
}

const rawNodes = [];
personasRows.forEach(r => rawNodes.push(rowToNode(r, 'person')));
eventosRows.forEach(r  => rawNodes.push(rowToNode(r, 'event')));
grupos.forEach(r       => rawNodes.push(rowToNode(r, typeForGP(r))));

// Resolución de colisiones de id: si dos nodos comparten id, sufijar el segundo
// con _org / _event según su type.
const idCount = {};
for (const n of rawNodes) idCount[n.id] = (idCount[n.id] || 0) + 1;
const seen = {};
for (const n of rawNodes) {
  if (idCount[n.id] > 1) {
    const suf = n.type === 'event' ? '_event'
              : n.type === 'program' ? '_program'
              : n.type === 'agency'  ? '_org'
              : '_person';
    if (seen[n.id]) {
      n.id = n.id + suf;
    } else {
      seen[n.id] = true; // primer ocurrencia mantiene el id base
    }
  }
}

// ============================================================
// 8. NODOS DE CANAL
// ============================================================

const channelNodes = CHANNELS.map(ch => ({
  id: ch.id,
  name: ch.name,
  role: 'Canal / Fuente',
  type: 'channel',
  group: 'Canal',
  bio: '',
  year: null,
  media: null,
  mediaCredit: '',
  mediaCaption: '',
  bloc: ch.bloc,
  corpusName: ch.corpusName
}));

// ============================================================
// 9. ALIASES — preparar lista normalizada por nodo
// ============================================================

function defaultAliasesFor(node) {
  const set = new Set();
  const nameN = normalize(node.name);
  if (nameN && !BANNED_WORDS.has(nameN)) set.add(nameN);

  if (node.type === 'person') {
    const toks = nameN.split(' ');
    // último apellido si tiene ≥4 chars y no es banned
    if (toks.length >= 2) {
      const last = toks[toks.length - 1];
      if (last.length >= 4 && !BANNED_WORDS.has(last)) set.add(last);
    }
  } else {
    // no-personas: solo el nombre corto (ya añadido) + palabra clave del role si es muy específica (raro)
  }
  return [...set];
}

const aliasesByNode = {};
for (const n of rawNodes) {
  const defaults = defaultAliasesFor(n);
  const extras = (ALIASES_BY_ID[n.id] || []).map(normalize);
  const merged = [...new Set([...defaults, ...extras])]
    .filter(a => a && !BANNED_WORDS.has(a) && a.length >= 3);
  aliasesByNode[n.id] = merged;
}

// ============================================================
// 10. TEXTO NORMALIZADO POR VÍDEO
// ============================================================

const videoText = corpus.map(v => ({
  n: Number(v.n),
  titulo: v.titulo,
  canal: v.canal,
  url: v.url,
  duracion: v.duracion,
  text: normalize([v.titulo, v.resumen, v.highlights, v.porque].join(' '))
}));

// ============================================================
// 11. MATCH NODO ↔ VÍDEO
// ============================================================
// Un nodo "aparece" en un vídeo si alguno de sus aliases está como token (o
// secuencia de tokens) en el texto normalizado del vídeo. Usamos boundary
// matching: el alias debe estar delimitado por inicio/fin/espacio.

function aliasInText(alias, text) {
  if (!alias) return false;
  const i = text.indexOf(alias);
  if (i === -1) return false;
  const before = i === 0 ? ' ' : text[i - 1];
  const afterIdx = i + alias.length;
  const after = afterIdx >= text.length ? ' ' : text[afterIdx];
  return before === ' ' && after === ' ';
}

const videosByNode  = {};   // nodeId -> [videoIndex, ...]
const nodesByVideo  = {};   // videoIndex -> Set(nodeId)
for (const n of rawNodes) {
  videosByNode[n.id] = [];
  const aliases = aliasesByNode[n.id];
  for (let i = 0; i < videoText.length; i++) {
    const v = videoText[i];
    for (const a of aliases) {
      if (aliasInText(a, v.text)) {
        videosByNode[n.id].push(i);
        if (!nodesByVideo[i]) nodesByVideo[i] = new Set();
        nodesByVideo[i].add(n.id);
        break;
      }
    }
  }
}

console.log(`[2/6] Aliases construidos. Nodos con ≥1 vídeo detectado:`,
  Object.values(videosByNode).filter(arr => arr.length > 0).length, '/', rawNodes.length);

// ============================================================
// 12. EDGES — co-ocurrencias entre nodos
// ============================================================

const pairCount = new Map();   // "a||b" -> n
const pairExamples = new Map(); // "a||b" -> [video n, ...]

function pairKey(a, b) { return a < b ? a + '||' + b : b + '||' + a; }

for (const [vi, nodes] of Object.entries(nodesByVideo)) {
  const arr = [...nodes];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const k = pairKey(arr[i], arr[j]);
      pairCount.set(k, (pairCount.get(k) || 0) + 1);
      if (!pairExamples.has(k)) pairExamples.set(k, []);
      pairExamples.get(k).push(Number(vi));
    }
  }
}

const PAIR_MIN = 2;
const edges = [];
for (const [k, n] of pairCount) {
  if (n < PAIR_MIN) continue;
  const [a, b] = k.split('||');
  edges.push([a, b, 'related', `${n} co-aparición${n === 1 ? '' : 'es'}`]);
}

// ============================================================
// 13. EDGES — canal → nodos mencionados en sus vídeos
// ============================================================
// Para cada nodo, contar cuántos vídeos de cada canal lo mencionan. Si ≥2,
// edge channel → node.

const channelMentions = {};  // chId -> { nodeId -> count }
for (const ch of channelNodes) channelMentions[ch.id] = {};

for (let vi = 0; vi < videoText.length; vi++) {
  const v = videoText[vi];
  const ch = CHANNEL_BY_CORPUS_NAME[v.canal];
  if (!ch) continue;
  const nodes = nodesByVideo[vi];
  if (!nodes) continue;
  for (const nodeId of nodes) {
    channelMentions[ch.id][nodeId] = (channelMentions[ch.id][nodeId] || 0) + 1;
  }
}

const CHAN_MIN = 2;
for (const ch of channelNodes) {
  for (const [nodeId, n] of Object.entries(channelMentions[ch.id])) {
    if (n < CHAN_MIN) continue;
    edges.push([ch.id, nodeId, 'mentioned_by', `${n} mencion${n === 1 ? '' : 'es'}`]);
  }
}

console.log(`[3/6] Edges co-ocurrencia: ${edges.filter(e => e[2] === 'related').length}, edges canal→nodo: ${edges.filter(e => e[2] === 'mentioned_by').length}`);

// ============================================================
// 14. BLOCS, CANAL PRINCIPAL, VIDEOS TOP-10, DEGREE, VIDEOCOUNT
// ============================================================

const degreeByNode = {};
for (const e of edges) {
  degreeByNode[e[0]] = (degreeByNode[e[0]] || 0) + 1;
  degreeByNode[e[1]] = (degreeByNode[e[1]] || 0) + 1;
}

// Cada nodo: bloc set, canal principal, lista de vídeos con metadata
const nodesFinal = [];
for (const n of rawNodes) {
  const vids = videosByNode[n.id] || [];
  const blocsByCh = {}; // bloc -> count
  const videos = [];
  for (const vi of vids) {
    const v = videoText[vi];
    const ch = CHANNEL_BY_CORPUS_NAME[v.canal];
    const b = ch ? ch.bloc : 0;
    if (b) blocsByCh[b] = (blocsByCh[b] || 0) + 1;
    videos.push({
      n: v.n,
      t: v.titulo,
      c: v.canal,
      u: v.url,
      d: v.duracion
    });
  }
  // canal principal = bloc con más vídeos
  let principalBloc = 0, max = 0;
  for (const [b, c] of Object.entries(blocsByCh)) {
    if (c > max) { max = c; principalBloc = Number(b); }
  }
  const blocs = Object.keys(blocsByCh).map(Number).sort((a, b) => a - b);

  // Top 10 vídeos: ordenados por n ascendente (estable, predecible)
  videos.sort((a, b) => a.n - b.n);
  const top = videos.slice(0, 10);

  nodesFinal.push({
    ...n,
    blocs,
    videos: top,
    videoCount: videos.length,
    canal: principalBloc,
    degree: degreeByNode[n.id] || 0
  });
}

// Channel nodes: blocs = [su propio bloc], videos = sus vídeos del corpus
for (const ch of channelNodes) {
  const vids = corpus.filter(v => v.canal === ch.corpusName);
  const allVids = vids.map(v => ({
    n: Number(v.n),
    t: v.titulo,
    c: v.canal,
    u: v.url,
    d: v.duracion
  })).sort((a, b) => a.n - b.n);
  nodesFinal.push({
    id: ch.id,
    name: ch.name,
    role: ch.role,
    type: 'channel',
    group: ch.group,
    bio: '',
    year: null,
    media: null,
    mediaCredit: '',
    mediaCaption: '',
    blocs: [ch.bloc],
    videos: allVids.slice(0, 10),
    videoCount: allVids.length,
    canal: ch.bloc,
    degree: degreeByNode[ch.id] || 0
  });
}

// El fenómeno
nodesFinal.unshift(PHENOMENON_NODE);

// ============================================================
// 15. BRIDGE — nodos sin edges entity-entity se conectan al hub del mismo group
// ============================================================
// El "hub" es el nodo con más vídeos dentro del mismo group (Type del xlsx).

const nodesById = Object.fromEntries(nodesFinal.map(n => [n.id, n]));

// Para cada grupo, encontrar el hub (mayor videoCount, excluyendo channels/phenomenon)
const hubByGroup = {};
for (const n of nodesFinal) {
  if (n.type === 'channel' || n.type === 'phenomenon') continue;
  if (!n.group) continue;
  const cur = hubByGroup[n.group];
  if (!cur || n.videoCount > cur.videoCount) hubByGroup[n.group] = n;
}

// Nodos sin edges entity-entity (related). Excluyendo phenomenon y channels.
const hasRelated = new Set();
for (const e of edges) {
  if (e[2] === 'related') {
    hasRelated.add(e[0]); hasRelated.add(e[1]);
  }
}

let bridgeCount = 0;
for (const n of nodesFinal) {
  if (n.type === 'channel' || n.type === 'phenomenon') continue;
  if (hasRelated.has(n.id)) continue;
  const hub = hubByGroup[n.group];
  if (!hub || hub.id === n.id) continue;
  edges.push([n.id, hub.id, 'related', 'Misma categoría']);
  n.degree = (n.degree || 0) + 1;
  hub.degree = (hub.degree || 0) + 1;
  bridgeCount++;
}

console.log(`[4/6] Bridge edges añadidos: ${bridgeCount}`);

// ============================================================
// 16. THREADS — recalcular blocs de cada hilo (unión de blocs de sus nodos)
// ============================================================

const threadsFinal = THREADS.map(th => {
  const blocs = new Set();
  for (const nid of th.nodes) {
    const n = nodesById[nid];
    if (!n) continue;
    for (const b of (n.blocs || [])) blocs.add(b);
  }
  return {
    id: th.id,
    title: th.title,
    desc: th.desc,
    blocs: [...blocs].sort((a, b) => a - b),
    nodes: th.nodes
  };
});

// Avisar si algún thread referencia IDs que no existen
const allIds = new Set(nodesFinal.map(n => n.id));
let missingTotal = 0;
for (const th of THREADS) {
  const missing = th.nodes.filter(nid => !allIds.has(nid));
  if (missing.length) {
    console.warn(`      WARN thread "${th.id}" referencia IDs inexistentes: ${missing.join(', ')}`);
    missingTotal += missing.length;
  }
}
if (missingTotal === 0) console.log(`[5/6] Threads OK (12 hilos, 0 IDs huérfanos)`);
else console.log(`[5/6] Threads procesados con ${missingTotal} IDs huérfanos (ver warnings arriba)`);

// ============================================================
// 17. ESCRIBIR data.js
// ============================================================

const output = {
  nodes: nodesFinal,
  edges,
  threads: threadsFinal
};

const banner = `// REDESCUBRIENDO — Dataset
// Nodes: ${output.nodes.length} — Edges: ${output.edges.length} — Threads: ${output.threads.length}
// Generado automáticamente por scripts/build-data.js. NO EDITAR A MANO.
// Para regenerar: npm run build

`;

fs.writeFileSync(OUT, banner + 'window.RDC_DATA = ' + JSON.stringify(output, null, 2) + ';\n');
console.log(`[6/6] data.js escrito. ${output.nodes.length} nodos, ${output.edges.length} edges, ${output.threads.length} threads.`);
