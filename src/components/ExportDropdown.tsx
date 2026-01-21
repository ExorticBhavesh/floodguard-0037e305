import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ExportDropdownProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  disabled?: boolean;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportDropdown({ 
  onExportCSV, 
  onExportPDF, 
  disabled = false,
  label = 'Export',
  variant = 'outline',
  size = 'default'
}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (exportFn: () => void, format: string) => {
    setIsExporting(true);
    try {
      exportFn();
      toast.success(`Exported as ${format}`, {
        description: 'Your download should start automatically'
      });
    } catch (error) {
      toast.error('Export failed', {
        description: 'Please try again'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          disabled={disabled || isExporting}
          className="gap-2"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {size !== 'icon' && label}
          {size !== 'icon' && <ChevronDown className="h-3 w-3 opacity-60" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Export Format
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleExport(onExportCSV, 'CSV')}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-risk-low" />
          <div className="flex flex-col">
            <span>CSV Spreadsheet</span>
            <span className="text-xs text-muted-foreground">Excel compatible</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport(onExportPDF, 'PDF')}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2 text-risk-high" />
          <div className="flex flex-col">
            <span>PDF Report</span>
            <span className="text-xs text-muted-foreground">Formatted document</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
