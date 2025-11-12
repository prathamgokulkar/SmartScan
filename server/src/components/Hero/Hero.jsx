import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal/Modal";
import SignupForm from "@/components/Signup/SignupForm";
import ChatWorkspace from "@/components/ChatWorkspace/ChatWorkspace";

const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const [showSignup, setShowSignup] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const titles = useMemo(
    () => [
      "intelligent",
      "accurate",
      "multi-agent",
      "finance-aware",
      "self-verifying",
    ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setTitleNumber((prev) => (prev + 1) % titles.length),
      2000
    );
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  useEffect(() => {
    const status = localStorage.getItem("isSignedUp");
    if (status === "true") setIsSignedUp(true);
  }, []);

  const handleSignupSuccess = () => {
    setIsSignedUp(true);
    setShowSignup(false);
  };

  if (showChat) return <ChatWorkspace onExit={() => setShowChat(false)} />;

  return (
    <section className="bg-gradient-to-b from-white to-gray-50">
      <div className="w-full flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col text-center">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter">
              <span className="block font-bold">MultiAgent Smart Scan</span>
              <span className="text-gray-700">
                AI-Powered Financial Understanding
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: -100 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                    transition={{ type: "spring", stiffness: 50 }}
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-600 max-w-2xl text-center">
              Upload invoices, receipts, or reports — and let intelligent agents
              extract, verify, and summarize financial data instantly.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            {!isSignedUp ? (
              <Button
                size="lg"
                className="gap-4 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setShowSignup(true)}
              >
                Sign up here <MoveRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="gap-4 bg-green-600 hover:bg-green-700"
                onClick={() => setShowChat(true)}
              >
                Chat with AI <MessageCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <Modal
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          ariaLabel="Sign up"
        >
          <SignupForm onSuccess={handleSignupSuccess} />
        </Modal>
      </div>
    </section>
  );
};

export default Hero;
