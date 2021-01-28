import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import axios from "axios";

const USER_READ_DATA = "http://localhost:4000/readings?page[size]=0"


export default function Chart() {
  const theme = useTheme();
  // set fetching data
  const [fetching, setFetching] = React.useState(false);
  const [graphData, setGraphData] = React.useState(null)
  const [firstLoad, setFirstLoad] = React.useState(true)
  React.useEffect(() => {
  // fetch data reading.db data through api
    const fetchData = async () => {
      try {
        setFetching(true)
        const response = await axios.get(USER_READ_DATA, { headers: { 'Access-Control-Allow-Origin': '*' } })
        const tempResponseVal = response.data
        const timeVal = stripDateTime(response.data);
        const readingVal = getReadings(response.data)
        let tempGraphData = []
        for(let i=0;i<tempResponseVal.data.length;i++){
          let tempData = createData(readingVal[i],timeVal[i])
          tempGraphData.push(tempData)
        }
        setGraphData(tempGraphData)
        setFetching(false)
        setFirstLoad(false)

      } catch (e) {
        console.log(e);
        setGraphData(graphData)
        setFetching(false)
      }
    }

    if(firstLoad){
      setTimeout(fetchData, 1000);
    }else{
      //update chart after every 2 minute
      setInterval(fetchData, 20000);
    }

  }, [firstLoad])

const createData = (reading, minute) => {
  return { reading, minute };
}
  
  const stripDateTime = (responseData) => {    
    let tempMinuteVal = []
    for (let timeStr in responseData.data) {
      let stripTimeval = responseData.data[timeStr].attributes.time
      let result = stripTimeval.split(" ")
      result.map((key, val) => {        
        let newSplitValue = []
        if(val === 3){
          newSplitValue = key.split(":") 
          tempMinuteVal.push(newSplitValue[1])    
        }
      })
    }
    return tempMinuteVal
  } 
  
const getReadings = (responseData) =>{
let tempReadingVal =[]
for (let timeStr in responseData.data) {
  tempReadingVal.push(Number(responseData.data[timeStr].attributes.reading))
}
  return tempReadingVal
}

  return (
    <React.Fragment>
      <Title>Line Chart</Title>
      
      <ResponsiveContainer>
        <LineChart
          data={graphData}
          margin={{
            top: 30,
            right: 16,
            bottom: 0,
            left: 24,
          }}
          width={100}
          height={500}
        >
    
          <XAxis dataKey="minute" stroke={theme.palette.text.secondary} style={{marginBottm:'10px'}}>
          <Label
              
              position="Right"
              id="axisLabel"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary,marginTop:'10px'}}
            >
              Time(Minutes)
            </Label>
            </XAxis>
          <YAxis stroke={theme.palette.text.secondary} >
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Readings
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="minute" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}