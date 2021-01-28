import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import axios from "axios";



const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Orders() {
  const classes = useStyles();
  const [fetching, setFetching] = React.useState(false);
  const [data, setData] = React.useState()
  const [dataSize, setDataPageSize] = React.useState(10)

  function preventDefault(event) {
    event.preventDefault();
    let tempData = dataSize
    tempData = tempData + 10
    setDataPageSize(tempData)
  }

  const createData = (id,reading, time, sensorType) => {
    return { id,reading, time, sensorType };
  }
    
  const USER_READ_DATA = `http://localhost:4000/readings?page[size]=${dataSize}`
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true)
        console.log("data page size",dataSize)
        const response = await axios.get(USER_READ_DATA, { headers: { 'Access-Control-Allow-Origin': '*' } })     
        console.log("response Data", response.data)
        const tempResponseVal = response.data
        const timeVal = getTime(response.data);
     
        const readingVal = getReadings(response.data)
        const sensorVal = getSensor(response.data)
        const idVal = getId(response.data)
        let tempGraphData = []
        console.log("create",response.data.length)
        for(let i=0;i<tempResponseVal.data.length;i++){
          let tempData = createData(idVal[i],readingVal[i],timeVal[i],sensorVal[i])
          tempGraphData.push(tempData)
        }   
        setData(tempGraphData)
        setFetching(false)
      } catch (e) {
        console.log(e);
        setData(data)
        setFetching(false)
      }
    }
  fetchData()
  }, [dataSize])
  console.log("DATA",data)

  const getReadings = (responseData) =>{
    let tempReadingVal =[]
    for (let timeStr in responseData.data) {
      tempReadingVal.push(Number(responseData.data[timeStr].attributes.reading))
    }
      return tempReadingVal
    }

    const getTime = (responseData) =>{
      let tempReadingVal =[]
      for (let timeStr in responseData.data) {
        tempReadingVal.push(responseData.data[timeStr].attributes.time)
      }
        return tempReadingVal
      }

      const getSensor = (responseData) =>{
        let tempReadingVal =[]
        for (let timeStr in responseData.data) {
          tempReadingVal.push(responseData.data[timeStr].attributes.sensor_type)
        }
          return tempReadingVal
        }
        const getId = (responseData) =>{
          let tempReadingVal =[]
          for (let timeStr in responseData.data) {
            tempReadingVal.push(responseData.data[timeStr].id)
          }
            return tempReadingVal
          }

  return (
    <React.Fragment>
      <Title>Entries</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
          <TableCell>ID</TableCell>
            <TableCell>Reading</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Sensor type</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
         
          { data ==null ? "" :data.map((row) => (
            <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
              <TableCell>{row.reading}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.sensorType}</TableCell>             
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more
        </Link>
      </div>
    </React.Fragment>
  );
}