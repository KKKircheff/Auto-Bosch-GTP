import { Box, Typography, Skeleton } from '@mui/material';
import { CONTACT_INFO } from '../../../utils/constants';
import { useBusinessSettings } from '../../../hooks/useBusinessSettings';

export const ContactSection = () => {
    const { settings, loading } = useBusinessSettings();

    // Use Firebase settings if available, otherwise fallback to constants
    const contact = settings?.contact || CONTACT_INFO;

    return (
        <Box id="contact-section" textAlign="center" pb={4}>
            <Typography variant="h4" component="h2" gutterBottom>
                Контакти
            </Typography>
            {loading ? (
                <>
                    <Skeleton variant="text" width={300} sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton variant="text" width={250} sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton variant="text" width={280} sx={{ mx: 'auto' }} />
                </>
            ) : (
                <>
                    <Typography
                        variant="body1"
                        mb={1}
                        onClick={() => window.open('https://maps.app.goo.gl/g15n75P7BaCqae3u7', '_blank', 'noopener,noreferrer')}
                        sx={{
                            cursor: 'pointer',
                        }}
                    >
                        📍 {contact.address}
                    </Typography>
                    <Typography
                        variant="body1"
                        mb={1}
                        onClick={() => window.open(`tel:${contact.phone.replace(/\s+/g, '')}`)}
                        sx={{
                            cursor: 'pointer',
                        }}
                    >
                        📞 {contact.phone}
                    </Typography>
                    <Typography variant="body1">
                        ✉️ {contact.email}
                    </Typography>
                </>
            )}
        </Box>
    );
};
