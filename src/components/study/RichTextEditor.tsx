import { useEffect, useRef, memo, useCallback } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";

interface RichTextEditorProps {
    data?: OutputData;
    onChange?: (data: OutputData) => void;
    placeholder?: string;
    readOnly?: boolean;
}

export const RichTextEditor = memo(({ data, onChange, placeholder, readOnly = false }: RichTextEditorProps) => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);
    const onChangeRef = useRef(onChange);
    const readOnlyRef = useRef(readOnly);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Keep onChange ref up to date
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Keep readOnly ref up to date
    useEffect(() => {
        readOnlyRef.current = readOnly;
    }, [readOnly]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Initialize editor once on mount with initial data
    useEffect(() => {
        if (!holderRef.current || isInitialized.current) return;

        // Initialize Editor.js with current data
        const editor = new EditorJS({
            holder: holderRef.current,
            placeholder: placeholder || "Start writing your notes...",
            data: data,
            readOnly: readOnly,
            onChange: async () => {
                if (onChangeRef.current && editorRef.current && !readOnlyRef.current) {
                    // Clear existing timer
                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                    }

                    // Set new timer to debounce the onChange callback
                    debounceTimerRef.current = setTimeout(async () => {
                        if (editorRef.current) {
                            const outputData = await editorRef.current.save();
                            onChangeRef.current?.(outputData);
                        }
                    }, 500); // Wait 500ms after last change
                }
            },
            tools: {
                header: {
                    class: Header as any,
                    config: {
                        placeholder: "Enter a header",
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 2,
                    },
                    inlineToolbar: true,
                },
                list: {
                    class: List as any,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: "unordered",
                    },
                },
                checklist: {
                    class: Checklist as any,
                    inlineToolbar: true,
                },
                quote: {
                    class: Quote as any,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: "Enter a quote",
                        captionPlaceholder: "Quote's author",
                    },
                },
                code: {
                    class: Code as any,
                    config: {
                        placeholder: "Enter code snippet",
                    },
                },
                inlineCode: {
                    class: InlineCode as any,
                },
                marker: {
                    class: Marker as any,
                },
                delimiter: Delimiter as any,
                table: {
                    class: Table as any,
                    inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                    },
                },
                warning: {
                    class: Warning as any,
                    inlineToolbar: true,
                    config: {
                        titlePlaceholder: "Title",
                        messagePlaceholder: "Message",
                    },
                },
            },

            minHeight: 400,
        });

        editorRef.current = editor;
        isInitialized.current = true;

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
                isInitialized.current = false;
            }
        };
    }, []); // Only run once on mount - key prop handles topic switching

    // Handle readOnly changes separately using Editor.js API
    useEffect(() => {
        if (editorRef.current && editorRef.current.readOnly && isInitialized.current) {
            editorRef.current.readOnly.toggle(readOnly);
        }
    }, [readOnly]);

    return (
        <div className="rich-text-editor">
            <div ref={holderRef} className="prose prose-sm max-w-none dark:prose-invert" />
        </div>
    );
});


RichTextEditor.displayName = "RichTextEditor";
