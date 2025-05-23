'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { QrCode, Camera, Type } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';

type JoinGroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinGroup: (qrCode: string) => void;
};

export function JoinGroupDialog({ open, onOpenChange, onJoinGroup }: JoinGroupDialogProps) {
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qrCode.trim()) {
      return;
    }

    onJoinGroup(qrCode.trim());
    setQrCode('');
  };

  const handleScanQR = () => {
    // TODO: Implement QR code scanning functionality
    setIsScanning(true);
    
    // Simulate QR scanning (in real implementation, use camera API)
    setTimeout(() => {
      setIsScanning(false);
      // Mock QR code result
      setQrCode('TRIP_GROUP_123456');
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-purple-800 dark:text-purple-300 flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Tham gia nhóm
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Nhập mã
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Quét QR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qrCode">Mã tham gia nhóm</Label>
                <Input
                  id="qrCode"
                  placeholder="Nhập mã QR hoặc link tham gia"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Nhập mã QR hoặc link mời từ người tạo nhóm
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!qrCode.trim()}
                >
                  Tham gia
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="scan" className="space-y-4">
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
                    onChange={(e) => setQrCode(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQrCode('');
                      onOpenChange(false);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={() => onJoinGroup(qrCode)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Tham gia nhóm
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
