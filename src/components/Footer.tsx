import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#5b9bd5] text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">School Events</h3>
            <p className="text-sm">
              Stay connected with all school activities and events. Never miss an opportunity to participate and showcase your talents.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://wa.me/+919163969103" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full hover:bg-[#4a8ac4] transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/azaan_basically" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full hover:bg-[#4a8ac4] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 9163969103</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@schoolevents.edu</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[#4a8ac4] text-sm text-center">
          <p>&copy; {new Date().getFullYear()} School Events. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;