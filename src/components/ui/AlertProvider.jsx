"use client";

import { createContext, useContext, useState } from "react";
import AlertModal from "./AlertModal";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = (config) => {
    setAlert(config);
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>

      {children}

      {alert && (
        <AlertModal
          {...alert}
          onClose={closeAlert}
          onConfirm={() => {
            alert.onConfirm?.();
            closeAlert();
          }}
        />
      )}

    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}