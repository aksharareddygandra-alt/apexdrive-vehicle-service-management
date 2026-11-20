import React, { useState } from 'react';
import { ArrowLeft, Search, CheckCircle2, Circle, Wrench, AlertCircle } from 'lucide-react';
import { Booking, Payment, ServiceCategory, Vehicle } from '../types';
import { SERVICE_STAGES } from '../data/seedData';
import { BookingStatusLabel, PaymentStatusLabel } from './StatusText';

interface TrackServiceViewProps {
  initialCode?: string;
  bookings: Booking[];
  vehicles: Vehicle[];
  services: ServiceCategory[];
  payments: Payment[];
  embedded?: boolean;
  onBack?: () => void;
}

export function TrackServiceView({
  initialCode = '',
  bookings,
  vehicles,
  services,
  payments,
  embedded = false,
  onBack,
}: TrackServiceViewProps) {
  const [searchCode, setSearchCode] = useState(initialCode || 'VSMS-1002');
  const [activeCode, setActiveCode] = useState(initialCode || 'VSMS-1002');

  const booking = bookings.find(
    (b) => b.bookingCode.toUpperCase() === activeCode.trim().toUpperCase()
  );

  const vehicle = booking ? vehicles.find((v) => v.vehicleId === booking.vehicleId) : null;
  const service = booking ? services.find((s) => s.serviceId === booking.serviceId) : null;
  const payment = booking ? payments.find((p) => p.bookingId === booking.bookingId) : null;

  const currentStageIndex = booking
    ? SERVICE_STAGES.findIndex((st) => st === booking.status)
    : -1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveCode(searchCode);
  };

  const content = (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl font-display font-bold text-slate-900 mb-1">
          Live Service Status Tracker
        </h2>
        <p className="text-sm text-slate-600 mb-5">
          Enter your unique Booking ID (try <span className="font-mono font-semibold">VSMS-1001</span>,{' '}
          <span className="font-mono font-semibold">VSMS-1002</span>, or{' '}
          <span className="font-mono font-semibold">VSMS-1003</span>) to view live workshop progress.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter Booking ID (e.g. VSMS-1002)"
              required
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-orange-600"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Check Status
          </button>
        </form>
      </div>

      {!booking ? (
        <div className="bg-white border border-red-200 rounded-xl p-6 flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            No service booking found for ID <strong className="font-mono">{activeCode}</strong>. Please verify your Booking ID and try again.
          </span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                <span>Booking {booking.bookingCode}</span>
                <span aria-hidden="true">·</span>
                <span>Preferred Date: {booking.preferredDate}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehicle'} —{' '}
                {service?.serviceName}
              </h3>
              {vehicle && (
                <p className="text-sm text-slate-600 font-mono mt-0.5">
                  Plate: {vehicle.registrationNumber} · {vehicle.vehicleType} ({vehicle.manufacturingYear})
                </p>
              )}
            </div>
            <div className="sm:text-right">
              <div className="text-xs text-slate-500 mb-1">Current Workshop Stage</div>
              <BookingStatusLabel status={booking.status} />
            </div>
          </div>

          {booking.status === 'Rejected' ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              <strong>Booking Rejected:</strong>{' '}
              {booking.adminRemarks || 'Please contact the workshop desk to reschedule.'}
            </div>
          ) : (
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-3">
                5-Stage Workshop Progress
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {SERVICE_STAGES.map((stage, idx) => {
                  const isDone = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  return (
                    <div
                      key={stage}
                      className={`p-3.5 rounded-lg border ${
                        isCurrent
                          ? 'bg-orange-50 border-orange-500 text-orange-900'
                          : isDone
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono">0{idx + 1}</span>
                        {isDone ? (
                          <CheckCircle2
                            className={`w-4 h-4 ${isCurrent ? 'text-orange-600' : 'text-orange-400'}`}
                          />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <div className="text-xs font-semibold leading-snug">{stage}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-sm">
            <div>
              <div className="font-semibold text-slate-900 mb-1">Reported Issue / Notes</div>
              <p className="text-slate-600">
                {booking.problemDescription || 'Standard periodic service requested.'}
              </p>
              <div className="font-semibold text-slate-900 mt-4 mb-1">Workshop Remarks</div>
              <p className="text-slate-600">
                {booking.adminRemarks || 'Awaiting technician bay assignment.'}
              </p>
            </div>
            {payment && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Invoice Number</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {payment.invoiceNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Billed Amount</span>
                  <span className="font-mono font-bold tabular-nums text-slate-900">
                    ${payment.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-600">Payment Status</span>
                  <PaymentStatusLabel status={payment.paymentStatus} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-lg font-display font-bold text-white cursor-pointer"
          >
            <Wrench className="w-5 h-5 text-orange-500" />
            <span>ApexDrive Service</span>
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </header>
      <main className="max-w-5xl w-full mx-auto px-6 py-10">{content}</main>
    </div>
  );
}
