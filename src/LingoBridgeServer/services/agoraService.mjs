import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { logger } from '../config/logger.mjs';

const APP_ID          = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

/** Token lifetime in seconds (1 hour) */
const TOKEN_EXPIRY_SECONDS = 3600;

if (!APP_ID || !APP_CERTIFICATE) {
  logger.warn('AGORA_APP_ID or AGORA_APP_CERTIFICATE not set — Agora tokens will fail');
}

/**
 * Generate a short-lived Agora RTC token for a channel and user.
 *
 * FIX: acceptHandler.mjs and routes/agora.mjs both import generateAgoraToken.
 * The previous agoraService only exported generateRtcToken → runtime crash.
 * Canonical export is now generateAgoraToken; generateRtcToken is kept as alias.
 *
 * @param {string} channelName
 * @param {number} uid           — 0 = dynamic assignment
 * @param {'publisher'|'subscriber'} role
 * @returns {{ token, appId, channel, uid, expiresAt }}
 */
export function generateAgoraToken(channelName, uid = 0, role = 'publisher') {
  if (!APP_ID || !APP_CERTIFICATE) {
    throw new Error('Agora credentials not configured');
  }

  const rtcRole   = role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
  const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    rtcRole,
    expiresAt,
    expiresAt,
  );

  logger.debug({ channelName, uid, role }, 'Agora RTC token generated');
  return { token, appId: APP_ID, channel: channelName, uid, expiresAt };
}

// Alias for any code still using the old name
export { generateAgoraToken as generateRtcToken };
