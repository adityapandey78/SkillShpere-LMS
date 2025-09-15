import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-2xl font-bold">SkillSphere</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering millions of learners worldwide with high-quality, 
              accessible education. Join our community and unlock your potential.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "All Courses", path: "/auth" },
                { name: "Categories", path: "/auth" },
                { name: "Become an Instructor", path: "/auth" },
                { name: "Student Success", path: "#" },
                { name: "Mobile App", path: "#" }
              ].map((link) => (
                <li key={link.name}>
                  <button 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => navigate(link.path)}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-3">
              {[
                "Help Center",
                "Contact Support",
                "System Status",
                "Terms of Service",
                "Privacy Policy",
                "Cookie Policy"
              ].map((item) => (
                <li key={item}>
                  <button className="text-gray-300 hover:text-white transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="text-gray-300">Email</div>
                  <div className="text-white">support@skillsphere.com</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="text-gray-300">Phone</div>
                  <div className="text-white">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="text-gray-300">Address</div>
                  <div className="text-white">
                    123 Learning Street<br />
                    Education City, EC 12345
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © {currentYear} SkillSphere. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <button className="text-gray-300 hover:text-white transition-colors">
                Terms
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                Privacy
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
