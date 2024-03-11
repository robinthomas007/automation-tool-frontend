import { Card, Col, Layout, Row, Statistic, theme } from "antd";
import { CategoryStat } from "../redux/Slice/projectsSlice";
import { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import { Chart } from "chart.js";
type Props = {
  stat: CategoryStat
}

export default function StatChart({ stat }: { stat: CategoryStat }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<"doughnut"> | null>(null);
  // const labels = stat.items.map(i => i.name);
  const data = stat.items.map(i => i.value)
  const backgroundColors = stat.items.map(i => i.color);
  const ChartSummary = forwardRef((props: Props, ref: ForwardedRef<HTMLCanvasElement>) => {
    return (
      <Row gutter={16}>
        <Col span={23}>
          <Card bordered={true} title={props.stat.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                <canvas ref={ref} id="myDonutChart" width="200" height="200"></canvas>
              </div>
              <div>
                {props.stat.items.map(i => (
                  <div style={{ display: 'flex', margin: 10 }}>
                    <span style={{ fontWeight: 'bold', color: '#fff', width: 20, background: i.color, display: 'inline-block', textAlign: 'center' }}>{i.value}</span>
                    <span style={{ marginLeft: 10 }}>{i.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    )
  });
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: data,
              backgroundColor: backgroundColors
            }]
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: {
                    family: 'Arial',
                    size: 14,
                    weight: 'bold'
                  },
                  color: 'blue',
                  padding: 15,
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
  }, [stat])

  return (
    <Col span={8}>
      <div className="">
        <ChartSummary ref={chartRef} stat={stat} />
      </div>
    </Col>
  );
}