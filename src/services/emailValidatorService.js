import dns from 'dns';

// Known disposable or dummy email domains to reject immediately
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'throwawaymail.com',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'yopmail.com',
  'fake.com',
  'test.com',
  'example.com',
  'asdf.com',
  'abc.com',
  'xyz.com',
  'random.com',
  'temp.com',
  'trashmail.com',
]);

// Standard high-reliability email syntax regex (RFC 5322 standard)
const RFC_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const emailValidatorService = {
  /**
   * Verifies if an email has valid syntax, a non-disposable domain,
   * and live configured DNS MX mail exchange records (e.g. with Google, Microsoft, Yahoo, custom MX).
   */
  verifyEmailLive: async (email) => {
    if (!email || typeof email !== 'string') {
      return {
        isValid: false,
        reason: 'Email address is required.',
      };
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Format and length validation
    if (cleanEmail.length > 254) {
      return {
        isValid: false,
        reason: 'Email address exceeds maximum permitted length.',
      };
    }

    if (!RFC_EMAIL_REGEX.test(cleanEmail)) {
      return {
        isValid: false,
        reason: 'Invalid email address structure. Please provide a standard address (e.g. name@domain.com).',
      };
    }

    const [localPart, domain] = cleanEmail.split('@');

    if (!localPart || !domain || localPart.length > 64) {
      return {
        isValid: false,
        reason: 'Invalid email username or domain length.',
      };
    }

    // 2. Reject disposable / test domains
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return {
        isValid: false,
        reason: `The domain "${domain}" is not a supported email provider. Please use a verified provider (e.g. Gmail, Outlook, iCloud, Yahoo, or your official custom domain).`,
      };
    }

    // 3. Check for specific provider syntax rules (e.g. Gmail / Google Workspace)
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
      // Gmail username rules: 6 to 30 characters, alphanumeric and periods
      const gmailUser = localPart.replace(/\./g, '');
      if (gmailUser.length < 6 || gmailUser.length > 30) {
        return {
          isValid: false,
          reason: 'Gmail usernames must be between 6 and 30 characters in length.',
        };
      }
      if (!/^[a-zA-Z0-9]+$/.test(gmailUser)) {
        return {
          isValid: false,
          reason: 'Gmail usernames can only contain letters, numbers, and periods.',
        };
      }
    }

    // 4. DNS MX Records verification with active mail servers
    try {
      const mxRecords = await dns.promises.resolveMx(domain);

      if (!mxRecords || mxRecords.length === 0) {
        return {
          isValid: false,
          reason: `The domain "@${domain}" does not have active mail servers (MX records). Please verify that you typed your email correctly.`,
        };
      }

      // Sort by lowest priority (highest preference)
      mxRecords.sort((a, b) => a.priority - b.priority);
      const primaryExchange = mxRecords[0].exchange;

      const isGoogleHost = primaryExchange.toLowerCase().includes('google') || primaryExchange.toLowerCase().includes('gmail');
      const isMicrosoftHost = primaryExchange.toLowerCase().includes('outlook') || primaryExchange.toLowerCase().includes('microsoft');

      return {
        isValid: true,
        email: cleanEmail,
        domain,
        primaryExchange,
        provider: isGoogleHost ? 'Google Workspace / Gmail' : isMicrosoftHost ? 'Microsoft 365 / Outlook' : 'Verified Mail Server',
      };
    } catch (dnsErr) {
      if (dnsErr.code === 'ENOTFOUND' || dnsErr.code === 'NODATA' || dnsErr.code === 'ESERVFAIL') {
        return {
          isValid: false,
          reason: `The email domain "@${domain}" does not exist or has no active mail servers. Please enter a valid, existing email address.`,
        };
      }

      // If local DNS temporarily fails (e.g. timeout), gracefully verify common domains or reject unknown
      const wellKnownDomains = ['gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
      if (wellKnownDomains.includes(domain)) {
        return {
          isValid: true,
          email: cleanEmail,
          domain,
          provider: 'Standard Mail Provider',
        };
      }

      return {
        isValid: false,
        reason: `Could not verify the email domain "@${domain}". Please check the spelling of your email address.`,
      };
    }
  },
};
