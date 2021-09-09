import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startFacturasEmitidas, startTopClientes, startTotalComprobantes } from '../../actions/dashboard';
import { CardBarChart } from '../cards/CardBarChart';
import { CardLineChart } from '../cards/CardLineChart';
import { CardPageVisits } from '../cards/CardPageVisits';
// import { CardSocialTraffic } from '../cards/CardSocialTraffic';
// import { HeaderStats } from '../ui/HeaderStats';

export const DashboardScreen = () => {
    const dispatch = useDispatch();
    const { empresaId } = useSelector(state => state.auth);
    useEffect(() => {
        dispatch(startTotalComprobantes(empresaId));
        dispatch(startFacturasEmitidas(empresaId));
        dispatch(startTopClientes(empresaId));
    }, [dispatch, empresaId]);
    return (
        <div>
        {/* <HeaderStats /> */}
            <div className="flex flex-wrap mb-4">
                <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                <CardLineChart />
                </div>
                <div className="w-full xl:w-4/12 px-4">
                <CardBarChart />
                </div>
            </div>
            <div className="mt-4">
                <div className="w-full px-4">
                    <CardPageVisits />
                </div>
                {/* <div className="w-full xl:w-4/12 px-4">
                    <CardSocialTraffic />
                </div> */}
            </div>
        </div>
    )
}
