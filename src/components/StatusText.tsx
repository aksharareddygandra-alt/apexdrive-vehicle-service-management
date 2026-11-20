import {
  CheckCircle2,
  Clock,
  Wrench,
  PackageCheck,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { BookingStatus, PaymentStatus } from '../types';

export function BookingStatusLabel({ status }: { status: BookingStatus | string }) {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Completed</span>
        </span>
      );
    case 'Ready for Delivery':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700">
          <PackageCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Ready for Delivery</span>
        </span>
      );
    case 'Service In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-700">
          <Wrench className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Service In Progress</span>
        </span>
      );
    case 'Vehicle Received':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
          <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Vehicle Received</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700">
          <XCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Rejected</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{status}</span>
        </span>
      );
  }
}

export function PaymentStatusLabel({ status }: { status: PaymentStatus | string }) {
  if (status === 'Paid') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Paid</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>Pending</span>
    </span>
  );
}
