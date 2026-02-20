import { useState, useCallback } from "react";

/**
 * Generic controlled-form hook.
 *
 * @param {Object} initialValues - An object whose keys are field names and values are initial field values.
 * @returns {{ values, handleChange, resetForm }}
 *
 * Usage:
 *   const { values, handleChange, resetForm } = useForm({ email: "", password: "" });
 */
export function useForm(initialValues) {
    const [values, setValues] = useState(initialValues);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setValues(initialValues);
    }, [initialValues]);

    return { values, handleChange, resetForm };
}
