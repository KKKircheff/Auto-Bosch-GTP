import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
} from '@mui/material';
import { Build as BuildIcon } from '@mui/icons-material';

export const Header: React.FC = () => {
    return (
        <AppBar position="static" color="primary">
            <Container maxWidth="lg">
                <Toolbar>
                    <BuildIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }} textAlign={'center'}>
                        АУТО БОШ ГОДИШНИ ТЕХНИЧЕСКИ ПРЕГЛЕДИ
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
};