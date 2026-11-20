import { VsmsDatabaseState } from '../types';

export const STORAGE_KEY = 'vsms_database_v1';
export const SESSION_KEY = 'vsms_session_user_id';

export const SERVICE_STAGES = [
  'Booking Confirmed',
  'Vehicle Received',
  'Service In Progress',
  'Ready for Delivery',
  'Completed',
] as const;

export const INITIAL_DATABASE: VsmsDatabaseState = {
  users: [
    {
      userId: 1,
      fullName: 'Vikram Mehta (Workshop Admin)',
      email: 'admin@apexdrive.com',
      phone: '+1 (555) 201-8800',
      password: 'Admin@123',
      role: 'ADMIN',
      createdAt: '2026-10-01T09:00:00Z',
    },
    {
      userId: 2,
      fullName: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+1 (555) 392-1140',
      password: 'Customer@123',
      role: 'CUSTOMER',
      createdAt: '2026-10-12T11:20:00Z',
    },
    {
      userId: 3,
      fullName: 'Priya Nair',
      email: 'priya@example.com',
      phone: '+1 (555) 488-7732',
      password: 'Customer@123',
      role: 'CUSTOMER',
      createdAt: '2026-10-18T14:45:00Z',
    },
  ],
  services: [
    {
      serviceId: 1,
      serviceName: 'General Service',
      description: 'Multi-point inspection, fluid top-ups, filter checks, and diagnostic road test.',
      basePrice: 149.0,
      estimatedHours: 3.0,
      isActive: true,
    },
    {
      serviceId: 2,
      serviceName: 'Oil Change',
      description: 'Full synthetic motor oil drain and refill with OEM oil filter replacement.',
      basePrice: 79.0,
      estimatedHours: 1.0,
      isActive: true,
    },
    {
      serviceId: 3,
      serviceName: 'Engine Repair',
      description: 'OBD-II diagnostics, timing calibration, gasket service, and powertrain repair.',
      basePrice: 320.0,
      estimatedHours: 6.0,
      isActive: true,
    },
    {
      serviceId: 4,
      serviceName: 'Brake Service',
      description: 'Brake pad replacement, ventilated rotor resurfacing, and hydraulic fluid bleed.',
      basePrice: 185.0,
      estimatedHours: 2.5,
      isActive: true,
    },
    {
      serviceId: 5,
      serviceName: 'Battery Replacement',
      description: 'Cranking load test, terminal cleaning, and AGM/lithium battery installation.',
      basePrice: 160.0,
      estimatedHours: 1.0,
      isActive: true,
    },
    {
      serviceId: 6,
      serviceName: 'Tyre Service',
      description: 'Laser wheel alignment, dynamic balancing, four-corner rotation, and tread check.',
      basePrice: 95.0,
      estimatedHours: 1.5,
      isActive: true,
    },
    {
      serviceId: 7,
      serviceName: 'AC Repair',
      description: 'Refrigerant recovery and recharge, compressor clutch test, and cabin filter swap.',
      basePrice: 135.0,
      estimatedHours: 2.0,
      isActive: true,
    },
    {
      serviceId: 8,
      serviceName: 'Full Vehicle Inspection',
      description: 'Comprehensive 80-point safety, emissions, and chassis suspension diagnostic report.',
      basePrice: 110.0,
      estimatedHours: 2.0,
      isActive: true,
    },
  ],
  vehicles: [
    {
      vehicleId: 1,
      userId: 2,
      registrationNumber: 'CA-09-AX-4421',
      brand: 'Toyota',
      model: 'Camry Hybrid',
      vehicleType: 'Sedan',
      manufacturingYear: 2022,
      createdAt: '2026-10-12T11:30:00Z',
    },
    {
      vehicleId: 2,
      userId: 2,
      registrationNumber: 'CA-09-BX-8810',
      brand: 'Ford',
      model: 'Explorer XLT',
      vehicleType: 'SUV',
      manufacturingYear: 2021,
      createdAt: '2026-10-15T10:15:00Z',
    },
    {
      vehicleId: 3,
      userId: 3,
      registrationNumber: 'NY-14-EV-3109',
      brand: 'Hyundai',
      model: 'Ioniq 5',
      vehicleType: 'Electric/Hybrid',
      manufacturingYear: 2023,
      createdAt: '2026-10-18T15:00:00Z',
    },
  ],
  bookings: [
    {
      bookingId: 1,
      bookingCode: 'VSMS-1001',
      userId: 2,
      vehicleId: 1,
      serviceId: 4,
      preferredDate: '2026-11-10',
      problemDescription: 'Squeaking sound on front brakes during low-speed stops.',
      status: 'Completed',
      adminRemarks: 'Replaced front ceramic brake pads and bled hydraulic brake lines.',
      createdAt: '2026-11-08T09:15:00Z',
    },
    {
      bookingId: 2,
      bookingCode: 'VSMS-1002',
      userId: 2,
      vehicleId: 2,
      serviceId: 1,
      preferredDate: '2026-11-18',
      problemDescription: '60,000 km scheduled periodic maintenance and wheel alignment check.',
      status: 'Service In Progress',
      adminRemarks: 'Bay 3 technician inspecting suspension bushings and replacing cabin air filter.',
      createdAt: '2026-11-16T14:20:00Z',
    },
    {
      bookingId: 3,
      bookingCode: 'VSMS-1003',
      userId: 3,
      vehicleId: 3,
      serviceId: 8,
      preferredDate: '2026-11-20',
      problemDescription: 'Annual pre-winter safety and high-voltage battery thermal inspection.',
      status: 'Booking Confirmed',
      adminRemarks: 'Assigned to EV diagnostic bay for morning intake.',
      createdAt: '2026-11-17T08:40:00Z',
    },
  ],
  payments: [
    {
      paymentId: 1,
      bookingId: 1,
      invoiceNumber: 'INV-2026-1001',
      serviceCharge: 185.0,
      additionalCharges: 35.0,
      taxAmount: 22.0,
      totalAmount: 242.0,
      paymentStatus: 'Paid',
      paymentMethod: 'Simulated Card',
      paidAt: '2026-11-10T16:30:00Z',
    },
    {
      paymentId: 2,
      bookingId: 2,
      invoiceNumber: 'INV-2026-1002',
      serviceCharge: 149.0,
      additionalCharges: 45.0,
      taxAmount: 19.4,
      totalAmount: 213.4,
      paymentStatus: 'Pending',
      paymentMethod: 'Pending',
      paidAt: null,
    },
    {
      paymentId: 3,
      bookingId: 3,
      invoiceNumber: 'INV-2026-1003',
      serviceCharge: 110.0,
      additionalCharges: 0.0,
      taxAmount: 11.0,
      totalAmount: 121.0,
      paymentStatus: 'Pending',
      paymentMethod: 'Pending',
      paidAt: null,
    },
  ],
  serviceHistory: [
    {
      historyId: 1,
      bookingId: 1,
      userId: 2,
      vehicleId: 1,
      serviceId: 4,
      serviceDate: '2026-11-10',
      finalCost: 242.0,
      status: 'Completed',
      technicianNotes: 'Front ceramic pads installed; rotor thickness verified within OEM tolerance.',
      recordedAt: '2026-11-10T16:35:00Z',
    },
  ],
};

export function loadDatabase(): VsmsDatabaseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
      return INITIAL_DATABASE;
    }
    return JSON.parse(raw) as VsmsDatabaseState;
  } catch {
    return INITIAL_DATABASE;
  }
}

export function saveDatabase(db: VsmsDatabaseState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}
