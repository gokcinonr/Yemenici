import { Switch, Route, Router } from "wouter";
import HomePage from "./components/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";

function Routes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />

      <Route path="/solutions">
        {() => <PlaceholderPage title="Solutions" subtitle="What We Offer" />}
      </Route>
      <Route path="/solutions/production">
        {() => <PlaceholderPage title="Production" subtitle="Solutions" />}
      </Route>
      <Route path="/solutions/industries">
        {() => <PlaceholderPage title="Industries" subtitle="Solutions" />}
      </Route>
      <Route path="/solutions/industries/automotive">
        {() => <PlaceholderPage title="Automotive" subtitle="Industries" />}
      </Route>
      <Route path="/solutions/industries/industrial">
        {() => <PlaceholderPage title="Industrial" subtitle="Industries" />}
      </Route>
      <Route path="/solutions/industries/agriculture">
        {() => <PlaceholderPage title="Agriculture" subtitle="Industries" />}
      </Route>

      <Route path="/quality">
        {() => <PlaceholderPage title="Quality" subtitle="Our Standards" />}
      </Route>
      <Route path="/quality/certification">
        {() => <PlaceholderPage title="Certification" subtitle="Quality" />}
      </Route>
      <Route path="/quality/laboratory-testing">
        {() => <PlaceholderPage title="Laboratory & Testing" subtitle="Quality" />}
      </Route>

      <Route path="/company">
        {() => <PlaceholderPage title="Company" subtitle="Who We Are" />}
      </Route>
      <Route path="/company/about-us">
        {() => <PlaceholderPage title="About Us" subtitle="Company" />}
      </Route>
      <Route path="/company/our-values">
        {() => <PlaceholderPage title="Our Values" subtitle="Company" />}
      </Route>

      <Route path="/contact">
        {() => <PlaceholderPage title="Contact" subtitle="Get in Touch" />}
      </Route>

      <Route>
        {() => <PlaceholderPage title="Page Not Found" subtitle="404" />}
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <Router base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Routes />
    </Router>
  );
}
