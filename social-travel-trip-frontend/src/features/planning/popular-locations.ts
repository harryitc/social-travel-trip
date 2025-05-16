// Danh sách các địa điểm nổi tiếng theo khu vực
export interface PopularLocation {
  id: string;
  name: string;
  region: string;
  city: string;
  description?: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'cafe' | 'shopping' | 'other';
}

export const POPULAR_LOCATIONS: Record<string, PopularLocation[]> = {
  'Hà Nội': [
    { id: 'hn-1', name: 'Hồ Hoàn Kiếm', region: 'Miền Bắc', city: 'Hà Nội', type: 'attraction', description: 'Hồ nước nổi tiếng ở trung tâm Hà Nội' },
    { id: 'hn-2', name: 'Văn Miếu - Quốc Tử Giám', region: 'Miền Bắc', city: 'Hà Nội', type: 'attraction', description: 'Di tích lịch sử văn hóa' },
    { id: 'hn-3', name: 'Chùa Một Cột', region: 'Miền Bắc', city: 'Hà Nội', type: 'attraction', description: 'Ngôi chùa biểu tượng của Hà Nội' },
    { id: 'hn-4', name: 'Lăng Chủ tịch Hồ Chí Minh', region: 'Miền Bắc', city: 'Hà Nội', type: 'attraction', description: 'Công trình lưu niệm Chủ tịch Hồ Chí Minh' },
    { id: 'hn-5', name: 'Phố cổ Hà Nội', region: 'Miền Bắc', city: 'Hà Nội', type: 'attraction', description: 'Khu phố cổ với 36 phố phường' },
    { id: 'hn-6', name: 'Nhà hàng Chả Cá Lã Vọng', region: 'Miền Bắc', city: 'Hà Nội', type: 'restaurant', description: 'Nhà hàng chả cá nổi tiếng' },
    { id: 'hn-7', name: 'Cà phê Giảng', region: 'Miền Bắc', city: 'Hà Nội', type: 'cafe', description: 'Quán cà phê trứng nổi tiếng' },
    { id: 'hn-8', name: 'Chợ Đồng Xuân', region: 'Miền Bắc', city: 'Hà Nội', type: 'shopping', description: 'Khu chợ lớn nhất Hà Nội' },
  ],
  'Hạ Long': [
    { id: 'hl-1', name: 'Vịnh Hạ Long', region: 'Miền Bắc', city: 'Hạ Long', type: 'attraction', description: 'Di sản thiên nhiên thế giới UNESCO' },
    { id: 'hl-2', name: 'Hang Sửng Sốt', region: 'Miền Bắc', city: 'Hạ Long', type: 'attraction', description: 'Hang động đẹp nhất Vịnh Hạ Long' },
    { id: 'hl-3', name: 'Đảo Ti Tốp', region: 'Miền Bắc', city: 'Hạ Long', type: 'attraction', description: 'Hòn đảo với bãi tắm đẹp' },
    { id: 'hl-4', name: 'Làng chài Cửa Vạn', region: 'Miền Bắc', city: 'Hạ Long', type: 'attraction', description: 'Làng chài nổi trên vịnh Hạ Long' },
  ],
  'Sapa': [
    { id: 'sp-1', name: 'Núi Fansipan', region: 'Miền Bắc', city: 'Sapa', type: 'attraction', description: 'Nóc nhà Đông Dương' },
    { id: 'sp-2', name: 'Thung lũng Mường Hoa', region: 'Miền Bắc', city: 'Sapa', type: 'attraction', description: 'Thung lũng với ruộng bậc thang' },
    { id: 'sp-3', name: 'Bản Cát Cát', region: 'Miền Bắc', city: 'Sapa', type: 'attraction', description: 'Làng dân tộc H\'Mông' },
    { id: 'sp-4', name: 'Chợ Sapa', region: 'Miền Bắc', city: 'Sapa', type: 'shopping', description: 'Chợ truyền thống của người dân tộc' },
  ],
  'Huế': [
    { id: 'hue-1', name: 'Đại Nội - Kinh thành Huế', region: 'Miền Trung', city: 'Huế', type: 'attraction', description: 'Di sản văn hóa thế giới' },
    { id: 'hue-2', name: 'Lăng Tự Đức', region: 'Miền Trung', city: 'Huế', type: 'attraction', description: 'Lăng mộ vua Tự Đức' },
    { id: 'hue-3', name: 'Chùa Thiên Mụ', region: 'Miền Trung', city: 'Huế', type: 'attraction', description: 'Ngôi chùa cổ nhất Huế' },
    { id: 'hue-4', name: 'Sông Hương', region: 'Miền Trung', city: 'Huế', type: 'attraction', description: 'Dòng sông biểu tượng của Huế' },
    { id: 'hue-5', name: 'Nhà hàng Cung Đình Huế', region: 'Miền Trung', city: 'Huế', type: 'restaurant', description: 'Ẩm thực cung đình Huế' },
  ],
  'Đà Nẵng': [
    { id: 'dn-1', name: 'Bà Nà Hills', region: 'Miền Trung', city: 'Đà Nẵng', type: 'attraction', description: 'Khu du lịch với Cầu Vàng nổi tiếng' },
    { id: 'dn-2', name: 'Bãi biển Mỹ Khê', region: 'Miền Trung', city: 'Đà Nẵng', type: 'attraction', description: 'Một trong những bãi biển đẹp nhất thế giới' },
    { id: 'dn-3', name: 'Ngũ Hành Sơn', region: 'Miền Trung', city: 'Đà Nẵng', type: 'attraction', description: 'Danh thắng với các hang động và chùa' },
    { id: 'dn-4', name: 'Cầu Rồng', region: 'Miền Trung', city: 'Đà Nẵng', type: 'attraction', description: 'Cây cầu biểu tượng của Đà Nẵng' },
    { id: 'dn-5', name: 'Chợ Hàn', region: 'Miền Trung', city: 'Đà Nẵng', type: 'shopping', description: 'Khu chợ truyền thống của Đà Nẵng' },
  ],
  'Hội An': [
    { id: 'ha-1', name: 'Phố cổ Hội An', region: 'Miền Trung', city: 'Hội An', type: 'attraction', description: 'Di sản văn hóa thế giới' },
    { id: 'ha-2', name: 'Chùa Cầu', region: 'Miền Trung', city: 'Hội An', type: 'attraction', description: 'Biểu tượng của Hội An' },
    { id: 'ha-3', name: 'Bãi biển An Bàng', region: 'Miền Trung', city: 'Hội An', type: 'attraction', description: 'Bãi biển đẹp gần Hội An' },
    { id: 'ha-4', name: 'Làng gốm Thanh Hà', region: 'Miền Trung', city: 'Hội An', type: 'attraction', description: 'Làng nghề truyền thống' },
    { id: 'ha-5', name: 'Nhà hàng Morning Glory', region: 'Miền Trung', city: 'Hội An', type: 'restaurant', description: 'Nhà hàng ẩm thực Hội An nổi tiếng' },
  ],
  'Nha Trang': [
    { id: 'nt-1', name: 'Vinpearl Land', region: 'Miền Trung', city: 'Nha Trang', type: 'attraction', description: 'Khu du lịch giải trí' },
    { id: 'nt-2', name: 'Vịnh Nha Trang', region: 'Miền Trung', city: 'Nha Trang', type: 'attraction', description: 'Một trong những vịnh đẹp nhất thế giới' },
    { id: 'nt-3', name: 'Tháp Bà Ponagar', region: 'Miền Trung', city: 'Nha Trang', type: 'attraction', description: 'Di tích kiến trúc Chăm Pa' },
    { id: 'nt-4', name: 'Hòn Tằm', region: 'Miền Trung', city: 'Nha Trang', type: 'attraction', description: 'Đảo du lịch sinh thái' },
  ],
  'Đà Lạt': [
    { id: 'dl-1', name: 'Hồ Xuân Hương', region: 'Miền Trung', city: 'Đà Lạt', type: 'attraction', description: 'Hồ nước trung tâm Đà Lạt' },
    { id: 'dl-2', name: 'Thung lũng Tình Yêu', region: 'Miền Trung', city: 'Đà Lạt', type: 'attraction', description: 'Khu du lịch lãng mạn' },
    { id: 'dl-3', name: 'Ga Đà Lạt', region: 'Miền Trung', city: 'Đà Lạt', type: 'attraction', description: 'Nhà ga cổ nhất Đông Dương' },
    { id: 'dl-4', name: 'Dinh Bảo Đại', region: 'Miền Trung', city: 'Đà Lạt', type: 'attraction', description: 'Cung điện của vua Bảo Đại' },
    { id: 'dl-5', name: 'Chợ Đà Lạt', region: 'Miền Trung', city: 'Đà Lạt', type: 'shopping', description: 'Khu chợ trung tâm Đà Lạt' },
    { id: 'dl-6', name: 'Cà phê Túi Mơ To', region: 'Miền Trung', city: 'Đà Lạt', type: 'cafe', description: 'Quán cà phê view đẹp' },
  ],
  'Hồ Chí Minh': [
    { id: 'hcm-1', name: 'Dinh Độc Lập', region: 'Miền Nam', city: 'Hồ Chí Minh', type: 'attraction', description: 'Di tích lịch sử' },
    { id: 'hcm-2', name: 'Nhà thờ Đức Bà', region: 'Miền Nam', city: 'Hồ Chí Minh', type: 'attraction', description: 'Công trình kiến trúc Pháp' },
    { id: 'hcm-3', name: 'Bưu điện Trung tâm', region: 'Miền Nam', city: 'Hồ Chí Minh', type: 'attraction', description: 'Công trình kiến trúc cổ' },
    { id: 'hcm-4', name: 'Chợ Bến Thành', region: 'Miền Nam', city: 'Hồ Chí Minh', type: 'shopping', description: 'Khu chợ biểu tượng của Sài Gòn' },
    { id: 'hcm-5', name: 'Phố đi bộ Nguyễn Huệ', region: 'Miền Nam', city: 'Hồ Chí Minh', type: 'attraction', description: 'Khu phố đi bộ sầm uất' },
    { id: 'hcm-6', name: 'Phố Tây Bùi Viện', region: 'Miền Nam', city: 'Hồ Chí Minh', type: 'attraction', description: 'Khu phố Tây sôi động' },
  ],
  'Phú Quốc': [
    { id: 'pq-1', name: 'Bãi Sao', region: 'Miền Nam', city: 'Phú Quốc', type: 'attraction', description: 'Bãi biển cát trắng đẹp nhất Phú Quốc' },
    { id: 'pq-2', name: 'Vinpearl Safari', region: 'Miền Nam', city: 'Phú Quốc', type: 'attraction', description: 'Vườn thú bán hoang dã' },
    { id: 'pq-3', name: 'Làng chài Hàm Ninh', region: 'Miền Nam', city: 'Phú Quốc', type: 'attraction', description: 'Làng chài truyền thống' },
    { id: 'pq-4', name: 'Nhà thùng nước mắm', region: 'Miền Nam', city: 'Phú Quốc', type: 'attraction', description: 'Cơ sở sản xuất nước mắm truyền thống' },
  ],
  'Cần Thơ': [
    { id: 'ct-1', name: 'Chợ nổi Cái Răng', region: 'Miền Nam', city: 'Cần Thơ', type: 'attraction', description: 'Chợ nổi lớn nhất đồng bằng sông Cửu Long' },
    { id: 'ct-2', name: 'Nhà cổ Bình Thủy', region: 'Miền Nam', city: 'Cần Thơ', type: 'attraction', description: 'Ngôi nhà cổ hơn 100 năm tuổi' },
    { id: 'ct-3', name: 'Thiền viện Trúc Lâm Phương Nam', region: 'Miền Nam', city: 'Cần Thơ', type: 'attraction', description: 'Thiền viện lớn nhất miền Tây' },
  ],
};

// Hàm lấy danh sách địa điểm theo thành phố
export const getLocationsByCity = (city: string): PopularLocation[] => {
  return POPULAR_LOCATIONS[city] || [];
};

// Hàm lấy tất cả các thành phố
export const getAllCities = (): string[] => {
  return Object.keys(POPULAR_LOCATIONS);
};

// Hàm tìm kiếm địa điểm theo từ khóa
export const searchLocations = (keyword: string): PopularLocation[] => {
  const results: PopularLocation[] = [];
  
  Object.values(POPULAR_LOCATIONS).forEach(locations => {
    locations.forEach(location => {
      if (
        location.name.toLowerCase().includes(keyword.toLowerCase()) ||
        location.city.toLowerCase().includes(keyword.toLowerCase()) ||
        (location.description && location.description.toLowerCase().includes(keyword.toLowerCase()))
      ) {
        results.push(location);
      }
    });
  });
  
  return results;
};

// Hàm gợi ý địa điểm dựa trên địa điểm chuyến đi
export const suggestLocationsByDestination = (destination: string): PopularLocation[] => {
  // Tìm thành phố phù hợp với địa điểm
  const matchingCity = Object.keys(POPULAR_LOCATIONS).find(city => 
    destination.toLowerCase().includes(city.toLowerCase())
  );
  
  if (matchingCity) {
    // Trả về các địa điểm của thành phố đó
    return POPULAR_LOCATIONS[matchingCity].slice(0, 5);
  }
  
  // Nếu không tìm thấy thành phố phù hợp, tìm theo khu vực
  const regions = ['Miền Bắc', 'Miền Trung', 'Miền Nam'];
  const matchingRegion = regions.find(region => 
    destination.toLowerCase().includes(region.toLowerCase())
  );
  
  if (matchingRegion) {
    // Lấy tất cả địa điểm thuộc khu vực đó
    const regionLocations: PopularLocation[] = [];
    Object.values(POPULAR_LOCATIONS).forEach(locations => {
      locations.forEach(location => {
        if (location.region === matchingRegion) {
          regionLocations.push(location);
        }
      });
    });
    
    // Trả về 5 địa điểm đầu tiên
    return regionLocations.slice(0, 5);
  }
  
  // Nếu không tìm thấy, trả về một số địa điểm ngẫu nhiên
  const allLocations: PopularLocation[] = [];
  Object.values(POPULAR_LOCATIONS).forEach(locations => {
    allLocations.push(...locations);
  });
  
  // Trộn ngẫu nhiên và lấy 5 địa điểm
  return allLocations
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);
};
