import faker from 'faker';
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
// utils
import { fDateTime } from '../../../utils/formatTime';
import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { useQuery } from 'react-query';

// ----------------------------------------------------------------------


OrderItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool
};

function OrderItem({ item, isLast }) {
  const { type, title, time } = item;
  return (
    <TimelineItem>
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

export default function AppOrderTimeline() {
  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: list_isLoading,
    error: list_error,
    data: list_data ,
    refetch: list_refetch
  } = useQuery('Timeline', () => {
        return axios.get(`${baseUrl}/dashboard/timeline?userId=${currentUser.id}&year=2021`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => r.data);
        }
  )

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
              <OrderItem key={item.title} item={item} isLast={index === list_data.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
