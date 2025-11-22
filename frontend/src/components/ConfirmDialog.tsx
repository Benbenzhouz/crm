import React, { createContext, useContext, useState } from 'react';
import './ConfirmDialog.css';

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmFn = (options: string | ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn>(() => Promise.resolve(false));

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({ message: '' });
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);

  const confirm: ConfirmFn = (opts) => {
    const normalized = typeof opts === 'string' ? { message: opts } : opts;
    setOptions({ confirmText: 'OK', cancelText: 'Cancel', ...normalized });
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleResult = (result: boolean) => {
    setOpen(false);
    if (resolver) resolver(result);
    setResolver(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {open && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            {options.title && <h3 className="confirm-title">{options.title}</h3>}
            <div className="confirm-message">{options.message}</div>
            <div className="confirm-actions">
              <button className="confirm-btn cancel" onClick={() => handleResult(false)}>{options.cancelText}</button>
              <button className="confirm-btn confirm" onClick={() => handleResult(true)}>{options.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);

export default ConfirmProvider;
