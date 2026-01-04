import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Cpu, BookOpen, FileText, Library, Users, ClipboardCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "首頁", icon: Cpu },
  { path: "/dialogue", label: "會話篇", icon: BookOpen },
  { path: "/essay", label: "短文篇", icon: FileText },
  { path: "/vocabulary", label: "生詞庫", icon: Library },
  { path: "/activities", label: "課室活動", icon: Users },
  { path: "/quiz", label: "自我檢測", icon: ClipboardCheck },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-background">
              <img src="/favicon.png" alt="矽島的抉擇" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className="text-primary-foreground font-serif font-semibold text-lg">
                矽島的抉擇
              </span>
              <span className="block text-primary-foreground/60 text-xs">
                高階商務華語
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-secondary bg-primary-foreground/10"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-secondary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-primary border-t border-primary-foreground/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
