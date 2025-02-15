
import { Link } from "react-router-dom";
import { Home, Users, Book, Heart } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold">AdventistConnect</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="nav-link">
              <Home className="w-4 h-4 mr-2 inline-block" />
              Home
            </Link>
            <Link to="/community" className="nav-link">
              <Users className="w-4 h-4 mr-2 inline-block" />
              Community
            </Link>
            <Link to="/devotional" className="nav-link">
              <Book className="w-4 h-4 mr-2 inline-block" />
              Devotional
            </Link>
            <button className="btn-primary">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
