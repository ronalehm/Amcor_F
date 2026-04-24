const fs = require("fs");
const path = require("path");

// 1. Fix projectStorage.ts duplicate fields
const projectStoragePath = "src/shared/data/projectStorage.ts";
let pCode = fs.readFileSync(projectStoragePath, "utf-8");
pCode = pCode.replace(/  format\?: string;\n/g, (match, offset, str) => {
  return offset < 1000 ? match : "";
});
pCode = pCode.replace(/  layers\?: string;\n/g, (match, offset, str) => {
  return offset < 1000 ? match : "";
});
pCode = pCode.replace(/  dimensions\?: string;\n/g, (match, offset, str) => {
  return offset < 1000 ? match : "";
});
fs.writeFileSync(projectStoragePath, pCode);

// 2. Fix ProjectCreatePage.tsx
const createPagePath = "src/modules/projects/pages/ProjectCreatePage.tsx";
let cpCode = fs.readFileSync(createPagePath, "utf-8");
cpCode = cpCode.replace(/status: "Creado",/, 'status: "Creado" as any,');
fs.writeFileSync(createPagePath, cpCode);

// 3. Fix PortfolioListPage.tsx setStatusFilter unused
const plPath = "src/modules/portfolio/pages/PortfolioListPage.tsx";
let plCode = fs.readFileSync(plPath, "utf-8");
plCode = plCode.replace(/const \[statusFilter, setStatusFilter\] = useState\("Todos"\);/, 'const [statusFilter] = useState("Todos");');
fs.writeFileSync(plPath, plCode);

// 4. Fix ProjectListPage.tsx name error & setStatusFilter
const pLPath = "src/modules/projects/pages/ProjectListPage.tsx";
let pLCode = fs.readFileSync(pLPath, "utf-8");
pLCode = pLCode.replace(/project.name \|\|/g, "project.projectName ||");
fs.writeFileSync(pLPath, pLCode);

// 5. Fix type imports
const fixImports = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      let changed = false;

      // Replace unused React
      if (content.match(/import React from ['"]react['"];?/)) {
        content = content.replace(/import React from ['"]react['"];?\n?/g, "");
        changed = true;
      }
      
      // Fix types for verbatimModuleSyntax (naively adding 'type ' to known types)
      const types = [
        "ProjectStage", "ObservationRecord", "ProjectSlaTracking", 
        "ProjectStatusHistory", "SlaStatus", "ProjectStatus", "PortalStage",
        "PortfolioRecord", "ProjectRecord", "ReactNode"
      ];
      for (const t of types) {
        const regex = new RegExp(`import \\{([^\\}]*\\b)${t}(\\b[^\\}]*)\\} from`, "g");
        content = content.replace(regex, (match, p1, p2) => {
          if (!match.includes(`type ${t}`)) {
            changed = true;
            return `import {${p1}type ${t}${p2}} from`;
          }
          return match;
        });
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
};

fixImports("src");
console.log("Fixes applied!");
