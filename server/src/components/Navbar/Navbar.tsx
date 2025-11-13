import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen(!isOpen)

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          const offset = 100
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = 100 // Offset for fixed navbar
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
    }
    setIsOpen(false)
  }

  const handleGetStarted = () => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => scrollToSection("hero"), 100)
    } else {
      scrollToSection("hero")
    }
    setIsOpen(false)
  }

  const handleLogoClick = () => {
    navigate("/")
    setIsOpen(false)
  }

  const navItems = [
    { label: "Home", id: "hero" },
    { label: "Features", id: "features" },
    { label: "About", id: "about" },
  ]

  return (
    <div className="flex justify-center w-full py-6 px-4 fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3 bg-white rounded-full shadow-lg w-full max-w-5xl relative z-10 border border-gray-100">
        <div className="flex items-center">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={handleLogoClick}
          >
            <div className="w-6 h-6 rounded-full text-sm bg-black text-white flex items-center justify-center">
              i
            </div>
            <span className="text-lg font-bold text-black bg-clip-text ">
              IntelliAgent
            </span>
          </motion.div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white"
            >
              <button
                onClick={() => scrollToSection(item.id)}
                className="text-sm bg-white  text-gray-900  font-medium"
              >
                {item.label}
              </button>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white"
          >
            <Link
              to="/chat"
              className="text-sm bg-white text-gray-900 font-medium transition-colors"
            >
              Chat
            </Link>
          </motion.div>
        </nav>

        {/* Desktop CTA Button */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center justify-center px-5 py-2 text-sm text-white bg-neutral-900 rounded-full  transition-all shadow-md hover:shadow-lg"
          >
            Get Started
          </button>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button 
          className="md:hidden flex items-center" 
          onClick={toggleMenu} 
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-gray-900" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-gray-900" />
            </motion.button>
            <div className="flex flex-col space-y-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-base text-gray-900 font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link
                  to="/chat"
                  onClick={() => setIsOpen(false)}
                  className=" text-gray-900! font-medium transition-colors"
                >
                  Chat
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base  transition-all shadow-md"
                >
                  Get Started
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }