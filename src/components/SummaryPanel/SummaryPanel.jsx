import React, { useState, useEffect } from 'react';
import styles from './SummaryPanel.module.css';

function SummaryPanel({
  selectedProductData,
  selectedService,
  selectedTerm,
  applianceOnly,
  onClearProduct,
  onSelectService,
  onSelectTerm,
  onToggleApplianceOnly,
  isWifiProduct,
  selectedWifiLicense,
  onSelectWifiLicense,
}) {
  const [open, setOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isHighlighted, setIsHighlighted] = useState(false);

  const fireboxServices = ['Standard Support', 'Basic Security', 'Total Security'];
  const wifiLicenses = ['Standard Wi-Fi', 'USP Wi-Fi'];
  const terms = ['1 Year', '3 Years', '5 Years'];

  // Trigger highlight and notification when configuration changes
  useEffect(() => {
    if (selectedProductData) {
      setIsHighlighted(true);
      setNotificationMessage('Configuration added');
      setShowNotification(true);
      
      const highlightTimer = setTimeout(() => setIsHighlighted(false), 3000);
      const notificationTimer = setTimeout(() => setShowNotification(false), 3000);
      
      return () => {
        clearTimeout(highlightTimer);
        clearTimeout(notificationTimer);
      };
    }
  }, [selectedProductData, selectedService, selectedTerm, selectedWifiLicense, applianceOnly]);

  // Build dynamic CTA text based on selections
  const getCtaText = () => {
    if (!selectedProductData) {
      return 'Select a Product to Continue';
    }
    return 'View Product Page';
  };

  const isCtaDisabled = !selectedProductData;

  return (
    <>
      {/* Overlay when panel is open */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      {/* Fixed toggle button on the right edge */}
      <button
        type="button"
        className={`${styles.floatingToggle} ${isHighlighted ? styles.highlighted : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Toggle configuration summary"
      >
        <span className={styles.gearIcon}>⚙️</span>
        {selectedProductData && <span className={styles.badge}>1</span>}
      </button>

      {/* Notification tooltip */}
      {showNotification && (
        <div className={styles.notification}>
          {notificationMessage}
        </div>
      )}

      {/* Slide-out panel */}
      <aside className={`${styles.drawer} ${open ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>Your Configuration</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        <div className={styles.drawerContent}>
          {/* Product Card */}
          {selectedProductData ? (
            <div className={styles.productCard}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={onClearProduct}
                aria-label="Remove product"
              >
                ✕
              </button>
              <div className={styles.productImageWrap}>
                {selectedProductData.image ? (
                  <img
                    src={selectedProductData.image}
                    alt={selectedProductData.name}
                    className={styles.productImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>📦</div>
                )}
              </div>
              <h3 className={styles.productName}>{selectedProductData.name}</h3>
              <p className={styles.productDesc}>{selectedProductData.description}</p>
            </div>
          ) : (
            <div className={styles.emptyProduct}>
              <div className={styles.emptyIcon}>📦</div>
              <p>No product selected</p>
              <span>Select a device from the comparison table</span>
            </div>
          )}

          {/* Appliance Only Toggle */}
          <div className={styles.optionSection}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={applianceOnly}
                onChange={(e) => onToggleApplianceOnly(e.target.checked)}
                disabled={!selectedProductData}
              />
              <span className={styles.checkboxText}>
                <strong>Buying appliance only</strong>
                <small>Purchase device without security subscription</small>
              </span>
            </label>
          </div>

          {/* Security Service Subscription / Wi-Fi License */}
          <div className={`${styles.optionSection} ${applianceOnly ? styles.disabled : ''}`}>
            <h4>{isWifiProduct ? 'Access Point Management License' : 'Security Service Subscription'}</h4>
            <div className={styles.pillGroup}>
              {isWifiProduct ? (
                wifiLicenses.map((license) => (
                  <button
                    key={license}
                    type="button"
                    className={`${styles.pill} ${selectedWifiLicense === license ? styles.active : ''}`}
                    onClick={() => !applianceOnly && onSelectWifiLicense(license)}
                    disabled={applianceOnly}
                  >
                    {license === 'Standard Wi-Fi' ? 'Standard' : 'USP'}
                  </button>
                ))
              ) : (
                fireboxServices.map((service) => (
                  <button
                    key={service}
                    type="button"
                    className={`${styles.pill} ${selectedService === service ? styles.active : ''}`}
                    onClick={() => !applianceOnly && onSelectService(service)}
                    disabled={applianceOnly}
                  >
                    {service === 'Standard Support' ? 'Standard' : service === 'Basic Security' ? 'Basic' : 'Total Security'}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* License Terms */}
          <div className={`${styles.optionSection} ${applianceOnly ? styles.disabled : ''}`}>
            <h4>License Term</h4>
            <div className={styles.pillGroup}>
              {terms.map((term) => (
                <button
                  key={term}
                  type="button"
                  className={`${styles.pill} ${selectedTerm === term ? styles.active : ''}`}
                  onClick={() => !applianceOnly && onSelectTerm(term)}
                  disabled={applianceOnly}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={`${styles.primaryCta} ${isCtaDisabled ? styles.disabled : ''}`}
            disabled={isCtaDisabled}
          >
            {getCtaText()}
          </button>
          {selectedProductData && (
            <p className={styles.ctaNote}>
              {applianceOnly
                ? 'You\'ll be redirected to the appliance-only product page.'
                : isWifiProduct
                ? 'You\'ll be redirected to the access point product page for this configuration.'
                : 'You\'ll be redirected to the product page for this configuration.'}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}

export default SummaryPanel;
