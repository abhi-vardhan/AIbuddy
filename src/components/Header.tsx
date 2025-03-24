
import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Button, 
  ButtonGroup,
  Chip,
  ChipList,
  FloatingActionButton
} from '@progress/kendo-react-buttons';
import { 
  Drawer
} from '@progress/kendo-react-layout';
import { 
  Dialog,
  DialogActionsBar
} from '@progress/kendo-react-dialogs';
import { SvgIcon } from '@progress/kendo-react-common';
import { menuIcon } from '@progress/kendo-svg-icons';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled
        ? "bg-white/80 backdrop-blur-md shadow-sm"
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-studyBuddy-primary" />
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-studyBuddy-primary to-studyBuddy-secondary">
                StudyBuddy
              </span>
            </Link>
          </div>
          
          <div className="flex-1"></div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <ButtonGroup>
              <Button
                className="text-foreground/80 hover:text-studyBuddy-primary transition-colors"
                fillMode="flat"
                onClick={() => scrollToSection('home')}
              >
                Home
              </Button>
              <Button
                fillMode="flat"
                onClick={() => scrollToSection('features')}
                className="text-foreground/80 hover:text-studyBuddy-primary transition-colors"
              >
                Features
              </Button>
              <Button
                fillMode="flat"
                onClick={() => scrollToSection('upload-section')}
                className="text-foreground/80 hover:text-studyBuddy-primary transition-colors"
              >
                Try It
              </Button>
            </ButtonGroup>
            
            <Button
              themeColor="primary"
              onClick={() => scrollToSection('upload-section')}
              className="rounded-full px-6"
            >
              Get Started
            </Button>
            
            {/* Fix: ChipList doesn't accept onItemClick, use onChange instead */}
            <ChipList
              data={[{ text: "Help" }]}
              selection="single"
              onChange={() => setShowHelpDialog(true)}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              icon="menu"
              fillMode="flat"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </div>
      </div>

      {/* Help Dialog */}
      {showHelpDialog && (
        <Dialog
          title="How to use StudyBuddy"
          onClose={() => setShowHelpDialog(false)}
          width={500}
        >
          <p>StudyBuddy helps you create study materials from your notes and documents.</p>
          <p>Simply upload your files in the 'Try It' section and let our AI generate flashcards, quizzes, and study guides.</p>
          <DialogActionsBar>
            <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
            <Button themeColor="primary" onClick={() => {
              scrollToSection('upload-section');
              setShowHelpDialog(false);
            }}>
              Try Now
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Mobile menu */}
      <Drawer
        expanded={mobileMenuOpen}
        position="start"
        onOverlayClick={() => setMobileMenuOpen(false)}
        className="md:hidden"
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <Link
            to="/"
            className="block py-2 text-foreground/90 hover:text-studyBuddy-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Button
            fillMode="flat"
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-foreground/90 hover:text-studyBuddy-primary"
          >
            Features
          </Button>
          <Button
            fillMode="flat"
            onClick={() => scrollToSection('upload-section')}
            className="block w-full text-left py-2 text-foreground/90 hover:text-studyBuddy-primary"
          >
            Try It
          </Button>
          <Button
            themeColor="primary"
            onClick={() => scrollToSection('upload-section')}
            className="w-full rounded-full"
          >
            Get Started
          </Button>
          <FloatingActionButton
            icon="question-circle"
            onClick={() => {
              setShowHelpDialog(true);
              setMobileMenuOpen(false);
            }}
            className="mt-4"
          />
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
