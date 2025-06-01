'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { QrCode, Camera, Type } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { notification } from 'antd';

type JoinGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinGroup: (qrCode: string) => void;
};

export function JoinGroupDialog({ open, onOpenChange, onJoinGroup }: JoinGroupDialogProps) {
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isValidCode, setIsValidCode] = useState(true);

  // Validate join code format
  const validateJoinCode = (code: string): boolean => {
    // Join code should be 8-16 characters, alphanumeric
    const codeRegex = /^[A-Z0-9]{8,16}$/;
    return codeRegex.test(code);
  };

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setQrCode(upperValue);

    if (upperValue.length > 0) {
      setIsValidCode(validateJoinCode(upperValue));
    } else {
      setIsValidCode(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCode = qrCode.trim();
    if (!trimmedCode) {
      return;
    }

    if (!validateJoinCode(trimmedCode)) {
      notification.error({
        message: 'Mã mời không hợp lệ',
        description: 'Mã mời phải có 8-16 ký tự và chỉ chứa chữ cái và số',
        placement: 'topRight',
        duration: 3,
      });
      return;
    }

    onJoinGroup(trimmedCode);
    resetForm();
  };

  const resetForm = () => {
    setQrCode('');
    setIsValidCode(true);
    setIsScanning(false);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleScanQR = () => {
    setIsScanning(true);

    // Check if browser supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      notification.error({
        message: 'Không hỗ trợ camera',
        description: 'Trình duyệt của bạn không hỗ trợ truy cập camera. Vui lòng nhập mã thủ công.',
        placement: 'topRight',
        duration: 5,
      });
      setIsScanning(false);
      return;
    }

    // Request camera permission and start scanning
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        // In a real implementation, you would use a QR scanner library here
        // For now, we'll simulate the scanning process
        setTimeout(() => {
          setIsScanning(false);
          stream.getTracks().forEach(track => track.stop()); // Stop camera

          // Mock QR code result - in real implementation, this would come from QR scanner
          const mockQrCode = 'ABC123DEF456';
          handleCodeChange(mockQrCode);

          notification.success({
            message: 'Quét thành công',
            description: 'Đã phát hiện mã QR. Vui lòng kiểm tra và nhấn "Tham gia nhóm".',
            placement: 'topRight',
            duration: 3,
          });
        }, 3000);
      })
      .catch(error => {
        console.error('Camera access error:', error);
        setIsScanning(false);
        notification.error({
          message: 'Lỗi truy cập camera',
          description: 'Không thể truy cập camera. Vui lòng cấp quyền camera hoặc nhập mã thủ công.',
          placement: 'topRight',
          duration: 5,
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            Tham gia nhóm
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sử dụng mã mời từ người tạo nhóm hoặc quét mã QR để tham gia nhóm chuyến đi
          </p>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Mã mời
            </TabsTrigger>
            {/* <TabsTrigger value="scan" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Quét QR
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qrCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mã mời nhóm
                </Label>
                <Input
                  id="qrCode"
                  placeholder="Ví dụ: ABC123DEF456"
                  value={qrCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className={`font-mono h-10 focus:ring-blue-500 dark:border-gray-600 text-center tracking-wider ${
                    !isValidCode && qrCode.length > 0
                      ? 'border-red-300 focus:border-red-500 dark:border-red-600'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  maxLength={16}
                />
                <div className="space-y-1">
                  {!isValidCode && qrCode.length > 0 ? (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      ❌ Mã mời không hợp lệ. Vui lòng kiểm tra lại.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nhập mã mời 8-16 ký tự từ người tạo nhóm
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    💡 Mã mời thường có dạng: ABC123DEF456 (chữ và số)
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogChange(false)}
                  className="px-6 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!qrCode.trim() || !isValidCode}
                >
                  Tham gia nhóm
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* <TabsContent value="scan" className="space-y-4">
            <div className="text-center space-y-4">
              {!isScanning ? (
                <>
                  <div className="mx-auto w-32 h-32 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700">
                    <QrCode className="h-12 w-12 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Nhấn nút bên dưới để bắt đầu quét mã QR
                    </p>
                    <Button
                      onClick={handleScanQR}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Bắt đầu quét
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mx-auto w-32 h-32 border-2 border-purple-500 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 animate-pulse">
                    <Camera className="h-12 w-12 text-purple-600 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Đang quét mã QR...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hướng camera về phía mã QR
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsScanning(false)}
                    size="sm"
                  >
                    Dừng quét
                  </Button>
                </>
              )}
            </div>

            {qrCode && !isScanning && (
              <div className="space-y-3 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Mã đã quét được:</Label>
                  <Input
                    value={qrCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className={`font-mono text-sm text-center tracking-wider ${
                      !isValidCode && qrCode.length > 0
                        ? 'border-red-300 focus:border-red-500 dark:border-red-600'
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    maxLength={16}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleDialogChange(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={() => {
                      if (validateJoinCode(qrCode)) {
                        onJoinGroup(qrCode);
                        resetForm();
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isValidCode || !qrCode.trim()}
                  >
                    Tham gia nhóm
                  </Button>
                </div>
              </div>
            )}
          </TabsContent> */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
