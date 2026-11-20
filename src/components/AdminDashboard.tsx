import React, { useState } from 'react';
import {
  ClipboardList,
  Users,
  Car,
  Wrench,
  History,
  LogOut,
  Search,
  Home,
  CheckCircle2,
} from 'lucide-react';
import {
  Booking,
  BookingStatus,
  Payment,
  PaymentStatus,
  ServiceCategory,
  ServiceHistoryRecord,
  User,
  Vehicle,
} from '../types';
import { BookingStatusLabel, PaymentStatusLabel } from './StatusText';

type AdminTab = 'bookings' | 'customers' | 'vehicles' | 'services' | 'history';

interface AdminDashboardProps {
  adminUser: User;
  users: User[];
  vehicles: Vehicle[];
  services: ServiceCategory[];
  bookings: Booking[];
  payments: Payment[];
  serviceHistory: ServiceHistoryRecord[];
  onUpdateBookingAdmin: (payload: {
    bookingId: number;
    serviceId: number;
    status: BookingStatus;
    adminRemarks: string;
    serviceCharge: number;
    additionalCharges: number;
    paymentStatus: PaymentStatus;
  }) => void;
  onUpdateServicePrice: (serviceId: number, basePrice: number) => void;
  onOpenInvoice: (bookingId: number) => void;
  onGoHome: () => void;
  onLogout: () => void;
}

const BOOKING_STATUSES: BookingStatus[] = [
  'Booking Confirmed',
  'Vehicle Received',
  'Service In Progress',
  'Ready for Delivery',
  'Completed',
  'Rejected',
];

export function AdminDashboard({
  adminUser,
  users,
  vehicles,
  services,
  bookings,
  payments,
  serviceHistory,
  onUpdateBookingAdmin,
  onUpdateServicePrice,
  onOpenInvoice,
  onGoHome,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Edit drawer/row state
  const [editServiceId, setEditServiceId] = useState<number>(1);
  const [editStatus, setEditStatus] = useState<BookingStatus>('Booking Confirmed');
  const [editRemarks, setEditRemarks] = useState('');
  const [editServiceCharge, setEditServiceCharge] = useState(0);
  const [editExtraCharges, setEditExtraCharges] = useState(0);
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>('Pending');

  // Price editing
  const [priceEdits, setPriceEdits] = useState<Record<number, string>>({});

  const customers = users.filter((u) => u.role === 'CUSTOMER');
  const pendingCount = bookings.filter(
    (b) => b.status !== 'Completed' && b.status !== 'Rejected'
  ).length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const collectedRevenue = payments
    .filter((p) => p.paymentStatus === 'Paid')
    .reduce((acc, p) => acc + p.totalAmount, 0);

  const openEditModal = (b: Booking) => {
    const p = payments.find((item) => item.bookingId === b.bookingId);
    setEditingBookingId(b.bookingId);
    setEditServiceId(b.serviceId);
    setEditStatus(b.status);
    setEditRemarks(b.adminRemarks || '');
    setEditServiceCharge(p ? p.serviceCharge : 0);
    setEditExtraCharges(p ? p.additionalCharges : 0);
    setEditPaymentStatus(p ? p.paymentStatus : 'Pending');
  };

  const handleSaveBookingEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBookingId === null) return;
    onUpdateBookingAdmin({
      bookingId: editingBookingId,
      serviceId: editServiceId,
      status: editStatus,
      adminRemarks: editRemarks,
      serviceCharge: Number(editServiceCharge) || 0,
      additionalCharges: Number(editExtraCharges) || 0,
      paymentStatus: editPaymentStatus,
    });
    setEditingBookingId(null);
    setToast('Booking status, billing, and service records updated.');
    setTimeout(() => setToast(null), 3500);
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const c = users.find((u) => u.userId === b.userId);
    const v = vehicles.find((item) => item.vehicleId === b.vehicleId);
    const s = services.find((item) => item.serviceId === b.serviceId);
    return (
      b.bookingCode.toLowerCase().includes(q) ||
      (c && c.fullName.toLowerCase().includes(q)) ||
      (v && `${v.brand} ${v.model} ${v.registrationNumber}`.toLowerCase().includes(q)) ||
      (s && s.serviceName.toLowerCase().includes(q))
    );
  });

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'bookings', label: 'Bookings & Billing', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'vehicles', label: 'Vehicles', icon: <Car className="w-4 h-4" /> },
    { id: 'services', label: 'Service Categories', icon: <Wrench className="w-4 h-4" /> },
    { id: 'history', label: 'Service Records', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-slate-900 text-white flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="px-6 h-[72px] flex items-center gap-2.5 border-b border-slate-800">
          <Wrench className="w-5 h-5 text-orange-500 shrink-0" />
          <span className="font-display font-bold text-lg whitespace-nowrap">ApexDrive Admin</span>
        </div>

        <nav className="p-4 flex lg:flex-col gap-1.5 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex flex-col gap-1.5 mt-auto p-4 border-t border-slate-800">
          <button
            onClick={onGoHome}
            className="flex items-center gap-3 px-3.5 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Public Home</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3.5 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 h-[72px] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-slate-500">
              Administrator Console · <span className="font-medium text-slate-700">{adminUser.fullName}</span>
            </div>
            <h1 className="text-lg font-display font-bold text-slate-900 truncate">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="lg:hidden px-3 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg cursor-pointer"
          >
            Sign Out
          </button>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {toast && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toast}</span>
            </div>
          )}

          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs text-slate-500">Customers</div>
              <div className="text-2xl font-display font-bold font-mono tabular-nums text-slate-900 mt-1">
                {customers.length}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs text-slate-500">Vehicles</div>
              <div className="text-2xl font-display font-bold font-mono tabular-nums text-slate-900 mt-1">
                {vehicles.length}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs text-slate-500">Pending Services</div>
              <div className="text-2xl font-display font-bold font-mono tabular-nums text-orange-600 mt-1">
                {pendingCount}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs text-slate-500">Completed</div>
              <div className="text-2xl font-display font-bold font-mono tabular-nums text-emerald-700 mt-1">
                {completedCount}
              </div>
            </div>
            <div className="col-span-2 lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs text-slate-500">Collected Revenue</div>
              <div className="text-2xl font-display font-bold font-mono tabular-nums text-slate-900 mt-1">
                ${collectedRevenue.toFixed(2)}
              </div>
            </div>
          </div>

          {/* TAB 1: BOOKINGS & BILLING */}
          {activeTab === 'bookings' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                      statusFilter === 'ALL'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({bookings.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('Booking Confirmed')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                      statusFilter === 'Booking Confirmed'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => setStatusFilter('Service In Progress')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                      statusFilter === 'Service In Progress'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setStatusFilter('Completed')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                      statusFilter === 'Completed'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Completed
                  </button>
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ID, customer, plate..."
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Booking ID</th>
                      <th className="text-left px-4 py-3 font-semibold">Customer</th>
                      <th className="text-left px-4 py-3 font-semibold">Vehicle</th>
                      <th className="text-left px-4 py-3 font-semibold">Category</th>
                      <th className="text-left px-4 py-3 font-semibold">Status</th>
                      <th className="text-right px-4 py-3 font-semibold">Total Bill</th>
                      <th className="text-left px-4 py-3 font-semibold">Payment</th>
                      <th className="text-right px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredBookings.map((b) => {
                      const c = users.find((u) => u.userId === b.userId);
                      const v = vehicles.find((item) => item.vehicleId === b.vehicleId);
                      const s = services.find((item) => item.serviceId === b.serviceId);
                      const p = payments.find((item) => item.bookingId === b.bookingId);
                      return (
                        <tr key={b.bookingId} className="hover:bg-slate-50">
                          <td className="px-4 py-3.5 font-mono font-semibold text-slate-900">
                            <div>{b.bookingCode}</div>
                            <div className="text-xs font-normal text-slate-500">
                              {b.preferredDate}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-800">{c?.fullName}</td>
                          <td className="px-4 py-3.5">
                            <div className="text-slate-800">
                              {v ? `${v.brand} ${v.model}` : 'Vehicle'}
                            </div>
                            <div className="text-xs font-mono text-slate-500">
                              {v?.registrationNumber}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-700">{s?.serviceName}</td>
                          <td className="px-4 py-3.5">
                            <BookingStatusLabel status={b.status} />
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900">
                            ${p ? p.totalAmount.toFixed(2) : '0.00'}
                          </td>
                          <td className="px-4 py-3.5">
                            <PaymentStatusLabel status={p?.paymentStatus || 'Pending'} />
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => openEditModal(b)}
                              className="px-3 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-md cursor-pointer"
                            >
                              Manage
                            </button>
                            <button
                              onClick={() => onOpenInvoice(b.bookingId)}
                              className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-md cursor-pointer"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-display font-bold text-slate-900">
                  Registered Customers ({customers.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold">User ID</th>
                      <th className="text-left px-6 py-3 font-semibold">Full Name</th>
                      <th className="text-left px-6 py-3 font-semibold">Email</th>
                      <th className="text-left px-6 py-3 font-semibold">Phone</th>
                      <th className="text-right px-6 py-3 font-semibold">Vehicles</th>
                      <th className="text-right px-6 py-3 font-semibold">Bookings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {customers.map((c) => (
                      <tr key={c.userId} className="hover:bg-slate-50">
                        <td className="px-6 py-3.5 font-mono text-slate-500">#{c.userId}</td>
                        <td className="px-6 py-3.5 font-semibold text-slate-900">{c.fullName}</td>
                        <td className="px-6 py-3.5 text-slate-700">{c.email}</td>
                        <td className="px-6 py-3.5 font-mono text-slate-600">{c.phone}</td>
                        <td className="px-6 py-3.5 text-right font-mono tabular-nums text-slate-900">
                          {vehicles.filter((v) => v.userId === c.userId).length}
                        </td>
                        <td className="px-6 py-3.5 text-right font-mono tabular-nums text-slate-900">
                          {bookings.filter((b) => b.userId === c.userId).length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: VEHICLES */}
          {activeTab === 'vehicles' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-display font-bold text-slate-900">
                  All Registered Vehicles ({vehicles.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold">Reg. Number</th>
                      <th className="text-left px-6 py-3 font-semibold">Owner</th>
                      <th className="text-left px-6 py-3 font-semibold">Brand & Model</th>
                      <th className="text-left px-6 py-3 font-semibold">Type</th>
                      <th className="text-left px-6 py-3 font-semibold">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {vehicles.map((v) => {
                      const owner = users.find((u) => u.userId === v.userId);
                      return (
                        <tr key={v.vehicleId} className="hover:bg-slate-50">
                          <td className="px-6 py-3.5 font-mono font-semibold text-slate-900">
                            {v.registrationNumber}
                          </td>
                          <td className="px-6 py-3.5 text-slate-700">{owner?.fullName}</td>
                          <td className="px-6 py-3.5 text-slate-900">
                            {v.brand} {v.model}
                          </td>
                          <td className="px-6 py-3.5 text-slate-600">{v.vehicleType}</td>
                          <td className="px-6 py-3.5 font-mono tabular-nums text-slate-600">
                            {v.manufacturingYear}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES */}
          {activeTab === 'services' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-display font-bold text-slate-900">
                  Service Categories & Base Pricing
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold">Service Category</th>
                      <th className="text-left px-6 py-3 font-semibold">Description</th>
                      <th className="text-left px-6 py-3 font-semibold">Est. Hours</th>
                      <th className="text-left px-6 py-3 font-semibold">Base Price ($)</th>
                      <th className="text-right px-6 py-3 font-semibold">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {services.map((s) => {
                      const val =
                        priceEdits[s.serviceId] !== undefined
                          ? priceEdits[s.serviceId]
                          : s.basePrice.toFixed(2);
                      return (
                        <tr key={s.serviceId} className="hover:bg-slate-50">
                          <td className="px-6 py-3.5 font-semibold text-slate-900">
                            {s.serviceName}
                          </td>
                          <td className="px-6 py-3.5 text-slate-600 max-w-md">{s.description}</td>
                          <td className="px-6 py-3.5 font-mono tabular-nums text-slate-600">
                            {s.estimatedHours.toFixed(1)}h
                          </td>
                          <td className="px-6 py-3.5">
                            <input
                              type="number"
                              step="0.01"
                              min="1"
                              value={val}
                              onChange={(e) =>
                                setPriceEdits({ ...priceEdits, [s.serviceId]: e.target.value })
                              }
                              className="w-28 px-2.5 py-1.5 border border-slate-300 rounded-md font-mono text-sm"
                            />
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <button
                              onClick={() => {
                                const parsed = parseFloat(val);
                                if (!isNaN(parsed) && parsed > 0) {
                                  onUpdateServicePrice(s.serviceId, parsed);
                                  setToast(`Updated base charge for ${s.serviceName}.`);
                                  setTimeout(() => setToast(null), 3000);
                                }
                              }}
                              className="px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md cursor-pointer"
                            >
                              Save Price
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SERVICE HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-display font-bold text-slate-900">
                  Completed Service Records ({serviceHistory.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold">Booking ID</th>
                      <th className="text-left px-5 py-3 font-semibold">Customer</th>
                      <th className="text-left px-5 py-3 font-semibold">Vehicle</th>
                      <th className="text-left px-5 py-3 font-semibold">Service</th>
                      <th className="text-left px-5 py-3 font-semibold">Date</th>
                      <th className="text-right px-5 py-3 font-semibold">Final Cost</th>
                      <th className="text-left px-5 py-3 font-semibold">Technician Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {serviceHistory.map((h) => {
                      const b = bookings.find((item) => item.bookingId === h.bookingId);
                      const c = users.find((u) => u.userId === h.userId);
                      const v = vehicles.find((item) => item.vehicleId === h.vehicleId);
                      const s = services.find((item) => item.serviceId === h.serviceId);
                      return (
                        <tr key={h.historyId} className="hover:bg-slate-50">
                          <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">
                            {b?.bookingCode || `#${h.bookingId}`}
                          </td>
                          <td className="px-5 py-3.5 text-slate-800">{c?.fullName}</td>
                          <td className="px-5 py-3.5 text-slate-700">
                            {v ? `${v.brand} ${v.model} (${v.registrationNumber})` : 'Vehicle'}
                          </td>
                          <td className="px-5 py-3.5 text-slate-700">{s?.serviceName}</td>
                          <td className="px-5 py-3.5 font-mono tabular-nums text-slate-600">
                            {h.serviceDate}
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900">
                            ${h.finalCost.toFixed(2)}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 max-w-xs">
                            {h.technicianNotes}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin Manage Booking Modal */}
      {editingBookingId !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-display font-bold text-slate-900">
                Manage Booking{' '}
                <span className="font-mono">
                  {bookings.find((b) => b.bookingId === editingBookingId)?.bookingCode}
                </span>
              </h3>
              <button
                onClick={() => setEditingBookingId(null)}
                className="text-sm text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveBookingEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Category
                  </label>
                  <select
                    value={editServiceId}
                    onChange={(e) => {
                      const sid = Number(e.target.value);
                      setEditServiceId(sid);
                      const svc = services.find((item) => item.serviceId === sid);
                      if (svc) setEditServiceCharge(svc.basePrice);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    {services.map((s) => (
                      <option key={s.serviceId} value={s.serviceId}>
                        {s.serviceName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as BookingStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    {BOOKING_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Charge ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editServiceCharge}
                    onChange={(e) => setEditServiceCharge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Extra Charges ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editExtraCharges}
                    onChange={(e) => setEditExtraCharges(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technician / Admin Remarks
                </label>
                <textarea
                  rows={3}
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="Enter diagnostic findings, bay assignment, or parts replaced..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between text-sm">
                <span className="text-slate-600">Updated Total (incl. 10% tax)</span>
                <span className="font-mono font-bold text-slate-900">
                  ${((Number(editServiceCharge) + Number(editExtraCharges)) * 1.1).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBookingId(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  Save & Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
