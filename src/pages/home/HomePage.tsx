import { Box, Container } from '@mui/material';
import { AnnouncementBanner } from '../../components/common/AnnouncementBanner';
import { HeroSection, ServicesPricingSection, ContactSection } from './sections';

const HomePage = () => {
    return (
        <Box px={0}>
            <AnnouncementBanner position="above-hero" />
            <HeroSection />
            <Container maxWidth='xl'>
                <ServicesPricingSection />
                <ContactSection />
            </Container>
        </Box>
    );
};

export default HomePage;
