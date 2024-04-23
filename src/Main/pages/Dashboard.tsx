import React, { useEffect, useRef, forwardRef, ForwardedRef } from 'react';
import { fetchProjects, projectsSelector } from "../../redux/Slice/projectsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {  Row } from 'antd';

import { Layout, theme } from 'antd';

import Chart from 'chart.js/auto';
import StatChart from '../../Components/StatChart';
import TableChart from '../../Components/TableChart';
import { meSelector } from '../../redux/Slice/meSlice';

const { Content } = Layout;

// interface Props {
//   selectedProjects: any
// }

// const ProjectSummary = forwardRef((props: Props, ref: ForwardedRef<HTMLCanvasElement>) => {
//   return (
//     <Row gutter={16} style={{ alignItems: 'self-start' }}>
//       <Col span={8}>
//         <div style={{ height: 400, display: 'flex', justifyContent: 'center' }}>
//           <canvas ref={ref} id="myDonutChart" width="200" height="200"></canvas>
//         </div>
//       </Col>
//       <Col span={4}>
//         <Card bordered={true} style={{ marginBottom: 15 }}>
//           <Statistic
//             title="Suites"
//             value={props.selectedProjects?.suites.length}
//             valueStyle={{ color: '#FF6384' }}
//           />
//         </Card>
//       </Col>
//       <Col span={4}>
//         <Card bordered={true} style={{ marginBottom: 15 }}>
//           <Statistic
//             title="Tests"
//             value={props.selectedProjects?.tests.length}
//             valueStyle={{ color: '#36A2EB' }}
//           />
//         </Card>
//       </Col>
//       <Col span={4}>
//         <Card bordered={true} style={{ marginBottom: 15 }}>
//           <Statistic
//             title="Steps"
//             value={props.selectedProjects?.steps.length}
//             valueStyle={{ color: '#FFCE56' }}
//           />
//         </Card>
//       </Col>
//       <Col span={4}>
//         <Card bordered={true} style={{ marginBottom: 15 }}>
//           <Statistic
//             title="Objects"
//             value={props.selectedProjects?.resources.length}
//             valueStyle={{ color: '#1300f6' }}
//           />
//         </Card>
//       </Col>
//       {/* <Col span={8} push={8}>
//         <Card bordered={false}>
//           <Statistic
//             title="Active"
//             value={11.28}
//             precision={2}
//             valueStyle={{ color: '#3f8600' }}
//             prefix={<ArrowUpOutlined />}
//             suffix="%"
//           />
//         </Card>
//       </Col>
//       <Col span={8} push={8}>
//         <Card bordered={false}>
//           <Statistic
//             title="Idle"
//             value={9.3}
//             precision={2}
//             valueStyle={{ color: '#cf1322' }}
//             prefix={<ArrowDownOutlined />}
//             suffix="%"
//           />
//         </Card>
//       </Col> */}
//     </Row>
//   )
// });

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"doughnut"> | null>(null);
  const { selectedProjects } = useAppSelector(projectsSelector)
  const { selectedOrgs } = useAppSelector(meSelector)

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  useEffect(() => {
    const labels = [`Suites`, 'Tests', 'Steps', 'Resources'];
    const data = [selectedProjects?.suites.length || 1, selectedProjects?.tests.length || 1, selectedProjects?.steps.length || 1, selectedProjects?.resources.length || 1];
    const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#1300f6'];
    
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            // labels: labels,
            datasets: [{
              data: data,
              backgroundColor: backgroundColors
            }]
          },
          options: {
            layout: {
            },
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: {
                    size: 12,
                    weight: 'bold'
                  },
                  color: '#1300f6',
                  // padding: 13,
                },
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
  useEffect(()=>{
    if (selectedOrgs)
    dispatch(fetchProjects({orgId:selectedOrgs.org.id,searchTerm:''}))
  },[])
  return (
    <Layout style={{ background: colorBgContainer , height:'100%'}}>
      <Content style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        background: '#fff',
        borderRadius: borderRadiusLG,
      }}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 justify-center mx-auto my-2">
          <div className="shadow-2xl shadow-gray-50 dark:shadow-none border border-violet-50 dark:border-blue-850 bg-white dark:bg-blue-750 rounded-md relative">
            <div className="flex justify-center -translate-y-[1px]">
              <div className="w-3/4">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent  w-full">
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center p-8">
              <p className="font-bold mb-2 text-violet-500 dark:text-violet-60 text-2xl md:text-3xl lg:text-4xl">{selectedProjects?.suites.length}</p>
              <p className="mb-0 leading-5 text-sm lg:text-base">Suites</p>
            </div>
          </div>
          <div className="shadow-2xl shadow-gray-50 dark:shadow-none border border-violet-50 dark:border-blue-850 bg-white dark:bg-blue-750 rounded-md relative">
            <div className="flex justify-center -translate-y-[1px]">
              <div className="w-3/4">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent  w-full">
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center p-8">
              <p className="font-bold mb-2 text-cyan-400 text-2xl md:text-3xl lg:text-4xl">{selectedProjects?.tests.length}</p>
              <p className="mb-0 leading-5 text-sm lg:text-base">Test</p>
            </div>
          </div>
          <div className="shadow-2xl shadow-gray-50 dark:shadow-none border border-violet-50 dark:border-blue-850 bg-white dark:bg-blue-750 rounded-md relative">
            <div className="flex justify-center -translate-y-[1px]">
              <div className="w-3/4">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-600 to-transparent  w-full">
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center p-8">
              <p className="font-bold mb-2 text-pink-500 dark:text-pink-540 text-2xl md:text-3xl lg:text-4xl">{selectedProjects?.steps.length}</p>
              <p className="mb-0 leading-5 text-sm lg:text-base">Steps</p>
            </div>
          </div>
          <div className="shadow-2xl shadow-gray-50 dark:shadow-none border border-violet-50 dark:border-blue-850 bg-white dark:bg-blue-750 rounded-md relative">
            <div className="flex justify-center -translate-y-[1px]">
              <div className="w-3/4">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-400 to-transparent  w-full">
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center text-center p-8">
              <p className="font-bold mb-2 text-orange-400 text-2xl md:text-3xl lg:text-4xl">{selectedProjects?.resources.length}</p>
              <p className="mb-0 leading-5 text-sm lg:text-base">Resources</p>
            </div>
          </div>
        </div>
        <Row style={{ marginBottom: 10 }}>
          {selectedProjects?.category_stats.map(s => (s && s.items.length > 0 ? <StatChart stat={s} /> : <></>))}
        </Row>
        <Row>
          {selectedProjects?.items_stats.map(s => (s && s.items.length > 0 ? <TableChart data={s} /> : <></>))}
        </Row>
      </Content>
    </Layout>

  );
};

export default Dashboard;
