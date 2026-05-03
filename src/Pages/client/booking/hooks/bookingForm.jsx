import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  step:        1,
  sessionType: 'video',
  mode:        'instant',
  language:    'Arabic',
  purpose:     'medical',
  duration:    '30 min',
  notes:       '',
};

export default function useBookingForm() {
  const [form, setForm] = useState(INITIAL_STATE);

  const set = useCallback((field, value) =>
    setForm(prev => ({ ...prev, [field]: value })), []);

  const next = useCallback(() =>
    setForm(prev => ({ ...prev, step: Math.min(prev.step + 1, 5) })), []);

  const back = useCallback(() =>
    setForm(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) })), []);

  const reset = useCallback(() => setForm(INITIAL_STATE), []);

  // Derived: cost calculation
  const rate       = form.sessionType === 'video' ? 1.2 : 0.9;
  const durationMin = { '15 min': 15, '30 min': 30, '1 hour': 60, '2+ hrs': 120 }[form.duration] || 30;
  const subtotal   = (rate * durationMin).toFixed(2);
  const platformFee = 2.40;
  const total      = (parseFloat(subtotal) + platformFee).toFixed(2);

  // Derived: booking payload ready to pass to onConnectNow / onSchedule
  const bookingData = {
    id:          Date.now().toString(),
    sessionType: form.sessionType,
    mode:        form.mode,
    language:    form.language,
    purpose:     form.purpose,
    duration:    form.duration,
    notes:       form.notes,
  };

  return {
    // form fields
    ...form,
    // setters
    set,
    next,
    back,
    reset,
    // derived
    rate,
    durationMin,
    subtotal,
    platformFee,
    total,
    bookingData,
  };
}
