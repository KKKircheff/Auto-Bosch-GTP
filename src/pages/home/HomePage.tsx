import { Container } from '@mui/material';
import { AnnouncementBanner } from '../../components/common/AnnouncementBanner';
import { HeroSection, ServicesPricingSection, ContactSection } from './sections';

const HomePage = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <AnnouncementBanner position="above-hero" />
            <HeroSection />
            <ServicesPricingSection />
            <AnnouncementBanner position="below-hero" />
            <ContactSection />
        </Container>
    );
};

export default HomePage;
