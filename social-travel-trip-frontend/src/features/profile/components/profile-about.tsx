'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Globe,
  Heart,
  Camera,
  Mountain,
  Utensils,
  Languages,
  Plane
} from 'lucide-react';

interface ProfileAboutProps {
  user: any;
}

export function ProfileAbout({ user }: ProfileAboutProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Personal Information */}
      <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-600" />
              <span>Thông tin cá nhân</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Điện thoại</p>
                  <p className="text-gray-900">{user.phone_number}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                  <p className="text-gray-900">{formatDate(user.date_of_birth)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Giới tính</p>
                  <p className="text-gray-900">{user.gender ? 'Nam' : 'Nữ'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                  <p className="text-gray-900">{user.address}</p>
                </div>
              </div>
              
              {user.website && (
                <div className="flex items-center space-x-3 md:col-span-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        {user.bio && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-purple-600" />
                <span>Giới thiệu bản thân</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-purple-600" />
                <span>Sở thích</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Sidebar */}
      <motion.div variants={itemVariants} className="space-y-6">
        {/* Languages */}
        {user.languages && user.languages.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Languages className="w-5 h-5 text-purple-600" />
                <span>Ngôn ngữ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.languages.map((language: string, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{language}</span>
                    <Badge variant="outline">Thành thạo</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Travel Style */}
        {user.travel_style && user.travel_style.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-purple-600" />
                <span>Phong cách du lịch</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.travel_style.map((style: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-purple-200 text-purple-700"
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Badges/Achievements */}
        {user.badges && user.badges.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-purple-600" />
                <span>Huy hiệu</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.badges.map((badge: any) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{badge.name}</p>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Join Date */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Thành viên từ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{formatDate(user.joined_date)}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
