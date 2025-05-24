'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { QrCode, Copy, Share, Download, RefreshCw } from 'lucide-react';
import { notification } from 'antd';

interface QRCodeDisplayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  onGenerateQRCode: (groupId: string) => Promise<any>;
}

export function QRCodeDisplayDialog({ 
  open, 
  onOpenChange, 
  groupId, 
  groupName,
  onGenerateQRCode 
}: QRCodeDisplayDialogProps) {
  const [qrData, setQrData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Generate QR code when dialog opens
  useEffect(() => {
    if (open && groupId) {
      generateQRCode();
    }
  }, [open, groupId]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const result = await onGenerateQRCode(groupId);
      setQrData(result);
      
      // Generate QR code URL using a simple QR code service
      const qrText = result.join_code;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
      setQrCodeUrl(qrUrl);
      
      notification.success({
        message: 'Tạo mã QR thành công',
        description: 'Mã QR đã được tạo và sẵn sàng để chia sẻ',
        placement: 'topRight',
        duration: 3,
      });
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      notification.error({
        message: 'Lỗi tạo mã QR',
        description: error?.response?.data?.reasons?.message || error.message || 'Có lỗi xảy ra khi tạo mã QR',
        placement: 'topRight',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyJoinCode = () => {
    if (qrData?.join_code) {
      navigator.clipboard.writeText(qrData.join_code);
      notification.success({
        message: 'Đã sao chép',
        description: 'Mã tham gia đã được sao chép vào clipboard',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  const copyShareableUrl = () => {
    if (qrData?.shareable_url) {
      navigator.clipboard.writeText(qrData.shareable_url);
      notification.success({
        message: 'Đã sao chép',
        description: 'Link tham gia đã được sao chép vào clipboard',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && qrData?.shareable_url) {
      try {
        await navigator.share({
          title: `Tham gia nhóm: ${groupName}`,
          text: `Bạn được mời tham gia nhóm chuyến đi "${groupName}"`,
          url: qrData.shareable_url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyShareableUrl(); // Fallback to copy
      }
    } else {
      copyShareableUrl(); // Fallback to copy
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-${groupName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatExpiryTime = (expiresAt: string) => {
    const date = new Date(expiresAt);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            Mã QR tham gia nhóm
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chia sẻ mã QR này để mời người khác tham gia nhóm "{groupName}"
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-500">Đang tạo mã QR...</p>
            </div>
          ) : qrData ? (
            <>
              {/* QR Code Display */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-48 h-48"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={shareQRCode}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                  <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </Button>
                  <Button
                    onClick={generateQRCode}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tạo lại
                  </Button>
                </div>
              </div>

              {/* Join Code */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mã tham gia
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={qrData.join_code}
                    readOnly
                    className="font-mono bg-gray-50 dark:bg-gray-800"
                  />
                  <Button
                    onClick={copyJoinCode}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Shareable URL */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Link tham gia
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={qrData.shareable_url}
                    readOnly
                    className="text-sm bg-gray-50 dark:bg-gray-800"
                  />
                  <Button
                    onClick={copyShareableUrl}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expiry Info */}
              {qrData.expires_at && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Lưu ý:</strong> Mã này sẽ hết hạn vào {formatExpiryTime(qrData.expires_at)}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <QrCode className="h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500">Nhấn "Tạo mã QR" để bắt đầu</p>
              <Button onClick={generateQRCode} className="bg-blue-600 hover:bg-blue-700 text-white">
                Tạo mã QR
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
