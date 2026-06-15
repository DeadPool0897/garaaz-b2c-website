import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-sky-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Garaaz</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Genuine spare parts delivered fast. Your trusted B2C platform for automotive parts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/categories', label: 'Categories' },
                { to: '/search', label: 'Search Parts' },
                { to: '/orders', label: 'My Orders' },
                { to: '/garage', label: 'My Garage' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Returns & Refunds', 'Shipping Policy', 'Privacy Policy'].map(label => (
                <li key={label}>
                  <span className="text-sm text-slate-400 hover:text-sky-400 transition-colors cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone size={14} />
                +91 1800-123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail size={14} />
                support@garaaz.com
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                Gurugram, Haryana, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Garaaz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
