import { useEffect } from "react"
import { useLayout } from "../../../components/layout/LayoutContext"

export default function ProductSheetPage() {
  const { setHeader, resetHeader } = useLayout()

  useEffect(() => {
    setHeader({
      title: "Fichas de Producto",
      subtitle: "Consulta y administración de fichas técnicas",
    })
    return () => resetHeader()
  }, [setHeader, resetHeader])

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <p className="text-sm text-gray-400">Imagen del producto</p>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Código del Producto</label>
                <input
                  type="text"
                  placeholder="PROD-001"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
                <select className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                  <option value="">Seleccionar categoría</option>
                  <option>Empaque Flexible</option>
                  <option>Empaque Rígido</option>
                  <option>Etiquetas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Información Detallada</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                <textarea
                  rows={4}
                  placeholder="Descripción detallada del producto..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Especificaciones Técnicas</label>
                <textarea
                  rows={4}
                  placeholder="Especificaciones técnicas..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Material</label>
                <input
                  type="text"
                  placeholder="Material del producto"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Dimensiones</label>
                <input
                  type="text"
                  placeholder="Largo x Ancho x Alto"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
