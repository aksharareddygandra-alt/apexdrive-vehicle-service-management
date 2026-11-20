import React, { useState } from 'react';
import {
  ArrowRight,
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  Wrench,
  Menu,
  X,
} from 'lucide-react';
import { ServiceCategory, User } from '../types';

interface HomeViewProps {
  services: ServiceCategory[];
  currentUser: User | null;
  onNavigate: (view: 'home' | 'login' | 'register' | 'track' | 'customer' | 'admin' | 'docs') => void;
  onQuickTrack: (bookingCode: string) => void;
}

export function HomeView({ services, currentUser, onNavigate, onQuickTrack }: HomeViewProps) {
  const [quickCode, setQuickCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCode.trim()) {
      onQuickTrack(quickCode.trim().toUpperCase());
    }
  };

  const handlePrimaryPortal = () => {
    if (!currentUser) {
      onNavigate('login');
    } else if (currentUser.role === 'ADMIN') {
      onNavigate('admin');
    } else {
      onNavigate('customer');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 cursor-pointer"
          >
            ApexDrive Service
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Services
            </a>
            <a href="#about" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              About
            </a>
            <button
              onClick={() => onNavigate('track')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Track Service
            </button>
            <a href="#why-us" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Why Choose Us
            </a>
            <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrimaryPortal}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{currentUser ? 'Open Dashboard' : 'Sign In'}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-6 py-4 flex flex-col gap-3 text-sm font-medium text-slate-200">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
              Services
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
              About
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('track');
              }}
              className="text-left py-1.5 cursor-pointer"
            >
              Track Service
            </button>
            <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
              Why Choose Us
            </a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-1.5">
              Contact
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handlePrimaryPortal();
              }}
              className="mt-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg text-center cursor-pointer"
            >
              {currentUser ? 'Open Dashboard' : 'Sign In / Register'}
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
          <img
            src="/src/assets/images/hero_service_bay_1794916613032.jpg"
            alt="ApexDrive modern vehicle maintenance service bay with sedan on hydraulic lift"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-55"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/35" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-orange-400 tracking-wide mb-4">
              Certified Workshop · Live Bay Tracking · Transparent Billing
            </p>
            <h1
              className="font-display font-bold text-white tracking-tight leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', textWrap: 'balance' }}
            >
              Vehicle Service Management System
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              Register your vehicles, schedule certified maintenance across eight specialized categories, monitor five-stage repair progress, and download itemized invoices.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => (currentUser ? handlePrimaryPortal() : onNavigate('register'))}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{currentUser ? 'Schedule a Service' : 'Register & Book Service'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center px-5 py-3 text-sm font-semibold text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Customer & Admin Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Quick Tracking & Operations Strip */}
      <section className="bg-slate-900 border-t border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5">
            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <label htmlFor="heroTrackInput" className="sr-only">
                Booking ID
              </label>
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="heroTrackInput"
                  type="text"
                  value={quickCode}
                  onChange={(e) => setQuickCode(e.target.value)}
                  placeholder="Track Booking ID (e.g. VSMS-1002)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Track Status
              </button>
            </form>
          </div>
          <div className="lg:col-span-7 grid grid-cols-3 gap-4 sm:gap-8 lg:pl-8 lg:border-l lg:border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Workshop Bays</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">12 Active</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Service Categories</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">8 Certified</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Tracking Checkpoints</div>
              <div className="text-lg font-bold font-mono tabular-nums text-orange-400 mt-0.5">5 Live Stages</div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Service Center */}
      <section id="about" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-sm font-semibold text-orange-600 mb-2">About ApexDrive Service Center</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight mb-5" style={{ textWrap: 'balance' }}>
              Structured workshop workflows replacing manual logbooks
            </h2>
            <p className="text-slate-600 leading-relaxed mb-5">
              Traditional garages rely on paper job cards and phone calls for status updates. ApexDrive automates the entire lifecycle from customer vehicle registration and slot booking to workshop bay inspection, itemized billing, and archived maintenance history.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Every service request receives a unique Booking ID, passes through verified technician milestones, and generates a printable tax invoice with transparent labor and parts breakdowns.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">98.4%</div>
                <div className="text-sm text-slate-600 mt-1">Same-day periodic service delivery</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">80-Point</div>
                <div className="text-sm text-slate-600 mt-1">Standard digital diagnostic checklist</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[260px]">
              <img
                src="/src/assets/images/about_diagnostic_lab_1794916613048.jpg"
                alt="Master technician performing OBD-II engine diagnostics with tablet"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 min-h-[260px]">
              <img
                src="/src/assets/images/service_engine_care_1794916613863.jpg"
                alt="Precision ventilated disc brake rotor and performance caliper assembly"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Available Services */}
      <section id="services" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-semibold text-orange-600 mb-2">Workshop Capabilities</p>
              <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                Eight Core Service Categories
              </h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              Standardized base pricing with upfront bay time estimates. Additional parts require workshop approval before billing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, idx) => (
              <div
                key={service.serviceId}
                className={`bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between transition-colors hover:border-slate-300 ${
                  idx === 0 || idx === 2 ? 'lg:col-span-2' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-3">
                    <span>{String(idx + 1).padStart(2, '0')}.</span>
                    <span className="tabular-nums">{service.estimatedHours.toFixed(1)} hrs est.</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                    {service.serviceName}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Base Charge</span>
                    <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                      ${service.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handlePrimaryPortal}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-orange-600 mb-2">Operational Standards</p>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
              Why vehicle owners and fleet managers rely on ApexDrive
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-t border-slate-200 pt-6">
              <div className="text-sm font-mono font-semibold text-orange-600 mb-2">01. Real-Time Visibility</div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                Five-Stage Status Pipeline
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track every appointment from Booking Confirmed through Vehicle Received, Service In Progress, Ready for Delivery, and Completed using your unique Booking ID.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="text-sm font-mono font-semibold text-orange-600 mb-2">02. Itemized Billing</div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                Printable Tax Invoices
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every booking links to a dedicated invoice displaying base service charges, approved extra parts, calculated tax, and clear Paid or Pending status.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="text-sm font-mono font-semibold text-orange-600 mb-2">03. Permanent Archive</div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                Per-Vehicle Service History
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Completed jobs automatically archive technician notes, dates, and final costs against your vehicle registration number for warranty and resale documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Quiet Footer */}
      <footer id="contact" className="bg-slate-950 text-slate-300 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-slate-800">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg mb-3">
              <Wrench className="w-5 h-5 text-orange-500" />
              <span>ApexDrive Service Center</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Vehicle Service Management System — Full-Stack Java, JDBC, Servlets, MySQL, HTML5, CSS3 & JavaScript PBL Platform.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm">
            <div className="font-semibold text-white mb-2">Workshop Contact</div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span>420 Precision Parkway, Suite 100</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="font-mono">+1 (555) 201-8800</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4 text-orange-500 shrink-0" />
              <span>support@apexdrive.com</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Mon – Sat · 08:00 AM – 07:00 PM</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <div className="font-semibold text-white mb-2">Portal Access</div>
            <div>
              <button onClick={() => onNavigate('login')} className="text-slate-400 hover:text-white cursor-pointer">
                Customer & Admin Login
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('register')} className="text-slate-400 hover:text-white cursor-pointer">
                Customer Registration
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('track')} className="text-slate-400 hover:text-white cursor-pointer">
                Track Booking Status
              </button>
            </div>
            <div>
              <button onClick={() => onNavigate('docs')} className="text-orange-400 hover:text-orange-300 cursor-pointer">
                PBL Architecture & Java Docs
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>ApexDrive Service Center · Vehicle Service Management System</span>
          <span>College PBL Demonstration Platform</span>
        </div>
      </footer>
    </div>
  );
}
