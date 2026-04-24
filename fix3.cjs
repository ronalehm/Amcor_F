const fs = require('fs');

// 1. Fix projectStorage.ts duplicate identifiers
let pStore = fs.readFileSync('src/shared/data/projectStorage.ts', 'utf-8');
const lines = pStore.split('\n');
const uniqueLines = [];
const seen = new Set();
let inInterface = false;

for (let line of lines) {
  if (line.includes('export type ProjectRecord = {')) inInterface = true;
  if (line.includes('}')) inInterface = false;
  
  if (inInterface && line.trim().endsWith('?;') || line.trim().endsWith('?: string;')) {
    const key = line.split('?')[0].trim();
    if (seen.has(key)) continue;
    seen.add(key);
  }
  uniqueLines.push(line);
}
fs.writeFileSync('src/shared/data/projectStorage.ts', uniqueLines.join('\n'));

// 2. Fix ClientCreatePage.tsx
let cCreate = fs.readFileSync('src/modules/clients/pages/ClientCreatePage.tsx', 'utf-8');
cCreate = cCreate.replace(/import { useEffect, useState, useMemo } from "react";\nimport { useEffect, useMemo, useState } from "react";/, 'import { useEffect, useState, useMemo } from "react";');
fs.writeFileSync('src/modules/clients/pages/ClientCreatePage.tsx', cCreate);

// 3. Fix DashboardPage.tsx missing imports
let dPage = fs.readFileSync('src/modules/dashboard/pages/DashboardPage.tsx', 'utf-8');
if (!dPage.includes('getProjectSlaSummary')) {
  dPage = dPage.replace(/import { getProjectObservations }/, 'import { getProjectSlaSummary, getProjectStatusHistory } from "../../../shared/data/slaStorage";\nimport { getProjectObservations }');
}
fs.writeFileSync('src/modules/dashboard/pages/DashboardPage.tsx', dPage);

// 4. Fix ProjectCreatePage.tsx executiveId -> ejecutivoId
let pCreate = fs.readFileSync('src/modules/projects/pages/ProjectCreatePage.tsx', 'utf-8');
pCreate = pCreate.replace(/executiveId: form\.executiveId,/, 'ejecutivoId: Number(form.executiveId) || undefined,');
fs.writeFileSync('src/modules/projects/pages/ProjectCreatePage.tsx', pCreate);

// 5. Fix ProjectDetailPage.tsx missing projectCode
let pDetail = fs.readFileSync('src/modules/projects/pages/ProjectDetailPage.tsx', 'utf-8');
pDetail = pDetail.replace(/<ProjectActionPanel\s+stageCode=\{currentStage\}/, '<ProjectActionPanel projectCode={projectCode as string} stageCode={currentStage}');
fs.writeFileSync('src/modules/projects/pages/ProjectDetailPage.tsx', pDetail);

// 6. Fix main.tsx React imports
let mainTsx = fs.readFileSync('src/main.tsx', 'utf-8');
if (!mainTsx.includes('import React')) {
  mainTsx = 'import React from "react";\n' + mainTsx;
  fs.writeFileSync('src/main.tsx', mainTsx);
}

console.log("Fix3 complete!");
