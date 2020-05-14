const ENVIRONMENT = 'development_simulator';

const Env = {
  stage: {
    ENVIRONMENT: 'STAGE',
  },
  production: {
    ENVIRONMENT: 'PRODUCTION',
  },
  development_default: {
    ENVIRONMENT: 'DEVELOPMENT',
    BYPASS_NANOLEAF_AUTH: null,
    BYPASS_NANOLEAF_DISCOVERY: null,
  },
  development_home: {
    ENVIRONMENT: 'DEVELOPMENT',
    BYPASS_NANOLEAF_AUTH: null,
    BYPASS_NANOLEAF_DISCOVERY: {
      LOCATION: 'http://192.168.0.2:16021',
      UUID: '6947b7ff-ac3b-4059-8fa1-b395841a7b41',
      AUTH: 'yWPKebfRiVIkUe0u3rizllZ8LHukhs20',
    },
  },
  development_simulator: {
    ENVIRONMENT: 'DEVELOPMENT',
    BYPASS_NANOLEAF_AUTH: null,
    BYPASS_NANOLEAF_DISCOVERY: {
      LOCATION: 'http://localhost:7144',
      UUID: '6947b7ff-ac3b-4059-8fa1-b395841a7b41',
      AUTH: 'SLOwzypbwQDvcYXUxehKtsvcVocFLDGM',
    },
  },
};

export default Env[ENVIRONMENT];
