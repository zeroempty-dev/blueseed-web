import { createContext, useContext, useState, useCallback } from 'react';

const defaultDraft = {
  pickupLocation: '',
  dropLocation: '',
  pickupDate: '',
  transportType: '',
  commodity: {
    name: '',
    type: 'bulk',
    weightTons: '',
    lengthCm: '',
    widthCm: '',
    heightCm: '',
  },
  deliveryType: 'timed',
  deliveryDeadline: '',
};

const OrderDraftContext = createContext(null);

export function OrderDraftProvider({ children }) {
  const [draft, setDraft] = useState(defaultDraft);

  const updateDraft = useCallback((partial) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateCommodity = useCallback((partial) => {
    setDraft((prev) => ({
      ...prev,
      commodity: { ...prev.commodity, ...partial },
    }));
  }, []);

  const resetDraft = useCallback(() => setDraft(defaultDraft), []);

  return (
    <OrderDraftContext.Provider
      value={{ draft, updateDraft, updateCommodity, resetDraft }}
    >
      {children}
    </OrderDraftContext.Provider>
  );
}

export function useOrderDraft() {
  const ctx = useContext(OrderDraftContext);
  if (!ctx) throw new Error('useOrderDraft must be used within OrderDraftProvider');
  return ctx;
}
