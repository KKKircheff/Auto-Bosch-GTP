export const shadow1 = 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px';
export const shadow2 =
    'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px';

export const shadow3 = 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px';

export const BUSINESS_HOURS = {
    START: '08:30',
    END: '17:30',
} as const;

export const WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
export const SLOT_DURATION_MINUTES = 30;
export const MAX_BOOKING_WEEKS = 8;

export const CONTACT_INFO = {
    email: 'auto.bosch.gtp@gmail.com',
    phone: '+359 87 855 9905',
    address: '8001 Burgas',
    city: 'Бургас',
    country: 'България',
} as const;

export const PRICING = {
    car: 90,
    bus: 110,
    motorcycle: 60,
    taxi: 60,
    caravan: 60,
    trailer: 60,
    lpg: 100,
    onlineDiscount: 10,
} as const;

// Currency conversion rate (1 EUR = 1.95583 BGN)
export const EUR_TO_BGN_RATE = 1.95583;

export const CURRENCY_SYMBOLS = {
    BGN: 'лв',
    EUR: '€',
} as const;

export const VEHICLE_TYPES = {
    car: 'Лек автомобил',
    bus: 'Микробус до 3,5т',
    motorcycle: 'Мотоциклет',
    taxi: 'Такси',
    caravan: 'Каравана',
    trailer: 'Ремарке',
    lpg: 'Преглед газова инсталация',
} as const;

export type VehicleType = keyof typeof VEHICLE_TYPES;

export const TEXTS = {
    // Header
    siteName: 'Ауто Бош Сервиз Бургас',
    siteTagline: 'ГОДИШНИ ТЕХНИЧЕСКИ ПРЕГЛЕДИ',

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
    bookingDetails: 'Прегледай и потвърди',
    totalPrice: 'Обща цена',
    onlineDiscount: 'Отстъпка при онлайн записване',
    finalPrice: 'Крайна цена',

    // Admin
    adminLogin: 'Вход',
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

export const VEHICLE_BRANDS = [
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
    'BAIC',
    'BAW',
    'BMW',
    'BYD',
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
    'Други',
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
    'Днепр',
    'Иж',
    'Карпати',
    'Ковровец',
    'Мини мотоциклети',
    'Минск',
    'Поръчкови',
    'Рига',
    'Други',
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
    'Други',
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
    return vehicleType === 'car' || vehicleType === 'taxi' || vehicleType === 'bus';
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

// Currency conversion utilities
export const convertBgnToEur = (bgnAmount: number): number => {
    return Math.round((bgnAmount / EUR_TO_BGN_RATE) * 100) / 100;
};

export const convertEurToBgn = (eurAmount: number): number => {
    return Math.round((eurAmount * EUR_TO_BGN_RATE) * 100) / 100;
};

export const formatPrice = (amount: number, currency: 'BGN' | 'EUR' = 'BGN'): string => {
    const symbol = CURRENCY_SYMBOLS[currency];
    return `${amount.toFixed(2)} ${symbol}`;
};

export const formatDualPrice = (bgnAmount: number): string => {
    const eurAmount = convertBgnToEur(bgnAmount);
    return `${formatPrice(bgnAmount, 'BGN')} (${formatPrice(eurAmount, 'EUR')})`;
};

export const calculatePriceWithCurrencies = (vehicleType: VehicleType, isOnline: boolean = true) => {
    const priceCalc = calculatePrice(vehicleType, isOnline);
    
    return {
        basePrice: priceCalc.basePrice,
        basePriceEur: convertBgnToEur(priceCalc.basePrice),
        discount: priceCalc.discount,
        discountEur: convertBgnToEur(priceCalc.discount),
        finalPrice: priceCalc.finalPrice,
        finalPriceEur: convertBgnToEur(priceCalc.finalPrice),
        basePriceFormatted: formatDualPrice(priceCalc.basePrice),
        discountFormatted: formatDualPrice(priceCalc.discount),
        finalPriceFormatted: formatDualPrice(priceCalc.finalPrice),
    };
};
