import { useState } from 'react';
import { X, FileText, Table, Mail } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'outlook'>('pdf');
  const [startDate, setStartDate] = useState('2023-11-15');
  const [endDate, setEndDate] = useState('2023-12-15');

  const handleExport = () => {
    console.log('Exporting:', { format: exportFormat, startDate, endDate });
    onClose();
  };

  if (!isOpen) return null;

  const formatOptions = [
    { value: 'pdf', label: 'Export as PDF', icon: FileText },
    { value: 'excel', label: 'Export as Excel', icon: Table },
    { value: 'outlook', label: 'Export to Outlook', icon: Mail },
  ] as const;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content w-full max-w-md mx-4 animate-slideIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Export Calendar</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-500 mb-6">Select options and date range for your export.</p>

          {/* Export Format */}
          <div className="mb-6">
            <label className="input-label">Export as:</label>
            <div className="space-y-2">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      exportFormat === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value={option.value}
                      checked={exportFormat === option.value}
                      onChange={(e) => setExportFormat(e.target.value as any)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <label className="input-label">Date Range:</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleExport} className="btn-primary">
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
