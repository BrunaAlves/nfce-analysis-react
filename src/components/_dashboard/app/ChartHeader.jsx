import { FormControl, Box, Select, MenuItem, Input } from '@material-ui/core';
import { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'inline',
    marginRight: 15,
  },
  fields: {
    display: 'inline',
  },
  combobox: {
    minWidth: 70,
    marginLeft: 5
  }
}));

export default function ChartHeader(props) {
  const classes = useStyles();
  const defautlValue = 'todos'
  const [year, setYear] = useState(props.year ?? 0);
  const [month, setMonth] = useState(props.month ?? 0);
  const [day, setDay] = useState(props.day ?? 0);

  const showDay = props.showDay === false ? false : true;
  const showMonth = props.showMonth === false ? false : true;
  const inline = props.inline === false ? false : true;

  const getYears = () => {
    var years = [{
      text: defautlValue,
      value: 0
    }];
    for(var i=2000; i<=(new Date()).getFullYear(); i++)
      years.push({
        text: i,
        value: i
      });
    return years;
  }

  const getMonths = () => {
    return [{
      text: defautlValue,
      value: 0
    },{
      text: "Jan",
      value: 1
    },{
      text: "Fev",
      value: 2
    },{
      text: "Mar",
      value: 3
    },{
      text: "Abr",
      value: 4
    },{
      text: "Mai",
      value: 5
    },{
      text: "Jun",
      value: 6
    },{
      text: "Jul",
      value: 7
    },{
      text: "Ago",
      value: 8
    },{
      text: "Sep",
      value: 9
    },{
      text: "Out",
      value: 10
    },{
      text: "Nov",
      value: 11
    },{
      text: "Dez",
      value: 12
    },];
  }

  const getDays = () => {
    var days = [{
      text: defautlValue,
      value: 0
    }];
    for(var i=1; i<31; i++)
      days.push({
        text: i,
        value: i
      });
    return days;
  }

  const handleChangeYear = (evt) => {
    setYear(evt.target.value)
    props.onChangeYear?.(evt.target.value)
  }

  const handleChangeMonth = (evt) => {
    setMonth(evt.target.value)
    props.onChangeMonth?.(evt.target.value);
  }

  const handleChangeDay = (evt) => {
    setDay(evt.target.value)
    props.onChangeDay?.(evt.target.value)
  }

  return (
    <>
      <Box className={classes.title}>{props.title}</Box>
      {!inline && <Box></Box>}
      <Box className={classes.fields}>
        {showDay && (<>
            <FormControl>
              <Select
                className={classes.combobox}
                value={day}
                onChange={handleChangeDay}
                input={<Input />}
              >
              {getDays().map(day => 
                <MenuItem key={day.value} value={day.value}>{day.text}</MenuItem>
                )
              }
              </Select>
            </FormControl>
            /
          </>
        )}
        {showMonth && (<>
            <FormControl>
              <Select
                className={classes.combobox}
                value={month}
                onChange={handleChangeMonth}
                input={<Input />}
              >
              {getMonths().map(month => 
                <MenuItem key={month.value} value={month.value}>{month.text}</MenuItem>
                )
              }
              </Select>
            </FormControl>
            /
          </>
        )}
        <FormControl>
          <Select
            className={classes.combobox}
            value={year}
            onChange={handleChangeYear}
            input={<Input />}
          >
          {getYears().map(year => 
            <MenuItem key={year.value} value={year.value}>{year.text}</MenuItem>
            )
          }
          </Select>
        </FormControl>
      </Box>
    </>
  );
}
