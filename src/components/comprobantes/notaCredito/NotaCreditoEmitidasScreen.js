import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TablaFacturas from '../../modals/TablaFacturas';
import { ExportarExcel } from '../../ui/ExportarExcel';
import { MenuFechas } from '../../ui/MenuFechas';
import { ComprobanteVacio } from '../ComprobanteVacio';
import { startLimpiarDatosNotaCredito, startObtenerNotasCreditoEmitidas } from '../../../actions/notaCredito';
import { startLimpiarDatosFactura } from '../../../actions/factura';
import { obtenerValorEstado } from '../../../helpers/comunes';
import TablaNotasCredito from './TablaNotasCredito';
import { Pagination } from '../../ui/Pagination';
import { Cargando } from '../../ui/Cargando';
import { ImprimirComprobante } from '../../modals/ImprimirComprobante';

const NotaCreditoEmitidasScreen = ({history}) => {
    const dispatch = useDispatch();
    const [ emitidos, setEmitidos ] = useState([]);
    const [ datosExcel, setDatosExcel ] = useState([]);
    const [ mostrarNueva, setMostrarNueva ] = useState(false);
    const { fechaInicio, fechaFin, descargandoPdf } = useSelector(state => state.comprobante);
    const { notasCreditoEmitidas, claveAcceso } = useSelector(state => state.notaCredito);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ rowsPerPage, setRowsPerPage ] = useState(10);
    const handleClick = () => {
        dispatch(startLimpiarDatosNotaCredito());
        dispatch(startLimpiarDatosFactura());
        setMostrarNueva(true);
    }
    useEffect(() => {
        dispatch(startObtenerNotasCreditoEmitidas(fechaInicio, fechaFin));
    }, [dispatch, fechaInicio, fechaFin]);
    useEffect(() => {
        const obtenerEmitidos = () => {
            setCurrentPage(1);
            if ( notasCreditoEmitidas.length > 0 ) {
                setEmitidos(notasCreditoEmitidas.map(detalle => (
                    {
                        nombre: detalle.razonSocialComprador,
                        numero: `${detalle.estab}-${detalle.ptoEmi}-${detalle.secuencial}`,
                        fecha: detalle.fechaEmision,
                        valor: `$${detalle.valorModificacion}`,
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
                    "Total" ,
                    "Descuento",
                    "IVA",
                    "Total",
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
    }, [notasCreditoEmitidas]);

    const obtenerDatosReporte = () => {
        if (notasCreditoEmitidas.length > 0) {
            return notasCreditoEmitidas.map(comprobante => {
                return [
                    comprobante.identificacionComprador,
                    comprobante.razonSocialComprador,
                    comprobante.fechaEmision,
                    comprobante.estab,
                    comprobante.ptoEmi,
                    comprobante.secuencial,
                    comprobante.claveAcceso,
                    comprobante.totalSinImpuestos,
                    comprobante.totalDescuento,
                    comprobante.totalIva,
                    comprobante.valorModificacion,
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
                    <ExportarExcel multiDataSet={datosExcel} valorBoton="Exportar a excel" nombreArchivo="Notas Credito Emitidas" nombreHoja="Notas Credito"/>
                </div>
                <div>
                    <div className="relative mr-4 inline-block">
                        <button
                            className="text-xs uppercase py-3 font-bold block bg-blue-400 text-white rounded-md border p-4 shadow-lg hover:bg-blue-700"
                            onClick={handleClick}
                        >
                            Nueva Nota Crédito
                        </button>
                    </div>
                </div>
            </div>
            <button
                className="p-0 w-16 h-16 bg-blue-400 rounded-full hover:bg-blue-700 active:shadow-lg mouse shadow transition ease-in duration-200 fixed right-6 bottom-6 z-20 focus:outline-none"
                onClick={handleClick}
            >
                <i className="fas fa-plus text-white"></i>
            </button>
            {
                currentRows.length > 0 ? (
                    <div>
                        <TablaNotasCredito 
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
                ): 
                <div className="flex justify-center rounded-md border border-blue-400 p-4">
                    <ComprobanteVacio />
                </div>
            }
            {
                mostrarNueva && <TablaFacturas setMostrarNueva={setMostrarNueva} history={history}/>
            }
            {
                descargandoPdf && <Cargando />
            }
            {
                claveAcceso && <ImprimirComprobante claveAcceso={claveAcceso} history={history} tipoComprobante='notaCredito'/>
            }
        </div>
    )
}

export default NotaCreditoEmitidasScreen