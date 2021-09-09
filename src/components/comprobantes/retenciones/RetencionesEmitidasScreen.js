import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { startObtenerRetencionesEmitidas } from '../../../actions/retencion';
import { obtenerValorEstado } from '../../../helpers/comunes';
import { ReenvioMail } from '../../modals/ReenvioMail';
import { Cargando } from '../../ui/Cargando';
import { ExportarExcel } from '../../ui/ExportarExcel';
import { MenuFechas } from '../../ui/MenuFechas';
import { Pagination } from '../../ui/Pagination';
import { ComprobanteVacio } from '../ComprobanteVacio';
import TablaRetenciones from './TablaRetenciones';

export const RetencionesEmitidasScreen = () => {
    const [ datosExcel, setDatosExcel ] = useState([]);
    const [ emitidos, setEmitidos ] = useState([]);
    const { fechaInicio, fechaFin, descargandoPdf, claveReenvio } = useSelector(state => state.comprobante);
    const { retencionesEmitidas } = useSelector(state => state.retencion);
    const { mostrarCargando } = useSelector(state => state.alerta);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ rowsPerPage, setRowsPerPage ] = useState(10);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(startObtenerRetencionesEmitidas(fechaInicio, fechaFin));
    }, [dispatch, fechaInicio, fechaFin]);

    useEffect(() => {
        const obtenerEmitidos = () => {
            setCurrentPage(1);
            if ( retencionesEmitidas.length > 0 ) {
                setEmitidos(retencionesEmitidas.map(detalle => (
                    {
                        nombre: detalle.razonSocialSujetoRetenido,
                        numero: `${detalle.estab}-${detalle.ptoEmi}-${detalle.secuencial}`,
                        fecha: detalle.fechaEmision,
                        // valor: `$${detalle.valorModificacion}`,
                        estado: obtenerValorEstado(detalle.estadoComprobante),
                        claveAcceso: detalle.claveAcceso,
                        facturaId: detalle._id,
                    }
                )));
                const data = obtenerDatosReporte();
                setDatosExcel([{
                    xSteps: 1,
                    ySteps: 1,
                    columns: ["Identificación",
                    "Cliente",
                    "Fecha" ,
                    "Establecimiento",
                    "Punto" ,
                    "Secuencial",
                    "Clave" ,
                    "Estado"],
                    data,
                }])
            } else {
                setEmitidos([]);
                setDatosExcel([]);
            }
        }
        obtenerEmitidos();
        // eslint-disable-next-line
    }, [retencionesEmitidas]);

    const obtenerDatosReporte = () => {
        if (retencionesEmitidas.length > 0) {
            return retencionesEmitidas.map(comprobante => {
                return [
                    comprobante.identificacionSujetoRetenido,
                    comprobante.razonSocialSujetoRetenido,
                    comprobante.fechaEmision,
                    comprobante.estab,
                    comprobante.ptoEmi,
                    comprobante.secuencial,
                    comprobante.claveAcceso,
                    obtenerValorEstado(comprobante.estadoComprobante),
                ]
            })
        }
    }

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = emitidos.slice(indexOfFirstRow, indexOfLastRow);
    return (
        <div className="container mx-auto mb-6">
            <div className="flex justify-between mb-4">
                <div className="flex">
                    <MenuFechas />
                    <ExportarExcel multiDataSet={datosExcel} valorBoton="Exportar a excel" nombreArchivo="Retenciones Emitidas" nombreHoja="Retenciones"/>
                </div>
                <div>
                    <div className="relative mr-4 inline-block">
                        <NavLink
                            className="text-xs uppercase py-3 font-bold block bg-blue-400 text-white rounded-md border p-4 shadow-lg hover:bg-blue-700"
                            to="/retenciones/nuevo"
                        >
                            Nueva Retención
                        </NavLink>
                    </div>
                </div>
            </div>

            <NavLink
                to="/retenciones/nuevo"
            >
                <button
                    className="p-0 w-16 h-16 bg-blue-400 rounded-full hover:bg-blue-700 active:shadow-lg mouse shadow transition ease-in duration-200 fixed right-6 bottom-6 z-20 focus:outline-none"
                >
                    <i className="fas fa-plus text-white"></i>
                </button>
            </NavLink>
            {
                currentRows.length > 0 ? 
                    <div>
                        <TablaRetenciones 
                            data={currentRows}
                            // acciones={true}
                        />
                        {
                            emitidos.length > 10 && <Pagination
                                rowsPerPage={rowsPerPage}
                                totalRows={emitidos.length}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                setRowsPerPage={setRowsPerPage}
                            />
                        }
                    </div>
                : 
                <div className="flex justify-center rounded-md border border-blue-400 p-4">
                    <ComprobanteVacio />
                </div>
            }
            {
                (descargandoPdf || mostrarCargando) && <Cargando />
            }
            {
                claveReenvio && <ReenvioMail claveAcceso={claveReenvio} tipoDocumento='retencion'/>
            }
        </div>
    )
}
