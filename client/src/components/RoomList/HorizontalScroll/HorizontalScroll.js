import { useState } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';

const HorizontalScroll = () => {
    const [selected, setSelected] = useState('All');
    const list = [{ name: 'All' }, { name: 'Animals' }, { name: 'Celebrities' }, { name: 'Films' }, { name: 'LoL' }];

    const MenuItem = ({ text, selected }) => {
        return <div className={`menu-item ${selected ? 'active' : ''}`}>{text}</div>;
    };

    const Menu = (list, selected) =>
        list.map(el => {
            const { name } = el;

            return <MenuItem text={name} key={name} selected={selected} />;
        });

    const Arrow = ({ text, className }) => {
        return <div className={className}>{text}</div>;
    };

    const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
    const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

    const menu = Menu(list, selected);

    const onSelect = key => {
        setSelected(key);
    };

    return (
        <ScrollMenu
            data={menu}
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
            selected={selected}
            onSelect={onSelect}
            translate={-0.1}
            innerWrapperStyle={false}
        />
    );
};

export default HorizontalScroll;
