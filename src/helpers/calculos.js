export const calcularImpuestosDetalle = (subtotalImpuesto, valorImpuesto, codigoPorcentaje, tarifaImpuesto) => {
    return {
        subtotalImpuesto,
        valorImpuesto,
        baseImponible: subtotalImpuesto.toFixed(2),
        codigoPorcentaje,
        tarifaImpuesto
    }
}