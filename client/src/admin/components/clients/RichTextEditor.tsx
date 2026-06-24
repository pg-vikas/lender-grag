import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Table2,
  Underline,
  Unlink,
  Video,
} from "lucide-react";

const allowedRichTextTags = new Set([
  "A",
  "B",
  "BLOCKQUOTE",
  "BR",
  "CODE",
  "DIV",
  "EM",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HR",
  "I",
  "IMG",
  "LI",
  "OL",
  "P",
  "PRE",
  "SPAN",
  "STRONG",
  "TABLE",
  "TBODY",
  "TD",
  "TH",
  "THEAD",
  "TR",
  "U",
  "UL",
]);

const allowedRichTextAttributes = new Set(["href", "src", "alt", "target", "rel", "style", "title"]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function hasRichTextHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value.trim());
}

export function getRichTextPlainText(value: string) {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const documentBody = new DOMParser().parseFromString(value || "", "text/html").body;
  return (documentBody.textContent || "").replace(/\s+/g, " ").trim();
}

function isSafeUrl(value: string) {
  return /^(https?:|mailto:|tel:|\/|#)/i.test(value.trim());
}

function cleanStyle(value: string) {
  const safeStyles = value
    .split(";")
    .map((style) => style.trim())
    .filter((style) => /^text-align\s*:\s*(left|center|right|justify)$/i.test(style));

  return safeStyles.join("; ");
}

export function sanitizeRichTextHtml(value: string) {
  if (!value.trim()) {
    return "";
  }

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return value;
  }

  const parsedDocument = new DOMParser().parseFromString(value, "text/html");

  parsedDocument.body.querySelectorAll("script, style, iframe, object, embed").forEach((element) => element.remove());

  const cleanNode = (node: Node) => {
    Array.from(node.childNodes).forEach((childNode) => {
      if (childNode.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const element = childNode as HTMLElement;

      if (!allowedRichTextTags.has(element.tagName)) {
        element.replaceWith(parsedDocument.createTextNode(element.textContent || ""));
        return;
      }

      Array.from(element.attributes).forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        const value = attribute.value;

        if (name.startsWith("on") || !allowedRichTextAttributes.has(name)) {
          element.removeAttribute(attribute.name);
          return;
        }

        if ((name === "href" || name === "src") && !isSafeUrl(value)) {
          element.removeAttribute(attribute.name);
          return;
        }

        if (name === "style") {
          const cleanedStyle = cleanStyle(value);
          if (cleanedStyle) {
            element.setAttribute("style", cleanedStyle);
          } else {
            element.removeAttribute(attribute.name);
          }
        }
      });

      if (element.tagName === "A") {
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noopener noreferrer");
      }

      cleanNode(element);
    });
  };

  cleanNode(parsedDocument.body);

  return parsedDocument.body.innerHTML.trim();
}

export function normalizeRichTextValue(value: string) {
  const sanitizedValue = sanitizeRichTextHtml(value || "");
  const plainText = getRichTextPlainText(sanitizedValue);
  const hasEmbeddedContent = /<(img|hr|table|a)\b/i.test(sanitizedValue);

  return plainText || hasEmbeddedContent ? sanitizedValue : "";
}

function prepareEditorHtml(value: string) {
  if (!value.trim()) {
    return "";
  }

  if (hasRichTextHtml(value)) {
    return sanitizeRichTextHtml(value);
  }

  return escapeHtml(value).replace(/\n/g, "<br>");
}

function normalizeUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  minHeightClassName?: string;
  footerText?: string;
  disabled?: boolean;
};

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = "Start typing...",
  minHeightClassName = "min-h-[220px]",
  footerText,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isHtmlView, setIsHtmlView] = useState(false);
  const [htmlDraft, setHtmlDraft] = useState("");

  useEffect(() => {
    const editor = editorRef.current;

    if (isHtmlView || !editor || document.activeElement === editor) {
      return;
    }

    const nextHtml = prepareEditorHtml(value || "");

    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }
  }, [isHtmlView, value]);

  useEffect(() => {
    if (!isHtmlView) {
      return;
    }

    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement?.dataset.richTextHtmlSource === "true") {
      return;
    }

    setHtmlDraft(prepareEditorHtml(value || ""));
  }, [isHtmlView, value]);

  const commitHtmlDraft = (draft = htmlDraft) => {
    const normalizedValue = normalizeRichTextValue(draft);
    setHtmlDraft(normalizedValue);
    onChange(normalizedValue);
    return normalizedValue;
  };

  const toggleHtmlView = () => {
    if (disabled) {
      return;
    }

    if (isHtmlView) {
      const normalizedValue = commitHtmlDraft();
      setIsHtmlView(false);

      window.requestAnimationFrame(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = prepareEditorHtml(normalizedValue);
          editorRef.current.focus();
        }
      });
      return;
    }

    setHtmlDraft(prepareEditorHtml(value || ""));
    setIsHtmlView(true);
  };

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    onChange(normalizeRichTextValue(editor.innerHTML));
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const runCommand = (command: string, commandValue?: string) => {
    if (disabled) {
      return;
    }

    focusEditor();
    document.execCommand(command, false, commandValue);
    emitChange();
  };

  const handleLink = () => {
    if (disabled) {
      return;
    }

    const url = normalizeUrl(window.prompt("Enter link URL") || "");
    if (!url) {
      return;
    }

    runCommand("createLink", url);
  };

  const handleImage = () => {
    if (disabled) {
      return;
    }

    const imageUrl = normalizeUrl(window.prompt("Enter image URL") || "");
    if (!imageUrl) {
      return;
    }

    runCommand("insertImage", imageUrl);
  };

  const handleVideo = () => {
    if (disabled) {
      return;
    }

    const videoUrl = normalizeUrl(window.prompt("Enter video URL") || "");
    if (!videoUrl) {
      return;
    }

    runCommand("insertHTML", `<p><a href=\"${escapeHtml(videoUrl)}\" target=\"_blank\" rel=\"noopener noreferrer\">Video: ${escapeHtml(videoUrl)}</a></p>`);
  };

  const toolbarButtonClass = "p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const activeToolbarButtonClass = "bg-violet-600/80 text-white hover:bg-violet-500";
  const dividerClass = "w-px h-5 bg-slate-700 mx-1";

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <div className="border border-slate-600 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
        <div className="bg-slate-950 border-b border-slate-600 p-2 flex items-center gap-1 flex-wrap text-slate-400">
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("bold")} className={toolbarButtonClass} aria-label="Bold"><Bold className="w-4 h-4" /></button>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("italic")} className={toolbarButtonClass} aria-label="Italic"><Italic className="w-4 h-4" /></button>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("underline")} className={toolbarButtonClass} aria-label="Underline"><Underline className="w-4 h-4" /></button>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={handleLink} className={toolbarButtonClass} aria-label="Add link"><LinkIcon className="w-4 h-4" /></button>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("unlink")} className={toolbarButtonClass} aria-label="Remove link"><Unlink className="w-4 h-4" /></button>
          <div className={dividerClass}></div>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("insertUnorderedList")} className={toolbarButtonClass} aria-label="Bullet list"><List className="w-4 h-4" /></button>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("insertOrderedList")} className={toolbarButtonClass} aria-label="Numbered list"><ListOrdered className="w-4 h-4" /></button>
          <div className={dividerClass}></div>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={handleImage} className={toolbarButtonClass} aria-label="Add image"><ImageIcon className="w-4 h-4" /></button>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={handleVideo} className={toolbarButtonClass} aria-label="Add video link"><Video className="w-4 h-4" /></button>
          <div className={dividerClass}></div>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("justifyLeft")} className={toolbarButtonClass} aria-label="Align left"><AlignLeft className="w-4 h-4" /></button>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("justifyCenter")} className={toolbarButtonClass} aria-label="Align center"><AlignCenter className="w-4 h-4" /></button>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("justifyRight")} className={toolbarButtonClass} aria-label="Align right"><AlignRight className="w-4 h-4" /></button>
          <div className={dividerClass}></div>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("insertHorizontalRule")} className={toolbarButtonClass} aria-label="Horizontal line"><Minus className="w-4 h-4" /></button>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("insertHTML", "<table><tbody><tr><td>Cell</td><td>Cell</td></tr></tbody></table>")} className={toolbarButtonClass} aria-label="Insert table"><Table2 className="w-4 h-4" /></button>
          <div className={dividerClass}></div>
          <button type="button" disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("formatBlock", "pre")} className={toolbarButtonClass} aria-label="Code block"><Code2 className="w-4 h-4" /></button>
          <div className={dividerClass}></div>
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={toggleHtmlView}
            className={`${toolbarButtonClass} ${isHtmlView ? activeToolbarButtonClass : ""}`}
            aria-label={isHtmlView ? "Show visual editor" : "Show HTML source"}
            aria-pressed={isHtmlView}
            title={isHtmlView ? "Show visual editor" : "Show HTML source"}
          >
            <span className="text-[10px] font-black tracking-wide leading-none">HTML</span>
          </button>
        </div>

        <div className="relative bg-slate-900/50">
          {isHtmlView ? (
            <textarea
              data-rich-text-html-source="true"
              value={htmlDraft}
              onChange={(event) => {
                setHtmlDraft(event.target.value);
                onChange(event.target.value);
              }}
              onBlur={() => commitHtmlDraft()}
              disabled={disabled}
              spellCheck={false}
              className={`w-full ${minHeightClassName} px-4 py-3 bg-slate-950/80 text-sm text-slate-200 font-mono focus:outline-none custom-scrollbar resize-none placeholder:text-slate-500`}
              placeholder="Edit HTML source..."
              aria-label="HTML source editor"
            />
          ) : (
            <>
              {!getRichTextPlainText(value) && (
                <div className="pointer-events-none absolute left-4 top-4 text-sm text-slate-500">
                  {placeholder}
                </div>
              )}
              <div
                ref={editorRef}
                contentEditable={!disabled}
                suppressContentEditableWarning
                onInput={emitChange}
                onBlur={emitChange}
                className={`rich-text-editor-content w-full ${minHeightClassName} px-4 py-3 text-sm text-slate-200 focus:outline-none custom-scrollbar overflow-y-auto [&_a]:text-violet-400 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_p]:my-2 [&_img]:max-w-full [&_img]:rounded-lg [&_blockquote]:border-l-4 [&_blockquote]:border-slate-600 [&_blockquote]:pl-4 [&_blockquote]:text-slate-300 [&_table]:border-collapse [&_table]:my-3 [&_td]:border [&_td]:border-slate-600 [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-slate-600 [&_th]:px-3 [&_th]:py-2 [&_pre]:bg-slate-950 [&_pre]:border [&_pre]:border-slate-700 [&_pre]:rounded-lg [&_pre]:p-3`}
                role="textbox"
                aria-multiline="true"
              />
            </>
          )}
        </div>

        {(footerText || isHtmlView) && (
          <div className="bg-slate-950 border-t border-slate-600 px-3 py-2 flex justify-between gap-3">
            <span className="text-xs text-violet-300">{isHtmlView ? "HTML source view is active." : ""}</span>
            {footerText && <span className="text-xs text-slate-400">{footerText}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
