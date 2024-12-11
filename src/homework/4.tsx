import React, { createContext, useMemo, useState, useContext } from 'react';
import noop from 'lodash/noop';

type MenuIds = 'first' | 'second' | 'last';
type Menu = { id: MenuIds; title: string };

// Тип для SelectedMenu
type SelectedMenu = { id?: MenuIds };

// Тип для MenuSelected
type MenuSelected = {
    selectedMenu: SelectedMenu;
};

// Тип для MenuAction
type MenuAction = {
    onSelectedMenu: (menu: SelectedMenu) => void;
};

type PropsProvider = {
    children: React.ReactNode;
};

const MenuSelectedContext = createContext<MenuSelected>({
    selectedMenu: {},
});

const MenuActionContext = createContext<MenuAction>({
    onSelectedMenu: noop,
});

// Тип для PropsProvider

function MenuProvider({ children }: PropsProvider) {
    // Додати тип для SelectedMenu він повинен містити { id }
    const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({});

    const menuContextAction = useMemo(
        () => ({
            onSelectedMenu: setSelectedMenu,
        }),
        []
    );

    const menuContextSelected = useMemo(
        () => ({
            selectedMenu,
        }),
        [selectedMenu]
    );

    return (
        <MenuActionContext.Provider value={menuContextAction}>
            <MenuSelectedContext.Provider value={menuContextSelected}>
                {children}
            </MenuSelectedContext.Provider>
        </MenuActionContext.Provider>
    );
}

type PropsMenu = {
    menus: Menu[];
};

function MenuComponent({ menus }: PropsMenu) {
    const { onSelectedMenu } = useContext(MenuActionContext);
    const { selectedMenu } = useContext(MenuSelectedContext);

    return (
        <>
            {menus.map((menu) => (
                <div
                    key={menu.id}
                    onClick={() => onSelectedMenu({ id: menu.id })}
                >
                    {menu.title}{' '}
                    {selectedMenu.id === menu.id ? 'Selected' : 'Not selected'}
                </div>
            ))}
        </>
    );
}

export function ComponentApp() {
    const menus: Menu[] = [
        {
            id: 'first',
            title: 'first',
        },
        {
            id: 'second',
            title: 'second',
        },
        {
            id: 'last',
            title: 'last',
        },
    ];

    return (
        <MenuProvider>
            <MenuComponent menus={menus} />
        </MenuProvider>
    );
}
