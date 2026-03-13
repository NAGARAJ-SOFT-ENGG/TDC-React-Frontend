  // Trip data
  export const tripSections = [
    { key: 'My Trip', title: 'My Trips' },
    { key: 'Shared with Buddy', title: 'Shared with Buddy' },
    { key: 'Shared by Buddy', title: 'Shared by Buddy' },
    { key: 'Managed by TDC', title: 'Managed by TDC' },
  ];

  export const tripCardData = {
    'My Trip': [
      {
        pickup: 'Srinivasa nagar, Chennai',
        drop: 'Mayiladuthurai, Tamilnadu',
        channel: 'whatsapp',
        name: 'M.Dhinesh kumar',
        mobile: '9897908900',
        vehicleNumber: 'TN45F7890',
        vehicleType: 'SUV',
        vehicleModel: 'Innova',
      },
      {
        pickup: 'Srinivasa nagar, Chennai',
        drop: 'Mayiladuthurai, Tamilnadu',
        channel: 'whatsapp',
        name: 'M.Dhinesh kumar',
        mobile: '9897908900',
        vehicleNumber: 'TN45F7890',
        vehicleType: 'SUV',
        vehicleModel: 'Innova',
      },
    ],
    'Shared with Buddy': [
      {
        pickup: 'Taramani, Chennai',
        drop: 'Coimbatore, Tamilnadu',
        channel: 'app',
        name: 'S.Karthik',
        mobile: '9888776655',
        vehicleNumber: 'TN67C1234',
        vehicleType: 'Sedan',
        vehicleModel: 'Etios',
      },
    ],
    'Shared by Buddy': [
      {
        pickup: 'Guindy, Chennai',
        drop: 'Salem, Tamilnadu',
        channel: 'website',
        name: 'A.Bharath',
        mobile: '9000000001',
        vehicleNumber: 'TN33D5678',
        vehicleType: 'Hatchback',
        vehicleModel: 'i20',
      },
    ],
    'Managed by TDC': [
      {
        pickup: 'Velachery, Chennai',
        drop: 'Hosur, Tamilnadu',
        channel: 'call',
        name: 'R.Vignesh',
        mobile: '9876543210',
        vehicleNumber: 'TN11E4321',
        vehicleType: 'SUV',
        vehicleModel: 'XUV500',
      },
    ],
  };

  // Operators data
  export const operatorList = [
    {
      id: 1,
      name: "Drop Taxi",
      phone: "9876905666",
      email: "taxi@gmail.com",
      contactName: "G.Name",
      contactPhone: "9876679000",
      status:1
    },
    {
      id: 2,
      name: "Easy Taxi",
      phone: "9876901234",
      email: "easy@gmail.com",
      contactName: "M.Name",
      contactPhone: "9876679011",
       status:2,
    },
    {
      id: 3,
      name: "Quick Ride",
      phone: "9876905555",
      email: "quick@gmail.com",
      contactName: "A.Name",
      contactPhone: "9876679022",
      status:3,
    },
    {
      id: 4,
      name: "Safe Travel",
      phone: "9876904444",
      email: "safe@gmail.com",
      contactName: "B.Name",
      contactPhone: "9876679033",
      status:1,
    },
    {
      id: 5,
      name: "City Cabs",
      phone: "9876903333",
      email: "city@gmail.com",
      contactName: "C.Name",
      contactPhone: "9876679044",
      status:2,
    },
  ];

  // Drivers data
  export const driversData = [
    {
      id: 1,
      name: "G. Ravichandran",
      phone: "9897678999",
      email: "ravi@gmail.com",
      vehicleNo: "TN45Z8909",
      vehicleAssigned: "TN45Z8909",
      vehicleModel: "Innova (Prime Sedan)",
      licenseNumber: "TN5420190001214",
      licenseValidity: "12-09-2023 to 12-09-2025",
      totalTrips: 20,
      rating: 9,
      address: "4 VPG street, Srinivasa Nagar, Gandhi Nagar, Guindy, Chennai - 609001, Tamil Nadu, India",
      isActive:true
    },
    {
      id: 2,
      name: "G. Ravi",
      phone: "9897678999",
      email: "ravi@gmail.com",
      vehicleNo: "TN45Z8909",
      vehicleAssigned: "TN45Z8909", // optional, or duplicate
      vehicleModel: "Innova (Prime Sedan)",
      licenseNumber: "TN5420190001214",
      licenseValidity: "12-09-2023 to 12-09-2025",
      totalTrips: 20,
      rating: 9,
      address: "4 VPG street, Srinivasa Nagar, Gandhi Nagar, Guindy, Chennai - 609001, Tamil Nadu, India",
      isActive:false
    },
    {
      id: 3,
      name: "G. Ravi",
      phone: "9897678999",
      email: "ravi@gmail.com",
      vehicleNo: "TN45Z8909",
      vehicleAssigned: "TN45Z8909", // optional, or duplicate
      vehicleModel: "Innova (Prime Sedan)",
      licenseNumber: "TN5420190001214",
      licenseValidity: "12-09-2023 to 12-09-2025",
      totalTrips: 20,
      rating: 9,
      address: "4 VPG street, Srinivasa Nagar, Gandhi Nagar, Guindy, Chennai - 609001, Tamil Nadu, India",
      isActive:true
    },
    {
      id: 4,
      name: "G. Ravi",
      phone: "9897678999",
      email: "ravi@gmail.com",
      vehicleNo: "TN45Z8909",
      vehicleAssigned: "TN45Z8909", // optional, or duplicate
      vehicleModel: "Innova (Prime Sedan)",
      licenseNumber: "TN5420190001214",
      licenseValidity: "12-09-2023 to 12-09-2025",
      totalTrips: 20,
      rating: 9,
      address: "4 VPG street, Srinivasa Nagar, Gandhi Nagar, Guindy, Chennai - 609001, Tamil Nadu, India",
      isActive:true
    },
        {
      id: 5,
      name: "G. Ravi",
      phone: "9897678999",
      email: "ravi@gmail.com",
      vehicleNo: "TN45Z8909",
      vehicleAssigned: "TN45Z8909", // optional, or duplicate
      vehicleModel: "Innova (Prime Sedan)",
      licenseNumber: "TN5420190001214",
      licenseValidity: "12-09-2023 to 12-09-2025",
      totalTrips: 20,
      rating: 9,
      address: "4 VPG street, Srinivasa Nagar, Gandhi Nagar, Guindy, Chennai - 609001, Tamil Nadu, India",
      isActive:true
    },
        {
      id: 6,
      name: "G. Ravi",
      phone: "9897678999",
      email: "ravi@gmail.com",
      vehicleNo: "TN45Z8909",
      vehicleAssigned: "TN45Z8909", // optional, or duplicate
      vehicleModel: "Innova (Prime Sedan)",
      licenseNumber: "TN5420190001214",
      licenseValidity: "12-09-2023 to 12-09-2025",
      totalTrips: 20,
      rating: 9,
      address: "4 VPG street, Srinivasa Nagar, Gandhi Nagar, Guindy, Chennai - 609001, Tamil Nadu, India",
      isActive:false
    },
        {
      id: 7,
      name: "G. Ravi",
      phone: "9897678999",
      email: "ravi@gmail.com",
      vehicleNo: "TN45Z8909",
      vehicleAssigned: "TN45Z8909", // optional, or duplicate
      vehicleModel: "Innova (Prime Sedan)",
      licenseNumber: "TN5420190001214",
      licenseValidity: "12-09-2023 to 12-09-2025",
      totalTrips: 20,
      rating: 9,
      address: "4 VPG street, Srinivasa Nagar, Gandhi Nagar, Guindy, Chennai - 609001, Tamil Nadu, India",
      isActive:false
    },
  ];

  // Vehicles data
  export const vehicles = [
    {
      vehicleNumber: "TN18U0099",
      model: "Innova",
      type: "Prime Sedan",
      driverAssigned: "M.Dhinesh",
      driverPhone: "9897107888",
      rating: 9,
      trips: 20,
      rcNumber: "AG45FG2556",
      fcValidity: "12-09-2023 to 12-09-2025",
      insuranceValidity: "12-09-2023 to 12-09-2025",
      isActive:true
    },
    {
      vehicleNumber: "TN18U0099",
      model: "Innova",
      type: "Prime Sedan",
      driverAssigned: "M.Dhinesh",
      driverPhone: "9897107888",
      rating: 9,
      trips: 20,
      rcNumber: "AG45FG2556",
      fcValidity: "12-09-2023 to 12-09-2025",
      insuranceValidity: "12-09-2023 to 12-09-2025",
      isActive:true
    },
    {
      vehicleNumber: "TN18U0099",
      model: "Innova",
      type: "Prime Sedan",
      driverAssigned: "M.Dhinesh",
      driverPhone: "9897107888",
      rating: 9,
      trips: 20,
      rcNumber: "AG45FG2556",
      fcValidity: "12-09-2023 to 12-09-2025",
      insuranceValidity: "12-09-2023 to 12-09-2025",
      isActive:true
    },
    {
      vehicleNumber: "TN18U0099",
      model: "Innova",
      type: "Prime Sedan",
      driverAssigned: "M.Dhinesh",
      driverPhone: "9897107888",
      rating: 9,
      trips: 20,
      rcNumber: "AG45FG2556",
      fcValidity: "12-09-2023 to 12-09-2025",
      insuranceValidity: "12-09-2023 to 12-09-2025",
      isActive:false
    },
    {
      vehicleNumber: "TN18U0099",
      model: "Innova",
      type: "Prime Sedan",
      driverAssigned: "M.Dhinesh",
      driverPhone: "9897107888",
      rating: 9,
      trips: 20,
      rcNumber: "AG45FG2556",
      fcValidity: "12-09-2023 to 12-09-2025",
      insuranceValidity: "12-09-2023 to 12-09-2025",
      isActive:false
    },
    {
      vehicleNumber: "TN18U0099",
      model: "Innova",
      type: "Prime Sedan",
      driverAssigned: "M.Dhinesh",
      driverPhone: "9897107888",
      rating: 9,
      trips: 20,
      rcNumber: "AG45FG2556",
      fcValidity: "12-09-2023 to 12-09-2025",
      insuranceValidity: "12-09-2023 to 12-09-2025",
      isActive:false
    },
  ];

  // Profile data
  export const profileData = {
    companyName: "Drop Taxi",
    ownerName: "G.Name",
    phone: "9897678999",
    email: "taxi@gmail.com",
    address: "No. 123, Anna Salai, Chennai, Tamil Nadu - 600002",
    licenseNumber: "TN-OP-2023-001234",
    gstNumber: "33AAAAA0000A1Z5",
    panNumber: "AAAAA0000A",
    bankDetails: {
      bankName: "State Bank of India",
      accountNumber: "12345678901234",
      ifsc: "SBIN0001234",
      branch: "Anna Salai Branch"
    },
    totalVehicles: 4,
    totalDrivers: 4,
    registrationDate: "2023-01-01",
    status: "Active"
  };

  export const buddies = [
    { name: "Buddy 1", priority: 1, mobile: "9897123999", trip: 2, revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, revenue: 200 },
    { name: "Buddy 3", priority: 3, mobile: "9897123999", trip: 2, revenue: 200 },
    { name: "Buddy 3", priority: 3, mobile: "9897123999", trip: 2, revenue: 200 },
    { name: "Buddy 3", priority: 3, mobile: "9897123999", trip: 2, revenue: 200 },
    { name: "Buddy 3", priority: 3, mobile: "9897123999", trip: 2, revenue: 200 },
    { name: "Buddy 3", priority: 3, mobile: "9897123999", trip: 2, revenue: 200 },
    { name: "Buddy 3", priority: 3, mobile: "9897123999", trip: 2, revenue: 200 },
    { name: "Buddy 3", priority: 3, mobile: "9897123999", trip: 2, revenue: 200 },
    { name: "Buddy 3", priority: 3, mobile: "9897123999", trip: 2, revenue: 200 },
  ];

  export const myBuddies = [
    { name: "Buddy 1", priority: 1, mobile: "9897123999", trip: 2, driver: "Ravi", vehicle: "TN09AB1234", revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, driver: "Vijay", vehicle: "TN10CD5678", revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, driver: "Vijay", vehicle: "TN10CD5678", revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, driver: "Vijay", vehicle: "TN10CD5678", revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, driver: "Vijay", vehicle: "TN10CD5678", revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, driver: "Vijay", vehicle: "TN10CD5678", revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, driver: "Vijay", vehicle: "TN10CD5678", revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, driver: "Vijay", vehicle: "TN10CD5678", revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, driver: "Vijay", vehicle: "TN10CD5678", revenue: 200 },
    { name: "Buddy 2", priority: 2, mobile: "9897123999", trip: 2, driver: "Vijay", vehicle: "TN10CD5678", revenue: 200 },
  ];

  export const operatorData = {
    stats: [
      { label: "Driver", value: 70 },
      { label: "Vehicle", value: 60 },
      { label: "Trips", value: 79 },
      { label: "Revenue", value: 100 },
      { label: "Buddy Operator", value: 10 },
    ],
    contactInfo: {
      phone: "9897689000",
      email: "droptaxi@gmail.com",
      contacts: [
        { name: "G.Ravi", phone: "9897126777" },
        { name: "M.Dhinesh", phone: "9908761233" },
      ],
    },
    address: {
      lines: [
        "4 VPG street, Srinivasa Nagar, Gandhi Nagar, Guindy",
        "Chennai - 609001",
        "Tamil Nadu, India",
      ],
    },
    documents: {
      "Aadhar Number": "445678901235",
      "PAN Number": "BHJP8978H",
      "GST Number": "29ABCDE1234F2Z5",
    },
  };

  export const existingData = {
  operatorName: 'Jane Doe',
  operatorEmail: 'jane@example.com',
  operatorMobile: '9998887776',
  address: '456 Another St',
  country: 'IN',
  state: 'MH',
  city: 'Mumbai',
  pincode: '400001',
  aadharNumber: '4321-8765-2109',
  panNumber: 'XYZAB1234C',
  gstNumber: '27XYZAB1234C1Z9',
  opExecutiveName: 'John Smith',
  opExecutiveMobile: '7776665555',
  profileImage: 'https://yourcdn.com/profile/jane.jpg',
};

  export const drivers = [
  { id: 1, name: 'Driver 1', phone: '9897678999', rating: 9, trips: 29, status:1 },
  { id: 2, name: 'Driver 2', phone: '9897678999', rating: 9, trips: 29, status:1 },
  { id: 3, name: 'Driver 3', phone: '9897678999', rating: 9, trips: 29, status:2 },
  { id: 4, name: 'Driver 4', phone: '9897678999', rating: 9, trips: 29, status:2 },
  { id: 5, name: 'Driver 5', phone: '9897678999', rating: 9, trips: 29, status:3 },
  { id: 6, name: 'Driver 6', phone: '9897678999', rating: 9, trips: 29, status:3 },
  { id: 7, name: 'Driver 7', phone: '9897678999', rating: 9, trips: 29, status:2 },
  { id: 8, name: 'Driver 8', phone: '9897678999', rating: 9, trips: 29, status:1 },
];

export const vehicleData = {
  vehicleNumber: "TN67Z7890",
  vehicleModel: "Innova",
  vehicleType: "Mini",
  seats: 6,
  driver: {
    name: "Dhinesh Kumar",
    mobile: "9897678999",
  },
  rcNumber: "AG45FG2556",
  activePermits: true,
  insurance: {
    from: "2022-12-19",
    upto: "2029-12-19",
  },
  fitness: {
    from: "2022-12-19",
    upto: "2029-12-19",
  },
};

export const VehicleDetailsViewData = [
  {
    "vehicleNumber": "TN 01 AB 1234",
    "brand": "Tata",
    "specification": "Diesel, 7 Seater, AC",
    "status": 1
  },
  {
    "vehicleNumber": "KA 09 XY 5678",
    "brand": "Mahindra",
    "specification": "Petrol, 5 Seater, Manual",
    "status": 2
  },
  {
    "vehicleNumber": "MH 12 GH 4321",
    "brand": "Toyota",
    "specification": "Hybrid, 7 Seater, Automatic",
    "status": 3
  },
   {
    "vehicleNumber": "TN 01 AB 1234",
    "brand": "Tata",
    "specification": "Diesel, 7 Seater, AC",
    "status": 1
  },
  {
    "vehicleNumber": "KA 09 XY 5678",
    "brand": "Mahindra",
    "specification": "Petrol, 5 Seater, Manual",
    "status": 2
  },
  {
    "vehicleNumber": "MH 12 GH 4321",
    "brand": "Toyota",
    "specification": "Hybrid, 7 Seater, Automatic",
    "status": 3
  }
]

