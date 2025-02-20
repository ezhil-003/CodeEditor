// src/Components/MonacoEditor.tsx
import { useRef, useEffect } from 'react';
import Editor, { Monaco, useMonaco } from '@monaco-editor/react';
import { useYjs } from '../../Contexts/YjsProvider';
import * as Y from 'yjs';

interface MonacoEditorProps {
  selectedFileId: string | null;
}

export default function MonacoEditor({ selectedFileId }: MonacoEditorProps) {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const { ydoc, provider } = useYjs();
  const yTextMap = useRef<Map<string, Y.Text>>(new Map());

  // Get or create Y.Text for the current file
  const getYText = (fileId: string): Y.Text => {
    if (!yTextMap.current.has(fileId)) {
      yTextMap.current.set(fileId, ydoc.getText(fileId));
    }
    return yTextMap.current.get(fileId)!;
  };

  useEffect(() => {
    if (!editorRef.current || !selectedFileId) return;

    const ytext = getYText(selectedFileId);
    const model = editorRef.current.getModel();

    // Update editor content when Yjs changes
    const observer = () => {
      model.setValue(ytext.toString());
    };
    ytext.observe(observer);
    
    // Cleanup
    return () => {
      ytext.unobserve(observer);
    };
  }, [selectedFileId]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Initialize with current file content
    if (selectedFileId) {
      const ytext = getYText(selectedFileId);
      editor.setValue(ytext.toString());
    }

    // Set up Yjs awareness
    if (provider) {
      const awareness = provider.awareness;
      editor.onDidChangeCursorPosition((e: any) => {
        awareness.setLocalStateField('cursor', {
          position: e.position,
          fileId: selectedFileId,
        });
      });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!selectedFileId) return;
    
    Y.transact(ydoc, () => {
      const ytext = getYText(selectedFileId);
      ytext.delete(0, ytext.length);
      ytext.insert(0, value || '');
    });
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          roundedSelection: false,
          padding: { top: 10 },
          cursorStyle: 'line-thin',
          renderLineHighlight: 'all',
          overviewRulerBorder: false,
          automaticLayout: true,
        }}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </div>
  );
}