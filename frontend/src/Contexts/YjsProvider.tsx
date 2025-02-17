// src/providers/YjsProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface YjsContextType {
  ydoc: Y.Doc;
  provider: WebsocketProvider | null;
  awareness: any;
  user: UserState;
  setUser: (state: Partial<UserState>) => void;
}

interface UserState {
  name: string;
  color: string;
  cursor?: { x: number; y: number };
  currentFile?: string;
}

const YjsContext = createContext<YjsContextType | null>(null);

export function YjsProvider({ 
  children,
  roomId
}: { 
  children: React.ReactNode;
  roomId: string;
}) {
  const [user, setUserState] = useState<UserState>({
    name: 'Anonymous',
    color: '#ff0000',
  });
  
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const wsProvider = new WebsocketProvider(
      'ws://localhost:3000/yjs', // Your backend WS endpoint
      roomId,
      ydoc,
      { connect: true }
    );

    // Set up awareness
    wsProvider.awareness.setLocalStateField('user', user);
    
    // Cleanup
    return () => {
      wsProvider.disconnect();
      ydoc.destroy();
    };
  }, [roomId]);

  const setUser = (state: Partial<UserState>) => {
    setUserState(prev => {
      const newState = { ...prev, ...state };
      provider?.awareness.setLocalStateField('user', newState);
      return newState;
    });
  };

  return (
    <YjsContext.Provider
      value={{
        ydoc,
        provider,
        awareness: provider?.awareness,
        user,
        setUser
      }}
    >
      {children}
    </YjsContext.Provider>
  );
}

export function useYjs() {
  const context = useContext(YjsContext);
  if (!context) {
    throw new Error('useYjs must be used within a YjsProvider');
  }
  return context;
}