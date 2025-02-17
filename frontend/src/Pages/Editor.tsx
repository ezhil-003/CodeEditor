import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Tree } from 'react-arborist';
import MonacoEditor from '../Components/Editor/MonacoEditor';
import { YjsProvider } from '../Contexts/YjsProvider';
import XTerminal from '../Components/Editor/Xterminal';

type Props = {}

export default function Editor({ }: Props) {
    const [selectedFileId, setselectedFileId] = useState('')
    return (
        <YjsProvider roomId="project-123">
        <div className="h-screen flex flex-col bg-gray-900 text-gray-300">
            {/* Top Bar */}
            <div className="h-12 border-b border-gray-700 flex items-center px-4">
                <span className="text-sm font-mono">~/projects/current</span>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar (Fixed 40px + Resizable 200-280px) */}
                <PanelGroup direction="horizontal" className="flex">
                    {/* Icon Rail */}
                    <Panel defaultSize={40} minSize={40} maxSize={40}>
                        <div className="h-full w-[40px] border-r border-gray-700 flex flex-col gap-2 p-2">
                            {/* <FileTreeIcon />
                            <SettingsIcon /> */}
                        </div>
                    </Panel>

                    {/* Resizable File Tree */}
                    <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize" />

                    <Panel defaultSize={220} minSize={180} maxSize={280}>
                        <Tree
                            className="h-full overflow-auto bg-gray-900 text-sm"
                            width={180} // Auto-width to panel
                            rowHeight={24}
                            data={items}
                            />
                    </Panel>
                </PanelGroup>

                {/* Main Editor Area */}
                <PanelGroup direction="vertical" className="flex-1 border-l border-gray-700">
                    <Panel defaultSize={70}>
                        
                        {selectedFileId ? (
                            <MonacoEditor selectedFileId={selectedFileId} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500">
                                Select a file to start editing
                            </div>
                        )}
                    </Panel>

                    <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-blue-500 cursor-row-resize" />

                    <Panel defaultSize={30} minSize={20}>
                        <XTerminal />
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    </YjsProvider>
    );
}
