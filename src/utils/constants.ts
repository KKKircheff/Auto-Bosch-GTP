// Havenly-style soft shadows
// export const shadow1 = '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.4)';
export const shadow1 = 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px';
export const shadow2 = '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)';
export const shadow3 = '0 2px 4px rgba(0, 0, 0, 0.08)';
export const shadow4 = 'rgba(0, 0, 0, 0.10) 0px 14px 28px, rgba(0, 0, 0, 0.10) 0px 10px 10px';

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

// All prices in EUR (Euro)
export const PRICING = {
    car: 46,
    bus: 56,
    motorcycle: 31,
    taxi: 31,
    caravan: 31,
    trailer: 31,
    lpg: 51,
    onlineDiscount: 5,
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
    return Math.round(eurAmount * EUR_TO_BGN_RATE * 100) / 100;
};

export const formatPrice = (amount: number, currency: 'BGN' | 'EUR' = 'EUR'): string => {
    const symbol = CURRENCY_SYMBOLS[currency];
    return `${amount.toFixed(2)} ${symbol}`;
};

export const formatDualPrice = (eurAmount: number): string => {
    const bgnAmount = convertEurToBgn(eurAmount);
    return `${formatPrice(eurAmount, 'EUR')} (${formatPrice(bgnAmount, 'BGN')})`;
};

export const calculatePriceWithCurrencies = (vehicleType: VehicleType, isOnline: boolean = true) => {
    const priceCalc = calculatePrice(vehicleType, isOnline);

    return {
        basePrice: priceCalc.basePrice,
        basePriceBgn: convertEurToBgn(priceCalc.basePrice),
        discount: priceCalc.discount,
        discountBgn: convertEurToBgn(priceCalc.discount),
        finalPrice: priceCalc.finalPrice,
        finalPriceBgn: convertEurToBgn(priceCalc.finalPrice),
        basePriceFormatted: formatDualPrice(priceCalc.basePrice),
        discountFormatted: formatDualPrice(priceCalc.discount),
        finalPriceFormatted: formatDualPrice(priceCalc.finalPrice),
    };
};

// Dynamic pricing functions that accept custom pricing configuration
// These are used when pricing is managed in Firebase and needs to be passed in
export const calculatePriceFromSettings = (
    vehicleType: VehicleType,
    prices: Record<VehicleType, number>,
    discount: number,
    isOnline: boolean = true
) => {
    const basePrice = prices[vehicleType];
    const discountAmount = isOnline ? discount : 0;
    return {
        basePrice,
        discount: discountAmount,
        finalPrice: basePrice - discountAmount,
    };
};

export const calculatePriceWithCurrenciesFromSettings = (
    vehicleType: VehicleType,
    prices: Record<VehicleType, number>,
    discount: number,
    isOnline: boolean = true
) => {
    const priceCalc = calculatePriceFromSettings(vehicleType, prices, discount, isOnline);

    return {
        basePrice: priceCalc.basePrice,
        basePriceBgn: convertEurToBgn(priceCalc.basePrice),
        discount: priceCalc.discount,
        discountBgn: convertEurToBgn(priceCalc.discount),
        finalPrice: priceCalc.finalPrice,
        finalPriceBgn: convertEurToBgn(priceCalc.finalPrice),
        basePriceFormatted: formatDualPrice(priceCalc.basePrice),
        discountFormatted: formatDualPrice(priceCalc.discount),
        finalPriceFormatted: formatDualPrice(priceCalc.finalPrice),
    };
};
