import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { Button } from '../common/Button';
import { usePortfolioData } from '../../contexts/PortfolioDataContext';

interface NavbarProps {
  onOpenResume?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume }) => {
  const { data } = usePortfolioData();
  const { profile } = data;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
  }

  const handleNavClick = (anchor: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${anchor}`);
      return;
    }

    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '/projects', isRoute: true },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Certification', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#E8E4DC] shadow-[0_1px_4px_rgba(0,0,0,0.02)]'
          : 'bg-[#FAF8F5] border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Brand Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-base sm:text-lg font-semibold tracking-tight text-[#181A18] group focus:outline-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#4D5E4B] group-hover:scale-125 transition-transform" />
            <div className="flex flex-col">
              <span className="group-hover:text-[#4D5E4B] transition-colors leading-tight">
                Sri Manikanta Korivi
              </span>
              <span className="text-[10px] text-[#707670] font-normal tracking-normal hidden sm:block">
                KITS Akshar Institute of Technology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-xs font-medium uppercase tracking-wider transition-colors ${
                    location.pathname === link.href
                      ? 'text-[#4D5E4B] font-semibold'
                      : 'text-[#565C56] hover:text-[#181A18]'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-xs font-medium uppercase tracking-wider text-[#565C56] hover:text-[#181A18] transition-colors cursor-pointer"
                >
                  {link.name}
                </button>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-3">
            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="p-2 text-[#565C56] hover:text-[#181A18] hover:bg-[#F2EEE4] rounded-lg transition-colors"><LinkedinIcon className="w-4 h-4" /></a>}
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#565C56] hover:text-[#181A18] hover:bg-[#F2EEE4] rounded-lg transition-colors"
              title="Verified GitHub Profile"
              aria-label="Verified GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {onOpenResume && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenResume}
                icon={<FileText className="w-3.5 h-3.5 text-[#4D5E4B]" />}
              >
                Resume
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNavClick('#contact')}
              icon={<ArrowUpRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Get in Touch
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="p-2 text-[#565C56] hover:text-[#181A18] rounded-lg"><LinkedinIcon className="w-5 h-5" /></a>}
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#565C56] hover:text-[#181A18] rounded-lg"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2D332D] hover:bg-[#F2EEE4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D5E4B] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[#E8E4DC] bg-[#FAF8F5] px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-150 shadow-md">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#181A18] hover:bg-[#F2EEE4] transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[#181A18] hover:bg-[#F2EEE4] transition-colors cursor-pointer"
                >
                  {link.name}
                </button>
              )
            )}
            <div className="pt-3 mt-2 border-t border-[#E8E4DC] flex flex-col gap-2.5">
              {onOpenResume && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenResume();
                  }}
                  icon={<FileText className="w-4 h-4 text-[#4D5E4B]" />}
                  className="w-full justify-center"
                >
                  View Resume (CV)
                </Button>
              )}
              <Button
                variant="primary"
                size="md"
                onClick={() => handleNavClick('#contact')}
                className="w-full justify-center"
              >
                Get in Touch
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
