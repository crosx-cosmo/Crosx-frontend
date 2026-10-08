export type Country = {
  code: string;
  name: string;
  flag: string;
  dial: string;
};

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", dial: "+91" },
  { code: "US", name: "United States", flag: "🇺🇸", dial: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", dial: "+971" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", dial: "+65" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dial: "+61" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dial: "+1" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dial: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dial: "+33" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dial: "+31" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", dial: "+62" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", dial: "+63" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dial: "+55" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dial: "+27" },
];

/** State → cities, grouped per country code. */
export const REGIONS: Record<string, Record<string, string[]>> = {
  IN: {
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
    Delhi: ["New Delhi", "Dwarka", "Rohini", "Saket"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur"],
    Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
    "Uttar Pradesh": ["Lucknow", "Noida", "Kanpur", "Varanasi"],
    Punjab: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar"],
  },
  US: {
    California: ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
    "New York": ["New York City", "Buffalo", "Albany", "Rochester"],
    Texas: ["Austin", "Dallas", "Houston", "San Antonio"],
    Florida: ["Miami", "Orlando", "Tampa", "Jacksonville"],
    Illinois: ["Chicago", "Naperville", "Springfield"],
  },
  GB: {
    England: ["London", "Manchester", "Birmingham", "Leeds"],
    Scotland: ["Edinburgh", "Glasgow", "Aberdeen"],
    Wales: ["Cardiff", "Swansea", "Newport"],
    "Northern Ireland": ["Belfast", "Derry"],
  },
  AE: {
    Dubai: ["Dubai", "Jebel Ali", "Deira"],
    "Abu Dhabi": ["Abu Dhabi", "Al Ain"],
    Sharjah: ["Sharjah", "Khor Fakkan"],
  },
  SG: {
    "Central Region": ["Singapore", "Orchard", "Marina Bay"],
    "East Region": ["Bedok", "Tampines", "Changi"],
    "West Region": ["Jurong", "Clementi", "Tuas"],
  },
  AU: {
    "New South Wales": ["Sydney", "Newcastle", "Wollongong"],
    Victoria: ["Melbourne", "Geelong", "Ballarat"],
    Queensland: ["Brisbane", "Gold Coast", "Cairns"],
  },
  CA: {
    Ontario: ["Toronto", "Ottawa", "Hamilton"],
    "British Columbia": ["Vancouver", "Victoria", "Kelowna"],
    Quebec: ["Montreal", "Quebec City", "Laval"],
  },
  DE: {
    Bavaria: ["Munich", "Nuremberg", "Augsburg"],
    Berlin: ["Berlin"],
    "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund"],
  },
  FR: {
    "Île-de-France": ["Paris", "Versailles", "Boulogne-Billancourt"],
    "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Toulon"],
    "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble", "Saint-Étienne"],
  },
  NL: {
    "North Holland": ["Amsterdam", "Haarlem", "Zaanstad"],
    "South Holland": ["Rotterdam", "The Hague", "Leiden"],
    "North Brabant": ["Eindhoven", "Tilburg", "Breda"],
  },
  ID: {
    Jakarta: ["Central Jakarta", "South Jakarta", "West Jakarta"],
    "West Java": ["Bandung", "Bekasi", "Depok"],
    "East Java": ["Surabaya", "Malang", "Sidoarjo"],
  },
  PH: {
    "Metro Manila": ["Manila", "Quezon City", "Makati"],
    Cebu: ["Cebu City", "Mandaue", "Lapu-Lapu"],
    Davao: ["Davao City", "Tagum"],
  },
  BR: {
    "São Paulo": ["São Paulo", "Campinas", "Santos"],
    "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Petrópolis"],
    "Minas Gerais": ["Belo Horizonte", "Uberlândia"],
  },
  ZA: {
    Gauteng: ["Johannesburg", "Pretoria", "Soweto"],
    "Western Cape": ["Cape Town", "Stellenbosch", "Paarl"],
    "KwaZulu-Natal": ["Durban", "Pietermaritzburg"],
  },
};

export function statesOf(countryCode?: string) {
  if (!countryCode) return [];
  return Object.keys(REGIONS[countryCode] ?? {});
}

export function citiesOf(countryCode?: string, state?: string) {
  if (!countryCode || !state) return [];
  return REGIONS[countryCode]?.[state] ?? [];
}
