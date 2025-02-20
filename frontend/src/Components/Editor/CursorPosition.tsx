// src/Components/CursorPosition.tsx
import { useYjs } from '../../Contexts/YjsProvider';
import { useEffect, useState } from 'react';

export function CursorTracker() {
  const { awareness, user } = useYjs();
  const [others, setOthers] = useState<Map<number, any>>(new Map());

  useEffect(() => {
    const handleUpdate = () => {
      setOthers(new Map(awareness.getStates()));
    };
    
    awareness.on('change', handleUpdate);
    return () => awareness.off('change', handleUpdate);
  }, []);

  return (
    <div className="absolute bottom-4 right-4 bg-gray-800 p-2 rounded">
      <div className="text-sm text-gray-400">Online Users:</div>
      {Array.from(others.entries()).map(([clientId, state]) => (
        <div key={clientId} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: state.user.color }}
          />
          <span className="text-gray-300">{state.user.name}</span>
        </div>
      ))}
    </div>
  );
}