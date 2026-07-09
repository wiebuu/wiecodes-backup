import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Upload,
  HelpCircle,
  Info,
  Trophy,
  FileText,
  ArrowRight,
} from 'lucide-react';

const sellerLinks = [
  {
    title: 'PORTAL',
    links: [
      { label: 'Seller Dashboard', to: '/seller', icon: LayoutDashboard },
      { label: 'My Profile', to: '/seller/profile', icon: User },
      { label: 'Upload Template', to: '/seller/upload', icon: Upload },
    ],
  },
  {
    title: 'GROW',
    links: [
      { label: 'Weekend Challenges', to: '/weekends', icon: Trophy },
      { label: 'Marketplace', to: '/templates', icon: FileText },
    ],
  },
  {
    title: 'SUPPORT',
    links: [
      { label: 'Seller Help', to: '/seller/help', icon: HelpCircle },
      { label: 'About Wiecodes', to: '/seller/about', icon: Info },
      { label: 'Contact', to: '/contact', icon: ArrowRight },
    ],
  },
];

const SellerFooter = () => (
  <footer className="relative z-10 border-t border-white/10 bg-[#0a0a0a]">
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-14">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
        <div className="max-w-sm">
          <img src="/wie-new-logo1.png" alt="WIECODES" className="h-24 object-contain -ml-6 mb-4" />
          <p className="text-xs text-white/40 leading-relaxed font-mono">
            Your creator command center. Manage templates, track earnings, and ship faster.
          </p>
          <p className="text-[10px] text-white/25 mt-6 font-mono uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} WieCodes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 flex-1 lg:max-w-2xl">
          {sellerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/50 font-mono mb-5">
                {group.title}
              </p>
              <ul className="space-y-3">
                {group.links.map(({ label, to, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="group inline-flex items-center gap-2.5 text-xs text-white/45 hover:text-white transition-colors font-mono"
                    >
                      <Icon className="w-3.5 h-3.5 text-white/25 group-hover:text-white/60" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default SellerFooter;
