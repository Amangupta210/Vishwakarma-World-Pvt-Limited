import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/types/employee';
import { Download, Printer, FileImage, FileText } from 'lucide-react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import companyLogo from '@/assets/company-logo.jpg';
import { toast } from 'sonner';

interface EmployeeQRCardProps {
  employee: Employee;
  shiftName?: string;
}

type DownloadFormat = 'pdf' | 'png' | 'jpg';

export function EmployeeQRCard({ employee, shiftName }: EmployeeQRCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>('pdf');
  const [isDownloading, setIsDownloading] = useState(false);

  const qrData = JSON.stringify({
    employeeId: employee.employeeId,
    id: employee.id,
    name: employee.name,
    department: employee.department,
    designation: employee.designation
  });

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });

      const fileName = `${employee.employeeId}-${employee.name.replace(/\s+/g, '-')}-id-card`;

      if (downloadFormat === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [85.6, 120]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 120);
        pdf.save(`${fileName}.pdf`);
        toast.success('PDF downloaded successfully!');
      } else if (downloadFormat === 'png') {
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('PNG downloaded successfully!');
      } else if (downloadFormat === 'jpg') {
        const link = document.createElement('a');
        link.download = `${fileName}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
        toast.success('JPG downloaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const printCard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !cardRef.current) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${employee.name} - ID Card</title>
          <style>
            @page { size: 85.6mm 120mm; margin: 0; }
            body { 
              margin: 0; 
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: white;
            }
            .card-container {
              width: 85.6mm;
              height: 120mm;
              padding: 10px;
              box-sizing: border-box;
              font-family: 'Segoe UI', Arial, sans-serif;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border-radius: 10px;
              border: 2px solid #1e40af33;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              border-bottom: 2px solid #1e40af; 
              padding-bottom: 8px; 
              margin-bottom: 8px;
              background: #1e40af;
              margin: -10px -10px 8px -10px;
              padding: 8px 10px;
              border-radius: 8px 8px 0 0;
            }
            .logo { width: 36px; height: 36px; object-fit: contain; border-radius: 4px; }
            .company-name { font-size: 11px; font-weight: bold; color: #ffffff; }
            .company-sub { font-size: 8px; color: #e0e7ff; }
            .id-badge { background: #ffffff; color: #1e40af; padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: bold; }
            .content { text-align: center; }
            .photo-section { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-bottom: 10px; }
            .photo { width: 60px; height: 60px; border-radius: 50%; border: 3px solid #1e40af; object-fit: cover; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #1e40af; font-size: 24px; }
            .name { font-size: 14px; font-weight: bold; color: #1a1a1a; margin-bottom: 2px; }
            .designation { font-size: 10px; color: #1e40af; font-weight: 600; margin-bottom: 8px; }
            .qr-section { display: flex; justify-content: center; margin: 8px 0; }
            .qr-code { padding: 6px; background: white; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .details { background: #f1f5f9; border-radius: 6px; padding: 8px; margin: 8px 0; }
            .info-row { display: flex; justify-content: space-between; font-size: 8px; margin-bottom: 3px; padding: 2px 0; border-bottom: 1px solid #e2e8f0; }
            .info-row:last-child { border-bottom: none; }
            .label { color: #666; }
            .value { font-weight: 600; color: #1a1a1a; text-align: right; }
            .emp-id { color: #1e40af; font-weight: 700; }
            .footer { text-align: center; border-top: 1px solid #1e40af33; padding-top: 6px; margin-top: 6px; }
            .footer-text { font-size: 7px; color: #666; }
            .validity { font-size: 8px; color: #1e40af; font-weight: 600; margin-top: 4px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="card-container">
            <div class="header">
              <div style="display: flex; align-items: center; gap: 8px;">
                <img src="${companyLogo}" class="logo" alt="Logo" />
                <div>
                  <div class="company-name">VISHWAKARMA WORLD</div>
                  <div class="company-sub">Private Limited</div>
                </div>
              </div>
              <div class="id-badge">EMPLOYEE ID</div>
            </div>
            <div class="content">
              <div class="photo-section">
                ${employee.photo 
                  ? `<img src="${employee.photo}" class="photo" alt="${employee.name}" />`
                  : `<div class="photo">${employee.name.charAt(0)}</div>`
                }
                <div class="name">${employee.name}</div>
                <div class="designation">${employee.designation}</div>
              </div>
              <div class="qr-section">
                <div class="qr-code">
                  ${cardRef.current.querySelector('svg')?.outerHTML || ''}
                </div>
              </div>
              <div class="details">
                <div class="info-row"><span class="label">Employee ID</span><span class="value emp-id">${employee.employeeId}</span></div>
                <div class="info-row"><span class="label">Department</span><span class="value">${employee.department}</span></div>
                ${employee.fatherName ? `<div class="info-row"><span class="label">Father's Name</span><span class="value">${employee.fatherName}</span></div>` : ''}
                ${employee.workLocation ? `<div class="info-row"><span class="label">Work Location</span><span class="value">${employee.workLocation}</span></div>` : ''}
                ${employee.state ? `<div class="info-row"><span class="label">State</span><span class="value">${employee.state}</span></div>` : ''}
                ${shiftName ? `<div class="info-row"><span class="label">Shift</span><span class="value">${shiftName}</span></div>` : ''}
                <div class="info-row"><span class="label">Date of Joining</span><span class="value">${format(new Date(employee.joiningDate), 'dd MMM yyyy')}</span></div>
              </div>
            </div>
            <div class="footer">
              <p class="footer-text">Scan QR code for attendance verification</p>
              <p class="validity">Valid until: ${format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'dd MMM yyyy')}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      {/* ID Card */}
      <div 
        ref={cardRef}
        className="mx-auto w-full max-w-xs overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card to-muted shadow-xl"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3" style={{ backgroundColor: '#1e40af' }}>
          <div className="flex items-center gap-2">
            <img 
              src={companyLogo} 
              alt="VWPL"
              className="h-10 w-10 rounded object-contain bg-white p-0.5"
              crossOrigin="anonymous"
            />
            <div>
              <h3 className="text-sm font-bold text-white">VISHWAKARMA WORLD</h3>
              <p className="text-xs text-blue-200">Private Limited</p>
            </div>
          </div>
          <div className="rounded px-2 py-1 text-xs font-bold bg-white" style={{ color: '#1e40af' }}>
            EMPLOYEE ID
          </div>
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          {/* Photo & Name */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4" style={{ borderColor: '#1e40af', backgroundColor: '#f1f5f9' }}>
              {employee.photo ? (
                <img 
                  src={employee.photo} 
                  alt={employee.name}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold" style={{ color: '#1e40af' }}>
                  {employee.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>{employee.name}</h4>
              <p className="text-sm font-semibold" style={{ color: '#1e40af' }}>{employee.designation}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="rounded-lg p-2 shadow-md" style={{ backgroundColor: '#ffffff' }}>
              <QRCodeSVG 
                value={qrData}
                size={80}
                level="H"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
          </div>

          {/* Details */}
          <div className="rounded-lg p-3 space-y-1.5 text-xs" style={{ backgroundColor: '#f1f5f9' }}>
            <div className="flex justify-between py-1 border-b" style={{ borderColor: '#e2e8f0' }}>
              <span style={{ color: '#666666' }}>Employee ID</span>
              <span className="font-bold" style={{ color: '#1e40af' }}>{employee.employeeId}</span>
            </div>
            <div className="flex justify-between py-1 border-b" style={{ borderColor: '#e2e8f0' }}>
              <span style={{ color: '#666666' }}>Department</span>
              <span className="font-semibold" style={{ color: '#1a1a1a' }}>{employee.department}</span>
            </div>
            {employee.fatherName && (
              <div className="flex justify-between py-1 border-b" style={{ borderColor: '#e2e8f0' }}>
                <span style={{ color: '#666666' }}>Father's Name</span>
                <span className="font-medium" style={{ color: '#1a1a1a' }}>{employee.fatherName}</span>
              </div>
            )}
            {employee.workLocation && (
              <div className="flex justify-between py-1 border-b" style={{ borderColor: '#e2e8f0' }}>
                <span style={{ color: '#666666' }}>Work Location</span>
                <span className="font-medium" style={{ color: '#1a1a1a' }}>{employee.workLocation}</span>
              </div>
            )}
            {employee.state && (
              <div className="flex justify-between py-1 border-b" style={{ borderColor: '#e2e8f0' }}>
                <span style={{ color: '#666666' }}>State</span>
                <span className="font-medium" style={{ color: '#1a1a1a' }}>{employee.state}</span>
              </div>
            )}
            {shiftName && (
              <div className="flex justify-between py-1 border-b" style={{ borderColor: '#e2e8f0' }}>
                <span style={{ color: '#666666' }}>Shift</span>
                <span className="font-medium" style={{ color: '#1a1a1a' }}>{shiftName}</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span style={{ color: '#666666' }}>Date of Joining</span>
              <span className="font-medium" style={{ color: '#1a1a1a' }}>{format(new Date(employee.joiningDate), 'dd MMM yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-2 text-center" style={{ borderColor: '#1e40af33' }}>
          <p className="text-xs" style={{ color: '#666666' }}>
            Scan QR code for attendance verification
          </p>
          <p className="text-xs font-semibold mt-1" style={{ color: '#1e40af' }}>
            Valid until: {format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'dd MMM yyyy')}
          </p>
        </div>
      </div>

      {/* Download Options */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <div className="flex items-center gap-2">
          <Select value={downloadFormat} onValueChange={(v: DownloadFormat) => setDownloadFormat(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </div>
              </SelectItem>
              <SelectItem value="png">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  PNG
                </div>
              </SelectItem>
              <SelectItem value="jpg">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  JPG
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={downloadCard} disabled={isDownloading} className="gap-2">
            <Download className="h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>
        <Button variant="outline" onClick={printCard} className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>
    </div>
  );
}
