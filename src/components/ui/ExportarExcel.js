import React from 'react';
import ReactExport from 'react-export-excel';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

export const ExportarExcel = ({multiDataSet, valorBoton = 'Exportar a Excel', nombreHoja = 'Hoja1', nombreArchivo = 'Reporte Excel'}) => {
    return (
        <div className="inline-block text-center p-2">
            <ExcelFile element={
                    <button 
                        className={`text-xs uppercase p-2 font-bold block bg-blue-400 text-white rounded-md border shadow-lg disabled:opacity-40 ${(multiDataSet.length > 0) ? 'hover:bg-blue-700': null}`}
                        disabled={multiDataSet.length === 0}
                    >
                        {valorBoton}
                        <i className="ml-2 far fa-file-excel"></i>
                    </button>
                } filename={nombreArchivo}>
                <ExcelSheet dataSet={multiDataSet} name={nombreHoja}/>
            </ExcelFile>
        </div>
    )
}
