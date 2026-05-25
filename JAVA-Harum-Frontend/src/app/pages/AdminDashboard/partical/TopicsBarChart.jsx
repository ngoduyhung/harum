import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label
} from 'recharts';
import { getPostsByAllTopics } from '../AdminDashboardService'; 
const CustomizedAxisTick = ({ x, y, payload }) => {
  const tickWidth = 90; 
  
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-tickWidth / 2} y={5} width={tickWidth} height={65}>
        <div 
          xmlns="http://www.w3.org/1999/xhtml" 
          className="h-full flex items-center justify-center"
        >
          <span 
            className="text-xs text-gray-500 leading-tight" 
            style={{ 
              display: 'block', 
              wordWrap: 'break-word', 
              textAlign: 'center' 
            }}
          >
            {payload.value}
          </span>
        </div>
      </foreignObject>
    </g>
  );
};


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
            <p className="font-semibold text-gray-800">{`Chủ đề: ${label}`}</p>
            <p className="font-bold text-pblue">{`${payload[0].value} bài viết`}</p>
          </div>
        );
      }
      return null;
};

const TopicsBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const results = await getPostsByAllTopics({ signal: controller.signal });
        setData(results);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 20}}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.9}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              tickLine={false}
              axisLine={false}
              tick={<CustomizedAxisTick />}
              dataKey="name" 
              height={80}
              interval={0} 
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            >
              <Label 
                value="Số bài viết" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle', fill: '#4b5563', fontSize: 14 }}
              />
            </YAxis>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#e0f2fe' }}
            />
            <Bar 
              dataKey="count" 
              stackId="a" 
              fill="#eef2ff" 
              radius={[4, 4, 0, 0]} 
              isAnimationActive={false}
            />
            <Bar
              dataKey="count"
              stackId="a"
              fill="#00b4d8"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              activeBar={{ fill: '#00b4d8', stroke: '#00b4d8', strokeWidth: 1 }}
            />
          </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default TopicsBarChart;