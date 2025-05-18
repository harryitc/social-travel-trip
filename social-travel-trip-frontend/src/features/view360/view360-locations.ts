/**
 * Predefined locations for the 360-degree view feature
 */

export interface View360Location {
  id: string;
  name: string;
  city: string;
  region: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
}

export const VIEW_360_LOCATIONS: View360Location[] = [
  // Miền Nam
  {
    id: 'bai-sao',
    name: 'Bãi Sao',
    city: 'Kiên Giang',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.05725757562915,
      lng: 104.0363948436442
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747505297576!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzRyZV9SN2dF!2m2!1d10.0552462121511!2d104.0366325129505!3f41.32156850984014!4f-22.57191954269578!5f0.7820865974627469'
  },
  {
    id: 'hon-thom',
    name: 'Hòn Thơm',
    city: 'Phú Quốc',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 9.954605838430725,
      lng: 104.0178143976055
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747332749752!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzR3NERDSUE.!2m2!1d9.954605838430725!2d104.0178143976055!3f352.99579097798187!4f-11.542141392533921!5f0.7820865974627469'
  },
  {
    id: 'vinpearl',
    name: 'Vinpearl Resort',
    city: 'Phú Quốc',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.33683427532572,
      lng: 103.8555491298273
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747332930528!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzRyZV9zUlE.!2m2!1d10.33683427532572!2d103.8555491298273!3f9.87975441837457!4f-61.96086477266688!5f0.7820865974627469'
  },
  {
    id: 'landmark',
    name: 'Landmark 81',
    city: 'Hồ Chí Minh',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.79354656053439,
      lng: 106.7240047363216
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747500249620!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGtqWXFtSmc.!2m2!1d10.79354656053439!2d106.7240047363216!3f65.9868573871558!4f-4.652932567714487!5f0.7820865974627469'
  },
  {
    id: 'rach-vem',
    name: 'Rạch Vẹm',
    city: 'Phú Quốc',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.37304277793628,
      lng: 103.9377705339461
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747333532742!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzRqZGo5S0E.!2m2!1d10.37304277793628!2d103.9377705339461!3f216.24777645854576!4f-0.38721998348161435!5f0.7820865974627469'
  },
  {
    id: 'pho-di-bo-nguyen-hue',
    name: 'Phố đi bộ Nguyễn Huệ',
    city: 'Hồ Chí Minh',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.37304277793628,
      lng: 103.9377705339461
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747500618497!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzQ0OHlWendF!2m2!1d10.77261925857123!2d106.7052078134514!3f98.16935090250226!4f12.161081380563019!5f0.7820865974627469'
  },
  {
    id: 'ben-ninh-kieu',
    name: 'Bến Ninh Kiều',
    city: 'Cần Thơ',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.0333,
      lng: 105.7833
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747333532742!6m8!1m7!1sCAoSLEFGMVFpcE5XVnRXVXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXQ!2m2!1d10.0333!2d105.7833!3f0!4f0!5f0.7820865974627469'
  },
  {
    id: 'cho-noi-cai-rang',
    name: 'Chợ nổi Cái Răng',
    city: 'Cần Thơ',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.0361,
      lng: 105.7908
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747333532742!6m8!1m7!1sCAoSLEFGMVFpcE5XVnRXVXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXRXQ!2m2!1d10.0361!2d105.7908!3f0!4f0!5f0.7820865974627469'
  },
  {
    id: 'mui-ne',
    name: 'Mũi Né',
    city: 'Phan Thiết',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.92277134063956,
      lng: 108.2827949618694
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747413870859!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHFxOG5zRGc.!2m2!1d10.92277134063956!2d108.2827949618694!3f250.67714063698654!4f-21.37455813653939!5f0.7820865974627469'
  },
  {
    id: 'nui-den',
    name: 'Núi Đèn',
    city: 'Hà Tiên',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 9.954605838430725,
      lng: 104.0178143976055
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747499560225!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHFyZWkyY3c.!2m2!1d10.37289226596782!2d104.4451584259442!3f211.81944677726216!4f0!5f0.7820865974627469'
  },
  {
    id: 'rung-tram-tra-su',
    name: 'Rừng tràm Trà Sư',
    city: 'An Giang',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.5833,
      lng: 105.0833
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747495047834!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHEtZXZDZmc.!2m2!1d10.58140358825379!2d105.0589104983493!3f22.155458669411246!4f4.898122194557175!5f0.4000000000000002'
  },
  {
    id: 'nui-sam',
    name: 'Núi Sam và Miếu Bà Chúa Xứ',
    city: 'An Giang',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.6751202698838,
      lng: 105.0782791127975
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747495235097!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ09zNFQ3X2dF!2m2!1d10.68210573732136!2d105.0802910017875!3f261.63629762709695!4f10.182778710084548!5f0.4000000000000002'
  },
  {
    id: 'bai-sau',
    name: 'Bãi Sau Vũng Tàu',
    city: 'Vũng Tàu',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 10.34907186654009,
      lng: 107.0971676648209
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747414304414!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRDJzSlRnZWc.!2m2!1d10.34907186654009!2d107.0971676648209!3f38.71530157927323!4f-82.21191574849168!5f0.7820865974627469'
  },
  {
    id: 'nha-cong-tu-bac-lieu',
    name: 'Nhà Công tử Bạc Liêu',
    city: 'Bạc Liêu',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 9.2833,
      lng: 105.7167
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747494902258!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ3BoZGJZZFE.!2m2!1d9.28408452732009!2d105.7238055313035!3f7.423296444444819!4f-26.258200588604304!5f0.4000000000000002'
  },
  {
    id: 'quan-dao-nam-du',
    name: 'Quần đảo Nam Du',
    city: 'Kiên Giang',
    region: 'Miền Nam',
    description: '',
    coordinates: {
      lat: 9.66389502040506,
      lng: 104.3496417202332
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747414488523!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ1VuTlMzQ2c.!2m2!1d9.66389502040506!2d104.3496417202332!3f99.81168081790992!4f0.7850056876728928!5f0.4000000000000002'
  },


  // Miền Trung
  {
    id: 'pho-co-hoi-an',
    name: 'Phố cổ Hội An',
    city: 'Hội An',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 15.87498002820639,
      lng: 108.3359990034829
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747414738724!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzR5ckRWRnc.!2m2!1d15.87498002820639!2d108.3359990034829!3f176.96713275830936!4f2.585110776640718!5f0.7820865974627469'
  },
  {
    id: 'bien-my-khe',
    name: 'Biển Mỹ Khê',
    city: 'Đà Nẵng',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 16.03155926286188,
      lng: 108.2569290591596
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747414942488!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ2s4dVdmY1E.!2m2!1d16.03155926286188!2d108.2569290591596!3f70.15133672476054!4f16.882785257899485!5f0.7820865974627469'
  },
  {
    id: 'cau-rong',
    name: 'Cầu Rồng',
    city: 'Đà Nẵng',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 16.06128313959818,
      lng: 108.2296736742121
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747416784145!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGFvLXFHV0E.!2m2!1d16.06128313959818!2d108.2296736742121!3f250.46428959931467!4f10.691060139093182!5f0.7820865974627469'
  },
  {
    id: 'co-do-hue',
    name: 'Cố đô Huế',
    city: 'Huế',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 16.46576501032935,
      lng: 107.5876617319682
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747416638814!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRFd2cERiaVFF!2m2!1d16.46576501032935!2d107.5876617319682!3f194.21115801890443!4f-13.360151105557819!5f0.7820865974627469'
  },
  {
    id: 'phong-nha-ke-bang',
    name: 'Phong Nha - Kẻ Bàng',
    city: 'Quảng Bình',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 17.47767903045252,
      lng: 106.1340395116056
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747416553678!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0RwT2FoUGc.!2m2!1d17.47767903045252!2d106.1340395116056!3f160.51280089450208!4f-5.969980438522754!5f0.7820865974627469'
  },
  {
    id: 'ba-na-hills',
    name: 'Bà Nà Hills',
    city: 'Đà Nẵng',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 15.99480629711804,
      lng: 107.996643130635
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747415798333!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ0U2c0dOSUE.!2m2!1d15.99480629711804!2d107.996643130635!3f19.657977674331732!4f-2.1407677760772827!5f0.4000000000000002'
  },
  {
    id: 'lang-co-beach',
    name: 'Biển Lăng Cô',
    city: 'Huế',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 16.27289566516503,
      lng: 108.0599606277014
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747416038681!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ2NuZFQ3RlE.!2m2!1d16.27289566516503!2d108.0599606277014!3f303.7113294016193!4f0.9003761491211009!5f0.7820865974627469'
  },
  {
    id: 'thien-mu-pagoda',
    name: 'Chùa Thiên Mụ',
    city: 'Huế',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 16.45225832914808,
      lng: 107.5450653153509
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747416075819!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ2MtdnpqWnc.!2m2!1d16.45225832914808!2d107.5450653153509!3f49.94292753934999!4f-5.757623044544431!5f0.7820865974627469'
  },
  {
    id: 'son-tra-peninsula',
    name: 'Bán đảo Sơn Trà',
    city: 'Đà Nẵng',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 16.08574793591492,
      lng: 108.2259978348675
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747416201895!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ090b3FubkFF!2m2!1d16.08574793591492!2d108.2259978348675!3f211.3137785310005!4f-30.892596490263706!5f0.7820865974627469'
  },
  {
    id: 'ly-son-island',
    name: 'Đảo Lý Sơn',
    city: 'Quảng Ngãi',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 15.37973169526243,
      lng: 109.0956007385369
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747416264668!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRHF2ZDJiNWdF!2m2!1d15.37973169526243!2d109.0956007385369!3f328.7627233443913!4f0.7540181699922215!5f0.7820865974627469'
  },
  {
    id: 'marble-mountains',
    name: 'Ngũ Hành Sơn',
    city: 'Đà Nẵng',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 16.0406273796354,
      lng: 108.2502678178907
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747495746304!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ1dqS2Z1RkE.!2m2!1d16.00357997322952!2d108.2643904557801!3f73.7676291487919!4f16.219845205115803!5f0.4000000000000002'
  },
  {
    id: 'tam-giang-lagoon',
    name: 'Đầm phá Tam Giang',
    city: 'Huế',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 16.61206061804068,
      lng: 107.5533934158846
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747416423335!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ2xxWkx3bUFF!2m2!1d16.61206061804068!2d107.5533934158846!3f181.57897343718923!4f-33.32387855244893!5f0.7820865974627469'
  },
  {
    id: 'my-son-sanctuary',
    name: 'Thánh địa Mỹ Sơn',
    city: 'Quảng Nam',
    region: 'Miền Trung',
    description: '',
    coordinates: {
      lat: 15.76300706641276,
      lng: 108.123989442643
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747416506358!6m8!1m7!1sCAoSHENJQUJJaEFEeWRkbXFSS0JfbWV1OU13QUNKaGs.!2m2!1d15.76300706641276!2d108.123989442643!3f344.50527686499316!4f-14.758897808970943!5f0.7820865974627469'
  },

  // Miền Bắc
  {
    id: 'vinh-ha-long',
    name: 'Vịnh Hạ Long',
    city: 'Hạ Long',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 20.9100512289355,
      lng: 107.1839024224061
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747415018081!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRGZqT2VkdlFF!2m2!1d20.9100512289355!2d107.1839024224061!3f87.5373364913488!4f6.563715102588802!5f0.4000000000000002'
  },
  {
    id: 'ho-hoan-kiem',
    name: 'Hồ Hoàn Kiếm',
    city: 'Hà Nội',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 21.0286301307459,
      lng: 105.8524792676769
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747415060722!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRDRfOWFlWFE.!2m2!1d21.0286301307459!2d105.8524792676769!3f83.13261344682465!4f-21.383569861287327!5f0.7820865974627469'
  },
  {
    id: 'pho-co-ha-noi',
    name: 'Phố cổ Hà Nội',
    city: 'Hà Nội',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 21.03491298285746,
      lng: 105.8501825722273
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747417954095!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0I4cG15OUFF!2m2!1d21.03491298285746!2d105.8501825722273!3f261.0068602876837!4f19.8481637385228!5f0.7820865974627469'
  },
  {
    id: 'sapa',
    name: 'Sa Pa',
    city: 'Lào Cai',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 22.3351392005417,
      lng: 103.8414929631456
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418046410!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzJsNkN0bHdF!2m2!1d22.3351392005417!2d103.8414929631456!3f66.51452436282926!4f-21.456194225199894!5f0.7820865974627469'
  },
  {
    id: 'moc-chau',
    name: 'Mộc Châu',
    city: 'Sơn La',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 20.872343214208,
      lng: 104.5861787075125
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418108902!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJREIxYzdubUFF!2m2!1d20.872343214208!2d104.5861787075125!3f143.9887647994639!4f-4.121293306540068!5f0.7820865974627469'
  },
  {
    id: 'dong-van',
    name: 'Cao nguyên đá Đồng Văn',
    city: 'Hà Giang',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 23.26028780776931,
      lng: 105.2575134451518
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418153307!6m8!1m7!1sCAoSLEFGMVFpcE9qSVlCckNaUFFQNzljQ2o0Rkw0OTBlMmtSaEJ4bTlsVmtMUTl3!2m2!1d23.26028780776931!2d105.2575134451518!3f113.12560539499034!4f9.127558760790421!5f0.4000000000000002'
  },
  {
    id: 'tam-coc-bich-dong',
    name: 'Tam Cốc - Bích Động',
    city: 'Ninh Bình',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 20.21836211713047,
      lng: 105.9163782869523
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747421765637!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ2NncTZRTVE.!2m2!1d20.21836211713047!2d105.9163782869523!3f278.4057461623623!4f8.630222287469934!5f0.4000000000000002'
  },
  {
    id: 'trang-an',
    name: 'Tràng An',
    city: 'Ninh Bình',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 20.26097517872346,
      lng: 105.9488758025064
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418243175!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGk0dVdBTEE.!2m2!1d20.26097517872346!2d105.9488758025064!3f245.81152627846677!4f2.946906027989897!5f0.4000000000000002'
  },
  {
    id: 'ba-be',
    name: 'Hồ Ba Bể',
    city: 'Bắc Kạn',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 22.40503503635209,
      lng: 105.618247999901
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418301894!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHFqZEdqRnc.!2m2!1d22.40503503635209!2d105.618247999901!3f161.81056016349112!4f15.740176686016312!5f0.4000000000000002'
  },
  {
    id: 'ban-gioc',
    name: 'Thác Bản Giốc',
    city: 'Cao Bằng',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 22.85571692846102,
      lng: 106.723523327683
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418347303!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJREVzSmJCLVFF!2m2!1d22.85571692846102!2d106.723523327683!3f265.75594752276453!4f-2.06832889283983!5f0.4000000000000002'
  },
  {
    id: 'cat-ba',
    name: 'Đảo Cát Bà',
    city: 'Hải Phòng',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 20.7176737657048,
      lng: 107.0475840797433
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418414959!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDR3LVRQNVFF!2m2!1d20.7176737657048!2d107.0475840797433!3f292.59219783413215!4f8.61224911887335!5f0.4000000000000002'
  },
  {
    id: 'chua-huong',
    name: 'Chùa Hương',
    city: 'Hà Nội',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 20.61814211249567,
      lng: 105.7465708887379
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418476805!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0VoZnJscEFF!2m2!1d20.61814211249567!2d105.7465708887379!3f147.52896567946613!4f1.6896686787253543!5f0.4000000000000002'
  },
  {
    id: 'chua-bai-dinh',
    name: 'Chùa Bái Đính',
    city: 'Ninh Bình',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 20.27640809408571,
      lng: 105.8647083883197
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418525319!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzR2OVRsSEE.!2m2!1d20.27640809408571!2d105.8647083883197!3f13.312925768905245!4f-5.935714180298291!5f0.4000000000000002'
  },
  {
    id: 'lang-bac-ho',
    name: 'Lăng Chủ tịch Hồ Chí Minh',
    city: 'Hà Nội',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 21.03577328129474,
      lng: 105.8348450571805
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418643649!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRDR4TWpBSEE.!2m2!1d21.03577328129474!2d105.8348450571805!3f340.95211465312445!4f5.437508876767197!5f0.4000000000000002'
  },
  {
    id: 'mai-chau',
    name: 'Mai Châu',
    city: 'Hòa Bình',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 20.65792083742968,
      lng: 105.0651627041354
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747418672165!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ01zTXF2bmdF!2m2!1d20.65792083742968!2d105.0651627041354!3f11.58085652629353!4f-10.144319783809792!5f0.4000000000000002'
  },
  {
    id: 'vuon-quoc-gia-ba-vi',
    name: 'Vườn quốc gia Ba Vì',
    city: 'Hà Nội',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 21.0868,
      lng: 105.3725
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747502185809!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQ3BpSlQ0QWc.!2m2!1d21.09601891537984!2d105.4021723888768!3f10.588603722511014!4f10.5295985479449!5f0.4000000000000002'
  },
  {
    id: 'den-hung',
    name: 'Đền Hùng',
    city: 'Phú Thọ',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 21.3869,
      lng: 105.3683
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747501724744!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzA1dDMxd1FF!2m2!1d21.36869176390695!2d105.3245776794423!3f148.0523867968432!4f-0.4643377189296558!5f0.4000000000000002'
  },
  {
    id: 'yen-tu',
    name: 'Yên Tử',
    city: 'Quảng Ninh',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 21.0243,
      lng: 106.7258
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747501808479!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzZsY3ZqdmdF!2m2!1d21.10999434178431!2d106.7303056171739!3f206.85988696603425!4f-7.526339644999354!5f0.4000000000000002'
  },
  {
    id: 'thung-lung-bac-son',
    name: 'Thung lũng Bắc Sơn',
    city: 'Lạng Sơn',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 21.9167,
      lng: 106.3333
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747501888874!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0UwdWpfc1FF!2m2!1d21.82327158626864!2d106.3645267382869!3f9.221122842440405!4f11.198685276810096!5f0.4000000000000002'
  },
  {
    id: 'dao-co-to',
    name: 'Đảo Cô Tô',
    city: 'Quảng Ninh',
    region: 'Miền Bắc',
    description: '',
    coordinates: {
      lat: 20.9833,
      lng: 107.7667
    },
    googleMapsUrl: 'https://www.google.com/maps/embed?pb=!4v1747502015504!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ014cktXb3dF!2m2!1d21.0091022647372!2d107.751909999064!3f132.33947247101014!4f-41.172825724925644!5f0.4000000000000002'
  }
];

/**
 * Filter locations by search query
 * @param query Search query
 * @returns Filtered locations
 */
export function searchLocations(query: string): View360Location[] {
  if (!query || query.trim() === '') {
    return VIEW_360_LOCATIONS;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return VIEW_360_LOCATIONS.filter(location =>
    location.name.toLowerCase().includes(normalizedQuery) ||
    location.city.toLowerCase().includes(normalizedQuery) ||
    location.region.toLowerCase().includes(normalizedQuery) ||
    location.description.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Get locations by region
 * @param region Region name
 * @returns Locations in the specified region
 */
export function getLocationsByRegion(region: string): View360Location[] {
  if (!region || region === 'all') {
    return VIEW_360_LOCATIONS;
  }

  return VIEW_360_LOCATIONS.filter(location =>
    location.region.toLowerCase() === region.toLowerCase()
  );
}

/**
 * Get locations by city
 * @param city City name
 * @returns Locations in the specified city
 */
export function getLocationsByCity(city: string): View360Location[] {
  if (!city || city === 'all') {
    return VIEW_360_LOCATIONS;
  }

  return VIEW_360_LOCATIONS.filter(location =>
    location.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Get all unique regions
 * @returns Array of unique region names
 */
export function getAllRegions(): string[] {
  const regions = VIEW_360_LOCATIONS.map(location => location.region);
  return [...new Set(regions)].sort();
}

/**
 * Get all unique cities
 * @returns Array of unique city names
 */
export function getAllCities(): string[] {
  const cities = VIEW_360_LOCATIONS.map(location => location.city);
  return [...new Set(cities)].sort();
}
