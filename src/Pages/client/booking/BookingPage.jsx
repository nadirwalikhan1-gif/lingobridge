import { useEffect } from 'react';
import useBookingForm from '../hooks/useBookingForm';
import StepProgress from '../components/StepProgress';
import BookingNavButtons from '../components/BookingNavButtons';
import PaymentSummary from '../components/PaymentSummary';
import {
  StepSessionType,
  StepWhen,
  StepLanguage,
  StepPurpose,
  StepDuration,
} from '../steps/Steps';

export default function BookingPage({ onConnectNow, onSchedule, resetTrigger }) {
  const {
    step, sessionType, mode, language, purpose, duration, notes,
    set, next, back, reset,
    rate, durationMin, subtotal, platformFee, total,
    bookingData,
  } = useBookingForm();

  // Reset wizard when call ends (resetTrigger increments in App.jsx)
  useEffect(() => {
    if (resetTrigger > 0) reset();
  }, [resetTrigger]);

  const handleConnect  = () => onConnectNow(bookingData);
  const handleSchedule = () => onSchedule(bookingData);

  const STEPS = {
    1: <StepSessionType sessionType={sessionType} onChange={v => set('sessionType', v)} />,
    2: <StepWhen        mode={mode}               onChange={v => set('mode', v)} />,
    3: <StepLanguage    language={language}        onChange={v => set('language', v)} />,
    4: <StepPurpose     purpose={purpose}          onChange={v => set('purpose', v)} />,
    5: <StepDuration
          duration={duration}   onDurationChange={v => set('duration', v)}
          notes={notes}         onNotesChange={v => set('notes', v)}
          rate={rate}
       />,
  };

  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 300px',
      height:'100%', overflow:'hidden',
    }}>
      {/* Left panel */}
      <div style={{
        padding:'24px 28px', overflowY:'auto',
        display:'flex', flexDirection:'column', gap:24,
      }}>
        <StepProgress step={step} />
        {STEPS[step]}
        <BookingNavButtons
          step={step}
          mode={mode}
          onBack={back}
          onNext={next}
          onConnect={handleConnect}
          onSchedule={handleSchedule}
        />
      </div>

      {/* Right panel */}
      <PaymentSummary
        sessionType={sessionType}
        durationMin={durationMin}
        rate={rate}
        subtotal={subtotal}
        platformFee={platformFee}
        total={total}
      />
    </div>
  );
}
