interface ProfileDrawerContentProps {
  onClose: () => void
}

const ProfileDrawerContent = ({ onClose }: ProfileDrawerContentProps) => (
  <div className="space-y-4">
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <p className="text-sm font-semibold text-gray-900">Juan Pérez</p>
      <p className="text-xs text-gray-500">juan.perez@amcor.com</p>
      <p className="text-xs text-gray-500 mt-1">Rol: Project Manager</p>
    </div>

    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600">Nombre</label>
        <input
          className="mt-1 w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          defaultValue="Juan Pérez"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600">Cargo</label>
        <input
          className="mt-1 w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          defaultValue="Project Manager"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600">Correo</label>
        <input
          className="mt-1 w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          defaultValue="juan.perez@amcor.com"
        />
      </div>
    </div>

    <div className="flex items-center justify-end gap-2 pt-2">
      <button
        onClick={onClose}
        className="h-10 px-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancelar
      </button>
      <button className="h-10 px-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
        Guardar cambios
      </button>
    </div>
  </div>
)

export default ProfileDrawerContent
