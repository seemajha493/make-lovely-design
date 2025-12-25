import { Phone } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SOSButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { t } = useTranslation();

  const handlePress = () => {
    if (countdown !== null) {
      // Cancel if already counting
      setCountdown(null);
      setIsPressed(false);
      return;
    }

    setIsPressed(true);
    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        setIsPressed(false);
        // Trigger emergency call
        window.location.href = "tel:108";
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  return (
    <button
      onClick={handlePress}
      className={`fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-emergency transition-all duration-200 hover:scale-105 ${
        isPressed ? "sos-pulse" : ""
      }`}
      aria-label={t('sos.title')}
    >
      <div className="relative flex items-center justify-center">
        {countdown !== null ? (
          <span className="text-2xl font-bold">{countdown}</span>
        ) : (
          <div className="flex flex-col items-center">
            <Phone className="h-6 w-6" />
            <span className="text-[10px] font-bold mt-0.5">{t('sos.button')}</span>
          </div>
        )}
      </div>
    </button>
  );
}
