interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationDetailContentProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onClose: () => void
}

const NotificationDetailContent = ({
  notification: n,
  onMarkAsRead,
  onClose,
}: NotificationDetailContentProps) => (
  <div className="space-y-4">
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
      <p className="text-xs text-gray-400 mt-2">{n.time}</p>
    </div>

    <div className="flex items-center justify-end gap-2">
      {!n.read && (
        <button
          onClick={() => onMarkAsRead(n.id)}
          className="h-10 px-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Marcar como leída
        </button>
      )}
      <button
        onClick={onClose}
        className="h-10 px-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
      >
        Cerrar
      </button>
    </div>
  </div>
)

export default NotificationDetailContent
