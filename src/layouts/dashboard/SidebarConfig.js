import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import fileTextOutline from '@iconify/icons-eva/file-text-outline';
import fileListFill from '@iconify/icons-eva/list-fill';
import shoppingCartOutline from '@iconify/icons-eva/shopping-cart-outline';
import inboxOutline from '@iconify/icons-eva/inbox-outline';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Nfces',
    path: '/dashboard/nfce',
    icon: getIcon(fileListFill)
  },
  {
    title: 'Itens',
    path: '/dashboard/item',
    icon: getIcon(fileTextOutline)
  },
  {
    title: 'Categorias',
    path: '/dashboard/categories',
    icon: getIcon(inboxOutline)
  },
  {
    title: 'Sugestões de compras',
    path: '/dashboard/acquisition',
    icon: getIcon(shoppingCartOutline)
  }
];

export default sidebarConfig;
