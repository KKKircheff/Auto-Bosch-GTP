import { Box, Container, Typography, Divider } from '@mui/material';
import { TEXTS, CONTACT_INFO } from '../../utils/constants';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'grey.100',
                py: 3,
                mt: 'auto',
                borderTop: 1,
                borderColor: 'grey.300'
            }}
        >
            <Container maxWidth="lg">
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                    gap={2}
                >
                    {/* Company Info */}
                    <Box textAlign={{ xs: 'center', md: 'left' }}>
                        <Typography variant="h6" gutterBottom>
                            {TEXTS.siteName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {TEXTS.siteTagline}
                        </Typography>
                    </Box>

                    {/* Contact Info */}
                    <Box textAlign={{ xs: 'center', md: 'right' }}>
                        <Typography variant="subtitle2" gutterBottom>
                            {TEXTS.contact}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {CONTACT_INFO.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {CONTACT_INFO.phone}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {CONTACT_INFO.email}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary" textAlign="center">
                    © {new Date().getFullYear()} {TEXTS.siteName}. Всички права запазени.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;