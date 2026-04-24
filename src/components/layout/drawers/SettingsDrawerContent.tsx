interface SettingsDrawerContentProps {
  onClose: () => void
}

const SettingsDrawerContent = ({ onClose }: SettingsDrawerContentProps) => (
  <div className="space-y-4">
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-sm font-semibold text-gray-900">Preferencias</p>
      <p className="text-xs text-gray-500 mt-1">Ajustes básicos del portal.</p>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Modo compacto</p>
          <p className="text-xs text-gray-500">Reduce espacios en tablas y listas.</p>
        </div>
        <input type="checkbox" className="h-4 w-4" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Notificaciones por email</p>
          <p className="text-xs text-gray-500">Recibir alertas relevantes.</p>
        </div>
        <input type="checkbox" className="h-4 w-4" defaultChecked />
      </div>
    </div>

    <div className="flex items-center justify-end gap-2">
      <button
        onClick={onClose}
        className="h-10 px-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cerrar
      </button>
    </div>
  </div>
)

export default SettingsDrawerContent
