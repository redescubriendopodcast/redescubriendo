# 📸 Fotos de caras — cómo añadir las que faltan

Esta carpeta (`PAGINA WEB/web/assets/faces/`) contiene las fotos de cara que
aparecen en la cabecera de cada ficha. **Aquí mismo es donde tienes que dejar
las imágenes nuevas.**

## Cómo añadir una foto

1. Consigue la imagen de la cara (cuanto más vertical/retrato, mejor; se
   recorta a un rectángulo alto).
2. Guárdala **en esta carpeta** con el nombre **exacto del `id` del nodo** y
   extensión `.jpg`, `.png` o `.webp`. Ejemplos:
   - `bob_lazar.jpg`
   - `nick_pope.png`
3. Desde `PAGINA WEB/web/` ejecuta:
   ```
   node enrich-data.js
   ```
   El script **detecta automáticamente** cualquier archivo nombrado como un id
   de nodo y lo asigna a su ficha. No hay que editar nada más.
4. Commit + push (`git add … && git commit && git push`). Cloudflare Pages
   redesplegará solo.

> Para **reemplazar** una foto existente: sustituye el archivo (mismo nombre) y
> vuelve a ejecutar `node enrich-data.js`.

El nombre del archivo **debe ser el id**, no el nombre de la persona. La lista
de abajo te da el `id` exacto de cada persona que falta.

---

## Faltan 34 personas (de 70). Marca ✅ cuando dejes el archivo:

### Periodistas Clave
- [ ] `carey_schmitt`  →  **Carey & Schmitt** (La verdad sobre Roswell)
- [ ] `jeremy_corbell`  →  **Jeremy Corbell**
- [ ] `leslie_kean`  →  **Leslie Kean** (Revelación del AATIP)
- [ ] `peter_levenda`  →  **Peter Levenda**
- [ ] `ralph_blumenthal`  →  **Ralph Blumenthal**

### Científicos e Investigadores
- [ ] `beatriz_villarroel`  →  **Beatriz Villarroel**
- [ ] `diana_walsh_pasulka`  →  **Diana Walsh Pasulka**
- [ ] `dr_robert_irving_sarbacher`  →  **Dr. Robert Irving Sarbacher**
- [ ] `eric_w_davis`  →  **Eric W. Davis**
- [ ] `james_lacatski`  →  **James Lacatski**
- [ ] `kevin_knuth`  →  **Kevin Knuth**
- [ ] `prof_garry_nolan`  →  **prof. Garry Nolan**
- [ ] `thomas_townsend_brown`  →  **Thomas Townsend Brown**
- [ ] `timothy_tyler_d_taylor`  →  **Timothy "Tyler D" Taylor**

### Figuras Históricas
- [ ] `bob_lazar`  →  **Bob Lazar**
- [ ] `william_tompkins`  →  **William Tompkins**

### Whistleblowers y Testigos
- [ ] `arthur_stansel_jr_fritz_werner`  →  **Arthur Stansel Jr. ("Fritz Werner")**
- [ ] `dylan_borland`  →  **Dylan Borland**
- [ ] `jay_stratton`  →  **Jay Stratton**
- [ ] `matthew_brown`  →  **Matthew Brown**
- [ ] `michael_herrera`  →  **Michael Herrera**

### Figuras Militares
- [ ] `angela_ford`  →  **Angela Ford**
- [ ] `bob_salas`  →  **Bob Salas**
- [ ] `brett_feddersen`  →  **Brett Feddersen**
- [ ] `david_fravor`  →  **David Fravor**
- [ ] `jake_barber`  →  **Jake Barber**
- [ ] `jim_semivan`  →  **Jim Semivan**
- [ ] `joe_mcmoneagle`  →  **Joe McMoneagle**
- [ ] `john_blitch`  →  **John Blitch**
- [ ] `karl_nell`  →  **Karl Nell**
- [ ] `nick_pope`  →  **Nick Pope**
- [ ] `sgt_lyn_buchanan`  →  **Sgt. Lyn Buchanan**
- [ ] `skip_atwater`  →  **Skip Atwater**
- [ ] `tim_phillips`  →  **Tim Phillips**

---

## Ya tienen foto (36) ✅

admiral_tim_gallaudet · almirante_thomas_wilson · andre_carson ·
anna_paulina_luna · avi_loeb · carl_gustav_jung · christopher_mellon ·
coronel_philip_j_corso · danny_sheehan · david_grusch · david_icke ·
edgar_mitchell · eric_burlison · george_knapp · haim_eshed ·
hal_puthoff_y_el_programa_baass · j_allen_hynek · jacques_vallee ·
jared_moskowitz · john_b_alexander · john_e_mack · kirsan_ilyumzhinov ·
linda_moulton_howe · luis_elizondo · marco_rubio · michael_shellenberger ·
rep_tim_burchett · richard_dolan · roberto_pinotti · ross_coulthart ·
russell_targ · ryan_graves · salvatore_pais · sen_kirsten_gillibrand ·
sen_mike_rounds

*(Generado el 2026-05-31. Si añades o renombras nodos en las timelines, los
`id` pueden cambiar; este listado es de referencia en ese momento.)*
