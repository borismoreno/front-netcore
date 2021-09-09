import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { startAnularComprobante, startLimpiarAutorizacion, startLimpiarError, startObtenerComprobantesEmitidos, startOcultarAnular, startOcultarReprocesar, startReprocesarComprobante } from '../../actions/comprobante';
import { Pagination } from '../ui/Pagination';
import { Cargando } from '../ui/Cargando';
import { MenuFechas } from '../ui/MenuFechas';
import { ComprobanteVacio } from '../comprobantes/ComprobanteVacio';
import { ReenvioMail } from '../modals/ReenvioMail';
import { ReprocesarComprobante } from '../modals/ReprocesarComprobante';
import { ImprimirComprobante } from '../modals/ImprimirComprobante';
import { startMostrarCargando } from '../../actions/ui';
import { ExportarExcel } from '../ui/ExportarExcel';
import { TablaFacturas } from '../comprobantes/TablaFacturas';

export const FacturasEmitidasScreen = ({history}) => {
    const dispatch = useDispatch();
    const [emitidos, setEmitidos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [datosExcel, setDatosExcel] = useState([]);
    const { comprobantesEmitidos, descargandoPdf, fechaInicio, fechaFin, claveReenvio, claveReprocesar, claveAnular } = useSelector(state => state.comprobante);
    const { claveAcceso } = useSelector(state => state.factura);
    const { cargando } = useSelector(state => state.ui);
    useEffect(() => {
        dispatch(startObtenerComprobantesEmitidos(fechaInicio, fechaFin));
    }, [dispatch, fechaInicio, fechaFin])
    useEffect(() => {
        dispatch(startLimpiarError());
        dispatch(startLimpiarAutorizacion());
    }, [dispatch])
    useEffect(() => {
        const obtenerEmitidos = () => {
            setCurrentPage(1);
            if ( comprobantesEmitidos.length > 0 ) {
                setEmitidos(comprobantesEmitidos.map(detalle => (
                    {
                        nombre: detalle.razonSocialComprador,
                        numero: `${detalle.estab}-${detalle.ptoEmi}-${detalle.secuencial}`,
                        fecha: detalle.fechaEmision,
                        valor: `$${detalle.importeTotal}`,
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
    }, [comprobantesEmitidos])

    const obtenerDatosReporte = () => {
        if (comprobantesEmitidos.length > 0) {
            return comprobantesEmitidos.map(comprobante => {
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
                    comprobante.importeTotal,
                    obtenerValorEstado(comprobante.estadoComprobante),
                ]
            })
        }
    }

    const handleReprocesar = () => {
        dispatch(startReprocesarComprobante(claveReprocesar));
    }

    const handleCerrarReprocesar = () => {
        dispatch(startOcultarReprocesar());
    }

    const handleAnular = () => {
        dispatch(startMostrarCargando());
        dispatch(startAnularComprobante(claveAnular));
    }

    const handleCerrarAnular = () => {
        dispatch(startOcultarAnular());
    }

    const obtenerValorEstado = (valor) => {
        let estado = '';
        switch (valor) {
            case 'PPR':
                estado = 'POR PROCESAR'
                break;
            case 'AUT':
                estado = 'AUTORIZADO'
                break;
            case 'NAT':
                estado = 'NO AUTORIZADO'
                break;
            case 'REC':
                estado = 'RECIBIDA'
                break;
            case 'EMA':
                estado = 'PROCESADA'
                break;
            case 'DEV':
                estado = 'DEVUELTA'
                break;
            case 'ANU':
                estado = 'ANULADA'
                break;
            default:
                break;
        }
        return estado;
    }
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = emitidos.slice(indexOfFirstRow, indexOfLastRow);
    return (
        <div
            className="container mx-auto mb-6"
        >
            <div className="flex justify-between mb-4">
                <div className="flex">
                    <MenuFechas />
                    <ExportarExcel multiDataSet={datosExcel} valorBoton="Exportar a excel" nombreArchivo="Facturas Emitidas" nombreHoja="Facturas"/>
                </div>
                {/* <h2 className="text-2xl font-bold mb-6 pb-2 tracking-wider uppercase"></h2> */}
                <div>
                    <div className="relative mr-4 mt-2 inline-block text-center">
                        <NavLink
                            className="text-xs uppercase font-bold block p-2 bg-blue-400 text-white rounded-md border shadow-lg hover:bg-blue-700"
                            to="/emitidas/factura"
                        >
                            Nueva Factura
                        </NavLink>
                    </div>
                </div>
            </div>

            <NavLink
                to="/emitidas/factura"
            >
                <button
                    className="p-0 w-16 h-16 bg-blue-400 rounded-full hover:bg-blue-700 active:shadow-lg mouse shadow transition ease-in duration-200 fixed right-6 bottom-6 z-20 focus:outline-none"
                >
                    <i className="fas fa-plus text-white"></i>
                </button>
            </NavLink>
            {
                currentRows.length > 0 ? (
                    <div>
                        <TablaFacturas 
                            data={currentRows}
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
                ): <div className="flex justify-center rounded-md border border-blue-400 p-4"><ComprobanteVacio /></div>
            }
            {
                descargandoPdf && <Cargando />
            }
            {/* {
                errorDevuelta && <ErroresComprobante />
            } */}
            {
                claveReenvio && <ReenvioMail claveAcceso={claveReenvio} tipoDocumento='comprobante'/>
            }
            {
                claveReprocesar && <ReprocesarComprobante claveAcceso={claveReprocesar} handleAccion={handleReprocesar} handleCerrar={handleCerrarReprocesar} accion='Reprocesar' />
            }
            {
                claveAnular && <ReprocesarComprobante claveAcceso={claveAnular} handleAccion={handleAnular} handleCerrar={handleCerrarAnular} accion='Anular' />
            }
            {
                claveAcceso && <ImprimirComprobante claveAcceso={claveAcceso} history={history} tipoComprobante='factura'/>
            }
            {
                cargando && <Cargando />
            }
        </div>
    )
}
