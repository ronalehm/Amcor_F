import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SubHeader from "./SubHeader";
import { LayoutProvider, useLayout } from "./LayoutContext";
import Drawer from "../ui/Drawer";

const LayoutShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { header, drawer, closeDrawer } = useLayout();

  const sidebarColWidth = sidebarOpen ? "w-72" : "w-20";

  return (
    <div className="h-dvh bg-gray-50 overflow-hidden isolate">
      <div className="grid h-full min-h-0 grid-rows-[64px_1fr] grid-cols-[auto_1fr]">
        {/* Header principal */}
        <div className="row-start-1 col-span-2 z-[100] relative">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Sidebar */}
        <div className={`row-start-2 col-start-1 z-20 min-h-0 ${sidebarColWidth}`}>
          <Sidebar isOpen={sidebarOpen} />
        </div>

        {/* Contenido principal */}
        <main className="row-start-2 col-start-2 min-w-0 min-h-0 overflow-y-auto relative z-0">
          <div className="sticky top-0 z-10 bg-gray-50">
            <SubHeader
              title={header?.title}
              subtitle={header?.subtitle}
              actions={header?.actions}
              tabs={header?.tabs}
            />
          </div>

          <div className="px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      <Drawer
        open={drawer?.open}
        title={drawer?.title}
        subtitle={drawer?.subtitle}
        widthClassName={drawer?.widthClassName}
        onClose={closeDrawer}
      >
        {drawer?.content}
      </Drawer>
    </div>
  );
};

export default function Layout() {
  return (
    <LayoutProvider>
      <LayoutShell />
    </LayoutProvider>
  );
}