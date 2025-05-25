'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/radix-ui/dialog';
import { Badge } from '@/components/ui/radix-ui/badge';
import { 
  Share2, 
  Copy, 
  Link, 
  QrCode, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Mail,
  Download,
  Check
} from 'lucide-react';
import { Plan } from './services/plan.service';
import { toast } from 'sonner';

interface SharePlanProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
}

export function SharePlan({ plan, isOpen, onClose }: SharePlanProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl] = useState(`${window.location.origin}/planning/${plan.plan_id}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Đã sao chép liên kết!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Không thể sao chép liên kết');
    }
  };

  const handleShareSocial = (platform: string) => {
    const text = `Xem kế hoạch du lịch "${plan.name}" của tôi`;
    const url = shareUrl;
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const handleDownloadPlan = () => {
    // TODO: Implement PDF export functionality
    toast.info('Tính năng xuất PDF đang được phát triển');
  };

  const handleGenerateQR = () => {
    // TODO: Implement QR code generation
    toast.info('Tính năng tạo mã QR đang được phát triển');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Chia sẻ kế hoạch
          </DialogTitle>
          <DialogDescription>
            Chia sẻ kế hoạch &quot;{plan.name}&quot; với bạn bè
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Preview */}
          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {plan.thumbnail_url && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={plan.thumbnail_url}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plan.description || 'Kế hoạch du lịch tuyệt vời'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={plan.status === 'public' ? 'default' : 'secondary'} className="text-xs">
                      {plan.status === 'public' ? 'Công khai' : 'Riêng tư'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Link */}
          <div className="space-y-3">
            <Label htmlFor="share-url">Liên kết chia sẻ</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Bất kỳ ai có liên kết này đều có thể xem kế hoạch của bạn
            </p>
          </div>

          {/* Social Share */}
          <div className="space-y-3">
            <Label>Chia sẻ qua mạng xã hội</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleShareSocial('facebook')}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShareSocial('twitter')}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShareSocial('whatsapp')}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShareSocial('email')}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-gray-600" />
                Email
              </Button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <Label>Tùy chọn khác</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleGenerateQR}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Mã QR
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadPlan}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Tải PDF
              </Button>
            </div>
          </div>

          {/* Privacy Notice */}
          {plan.status === 'private' && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Kế hoạch riêng tư
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Chỉ những người có liên kết mới có thể xem kế hoạch này. 
                      Để công khai, hãy chỉnh sửa kế hoạch và thay đổi trạng thái.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
