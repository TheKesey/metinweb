const { PHASE_PRODUCTION_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = (phase) => {
  // next start fázisban a build már kész, SWC plugin nem kell
  if (phase === PHASE_PRODUCTION_SERVER) {
    return nextConfig;
  }
  const createNextIntlPlugin = require("next-intl/plugin");
  const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
  return withNextIntl(nextConfig);
};
