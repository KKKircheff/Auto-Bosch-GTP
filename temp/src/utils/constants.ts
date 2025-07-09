// src/utils/constants.ts

// Business hours and scheduling
export const BUSINESS_HOURS = {
    START: '08:30',
    END: '17:30',
} as const;

export const WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
export const SLOT_DURATION_MINUTES = 30;
export const MAX_BOOKING_WEEKS = 8;

// Contact information for the garage in Bourgas
export const CONTACT_INFO = {
    email: 'autocare@bourgas.bg',
    phone: '+359888123456',
    address: 'Бургас, ул. Автосервизна 15',
    city: 'Бургас',
    country: 'България',
} as const;

// Pricing in Bulgarian Leva (лв) with online discount
export const PRICING = {
    car: 90, // ЛЕКА КОЛА
    bus: 110, // Микробус до 3,5т
    motorcycle: 60, // Мотор
    taxi: 60, // Такси
    caravan: 60, // Каравана
    trailer: 60, // Ремарке (renamed from hanger)
    lpg: 100, // Преглед оразполагаем газ (updated price)
    onlineDiscount: 10, // При онлайн записване 10 лв отстъпка
} as const;

// Vehicle types with Bulgarian labels
export const VEHICLE_TYPES = {
    car: 'Лека кола',
    bus: 'Микробус до 3,5т',
    motorcycle: 'Мотор',
    taxi: 'Такси',
    caravan: 'Каравана',
    trailer: 'Ремарке',
    lpg: 'Преглед оразполагаем газ',
} as const;

export type VehicleType = keyof typeof VEHICLE_TYPES;

// Bulgarian text constants
export const TEXTS = {
    // Header
    siteName: 'AutoCare Бургас',
    siteTagline: 'Професионален технически преглед на МПС',

    // Navigation
    services: 'Услуги',
    pricing: 'Цени',
    contact: 'Контакти',
    bookAppointment: 'Запази час',

    // Booking form
    bookingTitle: 'Запазете час за технически преглед',
    bookingSubtitle: 'Изберете дата и час, който ви устройва',

    // Form fields
    registrationPlate: 'Регистрационен номер',
    registrationPlateRequired: 'Регистрационният номер е задължителен',
    phoneNumber: 'Телефонен номер',
    phoneNumberRequired: 'Телефонният номер е задължителен',
    email: 'Имейл адрес',
    emailOptional: 'Имейл адрес (по желание)',
    customerName: 'Име и фамилия',
    customerNameRequired: 'Името е задължително',
    vehicleType: 'Тип превозно средство',
    vehicleTypeRequired: 'Моля изберете тип превозно средство',
    vehicleBrand: 'Марка',
    vehicleBrandOptional: 'Марка (по желание)',
    is4x4: '4x4',

    // Calendar
    availableTimes: 'Свободни часове',
    selectDate: 'Изберете дата',
    selectTime: 'Изберете час',

    // Booking confirmation
    confirmBooking: 'Потвърди записването',
    bookingConfirmed: 'Записването е потвърдено!',
    bookingDetails: 'Детайли на записването',
    totalPrice: 'Обща цена',
    onlineDiscount: 'Отстъпка при онлайн записване',
    finalPrice: 'Крайна цена',

    // Admin
    adminLogin: 'Вход за администратор',
    adminDashboard: 'Администраторски панел',
    appointments: 'Записвания',
    login: 'Вход',
    logout: 'Изход',
    cancel: 'Отказ',

    // Status
    confirmed: 'Потвърден',
    cancelled: 'Отказан',

    // Messages
    bookingSuccess: 'Записването е успешно! Ще получите потвърждение на имейл.',
    bookingError: 'Възникна грешка при записването. Моля опитайте отново.',
    loginError: 'Грешка при влизане. Проверете данните си.',

    // Validation
    invalidPhone: 'Невалиден телефонен номер',
    invalidEmail: 'Невалиден имейл адрес',
    invalidRegistrationPlate: 'Невалиден регистрационен номер',

    // Days of week
    days: {
        monday: 'Понеделник',
        tuesday: 'Вторник',
        wednesday: 'Сряда',
        thursday: 'Четвъртък',
        friday: 'Петък',
        saturday: 'Събота',
        sunday: 'Неделя',
    },

    // Months
    months: {
        january: 'Януари',
        february: 'Февруари',
        march: 'Март',
        april: 'Април',
        may: 'Май',
        june: 'Юни',
        july: 'Юли',
        august: 'Август',
        september: 'Септември',
        october: 'Октомври',
        november: 'Ноември',
        december: 'Декември',
    },
} as const;

// Vehicle brands arrays (keeping existing brands from original file)
export const VEHICLE_BRANDS = [
    'BAIC',
    'BAW',
    'BMW',
    'BYD',
    'AC',
    'Abarth',
    'Acura',
    'Aixam',
    'Alfa Romeo',
    'Alpina',
    'Aro',
    'Asia',
    'Aston Martin',
    'Audi',
    'Austin',
    'Bentley',
    'Bertone',
    'Brilliance',
    'Buick',
    'Cadillac',
    'Carbodies',
    'Changan',
    'Chery',
    'Chevrolet',
    'Chrysler',
    'Citroen',
    'Corvette',
    'Cupra',
    'DFSK',
    'DONGFENG',
    'DR Automobiles',
    'DS',
    'Dacia',
    'Daewoo',
    'Daihatsu',
    'Daimler',
    'Datsun',
    'Dkw',
    'Dodge',
    'Dr',
    'Други',
    'Ferrari',
    'Fiat',
    'Ford',
    'Foton',
    'GOUPIL',
    'GWM',
    'Gaz',
    'Geely',
    'Genesis',
    'Gmc',
    'Gonow',
    'Great Wall',
    'Haval',
    'Honda',
    'HongQi',
    'Hummer',
    'Hyundai',
    'Ifa',
    'Ineos Grenadier',
    'Infiniti',
    'Isuzu',
    'Iveco',
    'JAC',
    'Jaguar',
    'Jeep',
    'Kia',
    'Lada',
    'Lamborghini',
    'Lancia',
    'Land Rover',
    'Landwind',
    'Lexus',
    'Lincoln',
    'Lotus',
    'LynkCo',
    'Mahindra',
    'Maserati',
    'Maybach',
    'Mazda',
    'McLaren',
    'Mercedes-Benz',
    'Mercury',
    'Mg',
    'Microcar',
    'Microlino',
    'Mini',
    'Mitsubishi',
    'Morgan',
    'Moskvich',
    'Nissan',
    'Oldsmobile',
    'Opel',
    'Peugeot',
    'Plymouth',
    'Polestar',
    'Pontiac',
    'Porsche',
    'Renault',
    'Rolls-Royce',
    'Rover',
    'SECMA',
    'SIN CARS',
    'SWM',
    'Saab',
    'Scion',
    'Seat',
    'Seres',
    'Shuanghuan',
    'Simca',
    'Skoda',
    'Smart',
    'SsangYong',
    'Subaru',
    'Suzuki',
    'Talbot',
    'Tata',
    'Tazzari',
    'Tesla',
    'Toyota',
    'Trabant',
    'Triumph',
    'Uaz',
    'VW',
    'Volga',
    'Volvo',
    'Voyah',
    'Warszawa',
    'Wartburg',
    'Wey',
    'Zaz',
] as const;

export const MOTORCYCLE_BRANDS = [
    'ADLI',
    'Aeon',
    'American Ironhorse',
    'Aprilia',
    'Arctic Cat',
    'Argo',
    'Askoll',
    'Awo',
    'BMW',
    'BRP',
    'Balkan',
    'Baotian',
    'Barton',
    'Bashan',
    'Benelli',
    'Benzhou',
    'Beta',
    'Big Dog',
    'Bombardier',
    'Boss Hoss',
    'Brixton',
    'Buell',
    'Buyang',
    'Cagiva',
    'Can-Am',
    'Cfmoto',
    'Cpi',
    'Cz',
    'Daelim',
    'Daytona',
    'Derbi',
    'Dinli',
    'Ducati',
    'Etz',
    'FB Mondial',
    'Falcon',
    'Fantic',
    'GASGAS',
    'Garelli',
    'Generic',
    'Gilera',
    'Go-ped',
    'HISUN',
    'Hanway',
    'Harley-Davidson',
    'Honda',
    'Horwin',
    'Husaberg',
    'Husqvarna',
    'Hyosung',
    'Indian',
    'Italjet',
    'Jawa',
    'Jinlun',
    'Jonway',
    'KSR',
    'Kawasaki',
    'Keeway',
    'Kinetic',
    'Ktm',
    'Kymco',
    'La Souris',
    'Lambreta',
    'Lexmoto',
    'Lifan',
    'Ligier',
    'Linhai',
    'Lynx',
    'MV Agusta',
    'Malaguti',
    'Mbk',
    'Moto Guzzi',
    'Moto Morini',
    'MotorHispania',
    'Motoretta',
    'Mz',
    'NIU',
    'Orcal',
    'Peugeot',
    'Piaggio',
    'Polaris',
    'Puch',
    'QJMotor',
    'Qingqi',
    'Quadro',
    'Revolt',
    'Rieju',
    'Romet',
    'Royal Enfield',
    'Sachs',
    'Segway Powersports',
    'Sherco',
    'Shineray',
    'Silence',
    'Simson',
    'Ski-Doo',
    'Stark',
    'Sunsto',
    'Super Soco',
    'Surron',
    'Suzuki',
    'Swm',
    'Sym',
    'Telstar',
    'Tgb',
    'Tm',
    'Tomos',
    'Triumph',
    'VROMOS',
    'Vespa',
    'Victory',
    'Voge',
    'Volta',
    'Wt',
    'XGJao',
    'Xingyue',
    'Yamaha',
    'Yawa',
    'Zero',
    'Znen',
    'Zongshen',
    'Zontes',
    'Zundapp',
    'iO Scooter',
    'Други',
    'Днепр',
    'Иж',
    'Карпати',
    'Ковровец',
    'Мини мотоциклети',
    'Минск',
    'Поръчкови',
    'Рига',
] as const;

export const BUS_BRANDS = [
    'Avia',
    'Ayats',
    'BMC',
    'BYD',
    'Barkas',
    'Bedford',
    'Bova',
    'Chavdar',
    'Chevrolet',
    'Citroen',
    'Daewoo',
    'DONGFENG',
    'Fiat',
    'Ford',
    'Gaz',
    'Gmc',
    'Hyundai',
    'Ikarus',
    'Irizar',
    'Isuzu',
    'Iveco',
    'Jonckheere',
    'Karsan',
    'Kia',
    'King Long',
    'L CITY',
    'LDV',
    'Man',
    'Mazda',
    'Mercedes-Benz',
    'Mitsubishi',
    'Neoplan',
    'Nissan',
    'Opel',
    'Otokar',
    'Peugeot',
    'Piaggio',
    'Renault',
    'Robur',
    'Scania',
    'Setra',
    'Solaris',
    'Suzuki',
    'VW',
] as const;

// Helper functions
export const getVehicleBrands = (vehicleType: VehicleType) => {
    switch (vehicleType) {
        case 'car':
        case 'taxi':
            return VEHICLE_BRANDS;
        case 'bus':
            return BUS_BRANDS;
        case 'motorcycle':
            return MOTORCYCLE_BRANDS;
        default:
            return [];
    }
};

export const shouldShow4x4 = (vehicleType: VehicleType) => {
    return vehicleType === 'car' || vehicleType === 'taxi';
};

export const shouldShowBrands = (vehicleType: VehicleType) => {
    return ['car', 'taxi', 'bus', 'motorcycle'].includes(vehicleType);
};

export const calculatePrice = (vehicleType: VehicleType, isOnline: boolean = true) => {
    const basePrice = PRICING[vehicleType];
    const discount = isOnline ? PRICING.onlineDiscount : 0;
    return {
        basePrice,
        discount,
        finalPrice: basePrice - discount,
    };
};
