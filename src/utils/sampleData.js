export const sampleFlights = [
  {
    id: 'fl1',
    airline: 'IndiGo',
    flightNo: '6E-755',
    from: 'Delhi',
    to: 'Mumbai',
    departure: '06:00',
    arrival: '08:15',
    price: 4599,
    duration: '2h 15m',
    stops: 0,
    aircraft: 'Airbus A320',
    rating: 4.5,
    reviews: 328,
    amenities: [
      'Meal Available',
      'Extra Legroom',
      'Web Check-in',
      'Seat Selection',
      'In-flight Entertainment'
    ],
    baggage: {
      cabin: '7 kg',
      checkin: '15 kg',
      extra: '₹500/kg'
    },
    features: [
      'On-time Performance',
      'Modern Fleet',
      'Mobile Boarding Pass',
      'Flexi Booking'
    ],
    classes: [
      { type: 'Economy', price: 4599 },
      { type: 'Economy Plus', price: 5599 },
      { type: 'Business', price: 8999 }
    ],
    thumbnail: '✈️'
  },
  {
    id: 'fl2',
    airline: 'Air India',
    flightNo: 'AI-213',
    from: 'Mumbai',
    to: 'Bangalore',
    departure: '10:30',
    arrival: '12:20',
    price: 5299,
    duration: '1h 50m',
    stops: 0,
    aircraft: 'Boeing 787',
    rating: 4.3,
    reviews: 245,
    amenities: [
      'Complimentary Meal',
      'Entertainment',
      'Priority Boarding',
      'Lounge Access',
      'Extra Baggage'
    ],
    baggage: {
      cabin: '8 kg',
      checkin: '25 kg',
      extra: '₹450/kg'
    },
    features: [
      'International Connectivity',
      'Star Alliance Member',
      'Award-winning Service',
      'Flexible Rebooking'
    ],
    classes: [
      { type: 'Economy', price: 5299 },
      { type: 'Premium Economy', price: 7299 },
      { type: 'Business', price: 12999 }
    ],
    thumbnail: '🛩️'
  },
  {
    id: 3,
    airline: 'Vistara',
    flightNo: 'UK-835',
    from: 'Bangalore',
    to: 'Kolkata',
    departure: '14:45',
    arrival: '17:30',
    price: 6199,
    duration: '2h 45m',
    stops: 1,
    aircraft: 'Airbus A321',
    amenities: ['Premium Meal', 'Lounge Access']
  },
  {
    id: 4,
    airline: 'SpiceJet',
    flightNo: 'SG-154',
    from: 'Chennai',
    to: 'Hyderabad',
    departure: '08:30',
    arrival: '10:00',
    price: 3899,
    duration: '1h 30m',
    stops: 0,
    aircraft: 'Boeing 737',
    amenities: ['Cafe on Board']
  },
  {
    id: 5,
    airline: 'Go First',
    flightNo: 'G8-345',
    from: 'Pune',
    to: 'Delhi',
    departure: '16:20',
    arrival: '18:45',
    price: 4799,
    duration: '2h 25m',
    stops: 0,
    aircraft: 'Airbus A320neo',
    amenities: ['Extra Baggage Option']
  }
];

export const sampleHotels = [
  {
    id: 'ht1',
    name: 'Taj Palace',
    city: 'Delhi',
    location: 'Diplomatic Enclave, Chanakyapuri',
    rating: 4.8,
    reviews: 856,
    price: 12000,
    thumbnail: '🏨',
    amenities: [
      'Outdoor Pool',
      'Luxury Spa',
      'High-speed WiFi',
      'Multiple Restaurants',
      '24/7 Room Service',
      'Fitness Center',
      'Business Center',
      'Concierge Services'
    ],
    roomTypes: [
      { 
        type: 'Deluxe Room',
        price: 12000,
        size: '400 sq ft',
        view: 'City View',
        bed: 'King/Twin',
        occupancy: '3 Adults'
      },
      {
        type: 'Luxury Suite',
        price: 25000,
        size: '800 sq ft',
        view: 'Pool View',
        bed: 'King',
        occupancy: '3 Adults + 1 Child'
      },
      {
        type: 'Presidential Suite',
        price: 45000,
        size: '1200 sq ft',
        view: 'Panoramic City',
        bed: 'King',
        occupancy: '4 Adults'
      }
    ],
    dining: [
      'Orient Express - European',
      'Masala Art - Indian',
      'Capital Kitchen - All Day',
      'Tea Lounge'
    ],
    experiences: [
      'Jiva Spa Treatments',
      'Culinary Classes',
      'Heritage Walks',
      'Evening Cultural Shows'
    ],
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellation: '24 hours',
      childPolicy: 'Below 12 years stay free'
    }
  },
  {
    id: 'ht2',
    name: 'The Oberoi',
    city: 'Mumbai',
    location: 'Nariman Point',
    rating: 4.9,
    reviews: 923,
    price: 15000,
    thumbnail: '🏰',
    amenities: [
      'Ocean View',
      'Award-winning Spa',
      'Rooftop Pool',
      'Fine Dining',
      '24/7 Butler',
      'Luxury Shopping',
      'Private Beach Access',
      'Yacht Services'
    ],
    roomTypes: [
      {
        type: 'Premier Room',
        price: 15000,
        size: '350 sq ft',
        view: 'Ocean View',
        bed: 'King',
        occupancy: '2 Adults'
      },
      {
        type: 'Luxury Suite',
        price: 28000,
        size: '750 sq ft',
        view: 'Ocean View',
        bed: 'King',
        occupancy: '3 Adults'
      },
      {
        type: 'Presidential Suite',
        price: 50000,
        size: '1500 sq ft',
        view: 'Panoramic Ocean',
        bed: 'King',
        occupancy: '4 Adults'
      }
    ],
    dining: [
      'Ziya - Modern Indian',
      'Vetro - Italian',
      'Fenix - International',
      'Champagne Lounge'
    ],
    experiences: [
      'Luxury Spa Rituals',
      'Private Yacht Tours',
      'Chefs Table',
      'Art Tours'
    ],
    policies: {
      checkIn: '15:00',
      checkOut: '12:00',
      cancellation: '48 hours',
      childPolicy: 'Below 8 years stay free'
    }
  },
  {
    id: 3,
    name: 'ITC Gardenia',
    city: 'Bangalore',
    rating: 5,
    price: 11000,
    amenities: ['Pool', 'Spa', 'WiFi', 'Garden', 'Business Center'],
    images: ['itc_1.jpg'],
    reviews: 4.7,
    roomTypes: [
      { type: 'Executive Room', price: 11000 },
      { type: 'Tower Suite', price: 22000 },
      { type: 'Presidential Suite', price: 40000 }
    ]
  },
  {
    id: 4,
    name: 'Leela Palace',
    city: 'Chennai',
    rating: 5,
    price: 13500,
    amenities: ['Sea View', 'Spa', 'Pool', 'Fine Dining', 'Beach Access'],
    images: ['leela_1.jpg'],
    reviews: 4.8,
    roomTypes: [
      { type: 'Grande Room', price: 13500 },
      { type: 'Royal Suite', price: 27000 },
      { type: 'Maharaja Suite', price: 45000 }
    ]
  },
  {
    id: 5,
    name: 'Hyatt Regency',
    city: 'Kolkata',
    rating: 5,
    price: 9500,
    amenities: ['Pool', 'Spa', 'WiFi', 'Multiple Restaurants', 'Fitness Center'],
    images: ['hyatt_1.jpg'],
    reviews: 4.6,
    roomTypes: [
      { type: 'King Room', price: 9500 },
      { type: 'Regency Suite', price: 18000 },
      { type: 'Presidential Suite', price: 35000 }
    ]
  }
];

export const sampleBuses = [
  {
    id: 'bs1',
    operator: 'Orange Tours',
    type: 'Volvo Multi-Axle A/C Sleeper',
    from: 'Mumbai',
    to: 'Pune',
    departure: '22:00',
    arrival: '01:30',
    duration: '3h 30m',
    price: 899,
    rating: 4.5,
    reviews: 234,
    thumbnail: '🚌',
    amenities: [
      'USB Charging',
      'Blanket',
      'Water Bottle',
      'Reading Light',
      'Emergency Contact',
      'CCTV',
      'GPS Tracking'
    ],
    seatTypes: [
      { type: 'Lower Berth', price: 899 },
      { type: 'Upper Berth', price: 849 },
      { type: 'Single Lady Berth', price: 899 }
    ],
    features: [
      'Live Tracking',
      'On-time Guarantee',
      'Safe Driver',
      'Regular Sanitization'
    ],
    boardingPoints: [
      { point: 'Borivali', time: '22:00' },
      { point: 'Andheri', time: '22:30' },
      { point: 'Dadar', time: '23:00' }
    ],
    droppingPoints: [
      { point: 'Viman Nagar', time: '01:00' },
      { point: 'Pune Station', time: '01:30' }
    ],
    policies: {
      cancellation: '2 hours before departure',
      luggage: '15 kg included',
      childPolicy: 'Above 5 years full ticket'
    }
  },
  {
    id: 'bs2',
    operator: 'Royal Travels',
    type: 'Mercedes A/C Seater',
    from: 'Delhi',
    to: 'Agra',
    departure: '06:30',
    arrival: '10:30',
    duration: '4h 00m',
    price: 599,
    rating: 4.3,
    reviews: 189,
    thumbnail: '🚍',
    amenities: [
      'WiFi',
      'Snacks',
      'LCD TV',
      'Foot Rest',
      'Charging Point',
      'First Aid',
      'Fire Extinguisher'
    ],
    seatTypes: [
      { type: 'Window Seat', price: 599 },
      { type: 'Aisle Seat', price: 599 }
    ],
    features: [
      'Express Service',
      'Professional Driver',
      'Regular Breaks',
      'Highway Restaurant Stops'
    ],
    boardingPoints: [
      { point: 'Kashmere Gate', time: '06:30' },
      { point: 'Sarai Kale Khan', time: '07:00' }
    ],
    droppingPoints: [
      { point: 'Agra Cantt', time: '10:15' },
      { point: 'Taj Ganj', time: '10:30' }
    ],
    policies: {
      cancellation: '4 hours before departure',
      luggage: '10 kg included',
      childPolicy: 'Above 3 years full ticket'
    }
  },
  {
    id: 3,
    operator: 'Green Line',
    type: 'Volvo Multi-Axle',
    from: 'Bangalore',
    to: 'Hyderabad',
    departure: '21:00',
    arrival: '06:00',
    price: 1299,
    seats: 'Available',
    amenities: ['Charging Point', 'Blanket', 'Emergency Contact'],
    rating: 4.6
  },
  {
    id: 4,
    operator: 'Blue Mountain',
    type: 'Scania Premium',
    from: 'Chennai',
    to: 'Coimbatore',
    departure: '23:00',
    arrival: '06:30',
    price: 999,
    seats: 'Almost Full',
    amenities: ['Reading Light', 'Pillow', 'Emergency Exit'],
    rating: 4.4
  }
];

export const sampleTrains = [
  {
    id: 1,
    thumbnail: '🚂',
    name: 'Rajdhani Express',
    number: '12951',
    type: 'Superfast',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departure: '16:25',
    arrival: '08:15',
    duration: '15h 50m',
    rating: 4.5,
    reviews: 2156,
    classes: [
      { type: '1AC', price: 4200, seats: 'Available' },
      { type: '2AC', price: 2500, seats: 'Available' },
      { type: '3AC', price: 1700, seats: 'RAC' },
      { type: 'SL', price: 750, seats: 'Waiting List' }
    ],
    amenities: [
      'Pantry Car',
      'Bedding Provided',
      'Reading Light',
      'Mobile Charging',
      'Bio Toilets',
      'Security Guard'
    ],
    meals: [
      'Evening Snacks',
      'Dinner',
      'Bed Tea',
      'Breakfast'
    ]
  },
  {
    id: 2,
    thumbnail: '🚅',
    name: 'Vande Bharat Express',
    number: '22439',
    type: 'Premium',
    from: 'New Delhi',
    to: 'Varanasi',
    departure: '06:00',
    arrival: '14:00',
    duration: '8h 00m',
    rating: 4.8,
    reviews: 1832,
    classes: [
      { type: 'Executive', price: 3500, seats: 'Available' },
      { type: 'Chair Car', price: 1800, seats: 'Available' }
    ],
    amenities: [
      'Automatic Doors',
      'GPS Based Info System',
      'CCTV Cameras',
      'Bio Vacuum Toilets',
      'Touch-free Doors',
      'Mobile App Based Services',
      'Reclining Seats'
    ],
    meals: [
      'Breakfast',
      'Lunch',
      'Evening Snacks'
    ]
  },
  {
    id: 3,
    thumbnail: '🚂',
    name: 'Duronto Express',
    number: '12213',
    type: 'Non-Stop',
    from: 'Mumbai Central',
    to: 'Bengaluru',
    departure: '22:00',
    arrival: '16:30',
    duration: '18h 30m',
    rating: 4.3,
    reviews: 1456,
    classes: [
      { type: '1AC', price: 4800, seats: 'RAC' },
      { type: '2AC', price: 2800, seats: 'Available' },
      { type: '3AC', price: 1900, seats: 'Available' },
      { type: 'SL', price: 850, seats: 'Available' }
    ],
    amenities: [
      'Pantry Car',
      'Bedding Provided',
      'Individual Reading Light',
      'Mobile/Laptop Charging',
      'Bio Toilets',
      'Security Personnel'
    ],
    meals: [
      'Welcome Drink',
      'Dinner',
      'Bed Tea',
      'Breakfast',
      'Lunch'
    ]
  },
  {
    id: 4,
    thumbnail: '🚅',
    name: 'Tejas Express',
    number: '82501',
    type: 'Premium',
    from: 'Mumbai Central',
    to: 'Ahmedabad',
    departure: '07:25',
    arrival: '13:55',
    duration: '6h 30m',
    rating: 4.6,
    reviews: 987,
    classes: [
      { type: 'Executive', price: 2800, seats: 'Available' },
      { type: 'Chair Car', price: 1500, seats: 'Available' }
    ],
    amenities: [
      'High-Speed WiFi',
      'Entertainment System',
      'Automatic Doors',
      'CCTV Surveillance',
      'Bio Vacuum Toilets',
      'RO Filtered Water',
      'Snack Table'
    ],
    meals: [
      'Breakfast',
      'Lunch',
      'Tea/Coffee'
    ]
  }
];

export const sampleHomestays = [
  {
    id: 1,
    name: 'Coorg Valley Villa',
    location: 'Coorg, Karnataka',
    price: 4500,
    rooms: 3,
    amenities: ['Kitchen', 'Garden', 'Parking', 'Mountain View', 'Bonfire'],
    rating: 4.6,
    maxGuests: 8,
    type: 'Villa'
  },
  {
    id: 2,
    name: 'Goa Beach House',
    location: 'Anjuna, Goa',
    price: 6500,
    rooms: 4,
    amenities: ['Pool', 'Beach Access', 'WiFi', 'BBQ', 'Garden'],
    rating: 4.8,
    maxGuests: 10,
    type: 'Beach House'
  },
  {
    id: 3,
    name: 'Manali Cottage',
    location: 'Manali, Himachal Pradesh',
    price: 3500,
    rooms: 2,
    amenities: ['Fireplace', 'Mountain View', 'Heating', 'Kitchen'],
    rating: 4.7,
    maxGuests: 6,
    type: 'Cottage'
  },
  {
    id: 4,
    name: 'Kerala Backwater Home',
    location: 'Alleppey, Kerala',
    price: 5500,
    rooms: 3,
    amenities: ['Waterfront', 'Boat Dock', 'Garden', 'Traditional Architecture'],
    rating: 4.9,
    maxGuests: 8,
    type: 'Heritage Home'
  }
];

export const sampleCabs = [
  {
    id: 1,
    type: 'Mini',
    provider: 'OLA',
    capacity: '4 seater',
    price: '₹10/km',
    eta: '5 mins',
    ac: true,
    carModels: ['Swift', 'WagonR', 'i10']
  },
  {
    id: 2,
    type: 'Prime SUV',
    provider: 'Uber',
    capacity: '6 seater',
    price: '₹15/km',
    eta: '8 mins',
    ac: true,
    carModels: ['Innova', 'Ertiga', 'XUV500']
  },
  {
    id: 3,
    type: 'Luxury Sedan',
    provider: 'OLA',
    capacity: '4 seater',
    price: '₹18/km',
    eta: '10 mins',
    ac: true,
    carModels: ['Honda City', 'Hyundai Verna', 'Toyota Camry']
  },
  {
    id: 4,
    type: 'Premium SUV',
    provider: 'Uber',
    capacity: '6 seater',
    price: '₹20/km',
    eta: '12 mins',
    ac: true,
    carModels: ['Toyota Fortuner', 'Ford Endeavour']
  }
];

export const sampleInsurance = [
  {
    id: 1,
    provider: 'TATA AIG',
    type: 'Travel Insurance',
    coverage: '₹2,00,000',
    price: 499,
    duration: '7 days',
    benefits: ['Medical Coverage', 'Trip Cancellation', 'Baggage Loss'],
    claimProcess: 'Digital'
  },
  {
    id: 2,
    provider: 'ICICI Lombard',
    type: 'Travel Insurance',
    coverage: '₹5,00,000',
    price: 899,
    duration: '15 days',
    benefits: ['Medical Coverage', 'Trip Cancellation', 'Adventure Sports'],
    claimProcess: 'Digital'
  },
  {
    id: 3,
    provider: 'Bajaj Allianz',
    type: 'Travel Insurance',
    coverage: '₹10,00,000',
    price: 1499,
    duration: '30 days',
    benefits: ['Medical Coverage', 'Trip Cancellation', 'Personal Accident'],
    claimProcess: 'Digital + Physical'
  }
];

export const sampleHolidayPackages = [
  {
    id: 'hp1',
    name: 'Magical Kerala Backwaters',
    duration: '6 Days / 5 Nights',
    price: 24999,
    rating: 4.8,
    reviews: 245,
    locations: ['Kochi', 'Munnar', 'Thekkady', 'Alleppey'],
    highlights: [
      'Houseboat Stay in Alleppey',
      'Tea Gardens Tour',
      'Kathakali Performance',
      'Spice Plantation Visit',
      'Kerala Ayurveda Experience'
    ],
    inclusions: [
      '5-star Hotel Accommodation',
      'All Meals',
      'Private AC Vehicle',
      'Expert Guide',
      'All Transfers',
      'Sightseeing'
    ],
    activities: [
      'Backwater Cruise',
      'Wildlife Safari',
      'Cultural Shows',
      'Cooking Class'
    ],
    thumbnail: '🌴',
    startDates: ['2024-05-15', '2024-06-01', '2024-06-15']
  },
  {
    id: 'hp2',
    name: 'Royal Rajasthan Explorer',
    duration: '8 Days / 7 Nights',
    price: 34999,
    rating: 4.9,
    reviews: 312,
    locations: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer'],
    highlights: [
      'Palace Stay Experience',
      'Desert Safari',
      'Lake Palace Visit',
      'Traditional Dance Show',
      'Heritage Walk Tours'
    ],
    inclusions: [
      'Heritage Hotel Stay',
      'All Meals',
      'Luxury AC Vehicle',
      'Professional Guide',
      'Monument Entries',
      'Desert Camp Stay'
    ],
    activities: [
      'Camel Safari',
      'Folk Dance Show',
      'City Palace Tour',
      'Craft Workshops'
    ],
    thumbnail: '🏰',
    startDates: ['2024-05-20', '2024-06-10', '2024-06-25']
  },
  {
    id: 'hp3',
    name: 'Himalayan Adventure',
    duration: '7 Days / 6 Nights',
    price: 29999,
    rating: 4.7,
    reviews: 189,
    locations: ['Manali', 'Kasol', 'Tosh', 'Manikaran'],
    highlights: [
      'Snow Activities',
      'Hot Spring Visit',
      'Mountain Trekking',
      'Riverside Camping',
      'Local Culture Experience'
    ],
    inclusions: [
      'Luxury Camp Stay',
      'All Meals',
      'Transport',
      'Adventure Guide',
      'Safety Equipment',
      'Basic Medical Kit'
    ],
    activities: [
      'River Rafting',
      'Paragliding',
      'Nature Walks',
      'Bonfire Nights'
    ],
    thumbnail: '⛰️',
    startDates: ['2024-05-25', '2024-06-05', '2024-06-20']
  },
  {
    id: 'hp4',
    name: 'Goa Beach Paradise',
    duration: '5 Days / 4 Nights',
    price: 19999,
    rating: 4.6,
    reviews: 278,
    locations: ['North Goa', 'South Goa', 'Old Goa'],
    highlights: [
      'Beach Hopping',
      'Water Sports',
      'Portuguese Heritage',
      'Sunset Cruise',
      'Flea Market Visit'
    ],
    inclusions: [
      'Beach Resort Stay',
      'Breakfast & Dinner',
      'Airport Transfers',
      'Sightseeing',
      'Cruise Tickets',
      'Water Sports'
    ],
    activities: [
      'Scuba Diving',
      'Beach Parties',
      'Church Tours',
      'Spice Plantation'
    ],
    thumbnail: '🏖️',
    startDates: ['2024-05-10', '2024-05-25', '2024-06-08']
  },
  {
    id: 'hp5',
    name: 'Northeast Mystical Tour',
    duration: '9 Days / 8 Nights',
    price: 39999,
    rating: 4.8,
    reviews: 156,
    locations: ['Gangtok', 'Pelling', 'Darjeeling', 'Kalimpong'],
    highlights: [
      'Monastery Tours',
      'Tea Estate Visit',
      'Himalayan Railway',
      'Lake Excursions',
      'Local Tribal Visit'
    ],
    inclusions: [
      'Boutique Hotel Stay',
      'All Meals',
      'SUV Transport',
      'Local Guide',
      'Permits',
      'Welcome Kit'
    ],
    activities: [
      'Tea Tasting',
      'River Rafting',
      'Mountain Biking',
      'Cultural Shows'
    ],
    thumbnail: '🗻',
    startDates: ['2024-05-12', '2024-05-28', '2024-06-15']
  }
];

export const holyTrips = [
  {
    id: 1,
    title: "Vaishno Devi Yatra",
    location: "Jammu & Kashmir",
    imageUrl: "/images/religious/Vaishno Devi.jpg",
    startDate: "2024-04-15",
    endDate: "2024-04-19",
    duration: "5 Days",
    price: "₹12,999",
    religion: "Hindu",
    description: "A divine journey to the holy shrine of Mata Vaishno Devi, including helicopter service and VIP darshan.",
    highlights: [
      "VIP darshan pass",
      "Helicopter service available",
      "Accommodation in Katra",
      "Guide assistance"
    ]
  },
  {
    id: 2,
    title: "Golden Temple & Wagah",
    location: "Amritsar, Punjab",
    imageUrl: "/images/religious/Golden Temple.jpg",
    startDate: "2024-05-10",
    endDate: "2024-05-13",
    duration: "4 Days",
    price: "₹9,999",
    religion: "Sikh",
    description: "Experience the divine atmosphere of Golden Temple and the patriotic Wagah Border ceremony.",
    highlights: [
      "Langar seva participation",
      "Night ceremony viewing",
      "Heritage walk",
      "Local guide"
    ]
  },
  {
    id: 3,
    title: "Ajmer & Pushkar Yatra",
    location: "Rajasthan",
    imageUrl: "/images/religious/Ajmer & Pushkar.jpg",
    startDate: "2024-03-15",
    endDate: "2024-03-18",
    duration: "4 Days",
    price: "₹8,999",
    religion: "Muslim & Hindu",
    description: "Visit the revered Ajmer Sharif Dargah and the sacred Pushkar Lake temples.",
    highlights: [
      "Dargah visit",
      "Pushkar temple tour",
      "Camel safari",
      "Traditional food"
    ]
  },
  {
    id: 4,
    title: "Buddhist Circuit Tour",
    location: "Bihar & UP",
    imageUrl: "/images/religious/Buddhist Circuit.jpeg",
    startDate: "2024-04-01",
    endDate: "2024-04-07",
    duration: "7 Days",
    price: "₹22,999",
    religion: "Buddhist",
    description: "Follow Buddha's footsteps through Bodh Gaya, Sarnath, and other significant Buddhist sites.",
    highlights: [
      "Meditation sessions",
      "Temple visits",
      "Buddhist lectures",
      "Local monastery stay"
    ]
  }
];

export const adventureEvents = [
  {
    id: 1,
    title: "Manali Snow Trek",
    location: "Himachal Pradesh",
    imageUrl: "/images/adventure/Manali Snow Trek.jpeg",
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    duration: "6 Days",
    price: "₹18,999",
    category: "Trek",
    difficulty: "Moderate",
    description: "Experience the thrill of snow trekking in the beautiful Manali region.",
    highlights: [
      "Professional trek guide",
      "Camping equipment",
      "Basic training",
      "Snow activities"
    ]
  },
  {
    id: 2,
    title: "Goa New Year Bash",
    location: "Goa",
    imageUrl: "/images/adventure/Goa New Year Bash.png",
    startDate: "2023-12-30",
    endDate: "2024-01-02",
    duration: "4 Days",
    price: "₹22,999",
    category: "Party",
    difficulty: "Easy",
    description: "Welcome 2024 with the biggest beach party in Goa featuring top DJs and activities.",
    highlights: [
      "Beachfront resort",
      "Pool parties",
      "DJ nights",
      "Adventure sports"
    ]
  },
  {
    id: 3,
    title: "Rishikesh River Rafting Camp",
    location: "Uttarakhand",
    imageUrl: "/images/adventure/A-Complete-Tour-Guide-for-Rafting-in-Rishikesh.webp",
    startDate: "2024-03-15",
    endDate: "2024-03-18",
    duration: "4 Days",
    price: "₹12,999",
    category: "Adventure",
    difficulty: "Easy",
    description: "Experience white water rafting and camping by the Ganges in Rishikesh.",
    highlights: [
      "Professional rafting",
      "Luxury camping",
      "Bonfire nights",
      "Yoga sessions"
    ]
  },
  {
    id: 4,
    title: "Ladakh Bike Trip",
    location: "Ladakh",
    imageUrl: "/images/adventure/OIP.jpeg",
    startDate: "2024-07-10",
    endDate: "2024-07-20",
    duration: "11 Days",
    price: "₹35,999",
    category: "Adventure",
    difficulty: "Hard",
    description: "Epic motorcycle journey through the highest roads in the world.",
    highlights: [
      "Royal Enfield bikes",
      "Camping gear",
      "Support vehicle",
      "Experienced guide"
    ]
  },
  {
    id: 5,
    title: "Paragliding in Bir Billing",
    location: "Himachal Pradesh",
    imageUrl: "/images/adventure/Paragliding-in-India_1438933021_5FIJFm.avif",
    startDate: "2024-04-05",
    endDate: "2024-04-08",
    duration: "4 Days",
    price: "₹15,999",
    category: "Adventure",
    difficulty: "Moderate",
    description: "Soar through the skies in the paragliding capital of India.",
    highlights: [
      "Tandem flights",
      "Basic training",
      "Photography",
      "Camping"
    ]
  }
];
