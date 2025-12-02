import { Box, Typography } from '@mui/material';
import { CONTACT_INFO } from '../../../utils/constants';

export const ContactSection = () => {
    return (
        <Box textAlign="center" pb={4}>
            <Typography variant="h4" component="h2" gutterBottom>
                Контакти
            </Typography>
            <Typography
                variant="body1"
                mb={1}
                onClick={() => window.open('https://maps.app.goo.gl/g15n75P7BaCqae3u7', '_blank', 'noopener,noreferrer')}
                sx={{
                    cursor: 'pointer',
                }}
            >
                📍 {CONTACT_INFO.address}
            </Typography>
            <Typography
                variant="body1"
                mb={1}
                onClick={() => window.open(`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`)}
            >
                📞 {CONTACT_INFO.phone}
            </Typography>
            <Typography variant="body1">
                ✉️ {CONTACT_INFO.email}
            </Typography>
        </Box>
    );
};
