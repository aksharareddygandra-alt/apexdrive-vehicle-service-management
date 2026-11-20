export type UserRole = 'CUSTOMER' | 'ADMIN';

export type VehicleType =
  | 'Sedan'
  | 'SUV'
  | 'Hatchback'
  | 'Truck'
  | 'Motorcycle'
  | 'Electric/Hybrid';

export type BookingStatus =
  | 'Booking Confirmed'
  | 'Vehicle Received'
  | 'Service In Progress'
  | 'Ready for Delivery'
  | 'Completed'
  | 'Rejected';

export type PaymentStatus = 'Pending' | 'Paid';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface Vehicle {
  vehicleId: number;
  userId: number;
  registrationNumber: string;
  brand: string;
  model: string;
  vehicleType: VehicleType;
  manufacturingYear: number;
  createdAt: string;
}

export interface ServiceCategory {
  serviceId: number;
  serviceName: string;
  description: string;
  basePrice: number;
  estimatedHours: number;
  isActive: boolean;
}

export interface Booking {
  bookingId: number;
  bookingCode: string;
  userId: number;
  vehicleId: number;
  serviceId: number;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  adminRemarks: string;
  createdAt: string;
}

export interface Payment {
  paymentId: number;
  bookingId: number;
  invoiceNumber: string;
  serviceCharge: number;
  additionalCharges: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paidAt: string | null;
}

export interface ServiceHistoryRecord {
  historyId: number;
  bookingId: number;
  userId: number;
  vehicleId: number;
  serviceId: number;
  serviceDate: string;
  finalCost: number;
  status: string;
  technicianNotes: string;
  recordedAt: string;
}

export interface VsmsDatabaseState {
  users: User[];
  vehicles: Vehicle[];
  services: ServiceCategory[];
  bookings: Booking[];
  payments: Payment[];
  serviceHistory: ServiceHistoryRecord[];
}
