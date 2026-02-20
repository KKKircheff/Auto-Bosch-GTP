import { Box, Typography, Skeleton, Grid, Stack } from '@mui/material';
import { CONTACT_INFO, shadow1 } from '../../../utils/constants';
import { useBusinessSettings } from '../../../hooks/useBusinessSettings';
import SectionTitle from '../../../components/common/typography/SectionTitle.component';

const MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2940.3777396844653!2d27.4373567!3d42.52603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a69300779a0417%3A0x995ba0f3243eb053!2z0JPQvtC00LjRiNC90Lgg0KLQtdGF0L3QuNGH0LXRgdC60Lgg0J_RgNC10LPQu9C10LTQuCBBVVRPIEJPU0NIIEdUUA!5e0!3m2!1sen!2snl!4v1771585587238!5m2!1sen!2snl";

export const ContactSection = () => {
    const { settings, loading } = useBusinessSettings();

    // Use Firebase settings if available, otherwise fallback to constants
    const contact = settings?.contact || CONTACT_INFO;

    return (
        <Box id="contact-section" py={4}>
            <SectionTitle>
                Контакти и местопложение
            </SectionTitle>

            <Grid container spacing={{ xs: 4, md: 4 }} maxWidth={'xl'} mx='auto'>
                {/* LEFT COLUMN: Map */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {loading ? (
                        <Skeleton
                            variant="rectangular"
                            width="100%"

                            sx={{
                                borderRadius: 3,
                                height: { xs: 400, md: 700 }
                            }}
                        />
                    ) : (
                        <Box
                            component="iframe"
                            src={MAPS_EMBED_URL}
                            sx={{
                                width: '100%',
                                height: { xs: '400px', md: '100%' },
                                minHeight: { md: '500px' },
                                border: 0,
                                borderRadius: 1,
                                boxShadow: shadow1,
                            }}
                            title="Auto Bosch GTP Location - Burgas"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    )}
                </Grid>

                <Grid size={{ xs: 12, md: 3 }} bgcolor={'info.dark'} borderRadius={1} >
                    <Stack
                        justifyContent="center"
                        spacing={3}
                        height="100%"
                        px={{ xs: 0, md: 4 }}
                        py={{ xs: 4 }}
                        textAlign={{ xs: 'center', md: 'center' }}
                    >
                        {loading ? (
                            <>
                                <Skeleton variant="text" width={300} sx={{ mx: { xs: 'auto', md: 0 } }} />
                                <Skeleton variant="text" width={250} sx={{ mx: { xs: 'auto', md: 0 } }} />
                                <Skeleton variant="text" width={280} sx={{ mx: { xs: 'auto', md: 0 } }} />
                            </>
                        ) : (
                            <>
                                {/* Address */}
                                <Box>
                                    <Typography variant="subtitle2" color="info.contrastText" gutterBottom>
                                        Адрес
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="info.contrastText"
                                        onClick={() => window.open('https://maps.app.goo.gl/FP9hJ9nogriGGwFT7', '_blank', 'noopener,noreferrer')}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { color: 'info.contrastText' },
                                        }}
                                    >
                                        📍 {contact.address}
                                    </Typography>
                                </Box>

                                {/* Phone */}
                                <Box>
                                    <Typography variant="subtitle2" color="info.contrastText" gutterBottom>
                                        Телефон
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="info.contrastText"
                                        onClick={() => window.open(`tel:${contact.phone.replace(/\s+/g, '')}`)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { color: 'info.contrastText' },
                                        }}
                                    >
                                        📞 {contact.phone}
                                    </Typography>
                                </Box>

                                {/* Email */}
                                <Box>
                                    <Typography variant="subtitle2" color="info.contrastText" gutterBottom>
                                        Имейл
                                    </Typography>
                                    <Typography variant="body1" color="info.contrastText">
                                        ✉️ {contact.email}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};
