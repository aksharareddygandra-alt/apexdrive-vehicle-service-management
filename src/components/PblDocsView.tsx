import { ArrowLeft, Wrench, Database, Server, Layers, FileCode2 } from 'lucide-react';

interface PblDocsViewProps {
  onBack: () => void;
}

export function PblDocsView({ onBack }: PblDocsViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-lg font-display font-bold text-white cursor-pointer"
          >
            <Wrench className="w-5 h-5 text-orange-500" />
            <span>ApexDrive Service · PBL Architecture</span>
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
            Vehicle Service Management System — Java, JDBC, Servlets & MySQL Blueprint
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The complete Maven + Apache Tomcat Java EE source tree is generated inside{' '}
            <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">/java-vsms/</code> alongside this live interactive preview. Below is the technical architecture, ER schema, credentials, and verification summary for faculty demonstration and viva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 font-display font-bold text-slate-900 mb-3">
              <Layers className="w-5 h-5 text-orange-600" />
              <span>Presentation Tier</span>
            </div>
            <p className="text-sm text-slate-600">
              HTML5, CSS3, JavaScript validation, and JSP views (<code className="font-mono text-xs">index.jsp</code>,{' '}
              <code className="font-mono text-xs">customer-dashboard.jsp</code>,{' '}
              <code className="font-mono text-xs">admin-dashboard.jsp</code>,{' '}
              <code className="font-mono text-xs">invoice.jsp</code>).
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 font-display font-bold text-slate-900 mb-3">
              <Server className="w-5 h-5 text-orange-600" />
              <span>Controller & DAO Tier</span>
            </div>
            <p className="text-sm text-slate-600">
              7 Java Servlets on Apache Tomcat 9 routing to 5 JDBC DAO classes using{' '}
              <code className="font-mono text-xs">PreparedStatement</code> and OOP model hierarchy (<code className="font-mono text-xs">Person &rarr; User</code>).
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 font-display font-bold text-slate-900 mb-3">
              <Database className="w-5 h-5 text-orange-600" />
              <span>Database Tier (MySQL)</span>
            </div>
            <p className="text-sm text-slate-600">
              Normalized 6-table schema in <code className="font-mono text-xs">vehicle_service_db</code>: users, vehicles, services, bookings, payments, and service_history.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 font-display font-bold text-slate-900">
            <FileCode2 className="w-5 h-5 text-orange-600" />
            <span>Demo Login Credentials</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-semibold text-slate-900 mb-1">Customer Account</div>
              <div className="font-mono text-slate-700">Email: rahul@example.com</div>
              <div className="font-mono text-slate-700">Password: Customer@123</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-semibold text-slate-900 mb-1">Administrator Account</div>
              <div className="font-mono text-slate-700">Email: admin@apexdrive.com</div>
              <div className="font-mono text-slate-700">Password: Admin@123</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
