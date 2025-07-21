import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertMessage = ({ open, severity, message, onClose }) => {
    return React.createElement(
        Snackbar,
        {
            open,
            autoHideDuration: 3000,
            onClose,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            sx: { marginTop: '70px' }
        },
        React.createElement(Alert, {
            onClose,
            severity,
            variant: "filled",
            sx: { width: '100%' }
        }, message)
    );
};

export default AlertMessage;
