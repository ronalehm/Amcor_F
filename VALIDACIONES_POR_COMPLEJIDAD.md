# 🔍 VALIDACIONES POR COMPLEJIDAD

**Versión:** 1.0  
**Fecha:** 2026-08-10  
**Total Validaciones:** 45+ | **Clasificadas por Nivel**

---

# NIVEL 1: VALIDACIONES SIMPLES (15)

## Definición
Una validación simple es un chequeo directo de un solo campo contra un rango o valor específico.

### V1.1 - Rango Width LÁMINA
```
Función:      validateWidthLamina(width)
Condición:    width >= 1 AND width <= 9999
Error:        "Ancho debe estar entre 1 y 9999 mm"
Tipo Campo:   Number
Ocurrencia:   3 casuísticas (LÁMINA)
```

### V1.2 - Rango Repetition LÁMINA
```
Función:      validateRepetitionLamina(repetition)
Condición:    repetition >= 1 AND repetition <= 9999
Error:        "Repetición debe estar entre 1 y 9999 mm"
Tipo Campo:   Number
Ocurrencia:   3 casuísticas (LÁMINA)
```

### V1.3 - Rango Width BOLSA
```
Función:      validateWidthBolsa(width)
Condición:    width >= 1 AND width <= 3000
Error:        "Ancho BOLSA debe estar entre 1 y 3000 mm"
Tipo Campo:   Number
Ocurrencia:   5 casuísticas (BOLSA)
```

### V1.4 - Rango Length BOLSA
```
Función:      validateLengthBolsa(length)
Condición:    length >= 1 AND length <= 3000
Error:        "Largo BOLSA debe estar entre 1 y 3000 mm"
Tipo Campo:   Number
Ocurrencia:   5 casuísticas (BOLSA)
```

### V1.5 - Rango Width POUCH (General)
```
Función:      validateWidthPouch(width)
Condición:    width >= 1 AND width <= 500
Error:        "Ancho POUCH debe estar entre 1 y 500 mm"
Tipo Campo:   Number
Ocurrencia:   10 casuísticas (POUCH general)
```

### V1.6 - Rango Length POUCH (General)
```
Función:      validateLengthPouch(length)
Condición:    length >= 1 AND length <= 500
Error:        "Largo POUCH debe estar entre 1 y 500 mm"
Tipo Campo:   Number
Ocurrencia:   10 casuísticas (POUCH general)
```

### V1.7 - Rango Ancho Fuelle BOLSA
```
Función:      validateAnchoFuelleBolsa(anchoFuelle)
Condición:    anchoFuelle >= 0 AND anchoFuelle <= 500
Error:        "Ancho Fuelle BOLSA debe estar entre 0 y 500 mm"
Tipo Campo:   Number
Ocurrencia:   5 casuísticas (BOLSA, si Fuelle=Sí)
```

### V1.8 - Rango Ancho Fuelle POUCH (General)
```
Función:      validateAnchoFuellePouch(anchoFuelle)
Condición:    anchoFuelle >= 0 AND anchoFuelle <= 500
Error:        "Ancho Fuelle POUCH debe estar entre 0 y 500 mm"
Tipo Campo:   Number
Ocurrencia:   10 casuísticas (POUCH general, si Fuelle=Sí)
```

### V1.9 - Rango Diámetro Core LÁMINA
```
Función:      validateDiametroCorelamina(diametro)
Condición:    diametro >= 76 AND diametro <= 152
Error:        "Diámetro Core debe estar entre 76 y 152 mm"
Tipo Campo:   Number
Ocurrencia:   3 casuísticas (LÁMINA)
```

### V1.10 - Obligatorio Material [SI]
```
Función:      validateMaterialRequired(material)
Condición:    material != null AND material != ""
Error:        "Material es obligatorio"
Tipo Campo:   Dropdown [SI]
Ocurrencia:   27 casuísticas (TODAS)
Crítico:      ✅ BLOQUEADOR
```

### V1.11 - Obligatorio Envoltura
```
Función:      validateEnvolturaRequired(envoltura)
Condición:    envoltura IN [LAMINA, BOLSA, POUCH]
Error:        "Debe seleccionar una envoltura"
Tipo Campo:   Radio
Ocurrencia:   27 casuísticas (TODAS)
Crítico:      ✅ BLOQUEADOR
```

### V1.12 - Obligatorio Tipo Formato
```
Función:      validateTipoFormatoRequired(tipoFormato)
Condición:    tipoFormato != null
Error:        "Debe seleccionar un tipo de formato"
Tipo Campo:   Dropdown
Ocurrencia:   27 casuísticas (TODAS)
Crítico:      ✅ BLOQUEADOR
```

### V1.13 - Obligatorio Sentido Bobinado LÁMINA
```
Función:      validateSentidoBobinadoRequired(sentido)
Condición:    sentido IN [1,2,3,4,5,6,7,8]
Error:        "Debe seleccionar un sentido de bobinado"
Tipo Campo:   Image Grid
Ocurrencia:   3 casuísticas (LÁMINA)
Crítico:      ✅ BLOQUEADOR
```

### V1.14 - Rango FR Width LÁMINA
```
Función:      validateFR1WidthLamina(fr1Width)
Condición:    fr1Width >= 1 AND fr1Width <= 9999
Error:        "FR1 Width debe estar entre 1 y 9999 mm"
Tipo Campo:   Number
Ocurrencia:   3 casuísticas (LÁMINA, si FR1=Sí)
Visible:      Condicional
```

### V1.15 - Rango FR Height LÁMINA
```
Función:      validateFR1HeightLamina(fr1Height)
Condición:    fr1Height >= 1 AND fr1Height <= 9999
Error:        "FR1 Height debe estar entre 1 y 9999 mm"
Tipo Campo:   Number
Ocurrencia:   3 casuísticas (LÁMINA, si FR1=Sí)
Visible:      Condicional
```

---

# NIVEL 2: VALIDACIONES NORMALES (20)

## Definición
Una validación normal implica:
- Múltiples campos (2-3)
- Condiciones lógicas (IF/THEN)
- Conversión/Cálculo
- Pero SIN ramificaciones complejas

### V2.1 - Cálculo Perímetro LÁMINA
```
Función:      calculatePerimeterLamina(width, repetition)
Cálculo:      perimeter = 2 × (width + repetition)
Validar:      perimeter >= 100 AND perimeter <= 20000
Error:        "Perímetro {valor} mm fuera de rango (100-20000)"
Tipo:         Derived field + Validation
Ocurrencia:   3 casuísticas (LÁMINA)
Crítico:      ✅ BLOQUEADOR
Trigger:      onChange width/repetition
```

### V2.2 - Cálculo Perímetro BOLSA
```
Función:      calculatePerimeterBolsa(width, length)
Cálculo:      perimeter = 2 × (width + length)
Validar:      perimeter >= 100 AND perimeter <= 10000
Error:        "Perímetro {valor} mm fuera de rango (100-10000)"
Tipo:         Derived field + Validation
Ocurrencia:   5 casuísticas (BOLSA)
Crítico:      ✅ BLOQUEADOR
Trigger:      onChange width/length
```

### V2.3 - Cálculo Perímetro POUCH (General)
```
Función:      calculatePerimeterPouchGeneral(width, length)
Cálculo:      perimeter = 2 × (width + length)
Validar:      perimeter >= 100 AND perimeter <= 15000
Error:        "Perímetro {valor} mm fuera de rango (100-15000)"
Tipo:         Derived field + Validation
Ocurrencia:   10 casuísticas (POUCH general)
Crítico:      ✅ BLOQUEADOR
Trigger:      onChange width/length
```

### V2.4 - Validación Condicional Ancho Fuelle (BOLSA)
```
Función:      validateAnchoFuelleConditionalBolsa(tieneFuelle, anchoFuelle)
Condición:    IF tieneFuelle = "Sí" THEN anchoFuelle REQUIRED
              ELSE anchoFuelle can be empty
Error:        "Ancho Fuelle es obligatorio si Fuelle=Sí"
Tipo:         Conditional Required
Ocurrencia:   5 casuísticas (BOLSA)
Crítico:      ✅ BLOQUEADOR
Lógica:       IF #5 = "Sí" THEN #8 required
```

### V2.5 - Validación Condicional Ancho Fuelle (POUCH)
```
Función:      validateAnchoFuelleConditionalPouch(tieneFuelle, anchoFuelle)
Condición:    IF tieneFuelle = "Sí" THEN anchoFuelle REQUIRED
              ELSE anchoFuelle can be empty
Error:        "Ancho Fuelle es obligatorio si Fuelle=Sí"
Tipo:         Conditional Required
Ocurrencia:   10 casuísticas (POUCH general)
Crítico:      ✅ BLOQUEADOR
Lógica:       IF #9 = "Sí" THEN #12 required
```

### V2.6 - Validación Condicional Acabado (BOLSA)
```
Función:      validateAcabadoConditionalBolsa(tipoSello, acabado)
Condición:    IF tipoSello = "Lateral" THEN acabado REQUIRED
              ELSE acabado hidden
Error:        "Acabado es obligatorio para Sello Lateral"
Tipo:         Conditional Required
Ocurrencia:   2 casuísticas (BOLSA Lateral)
Crítico:      ✅ BLOQUEADOR
Lógica:       IF #3 = "Lateral" THEN #4 required
```

### V2.7 - Validación Ancho Sello Lateral Plano (POUCH)
```
Función:      validateAnchoSelloPlano(cantidadSellos, anchoLateral)
Condición:    IF cantidadSellos = "Tres" THEN anchoLateral REQUIRED
              ELSE anchoLateral hidden
Error:        "Ancho Sello Lateral es obligatorio para Tres Sellos"
Tipo:         Conditional Required
Ocurrencia:   1 casuística (POUCH Plano Tres)
Crítico:      ✅ BLOQUEADOR
Lógica:       IF #3 = "Tres" THEN #24 required
```

### V2.8 - Validación Wicket Condicional (BOLSA)
```
Función:      validateWicketConditional(presentacion, tieneFuelle)
Condición:    IF presentacion = "Wicket" THEN tieneFuelle can be Sí/No
              ELSE Wicket fields hidden
Error:        "Configuración de Wicket requerida"
Tipo:         Conditional Section
Ocurrencia:   1 casuística (BOLSA Wicket)
Crítico:      ⚪ Informativo
Lógica:       IF #2 = "Wicket" THEN show #12-17
```

### V2.9 - Validación FR1 Condicional (LÁMINA)
```
Función:      validateFR1Conditional(hasPhotoregister1, fr1Fields)
Condición:    IF hasPhotoregister1 = "Sí" THEN FR1 fields REQUIRED
              ELSE FR1 fields hidden
Error:        "Campos FR1 son obligatorios"
Tipo:         Conditional Required
Ocurrencia:   3 casuísticas (LÁMINA)
Crítico:      ✅ BLOQUEADOR
Lógica:       IF #11 = "Sí" THEN #12-21 required
```

### V2.10 - Validación FR2 Condicional (LÁMINA)
```
Función:      validateFR2Conditional(countFotoregistros, fr2Fields)
Condición:    IF countFotoregistros = 2 THEN FR2 fields REQUIRED
              ELSE FR2 fields hidden
Error:        "Campos FR2 son obligatorios"
Tipo:         Conditional Required
Ocurrencia:   3 casuísticas (LÁMINA)
Crítico:      ✅ BLOQUEADOR
Lógica:       IF #22 = 2 THEN #23-25 required
```

### V2.11 - Cálculo Márgenes FR1 (LÁMINA)
```
Función:      calculateFR1Margins(refHoriz, refVert, distHoriz, distVert)
Cálculo:      
  marginLeft = refHoriz = "Left" ? distHoriz : 0
  marginRight = refHoriz = "Right" ? distHoriz : 0
  marginTop = refVert = "Top" ? distVert : 0
  marginBottom = refVert = "Bottom" ? distVert : 0
Tipo:         Derived fields (4)
Ocurrencia:   3 casuísticas (LÁMINA, si FR1=Sí)
Trigger:      onChange refHoriz/refVert/distHoriz/distVert
```

### V2.12 - Validación Rango Distancia FR (LÁMINA)
```
Función:      validateFRDistances(frDistHoriz, frDistVert)
Condición:    frDistHoriz >= 0 AND frDistHoriz <= 9999
              frDistVert >= 0 AND frDistVert <= 9999
Error:        "Distancia FR debe estar entre 0 y 9999 mm"
Tipo:         Range validation
Ocurrencia:   3 casuísticas (LÁMINA, si FR1=Sí)
```

### V2.13 - Validación Máximo 3 Accesorios (BOLSA)
```
Función:      validateMaxAccesoriesBolsa(accesorios)
Condición:    count(accesorios) <= 3
Error:        "Máximo 3 accesorios permitidos"
Tipo:         Count validation
Ocurrencia:   5 casuísticas (BOLSA)
Crítico:      ✅ BLOQUEADOR
Trigger:      onChange accesorios
```

### V2.14 - Validación Máximo 3 Accesorios (POUCH)
```
Función:      validateMaxAccesoriosPouch(accesorios)
Condición:    count(accesorios) <= 3
Error:        "Máximo 3 accesorios permitidos"
Tipo:         Count validation
Ocurrencia:   16 casuísticas (POUCH)
Crítico:      ✅ BLOQUEADOR
Trigger:      onChange accesorios
```

### V2.15 - Validación Diámetro Wicket (BOLSA)
```
Función:      validateDiametroWicket(diametro)
Condición:    diametro IN ["D12", "D14", "D16"]
Error:        "Diámetro Wicket debe ser D12, D14 o D16"
Tipo:         Enum validation
Ocurrencia:   1 casuística (BOLSA Wicket)
```

### V2.16 - Cálculo Ancho Total Sello Central (POUCH)
```
Función:      calculateAnchoTotalSelloCentral(anchoAleta, anchoTransversal)
Cálculo:      anchoTotal = anchoAleta + anchoTransversal
Tipo:         Derived field
Ocurrencia:   6 casuísticas (POUCH Sello Central con PE-PE/PE)
Trigger:      onChange anchoAleta/anchoTransversal
```

### V2.17 - Validación Ancho Aleta Sello Central (POUCH)
```
Función:      validateAnchoAleta(anchoAleta)
Condición:    anchoAleta IN [10, 12, 15]
Error:        "Ancho Sello Aleta debe ser 10, 12 o 15 mm"
Tipo:         Enum validation
Ocurrencia:   6 casuísticas (POUCH Sello Central con PE-PE/PE)
```

### V2.18 - Validación Rango Separación Puas (POUCH)
```
Función:      validateSeparacionPuas(separacion)
Condición:    separacion >= 0 AND separacion <= 50
Error:        "Separación de puas debe estar entre 0 y 50 mm"
Tipo:         Range validation
Ocurrencia:   6 casuísticas (POUCH Sello Central con Microperforado)
```

### V2.19 - Validación Rango Distancia Lado Aleta (POUCH)
```
Función:      validateDistanciaLadoAleta(distancia)
Condición:    distancia >= 0 AND distancia <= 500
Error:        "Distancia Lado Aleta debe estar entre 0 y 500 mm"
Tipo:         Range validation
Ocurrencia:   6 casuísticas (POUCH Sello Central con Microperforado)
```

### V2.20 - Validación Tipo Microperforado (POUCH)
```
Función:      validateTipoMicroperforado(tipo)
Condición:    tipo IN ["Total", "Parcial"]
Error:        "Tipo Microperforado debe ser Total o Parcial"
Tipo:         Enum validation
Ocurrencia:   6 casuísticas (POUCH Sello Central)
```

---

# NIVEL 3: VALIDACIONES COMPLEJAS (ESPECIALES) (10)

## Definición
Una validación compleja/especial implica:
- 3+ campos interconectados
- Ramificaciones profundas (3+ niveles IF/THEN)
- Cambio de rangos/valores según condiciones
- Lógica no lineal

### V3.1 - Cascada Stand Up POUCH (ESPECIAL)
```
Función:      validateStandUpCascade(familia, subFamilia, base, fuelleTipo)
Lógica:       
  IF familia = "Stand Up" THEN
    IF subFamilia = "Doy Pack" THEN
      Mostrar: Base (Redonda/Cuadrada)
      Mostrar: Fuelle Tipo (Propio/Insertado)
      Aplicar: VALIDACIONES ESPECIALES
    ELSE IF subFamilia IN ["Sello K", "Normal"] THEN
      Ocultar: Base, Fuelle Tipo
      Aplicar: VALIDACIONES ESTÁNDAR
    END IF
  END IF

Cambios de Rango:
  Width:       1-500 → 80-230 (si Doy Pack)
  Length:      1-500 → 134-340 (si Doy Pack)
  Fuelle:      0-500 → 0-3 (si Doy Pack)
  Perímetro:   100-15000 → 100-650 (si Doy Pack)

Ocurrencia:    4 casuísticas (POUCH Stand Up Doy Pack)
Crítico:       ✅ BLOQUEADOR (rangos especiales)
Niveles:       4 (familia → subfamilia → base → validación)
```

### V3.2 - Cascada Plano POUCH (ESPECIAL)
```
Función:      validatePlanoCascade(familia, cantidadSellos, anchoLateral)
Lógica:
  IF familia = "Plano" THEN
    IF cantidadSellos = "Dos" THEN
      Ocultar: anchoSelloLateral
    ELSE IF cantidadSellos = "Tres" THEN
      Mostrar: anchoSelloLateral (obligatorio)
      Validar: anchoLateral >= 0 AND anchoLateral <= 500
    END IF
  END IF

Campos Dinámicos: anchoSelloLateral

Ocurrencia:    2 casuísticas (POUCH Plano)
Crítico:       ✅ BLOQUEADOR
Niveles:       2 (familia → cantidad)
```

### V3.3 - Cascada Sello Central PE-PE/PE + Microperforado (ESPECIAL)
```
Función:      validateSelloCentralPECascade(material, tieneFuelle, hasMicro)
Lógica:
  IF material = "PE-PE/PE" AND tieneFuelle = "Sí" THEN
    Mostrar: ¿Tiene Microperforado? (Sí/No)
    
    IF hasMicroperforado = "Sí" THEN
      Mostrar: Lado Aleta (Derecho/Izquierdo)
      Mostrar: Tipo Microperforado (Total/Parcial)
      Mostrar: Separación Puas (0-50 mm)
      Mostrar: Distancia Lado Aleta (0-500 mm)
      Validar: Todos los campos requeridos
    ELSE
      Ocultar: Campos Microperforado
    END IF
    
    Mostrar: Ancho Sello Aleta (10/12/15)
    Mostrar: Sello Ancho Transversal
    Cálculo: Ancho Total = Aleta + Transversal
    
  ELSE IF material = "PE-PE/PE" AND tieneFuelle = "No" THEN
    Ocultar: Todos los Microperforado
    Mostrar: Ancho Sello Aleta (10/12/15)
    Mostrar: Sello Ancho Transversal
    Cálculo: Ancho Total = Aleta + Transversal
    
  ELSE (Aleta o Otro)
    Ocultar: Microperforado
    Ocultar: Ancho Sello Aleta
    Ocultar: Sello Ancho Transversal
  END IF

Campos Dinámicos: 8 (microperforado + sello)
Cambios de Visibilidad: 4 ramas distintas
Cálculos: 1 (Ancho Total)

Ocurrencia:    6 casuísticas (POUCH Sello Central PE-PE/PE)
Crítico:       ✅ BLOQUEADOR
Niveles:       4 (material → fuelle → microperforado → campos)
```

### V3.4 - Cascada Fotoregistro LÁMINA (ESPECIAL)
```
Función:      validateFotoregistroCascade(hasPhoto1, countFR, fr2Modo)
Lógica:
  IF hasPhotoregister1 = "Sí" THEN
    Mostrar: FR1 section (7 campos + 4 márgenes calculados)
    Validar: FR1 Width (1-9999)
    Validar: FR1 Height (1-9999)
    Validar: FR1 Reference H/V
    Validar: FR1 Distance H/V (0-9999)
    Cálculo: Márgenes (left, right, top, bottom)
    
    Mostrar: ¿Cuántos FR? (1/2)
    
    IF countFotoregistros = 2 THEN
      Mostrar: FR2 Modo (Automático/Manual)
      
      IF fr2Modo = "Automático" THEN
        FR2 Width = FR1 Width (heredado)
        FR2 Height = FR1 Height (heredado)
        Ocultar: FR2 Width/Height (read-only)
      ELSE IF fr2Modo = "Manual" THEN
        Mostrar: FR2 Width (editable, 1-9999)
        Mostrar: FR2 Height (editable, 1-9999)
        Validar: FR2 Width (1-9999)
        Validar: FR2 Height (1-9999)
      END IF
      
      Cálculo: Márgenes FR2
    END IF
    
  ELSE IF hasPhotoregister1 = "No" THEN
    Ocultar: FR1 section
    Ocultar: FR2 section
    Limpiar: Todos los campos FR si había valores previos
  END IF

Campos Dinámicos: 14 (7 FR1 + 4 márgenes + 2 FR2 + 4 márgenes FR2 - algunos heredados)
Cambios de Visibilidad: 3 ramas (No, 1 FR, 2 FR)
Sub-rama: Automático vs Manual
Cálculos: 2 márgenes sets

Ocurrencia:    3 casuísticas (LÁMINA)
Crítico:       ✅ BLOQUEADOR
Niveles:       4 (hasPhoto → countFR → fr2Modo → visibilidad)
```

### V3.5 - Cascada Wicket BOLSA (ESPECIAL)
```
Función:      validateWicketCascade(presentacion, tieneFuelle, tieneFicket)
Lógica:
  IF presentacion = "Wicket" THEN
    Mostrar: ¿Tiene Wicket? (Sí/No)
    
    IF tieneFicket = "Sí" THEN
      Mostrar: Diámetro Wicket (D12/D14/D16)
      Mostrar: Control Wicket (Sencillo/Doble)
      Mostrar: Wicket Precorte (Sí/No)
      Mostrar: Wicket Dispensador (Sí/No)
      Mostrar: Wicket Fotocélula (Sí/No)
      Validar: Diámetro requerido
      Validar: Control requerido
    ELSE
      Ocultar: Campos Wicket
    END IF
    
    Mostrar: Accesorios (Asa, Refuerzo)
    Mostrar: Accesorios Internos (Corte, Esquinas, etc.)
    
  ELSE (Bolsa, Hojas)
    Ocultar: Todos los campos Wicket
    Mostrar: Accesorios (normales)
  END IF

Campos Dinámicos: 5 (wicket params)
Cambios de Visibilidad: 2 ramas

Ocurrencia:    1 casuística (BOLSA Wicket)
Crítico:       ⚪ Informativo
Niveles:       3 (presentacion → tieneFicket → params)
```

### V3.6 - Validación ESPECIAL Doy Pack Completa (ESPECIAL)
```
Función:      validateDoyPackComplete(tipoStandUp, width, length, fuelle)
Lógica:
  IF tipoStandUp = "Doy Pack" THEN
    APLICAR VALIDACIONES ESPECIALES:
    
    Width:
      Normal:     1-500 mm
      DoyPack:    80-230 mm ⚠️
      Si width < 80: Error "Ancho Doy Pack MÍNIMO 80 mm"
      Si width > 230: Error "Ancho Doy Pack MÁXIMO 230 mm"
    
    Length:
      Normal:     1-500 mm
      DoyPack:    134-340 mm ⚠️
      Si length < 134: Error "Largo Doy Pack MÍNIMO 134 mm"
      Si length > 340: Error "Largo Doy Pack MÁXIMO 340 mm"
    
    Fuelle:
      Normal:     0-500 mm
      DoyPack:    0-3 mm ⚠️
      Si fuelle > 3: Error "Fuelle Doy Pack MÁXIMO 3 mm"
    
    Perímetro:
      Normal:     2×(w+l) → 100-15000 mm
      DoyPack:    2×(w+l) → 100-650 mm ⚠️
      Si perimet > 650: Error "Perímetro Doy Pack MÁXIMO 650 mm"
    
    Validar: Todos 4 campos simultáneamente
    Bloquear: Submit si CUALQUIER validación falla

Campos Afectados: 4 (width, length, fuelle, perímetro)
Rangos Especiales: 4 (todos reducidos)
Severidad: ✅ CRÍTICO - BLOQUEADOR

Ocurrencia:    4 casuísticas (POUCH Stand Up Doy Pack)
Crítico:       ✅ BLOQUEADOR
Niveles:       1 (pero 4 validaciones paralelas especiales)
```

### V3.7 - Validación Cascada Sello Lateral/Fondo BOLSA (ESPECIAL)
```
Función:      validateSelloSelectionBolsa(presentacion, tipoSello, acabado)
Lógica:
  IF presentacion = "Bolsa" THEN
    Mostrar: Tipo Sello (Lateral/Fondo)
    
    IF tipoSello = "Lateral" THEN
      Mostrar: Acabado (Corte/Pestaña) - OBLIGATORIO
      Validar: Acabado requerido
      Mostrar: Accesorios (normales)
      
      IF acabado = "Corte" THEN
        Blueprint: "BOLSA LATERAL CORTE"
      ELSE IF acabado = "Pestaña" THEN
        Blueprint: "BOLSA LATERAL PESTAÑA"
      END IF
      
    ELSE IF tipoSello = "Fondo" THEN
      Ocultar: Acabado
      Mostrar: Accesorios (normales)
      Blueprint: "BOLSA SELLO FONDO"
    END IF
    
  ELSE (Wicket, Hojas)
    Ocultar: Tipo Sello
    Ocultar: Acabado
  END IF

Campos Dinámicos: Acabado (visible/obligatorio/oculto)
Cambios de Visibilidad: 2 ramas (Lateral, Fondo)
Cálculos: Blueprint (3 variantes)

Ocurrencia:    3 casuísticas (BOLSA Lateral Corte/Pestaña + Fondo)
Crítico:       ✅ BLOQUEADOR (Acabado)
Niveles:       3 (presentacion → tipoSello → acabado)
```

### V3.8 - Validación Condicional de Obligatoriedad (ESPECIAL)
```
Función:      validateConditionalRequiredFields(form)
Lógica:
  Base (SIEMPRE obligatorios):
    ✅ Envoltura
    ✅ Tipo Formato
    ✅ Width
    ✅ Length/Repetition (según formato)
    ✅ Perímetro
    ✅ Material [SI]
  
  Condicionales Formato LÁMINA:
    ✅ Sentido Bobinado
    ✅ Diámetro Core
    ✅ Variaciones Core
    ✅ FR1 fields (IF hasPhoto1 = Sí)
    ✅ FR2 fields (IF countFR = 2)
  
  Condicionales Formato BOLSA:
    ✅ Tipo Sello
    ✅ Acabado (IF tipoSello = Lateral)
    ✅ Ancho Fuelle (IF tieneFuelle = Sí)
    ✅ Wicket fields (IF presentacion = Wicket)
  
  Condicionales Formato POUCH:
    ✅ Familia
    ✅ Sub-familia/Cantidad/Material (según Familia)
    ✅ Ancho Fuelle (IF tieneFuelle = Sí)
    ✅ Microperforado fields (IF PE-PE/PE + Fuelle)
    ✅ Sello Central fields (IF Familia = SelloCentral)

Lógica General:
  FOR EACH campo IN form:
    IF campo IS condicional THEN
      IF condiciones NOT met THEN
        Campo no es requerido (puede estar vacío)
        Campo no es validado
      ELSE
        Campo ES requerido
        Campo ES validado
    END IF
  END FOR
  
  IF ANY requerido está vacío:
    Retornar error y lista de campos faltantes
    BLOQUEAR submit

Campos Dinámicos: 15-20 por casuística (depende de selecciones)
Complejidad: O(n×m) donde n=campos, m=condiciones

Ocurrencia:    27 casuísticas (TODAS)
Crítico:       ✅ BLOQUEADOR
Niveles:       Variable (depende de cascada)
```

### V3.9 - Validación Cruzada Fuelle + Microperforado (ESPECIAL)
```
Función:      validateFuelleAndMicroperf(material, tieneFuelle, hasMicro)
Lógica:
  IF material = "PE-PE/PE" THEN
    IF tieneFuelle = "Sí" THEN
      Mostrar: ¿Tiene Microperforado? (Sí/No)
      
      IF hasMicroperforado = "Sí" THEN
        Validar: Lado Aleta (requerido)
        Validar: Tipo Microperforado (requerido)
        Validar: Separación Puas >= 0 (requerido)
        Validar: Distancia Lado Aleta >= 0 (requerido)
        SI FALLA ALGUNO: Bloquear submit
      ELSE
        Limpiar: Campos Microperforado
      END IF
      
    ELSE IF tieneFuelle = "No" THEN
      Ocultar: Microperforado section
      Limpiar: Campos Microperforado
    END IF
    
  ELSE (Aleta, Otro)
    Ocultar: Microperforado section
    Limpiar: Campos Microperforado
  END IF

Campos Validados: 4 (si Micro=Sí)
Cambios de Estado: 3 ramas (PE+Sí+Sí, PE+Sí+No, otros)

Ocurrencia:    6 casuísticas (POUCH Sello Central PE-PE/PE)
Crítico:       ✅ BLOQUEADOR
Niveles:       3 (material → fuelle → microperforado)
```

### V3.10 - Validación de Blueprint Format (Auto-generation) (ESPECIAL)
```
Función:      generateBlueprintFormat(tipoEnvoltura, otrosParams)
Lógica:
  IF tipoEnvoltura = "LÁMINA" THEN
    IF tipoFormato = "Genérica" THEN
      Blueprint = "GENERICA"
    ELSE IF tipoFormato = "Tissue" THEN
      Blueprint = "TISSUE"
    ELSE IF tipoFormato = "Food" THEN
      Blueprint = "FOOD"
    END IF

  ELSE IF tipoEnvoltura = "BOLSA" THEN
    IF presentacion = "Bolsa" THEN
      IF tipoSello = "Lateral" THEN
        IF acabado = "Corte" THEN
          Blueprint = "BOLSA LATERAL CORTE"
        ELSE
          Blueprint = "BOLSA LATERAL PESTAÑA"
        END IF
      ELSE
        Blueprint = "BOLSA SELLO FONDO"
      END IF
    ELSE IF presentacion = "Wicket" THEN
      Blueprint = "WICKET"
    ELSE IF presentacion = "Hojas" THEN
      Blueprint = "HOJAS"
    END IF

  ELSE IF tipoEnvoltura = "POUCH" THEN
    IF familia = "Stand Up" THEN
      IF subFamilia = "Sello K" THEN
        Blueprint = "POUCH STAND UP\SELLO K"
      ELSE IF subFamilia = "Normal" THEN
        Blueprint = "POUCH STAND UP\NORMAL"
      ELSE IF subFamilia = "Doy Pack" THEN
        Blueprint = "POUCH STAND UP\DOY PACK {BASE}\FUELLE {TIPO}"
      END IF
    ELSE IF familia = "Plano" THEN
      Blueprint = "POUCH PLANO\{CANTIDAD} SELLOS"
    ELSE IF familia = "Sello Central" THEN
      Blueprint = "POUCH C/SELLO CENTRAL\TIPO {MATERIAL}\{FUELLE}"
    ELSE IF familia = "Sello Fuelle" THEN
      Blueprint = "POUCH C/SELLO EN FUELLE\{TIPO}\FUELLE PROPIO"
    END IF
  END IF
  
  RETURN Blueprint

Variantes: 15+ (3 LÁMINA + 5 BOLSA + 6+ POUCH)
Lógica: Nested IF/ELSE (4 niveles)
Trigger: onChange cualquier campo de tipo

Ocurrencia:    27 casuísticas (TODAS)
Crítico:       ⚪ Informativo (pero importante para trazabilidad)
Niveles:       4 (envoltura → familia → subfamilia → variantes)
Automático:    ✅ Auto-generated (no editable)
```

---

# RESUMEN POR COMPLEJIDAD

## Distribución Total

| Nivel | Cantidad | Campos Afectados | Promedio por Casuística | Crítico |
|:---|:---:|:---:|:---:|:---|
| **Simples** | 15 | 1 | 1.7 | ⚪ 50% |
| **Normales** | 20 | 2-3 | 2.5 | ✅ 80% |
| **Complejas** | 10 | 3-18 | 4.2 | ✅ 100% |
| **TOTAL** | **45** | **1-18** | **2.8** | **80%** |

## Validaciones Críticas (Bloqueadores)

```
✅ BLOQUEADORES (25):
├─ V1.10 - Material [SI] requerido
├─ V1.11 - Envoltura requerida
├─ V1.12 - Tipo Formato requerido
├─ V1.13 - Sentido Bobinado (LÁMINA)
├─ V2.1 - Período LÁMINA
├─ V2.2 - Período BOLSA
├─ V2.3 - Período POUCH
├─ V2.4 - Fuelle Condicional (BOLSA)
├─ V2.5 - Fuelle Condicional (POUCH)
├─ V2.6 - Acabado (BOLSA Lateral)
├─ V2.7 - Sello Lateral Plano (POUCH)
├─ V2.9 - FR1 Condicional (LÁMINA)
├─ V2.10 - FR2 Condicional (LÁMINA)
├─ V2.13 - Máximo Accesorios (BOLSA)
├─ V2.14 - Máximo Accesorios (POUCH)
├─ V3.1 - Cascada Stand Up (POUCH DoyPack)
├─ V3.3 - Cascada Sello Central (POUCH)
├─ V3.4 - Cascada Fotoregistro (LÁMINA)
├─ V3.6 - Validación DoyPack Completa
├─ V3.7 - Cascada Sello BOLSA
├─ V3.8 - Condicional Obligatorios
├─ V3.9 - Fuelle + Microperforado
└─ Plus: 3-5 más según implementación

⚪ INFORMATIVOS (20):
├─ V1.1-V1.9 - Rangos simples
├─ V2.8 - Wicket (BOLSA)
├─ V2.11-V2.20 - Cálculos y validaciones
├─ V3.10 - Blueprint Format
└─ Otros: Campos calculados y opcionales
```

---

**🔍 DOCUMENTO COMPLETO - Validaciones por Complejidad** ✅

**Resumen:**
- ✅ 15 Validaciones Simples
- ✅ 20 Validaciones Normales
- ✅ 10 Validaciones Complejas (Especiales)
- ✅ 45 Validaciones Totales
- ✅ 25 Bloqueadores (Críticas)
- ✅ 20 Informativas
