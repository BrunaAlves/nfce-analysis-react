import { useState} from "react";
import PropTypes from 'prop-types';
// material
import { Card, Typography, CardHeader, CardContent } from '@material-ui/core';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot
} from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { fDateTime } from '../../../utils/formatTime';
import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { useQuery } from 'react-query';

const useStyles = makeStyles((theme) => ({
  orderItem: {
    '&:hover': {
      backgroundColor: '#f1f1f1',
      cursor: "pointer"
    },
  },
  orderItemSelected: {
    backgroundColor: 'rgba(0, 171, 85, 0.08)',
    '&:hover': {
      backgroundColor: '#d8f5e6',
      cursor: "default"
    },
  }
}));

OrderItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool
};

function OrderItem({ item, isLast, onClick, isSelected}) {
  const classes = useStyles();
  const { type, title, time } = item;
  return (
    <TimelineItem className={isSelected ? classes.orderItemSelected : classes.orderItem} onClick={() => {
      onClick?.();
    }}>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              (type === 'Dinheiro' && 'primary.main') ||
              (type === 'Cartão de Crédito' && 'success.main') ||
              (type === 'Outros' && 'info.main') ||
              (type === 'order4' && 'warning.main') ||
              'error.main'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function AppOrderTimeline(props) {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const [nfceId, setNfceId] = useState(null);

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_data ,
    refetch: list_refetch
  } = useQuery('Timeline', () => {
        return axios.get(`${baseUrl}/dashboard/timeline?year=2021`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

  function selectNfceId(nfceId) {
    setNfceId(nfceId);
    props.onSelectNfce?.(nfceId);
  }

  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader title="Order Timeline" />
      <CardContent>
        <Timeline>
          {!list_isLoading && list_data != null &&  
            list_data.map((item, index) => (
              <OrderItem key={item.id} item={item} isLast={index === list_data.length - 1} isSelected={nfceId === item.id} onClick={() => selectNfceId(item.id)}/>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
