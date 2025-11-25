import React, { useState, useMemo } from 'react';
import styles from './App.module.css';
import ComparisonTabs from './components/ComparisonTabs/ComparisonTabs.jsx';
import SecurityBundles from './components/SecurityBundles/SecurityBundles.jsx';
import LicenseTerms from './components/LicenseTerms/LicenseTerms.jsx';
import SecuritySuiteTable from './components/SecuritySuiteTable/SecuritySuiteTable.jsx';
import WifiSubscriptions from './components/WifiSubscriptions/WifiSubscriptions.jsx';
import RenewalsSection from './components/RenewalsSection/RenewalsSection.jsx';
import SummaryPanel from './components/SummaryPanel/SummaryPanel.jsx';
import { productData } from './components/ComparisonTabs/productData.js';

function App() {
  const [activeCategory, setActiveCategory] = useState('tabletop');
  const [wifiOutdoor, setWifiOutdoor] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState('Standard Support');
  const [selectedTerm, setSelectedTerm] = useState('1 Year');
  const [applianceOnly, setApplianceOnly] = useState(false);
  // Wi-Fi specific states
  const [selectedWifiLicense, setSelectedWifiLicense] = useState('Standard Wi-Fi');

  // Determine if current category is Wi-Fi
  const isWifiCategory = activeCategory === 'wifi6';

  // Find the full product object (with image and description) based on selected product name
  const selectedProductData = useMemo(() => {
    if (!selectedProduct) return null;

    // Search through all categories
    const categories = ['tabletop', 'm-series'];
    for (const cat of categories) {
      const found = productData[cat]?.products.find((p) => p.name === selectedProduct);
      if (found) return found;
    }
    // Check wifi6 indoor/outdoor
    const wifiIndoor = productData.wifi6?.indoor?.products.find((p) => p.name === selectedProduct);
    if (wifiIndoor) return wifiIndoor;
    const wifiOutdoorProd = productData.wifi6?.outdoor?.products.find((p) => p.name === selectedProduct);
    if (wifiOutdoorProd) return wifiOutdoorProd;

    return null;
  }, [selectedProduct]);

  // Determine if selected product is a Wi-Fi product
  const isWifiProduct = useMemo(() => {
    if (!selectedProduct) return false;
    const wifiIndoor = productData.wifi6?.indoor?.products.find((p) => p.name === selectedProduct);
    const wifiOutdoorProd = productData.wifi6?.outdoor?.products.find((p) => p.name === selectedProduct);
    return !!(wifiIndoor || wifiOutdoorProd);
  }, [selectedProduct]);

  // Handler to clear product selection
  const handleClearProduct = () => {
    setSelectedProduct(null);
  };

  // Reset selections when category changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSelectedProduct(null);
    // Reset to default values for the new category
    if (category === 'wifi6') {
      setSelectedWifiLicense('Standard Wi-Fi');
    } else {
      setSelectedService('Standard Support');
    }
    setSelectedTerm('1 Year');
    setApplianceOnly(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>WatchGuard Product Configurator</h1>
        </header>

        <div className={styles.mainLayout}>
          <ComparisonTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            wifiOutdoor={wifiOutdoor}
            onWifiOutdoorChange={setWifiOutdoor}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
          />

          {/* Show different sections based on category */}
          {isWifiCategory ? (
            <>
              <WifiSubscriptions
                selectedWifiLicense={selectedWifiLicense}
                onSelectWifiLicense={setSelectedWifiLicense}
                disabled={applianceOnly}
              />
              <LicenseTerms
                selectedTerm={selectedTerm}
                onSelectTerm={setSelectedTerm}
                disabled={applianceOnly}
              />
            </>
          ) : (
            <>
              <SecurityBundles
                selectedService={selectedService}
                onSelectService={setSelectedService}
                disabled={applianceOnly}
              />
              <LicenseTerms
                selectedTerm={selectedTerm}
                onSelectTerm={setSelectedTerm}
                disabled={applianceOnly}
              />
              <SecuritySuiteTable />
            </>
          )}

          <RenewalsSection />
        </div>

        <SummaryPanel
          selectedProductData={selectedProductData}
          selectedService={selectedService}
          selectedTerm={selectedTerm}
          applianceOnly={applianceOnly}
          onClearProduct={handleClearProduct}
          onSelectService={setSelectedService}
          onSelectTerm={setSelectedTerm}
          onToggleApplianceOnly={setApplianceOnly}
          isWifiProduct={isWifiProduct}
          selectedWifiLicense={selectedWifiLicense}
          onSelectWifiLicense={setSelectedWifiLicense}
        />
      </div>
    </div>
  );
}

export default App;
