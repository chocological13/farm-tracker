import { useState } from 'react';
import {PackingRecord} from "@/types/records";
import {apiService} from "@/services/api";
import logger from "@/utils/logger";

export const usePackingForm = () => {
    const [formData, setFormData] = useState<PackingRecord>({
        datetime: new Date().toISOString().slice(0, 19),
        pic: '',
        gross_weight: 0,
        pack_a_qty: 0,
        pack_b_qty: 0,
        pack_c_qty: 0,
        reject_weight: 0,
    });

    const formatDateTime = (datetime: string) => {
        return datetime.slice(0, 19);
    };

    const resetForm = () => {
        setFormData({
            datetime: new Date().toISOString().slice(0, 19),
            pic: '',
            gross_weight: 0,
            pack_a_qty: 0,
            pack_b_qty: 0,
            pack_c_qty: 0,
            reject_weight: 0,
        });
    };

    const handleSubmit = async () => {
        try {
            const formattedData = {
                ...formData,
                datetime: formatDateTime(formData.datetime)
            };
            await apiService.createRecord(formattedData);
            resetForm();
            return true;
        } catch (error) {
            console.error('Error submitting form:', error);
            return false;
        }
    };

    const handleChange = (name: string, value: string | number) => {
        if (name === 'datetime') {
            setFormData(prev => ({
                ...prev,
                [name]: formatDateTime(value as string)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'pic' ? value : Number(value),
            }));
        }
    };

    return {
        formData,
        handleSubmit,
        handleChange,
        resetForm
    };
};