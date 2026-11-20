import React, { useState } from 'react';
import {
  LayoutDashboard,
  Car,
  CalendarPlus,
  Search,
  History,
  LogOut,
  Wrench,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Home,
} from 'lucide-react';
import {
  Booking,
  Payment,
  ServiceCategory,
  ServiceHistoryRecord,
  User,
  Vehicle,
  VehicleType,
} from '../types';
import { BookingStatusLabel, PaymentStatusLabel } from './StatusText';
import { TrackServiceView } from './TrackServiceView';

type CustomerTab = 'overview' | 'vehicles' | 'book' | 'track' | 'history';

interface CustomerDashboardProps {
  user: User;
  vehicles: Vehicle[];
  services: ServiceCategory[];
  bookings: Booking[];
  payments: Payment[];
  serviceHistory: ServiceHistoryRecord[];
  onAddVehicle: (v: Omit<Vehicle, 'vehicleId' | 'userId' | 'createdAt'>) => { ok: boolean; error?: string };
  onUpdateVehicle: (v: Vehicle) => { ok: boolean; error?: string };
  onDeleteVehicle: (vehicleId: number) => void;
  onCreateBooking: (data: {
    vehicleId: number;
    serviceId: number;
    preferredDate: string;
    problemDescription: string;
  }) => { ok: boolean; bookingCode?: string; error?: string };
  onOpenInvoice: (bookingId: number) => void;
  onGoHome: () => void;
  onLogout: () => void;
}

const VEHICLE_TYPES: VehicleType[] = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Truck',
  'Motorcycle',
  'Electric/Hybrid',
];

export function CustomerDashboard({
  user,
  vehicles,
  services,
  bookings,
  payments,
  serviceHistory,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onCreateBooking,
  onOpenInvoice,
  onGoHome,
  onLogout,
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<CustomerTab>('overview');
  const [trackCode, setTrackCode] = useState(bookings[0]?.bookingCode || 'VSMS-1002');
  const [searchQuery, setSearchQuery] = useState('');

  // Vehicle form state
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [regNo, setRegNo] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan');
  const [mfgYear, setMfgYear] = useState(new Date().getFullYear());
  const [vehicleMsg, setVehicleMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Booking form state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedVehicleId, setSelectedVehicleId] = useState<number>(vehicles[0]?.vehicleId || 0);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(services[0]?.serviceId || 1);
  const [preferredDate, setPreferredDate] = useState(todayStr);
  const [problemDescription, setProblemDescription] = useState('');
  const [bookingResult, setBookingResult] = useState<{
    type: 'ok' | 'err';
    text: string;
    code?: string;
  } | null>(null);

  const pendingCount = bookings.filter(
    (b) => b.status !== 'Completed' && b.status !== 'Rejected'
  ).length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;

  const selectedService = services.find((s) => s.serviceId === Number(selectedServiceId));
  const estimatedTax = selectedService ? selectedService.basePrice * 0.1 : 0;
  const estimatedTotal = selectedService ? selectedService.basePrice + estimatedTax : 0;

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleMsg(null);
    const currentYear = new Date().getFullYear() + 1;
    if (regNo.trim().length < 4 || brand.trim().length < 2 || model.trim().length < 1) {
      setVehicleMsg({ type: 'err', text: 'Please fill in valid registration number, brand, and model.' });
      return;
    }
    if (mfgYear < 1960 || mfgYear > currentYear) {
      setVehicleMsg({
        type: 'err',
        text: `Manufacturing year must be between 1960 and ${currentYear}.`,
      });
      return;
    }

    if (editingVehicleId !== null) {
      const existing = vehicles.find((v) => v.vehicleId === editingVehicleId);
      if (existing) {
        const res = onUpdateVehicle({
          ...existing,
          registrationNumber: regNo.trim().toUpperCase(),
          brand: brand.trim(),
          model: model.trim(),
          vehicleType,
          manufacturingYear: Number(mfgYear),
        });
        if (!res.ok) {
          setVehicleMsg({ type: 'err', text: res.error || 'Could not update vehicle.' });
          return;
        }
        setVehicleMsg({ type: 'ok', text: 'Vehicle details updated successfully.' });
        setEditingVehicleId(null);
      }
    } else {
      const res = onAddVehicle({
        registrationNumber: regNo.trim().toUpperCase(),
        brand: brand.trim(),
        model: model.trim(),
        vehicleType,
        manufacturingYear: Number(mfgYear),
      });
      if (!res.ok) {
        setVehicleMsg({ type: 'err', text: res.error || 'Could not add vehicle.' });
        return;
      }
      setVehicleMsg({ type: 'ok', text: 'New vehicle registered successfully.' });
    }

    setRegNo('');
    setBrand('');
    setModel('');
    setVehicleType('Sedan');
    setMfgYear(new Date().getFullYear());
  };

  const startEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.vehicleId);
    setRegNo(v.registrationNumber);
    setBrand(v.brand);
    setModel(v.model);
    setVehicleType(v.vehicleType);
    setMfgYear(v.manufacturingYear);
    setVehicleMsg(null);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingResult(null);

    if (!selectedVehicleId || !vehicles.some((v) => v.vehicleId === Number(selectedVehicleId))) {
      setBookingResult({ type: 'err', text: 'Please select a registered vehicle first.' });
      return;
    }
    if (preferredDate < todayStr) {
      setBookingResult({ type: 'err', text: 'Preferred service date cannot be in the past.' });
      return;
    }

    const res = onCreateBooking({
      vehicleId: Number(selectedVehicleId),
      serviceId: Number(selectedServiceId),
      preferredDate,
      problemDescription,
    });

    if (res.ok && res.bookingCode) {
      setBookingResult({
        type: 'ok',
        text: `Service appointment scheduled. Your unique Booking ID is ${res.bookingCode}.`,
        code: res.bookingCode,
      });
      setProblemDescription('');
      setTrackCode(res.bookingCode);
    } else {
      setBookingResult({ type: 'err', text: res.error || 'Failed to schedule service.' });
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const v = vehicles.find((item) => item.vehicleId === b.vehicleId);
    const s = services.find((item) => item.serviceId === b.serviceId);
    return (
      b.bookingCode.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q) ||
      (v && `${v.brand} ${v.model} ${v.registrationNumber}`.toLowerCase().includes(q)) ||
      (s && s.serviceName.toLowerCase().includes(q))
    );
  });

  const navItems: { id: CustomerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'vehicles', label: 'My Vehicles', icon: <Car className="w-4 h-4" /> },
    { id: 'book', label: 'Book Service', icon: <CalendarPlus className="w-4 h-4" /> },
    { id: 'track', label: 'Track Service', icon: <Search className="w-4 h-4" /> },
    { id: 'history', label: 'Service History', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-slate-900 text-white flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="px-6 h-[72px] flex items-center gap-2.5 border-b border-slate-800">
          <Wrench className="w-5 h-5 text-orange-500 shrink-0" />
          <span className="font-display font-bold text-lg whitespace-nowrap">ApexDrive</span>
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
              Customer Portal · <span className="font-medium text-slate-700">{user.fullName}</span>
            </div>
            <h1 className="text-lg font-display font-bold text-slate-900 truncate">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (vehicles.length > 0 && !selectedVehicleId) {
                  setSelectedVehicleId(vehicles[0].vehicleId);
                }
                setActiveTab('book');
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              New Service Booking
            </button>
            <button
              onClick={onLogout}
              className="lg:hidden px-3 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="text-xs font-medium text-slate-500">Registered Vehicles</div>
                  <div className="text-3xl font-display font-bold font-mono tabular-nums text-slate-900 mt-1.5">
                    {vehicles.length}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="text-xs font-medium text-slate-500">Total Service Bookings</div>
                  <div className="text-3xl font-display font-bold font-mono tabular-nums text-slate-900 mt-1.5">
                    {bookings.length}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="text-xs font-medium text-slate-500">Pending Requests</div>
                  <div className="text-3xl font-display font-bold font-mono tabular-nums text-orange-600 mt-1.5">
                    {pendingCount}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="text-xs font-medium text-slate-500">Completed Services</div>
                  <div className="text-3xl font-display font-bold font-mono tabular-nums text-emerald-700 mt-1.5">
                    {completedCount}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base font-display font-bold text-slate-900">
                    Recent Service Bookings
                  </h2>
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by ID, vehicle, status..."
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                      <tr>
                        <th className="text-left px-5 py-3 font-semibold">Booking ID</th>
                        <th className="text-left px-5 py-3 font-semibold">Vehicle</th>
                        <th className="text-left px-5 py-3 font-semibold">Service Category</th>
                        <th className="text-left px-5 py-3 font-semibold">Date</th>
                        <th className="text-left px-5 py-3 font-semibold">Status</th>
                        <th className="text-right px-5 py-3 font-semibold">Total</th>
                        <th className="text-left px-5 py-3 font-semibold">Payment</th>
                        <th className="text-right px-5 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                            No matching service bookings found.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => {
                          const v = vehicles.find((item) => item.vehicleId === b.vehicleId);
                          const s = services.find((item) => item.serviceId === b.serviceId);
                          const p = payments.find((item) => item.bookingId === b.bookingId);
                          return (
                            <tr key={b.bookingId} className="hover:bg-slate-50">
                              <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">
                                {b.bookingCode}
                              </td>
                              <td className="px-5 py-3.5 text-slate-800">
                                <div>{v ? `${v.brand} ${v.model}` : 'Vehicle'}</div>
                                <div className="text-xs font-mono text-slate-500">
                                  {v?.registrationNumber}
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-slate-700">{s?.serviceName}</td>
                              <td className="px-5 py-3.5 font-mono tabular-nums text-slate-600">
                                {b.preferredDate}
                              </td>
                              <td className="px-5 py-3.5">
                                <BookingStatusLabel status={b.status} />
                              </td>
                              <td className="px-5 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900">
                                ${p ? p.totalAmount.toFixed(2) : '0.00'}
                              </td>
                              <td className="px-5 py-3.5">
                                <PaymentStatusLabel status={p?.paymentStatus || 'Pending'} />
                              </td>
                              <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-2">
                                <button
                                  onClick={() => {
                                    setTrackCode(b.bookingCode);
                                    setActiveTab('track');
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold border border-slate-300 hover:bg-slate-100 rounded-md text-slate-700 cursor-pointer"
                                >
                                  Track
                                </button>
                                <button
                                  onClick={() => onOpenInvoice(b.bookingId)}
                                  className="px-2.5 py-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md cursor-pointer"
                                >
                                  Invoice
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MY VEHICLES */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-base font-display font-bold text-slate-900 mb-4">
                  {editingVehicleId !== null ? 'Edit Vehicle Details' : 'Register New Vehicle'}
                </h2>

                {vehicleMsg && (
                  <div
                    className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 border ${
                      vehicleMsg.type === 'ok'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    {vehicleMsg.type === 'ok' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{vehicleMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleVehicleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="CA-09-AX-4421"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono uppercase focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Toyota"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Camry Hybrid"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-orange-600"
                    >
                      {VEHICLE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mfg. Year
                    </label>
                    <input
                      type="number"
                      required
                      min={1960}
                      max={new Date().getFullYear() + 1}
                      value={mfgYear}
                      onChange={(e) => setMfgYear(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tabular-nums focus:outline-none focus:border-orange-600"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-5 flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {editingVehicleId !== null ? 'Save Vehicle Changes' : 'Add Vehicle'}
                    </button>
                    {editingVehicleId !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingVehicleId(null);
                          setRegNo('');
                          setBrand('');
                          setModel('');
                        }}
                        className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h3 className="text-base font-display font-bold text-slate-900">
                    Registered Vehicles ({vehicles.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                      <tr>
                        <th className="text-left px-6 py-3 font-semibold">Registration Number</th>
                        <th className="text-left px-6 py-3 font-semibold">Brand & Model</th>
                        <th className="text-left px-6 py-3 font-semibold">Vehicle Type</th>
                        <th className="text-left px-6 py-3 font-semibold">Year</th>
                        <th className="text-right px-6 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {vehicles.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                            No vehicles registered yet. Use the form above to add your vehicle.
                          </td>
                        </tr>
                      ) : (
                        vehicles.map((v) => (
                          <tr key={v.vehicleId} className="hover:bg-slate-50">
                            <td className="px-6 py-3.5 font-mono font-semibold text-slate-900">
                              {v.registrationNumber}
                            </td>
                            <td className="px-6 py-3.5 text-slate-800">
                              {v.brand} {v.model}
                            </td>
                            <td className="px-6 py-3.5 text-slate-600">{v.vehicleType}</td>
                            <td className="px-6 py-3.5 font-mono tabular-nums text-slate-600">
                              {v.manufacturingYear}
                            </td>
                            <td className="px-6 py-3.5 text-right whitespace-nowrap space-x-2">
                              <button
                                onClick={() => startEditVehicle(v)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border border-slate-300 hover:bg-slate-100 rounded-md text-slate-700 cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => onDeleteVehicle(v.vehicleId)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border border-red-200 bg-red-50 hover:bg-red-100 rounded-md text-red-700 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOOK SERVICE */}
          {activeTab === 'book' && (
            <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900">
                  Schedule Vehicle Service Appointment
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Select a registered vehicle, choose a service category, and pick your preferred date.
                </p>
              </div>

              {bookingResult && (
                <div
                  className={`p-4 rounded-lg border text-sm space-y-2 ${
                    bookingResult.type === 'ok'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {bookingResult.type === 'ok' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{bookingResult.text}</span>
                  </div>
                  {bookingResult.code && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          setTrackCode(bookingResult.code!);
                          setActiveTab('track');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-md cursor-pointer"
                      >
                        Track {bookingResult.code}
                      </button>
                      <button
                        onClick={() => setActiveTab('overview')}
                        className="px-3 py-1.5 text-xs font-semibold border border-emerald-300 bg-white text-emerald-900 rounded-md cursor-pointer"
                      >
                        View in Dashboard
                      </button>
                    </div>
                  )}
                </div>
              )}

              {vehicles.length === 0 ? (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <p className="text-sm text-slate-700">
                    You do not have any registered vehicles yet. Add a vehicle before booking a service.
                  </p>
                  <button
                    onClick={() => setActiveTab('vehicles')}
                    className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg cursor-pointer"
                  >
                    Register a Vehicle
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="bookVehicle" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Registered Vehicle
                    </label>
                    <select
                      id="bookVehicle"
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-orange-600"
                    >
                      {vehicles.map((v) => (
                        <option key={v.vehicleId} value={v.vehicleId}>
                          {v.brand} {v.model} ({v.registrationNumber}) · {v.vehicleType}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bookService" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Service Category
                    </label>
                    <select
                      id="bookService"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-orange-600"
                    >
                      {services.map((s) => (
                        <option key={s.serviceId} value={s.serviceId}>
                          {s.serviceName} — ${s.basePrice.toFixed(2)} ({s.estimatedHours} hrs est.)
                        </option>
                      ))}
                    </select>
                    {selectedService && (
                      <p className="text-xs text-slate-500 mt-1.5">{selectedService.description}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bookDate" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Preferred Service Date
                    </label>
                    <input
                      id="bookDate"
                      type="date"
                      min={todayStr}
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-orange-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="bookNotes" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Additional Problems or Requirements
                    </label>
                    <textarea
                      id="bookNotes"
                      rows={3}
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      placeholder="Describe unusual sounds, warning lights, vibration, or specific checks..."
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                    />
                  </div>

                  {selectedService && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Base Service Charge</span>
                        <span className="font-mono tabular-nums">${selectedService.basePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Estimated Tax (10%)</span>
                        <span className="font-mono tabular-nums">${estimatedTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                        <span>Estimated Initial Total</span>
                        <span className="font-mono tabular-nums">${estimatedTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Confirm Service Booking
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: TRACK SERVICE */}
          {activeTab === 'track' && (
            <TrackServiceView
              initialCode={trackCode}
              bookings={bookings}
              vehicles={vehicles}
              services={services}
              payments={payments}
              embedded
            />
          )}

          {/* TAB 5: SERVICE HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-display font-bold text-slate-900">
                  Completed Service History
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold">Booking ID</th>
                      <th className="text-left px-5 py-3 font-semibold">Vehicle</th>
                      <th className="text-left px-5 py-3 font-semibold">Service Date</th>
                      <th className="text-left px-5 py-3 font-semibold">Service Category</th>
                      <th className="text-right px-5 py-3 font-semibold">Final Cost</th>
                      <th className="text-left px-5 py-3 font-semibold">Status</th>
                      <th className="text-left px-5 py-3 font-semibold">Technician Notes</th>
                      <th className="text-right px-5 py-3 font-semibold">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {serviceHistory.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                          No completed service records yet. Completed appointments archive here automatically.
                        </td>
                      </tr>
                    ) : (
                      serviceHistory.map((h) => {
                        const b = bookings.find((item) => item.bookingId === h.bookingId);
                        const v = vehicles.find((item) => item.vehicleId === h.vehicleId);
                        const s = services.find((item) => item.serviceId === h.serviceId);
                        return (
                          <tr key={h.historyId} className="hover:bg-slate-50">
                            <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">
                              {b?.bookingCode || `#${h.bookingId}`}
                            </td>
                            <td className="px-5 py-3.5 text-slate-800">
                              <div>{v ? `${v.brand} ${v.model}` : 'Vehicle'}</div>
                              <div className="text-xs font-mono text-slate-500">
                                {v?.registrationNumber}
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono tabular-nums text-slate-600">
                              {h.serviceDate}
                            </td>
                            <td className="px-5 py-3.5 text-slate-700">{s?.serviceName}</td>
                            <td className="px-5 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900">
                              ${h.finalCost.toFixed(2)}
                            </td>
                            <td className="px-5 py-3.5">
                              <BookingStatusLabel status={h.status} />
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 max-w-xs">
                              {h.technicianNotes}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => onOpenInvoice(h.bookingId)}
                                className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded-md cursor-pointer"
                              >
                                View Bill
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
