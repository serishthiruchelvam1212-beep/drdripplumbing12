export const SERVICE_OPTIONS = [
  { value: 'drain_cleaning', label: 'Drain cleaning' },
  { value: 'leak_repair', label: 'Leak repair' },
  { value: 'toilet_service', label: 'Toilet service' },
  { value: 'faucet_fixture_service', label: 'Faucet or fixture service' },
  { value: 'pipe_repair', label: 'Pipe repair' },
  { value: 'water_heater_service', label: 'Water heater service' },
  { value: 'sump_pump_service', label: 'Sump pump service' },
  { value: 'sewer_service', label: 'Sewer service' },
  { value: 'kitchen_plumbing', label: 'Kitchen plumbing' },
  { value: 'bathroom_plumbing', label: 'Bathroom plumbing' },
  { value: 'commercial_plumbing', label: 'Commercial plumbing' },
  { value: 'inspection_maintenance', label: 'Inspection or maintenance' },
  { value: 'other', label: 'Other' },
] as const;

export const TIME_WINDOW_OPTIONS = [
  { value: 'morning', label: 'Morning (8am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 4pm)' },
  { value: 'evening', label: 'Evening (4pm - 7pm)' },
  { value: 'flexible', label: 'Flexible / any time' },
] as const;

export const URGENCY_OPTIONS = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'asap', label: 'As soon as possible' },
  { value: 'few_days', label: 'Within a few days' },
  { value: 'flexible', label: 'Flexible' },
] as const;

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export interface ServiceRequestFormData {
  fullName: string;
  phone: string;
  email: string;
  serviceAddress: string;
  city: string;
  postalCode: string;
  serviceType: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  urgency: string;
  contactPermission: boolean;
  photoPath: string | null;
}

export interface QuoteRequestFormData {
  fullName: string;
  phone: string;
  email: string;
  postalCode: string;
  serviceType: string;
  description: string;
  contactPermission: boolean;
  photoPath: string | null;
}
