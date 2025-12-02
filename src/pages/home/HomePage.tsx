import { Box, Stack } from '@mui/material';
import { AnnouncementBanner } from '../../components/common/AnnouncementBanner';
import { HeroSection, ServicesPricingSection, ContactSection } from './sections';

const HomePage = () => {
    return (
        <Box px={0}>
            <AnnouncementBanner position="above-hero" />
            <HeroSection />
            <Stack px={{ xs: 1, md: 4 }} py={12}>
                <ServicesPricingSection />
                <ContactSection />
            </Stack>
        </Box>
    );
};

export default HomePage;
