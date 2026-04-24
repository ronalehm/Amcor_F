import { Clock } from "lucide-react";
import { type SlaStatus } from "../../data/slaStorage";

interface SlaTimerProps {
  elapsedHours: number;
  remainingHours: number;
  slaHours: number;
  status: SlaStatus;
}

export default function SlaTimer({ elapsedHours, remainingHours, slaHours, status }: SlaTimerProps) {
  const percentage = Math.min(100, Math.max(0, (elapsedHours / slaHours) * 100));
  
  let colorClass = "text-green-600 bg-green-500";
  if (status === "Vencido") colorClass = "text-red-600 bg-red-500";
  else if (status === "Por vencer") colorClass = "text-amber-600 bg-amber-500";
  else if (status === "Atendido") colorClass = "text-blue-600 bg-blue-500";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
          <span className="text-sm font-bold text-gray-700">Tiempo SLA</span>
        </div>
        <div className="text-right">
          <span className={`text-lg font-extrabold ${colorClass.split(' ')[0]}`}>
            {status === "Vencido" ? `-${Math.abs(remainingHours)}h` : `${remainingHours}h`}
          </span>
          <span className="text-xs text-gray-500 ml-1">restantes de {slaHours}h</span>
        </div>
      </div>
      
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${colorClass.split(' ')[1]}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 text-right">
        Consumido: {elapsedHours}h
      </div>
    </div>
  );
}
