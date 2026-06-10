import { Switch, Route, Router } from "wouter";
import HomePage from "./components/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProductionPage from "./pages/ProductionPage";
import IndustryDetailPage from "./pages/IndustryDetailPage";
import QualityPage from "./pages/QualityPage";
import CertificationPage from "./pages/CertificationPage";
import LaboratoryPage from "./pages/LaboratoryPage";
import AboutUsPage from "./pages/AboutUsPage";
import OurValuesPage from "./pages/OurValuesPage";
import ContactPage from "./pages/ContactPage";
import LegalPage from "./pages/LegalPage";
import CookieBanner from "./components/CookieBanner";
import SiteGate from "./components/SiteGate";
import { LanguageProvider } from "./contexts/LanguageContext";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />

      <Route path="/solutions">
        {() => <PlaceholderPage title="Solutions" subtitle="What We Offer" sectionKey="page_solutions" />}
      </Route>
      <Route path="/solutions/production">
        {() => <ProductionPage sectionKey="page_solutions_production" />}
      </Route>
      <Route path="/solutions/industries">
        {() => <PlaceholderPage title="Industries" subtitle="Solutions" sectionKey="page_solutions_industries" />}
      </Route>
      <Route path="/solutions/industries/automotive">
        {() => <IndustryDetailPage sectionKey="page_solutions_automotive" />}
      </Route>
      <Route path="/solutions/industries/industrial">
        {() => <IndustryDetailPage sectionKey="page_solutions_industrial" />}
      </Route>
      <Route path="/solutions/industries/agriculture">
        {() => <IndustryDetailPage sectionKey="page_solutions_agriculture" />}
      </Route>

      <Route path="/quality">
        {() => <QualityPage />}
      </Route>
      <Route path="/quality/certification">
        {() => <CertificationPage />}
      </Route>
      <Route path="/quality/laboratory-testing">
        {() => <LaboratoryPage />}
      </Route>

      <Route path="/company">
        {() => <PlaceholderPage title="Company" subtitle="Who We Are" sectionKey="page_company" />}
      </Route>
      <Route path="/company/about-us">
        {() => <AboutUsPage />}
      </Route>
      <Route path="/company/our-values">
        {() => <OurValuesPage />}
      </Route>

      <Route path="/contact">
        {() => <ContactPage />}
      </Route>

      <Route path="/terms-conditions">
        {() => <LegalPage pageSection="legal_terms" />}
      </Route>
      <Route path="/privacy-policy">
        {() => <LegalPage pageSection="legal_privacy" />}
      </Route>

      <Route>
        {() => <PlaceholderPage title="Page Not Found" subtitle="404" />}
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <SiteGate>
      <LanguageProvider>
        <Router base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Routes />
          <CookieBanner />
        </Router>
      </LanguageProvider>
    </SiteGate>
  );
}
