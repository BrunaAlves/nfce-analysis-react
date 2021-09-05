import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';


/*
  items: [{
    onClick: () => void,
    title: string,
    icon: ReactElement
  }]
*/
export default function CrudListMenu({items}) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  if(!items)
    return <></>

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {items.map((item, itemIndex) => (
          <MenuItem key={itemIndex} sx={{ color: 'text.secondary' }} onClick={() => {item.onClick?.()}}>
            <ListItemIcon>
              <Icon icon="flashFill" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={item.title} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
