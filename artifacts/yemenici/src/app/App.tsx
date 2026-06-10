import { Switch, Route, Router } from "wouter";
import HomePage from "./components/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProductionPage from "./pages/ProductionPage";
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
        {() => <PlaceholderPage title="Automotive" subtitle="Industries" sectionKey="page_solutions_automotive" />}
      </Route>
      <Route path="/solutions/industries/industrial">
        {() => <PlaceholderPage title="Industrial" subtitle="Industries" sectionKey="page_solutions_industrial" />}
      </Route>
      <Route path="/solutions/industries/agriculture">
        {() => <PlaceholderPage title="Agriculture" subtitle="Industries" sectionKey="page_solutions_agriculture" />}
      </Route>

      <Route path="/quality">
        {() => <PlaceholderPage title="Quality" subtitle="Our Standards" sectionKey="page_quality" />}
      </Route>
      <Route path="/quality/certification">
        {() => <PlaceholderPage title="Certification" subtitle="Quality" sectionKey="page_quality_certification" />}
      </Route>
      <Route path="/quality/laboratory-testing">
        {() => <PlaceholderPage title="Laboratory & Testing" subtitle="Quality" sectionKey="page_quality_laboratory" />}
      </Route>

      <Route path="/company">
        {() => <PlaceholderPage title="Company" subtitle="Who We Are" sectionKey="page_company" />}
      </Route>
      <Route path="/company/about-us">
        {() => <PlaceholderPage title="About Us" subtitle="Company" sectionKey="page_company_about" />}
      </Route>
      <Route path="/company/our-values">
        {() => <PlaceholderPage title="Our Values" subtitle="Company" sectionKey="page_company_values" />}
      </Route>

      <Route path="/contact">
        {() => <PlaceholderPage title="Contact" subtitle="Get in Touch" sectionKey="page_contact" />}
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
        </Router>
      </LanguageProvider>
    </SiteGate>
  );
}
