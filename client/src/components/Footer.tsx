import React from 'react';
import { Twitter, Linkedin, Youtube, Instagram, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSeller } = useRole();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (to: string, sectionId: string | null = null) => {
    if (location.pathname === to && !sectionId) {
      scrollToTop();
    } else if (sectionId) {
      if (location.pathname === to) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        navigate(to);
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    } else {
      navigate(to);
    }
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 py-12">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
          {/* Logo Section */}
          <div className="flex-1 lg:max-w-[300px]">
            <img src="/wie-new-logo1.png" alt="WIECODES" className="h-32 object-contain -ml-8 " />
            <p className="text-xs text-white/40 mb-4 leading-relaxed">
              Premium templates for modern
              <br />
              developers. Built with precision,
              <br />
              engineered for scale.
            </p>
            <p className="text-[10px] text-white/30">
              © {new Date().getFullYear()} WieCodes. All rights reserved.
            </p>
          </div>

          <div className="flex flex-1 gap-8 lg:gap-12">
            {/* Market Section with Divider */}
            <div className="flex-1 border-l border-white/10 pl-8 pt-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-4">
                MARKET
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleLinkClick('/templates')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    All Templates
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/templates')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    New Arrivals
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/templates')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Top Sellers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/templates')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Collections
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="flex-1 border-l border-white/10 pl-8 pt-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-4">
                COMPANY
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleLinkClick('/about')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/contact')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/help', 'terms')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Terms
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/help', 'policies')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Privacy
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="flex-1 border-l border-white/10 pl-8 pt-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-4">
                RESOURCES
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleLinkClick('/help')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/seller')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/seller/upload')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Become a Seller
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/')}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Affiliate
                  </button>
                </li>
              </ul>
            </div>

            {/* Stay Updated Section */}
            <div className="flex-1 border-l border-white/10 pl-8 pt-4">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-4">
                STAY UPDATED
              </h4>
              
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/40 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="text-white/40 hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="text-white/40 hover:text-white transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="#" className="text-white/40 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
