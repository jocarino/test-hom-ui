import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NavigationLabel = {
    Map: { label: "Map", url: "/", icon: <MapIcon /> },
    Posters: { label: "Posters", url: "/posters", icon: <FilterFramesIcon /> },
    Profile: { label: "Profile", url: "/login", icon: <PersonIcon /> },
}

const CustomBottomNavigation = styled(BottomNavigation)`
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
`

const BottomNavigationBar: React.FC = () => {
    const currentPath = window.location.pathname
    const indexOfPath = Object.values(NavigationLabel).map(item=>item.url).indexOf(currentPath)
    const [value, setValue] = useState<number|null>(indexOfPath !== -1 ? indexOfPath: null)
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <CustomBottomNavigation
            className='bottom-navigation-bar'
            showLabels
            value={value}
            onChange={handleChange}
        >
            {Object.values(NavigationLabel).map((item, index) => {
                return (
                    <BottomNavigationAction
                        key={index}
                        label={item.label}
                        value={index}
                        onClick={() => navigate(item.url)}
                        icon={item.icon}
                    />
                );
            })}
        </CustomBottomNavigation>
    );
};

export default BottomNavigationBar;
