import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, FileText, User, Mail, Plus, X, ArrowRight, CheckCircle2, 
  Link as LinkIcon, Settings, Calendar, MapPin, Eye, Building2, Copy, 
  Play, Trash2, Edit2, Users, Type, Square, ArrowUpRight, Search, ZoomIn, ZoomOut, Save, Undo, Redo, Layout
} from "lucide-react";
import { Recipient, DocumentFile, PlacedField, FieldType } from '../../types/signing';

export const RECIPIENT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
];

const getDefaultFieldDimensions = (type: FieldType) => {
  switch(type) {
    case 'signature': return { w: 180, h: 48 };
    case 'initials': return { w: 90, h: 40 };
    case 'checkbox': return { w: 28, h: 28 };
    case 'arrow': return { w: 80, h: 28 };
    default: return { w: 160, h: 40 };
  }
};

export default function PrepareStep({ 
  recipients, 
  documents, 
  placedFields, 
  setPlacedFields 
}: { 
  recipients: Recipient[], 
  documents: DocumentFile[], 
  placedFields: PlacedField[], 
  setPlacedFields: any 
}) {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [draggedFieldType, setDraggedFieldType] = useState<{type: FieldType, recipientId?: string} | null>(null);
  
  const docRef = useRef<HTMLDivElement>(null);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedFieldType || !docRef.current) return;
    
    const rect = docRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const dims = getDefaultFieldDimensions(draggedFieldType.type);
    
    const newField: PlacedField = {
      id: Date.now().toString(),
      type: draggedFieldType.type,
      page: 1,
      x,
      y,
      width: dims.w,
      height: dims.h,
      recipientId: draggedFieldType.recipientId,
      required: true,
      label: draggedFieldType.type
    };
    
    setPlacedFields([...placedFields, newField]);
    setSelectedFieldId(newField.id);
    setDraggedFieldType(null);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const selectedField = placedFields.find(f => f.id === selectedFieldId);
  
  const standardFields = [
    { type: 'signature', icon: Edit2, label: 'Signature' },
    { type: 'initials', icon: Edit2, label: 'Initials' },
    { type: 'dateSigned', icon: Calendar, label: 'Date Signed' },
    { type: 'fullName', icon: User, label: 'Name' },
    { type: 'checkbox', icon: Square, label: 'Checkbox' },
    { type: 'text', icon: Type, label: 'Text Box' }
  ];

  return (
    <div className="flex flex-col h-[700px] bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
      {/* Topbar */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0 z-20 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-white flex items-center gap-2"><Layout className="w-4 h-4 text-indigo-400"/> Prepare Document</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 p-1">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[12px] font-bold text-white px-3 min-w-[50px] text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Field Palette with Signers */}
        <div className="w-72 bg-slate-800/80 border-r border-slate-700 flex flex-col shrink-0 z-10 overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex justify-between items-center shrink-0">
            <h3 className="text-[13px] font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400"/> Signers</h3>
            <button className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors" title="Add Signer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
            {recipients.filter(r => r.role === 'Signer').map(recipient => (
              <div key={recipient.id} className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-700/50 flex items-center gap-3 bg-slate-800/30">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: recipient.color }}></div>
                  <div className="flex-1 truncate">
                    <div className="text-[13px] font-bold text-white truncate">{recipient.name || recipient.email || 'Unnamed Signer'}</div>
                  </div>
                </div>
                <div className="p-2 grid grid-cols-2 gap-1.5">
                  {standardFields.map(field => (
                    <div 
                      key={field.type}
                      draggable
                      onDragStart={(e) => setDraggedFieldType({type: field.type as FieldType, recipientId: recipient.id})}
                      onDragEnd={() => setDraggedFieldType(null)}
                      className="flex flex-col items-center justify-center gap-1.5 p-2 bg-slate-800 border border-slate-700 rounded-lg cursor-grab active:cursor-grabbing hover:border-indigo-500 hover:bg-indigo-500/10 transition-colors group"
                    >
                      <field.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" style={{ color: recipient.color }} />
                      <span className="text-[10px] font-medium text-slate-300 text-center leading-tight">{field.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {recipients.filter(r => r.role === 'Signer').length === 0 && (
              <div className="p-4 text-center border border-dashed border-slate-700 rounded-xl">
                <p className="text-[13px] text-slate-400 mb-3">No signers added yet.</p>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[12px] font-bold transition-colors">
                  Add Signer
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Center: Document Canvas */}
        <div className="flex-1 bg-slate-950 overflow-auto relative custom-scrollbar flex justify-center p-8" onClick={() => setSelectedFieldId(null)}>
          {documents && documents.length > 0 ? (
            <div 
              ref={docRef}
              className="bg-white rounded shadow-2xl relative transition-transform origin-top"
              style={{ 
                width: `${800 * (zoom/100)}px`, 
                height: `${1035 * (zoom/100)}px`,
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Mock PDF Content */}
              <div className="absolute inset-8 pointer-events-none opacity-50">
                <div className="h-12 bg-slate-200 rounded mb-8 w-3/4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-11/12"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-4/5"></div>
                </div>
                <div className="mt-12 space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                </div>
                
                <div className="absolute bottom-16 left-0 right-0 flex justify-between">
                  <div className="w-1/3">
                    <div className="h-px bg-slate-400 mb-2 w-full"></div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Sign Here</div>
                  </div>
                  <div className="w-1/4">
                    <div className="h-px bg-slate-400 mb-2 w-full"></div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Date</div>
                  </div>
                </div>
              </div>
              
              {/* Placed Fields */}
              {placedFields.map(field => {
                const isSelected = field.id === selectedFieldId;
                const fieldRecipient = recipients.find(r => r.id === field.recipientId);
                const color = fieldRecipient ? fieldRecipient.color : '#cbd5e1';
                
                return (
                  <div 
                    key={field.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); }}
                    className={`absolute border-2 rounded shadow-sm flex flex-col items-center justify-center cursor-move select-none transition-shadow
                      ${isSelected ? 'ring-2 ring-offset-2 ring-offset-white ring-blue-500 z-50' : 'z-10 hover:shadow-md'}`}
                    style={{ 
                      left: `${field.x}%`, 
                      top: `${field.y}%`, 
                      width: `${field.width * (zoom/100)}px`, 
                      height: `${field.height * (zoom/100)}px`,
                      backgroundColor: `${color}20`,
                      borderColor: color
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap opacity-90 font-medium" style={{ backgroundColor: color }}>
                      {field.label} {fieldRecipient ? `• ${fieldRecipient.name || 'Signer'}` : ''} {field.required && '*'}
                    </div>
                    
                    {field.type === 'signature' && <Edit2 className="w-5 h-5 opacity-70" style={{ color }} />}
                    {field.type === 'dateSigned' && <Calendar className="w-5 h-5 opacity-70" style={{ color }} />}
                    {field.type === 'text' && <Type className="w-5 h-5 opacity-70" style={{ color }} />}
                    {field.type === 'checkbox' && <CheckCircle2 className="w-5 h-5 opacity-70" style={{ color }} />}
                    
                    {/* Resize Handle for selected fields */}
                    {isSelected && (
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-se-resize"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6 border-2 border-dashed border-slate-600 text-slate-500">
                <UploadCloud className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Upload your document</h2>
              <p className="text-slate-400 mb-8 max-w-md">
                Drag and drop your file here to start preparing it for signature, or browse from your computer.
              </p>
              <div className="flex gap-4">
                <button onClick={() => alert('Demo: File browser would open here')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[14px] font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5" /> Browse Files
                </button>
                <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-xl text-[14px] font-bold transition-colors flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Use a Template
                </button>
              </div>
              <p className="text-[12px] text-slate-500 mt-6 uppercase tracking-wider font-medium">
                Supported formats: PDF, DOCX, DOC, PNG, JPG
              </p>
            </div>
          )}
        </div>
        
        {/* Right Sidebar: Field Inspector */}
        <div className="w-72 bg-slate-800/80 border-l border-slate-700 flex flex-col shrink-0 z-10 overflow-y-auto custom-scrollbar">
          {!selectedField ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <Layout className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-[13px]">Select a field on the document to edit its properties.</p>
            </div>
          ) : (
            <div className="p-5 animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white capitalize">{selectedField.type}</h3>
                  <p className="text-[11px] text-slate-400">Field Settings</p>
                </div>
              </div>
              
              <div className="space-y-5">
                {selectedField.type !== 'arrow' && (
                  <div>
                    <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned To</label>
                    <select 
                      value={selectedField.recipientId || ''}
                      onChange={(e) => {
                        setPlacedFields(placedFields.map(f => f.id === selectedField.id ? {...f, recipientId: e.target.value} : f));
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-indigo-500"
                    >
                      {recipients.map(r => (
                        <option key={r.id} value={r.id}>{r.name || r.email} ({r.role})</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="flex items-center justify-between cursor-pointer p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-indigo-500 transition-colors">
                    <span className="text-[13px] font-bold text-white">Required Field</span>
                    <input 
                      type="checkbox" 
                      checked={selectedField.required}
                      onChange={(e) => {
                        setPlacedFields(placedFields.map(f => f.id === selectedField.id ? {...f, required: e.target.checked} : f));
                      }}
                      className="w-4 h-4 text-indigo-500 rounded focus:ring-indigo-500 bg-slate-800 border-slate-600"
                    />
                  </label>
                </div>
                
                <div className="pt-4 border-t border-slate-700/50">
                  <button 
                    onClick={() => {
                      setPlacedFields(placedFields.filter(f => f.id !== selectedField.id));
                      setSelectedFieldId(null);
                    }}
                    className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-[13px] font-bold transition-colors flex items-center justify-center gap-2 border border-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Field
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
