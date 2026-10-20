export interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

export interface MenuItemProps {
    title: string;
    icon: string;
    onPress: () => void;
}