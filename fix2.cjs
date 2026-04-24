const fs = require('fs');

// 1. projectStorage.ts duplicate fields
let pStore = fs.readFileSync('src/shared/data/projectStorage.ts', 'utf-8');
pStore = pStore.replace(/  format\?: string;\n/g, '');
pStore = pStore.replace(/  layers\?: string;\n/g, '');
pStore = pStore.replace(/  dimensions\?: string;\n/g, '');
// Re-insert once
pStore = pStore.replace(/  projectName: string;\n/, "  projectName: string;\n  format?: string;\n  layers?: string;\n  dimensions?: string;\n");
fs.writeFileSync('src/shared/data/projectStorage.ts', pStore);

// 2. ClientCreatePage.tsx imports
let cCreate = fs.readFileSync('src/modules/clients/pages/ClientCreatePage.tsx', 'utf-8');
if (!cCreate.includes('import { useEffect')) cCreate = 'import { useEffect, useState, useMemo } from "react";\n' + cCreate;
if (!cCreate.includes('getNextClientCode')) {
  cCreate = cCreate.replace(/import {([^}]*)} from "\.\.\/\.\.\/\.\.\/shared\/data\/clientStorage";/, 'import {$1, getNextClientCode, getNextClientId, saveClientRecord } from "../../../shared/data/clientStorage";');
}
cCreate = cCreate.replace(/const options = \[.*?\];/s, '');
fs.writeFileSync('src/modules/clients/pages/ClientCreatePage.tsx', cCreate);

// 3. main.tsx React imports
let mainTsx = fs.readFileSync('src/main.tsx', 'utf-8');
if (!mainTsx.includes('import React')) mainTsx = 'import React from "react";\n' + mainTsx;
fs.writeFileSync('src/main.tsx', mainTsx);

// 4. ProjectDetailPage.tsx
let pd = fs.readFileSync('src/modules/projects/pages/ProjectDetailPage.tsx', 'utf-8');
pd = pd.replace(/\.\.\/\.\.\/components\/ProjectActionPanel/, '../components/ProjectActionPanel');
pd = pd.replace(/project\.description/g, 'project.projectDescription');
pd = pd.replace(/project\.executiveName/g, 'project.ejecutivoName');
fs.writeFileSync('src/modules/projects/pages/ProjectDetailPage.tsx', pd);

// 5. ProjectCreatePage.tsx
let pc = fs.readFileSync('src/modules/projects/pages/ProjectCreatePage.tsx', 'utf-8');
pc = pc.replace(/description: form\.description,/, 'projectDescription: form.description,');
fs.writeFileSync('src/modules/projects/pages/ProjectCreatePage.tsx', pc);

// 6. PortfolioCreatePage.tsx useLayout
let pfc = fs.readFileSync('src/modules/portfolio/pages/PortfolioCreatePage.tsx', 'utf-8');
if (!pfc.includes('import { useEffect')) pfc = 'import { useEffect, useState, useMemo } from "react";\n' + pfc;
fs.writeFileSync('src/modules/portfolio/pages/PortfolioCreatePage.tsx', pfc);

console.log("Fix2 completed!");
