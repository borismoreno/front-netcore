import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js';
import { obtenerEtiquetas } from '../../helpers/meses';

export const CardBarChart = () => {
  const { totalComprobantes } = useSelector(state => state.dashboard);
  const labels = obtenerEtiquetas();
  useEffect(() => {
      let dataAnterior = [];
      let dataActual = [];
      const anioAnterior = new Date().getFullYear() - 1;
      const anioActual = new Date().getFullYear();
      const mesActual = new Date().getMonth() + 1;
      if ( Array.isArray(totalComprobantes) ) {
        for (let i = 1; i <= 12; i++) {
          let ventasMes = 0;
          totalComprobantes.forEach(resumen => {
            if ( resumen._id.mes === i.toString().padStart(2,'0') && resumen._id.anio === anioAnterior.toString() ) {
              ventasMes = resumen.count;
            }
          });
          dataAnterior.push(ventasMes);
        }
        for (let j = 1; j <= mesActual; j++) {
          let ventasMes = 0;
          totalComprobantes.forEach(resumen => {
            if ( resumen._id.mes === j.toString().padStart(2,'0') && resumen._id.anio === anioActual.toString() ) {
              ventasMes = resumen.count;
            }
          });
          dataActual.push(ventasMes);
        }
      }
      let config = {
            type: "bar",
            data: {
              labels,
              datasets: [
                {
                  label: anioAnterior,
                  backgroundColor: "#ed64a6",
                  borderColor: "#ed64a6",
                  data: dataAnterior,
                  fill: false,
                  barThickness: 8,
                },
                {
                  label: anioActual,
                  fill: false,
                  backgroundColor: "#4c51bf",
                  borderColor: "#4c51bf",
                  data: dataActual,
                  barThickness: 8,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              responsive: true,
              title: {
                display: false,
                text: "Orders Chart",
              },
              tooltips: {
                mode: "index",
                intersect: false,
              },
              hover: {
                mode: "nearest",
                intersect: true,
              },
              legend: {
                labels: {
                  fontColor: "rgba(0,0,0,.4)",
                },
                align: "end",
                position: "bottom",
              },
              scales: {
                xAxes: [
                  {
                    display: false,
                    scaleLabel: {
                      display: true,
                      labelString: "Month",
                    },
                    gridLines: {
                      borderDash: [2],
                      borderDashOffset: [2],
                      color: "rgba(33, 37, 41, 0.3)",
                      zeroLineColor: "rgba(33, 37, 41, 0.3)",
                      zeroLineBorderDash: [2],
                      zeroLineBorderDashOffset: [2],
                    },
                  },
                ],
                yAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: "Value",
                    },
                    gridLines: {
                      borderDash: [2],
                      drawBorder: false,
                      borderDashOffset: [2],
                      color: "rgba(33, 37, 41, 0.2)",
                      zeroLineColor: "rgba(33, 37, 41, 0.15)",
                      zeroLineBorderDash: [2],
                      zeroLineBorderDashOffset: [2],
                    },
                  },
                ],
              },
            },
          };
          let ctx = document.getElementById("bar-chart").getContext("2d");
          window.myBar = new Chart(ctx, config);
    }, [labels, totalComprobantes])
    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                    <h6 className="uppercase text-gray-500 mb-1 text-xs font-semibold">
                        Número
                    </h6>
                    <h2 className="text-gray-800 text-xl font-semibold">
                        Facturas Emitidas
                    </h2>
                    </div>
                </div>
                </div>
                <div className="p-4 flex-auto">
                {/* Chart */}
                <div className="relative h-96">
                    <canvas id="bar-chart"></canvas>
                </div>
                </div>
            </div>
        </>
    )
}
