import { useState } from 'react';
import { X, Printer, CreditCard, CheckCircle2 } from 'lucide-react';
import { Booking, Payment, ServiceCategory, User, Vehicle } from '../types';
import { PaymentStatusLabel } from './StatusText';

interface InvoiceModalProps {
  booking: Booking;
  payment: Payment;
  customer: User;
  vehicle: Vehicle;
  service: ServiceCategory;
  canPay: boolean;
  onSimulatePayment: (bookingId: number, method: string) => void;
  onClose: () => void;
}

export function InvoiceModal({
  booking,
  payment,
  customer,
  vehicle,
  service,
  canPay,
  onSimulatePayment,
  onClose,
}: InvoiceModalProps) {
  const [method, setMethod] = useState('Simulated Card');
  const [justPaid, setJustPaid] = useState(false);

  const handlePay = () => {
    onSimulatePayment(booking.bookingId, method);
    setJustPaid(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl overflow-hidden my-8">
        <div className="no-print px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="font-display font-semibold">
            Service Invoice · <span className="font-mono">{payment.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {justPaid && (
            <div className="no-print p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Simulated payment completed. Payment status updated to Paid.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">ApexDrive Service Center</h2>
              <p className="text-xs text-slate-500 mt-1">
                420 Precision Parkway, Suite 100 · support@apexdrive.com · +1 (555) 201-8800
              </p>
            </div>
            <div className="sm:text-right">
              <div className="text-sm font-mono font-bold text-slate-900">{payment.invoiceNumber}</div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">
                Booking ID: {booking.bookingCode}
              </div>
              <div className="mt-2">
                <PaymentStatusLabel status={payment.paymentStatus} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-xs text-slate-500 mb-1">Billed To</div>
              <div className="font-semibold text-slate-900">{customer.fullName}</div>
              <div className="text-slate-600">{customer.email}</div>
              <div className="text-slate-600 font-mono">{customer.phone}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Vehicle Details</div>
              <div className="font-semibold text-slate-900">
                {vehicle.brand} {vehicle.model} ({vehicle.manufacturingYear})
              </div>
              <div className="text-slate-600 font-mono">{vehicle.registrationNumber}</div>
              <div className="text-slate-600">Service Date: {booking.preferredDate}</div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold">Description</th>
                  <th className="text-right px-4 py-2.5 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 text-slate-800">
                    {service.serviceName} (Base Service Charge)
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-900">
                    ${payment.serviceCharge.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-800">
                    Additional Parts & Workshop Labor
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-900">
                    ${payment.additionalCharges.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-600">Service Tax (10%)</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                    ${payment.taxAmount.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="px-4 py-3 text-slate-900">Total Amount</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-900 text-base">
                    ${payment.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {payment.paymentStatus === 'Paid' ? (
            <div className="text-xs text-slate-500 flex justify-between">
              <span>Payment Method: {payment.paymentMethod}</span>
              {payment.paidAt && (
                <span className="font-mono">
                  Settled: {new Date(payment.paidAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ) : (
            canPay && (
              <div className="no-print pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="Simulated Card">Simulated Credit / Debit Card</option>
                    <option value="Simulated UPI">Simulated UPI / Instant Pay</option>
                    <option value="Workshop Counter Cash">Workshop Counter Cash</option>
                  </select>
                </div>
                <button
                  onClick={handlePay}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Pay ${payment.totalAmount.toFixed(2)} (Simulated)
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
