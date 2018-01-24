import * as React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

export interface MenuButtonItem {
  name: string;
  key: string;
}

interface MenuButtonProps {
  items: MenuButtonItem[];
  selectedKey: string;
  onSelect: (item: MenuButtonItem) => void;
}

export class MenuButton extends React.Component<MenuButtonProps> {
  render() {
    const selected = _.find(this.props.items, item => item.key === this.props.selectedKey);
    const title = selected ? selected.name : 'Не выбрано';

    return (
      <DropdownButton title={title} id="attributes">
        {
          this.props.items.map(item => {
            return <MenuItem key={item.key} onSelect={() => this.props.onSelect(item)}>{item.name}</MenuItem>;
          })
        }
      </DropdownButton>
    );
  }
}