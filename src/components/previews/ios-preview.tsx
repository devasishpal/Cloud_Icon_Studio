'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { DeviceMockup } from '@/components/previews/device-mockup';
import { cn, paddingStyle, shapeStyle } from '@/lib/utils';

interface IOSPreviewProps {
  className?: string;
}

function BrandSvg({ path, viewBox = '0 0 24 24' }: { path: string; viewBox?: string }) {
  return <svg viewBox={viewBox} className="size-5" fill="white" xmlns="http://www.w3.org/2000/svg"><path d={path} /></svg>;
}

const icons: Record<string, { bg: string; icon: React.ReactNode }> = {
  Clock: { bg: '#1a1a2e', icon: <BrandSvg path="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 2.13c5.444 0 9.87 4.426 9.87 9.87 0 5.444-4.426 9.87-9.87 9.87-5.444 0-9.87-4.426-9.87-9.87 0-5.444 4.426-9.87 9.87-9.87zm-.94 2.256a.94.94 0 00-.941.941v6.941a.94.94 0 00.47.814l5.354 3.092a.94.94 0 001.41-.814.94.94 0 00-.47-.814l-4.413-2.55V5.327a.94.94 0 00-.94-.941z" /> },
  Photos: { bg: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)', icon: <BrandSvg path="M12.678 16.672c0 2.175.002 4.565-.001 6.494-.001.576-.244.814-.817.833-7.045.078-8.927-7.871-4.468-11.334-1.95.016-4.019.007-5.986.007-1.351 0-1.414-.01-1.405-1.351.258-6.583 7.946-8.275 11.323-3.936L11.308.928c-.001-.695.212-.906.906-.925 6.409-.187 9.16 7.308 4.426 11.326l6.131.002c1.097 0 1.241.105 1.228 1.217-.223 6.723-7.802 8.376-11.321 4.124zm.002-15.284l-.003 9.972c6.56-.465 6.598-9.532.003-9.972zm-1.36 21.224l-.001-9.97c-6.927.598-6.29 9.726.002 9.97zM1.4 11.315l9.95.008c-.527-6.829-9.762-6.367-9.95-.008zm11.238 1.365c.682 6.875 9.67 6.284 9.977.01z" /> },
  Maps: { bg: '#34A853', icon: <BrandSvg path="M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 01-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 01.027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0014.67.439l-.009-.003zM9.466 5.868L14.162.285l-.047-.012A8.31 8.31 0 0011.986 0a8.439 8.439 0 00-6.169 2.766l-.016.018 3.665 3.084z" /> },
  Gmail: { bg: '#EA4335', icon: <BrandSvg path="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /> },
  Settings: { bg: '#8E8E93', icon: <BrandSvg path="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2.571a2.571 2.571 0 110 5.143 2.571 2.571 0 010-5.143zm-6 6a2.571 2.571 0 110 5.143 2.571 2.571 0 010-5.143zm12 0a2.571 2.571 0 110 5.143 2.571 2.571 0 010-5.143zM6 17.143A2.571 2.571 0 118.571 12 2.571 2.571 0 016 17.143zm6 2.286a2.571 2.571 0 110 5.143 2.571 2.571 0 010-5.143zm6-2.286A2.571 2.571 0 1120.571 12 2.571 2.571 0 0118 17.143z" /> },
  Chrome: { bg: '#4285F4', icon: <BrandSvg path="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0112 6.545h10.691A12 12 0 0012 0zM1.931 5.47A11.943 11.943 0 000 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 01-6.865-2.29zm13.342 2.166a5.446 5.446 0 011.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 110-8.728 4.364 4.364 0 010 8.728Z" /> },
  Camera: { bg: '#1c1c1e', icon: <BrandSvg path="M12 2.337c-2.657 0-4.801 1.679-5.357 3.93H3.063A3.062 3.062 0 000 9.327v9.293a3.062 3.062 0 003.063 3.062h17.874A3.062 3.062 0 0024 18.62V9.327a3.062 3.062 0 00-3.063-3.06h-3.58C16.801 4.016 14.657 2.337 12 2.337zm0 1.831c1.69 0 3.138.88 3.857 2.163H8.143C8.862 5.048 10.31 4.168 12 4.168zM5.76 7.498h1.08a.51.51 0 01.51.51v1.324a.51.51 0 01-.51.51H5.76a.51.51 0 01-.51-.51V8.008a.51.51 0 01.51-.51zM12 9.328a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 1.831a2.669 2.669 0 100 5.338 2.669 2.669 0 000-5.338z" /> },
  'App Store': { bg: '#007AFF', icon: <BrandSvg path="M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 00-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 00-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 00-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 00.779-.5407A1.5386 1.5386 0 0024 16.452a1.539 1.539 0 00-.3009-.9158Z" /> },
  Calendar: { bg: '#4285F4', icon: <BrandSvg path="M21.333 4h-2.666V1.333a1.333 1.333 0 00-2.667 0V4H8V1.333a1.333 1.333 0 00-2.667 0V4H2.667A2.675 2.675 0 000 6.667v14.666A2.675 2.675 0 002.667 24h18.666A2.675 2.675 0 0024 21.333V6.667A2.675 2.675 0 0021.333 4zm0 17.333H2.667V8h18.666v13.333zM6.667 10.667a1.333 1.333 0 100 2.666 1.333 1.333 0 000-2.666zm5.333 0a1.333 1.333 0 100 2.666 1.333 1.333 0 000-2.666zm-5.333 5.333a1.333 1.333 0 100 2.667 1.333 1.333 0 000-2.667zm5.333 0a1.333 1.333 0 100 2.667 1.333 1.333 0 000-2.667zm5.333-5.333a1.333 1.333 0 100 2.666 1.333 1.333 0 000-2.666zm-5.333 5.333a1.333 1.333 0 100 2.667 1.333 1.333 0 000-2.667z" /> },
  Messages: { bg: '#34C759', icon: <BrandSvg path="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zM4.911 7.089h11.456a2.197 2.197 0 012.165 2.19v5.863a2.213 2.213 0 01-2.177 2.178H8.04c-1.174 0-2.04-.99-2.04-2.178v-4.639L4.503 7.905c-.31-.42-.05-.816.408-.816zm3.415 2.19c-.347 0-.68.21-.68.544 0 .334.333.544.68.544h7.905c.346 0 .68-.21.68-.544 0-.334-.334-.545-.68-.545zm0 2.177c-.347 0-.68.21-.68.544 0 .334.333.544.68.544h7.905c.346 0 .68-.21.68-.544 0-.334-.334-.544-.68-.544zm-.013 2.19c-.346 0-.68.21-.68.544 0 .334.334.544.68.544h5.728c.347 0 .68-.21.68-.544 0-.334-.333-.545-.68-.545z" /> },
  YouTube: { bg: '#FF0000', icon: <BrandSvg path="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
  Drive: { bg: '#FBBC04', icon: <BrandSvg path="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 00-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653l-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 01-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" /> },
  Meet: { bg: '#00897B', icon: <BrandSvg path="M5.53 2.13 0 7.75h5.53zm.398 0v5.62h7.608v3.65l5.47-4.45c-.014-1.22.031-2.25-.025-3.46-.148-1.09-1.287-1.47-2.236-1.36zM23.1 4.32c-.802.295-1.358.995-2.047 1.49-2.506 2.05-4.982 4.12-7.468 6.19 3.025 2.59 6.04 5.18 9.065 7.76 1.218.671 1.428-.814 1.328-1.64v-13a.828.828 0 00-.877-.825zM.038 8.15v7.7h5.53v-7.7zm13.577 8.1H6.008v5.62c3.864-.006 7.737.011 11.58-.009 1.02-.07 1.618-1.12 1.468-2.07v-2.51l-5.47-4.68v3.65zm-13.577 0c.02 1.44-.041 2.88.033 4.31.162.948 1.158 1.43 2.047 1.31h3.464v-5.62z" /> },
  Files: { bg: '#1565C0', icon: <BrandSvg path="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-7 14V6h5v5h5v7H6z" /> },
  Calculator: { bg: '#5C6BC0', icon: <BrandSvg path="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 4h4v3h-4V4zm6 12h-2v2h-2v-2h-2v-2h2v-2h2v2h2v2zm0-8H8V6h8v2zM6 18v-6h2v6H6z" /> },
  Weather: { bg: '#4FC3F7', icon: <BrandSvg path="M12 2a1 1 0 011 1v2a1 1 0 01-2 0V3a1 1 0 011-1zM6.5 5.5a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414L6.5 6.914a1 1 0 010-1.414zM2 11a1 1 0 011-1h2a1 1 0 010 2H3a1 1 0 01-1-1zm2.086 5.5a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 1.414L5.5 16.5a1 1 0 01-1.414 0zM12 20a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zm5.5-2.5a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414a1 1 0 01-1.414 0zM20 12a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1zm-2.086-5.5a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414L17.914 7.5a1 1 0 010-1.414zM12 7a5 5 0 100 10 5 5 0 000-10z" /> },
  Phone: { bg: '#34C759', icon: <BrandSvg path="M6.62 2.44a1.5 1.5 0 012.12 0l1.06 1.06a1.5 1.5 0 010 2.12L8.66 6.76a.5.5 0 00-.08.62c.43.64 1.05 1.39 1.85 2.19.8.8 1.55 1.42 2.19 1.85.21.14.47.1.62-.08l1.14-1.14a1.5 1.5 0 012.12 0l1.06 1.06a1.5 1.5 0 010 2.12l-.61.61c-.55.55-1.28.86-2.04.86-2.1 0-5.07-1.41-7.78-4.12S3.38 6.67 3.38 4.56c0-.76.31-1.49.86-2.04l.61-.61a1.5 1.5 0 011.77-.47z" /> },
  Notes: { bg: '#FFF9C4', icon: <BrandSvg path="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-7 14V6h5v5h5v7H6zm2-8v2h4v-2H8zm0 4v2h4v-2H8z" /> },
  Health: { bg: '#FF2D55', icon: <BrandSvg path="M12 21s9-6.5 9-11.5c0-4-3-6-9-3.5C6 3.5 3 5.5 3 9.5 3 14.5 12 21 12 21z" /> },
  Music: { bg: '#FC3C44', icon: <BrandSvg path="M24 3.545v14.91c0 2.418-1.74 4.383-3.882 4.383-2.143 0-3.883-1.965-3.883-4.383s1.74-4.383 3.883-4.383c.656 0 1.277.181 1.815.49V8.78l-12 2.657v7.017c0 2.419-1.74 4.384-3.883 4.384S3.065 20.873 3.065 18.455s1.74-4.383 3.883-4.383c.656 0 1.277.181 1.815.49V6.538c0-.593.478-1.086 1.07-1.166L22.144 2.38A1.164 1.164 0 0124 3.545z" /> },
  Safari: { bg: '#007AFF', icon: <BrandSvg path="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm0 .953h.006c.063 0 .113.05.113.113v1.842c0 .063-.05.113-.113.113h-.006a.112.112 0 01-.113-.113V1.066c0-.063.05-.113.113-.113zm-.941.041c.056.001.104.046.11.104l.077.918a.112.112 0 01-.101.12h-.01a.11.11 0 01-.12-.1l-.08-.919a.112.112 0 01.102-.12h.01l.012-.003zm1.892 0H12.965a.113.113 0 01.103.121l-.08.92a.111.111 0 01-.12.102h-.009a.111.111 0 01-.101-.121l.078-.92a.112.112 0 01.111-.102zm-2.838.123a.11.11 0 01.106.092l.32 1.818c.01.06-.03.119-.09.13l-.01.001a.111.111 0 01-.128-.09l-.32-1.818a.111.111 0 01.09-.129l.01-.002a.103.103 0 01.022-.002zm3.784.002h.021l.008.002c.061.01.102.07.092.131l-.32 1.814c-.011.062-.07.101-.132.09h-.005a.113.113 0 01-.092-.13l.32-1.815a.111.111 0 01.108-.092zm-4.715.203c.048.002.09.035.103.084l.239.893a.112.112 0 01-.079.139l-.005.001a.114.114 0 01-.14-.08l-.237-.894a.11.11 0 01.078-.137l.006-.002a.123.123 0 01.035-.004zm5.644 0a.11.11 0 01.033.004l.006.002c.06.016.097.079.08.139l-.24.892a.112.112 0 01-.137.08l-.005-.002a.114.114 0 01-.08-.138l.24-.893a.112.112 0 01.103-.084zm-6.562.285a.11.11 0 01.107.073L9 3.42a.107.107 0 01-.064.139l-.012.005a.11.11 0 01-.14-.066L8.15 1.76a.11.11 0 01.065-.14l.014-.005a.106.106 0 01.03-.008zm7.469.002c.014 0 .028.001.042.006l.012.006c.057.02.087.082.067.139l-.633 1.738a.11.11 0 01-.14.066l-.013-.003A.11.11 0 0115 3.42l.633-1.738a.108.108 0 01.096-.073z" /> },
  Stocks: { bg: '#00C853', icon: <BrandSvg path="M3 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 01.44-1.06l5.5-5.5a1.5 1.5 0 012.12 0l3.44 3.44 5.44-5.44a1.5 1.5 0 012.12 2.12l-6.5 6.5a1.5 1.5 0 01-2.12 0L9 13.62l-4.44 4.44A1.5 1.5 0 013 18.5z" /> },
  Wallet: { bg: '#1c1c1e', icon: <BrandSvg path="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H4v-4h4a3 3 0 006 0h6v4zm0-8h-6a3 3 0 01-6 0H4V6h16v4z" /> },
  Reminders: { bg: '#FF9500', icon: <BrandSvg path="M12 2a7 7 0 00-7 7v3l-1 2v2h16v-2l-1-2V9a7 7 0 00-7-7zm0 2a5 5 0 015 5v3l1 2H6l1-2V9a5 5 0 015-5zm-2 16h4a2 2 0 01-4 0z" /> },
  Mail: { bg: '#007AFF', icon: <BrandSvg path="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /> },
};

const iosApps = [
  'Photos', 'App Store', 'Health', 'Music',
  'Safari', 'Notes', '', 'Settings',
  'Mail', 'Calendar', 'Maps', 'Reminders',
  'Clock', 'Wallet', 'Weather', 'Stocks',
];

function IosAppIcon({ name, size = 'size-10', radius = 'rounded-[22%]' }: { name?: string; size?: string; radius?: string }) {
  const app = name ? icons[name] : null;
  if (!app) return null;
  return (
    <div className={`${size} ${radius} flex items-center justify-center shadow-sm`} style={{ background: app.bg }}>
      {app.icon}
    </div>
  );
}

function SpringBoard({ children, wallpaperImage }: { children: React.ReactNode; wallpaperImage?: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative overflow-hidden" style={{
        background: wallpaperImage
          ? `url(${wallpaperImage}) center/cover no-repeat`
          : 'linear-gradient(180deg, #15202B 0%, #192734 50%, #1a1a2e 100%)'
      }}>
        {!wallpaperImage && <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }} />}
        <div className="relative z-10 flex flex-col h-full p-3">
          <div className="text-center pt-6 pb-2">
            <p className="text-[10px] text-white/60 font-medium">9:41</p>
          </div>
          <div className="grid grid-cols-4 gap-2 flex-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                {i === 6 ? children : (
                  <IosAppIcon name={iosApps[i]} />
                )}
                <span className="text-[7px] text-white/50 truncate w-full text-center">
                  {iosApps[i]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 py-2">
            <IosAppIcon name="Phone" />
            <IosAppIcon name="Messages" />
            <IosAppIcon name="Safari" />
            <IosAppIcon name="Music" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function IOSPreview({ className }: IOSPreviewProps) {
  const image = useEditorStore((s) => s.image);
  const padding = useEditorStore((s) => s.padding);
  const rotation = useEditorStore((s) => s.rotation);
  const backgroundColor = useEditorStore((s) => s.backgroundColor);
  const backgroundType = useEditorStore((s) => s.backgroundType);
  const gradientPreset = useEditorStore((s) => s.gradientPreset);
  const previewPrefs = useEditorStore((s) => s.previewPreferences);

  if (!image.dataUrl) return null;
  const src = image.dataUrl;

  const wallpaperImage = previewPrefs.iosWallpaper;
  const shape = previewPrefs.iconShape;
  const deviceStyle = previewPrefs.deviceStyle === 'ipad' ? 'ipad' : 'iphone';
  const iconBg = backgroundType === 'transparent' ? 'transparent'
    : backgroundType === 'gradient' && gradientPreset
      ? `linear-gradient(${gradientPreset.angle}deg, ${gradientPreset.colors[0]}, ${gradientPreset.colors[1]})`
      : backgroundColor;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('space-y-4', className)}
    >
      <DeviceMockup style={deviceStyle} label="Home Screen" dark={previewPrefs.theme === 'dark'}>
        {deviceStyle === 'ipad' ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 relative overflow-hidden" style={{
              background: wallpaperImage
                ? `url(${wallpaperImage}) center/cover no-repeat`
                : 'linear-gradient(180deg, #15202B 0%, #192734 50%, #1a1a2e 100%)'
            }}>
              {!wallpaperImage && <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }} />}
              <div className="relative z-10 flex flex-col h-full p-4">
                <div className="text-center pt-4 pb-2">
                  <p className="text-[10px] text-white/60 font-medium">9:41</p>
                </div>
                <div className="grid grid-cols-5 gap-3 flex-1">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      {i === 7 ? (
                        <div
                          className="size-10 overflow-hidden shadow-sm"
                          style={{ ...shapeStyle(shape), backgroundColor: iconBg }}
                        >
                          <img
                            src={src}
                            alt="iOS icon"
                            className="size-full object-contain"
                            style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }}
                          />
                        </div>
                      ) : (
                        <IosAppIcon name={['Photos', 'App Store', 'Health', 'Music', 'Safari', 'Notes', 'Mail', '', 'Settings', 'Calendar', 'Maps', 'Reminders', 'Clock', 'Wallet', 'Weather', 'Stocks', 'Drive', 'YouTube', 'Calculator', 'Meet'][i]} size="size-10" radius="rounded-[22%]" />
                      )}
                      <span className="text-[7px] text-white/50 truncate w-full text-center">
                        {['Photos', 'App Store', 'Health', 'Music', 'Safari', 'Notes', 'Mail', '', 'Settings', 'Calendar', 'Maps', 'Reminders', 'Clock', 'Wallet', 'Weather', 'Stocks', 'Drive', 'YouTube', 'Calculator', 'Meet'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SpringBoard wallpaperImage={wallpaperImage}>
            <div
              className="size-10 overflow-hidden shadow-sm"
              style={{ ...shapeStyle(shape), backgroundColor: iconBg }}
            >
              <img
                src={src}
                alt="iOS icon"
                className="size-full object-contain"
                style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }}
              />
            </div>
          </SpringBoard>
        )}
      </DeviceMockup>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-lg border border-border/50 bg-card/50 p-3 flex-1 min-w-[120px]">
          <span className="text-[10px] text-muted-foreground">App Store</span>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="size-9 overflow-hidden shadow shrink-0"
              style={{ ...shapeStyle(shape), backgroundColor: iconBg }}
            >
              <img src={src} alt="" className="size-full object-contain" style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium truncate">CloudIcon</p>
              <p className="text-[9px] text-muted-foreground">Design · #1</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card/50 p-3 flex-1 min-w-[120px]">
          <span className="text-[10px] text-muted-foreground">Notification</span>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="size-6 overflow-hidden shrink-0"
              style={{ ...shapeStyle(shape), backgroundColor: iconBg }}
            >
              <img src={src} alt="" className="size-full object-contain" style={{ ...paddingStyle(padding), rotate: `${rotation}deg` }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium truncate">CloudIcon</p>
              <p className="text-[8px] text-muted-foreground">Update available</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
