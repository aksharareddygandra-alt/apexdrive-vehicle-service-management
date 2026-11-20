import { useState, useEffect } from 'react';
import {
  Booking,
  BookingStatus,
  PaymentStatus,
  User,
  Vehicle,
  VsmsDatabaseState,
} from './types';
import {
  loadDatabase,
  saveDatabase,
  SESSION_KEY,
} from './data/seedData';
import { HomeView } from './components/HomeView';
import { LoginView, RegisterView } from './components/AuthViews';
import { TrackServiceView } from './components/TrackServiceView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { InvoiceModal } from './components/InvoiceModal';
import { PblDocsView } from './components/PblDocsView';

type AppView = 'home' | 'login' | 'register' | 'track' | 'customer' | 'admin' | 'docs';

export default function App() {
  const [db, setDb] = useState<VsmsDatabaseState>(() => loadDatabase());
  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? Number(saved) : null;
  });
  const [view, setView] = useState<AppView>('home');
  const [trackInitialCode, setTrackInitialCode] = useState('VSMS-1002');
  const [invoiceBookingId, setInvoiceBookingId] = useState<number | null>(null);

  useEffect(() => {
    saveDatabase(db);
  }, [db]);

  const currentUser: User | null =
    currentUserId !== null
      ? db.users.find((u) => u.userId === currentUserId) || null
      : null;

  const handleLogin = (email: string, password: string) => {
    const found = db.users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!found) {
      return { ok: false, error: 'Invalid email or password. Please check your credentials.' };
    }
    setCurrentUserId(found.userId);
    localStorage.setItem(SESSION_KEY, String(found.userId));
    setView(found.role === 'ADMIN' ? 'admin' : 'customer');
    return { ok: true };
  };

  const handleRegister = (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const exists = db.users.some(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (exists) {
      return { ok: false, error: 'An account with this email address already exists.' };
    }
    const nextId = db.users.reduce((max, u) => Math.max(max, u.userId), 0) + 1;
    const newUser: User = {
      userId: nextId,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      password: data.password,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
    setDb((prev) => ({ ...prev, users: [...prev.users, newUser] }));
    return { ok: true };
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    localStorage.removeItem(SESSION_KEY);
    setView('home');
  };

  const handleAddVehicle = (v: Omit<Vehicle, 'vehicleId' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return { ok: false, error: 'Session expired.' };
    const duplicate = db.vehicles.some(
      (item) => item.registrationNumber.toUpperCase() === v.registrationNumber.toUpperCase()
    );
    if (duplicate) {
      return {
        ok: false,
        error: `Registration number ${v.registrationNumber} is already registered.`,
      };
    }
    const nextId = db.vehicles.reduce((max, item) => Math.max(max, item.vehicleId), 0) + 1;
    const newVehicle: Vehicle = {
      ...v,
      vehicleId: nextId,
      userId: currentUser.userId,
      createdAt: new Date().toISOString(),
    };
    setDb((prev) => ({ ...prev, vehicles: [newVehicle, ...prev.vehicles] }));
    return { ok: true };
  };

  const handleUpdateVehicle = (updated: Vehicle) => {
    const duplicate = db.vehicles.some(
      (item) =>
        item.vehicleId !== updated.vehicleId &&
        item.registrationNumber.toUpperCase() === updated.registrationNumber.toUpperCase()
    );
    if (duplicate) {
      return {
        ok: false,
        error: `Registration number ${updated.registrationNumber} belongs to another vehicle.`,
      };
    }
    setDb((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((v) => (v.vehicleId === updated.vehicleId ? updated : v)),
    }));
    return { ok: true };
  };

  const handleDeleteVehicle = (vehicleId: number) => {
    setDb((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((v) => v.vehicleId !== vehicleId),
    }));
  };

  const handleCreateBooking = (data: {
    vehicleId: number;
    serviceId: number;
    preferredDate: string;
    problemDescription: string;
  }) => {
    if (!currentUser) return { ok: false, error: 'Please sign in first.' };
    const service = db.services.find((s) => s.serviceId === data.serviceId);
    if (!service) return { ok: false, error: 'Selected service category not found.' };

    const nextBookingId = db.bookings.reduce((max, b) => Math.max(max, b.bookingId), 0) + 1;
    const bookingCode = `VSMS-${1000 + nextBookingId}`;
    const nextPaymentId = db.payments.reduce((max, p) => Math.max(max, p.paymentId), 0) + 1;
    const invoiceNumber = `INV-2026-${1000 + nextBookingId}`;

    const newBooking: Booking = {
      bookingId: nextBookingId,
      bookingCode,
      userId: currentUser.userId,
      vehicleId: data.vehicleId,
      serviceId: data.serviceId,
      preferredDate: data.preferredDate,
      problemDescription: data.problemDescription.trim(),
      status: 'Booking Confirmed',
      adminRemarks: 'Booking confirmed and queued for workshop intake.',
      createdAt: new Date().toISOString(),
    };

    const taxAmount = Number((service.basePrice * 0.1).toFixed(2));
    const totalAmount = Number((service.basePrice + taxAmount).toFixed(2));

    setDb((prev) => ({
      ...prev,
      bookings: [newBooking, ...prev.bookings],
      payments: [
        ...prev.payments,
        {
          paymentId: nextPaymentId,
          bookingId: nextBookingId,
          invoiceNumber,
          serviceCharge: service.basePrice,
          additionalCharges: 0,
          taxAmount,
          totalAmount,
          paymentStatus: 'Pending',
          paymentMethod: 'Pending',
          paidAt: null,
        },
      ],
    }));

    return { ok: true, bookingCode };
  };

  const handleSimulatePayment = (bookingId: number, method: string) => {
    setDb((prev) => ({
      ...prev,
      payments: prev.payments.map((p) =>
        p.bookingId === bookingId
          ? {
              ...p,
              paymentStatus: 'Paid',
              paymentMethod: method,
              paidAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  };

  const handleUpdateBookingAdmin = (payload: {
    bookingId: number;
    serviceId: number;
    status: BookingStatus;
    adminRemarks: string;
    serviceCharge: number;
    additionalCharges: number;
    paymentStatus: PaymentStatus;
  }) => {
    const subtotal = payload.serviceCharge + payload.additionalCharges;
    const taxAmount = Number((subtotal * 0.1).toFixed(2));
    const totalAmount = Number((subtotal + taxAmount).toFixed(2));

    setDb((prev) => {
      const targetBooking = prev.bookings.find((b) => b.bookingId === payload.bookingId);
      const updatedBookings = prev.bookings.map((b) =>
        b.bookingId === payload.bookingId
          ? {
              ...b,
              serviceId: payload.serviceId,
              status: payload.status,
              adminRemarks: payload.adminRemarks,
            }
          : b
      );

      const updatedPayments = prev.payments.map((p) =>
        p.bookingId === payload.bookingId
          ? {
              ...p,
              serviceCharge: payload.serviceCharge,
              additionalCharges: payload.additionalCharges,
              taxAmount,
              totalAmount,
              paymentStatus: payload.paymentStatus,
              paymentMethod:
                payload.paymentStatus === 'Paid' && p.paymentMethod === 'Pending'
                  ? 'Workshop Counter'
                  : p.paymentMethod,
              paidAt:
                payload.paymentStatus === 'Paid' && !p.paidAt
                  ? new Date().toISOString()
                  : p.paidAt,
            }
          : p
      );

      let updatedHistory = prev.serviceHistory;
      if (payload.status === 'Completed' && targetBooking) {
        const existingIdx = prev.serviceHistory.findIndex(
          (h) => h.bookingId === payload.bookingId
        );
        if (existingIdx >= 0) {
          updatedHistory = prev.serviceHistory.map((h) =>
            h.bookingId === payload.bookingId
              ? {
                  ...h,
                  serviceId: payload.serviceId,
                  finalCost: totalAmount,
                  status: 'Completed',
                  technicianNotes: payload.adminRemarks || 'Service completed.',
                }
              : h
          );
        } else {
          const nextHistoryId =
            prev.serviceHistory.reduce((max, h) => Math.max(max, h.historyId), 0) + 1;
          updatedHistory = [
            {
              historyId: nextHistoryId,
              bookingId: targetBooking.bookingId,
              userId: targetBooking.userId,
              vehicleId: targetBooking.vehicleId,
              serviceId: payload.serviceId,
              serviceDate: targetBooking.preferredDate,
              finalCost: totalAmount,
              status: 'Completed',
              technicianNotes: payload.adminRemarks || 'Service completed.',
              recordedAt: new Date().toISOString(),
            },
            ...prev.serviceHistory,
          ];
        }
      }

      return {
        ...prev,
        bookings: updatedBookings,
        payments: updatedPayments,
        serviceHistory: updatedHistory,
      };
    });
  };

  const handleUpdateServicePrice = (serviceId: number, basePrice: number) => {
    setDb((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.serviceId === serviceId ? { ...s, basePrice } : s
      ),
    }));
  };

  // Invoice modal lookup
  const invoiceBooking =
    invoiceBookingId !== null
      ? db.bookings.find((b) => b.bookingId === invoiceBookingId) || null
      : null;
  const invoicePayment = invoiceBooking
    ? db.payments.find((p) => p.bookingId === invoiceBooking.bookingId) || null
    : null;
  const invoiceCustomer = invoiceBooking
    ? db.users.find((u) => u.userId === invoiceBooking.userId) || null
    : null;
  const invoiceVehicle = invoiceBooking
    ? db.vehicles.find((v) => v.vehicleId === invoiceBooking.vehicleId) || null
    : null;
  const invoiceService = invoiceBooking
    ? db.services.find((s) => s.serviceId === invoiceBooking.serviceId) || null
    : null;

  return (
    <>
      {view === 'home' && (
        <HomeView
          services={db.services}
          currentUser={currentUser}
          onNavigate={(next) => {
            if (next === 'customer' && (!currentUser || currentUser.role !== 'CUSTOMER')) {
              setView('login');
            } else if (next === 'admin' && (!currentUser || currentUser.role !== 'ADMIN')) {
              setView('login');
            } else {
              setView(next);
            }
          }}
          onQuickTrack={(code) => {
            setTrackInitialCode(code);
            setView('track');
          }}
        />
      )}

      {view === 'login' && (
        <LoginView
          onLogin={handleLogin}
          onNavigate={(next) => setView(next)}
        />
      )}

      {view === 'register' && (
        <RegisterView
          onRegister={handleRegister}
          onNavigate={(next) => setView(next)}
        />
      )}

      {view === 'track' && (
        <TrackServiceView
          initialCode={trackInitialCode}
          bookings={db.bookings}
          vehicles={db.vehicles}
          services={db.services}
          payments={db.payments}
          onBack={() =>
            setView(
              currentUser
                ? currentUser.role === 'ADMIN'
                  ? 'admin'
                  : 'customer'
                : 'home'
            )
          }
        />
      )}

      {view === 'docs' && <PblDocsView onBack={() => setView('home')} />}

      {view === 'customer' && currentUser && currentUser.role === 'CUSTOMER' && (
        <CustomerDashboard
          user={currentUser}
          vehicles={db.vehicles.filter((v) => v.userId === currentUser.userId)}
          services={db.services}
          bookings={db.bookings.filter((b) => b.userId === currentUser.userId)}
          payments={db.payments}
          serviceHistory={db.serviceHistory.filter((h) => h.userId === currentUser.userId)}
          onAddVehicle={handleAddVehicle}
          onUpdateVehicle={handleUpdateVehicle}
          onDeleteVehicle={handleDeleteVehicle}
          onCreateBooking={handleCreateBooking}
          onOpenInvoice={(bookingId) => setInvoiceBookingId(bookingId)}
          onGoHome={() => setView('home')}
          onLogout={handleLogout}
        />
      )}

      {view === 'admin' && currentUser && currentUser.role === 'ADMIN' && (
        <AdminDashboard
          adminUser={currentUser}
          users={db.users}
          vehicles={db.vehicles}
          services={db.services}
          bookings={db.bookings}
          payments={db.payments}
          serviceHistory={db.serviceHistory}
          onUpdateBookingAdmin={handleUpdateBookingAdmin}
          onUpdateServicePrice={handleUpdateServicePrice}
          onOpenInvoice={(bookingId) => setInvoiceBookingId(bookingId)}
          onGoHome={() => setView('home')}
          onLogout={handleLogout}
        />
      )}

      {invoiceBooking &&
        invoicePayment &&
        invoiceCustomer &&
        invoiceVehicle &&
        invoiceService && (
          <InvoiceModal
            booking={invoiceBooking}
            payment={invoicePayment}
            customer={invoiceCustomer}
            vehicle={invoiceVehicle}
            service={invoiceService}
            canPay={Boolean(currentUser)}
            onSimulatePayment={handleSimulatePayment}
            onClose={() => setInvoiceBookingId(null)}
          />
        )}
    </>
  );
}
