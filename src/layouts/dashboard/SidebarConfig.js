import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';

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
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Itens',
    path: '/dashboard/item',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Categorias',
    path: '/dashboard/categories',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Sugestões de compras',
    path: '/dashboard/acquisition',
    icon: getIcon(fileTextFill)
  }
];

export default sidebarConfig;
