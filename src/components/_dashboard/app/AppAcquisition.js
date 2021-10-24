import faker from 'faker';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { formatDistance } from 'date-fns';
import ptBrLocale from 'date-fns/locale/pt-BR';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@material-ui/core';
// utils
import { mockImgCover } from '../../../utils/mockImages';
//
import Scrollbar from '../../Scrollbar';

import config from "../../../config.json";
import axios from "axios";
import AuthService from "../../../services/auth.service";
import { useQuery } from 'react-query';
import { useState } from 'react';

// ----------------------------------------------------------------------

const NEWS = [...Array(5)].map((_, index) => {
  const setIndex = index + 1;
  return {
    title: faker.name.title(),
    description: faker.lorem.paragraphs(),
    image: mockImgCover(setIndex),
    postedAt: faker.date.soon()
  };
});

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.object.isRequired
};

function NewsItem({ news }) {
  const { image, name, frequency, nextPurchase } = news;

  var isLate = new Date(nextPurchase) - new Date() < 0;
  return (
    <Stack direction="row" alignItems="center" spacing={3} sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ minWidth: 240 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {frequency}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
          {isLate ? '' : 'em '}
          {formatDistance(new Date(Date.parse(nextPurchase)), new Date(), { locale: ptBrLocale })}
          {isLate ? ' atrás' : ''}
      </Typography>
    </Stack>
  );
}

export default function AppAcquisition() {
  const [state, setState] = useState(null);

  const baseUrl = config.apiBaseUrl;
  const currentUser = AuthService.getCurrentUser();

  const { 
    isLoading: acquisition_isLoading,
    error: acquisition_error,
    data: acquisition_data ,
    refetch: acquisition_refetch
  } = useQuery(['Acquisition'], (args) => {
    return axios.get(`${baseUrl}/acquisition/all`, {
            headers: { Authorization: `Bearer ${currentUser.token}` },
          }).then((r) => {
            var late = r.data.filter((x) => new Date(x.nextPurchase) - new Date() < 0)
            late.sort((a, b) => {
              return new Date(b.nextPurchase) - new Date(a.nextPurchase)
            })

            var notLate = r.data.filter((x) => new Date(x.nextPurchase) - new Date() >= 0)
            notLate.sort((a, b) => {
              return new Date(a.nextPurchase) - new Date(b.nextPurchase)
            })

            return notLate.concat(late);
          });
        }
  )

  return (
    <Card>
      <CardHeader title="Sugestões de compras" />

      <Scrollbar>
      {acquisition_data &&
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {acquisition_data.map((news) => (
            <NewsItem key={news.name} news={news} />
          ))}
        </Stack>
      }
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          to="/dashboard/acquisition"
          size="small"
          color="inherit"
          component={RouterLink}
          endIcon={<Icon icon={arrowIosForwardFill} />}
        >
          Ver mais
        </Button>
      </Box>
    </Card>
  );
}
