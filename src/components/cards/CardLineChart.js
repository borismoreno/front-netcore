import React, { useEffect } from 'react';
import Chart from 'chart.js';
import { useSelector } from 'react-redux';
import { obtenerEtiquetas } from '../../helpers/meses';

export const CardLineChart = () => {
  const { facturasResumen } = useSelector(state => state.dashboard);
  const labels = obtenerEtiquetas();
    useEffect(() => {
      //let labels = [];
      let dataAnterior = [];
      let dataActual = [];
      const anioAnterior = new Date().getFullYear() - 1;
      const anioActual = new Date().getFullYear();
      const mesActual = new Date().getMonth() + 1;
      if ( Array.isArray(facturasResumen) ) {
        for (let i = 1; i <= 12; i++) {
          let ventasMes = 0;
          facturasResumen.forEach(resumen => {
            if ( resumen._id.mes === i.toString().padStart(2,'0') && resumen._id.anio === anioAnterior.toString() ) {
              ventasMes = resumen.totalVentas.$numberDecimal;
            }
          });
          dataAnterior.push(ventasMes);
        }
        for (let j = 1; j <= mesActual; j++) {
          let ventasMes = 0;
          facturasResumen.forEach(resumen => {
            if ( resumen._id.mes === j.toString().padStart(2,'0') && resumen._id.anio === anioActual.toString() ) {
              ventasMes = resumen.totalVentas.$numberDecimal;
            }
          });
          dataActual.push(ventasMes);
        }
      }
        var config = {
            type: "line",
            data: {
              labels,
              datasets: [
                {
                  label: anioAnterior,
                  backgroundColor: "#4c51bf",
                  borderColor: "#4c51bf",
                  data: dataAnterior,
                  fill: false,
                },
                {
                  label: anioActual,
                  fill: false,
                  backgroundColor: "#fff",
                  borderColor: "#fff",
                  data: dataActual,
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              responsive: true,
              title: {
                display: false,
                text: "Sales Charts",
                fontColor: "white",
              },
              legend: {
                labels: {
                  fontColor: "white",
                },
                align: "end",
                position: "bottom",
              },
              tooltips: {
                mode: "index",
                intersect: false,
              },
              hover: {
                mode: "nearest",
                intersect: true,
              },
              scales: {
                xAxes: [
                  {
                    ticks: {
                      fontColor: "rgba(255,255,255,.7)",
                    },
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: "Month",
                      fontColor: "white",
                    },
                    gridLines: {
                      display: false,
                      borderDash: [2],
                      borderDashOffset: [2],
                      color: "rgba(33, 37, 41, 0.3)",
                      zeroLineColor: "rgba(0, 0, 0, 0)",
                      zeroLineBorderDash: [2],
                      zeroLineBorderDashOffset: [2],
                    },
                  },
                ],
                yAxes: [
                  {
                    ticks: {
                      fontColor: "rgba(255,255,255,.7)",
                    },
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: "Value",
                      fontColor: "white",
                    },
                    gridLines: {
                      borderDash: [3],
                      borderDashOffset: [3],
                      drawBorder: false,
                      color: "rgba(255, 255, 255, 0.15)",
                      zeroLineColor: "rgba(33, 37, 41, 0)",
                      zeroLineBorderDash: [2],
                      zeroLineBorderDashOffset: [2],
                    },
                  },
                ],
              },
            },
          };
          var ctx = document.getElementById("line-chart").getContext("2d");
          window.myLine = new Chart(ctx, config);
    }, [labels, facturasResumen]);

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-gray-800">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                    <h6 className="uppercase text-gray-200 mb-1 text-xs font-semibold">
                        Resumen
                    </h6>
                    <h2 className="text-white text-xl font-semibold">Ventas</h2>
                    </div>
                </div>
                </div>
                <div className="p-4 flex-auto">
                {/* Chart */}
                <div className="relative h-96">
                    <canvas id="line-chart"></canvas>
                </div>
                </div>
            </div>
        </>
    )
}
