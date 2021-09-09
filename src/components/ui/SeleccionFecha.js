import React from 'react';
import DatePicker from 'react-datepicker';
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";

export const SeleccionFecha = ({startDate, setStartDate, minimoUnMes = true}) => {
    var today = new Date();
    var minimo = new Date();
    if (minimoUnMes) {
        minimo.setDate(today.getDate() - 30);
    } else {
        minimo.setDate(today.getDate() - 300);
    }
    return (
        <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            locale={es}
            minDate={minimo}
            maxDate={today}
            className="w-auto border-b-2 pb-1 border-gray-200 focus:outline-none focus:border-indigo-300 mt-2 text-sm text-gray-500"
        />
    )
}
