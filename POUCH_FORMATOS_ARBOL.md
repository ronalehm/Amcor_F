# 🎯 Árbol de Formatos POUCH - Estructura Condicional Completa

## 📊 Árbol Jerárquico de Decisiones

```
POUCH
├── 1️⃣ STAND UP POUCH
│   ├── A. Sello K (TIPO K)
│   │   └── Genera: POUCH STAND UP\TIPO K\FUELLE PROPIO
│   │       │
│   │       ├── Dimensiones:
│   │       │   ├── width (OBLIGATORIO) ✅
│   │       │   ├── length (OBLIGATORIO) ✅
│   │       │   └── anchoFuelle (OBLIGATORIO) ✅
│   │       │
│   │       └── Accesorios: [hasta 3]
│   │           ├── Zipper
│   │           ├── Tin-Tie
│   │           └── Valve
│   │
│   ├── B. Normal
│   │   └── Genera: POUCH STAND UP\NORMAL\FUELLE PROPIO
│   │       │
│   │       ├── Dimensiones:
│   │       │   ├── width (OBLIGATORIO) ✅
│   │       │   ├── length (OBLIGATORIO) ✅
│   │       │   └── anchoFuelle (OBLIGATORIO) ✅
│   │       │
│   │       └── Accesorios: [hasta 3]
│   │           └── [Igual que Sello K]
│   │
│   └── C. Doy Pack
│       ├── Base: Redondo / Cuadrado (OBLIGATORIO) ✅
│       ├── Tipo Fuelle: Propio / Insertado (OBLIGATORIO) ✅
│       │
│       ├── Si Base = Redondo + Fuelle = Propio:
│       │   └── Genera: POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO
│       │
│       ├── Si Base = Redondo + Fuelle = Insertado:
│       │   └── Genera: POUCH STAND UP\DOY PACK REDONDO\FUELLE INSERTADO
│       │
│       ├── Si Base = Cuadrado + Fuelle = Propio:
│       │   └── Genera: POUCH STAND UP\DOY PACK CUADRADO\FUELLE PROPIO
│       │
│       ├── Si Base = Cuadrado + Fuelle = Insertado:
│       │   └── Genera: POUCH STAND UP\DOY PACK CUADRADO\FUELLE INSERTADO
│       │
│       ├── Dimensiones:
│       │   ├── width (OBLIGATORIO) ✅
│       │   ├── length (OBLIGATORIO) ✅
│       │   └── anchoFuelle (OBLIGATORIO) ✅
│       │
│       └── Validación especial:
│           └── Si tipoFormatoPouch = "Doy Pack"
│               ├── width: 80-230 mm ⚠️
│               ├── length: 134-340 mm ⚠️
│               └── anchoFuelle: 0-3 mm ⚠️
│
├── 2️⃣ POUCH PLANO
│   ├── A. DOS SELLOS
│   │   └── Genera: POUCH PLANO\DOS SELLOS
│   │       │
│   │       ├── Dimensiones:
│   │       │   ├── width (OBLIGATORIO) ✅
│   │       │   ├── length (OBLIGATORIO) ✅
│   │       │   └── anchoFuelle (OBLIGATORIO) ✅
│   │       │
│   │       ├── Especificaciones Sello:
│   │       │   ├── anchoSello (ancho sello) 📝
│   │       │   └── selloAnchoTransversal (ancho transversal) 📝
│   │       │
│   │       └── Accesorios consumibles: [hasta 3]
│   │           ├── Zipper
│   │           │   └── distanciaAbocaZipper 📝
│   │           ├── Notch/Muesca
│   │           │   └── distanciaAbocaMuesca 📝
│   │           └── Perforación
│   │               ├── distanciaAbocaPerforacion 📝
│   │               └── Tipo perforación
│   │
│   └── B. TRES SELLOS
│       └── Genera: POUCH PLANO\TRES SELLOS
│           │
│           ├── Dimensiones:
│           │   ├── width (OBLIGATORIO) ✅
│           │   ├── length (OBLIGATORIO) ✅
│           │   └── anchoFuelle (OBLIGATORIO) ✅
│           │
│           ├── Especificaciones Sello:
│           │   ├── anchoSello (ancho sello) 📝
│           │   ├── selloAnchoTransversal (ancho transversal) 📝
│           │   └── anchoSelloLateral (ancho lateral - SOLO EN TRES SELLOS) 📝
│           │
│           └── Accesorios: [Igual que DOS SELLOS]
│
├── 3️⃣ POUCH CON SELLO CENTRAL
│   ├── Material: PE-PE/PE / Aleta / Otro material (OBLIGATORIO) ✅
│   ├── ¿Tiene Fuelle?: Sí / No (OBLIGATORIO) ✅
│   │
│   ├── A. PE-PE/PE + CON FUELLE
│   │   └── Genera: POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE (PE-PE/PE)
│   │       │
│   │       ├── Dimensiones:
│   │       │   ├── width (OBLIGATORIO) ✅
│   │       │   ├── length (OBLIGATORIO) ✅
│   │       │   └── anchoFuelleCerrado 📝
│   │       │
│   │       ├── Especificaciones Sello Central:
│   │       │   ├── anchoSelloAleta (10/12/15) 📝
│   │       │   └── selloAnchoTransversal 📝
│   │       │
│   │       ├── Microperforado: Sí/No 📝
│   │       │   ├── Lado (Derecho/Izquierdo) 📝
│   │       │   ├── Tipo (Total/Parcial) 📝
│   │       │   ├── Separación de puas 📝
│   │       │   └── Distancia al lado 📝
│   │       │
│   │       └── Cálculo automático:
│   │           └── Ancho Total = anchoSelloAleta + selloAnchoTransversal
│   │
│   ├── B. PE-PE/PE + SIN FUELLE
│   │   └── Genera: POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE (PE-PE/PE)
│   │       └── [Igual que A, pero sin anchoFuelleCerrado]
│   │
│   ├── C. ALETA + CON FUELLE
│   │   └── Genera: POUCH C/SELLO CENTRAL\TIPO ALETA\CON FUELLE
│   │       └── [Igual que A]
│   │
│   └── D. ALETA + SIN FUELLE
│       └── Genera: POUCH C/SELLO CENTRAL\TIPO ALETA\SIN FUELLE
│           └── [Igual que B]
│
└── 4️⃣ POUCH CON SELLO EN FUELLE
    ├── A. TIPO 4-1
    │   └── Genera: POUCH C/SELLO EN FUELLE\TIPO 4-1\FUELLE PROPIO
    │       │
    │       ├── Dimensiones:
    │       │   ├── width (OBLIGATORIO) ✅
    │       │   ├── length (OBLIGATORIO) ✅
    │       │   └── anchoFuelle (OBLIGATORIO) ✅
    │       │
    │       ├── Especificaciones:
    │       │   └── anchoSelloLateral (Ancho Lateral del Sello) 📝
    │       │
    │       ├── Cálculos Automáticos:
    │       │   ├── Ancho Total = [calculado]
    │       │   └── Perímetro = [calculado]
    │       │
    │       └── Accesorios: [hasta 3]
    │           └── [Zipper, Tin-Tie, Valve, etc.]
    │
    └── B. TIPO 1-1
        └── Genera: POUCH C/SELLO EN FUELLE\TIPO 1-1
            └── [Similar a TIPO 4-1]
```

---

## 📋 Tabla de Campos Condicionales por Formato

| **Categoría** | **Campo** | **Tipo** | **Stand Up** | **Plano** | **Sello Central** | **Sello en Fuelle** | **Obligatorio** |
|---------------|-----------|---------|:---:|:---:|:---:|:---:|:---:|
| **IDENTIDAD** | tipoFormatoPouch | Select | ✅ | ✅ | ✅ | ✅ | ✅ **OBLIGATORIO** |
| | tipoStandUpPouch | Select | ✅ | - | - | - | ✅ si Stand Up |
| | cantidadSellosPouchPlano | Select | - | ✅ | - | - | ✅ si Plano |
| | materialSelloCentralPouch | Select | - | - | ✅ | - | ✅ si Sello Central |
| | tipoSelloFuellePouch | Select | - | - | - | ✅ | ✅ si Sello en Fuelle |
| **DOY PACK** | formaDoyPackPouch | Select | ✅ si Doy Pack | - | - | - | ✅ si Doy Pack |
| | tipoFuelleStandUpPouch | Select | ✅ si Doy Pack | - | - | - | ✅ si Doy Pack |
| **FUELLE** | tieneFuelleSelloCentralPouch | Select | - | - | ✅ | - | ✅ si Sello Central |
| **DIMENSIONES** | width | Input | ✅ | ✅ | ✅ | ✅ | ✅ **OBLIGATORIO** |
| | length | Input | ✅ | ✅ | ✅ | ✅ | ✅ **OBLIGATORIO** |
| | anchoFuelle | Input | ✅ | ✅ | ✅ | ✅ | ✅ **OBLIGATORIO** |
| | anchoFuelleCerrado | Input | - | - | ✅ si Con Fuelle | - | 📝 si Fuelle |
| **SELLO** | anchoSello | Input | - | ✅ | - | - | 📝 opcional |
| | selloAnchoTransversal | Input | - | ✅ | ✅ si PE-PE/PE | ✅ | 📝 opcional |
| | anchoSelloLateral | Input | - | ✅ si Tres Sellos | - | ✅ | 📝 opcional |
| | anchoSelloAleta | Select | - | - | ✅ si Aleta | - | 📝 si Aleta |
| **MICROPERFORADO** | microperforadoAleta | Select | - | - | ✅ si PE-PE/PE | - | 📝 opcional |
| | ladoAleta | Select | - | - | ✅ si PE-PE/PE | - | 📝 si Microperf |
| | tipoMicroperforado | Select | - | - | ✅ si PE-PE/PE | - | 📝 si Microperf |
| | separacionPuasAleta | Select | - | - | ✅ si PE-PE/PE | - | 📝 si Microperf |
| | distanciaLadoAleta | Input | - | - | ✅ si PE-PE/PE | - | 📝 si Microperf |
| **ACCESORIOS** | hasZipper | Checkbox | ✅ | ✅ | - | ✅ | 📝 opcional |
| | distanciaAbocaZipper | Input | ✅ | ✅ | - | ✅ | 📝 si Zipper |
| | hasTinTie | Checkbox | ✅ | ✅ | - | ✅ | 📝 opcional |
| | hasValve | Checkbox | ✅ | ✅ | - | ✅ | 📝 opcional |
| | valveType | Select | ✅ | ✅ | - | ✅ | 📝 si Valve |
| | distanciaAbocaValvula | Input | ✅ | ✅ | - | ✅ | 📝 si Valve |
| | hasNotch | Checkbox | - | ✅ | - | - | 📝 opcional |
| | distanciaAbocaMuesca | Input | - | ✅ | - | - | 📝 si Notch |
| | hasPerforation | Checkbox | - | ✅ | - | - | 📝 opcional |
| | pouchPerforationType | Select | - | ✅ | - | - | 📝 si Perf |
| | distanciaAbocaPerforacion | Input | - | ✅ | - | - | 📝 si Perf |
| **OTRAS OPCIONES** | hasDieCutHandle | Checkbox | ✅ | ✅ | - | ✅ | 📝 opcional |
| | tipoAsa | Select | ✅ | ✅ | - | ✅ | 📝 si Asa |
| | colorAsa | Select | ✅ | ✅ | - | ✅ | 📝 si Asa |
| | formaAsa | Select | ✅ | ✅ | - | ✅ | 📝 si Asa |
| | hasReinforcement | Checkbox | ✅ | ✅ | - | ✅ | 📝 opcional |
| | reinforcementThickness | Input | ✅ | ✅ | - | ✅ | 📝 si Reinf |
| | reinforcementWidth | Input | ✅ | ✅ | - | ✅ | 📝 si Reinf |

---

## 🔴 Campos OBLIGATORIOS

### **Nivel 1: Decisión Principal**
1. **tipoFormatoPouch** ✅ OBLIGATORIO
   - Select: Stand Up Pouch / Pouch Plano / Pouch con Sello Central / Pouch con Sello en Fuelle

### **Nivel 2: Subdivisiones Condicionales**
2. **tipoStandUpPouch** ✅ OBLIGATORIO si tipoFormatoPouch = "Stand Up Pouch"
   - Select: Sello K / Normal / Doy Pack

3. **cantidadSellosPouchPlano** ✅ OBLIGATORIO si tipoFormatoPouch = "Pouch Plano"
   - Select: Dos sellos / Tres sellos

4. **materialSelloCentralPouch** ✅ OBLIGATORIO si tipoFormatoPouch = "Pouch con Sello Central"
   - Select: PE-PE/PE / Aleta / Otro material

5. **tipoSelloFuellePouch** ✅ OBLIGATORIO si tipoFormatoPouch = "Pouch con Sello en Fuelle"
   - Select: Tipo 4-1 / Tipo 1-1

### **Nivel 3: Subdivisiones dentro de Stand Up > Doy Pack**
6. **formaDoyPackPouch** ✅ OBLIGATORIO si Stand Up + Doy Pack
   - Select: Redondo / Cuadrado

7. **tipoFuelleStandUpPouch** ✅ OBLIGATORIO si Stand Up + Doy Pack
   - Select: Fuelle Propio / Fuelle Insertado

### **Nivel 4: Subdivisiones dentro de Sello Central**
8. **tieneFuelleSelloCentralPouch** ✅ OBLIGATORIO si Sello Central
   - Select: Sí / No

---

## 📐 Dimensiones OBLIGATORIAS

Estos campos son **OBLIGATORIOS para TODOS los formatos POUCH**:

| Campo | Validación | Ejemplo |
|-------|-----------|---------|
| **width** | 0-500 mm (depende de formato) | 100 mm |
| **length** | 0-500 mm (depende de formato) | 150 mm |
| **anchoFuelle** | 0-500 mm (depende de formato) | 20 mm |

✅ **Validación especial para Doy Pack:**
- width: 80-230 mm
- length: 134-340 mm
- anchoFuelle: 0-3 mm

---

## 🎨 Ejemplo: Flujo Completo Stand Up Doy Pack Redondo

```
1. Seleccionar tipoFormatoPouch = "Stand Up Pouch" ✅ OBLIGATORIO
   → Se habilita campo tipoStandUpPouch
   
2. Seleccionar tipoStandUpPouch = "Doy Pack" ✅ OBLIGATORIO
   → Se habilitan campos formaDoyPackPouch y tipoFuelleStandUpPouch
   
3. Seleccionar formaDoyPackPouch = "Redondo" ✅ OBLIGATORIO
   → Se genera: POUCH STAND UP\DOY PACK REDONDO\[FUELLE PROPIO|INSERTADO]
   
4. Seleccionar tipoFuelleStandUpPouch = "Fuelle Propio" ✅ OBLIGATORIO
   → Genera FINAL: POUCH STAND UP\DOY PACK REDONDO\FUELLE PROPIO
   
5. Ingresar Dimensiones (TODAS OBLIGATORIAS):
   - width: 100 mm (rango 80-230) ✅
   - length: 200 mm (rango 134-340) ✅
   - anchoFuelle: 2 mm (rango 0-3) ✅
   
6. Agregar Accesorios (hasta 3, opcionales):
   - Zipper
   - Tin-Tie
   - Valve
   
→ LISTO PARA GUARDAR ✅
```

---

## 📊 Resumen de Obligatoriedad

| Tipo de Campo | Cantidad | Obligatorios | Condicionales | Opcionales |
|---------------|----------|:---:|:---:|:---:|
| **Selección Formato** | 4 | 1️⃣ | 3️⃣ | - |
| **Subdivisiones** | 8 | - | 8️⃣ | - |
| **Dimensiones** | 4 | 3️⃣ | 1️⃣ | - |
| **Sello/Especificaciones** | 7 | - | - | 7️⃣ |
| **Accesorios** | 12 | - | - | 12️⃣ |
| **TOTAL** | **35** | **4** | **12** | **19** |

---

**Leyenda:**
- ✅ = Disponible
- 📝 = Opcional (puede no completarse)
- ❌ = No aplicable en ese formato
