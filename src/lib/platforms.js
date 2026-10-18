// Plattformen, ihr Freischalt-Level und die Formate für Kanal und Beitrag.
export const PLATFORMS = [
  {
    key: 'tiktok',
    label: 'TikTok',
    unlockLevel: 0,
    channelField: 'tiktok_url',
    channelPlaceholder: 'https://www.tiktok.com/@yourname',
    channelPattern: /^https:\/\/(www\.)?tiktok\.com\/@[\w.]+\/?$/,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    unlockLevel: 5,
    channelField: 'instagram_url',
    channelPlaceholder: 'https://www.instagram.com/yourname',
    channelPattern: /^https:\/\/(www\.)?instagram\.com\/[\w.]+\/?$/,
    postPattern: /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[\w-]+/,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    unlockLevel: 10,
    channelField: 'youtube_url',
    channelPlaceholder: 'https://www.youtube.com/@yourname',
    channelPattern: /^https:\/\/(www\.)?youtube\.com\/(@[\w.-]+|channel\/[\w-]+)\/?$/,
    postPattern: /^https:\/\/(www\.)?(youtube\.com\/shorts\/[\w-]+|youtube\.com\/watch\?v=[\w-]+|youtu\.be\/[\w-]+)/,
  },
];

export const platformByKey = (key) => PLATFORMS.find((p) => p.key === key);

export const isValidChannel = (platform, url) => platform.channelPattern.test(url.trim());
