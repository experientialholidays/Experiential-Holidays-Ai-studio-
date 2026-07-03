
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        
        // Deny advertising and personalization tracking by default to protect user privacy
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'granted' // Only allow basic, anonymous analytics measurement
        });
        
        gtag('js', new Date());
        gtag('config', 'G-W1N6TNTMJQ', {
            'allow_google_signals': false,          // Disable cross-device demographics matching
            'allow_ad_personalization_signals': false // Explicitly disable personalized advertising data collection
        });
    