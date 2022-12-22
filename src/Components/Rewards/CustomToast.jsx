import { Alert, Snackbar } from "@mui/material";
import React from "react";

export default function CustomToast(props) {

    const { toast, handleCloseToast } = props;

    return (
        <Snackbar open={toast.show} autoHideDuration={6000} onClose={handleCloseToast}>
            <Alert onClose={handleCloseToast} severity={toast.variant || "success"} sx={{ width: '100%' }}>
                {toast.message}
            </Alert>
        </Snackbar>
    )
}